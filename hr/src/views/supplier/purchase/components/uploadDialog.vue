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
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text"> 拖入文件上传或 <em>点击上传</em> </div>
      <template #tip>
        <el-button class="mt16px" type="primary" @click="handleDownload">下载导入模板</el-button>
        <div class="el-upload__tip"> 只能导入xls、xlsx、csv文件，且不能超过100MB </div>
        <el-radio-group v-if="showUploadType" v-model="uploadType">
          <el-radio :value="1">导入数据追加</el-radio>
          <el-radio :value="2">导入数据覆盖</el-radio>
        </el-radio-group>
      </template>
    </el-upload>
    <template #footer>
      <el-button type="primary" :loading="loading" :disabled="loading" @click="onsubmit">
        确定
      </el-button>
      <el-button @click="onCancel">取消</el-button>
    </template>
  </s-w-dialog>
</template>
<script lang="ts" setup>
import { uploadPurchaseFiles } from '@/api/supplier/purchase'
import { downloadByUrl2 } from '@/utils/download'
import { DialogInstance, UploadInstance } from 'element-plus'

const emit = defineEmits(['success'])

const message = useMessage()

const props = withDefaults(
  defineProps<{
    showUploadType?: boolean
    fileUrl?: string
    uploadApi?: (data: FormData) => Promise<any>
  }>(),
  {
    showUploadType: true,
    fileUrl:
      'https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/supplyChain/b74653b7-6297-430e-8f8f-5d21143940f4.xlsx',
    uploadApi: uploadPurchaseFiles
  }
)

const isShowDialog = ref(false)

const fileList = ref<any[]>([])
const uploadRef = ref<UploadInstance>()
const uploadDialogRef = ref<DialogInstance>()
const uploadType = ref(1)

function open() {
  isShowDialog.value = true
}

function onClosed() {
  isShowDialog.value = false
  fileList.value = []
}

const loading = ref(false)
async function onsubmit() {
  loading.value = true
  const formData = new FormData()
  fileList.value.forEach((file) => {
    formData.append('file', file.raw)
  })

  try {
    const res = await props.uploadApi(formData)

    if (res.success) {
      isShowDialog.value = false
      message.success('导入成功')
      emit('success', res.data, uploadType.value)
    }
  } catch (error) {
  } finally {
    loading.value = false
  }
}

function onCancel() {
  isShowDialog.value = false
}

function handleDownload() {
  downloadByUrl2(props.fileUrl, '需求清单导入模板.xlsx')
}

defineExpose({ open })
</script>
