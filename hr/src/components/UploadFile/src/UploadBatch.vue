<template>
  <section class="uploader w-full" @paste="onPaste">
    <el-upload
      v-if="enableEdit && !onlyShow && !disabled"
      ref="uploadRef"
      style="width: 100%"
      v-model:file-list="elUploadFileList"
      :accept="acceptUploadFileType"
      :action="importUrl"
      class="upload"
      :class="onGetUploadClass()"
      :headers="uploadHeaders"
      name="files"
      drag
      :auto-upload="true"
      :show-file-list="false"
      :data="{ bussinessCode: businessCode, businessForeignKey: componentUUID }"
      :on-error="onUploadError"
      :on-success="onUploadSuccess"
      :on-progress="onUploadProgress"
      :before-upload="onBeforeUpload"
      :multiple="multiple"
      :disabled="disabled || (limit > 0 && displayFileList.length >= limit)"
    >
      <div v-if="showBtnStyle">
        <el-button type="primary" :icon="Plus">点击上传</el-button>
      </div>
      <div v-else>
        <!-- v-click-outside="handleClickOutside" -->
        <div
          class="upload-bg"
          :class="{ 'upload-bg--active': isUploadBgActive && !disabled }"
          @click.stop.prevent="onUploadBgClick"
        >
          <img
            src="@/assets/imgs/upload_file.png"
            alt=""
            :style="{ opacity: disabled ? 0.5 : 1 }"
          />
          <div class="upload-bg-tips" :style="{ opacity: disabled ? 0.5 : 1 }">
            选中复制粘贴(支持图片)或文件拖拽
          </div>
          <div
            class="upload-bg-select-file"
            @click="onSelectFile"
            :style="{ opacity: disabled ? 0.5 : 1 }"
            >选择文件</div
          >
        </div>
        <div
          v-if="!hideFileSizeMsg"
          style="font-size: 10px; color: #666666; margin: 8px 0"
          @click.stop.prevent=""
        >
          {{ onlyUploadImg ? `只能上传图片，且不超过${fileSize}M` : `文件大小不超过${fileSize}M` }}
        </div>
        <div v-else :style="{ height: hideResultSpace ? '0px' : '8px' }"></div>
      </div>
    </el-upload>

    <section class="upload-file-list" v-if="displayFileList.length > 0 && !onlyShow && !disabled">
      <header
        v-if="!onlyShow && !disabled"
        style="font-size: 12px; color: #333333; margin-top: -5px"
        :style="{ marginTop: showBtnStyle ? '0px' : '-5px' }"
      >
        <h3 class="upload-file-list-title">已上传文件</h3>
      </header>

      <div class="upload-file-list-items">
        <div v-for="(item, index) in displayFileList" :key="item.url || item.uid">
          <div
            class="upload-file-list-item"
            :class="{
              'upload-file-list-item--compact': onlyShow,
              'upload-file-list-item--hover':
                hoverStateList[index] && !onlyShow && enableEdit && !disabled
            }"
            @mouseenter="hoverStateList[index] = true"
            @mouseleave="hoverStateList[index] = false"
          >
            <img
              class="upload-file-list-item-filetype-icon"
              :src="onGetFileIcon(onGetFileName(item))"
            />

            <button
              type="button"
              class="upload-file-list-item-name"
              :class="{
                'upload-file-list-item-name--hover':
                  hoverStateList[index] && (onlyShow || !enableEdit || disabled)
              }"
              @click="onPreview(item)"
            >
              {{ onGetFileName(item) }}
            </button>

            <div class="row-center" style="margin-left: auto">
              <div
                v-if="item?.uploadStatus === 'uploading' && !hoverStateList[index]"
                class="upload-file-list-item-progress"
              >
                {{ item.percent }}%
              </div>
              <div
                v-if="
                  item?.uploadStatus === 'fail' && !hoverStateList[index] && !onlyShow && !disabled
                "
                class="upload-file-fail"
              >
                <div class="upload-file-fail-text">上传失败</div>
                <img class="upload-file-fail-icon" src="@/assets/imgs/upload_file_fail.png" />
              </div>

              <img
                v-if="
                  item?.uploadStatus === 'success' &&
                  !hoverStateList[index] &&
                  !onlyShow &&
                  !disabled
                "
                style="width: 16px; height: 16px; margin-right: 8px"
                src="@/assets/imgs/upload_file_complete.png"
                alt=""
              />
              <div
                v-if="enableEdit && !onlyShow && !disabled && hoverStateList[index]"
                style="width: 16px; height: 16px; margin-right: 8px"
                @mouseenter="isDeleteButtonHovered = true"
                @mouseleave="isDeleteButtonHovered = false"
                class="flex"
              >
                <button
                  type="button"
                  class="upload-file-list-item-action-delete"
                  @click="onDeleteItem(item, index)"
                  aria-label="删除文件"
                >
                  <img
                    v-if="isDeleteButtonHovered"
                    class="upload-file-list-item-action-delete-icon"
                    src="@/assets/imgs/upload_file_delete_hl.png"
                    alt=""
                  />
                  <img
                    v-else
                    class="upload-file-list-item-action-delete-icon"
                    src="@/assets/imgs/upload_file_delete.png"
                    alt=""
                  />
                </button>
              </div>
            </div>
          </div>

          <el-progress
            v-if="item?.uploadStatus === 'uploading' && !hoverStateList[index] && !onlyShow"
            class="upload-file-list-progress"
            :percentage="item.percent"
            color="#0567fe"
            style="height: 4px"
            :show-text="false"
          />
        </div>
      </div>
    </section>

    <section class="upload-file-list" v-if="displayFileList.length > 0 && (onlyShow || disabled)">
      <ul class="upload-file-grid">
        <li v-for="(item, index) in onGetImageList(displayFileList)" :key="index">
          <el-image
            style="
              width: 40px;
              height: 40px;
              border-radius: 4px;
              margin-right: 8px;
              margin-bottom: 8px;
              vertical-align: middle;
            "
            :preview-teleported="true"
            :src="item.url"
            :preview-src-list="[item.url ? item.url : '']"
            fit="cover"
          />
        </li>
      </ul>

      <ul class="upload-file-list-items">
        <li
          v-for="(item, index) in onGetFileList(displayFileList)"
          :key="item.url || index"
          class="upload-file-list-item"
          :class="{
            'upload-file-list-item--compact': onlyShow,
            'upload-file-list-item--hover':
              hoverStateList[index] && !onlyShow && enableEdit && !disabled
          }"
          @mouseenter="hoverStateList[index] = true"
          @mouseleave="hoverStateList[index] = false"
        >
          <img
            class="upload-file-list-item-filetype-icon"
            :src="onGetFileIcon(onGetFileName(item))"
          />

          <button
            type="button"
            class="upload-file-list-item-name"
            :class="{ 'upload-file-list-item-name--hover': hoverStateList[index] }"
            @click="onPreview(item)"
          >
            {{ onGetFileName(item) }}
          </button>

          <div v-if="showDownloadIcon" style="margin-left: auto">
            <a
              class="upload-file-download"
              :href="item.url"
              target="_blank"
              rel="noopener"
              download
            >
              <img
                style="width: 14px; height: 14px; margin-right: 6px"
                src="@/assets/imgs/fileDownload.png"
                alt=""
              />
              <span style="color: #0064ff; font-size: 12px; padding-right: 2px">下载</span>
            </a>
          </div>
        </li>
      </ul>
    </section>

    <div v-if="displayFileList.length === 0 && (onlyShow || disabled)" style="color: #333333"
      >暂无数据</div
    >
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { generateUUID, handleUploadFileRequest } from '@/utils'
import { getAccessToken } from '@/utils/auth'
import { createImageViewer } from '@/components/ImageViewer'
import { Plus } from '@element-plus/icons-vue'
import { multipleUploadUrl, multipleUpload, deleteOss } from '@/api/common/upload'
import type { AxiosProgressEvent } from 'axios'
import { useMessage } from '@/hooks/web/useMessage'

