<template>
  <s-w-dialog
    width="600"
    ref="uploadDialogRef"
    v-model="isShowDialog"
    @closed="onClosed"
    title="文件上传"
  >
    <el-upload
      ref="uploadRef"
      drag
      v-model:file-list="fileList"
      name="files"
      :auto-upload="false"
      :limit="1"
      :on-exceed="handleExceed"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text"> 拖入文件上传或 <em>点击上传</em> </div>
      <template #tip>
        <el-button class="mt16px" type="primary" @click="handleDownload"> 下载导入模板 </el-button>
        <div class="el-upload__tip"> 只能导入xls、xlsx文件，且不能超过100MB </div>
      </template>
    </el-upload>
    <template #footer>
      <el-button
        type="primary"
        :loading="submitLoading"
        :disabled="submitLoading"
        @click="onsubmit"
      >
        确定
      </el-button>
      <el-button @click="onCancel">取消</el-button>
    </template>
  </s-w-dialog>
  <div class="print-table">
    <div class="item header"></div>
  </div>
</template>
<script lang="ts" setup>
import { exportDetail, uploadPurchaseOrderFiles } from '@/api/supplier/purchase'
import download from '@/utils/download'
import { formatDate } from '@/utils/formatTime'
import { genFileId, UploadInstance, UploadProps, UploadRawFile } from 'element-plus'

const emit = defineEmits(['success'])

const props = defineProps<{
  scPurchaseRequestOrderId?: string
}>()

const message = useMessage()

const isShowDialog = ref(false)

const fileList = ref<any[]>([])
const uploadRef = ref<UploadInstance>()
const uploadDialogRef = ref()
const uploadType = ref(1)

function open() {
  isShowDialog.value = true
}

function onClosed() {
  isShowDialog.value = false
  fileList.value = []
}

const submitLoading = ref(false)
async function onsubmit() {
  submitLoading.value = true
  const formData = new FormData()
  fileList.value.forEach((file) => {
    formData.append('file', file.raw)
  })

  try {
    const res = await uploadPurchaseOrderFiles(formData, props.scPurchaseRequestOrderId ?? '')

    if (res.success) {
      isShowDialog.value = false
      message.success('导入成功')
      emit('success', res.data, uploadType.value)
    }
  } catch (error) {
  } finally {
    submitLoading.value = false
  }
}

function onCancel() {
  uploadDialogRef.value?.handleClose()
}

async function handleDownload() {
  try {
    const res = await exportDetail(props.scPurchaseRequestOrderId ?? '')
    if (!res) return
    download.excel(res, `生产订单导入模板-${formatDate(new Date(), 'YYYYMMDDHHmmss')}.xlsx`)
    message.success('下载成功')
  } catch (error) {}
}

const handleExceed: UploadProps['onExceed'] = (files) => {
  uploadRef.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  uploadRef.value!.handleStart(file)
}

defineExpose({ open })
</script>
<style lang="less"></style>
