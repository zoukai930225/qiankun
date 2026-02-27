<template>
  <div @paste="handlePaste" class="upload-container" :style="{ width: formattedWidth }">
    <el-upload
      v-if="isShowUpload"
      ref="uploadRef"
      class="upload-wrapper"
      :action="uploadImgUrl"
      :headers="uploadHeaders"
      :show-file-list="false"
      :file-list="fileList"
      :class="uploadClass"
      :drag="isDrag"
      :disabled="disabled"
      :data="uploadData"
      :limit="limit"
      :multiple="multiple"
      :before-upload="beforeUpload"
      :on-success="onSuccess"
      :on-change="onChange"
      :on-error="onError"
      :on-exceed="onExceed"
      :http-request="onHttpRequest"
      name="files"
      :accept="accept"
    >
      <template #default>
        <div v-if="!isBtn" class="upload-dropzone" @click.stop.prevent="selectFile">
          <img src="@/assets/svgs/uploadIcon.svg" alt="upload" />
          <div>选中复制粘贴(仅支持图片)或文件拖拽</div>
          <div v-if="!isHiddenFile" class="upload-button">选择文件</div>
        </div>
        <el-button v-else type="primary" icon="plus">点击上传</el-button>
      </template>
      <template #tip>
        <span class="upload-tip-text">{{ tip }}</span>
      </template>
    </el-upload>

    <el-scrollbar v-if="fileList.length > 0 && isFileShow" :max-height="height" always>
      <div class="file-list" :class="{ 'file-list--disabled': disabled }">
        <div v-for="file in fileList" :key="file.uid" class="file-item">
          <div class="file-item__icon">
            <el-image
              v-if="isImageFile(file)"
              class="file-thumbnail"
              :src="getFileUrl(file)"
              :preview-src-list="[getFileUrl(file)]"
              fit="cover"
              preview-teleported
            />
            <el-image
              v-else-if="isVideoFile(file)"
              class="file-thumbnail"
              :src="videoIcon"
              fit="cover"
              @click="openFile(getFileUrl(file))"
            />
            <el-image
              v-else
              class="file-thumbnail"
              :src="getFileIcon(file)"
              fit="cover"
              @click="openFile(getFileUrl(file))"
            />
          </div>

          <div v-if="showFileName" class="file-item__info">
            <span class="file-item__name" :title="getFileName(file)">
              {{ getFileName(file) }}
            </span>
            <span v-if="showTime" class="file-item__time">
              {{ getFileTime(file) }}
            </span>
          </div>

          <el-icon
            v-if="!disabled"
            class="file-item__delete"
            size="16"
            @click.stop.prevent="removeFile(file)"
          >
            <Delete />
          </el-icon>
        </div>
      </div>
    </el-scrollbar>

    <div v-if="!fileList.length && isFileShow && disabled" class="flex items-center gap-10px">
      <el-image class="empty-state-image" :src="defaultImg" fit="cover" />
      <span class="empty-state-text">暂无内容</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import excelSvg from '@/assets/svgs/common/file_excel.svg'
import docSvg from '@/assets/svgs/common/file_doc.svg'
import pdfSvg from '@/assets/svgs/common/file_pdf.svg'
import pptSvg from '@/assets/svgs/common/file_ppt.svg'
import txtSvg from '@/assets/svgs/common/file_txt.svg'
import defaultImg from '@/assets/svgs/common/upload_empty.svg'
import videoIcon from '@/assets/svgs/videoIcon.svg'
import zipIcon from '@/assets/svgs/common/zip.svg'
import fileIcon from '@/assets/svgs/common/file.svg'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { getAccessToken } from '@/utils/auth'
import { ElLoading } from 'element-plus'
import type { UploadUserFile } from 'element-plus'
import type { PropType } from 'vue'
import type { UploadRequestOptions } from 'element-plus/es/components/upload/src/upload'
import { deleteOssBatch } from '@/api/common/upload'
import eventBus from '@/utils/eventBus'
import { useFormItem } from 'element-plus'
import dayjs from 'dayjs'