/**
 * 单个上传列表项
 */
interface UploadItem {
  uid: string | number
  url: string
  name: string
  uploadStatus: 'uploading' | 'success' | 'fail'
  percent: number
}

const uploadHeaders = ref({ token: getAccessToken() }) // 上传 Header 头
const importUrl = import.meta.env.VITE_BASE_URL + import.meta.env.VITE_API_URL + multipleUploadUrl
const isUploading = ref(false) // 上传 loading
const elUploadFileList = ref<any[]>([]) // el-upload 内部文件列表（不展示）

const componentUUID = generateUUID() // 生成唯一标识符

import fileExcel from '@/assets/imgs/file_excel.png'
import filePdf from '@/assets/imgs/file_pdf.png'
import fileDoc from '@/assets/imgs/file_doc.png'

const uploadRef = ref<any>(null)
const message = useMessage()

/**
 * 触发内部 el-upload 开始上传
 */
const onStartUpload = (file: any) => {
  uploadRef.value?.handleStart?.(file)
  uploadRef.value?.submit?.()
}

/**
 * 生成唯一类名，便于选择 input[type=file]
 */
const onGetUploadClass = () => {
  return `upload${componentUUID}`
}

/**
 * 手动触发隐藏的文件选择框
 */
const onSelectFile = (e: MouseEvent) => {
  const input = document.querySelector(
    `.${onGetUploadClass()} .el-upload input[type=file]`
  ) as HTMLInputElement | null
  if (input) {
    input.click()
  }
}

