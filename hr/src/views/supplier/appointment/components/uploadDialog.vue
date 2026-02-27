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
        <el-button class="mt16px" type="primary" @click="handleDownload">下载导入模板</el-button>
        <div class="el-upload__tip"> 只能导入xls、xlsx文件，且不能超过100MB </div>
      </template>
    </el-upload>
    <template #footer>
      <el-button type="primary" @click="onsubmit">确定</el-button>
      <el-button @click="onClosed">取消</el-button>
    </template>
  </s-w-dialog>
  <div class="print-table">
    <div class="item header"></div>
  </div>
</template>
<script lang="ts" setup>
import { uploadPackingListApi } from '@/api/supplier/appoint'
import { downloadByUrl2 } from '@/utils/download'
import { DialogInstance, genFileId, UploadInstance, UploadProps, UploadRawFile } from 'element-plus'

interface Emit {
  (e: 'success', data: any): void
}

const emit = defineEmits<Emit>()

const props = defineProps<{
  poId: string
}>()

const message = useMessage()

const isShowDialog = ref(false)

const fileList = ref<any[]>([])
const uploadRef = ref<UploadInstance>()
const uploadDialogRef = ref<DialogInstance>()

function open() {
  isShowDialog.value = true
}

function onClosed() {
  isShowDialog.value = false
  fileList.value = []
}

async function onsubmit() {
  const formData = new FormData()
  fileList.value.forEach((file) => {
    formData.append('file', file.raw)
  })

  try {
    const res = await uploadPackingListApi({ poId: props.poId }, formData)

    if (res) {
      isShowDialog.value = false
      message.success('导入成功')
      emit('success', res)
    }
  } catch (error) {}
}

async function handleDownload() {
  try {
    downloadByUrl2(
      'https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/supplyChain/e19993d9-088e-4307-be56-7d7e6ef5354c.xlsx',
      '装箱单导入模板.xlsx'
    )
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