// ==================== Props & Emits ====================
const props = defineProps({
  disabled: { type: Boolean, default: false },
  acceptType: {
    type: [String, Array] as PropType<
      | 'image'
      | 'video'
      | 'audio'
      | 'doc'
      | 'excel'
      | 'ppt'
      | 'pdf'
      | 'txt'
      | 'all'
      | ('image' | 'video' | 'audio' | 'doc' | 'excel' | 'ppt' | 'pdf' | 'txt')[]
    >,
    default: 'image'
  },
  uploadData: { type: Object, default: () => ({ code: 'CUSTOMER_WAREWARE_DOCKET' }) },
  limit: { type: Number, default: Infinity },
  tip: { type: String, default: '文件大小不超过20M' },
  width: { type: [Number, String], default: '100%' },
  height: { type: Number, default: 250 },
  isBtn: { type: Boolean, default: false },
  isDrag: { type: Boolean, default: true },
  multiple: { type: Boolean, default: false },
  isFileShow: { type: Boolean, default: true },
  isHiddenFile: { type: Boolean, default: false },
  showFileName: { type: Boolean, default: true },
  valueType: { type: String as PropType<'string' | 'array'>, default: 'string' },
  showTime: { type: Boolean, default: false },
  isJoint: { type: Boolean, default: true }
})

const emit = defineEmits(['change', 'del', 'success', 'uploadSuccess'])

const { formItem } = useFormItem()
const message = useMessage()
const dataValue: any = defineModel()

// ==================== 类型定义 ====================
interface UploadResponsePayload {
  code: number
  data: Array<{ fileUrl: string; fileName: string; createdAt?: string }>
}

type FileItem = UploadUserFile & {
  uid: number
  response?: UploadResponsePayload
  createdAt?: string
}

type QueuedUploadOption = UploadRequestOptions & {
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}

// ==================== 常量定义 ====================
const FILE_TYPES = {
  IMAGE: ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg', 'ico', 'tiff', 'tif'],
  VIDEO: ['mp4', 'avi', 'wmv', 'mov', 'flv', 'mkv', 'webm', 'mpeg', 'mpg', '3gp', 'rmvb'],
  AUDIO: ['mp3', 'wav', 'wma', 'aac', 'flac', 'ogg', 'm4a', 'ape'],
  EXCEL: ['xls', 'xlsx', 'xlsm', 'xltx', 'xltm', 'csv'],
  PPT: ['ppt', 'pptx', 'pptm', 'potx', 'potm', 'ppsx'],
  PDF: ['pdf'],
  DOC: ['doc', 'docx', 'docm', 'dotx', 'dotm'],
  TXT: ['txt', 'log', 'md', 'markdown'],
  ZIP: ['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz'],
  CODE: [
    'js',
    'ts',
    'jsx',
    'tsx',
    'vue',
    'html',
    'css',
    'scss',
    'sass',
    'less',
    'json',
    'xml',
    'yaml',
    'yml',
    'java',
    'py',
    'php',
    'go',
    'c',
    'cpp',
    'h',
    'cs',
    'rb',
    'swift',
    'kt',
    'rs',
    'sql'
  ]
} satisfies Record<string, string[]>

const FILE_ICON_MAP = {
  pdf: pdfSvg,
  txt: txtSvg,
  excel: excelSvg,
  ppt: pptSvg,
  doc: docSvg
} as const

const MAX_FILE_SIZE = 20 // MB

// ==================== 响应式状态 ====================
const uploadRef = ref()
const fileList = ref<FileItem[]>([])
const loading = ref()
const uploadClass = ref(`upload-${uuidv4()}`)
const isInternalUpdate = ref(false)
const deletedFileUrls = ref<string[]>([])

const pendingUploadQueue: QueuedUploadOption[] = []
let uploadDelayTimer: number | null = null

const createUid = (() => {
  let seed = Date.now()
  return () => ++seed
})()

const normalizeUid = (uid?: unknown): number => {
  if (typeof uid === 'number' && Number.isFinite(uid)) return uid
  if (typeof uid === 'string') {
    const parsed = Number(uid)
    if (Number.isFinite(parsed)) return parsed
  }
  return createUid()
}

// ==================== 计算属性 ====================
const uploadImgUrl = computed(
  () => `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_API_URL}/api/ossInfo/upload`
)
const uploadHeaders = computed(() => ({ token: getAccessToken() }))

const isShowUpload = computed(() => !props.disabled && fileList.value.length < props.limit)

const formattedWidth = computed(() => {
  if (!props.width || props.width === 'unset') return 'unset'
  return typeof props.width === 'number' ? `${props.width}px` : props.width
})