const props = defineProps({
  businessCode: { type: String, default: 'NEW_PRODUCT' },
  showBtnStyle: { type: Boolean, default: false },
  modelValue: { type: Array, default: () => [] },
  hideFileSizeMsg: { type: Boolean, default: false },
  limit: { type: Number, default: 0 },
  enableEdit: { type: Boolean, default: true },
  onlyShow: { type: Boolean, default: false },
  showDownloadIcon: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  uoloadFileList: { type: Array, default: () => [] },
  onlyUploadImg: { type: Boolean, default: false },
  fileType: { type: String, default: 'xlsx/pdf/jpg/png' },
  /**
   * 允许上传的文件类型，逗号分隔的字符串（如 "png,jpg,jpeg"）。
   */
  fileTypes: { type: String, default: '' },
  fileSize: { type: Number, default: 5 }, // M
  hideResultSpace: { type: Boolean, default: false },
  /**
   * 是否支持多文件选择/上传
   */
  multiple: { type: Boolean, default: true }
})

const acceptUploadFileType = computed(() => {
  if (props.onlyUploadImg) {
    return ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].join(',')
  }
  return '*'
})

const internalFileList = ref<UploadItem[]>([]) // 组件对外的文件列表
const hoverStateList = ref<boolean[]>([])
const isDeleteButtonHovered = ref<boolean>(false)

// uploadStatus : uploading success fail
const displayFileList = computed<UploadItem[]>(() => {
  let list: UploadItem[] = props.enableEdit
    ? internalFileList.value
    : (props.uoloadFileList as unknown as UploadItem[]).length > 0
      ? (props.uoloadFileList as unknown as UploadItem[])
      : internalFileList.value

  if (list && Array.isArray(list)) {
    list.forEach((item: UploadItem) => {
      if (!item?.uploadStatus) {
        item.uploadStatus = 'success'
        item.percent = 100
      }
    })
    hoverStateList.value = []
    list.forEach(() => {
      hoverStateList.value.push(false)
    })
    return list
  } else {
    return []
  }
})

