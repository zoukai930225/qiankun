<template>
  <el-dialog
    width="600"
    class="uploadDialog"
    v-model="isShowDialog"
    :before-close="onBeforeClose"
    title="文件上传"
  >
    <el-divider />
    <el-upload
      ref="uploadRef"
      drag
      v-model:file-list="fileList"
      multiple
      name="files"
      :auto-upload="false"
      :limit="2"
      :on-change="handleChange"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text"> 拖入文件上传或 <em>点击上传</em> </div>
      <template #tip>
        <div class="el-upload__tip">
          请在此处上传导出的货位库存和待补货商品文件，请勿修改导出文件，支持导入xls/xlsx文件
        </div>
      </template>
    </el-upload>
    <template #footer>
      <el-button type="primary" @click="onsubmit">确定</el-button>
      <el-button @click="onCancel">取消</el-button>
    </template>
  </el-dialog>
  <div class="print-table">
    <div class="item header"></div>
  </div>
</template>
<script lang="ts" setup>
import { uploadFiles } from '@/api/storage/tools'
import download from '@/utils/download'
import type { UploadProps } from 'element-plus'

const props = defineProps<{
  isShowDialog: boolean
}>()

const emit = defineEmits(['update:isShowDialog', 'update:isShowPrintDialog'])

const message = useMessage()

const isShowDialog = computed({
  get: () => props.isShowDialog,
  set: (val) => emit('update:isShowDialog', val)
})

const fileList = ref<any[]>([])
const uploadRef = ref()

function onBeforeClose(done: () => void) {
  emit('update:isShowPrintDialog', true)
  done()
}

const handleChange: UploadProps['onChange'] = (_, uploadFiles) => {
  const [file, file1] = uploadFiles
  if (file?.name === file1?.name) {
    message.warning('文件名称重复，请修改文件名后重新上传')
    uploadFiles.pop()
  }
}

async function onsubmit() {
  if (fileList.value.length < 2) return message.warning('请上传两个文件')
  const formData = new FormData()
  fileList.value.forEach((file) => {
    formData.append('files', file.raw)
  })

  try {
    const res = await uploadFiles(formData)
    await nextTick()
    download.excel(res, '补货单.xlsx')
    isShowDialog.value = false
    message.success('补货单生成成功')
  } catch (error) {}
}

function onCancel() {
  emit('update:isShowPrintDialog', true)
  isShowDialog.value = false
}
</script>
<style lang="less">
.uploadDialog {
  padding: 30px;
  height: 430px;
  border-radius: 12px;
  background-image: url('/src/assets/imgs/storage/dialog-bg.png') !important;
  background-size: cover;
  background-repeat: no-repeat;
  .el-divider {
    margin-top: 0;
  }
  .el-dialog__footer {
    position: absolute;
    right: 30px;
    bottom: 30px;
  }
}
</style>