const normalizedAcceptSet = computed(() => {
  let raw: string[] = []
  if (Array.isArray(props.acceptType)) {
    raw = props.acceptType
  } else if (typeof props.acceptType === 'string') {
    if (props.acceptType === 'all') return new Set(['all'])
    raw = props.acceptType
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  }
  const set = new Set<string>()
  for (const item of raw) {
    if (item === 'all') return new Set(['all'])
    set.add(item)
  }
  return set
})

const acceptTypeTip = computed(() => {
  const set = normalizedAcceptSet.value
  if (set.has('all')) return '选中复制粘贴或文件拖拽（支持任意文件）'
  const map: Record<string, string> = {
    image: '图片',
    video: '视频',
    audio: '音频',
    doc: 'Word文档',
    excel: 'Excel表格',
    ppt: 'PPT幻灯片',
    pdf: 'PDF文件',
    txt: '文本文件'
  }
  const labels = Array.from(set).map((k) => map[k] || k)
  return labels.length > 0
    ? `选中复制粘贴（支持${labels.join('、')}）或文件拖拽`
    : '选中复制粘贴（仅支持图片）或文件拖拽'
})

const accept = computed(() => {
  const set = normalizedAcceptSet.value
  if (set.has('all')) return ''
  const acceptParts: string[] = []
  const extsToStr = (exts: readonly string[]) => exts.map((e) => `.${e}`).join(',')
  if (set.has('image')) acceptParts.push('image/*')
  if (set.has('video')) acceptParts.push('video/*')
  if (set.has('audio')) acceptParts.push('audio/*')
  if (set.has('doc')) acceptParts.push(extsToStr(FILE_TYPES.DOC))
  if (set.has('excel')) acceptParts.push(extsToStr(FILE_TYPES.EXCEL))
  if (set.has('ppt')) acceptParts.push(extsToStr(FILE_TYPES.PPT))
  if (set.has('pdf')) acceptParts.push(extsToStr(FILE_TYPES.PDF))
  if (set.has('txt')) acceptParts.push(extsToStr(FILE_TYPES.TXT))
  return acceptParts.join(',')
})

// ==================== 辅助函数 ====================
const getFileExtension = (fileName: string): string =>
  fileName?.split('.').pop()?.toLowerCase() || ''
const isFileTypeMatch = (fileName: string, types: readonly string[]) =>
  types.includes(getFileExtension(fileName))
const getFileUrl = (file: FileItem) => file.url || file.response?.data?.[0]?.fileUrl || defaultImg
const getFileName = (file: FileItem) =>
  file.name || file.response?.data?.[0]?.fileName || '暂无附件'

// 获取时间
const getFileTime = (file: FileItem): string => {
  const time = file.response?.data?.[0]?.createdAt || file.createdAt
  if (!time) return ''
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}

const isImageFile = (file: FileItem) => {
  const fileName = file.name || file.response?.data?.[0]?.fileName || ''
  return isFileTypeMatch(fileName, FILE_TYPES.IMAGE) && getFileUrl(file) !== defaultImg
}
const isVideoFile = (file: FileItem) => {
  const fileName = file.name || file.response?.data?.[0]?.fileName || ''
  return isFileTypeMatch(fileName, FILE_TYPES.VIDEO)
}
const getFileIcon = (file: FileItem) => {
  const fileName = file.name || file.response?.data?.[0]?.fileName || ''
  if (fileName === '暂无附件') return ''
  const ext = getFileExtension(fileName)
  if (FILE_TYPES.PDF.includes(ext)) return FILE_ICON_MAP.pdf
  if (FILE_TYPES.TXT.includes(ext)) return FILE_ICON_MAP.txt
  if (FILE_TYPES.EXCEL.includes(ext)) return FILE_ICON_MAP.excel
  if (FILE_TYPES.PPT.includes(ext)) return FILE_ICON_MAP.ppt
  if (FILE_TYPES.DOC.includes(ext)) return FILE_ICON_MAP.doc
  if (FILE_TYPES.ZIP.includes(ext)) return zipIcon
  return fileIcon
}