// 规范化对外传入的 modelValue，兼容字符串 URL、{ fileUrl, fileName } 等结构
const normalizeInboundModelValue = (value: any[]): UploadItem[] => {
  if (!Array.isArray(value)) return []
  return value.map((entry: any) => {
    if (typeof entry === 'string') {
      return {
        uid: generateUUID(),
        url: entry,
        name: '',
        uploadStatus: 'success',
        percent: 100
      } as UploadItem
    }
    if (entry && typeof entry === 'object') {
      const url: string = entry.url || entry.fileUrl || ''
      const name: string = entry.name || entry.fileName || ''
      return {
        uid: entry.uid || generateUUID(),
        url,
        name,
        uploadStatus: entry.uploadStatus || 'success',
        percent: typeof entry.percent === 'number' ? entry.percent : 100
      } as UploadItem
    }
    return {
      uid: generateUUID(),
      url: '',
      name: '',
      uploadStatus: 'success',
      percent: 100
    } as UploadItem
  })
}

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal && (newVal as any[]).length > 0) {
      internalFileList.value = normalizeInboundModelValue(newVal as any[])
    } else {
      internalFileList.value = []
    }
  },
  {
    immediate: true,
    deep: true
  }
)

// 统一解析上传返回结果，兼容对象数组与 URL 字符串数组
const normalizeUploadResponse = (response: any): Array<{ url: string; name?: string }> => {
  const rawList: any = Array.isArray(response)
    ? response
    : response?.data || response?.result || response?.files || []
  if (!Array.isArray(rawList)) return []
  const results: Array<{ url: string; name?: string }> = []
  for (const entry of rawList) {
    if (typeof entry === 'string') {
      results.push({ url: entry })
      continue
    }
    if (entry && typeof entry === 'object') {
      const url: string = entry.fileUrl || entry.url || ''
      const name: string | undefined = entry.fileName || undefined
      if (url) results.push({ url, name })
    }
  }
  return results
}

// 删除队列：用于单文件模式替换时，待新文件上传成功后再删除旧文件
const pendingDeleteUrls = ref<string[]>([])
const performPendingDeletes = async () => {
  if (pendingDeleteUrls.value.length === 0) return
  const urls = [...pendingDeleteUrls.value]
  pendingDeleteUrls.value = []
  try {
    await Promise.all(urls.map((u) => deleteOss({ fileUrl: u })))
  } catch (e) {
    // 忽略删除失败
  }
}

// 监听 paste，支持多文件（受 multiple 与 limit 限制）
const onPaste = (evt: ClipboardEvent) => {
  if (
    (props.limit > 0 && displayFileList.value.length >= props.limit) ||
    props.disabled ||
    !props.enableEdit
  ) {
    return
  }
  const txt = evt.clipboardData?.getData('Text')
  if (typeof txt === 'string' && txt !== '') {
    // 检测到是文字，过滤
    return
  }
  const w: any = window
  const items = (evt.clipboardData || w.clipboardData)?.items || []
  if (!items.length) return

  const files: File[] = []
  for (let i = 0; i < items.length; i++) {
    const it = items[i]
    if (it.kind === 'file') {
      const f = it.getAsFile()
      if (!f) continue
      if (props.onlyUploadImg) {
        if (f.type && f.type.indexOf('image') !== -1) files.push(f)
      } else {
        files.push(f)
      }
    }
  }
  if (files.length === 0) return

  // 按 multiple 与 limit 计算本次可用上传数量
  let available = props.limit > 0 ? props.limit - displayFileList.value.length : files.length
  if (!props.multiple) {
    available = Math.min(available, 1)
  }
  if (available <= 0) return
  const sliceFiles = files.slice(0, available)
  batchUploadFiles(sliceFiles)
}

