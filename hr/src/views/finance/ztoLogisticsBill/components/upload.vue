<template>
  <el-form :model="form" :rules="rules" ref="formRef" :inline="false">
    <div class="mb-16px">
      <el-alert
        title="！！！当前支持的EXCEL表头为：运单号、包号、扫描时间、业务员、目的地省、目的地市、结算重量、重量、运单发放、主店铺、运单发放网点、分区、新疆西藏、3KG以上费用。如果发生变动，会导致失败，请联系产品处理"
        type="warning"
        :closable="false"
      />
    </div>
    <el-form-item label="选择Excel文件" prop="file">
      <el-upload
        ref="uploadRef"
        drag
        v-model:file-list="fileList"
        :auto-upload="false"
        :limit="1"
        name="file"
        accept=".xlsx,.xls"
        :before-upload="beforeUpload"
        :on-change="handleChange"
        :on-exceed="handleExceed"
        :show-file-list="false"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text"> 拖入文件上传或 <em>点击上传</em> </div>
        <template #tip>
          <div class="el-upload__tip"> 仅支持导入xls/xlsx文件</div>
        </template>
      </el-upload>
      <div v-if="fileList.length" class="custom-file-list">
        <div class="file-row">
          <img :src="excelIcon" alt="excel" class="file-icon" />
          <span class="file-name">{{ fileList[0].name }}</span>
          <el-button type="danger" link @click="removeFile" :disabled="loading" circle>
            <el-icon><Delete /></el-icon>
          </el-button>
        </div>
        <div v-if="showProgress" class="file-progress">
          <el-progress :percentage="uploadPercentage" :status="progressStatus" />
        </div>
      </div>
    </el-form-item>
  </el-form>
</template>
<script lang="tsx" setup>
import { ref, computed } from 'vue'
import { UploadFilled, Delete } from '@element-plus/icons-vue'
import { uploadExcel } from '@/api/finance/zto'
import type { UploadUserFile } from 'element-plus'
import { useMessage } from '@/hooks/web/useMessage'
import excelIcon from '@/assets/svgs/common/file_excel.svg'

const props = defineProps<{ onUploaded?: () => void }>()

const form = ref({
  file: ''
})

const rules = ref({
  file: [{ required: true, message: '请上传文件', trigger: 'change' }]
})

const formRef = ref()

const uploadRef = ref()

const fileList = ref<UploadUserFile[]>([])

const loading = ref(false)
const uploadPercentage = ref(0)
const showProgress = ref(false)
const progressStatus = ref<'success' | 'exception' | undefined>(undefined)
const message = useMessage()
const isSubmitDisabled = computed(
  () => !fileList.value.length || loading.value || progressStatus.value === 'success'
)
let abortController: AbortController | null = null

const handleExceed = () => {
  message.error('最多只能上传一个文件！')
}

const handleChange = (file: any) => {
  const raw = (file as any)?.raw || file
  if (raw && beforeUpload && beforeUpload(raw) === false) {
    uploadRef.value?.clearFiles()
    fileList.value = []
    form.value.file = ''
    uploadPercentage.value = 0
    return
  }
  // reset progress when selecting a new valid file
  uploadPercentage.value = 0
  progressStatus.value = undefined
  showProgress.value = false
  form.value.file = file?.name || ''
}

const maxFileSizeMB = 10
const allowedExtensions = ['.xlsx', '.xls']
const allowedMimeTypes = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel'
]

const beforeUpload = (file: File) => {
  const extension = file.name?.substring(file.name.lastIndexOf('.')).toLowerCase()
  const isValidExt = allowedExtensions.includes(extension)
  const isValidType = allowedMimeTypes.includes(file.type)
  if (!isValidExt && !isValidType) {
    message.error('仅支持导入xls/xlsx文件')
    return false
  }
  // const maxBytes = maxFileSizeMB * 1024 * 1024
  // if (file.size > maxBytes) {
  //   message.error(`文件大小不能超过${maxFileSizeMB}MB`)
  //   return false
  // }
  return true
}

const removeFile = () => {
  if (loading.value) return
  uploadRef.value?.clearFiles()
  fileList.value = []
  form.value.file = ''
  uploadPercentage.value = 0
  progressStatus.value = undefined
  showProgress.value = false
}

const handleSubmit = async (onClose: () => void) => {
  console.error('handleSubmit', form.value)
  try {
    await formRef.value?.validate()
  } catch (e) {
    return
  }
  if (!fileList.value || fileList.value.length === 0) {
    message.error('请先选择Excel文件')
    return
  }
  const rawFile = fileList.value[0]?.raw as File
  if (!rawFile) {
    message.error('文件无效，请重新选择')
    return
  }
  const formData = new FormData()
  formData.append('file', rawFile)
  formData.append('fileName', rawFile.name)
  try {
    loading.value = true
    uploadPercentage.value = 0
    progressStatus.value = undefined
    showProgress.value = true
    abortController = new AbortController()
    const res: any = await uploadExcel(formData, {
      onUploadProgress: (e: any) => {
        const total = e?.total || rawFile.size || 1
        const percent = Math.round((e?.loaded / total) * 100)
        uploadPercentage.value = Math.min(99, Math.max(0, percent))
      },
      signal: abortController.signal
    })
    if (res && (res.code === 200 || res.success)) {
      uploadPercentage.value = 100
      progressStatus.value = 'success'
      message.success('上传成功')
      props.onUploaded?.()
      // uploadRef.value?.clearFiles()
      // form.value.file = ''
      onClose()
    } else {
      progressStatus.value = 'exception'
      message.error('上传失败')
    }
  } catch (err: any) {
    if (err?.code === 'ERR_CANCELED') {
      progressStatus.value = undefined
      showProgress.value = false
      message.info('已取消上传')
    } else {
      progressStatus.value = 'exception'
      message.error('上传失败')
    }
  } finally {
    loading.value = false
    abortController = null
  }
}

const beforeClose = async (onClose: () => void) => {
  if (!loading.value) {
    onClose()
    return
  }
  try {
    await message.confirm('文件正在上传，确认要退出并取消上传吗？')
    abortController?.abort()
    onClose()
  } catch (e) {
    // 用户取消退出
  }
}

const renderFooter = ({
  onClose,
  onConfirmClose
}: {
  onClose: () => void
  onConfirmClose: () => void
}) => {
  return (
    <div>
      <el-button onClick={() => onConfirmClose()}>取消</el-button>
      <el-button
        type="primary"
        loading={loading.value}
        disabled={isSubmitDisabled.value}
        onClick={() => handleSubmit(onClose)}
      >
        开始上传
      </el-button>
    </div>
  )
}

defineExpose({ renderFooter, beforeClose })
</script>
<style scoped lang="scss">
.el-form {
  .el-form-item {
    display: block;
    :deep(.el-form-item__content) {
      display: block;
      width: 100%;
    }
  }
}
.custom-file-list {
  margin-top: 8px;
  .file-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .file-icon {
    width: 20px;
    height: 20px;
    flex: 0 0 20px;
  }
  .file-name {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .file-progress {
    margin-top: 8px;
    width: 100%;
    :deep(.el-progress) {
      width: 100%;
    }
  }
}
.el-progress {
  :deep(.el-progress__text) {
    min-width: unset;
  }
}
.el-button.is-circle {
  width: unset;
  padding: unset;
}
</style>