// ==================== 校验与上传 ====================
const validateFileType = (file: File) => {
  // ... (保留原有校验逻辑)
  const set = normalizedAcceptSet.value
  if (set.has('all')) return true
  const ext = file.name.split('.').pop()?.toLowerCase() || ''
  const mime = file.type
  const allowedExts = new Set<string>()
  const allowedMimes = new Set<string>()
  if (set.has('image')) {
    FILE_TYPES.IMAGE.forEach((e) => allowedExts.add(e))
    allowedMimes.add('image/')
  }
  if (set.has('video')) {
    FILE_TYPES.VIDEO.forEach((e) => allowedExts.add(e))
    allowedMimes.add('video/')
  }
  if (set.has('audio')) {
    FILE_TYPES.AUDIO.forEach((e) => allowedExts.add(e))
    allowedMimes.add('audio/')
  }
  if (set.has('doc')) FILE_TYPES.DOC.forEach((e) => allowedExts.add(e))
  if (set.has('excel')) FILE_TYPES.EXCEL.forEach((e) => allowedExts.add(e))
  if (set.has('ppt')) FILE_TYPES.PPT.forEach((e) => allowedExts.add(e))
  if (set.has('pdf')) FILE_TYPES.PDF.forEach((e) => allowedExts.add(e))
  if (set.has('txt')) FILE_TYPES.TXT.forEach((e) => allowedExts.add(e))

  const matched = allowedExts.has(ext) || Array.from(allowedMimes).some((m) => mime.startsWith(m))
  if (!matched) {
    // ... 错误提示
    message.error('文件格式不正确')
    return false
  }
  return true
}

const validateFileSize = (file: File) => {
  const fileSize = file.size / 1024 / 1024
  if (fileSize > MAX_FILE_SIZE) {
    message.error(`上传文件的大小不能超过${MAX_FILE_SIZE}M`)
    return false
  }
  return true
}

const beforeUpload = (file: File) => {
  if (!validateFileSize(file)) return false
  if (!validateFileType(file)) return false
  if (!loading.value) loading.value = ElLoading.service({ fullscreen: true, text: '上传中......' })
  return true
}

const onHttpRequest = (options: UploadRequestOptions) => {
  return new Promise<unknown>((resolve, reject) => {
    pendingUploadQueue.push({ ...options, resolve, reject })
    if (uploadDelayTimer !== null) return
    uploadDelayTimer = window.setTimeout(() => {
      const queue = pendingUploadQueue.splice(0)
      uploadDelayTimer = null
      if (queue.length > 0) executeBatchUpload(queue)
    }, 50)
  })
}

const executeBatchUpload = async (optionsList: QueuedUploadOption[]) => {
  const formData = new FormData()
  optionsList.forEach((item) => formData.append('files', item.file as File))
  const extraData = { ...props.uploadData, ...(optionsList[0]?.data || {}) }
  Object.entries(extraData).forEach(([key, value]) => {
    if (value != null) formData.append(key, value as any)
  })

  try {
    const response = await axios.post(uploadImgUrl.value, formData, {
      headers: { ...uploadHeaders.value, 'Content-Type': 'multipart/form-data' }
    })
    const payload = response?.data ?? response
    const dataList = Array.isArray(payload?.data) ? payload.data : []
    optionsList.forEach((item, index) => {
      const matched = dataList[index] ?? dataList[0]
      item.resolve(matched ? { ...payload, data: [matched] } : payload)
    })
  } catch (error) {
    optionsList.forEach((item) => item.reject(error))
  } finally {
    closePageLoading()
  }
}

// ==================== 回调函数 ====================
const onSuccess = async (res: any, _uploadFile: any, uploadFiles: any[]) => {
  if (res?.code !== 200) return
  fileList.value = [...uploadFiles]
  emit('success', fileList.value)
  emit('uploadSuccess', res)
  await nextTick()
  formItem?.validate?.('change')
  closePageLoading()
}
const onChange = () => emit('change', fileList.value)
const onError = () => {
  message.error('上传失败')
  closePageLoading()
}
const onExceed = () => message.error('文件超出上传限制')
const closePageLoading = () => {
  if (loading.value) {
    loading.value.close()
    loading.value = undefined
  }
}

// ==================== 操作逻辑 ====================
const selectFile = () =>
  (
    document.querySelector(`.${uploadClass.value} .el-upload input[type=file]`) as HTMLInputElement
  )?.click()
const handleUpload = (file: File) => {
  uploadRef.value?.handleStart(file)
  uploadRef.value?.submit()
}
const handlePaste = (evt: ClipboardEvent) => {
  if (props.disabled) return
  const items = evt.clipboardData?.items
  if (!items?.length || evt.clipboardData?.getData('Text')) return
  for (let i = 0; i < items.length; i++) {
    if (items[i].type.includes('image')) {
      const file = items[i].getAsFile()
      if (file) handleUpload(file)
      break
    }
  }
}
const removeFile = async (file: FileItem) => {
  const fileUrl = getFileUrl(file)
  if (fileUrl && fileUrl !== defaultImg) {
    const baseUrl = fileUrl.split('?')[0]
    if (baseUrl) deletedFileUrls.value.push(baseUrl)
  }
  fileList.value = fileList.value.filter((f) => f.uid !== file.uid)
  emit('del', file)
  await nextTick()
  formItem?.validate?.('change')
}
const openFile = (url: string) => {
  if (url && url !== defaultImg) window.open(url, '_blank')
}

