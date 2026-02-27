<template>
  <el-upload
    list-type="picture-card"
    ref="uploadRef"
    v-model:file-list="fileList"
    name="files"
    :data="{ code: 'SUPPLY_CHAIN' }"
    :action="importUrl"
    :headers="uploadHeaders"
    :on-success="handleUploadSuccess"
    :on-remove="handleRemove"
    :on-preview="handlePreview"
    :on-exceed="handleExceed"
    :on-error="handleUploadError"
    :on-change="handleChange"
    :limit="1"
    accept="image/jpeg,image/png,image/jpg,image/svg"
  >
    <el-icon><Plus /></el-icon>
  </el-upload>
  <el-image
    ref="fileRef"
    class="w-0 h-0 overflow-hidden"
    :src="mainImgUrl"
    :preview-src-list="[mainImgUrl!]"
  />
</template>
<script lang="ts" setup>
import { getAccessToken } from '@/utils/auth'
import { genFileId, UploadInstance, UploadRawFile } from 'element-plus/es'

const props = defineProps<{
  mainImgUrl?: string
}>()

const emit = defineEmits<{
  (e: 'update:mainImgUrl', v: string): void
  (e: 'change'): void
}>()

const message = useMessage()

const fileList = ref<any[]>([])
const importUrl =
  import.meta.env.VITE_BASE_URL + import.meta.env.VITE_API_URL + '/api/ossInfo/upload'
const uploadHeaders = ref({ token: getAccessToken() })
function handleUploadSuccess(res) {
  const url = new URL(res.data[0].fileUrl)
  url.searchParams.set('name', res.data[0].fileName)
  emit('update:mainImgUrl', url.href)
}
function handleRemove(file) {
  const url = new URL(file.response.data[0].fileUrl)
  url.searchParams.set('name', file.response.data[0].fileName)
  emit('update:mainImgUrl', '')
  emit('change')
}
const fileRef = ref()
const uploadRef = ref<UploadInstance>()
function handlePreview() {
  fileRef.value?.showPreview()
}
function handleExceed(files) {
  uploadRef.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  uploadRef.value!.handleStart(file)
  uploadRef.value?.submit()
}
function handleUploadError() {
  uploadRef.value!.clearFiles()
  message.error('图片上传失败！')
}

function render() {
  // 回显图片
  if (props.mainImgUrl) {
    const url = new URL(props.mainImgUrl)
    fileList.value = [
      {
        name: url.searchParams.get('name'),
        url: url.href
      }
    ]
  }
}

function handleChange() {
  emit('change')
}

defineExpose({ render, clear: () => uploadRef.value?.clearFiles() })
</script>
<style lang="less" scoped></style>