// 批量上传：将粘贴的文件一次性打包为 FormData 的 files 字段提交
const batchUploadFiles = async (files: File[]) => {
  // 校验文件类型与大小
  const validFiles: File[] = []
  const types = (props.fileTypes || '')
    .split(',')
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean)

  for (const f of files) {
    // 仅图片
    if (props.onlyUploadImg && !(f.type && f.type.indexOf('image') !== -1)) {
      ElMessage.error('仅支持图片粘贴上传')
      continue
    }
    // 指定后缀
    if (types.length > 0) {
      const ext = (f.name || '').split('.').pop()?.toLowerCase()
      if (!(ext && types.includes(ext))) {
        ElMessage.error('上传文件类型仅支持: ' + types.join(', '))
        continue
      }
    }
    // 大小限制（M）
    if (props.fileSize && f.size > props.fileSize * 1024 * 1024) {
      ElMessage.error(`文件 ${f.name} 大小不能超过${props.fileSize}M`)
      continue
    }
    validFiles.push(f)
  }

  if (validFiles.length === 0) return

  isUploading.value = true

  // 单文件模式：记录旧文件，成功后删除
  if (!props.multiple) {
    if (internalFileList.value.length > 0) {
      const urlsToDelete = internalFileList.value.map((f) => f.url).filter((u) => !!u)
      if (urlsToDelete.length > 0) {
        pendingDeleteUrls.value.push(...urlsToDelete)
      }
    }
    internalFileList.value = []
    hoverStateList.value = []
  }

  // 为每个粘贴文件创建占位项，统一更新进度
  const addedIndexes: number[] = []
  validFiles.forEach((f) => {
    const newItem: UploadItem = {
      uid: generateUUID(),
      url: '',
      name: f.name,
      uploadStatus: 'uploading',
      percent: 0
    }
    internalFileList.value.push(newItem)
    hoverStateList.value.push(false)
    addedIndexes.push(internalFileList.value.length - 1)
  })

  const formData = new FormData()
  validFiles.forEach((f) => formData.append('files', f))
  formData.append('bussinessCode', props.businessCode)
  formData.append('businessForeignKey', componentUUID)

  try {
    const resp = await multipleUpload(formData, {
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        const total = progressEvent.total && progressEvent.total > 0 ? progressEvent.total : 1
        const loaded = progressEvent.loaded || 0
        const percent = Math.round((loaded / total) * 100)
        addedIndexes.forEach((idx) => {
          internalFileList.value[idx].percent = percent
          internalFileList.value[idx].uploadStatus = percent >= 100 ? 'success' : 'uploading'
        })
      }
    })

    const body = resp
    if (!handleUploadFileRequest(body)) {
      // 已在工具方法内处理异常场景
      isUploading.value = false
      return
    }

    const normalizedList = normalizeUploadResponse(body)
    for (let i = 0; i < addedIndexes.length; i++) {
      const idx = addedIndexes[i]
      const info = Array.isArray(normalizedList) ? normalizedList[i] : null
      if (info && info.url) {
        internalFileList.value[idx] = {
          ...(internalFileList.value[idx] as UploadItem),
          url: info.url,
          name: info.name || internalFileList.value[idx].name,
          uploadStatus: 'success',
          percent: 100
        }
      } else {
        // 若后端返回条目数与文件数不一致，保持成功进度但不设置URL
        internalFileList.value[idx].uploadStatus = 'success'
        internalFileList.value[idx].percent = 100
      }
    }

    isUploading.value = false
    emit('update:modelValue', internalFileList.value)
    emit('change', internalFileList.value)
    await performPendingDeletes()
  } catch (error) {
    isUploading.value = false
    addedIndexes.forEach((idx) => {
      internalFileList.value[idx].uploadStatus = 'fail'
    })
    pendingDeleteUrls.value = []
    ElMessage.error('上传失败')
  }
}

const emit = defineEmits(['update:modelValue', 'uploadBgClick', 'change'])

const isUploadBgActive = ref(false)
const onUploadBgClick = () => {
  isUploadBgActive.value = true
  emit('uploadBgClick')
}

const onCancelUploadSelect = () => {
  isUploadBgActive.value = false
}

defineExpose({ onCancelUploadSelect })

/**
 * 获取展示的文件名
 */
const onGetFileName = (file: Partial<UploadItem> & { url?: string; name?: string }): string => {
  if (file) {
    if (file.name) {
      return file.name || ''
    }
    if (file.url) {
      let array = file.url.split('?name=') || []
      if (array.length > 1) {
        return array[array.length - 1]
      }
      let array1 = file.url.split('?fileName=') || []
      if (array1.length > 1) {
        return array1[array1.length - 1]
      }
      const arr = file.url.split('/') || []
      if (arr.length > 0) {
        return arr[arr.length - 1]
      }
      return ''
    }
  } else {
    return ''
  }
  return ''
}

/**
 * 根据文件名匹配图标
 */