const batchDelete = async () => {
  const urls = [...new Set(deletedFileUrls.value.map(stripQueryParams))].filter(Boolean)
  if (!urls.length) return
  try {
    await deleteOssBatch(urls)
    deletedFileUrls.value = []
  } catch (e) {
    message.error('批量删除失败')
  }
}
const stripQueryParams = (url: string): string => url.split('?')[0]

// ==================== 核心：数据格式转换 ====================

// 1. 外部数据 -> 内部格式 (回显)
const convertToInternalFormat = (value: any): FileItem[] => {
  if (!value) return []

  // 处理数组格式：直接映射，确保 createdAt 被保留
  if (props.valueType === 'array' && Array.isArray(value)) {
    return value.map((item) => {
      const url = item.url || item.fileUrl || ''
      let name = item.name || item.fileName

      // 如果没有名字，且有URL
      if (!name && url) {
        // 1. 尝试从 URL 参数 ?name= 中获取
        if (url.includes('?name=')) {
          const paramsPart = url.split('?name=')[1]
          if (paramsPart) {
            // 截取 name，去掉后续可能存在的 &createdAt= 等参数
            name = paramsPart.split('&')[0]
            // 如果需要支持中文解码，可以加上 decodeURIComponent(name)
            try {
              name = decodeURIComponent(name)
            } catch (e) {}
          }
        }

        // 2. 如果还是没有名字，截取 URL 最后一段 (xxx.后缀名)
        if (!name) {
          const urlPath = url.split('?')[0] // 去掉问号后的参数
          const pathParts = urlPath.split('/')
          name = pathParts[pathParts.length - 1] || '暂无附件'
        }
      }

      return {
        ...item,
        uid: normalizeUid(item.uid),
        name: name || '',
        url: url,
        status: 'success'
        // 如果后端返回对象里有 createdAt，这里会自动保留
      }
    })
  }

  // 处理字符串格式：解析 URL 参数
  if (typeof value === 'string') {
    const items: FileItem[] = []
    value.split(',').forEach((str) => {
      // 假设结构是: url?name=xxx&createdAt=xxx
      if (!str.includes('?name=')) {
        const urls: any = str.split('/')
        items.push({
          uid: createUid(),
          name: urls[urls.length - 1],
          url: str,
          status: 'success'
        })
      } else {
        const [urlPart, queryPart] = str.split('?name=')
        if (!urlPart || !queryPart) return

        let name = queryPart
        let createdAt = ''

        // [修改] 解析 createdAt 参数
        if (name.includes('&createdAt=')) {
          const parts = name.split('&createdAt=')
          name = parts[0]
          createdAt = parts[1]
        }
        items.push({
          uid: createUid(),
          name,
          url: urlPart,
          status: 'success',
          createdAt // 保存解析出的时间
        })
      }
    })
    return items
  }

  return []
}

// 2. 内部格式 -> 外部数据 (保存)
const convertToExternalFormat = (files: FileItem[]): any => {
  if (files.length === 0) {
    return props.valueType === 'array' ? [] : ''
  }

  const validFiles = files
    .filter((f) => f.status === 'success')
    .map((f) => {
      const responseItem = (f.response?.data?.[0] || {}) as Record<string, any>
      const sourceItem = f as Record<string, any>

      const result: Record<string, any> = { ...responseItem }

      const fallbackKeys = [
        'fileUrl',
        'fileName',
        'id',
        'businessForeignKey',
        'company',
        'createdAt',
        'createdId',
        'updatedAt',
        'updatedId',
        'isDeleted'
      ]

      fallbackKeys.forEach((key) => {
        const value = sourceItem[key]
        if (value !== undefined && value !== null) result[key] = value
      })

      // 格式化时间并保存
      const rawTime = result.createdAt || sourceItem.createdAt
      const formattedTime = rawTime ? dayjs(rawTime).format('YYYY-MM-DD HH:mm:ss') : ''

      // [关键] 无论是字符串还是数组模式，都将格式化后的时间写入对象
      result.createdAt = rawTime

      const fileUrl = result.fileUrl || sourceItem.fileUrl || sourceItem.url || ''
      const fileName = result.fileName || sourceItem.fileName || sourceItem.name || ''

      if (fileUrl) result.fileUrl = fileUrl
      if (fileName) result.fileName = fileName

      result.uid = f.uid
      result.url = fileUrl
      result.name = fileName
      // 临时字段方便下面拼接字符串使用
      result.formattedTimeStr = formattedTime

      return result
    })
    .filter((f) => f.fileUrl && f.fileName)

  // [修改] 数组模式下，返回的对象数组中现在包含了格式化好的 createdAt
  if (props.valueType === 'array') {
    return validFiles
  }

  // [修改] 字符串模式下，拼接参数改为 &createdAt=
  return validFiles
    .map((f: any) => {
      let str = props.isJoint ? `${f.url}?name=${f.name}` : `${f.url}`
      if (f.formattedTimeStr && props.isJoint) {
        str += `&createdAt=${f.formattedTimeStr}`
      }
      return str
    })
    .join(',')
}

