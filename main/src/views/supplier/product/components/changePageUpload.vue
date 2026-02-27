<template>
  <div class="flex column">
    <div v-if="!disabled">
      <el-button type="primary" @click="isShow = true">上传文件</el-button>
      <SWDialog
        title="附件上传"
        v-model:model-value="isShow"
        @closed="handleClosed"
        @opened="handleOpened"
      >
        <el-upload
          ref="uploadRef"
          v-model:file-list="fileList"
          name="files"
          :data="{ code: 'SUPPLY_CHAIN' }"
          drag
          multiple
          :action="importUrl"
          :headers="uploadHeaders"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text"> 拖拽、粘贴上传或 <em>点击此处</em> </div>
        </el-upload>
        <template #footer>
          <el-button @click="isShow = false">取消</el-button>
          <el-button type="primary" :loading="loading" @click="handleUpload">确定</el-button>
        </template>
      </SWDialog>
    </div>
    <el-scrollbar>
      <div v-if="fileBoard.length" class="files-image">
        <div class="file-image" v-for="item in fileBoard" :key="item?.url">
          <el-image
            :src="fileImage(item)"
            fit="contain"
            :style="{ width: '100px' }"
            :preview-src-list="isImage(item?.name) ? previewList : []"
            @click="handleOpenFiles(item)"
          />
          <el-link
            type="primary"
            :underline="false"
            :title="item?.name"
            @click="downloadByUrl2(item.url, item.name)"
            >{{ item?.name }}</el-link
          >
        </div>
      </div>
      <el-tag type="info" v-else-if="disabled" size="large" disable-transitions>暂无附件</el-tag>
    </el-scrollbar>
  </div>
</template>
<script lang="ts" setup>
import { getAccessToken } from '@/utils/auth'
import { isExcel, isImage, isPDF, isPPT, isWord, microsoftOnlinePreviewUrl } from '@/utils/file'
import { UploadInstance } from 'element-plus/es'

// 引入文件类型图标
import fileExcel from '@/assets/imgs/excel.svg'
import filePdf from '@/assets/imgs/pdf.svg'
import fileDoc from '@/assets/imgs/doc.svg'
import filePpt from '@/assets/imgs/ppt.svg'
import { downloadByUrl2 } from '@/utils/download'

const props = defineProps<{
  modelValue?: string
  disabled?: boolean
  url?: string
}>()

const emit = defineEmits(['update:modelValue'])

const message = useMessage()

const isShow = ref(false)
const uploadRef = ref<UploadInstance>()
const fileList = ref<any[]>([])
const fileBoard = ref<any[]>([])
const previewList = computed(() =>
  props.modelValue?.split(',').filter((ele) => {
    return isImage(ele)
  })
)

const importUrl =
  import.meta.env.VITE_BASE_URL + import.meta.env.VITE_API_URL + '/api/ossInfo/upload'
const uploadHeaders = ref({ token: getAccessToken() })
const loading = ref(false)

watch(
  () => props.modelValue,
  (val) => {
    try {
      fileList.value = val
        ? val
            ?.split(',')
            .filter((ele) => ele)
            .map((ele) => {
              const urlObj = new URL(ele)
              const name = urlObj.searchParams.get('name')
              const url = urlObj.href.split('?name=')[0]

              return {
                name,
                response: {
                  data: [
                    {
                      fileName: name,
                      fileUrl: url
                    }
                  ]
                }
              }
            })
        : []

      fileBoard.value = val
        ? val?.split(',').map((ele) => ({ name: ele.split('?name=')[1], url: ele }))
        : []
    } catch (error) {
      console.log(error)
    }
  },
  { deep: true, immediate: true }
)

const fileImage = ({ name, url }) => {
  if (isImage(name)) {
    return url
  }

  const ext = url?.split('.').pop()?.toLowerCase() || ''
  if (['xls', 'xlsx'].includes(ext)) return fileExcel
  if (['pdf'].includes(ext)) return filePdf
  if (['doc', 'docx'].includes(ext)) return fileDoc
  if (['ppt', 'pptx'].includes(ext)) return filePpt
}

function handleUploadSuccess() {
  message.success('上传成功！')
}

function handleUploadError() {
  loading.value = false
  message.error('上传失败')
}

function handleUpload() {
  const urls = fileList.value
    .map((ele) => ele.response.data[0].fileUrl + '?name=' + ele.response.data[0].fileName)
    .join(',')
  const value: string = Array.from(new Set(urls.split(',')).values()).join(',')

  emit('update:modelValue', value)

  fileBoard.value = value
    ? value.split(',').map((ele) => ({ name: ele.split('?name=')[1], url: ele }))
    : []
  isShow.value = false
}

function handleClosed() {
  uploadRef.value?.$el?.removeEventListener('paste', handlePaste)
}

function handleOpenFiles({ name, url }) {
  if (isPPT(name) || isExcel(name) || isWord(name)) {
    window.open(microsoftOnlinePreviewUrl(url), '_blank')
  } else if (isPDF(name)) {
    window.open(url, '_blank')
  }
}

function handleOpened() {
  uploadRef.value?.$el.focus()
  uploadRef.value?.$el?.addEventListener('paste', handlePaste)
}

function clearBoard() {
  fileBoard.value = []
  uploadRef.value?.clearFiles()
  fileList.value = []
}

const handlePaste = async (evt) => {
  const txt = evt.clipboardData.getData('Text')
  if (typeof txt == 'string' && txt !== '') {
    return
  }
  let files: any[] = []
  const items = (evt.clipboardData || window.Clipboard).items
  if (!items.length) return
  for (let i = 0; i < items.length; i++) {
    files.push(items[i].getAsFile())
  }
  if (files.length) {
    files.forEach((ele) => {
      uploadRef.value?.handleStart(ele)
      uploadRef.value?.submit()
    })
  }
}

defineExpose({ clearBoard })
</script>
<style lang="less" scoped>
.files-image {
  display: flex;
  flex: 1 !important;
  width: fit-content;
  margin-top: 12px;
  max-width: 1500px;
  padding: 12px;
  padding-bottom: 0;
  border: 1px solid #f0f0f0;
  border-radius: 8px;

  &::-webkit-scrollbar {
    display: none;
    height: 5px;
  }

  .file-image {
    display: flex;
    flex-direction: column;
    margin-left: 12px;

    &:first-of-type {
      margin-left: 0;
    }
  }
}

.el-image {
  width: 100px;
  height: 100px;

  img {
    width: 100px;
  }
}

.el-link {
  margin-top: 4px;
  font-size: 12px;

  :deep(.el-link__inner) {
    word-break: break-all;
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
  }
}

:deep(.el-scrollbar__wrap--hidden-default) {
  height: fit-content;
}

:deep(.el-scrollbar) {
  height: fit-content;
}
</style>