const onGetFileIcon = (fileName: string): string => {
  if (fileName) {
    if (fileName.includes('xlsx') || fileName.includes('xls')) {
      return fileExcel
    } else if (fileName.includes('pdf') || fileName.includes('xls')) {
      return filePdf
    } else {
      return fileDoc
    }
  }
  return fileDoc
}

/**
 * 从列表中过滤图片文件
 */
const onGetImageList = (list: UploadItem[]) => {
  let arr: UploadItem[] = []
  list.forEach((element) => {
    const imageFormats = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp']
    const extension = (element.url || '').toLowerCase()
    const isImg = imageFormats.some((value) => extension.includes(value))
    if (isImg) {
      arr.push(element)
    }
  })
  return arr
}

/**
 * 从列表中过滤非图片文件
 */
const onGetFileList = (list: UploadItem[]) => {
  let arr: UploadItem[] = []
  list.forEach((element) => {
    const imageFormats = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp']
    const extension = (element.url || '').toLowerCase()
    const isImg = imageFormats.some((value) => extension.includes(value))
    if (!isImg) {
      arr.push(element)
    }
  })
  return arr
}

// 上传成功
const onUploadSuccess = async (res: any, file: any): Promise<void> => {
  if (!handleUploadFileRequest(res)) return
  const idx = internalFileList.value.findIndex((it) => it.uid === (file && file.uid))
  if (idx > -1) {
    const list = normalizeUploadResponse(res)
    if (list.length > 0 && list[0].url) {
      const lastObj: UploadItem = {
        ...(internalFileList.value[idx] as UploadItem),
        url: list[0].url,
        name: list[0].name || internalFileList.value[idx].name,
        uploadStatus: 'success',
        percent: 100
      }
      internalFileList.value[idx] = lastObj
    } else {
      internalFileList.value[idx].uploadStatus = 'success'
      internalFileList.value[idx].percent = 100
    }
  }
  isUploading.value = false
  emit('update:modelValue', internalFileList.value)
  emit('change', internalFileList.value)
  await performPendingDeletes()
}

// 预览
const onPreview = (file: UploadItem) => {
  const imageFormats = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp']
  const extension = (file.url || '').toLowerCase()
  const isImg = imageFormats.some((value) => extension.includes(value))
  if (isImg) {
    createImageViewer({
      zIndex: 9999999,
      urlList: [file.url]
    })
  } else {
    window.open(file.url, '_blank')
  }
}
const onDeleteItem = async (item: UploadItem, index: number) => {
  try {
    await message.confirm('确认删除该文件吗？')
  } catch (e) {
    return
  }
  try {
    const url = (item as any)?.url || (item as any)?.fileUrl
    if (url) {
      await deleteOss({ fileUrl: url })
    }
    internalFileList.value.splice(index, 1)
    emit('change', internalFileList.value)
  } catch (e) {
    ElMessage.error('删除失败')
  }
}
// 上传失败
const onUploadError = (err: any, file: any) => {
  isUploading.value = false
  pendingDeleteUrls.value = []
  const idx = internalFileList.value.findIndex((it) => it.uid === (file && file.uid))
  if (idx > -1) {
    internalFileList.value[idx].uploadStatus = 'fail'
  }
}

const onBeforeUpload = (file: any) => {
  if (props.limit > 0 && displayFileList.value.length >= props.limit) {
    isUploading.value = false
    ElMessage.error('已超过上传数量限制')
    return false
  }
  if (props.fileTypes) {
    const types = props.fileTypes
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean)
    const ext = (file.name || '').split('.').pop()?.toLowerCase()
    if (ext && types.length > 0 && !types.includes(ext)) {
      isUploading.value = false
      ElMessage.error('上传文件类型仅支持: ' + types.join(', '))
      return false // 阻止上传
    }
  }
  if (props.onlyUploadImg) {
    if (!(file.type && file.type.indexOf('image') !== -1)) {
      isUploading.value = false
      ElMessage.error('仅支持图片粘贴上传')
      return false
    }
  }
  // 如果不支持多选，则清空已有文件，仅保留即将上传的文件
  if (!props.multiple) {
    if (internalFileList.value.length > 0) {
      const urlsToDelete = internalFileList.value.map((f) => f.url).filter((u) => !!u)
      if (urlsToDelete.length > 0) {
        pendingDeleteUrls.value.push(...urlsToDelete)
      }
    }
    internalFileList.value = []
  }
  isUploading.value = true
  const newItem: UploadItem = {
    uid: file.uid,
    url: '',
    name: file.name,
    uploadStatus: 'uploading',
    percent: 0
  }
  internalFileList.value.push(newItem)
  hoverStateList.value.push(false)
}

