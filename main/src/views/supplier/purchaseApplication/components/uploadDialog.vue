<template>
  <s-w-dialog
    width="600"
    ref="uploadDialogRef"
    v-model="isShowDialog"
    @closed="onClosed"
    @opened="handleOpened"
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
import { importDetailsApi } from '@/api/supplier/purchaseApplication'
import { downloadByUrl2 } from '@/utils/download'
import { DialogInstance, UploadInstance } from 'element-plus'

const emit = defineEmits(['success'])

const message = useMessage()

const props = withDefaults(
  defineProps<{
    showUploadType?: boolean
    fileUrl?: string
    uploadApi?: (data: FormData, params: any) => Promise<any>
    productTypeCode?: any
  }>(),
  {
    showUploadType: true,
    fileUrl:
      'https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/test/common/671753ac-f9af-4b79-9777-9292ffa85f80.xlsx',
    uploadApi: importDetailsApi
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
  const uploadDom = document.querySelector('.el-dialog')
  uploadDom?.removeEventListener('paste', handlePaste)
  isShowDialog.value = false
  fileList.value = []
}

const loading = ref(false)
async function onsubmit() {
  if (fileList.value.length === 0) return message.warning('请先上传文件')
  loading.value = true
  const formData = new FormData()
  fileList.value.forEach((file) => {
    formData.append('file', file.raw)
  })

  try {
    const res = await props.uploadApi(formData, { productTypeCode: props.productTypeCode })

    if (res.success) {
      isShowDialog.value = false
      message.success('导入成功')
      emit('success', res.data, uploadType.value)
    }
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}

function onCancel() {
  isShowDialog.value = false
}

function handleDownload() {
  downloadByUrl2(props.fileUrl, '运营备货申请导入模板.xlsx')
}

function handleOpened() {
  const uploadDom = document.querySelector('.el-dialog')
  uploadDom?.addEventListener('paste', handlePaste)
}

const handlePaste = async (evt) => {
  const txt = evt.clipboardData.getData('Text')
  if (typeof txt == 'string' && txt !== '') {
    return
  }
  const items = (evt.clipboardData || window.Clipboard).items
  if (!items.length) return
  if (items.length > 1) return message.warning('请勿上传多个文件！')
  uploadRef.value?.handleStart(items[0].getAsFile())
}

defineExpose({ open })
</script>
