<!--
 * @Author: wangxifeng-ZJ3bu
 * @Date: 2026-01-21 10:00:00
 * @LastEditors: wangxifeng-ZJ3bu
 * @LastEditTime: 2026-02-02 11:41:43
-->
<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :width="dialogType === 'view' ? '500px' : '600px'"
    :close-on-click-modal="false"
    destroy-on-close
  >
    <!-- 查看SKU表格 -->
    <div v-if="dialogType === 'view'" class="sku-table-container" v-loading="loading">
      <scheme-table
        :column="skuColumn"
        :table-data="skuList"
        :list-name="'SKU列表'"
        :btn-list="[]"
        :handle-column="[]"
        name="skuTable"
        :show-screen="false"
      />
    </div>

    <!-- 上传SKU -->
    <div v-if="dialogType === 'upload'">
      <!-- <UploadTransfer
        v-model="uploadFile"
        ref="uploadRef"
        :limit="1"
        :accept-type="'excel'"
        :disabled="uploading"
        :upload-data="{ code: 'ORDER_STRUCTURE_SKU' }"
        :value-type="'string'"
        tip="支持上传Excel文件，单个文件不超过20M，仅限1个文件"
        @uploadSuccess="handleUploadChange"
      /> -->
      <el-upload
        ref="uploadRef"
        drag
        v-model:file-list="fileList"
        :auto-upload="false"
        :limit="1"
        name="file"
        accept=".xlsx,.xls"
        :on-change="handleUploadChange"
        :on-exceed="handleExceed"
        :show-file-list="false"
      >
        <el-icon class="el-icon--upload">
          <UploadFilled />
        </el-icon>
        <div class="el-upload__text">
          拖入文件上传或 <em>点击上传</em> <div>仅支持导入xls/xlsx文件</div>
        </div>
      </el-upload>
      <div v-if="fileList.length" class="custom-file-list">
        <div class="file-row">
          <img :src="excelIcon" alt="excel" class="file-icon" />
          <span class="file-name">{{ fileList[0].name }}</span>
          <el-button type="danger" link @click="removeFile" :disabled="uploading" circle>
            <el-icon><Delete /></el-icon>
          </el-button>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <div>
          <el-button v-if="dialogType === 'upload'" type="primary" @click="handleDownloadTemplate"
            >下载模板</el-button
          >
        </div>
        <div>
          <el-button @click="handleClose">取消</el-button>
          <el-button
            v-if="dialogType === 'upload'"
            type="primary"
            :loading="uploading"
            :disabled="!uploadFile"
            @click="handleUploadSubmit"
          >
            确认上传
          </el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="tsx">
export default { name: 'SkuDialog' }
</script>

<script lang="tsx" setup>
import request from '@/config/axios'
import { PageItem } from '@/components/template/config/type'
import { UploadUserFile } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'
import excelIcon from '@/assets/svgs/common/file_excel.svg'
import download from '@/utils/download'
const message = useMessage()

const dialogVisible = ref(false)
const dialogType = ref<'view' | 'upload'>('view')
const uploading = ref(false)
const uploadFile = ref('')
const skuList = ref<Array<any>>([])
const fileList = ref<UploadUserFile[]>([])
const uploadRef = ref<any>()
const dialogTitle = computed(() => {
  return dialogType.value === 'view' ? '查看SKU' : '上传SKU'
})
const page = ref<PageItem>({
  ...new PageItem()
})
// SKU表格列配置
const skuColumn = computed(() => [{ field: 'sku', title: 'SKU', minWidth: 100 }])
const loading = ref(false)
// 打开对话框
const openDialog = (type: 'view' | 'upload') => {
  dialogType.value = type
  dialogVisible.value = true

  if (type === 'view') {
    loadSkuData()
  } else {
    uploadFile.value = ''
  }
}

// 加载SKU数据
const loadSkuData = async () => {
  loading.value = true
  try {
    // TODO: 替换为实际的API接口
    const res = await request.get({ url: '/api/productBundlingAnalysis/querySkuInfo' })
    skuList.value = res || []
  } catch (error) {
    console.error('加载SKU数据失败:', error)
    message.error('加载SKU数据失败')
  } finally {
    loading.value = false
  }
}

// 上传文件变化
const handleUploadChange = (file: any) => {
  const raw = (file as any)?.raw || file
  if (raw && !validateFile(raw)) {
    uploadRef.value?.clearFiles()
    fileList.value = []
    uploadFile.value = ''
    return
  }
  uploadFile.value = file?.name || ''
  console.log('文件已选择:', file)
}

const handleExceed = () => {
  message.error('最多只能上传一个文件！')
}

const allowedExtensions = ['.xlsx', '.xls']
const allowedMimeTypes = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel'
]

// 文件验证函数（在 on-change 中调用）
const validateFile = (file: File) => {
  const extension = file.name?.substring(file.name.lastIndexOf('.')).toLowerCase()
  const isValidExt = allowedExtensions.includes(extension)
  const isValidType = allowedMimeTypes.includes(file.type)
  if (!isValidExt && !isValidType) {
    message.error('仅支持导入xls/xlsx文件')
    return false
  }
  return true
}

// 移除文件
const removeFile = () => {
  if (uploading.value) return
  uploadRef.value?.clearFiles()
  fileList.value = []
  uploadFile.value = ''
}

const handleDownloadTemplate = () => {
  request
    .download({ url: '/api/productBundlingAnalysis/exportTemplate' })
    .then((res: any) => {
      download.excel(res, 'SKU模板.xlsx')
      message.success('下载模板成功')
    })
    .catch((error: any) => {
      message.error('下载模板失败')
      console.error('下载模板失败:', error)
    })
}

// 提交上传
const handleUploadSubmit = async () => {
  if (!fileList.value || fileList.value.length === 0) {
    message.warning('请先选择文件')
    return
  }

  const rawFile = fileList.value[0]?.raw as File
  if (!rawFile) {
    message.error('文件无效，请重新选择')
    return
  }

  uploading.value = true
  try {
    // 构建 FormData
    const formData = new FormData()
    formData.append('file', rawFile)
    // formData.append('fileName', rawFile.name)

    await request.formPost({
      url: '/api/productBundlingAnalysis/uploadSkuInfo',
      data: formData
    })

    message.success('上传成功')
    handleClose()

    // 触发父组件刷新
    emit('success')
  } catch (error: any) {
    console.error('上传失败:', error)
    message.error(error.message || '上传失败，请重试')
  } finally {
    uploading.value = false
  }
}

// 关闭对话框
const handleClose = () => {
  dialogVisible.value = false
  uploadFile.value = ''
  uploading.value = false
  fileList.value = []
  uploadRef.value?.clearFiles()
}

const emit = defineEmits(['success'])

defineExpose({ openDialog })

provide('skuTableForm', {
  page
})
</script>

<style lang="scss" scoped>
.sku-table-container {
  min-height: 400px;
  max-height: 600px;
  overflow-y: auto;
}

:deep() {
  .el-upload-list__item-name {
    line-height: 20px;
  }
}
.el-upload__text {
  > div {
    margin-top: 8px;
  }
}

.dialog-footer {
  display: flex;
  justify-content: space-between;
  gap: 12px;
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
}

.el-button.is-circle {
  width: unset;
  padding: unset;
}
</style>