const onUploadProgress = (event: any, file: any) => {
  const percent = Math.round(event.percent || 0)
  const idx = internalFileList.value.findIndex((it) => it.uid === (file && file.uid))
  if (idx > -1) {
    internalFileList.value[idx].percent = percent
    internalFileList.value[idx].uploadStatus = 'uploading'
  }
}
</script>

<style lang="scss" scoped>
:deep(.el-button) {
  padding: 8px 10px;
}

.upload-bg {
  border-radius: 10px;
  background: #ffffff;
  border: 1px dashed #cdcdcd;
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    margin-top: 34px;
    width: 46px;
    height: 34px;
  }

  &-tips {
    padding-top: 20px;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: normal;
    color: #3d3d3d;
    width: calc(100% - 20px);
    text-align: center;
  }

  &-select-file {
    margin-top: 20px;
    width: 88px;
    height: 32px;
    margin-bottom: 26px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;

    border-radius: 4px;
    background: #e5e5e5;
    font-size: 14px;
    font-weight: normal;
    line-height: 22px;
    text-transform: capitalize;
    letter-spacing: normal;
    color: #333333;
    border: none;
    outline: none;
    cursor: pointer;
    user-select: none;
  }
}

.upload-bg--active {
  background: #f3f9ff;
  border: 1px dashed #0064ff;
}

.upload-file-list {
  position: relative;

  &-title {
    margin: 0;
    font-size: inherit;
    font-weight: normal;
  }

  &-items {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  &-item {
    display: flex;
    flex-direction: row;
    align-items: center;

    cursor: pointer;
    height: 34px;
    margin-bottom: 3px;

    &-name {
      padding: 1px 0 0 6px;
      box-sizing: border-box;
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      background: transparent;
      border: none;
      color: inherit;
    }

    &-name--hover {
      color: #0064ff;
    }

    &-filetype-icon {
      width: 14px;
      height: 17px;
      color: #909399;
      margin-left: 10px;
      margin-right: 4px;
    }

    &-action-delete-icon {
      width: 16px;
      height: 16px;
    }

    &-progress {
      font-weight: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #0064ff;
      margin-right: 8px;
    }

    .upload-file-fail {
      display: flex;
      flex-direction: row;
      align-items: center;

      &-text {
        font-size: 14px;
        font-weight: normal;
        line-height: normal;
        letter-spacing: normal;
        color: #eb3737;
      }

      &-icon {
        margin-left: 14px;
        width: 16px;
        height: 16px;
        margin-right: 8px;
      }
    }
  }

  &-item--compact {
    height: 30px;
    margin-bottom: 0px;
  }

  &-item--hover {
    border-radius: 4px;
    background: #ecf2ff;

    .upload-file-list-item-name {
      color: #0064ff;
    }
  }

  &-progress {
    width: calc(100% - 20px);
    position: absolute;
    margin-left: 10px;
    margin-top: -6px;
  }
}

.upload-file-grid {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  list-style: none;
  padding: 0;
  margin: 0;
}

.upload-file-list-item-action-delete {
  background: transparent;
  border: none;
  padding: 0;
  width: 100%;
  height: 100%;
}

.upload-file-download {
  display: inline-flex;
  align-items: center;
}

:deep(.el-progress-bar__outer) {
  height: 4px !important;
}

:deep(.el-upload-dragger) {
  padding: 0px !important;
  border: none !important;
  text-align: left;
}

:deep(.el-upload.is-disabled .el-upload-dragger) {
  background: transparent !important;
}
</style>