// ==================== 数据同步 ====================
watch(
  () => dataValue.value,
  (newVal) => {
    if (isInternalUpdate.value) return
    isInternalUpdate.value = true
    fileList.value = convertToInternalFormat(newVal)
    nextTick(() => {
      isInternalUpdate.value = false
    })
  },
  { deep: true, immediate: true }
)

watch(
  fileList,
  (newVal) => {
    if (isInternalUpdate.value) return
    const hasUploading = newVal.some((f) => f.status && f.status !== 'success')
    if (hasUploading) return
    const newValue = convertToExternalFormat(newVal)
    if (JSON.stringify(newValue) !== JSON.stringify(dataValue.value)) {
      isInternalUpdate.value = true
      dataValue.value = newValue
      nextTick(() => {
        isInternalUpdate.value = false
      })
    }
  },
  { deep: true }
)

// ==================== 事件监听 ====================
const setupEventListeners = () => {
  const handleBatchDelete = async () => {
    try {
      await batchDelete()
      eventBus.emit('upload:cleanupComplete', { success: true })
    } catch (error) {
      eventBus.emit('upload:cleanupComplete', { success: false, error })
    }
  }
  onMounted(() => eventBus.on('upload:delete', handleBatchDelete))
  onBeforeUnmount(() => eventBus.off('upload:delete', handleBatchDelete))
}
// setupEventListeners()

defineExpose({
  batchDelete,
  getDeletedUrls: () => [...deletedFileUrls.value],
  fileList: readonly(fileList)
})
</script>

<style scoped lang="scss">
.upload-container {
  width: 100%;

  .upload-wrapper {
    display: inline-block !important;
    width: 100%;
  }

  .file-list {
    width: 100%;
    overflow-y: auto;

    &.file-list--disabled {
      margin-top: unset;
    }

    .file-item {
      &:not(:first-child) {
        margin-top: 10px;
      }

      display: flex;
      width: 100%;
      align-items: center;
      // padding: 4px 0;
      position: relative;

      .file-item__icon {
        margin-right: 10px;
        flex-shrink: 0;

        .file-thumbnail {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1px solid #e5e5e5;
          cursor: pointer;
        }
      }

      .file-item__info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: calc(100% - 75px);
        overflow: hidden;

        .file-item__name {
          cursor: pointer;
          display: inline-block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 100%;
          font-size: 14px;
          line-height: 1.4;
          color: #666;
        }

        .file-item__time {
          margin-top: 2px;
          font-size: 12px;
          color: #999;
          line-height: 1.2;
        }
      }

      .file-item__delete {
        color: red;
        cursor: pointer;
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
}

:deep(.el-upload-dragger) {
  padding: 40px var(--el-upload-dragger-padding-vertical);
}

.upload-dropzone {
  height: 76px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #3d3d3d;

  .upload-button {
    margin-top: 10px;
    width: 88px;
    height: 32px;
    border-radius: 4px;
    background: #e5e5e5;
    font-size: 14px;
    text-align: center;
    line-height: 32px;
    cursor: pointer;
  }
}

.upload-tip-text {
  color: #999;
}

.empty-state-text {
  color: #666666;
  font-size: 12px;
  line-height: 16px;
}

.empty-state-image {
  width: 32px;
  height: 32px;
}

:deep(.el-image) {
  display: block;
}
</style>
