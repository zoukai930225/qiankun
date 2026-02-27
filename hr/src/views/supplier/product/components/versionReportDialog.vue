<template>
  <s-w-dialog
    :model-value="isShow"
    :title="`批版报告（${scPurchaseOrderNo}）`"
    width="750"
    @closed="handleCancel"
    @open="handleOpen"
  >
    <el-form :model="formData" ref="formRef" :rules="rules" label-width="100">
      <el-row>
        <el-col :span="12">
          <el-form-item label="快递单号：" prop="expressNo">
            <el-input
              v-model.trim="formData.expressNo"
              placeholder="请输入快递单号"
              clearable
              :disabled="isCheck"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="批版报告：">
        <el-upload
          ref="uploadRef"
          v-if="!isCheck"
          v-model:file-list="fileList"
          name="files"
          :data="{ code: 'SUPPLY_CHAIN' }"
          drag
          multiple
          :action="importUrl"
          :headers="uploadHeaders"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
          :before-upload="handleBeforeUpload"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text"> 拖拽、粘贴上传或 <em>点击此处</em> </div>

          <template #tip>
            <div class="el-upload__tip"> 文件大小不超过5MB </div>
          </template>
        </el-upload>

        <el-scrollbar v-else>
          <div class="files-image">
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
        </el-scrollbar>
      </el-form-item>
    </el-form>
    <el-image
      class="w0 h0"
      :src="fileList[0]?.fileUrl"
      ref="previewRef"
      :previewSrcList="[fileList[0]?.fileUrl!]"
      preview-teleported
    />
    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button
        v-if="status === '18'"
        type="primary"
        :loading="loading"
        :disabled="loading"
        @click="handleSubmit"
      >
        确定
      </el-button>
    </template>
  </s-w-dialog>
</template>
<script lang="ts" setup>
import { addPatternApprovalReportApi, getPatternApprovalReportApi } from '@/api/supplier/purchase'
import { getAccessToken } from '@/utils/auth'
import { FormInstance, FormRules, UploadInstance } from 'element-plus'
// 引入文件类型图标
import fileExcel from '@/assets/imgs/excel.svg'
import filePdf from '@/assets/imgs/pdf.svg'
import fileDoc from '@/assets/imgs/doc.svg'
import filePpt from '@/assets/imgs/ppt.svg'
import { isExcel, isImage, isPDF, isPPT, isWord, microsoftOnlinePreviewUrl } from '@/utils/file'
import { downloadByUrl2 } from '@/utils/download'

const message = useMessage()

const props = defineProps<{
  isShow: boolean
  scPurchaseOrderNo: string
  status: string
}>()

const emit = defineEmits<{
  (e: 'update:is-show', value: boolean): void
  (e: 'refresh'): void
}>()

const formData = reactive({
  expressNo: '',
  scPurchaseOrderNo: '',
  fileUrl: ''
})
const formRef = ref<FormInstance>()
const rules: FormRules = {
  expressNo: { required: true, message: '请输入快递单号' }
}
const fileList = ref<any[]>([])
const importUrl =
  import.meta.env.VITE_BASE_URL + import.meta.env.VITE_API_URL + '/api/ossInfo/upload'
const uploadHeaders = ref({ token: getAccessToken() })
const uploadRef = ref<UploadInstance>()
const fileBoard = ref<{ name: string; url: string }[]>([])

const previewList = computed(() =>
  formData.fileUrl?.split(',').filter((ele) => {
    return isImage(ele)
  })
)
const isCheck = computed(() => !['18'].includes(props.status))

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

const loading = ref(false)
async function handleSubmit() {
  const loading = ElLoading.service({
    text: '数据上传中，请稍后...'
  })
  try {
    await formRef.value?.validate()

    const res = await addPatternApprovalReportApi({ ...formData })

    if (res.success) {
      message.success('上传成功！')
      emit('refresh')
      handleCancel()
    }
  } catch (error) {
  } finally {
    loading.close()
  }
}

function handleOpen() {
  if (props.status === '18') {
    uploadRef.value?.$el.focus()
    uploadRef.value?.$el?.addEventListener('paste', handlePaste)
    formData.scPurchaseOrderNo = props.scPurchaseOrderNo
  } else {
    getDetail()
  }
}

function handleOpenFiles({ name, url }) {
  if (isPPT(name) || isExcel(name) || isWord(name)) {
    window.open(microsoftOnlinePreviewUrl(url), '_blank')
  } else if (isPDF(name)) {
    window.open(url, '_blank')
  }
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

function handleCancel() {
  emit('update:is-show', false)
  nextTick(() => {
    formRef.value?.resetFields()
    uploadRef.value?.clearFiles()
    fileList.value = []
    fileBoard.value = []
  })
}

function handleUploadSuccess(res) {
  const url = new URL(res.data[0].fileUrl)
  url.searchParams.set('name', res.data[0].fileName)
  const urls = formData.fileUrl.split(',')
  urls.push(url.href)
  formData.fileUrl = urls.filter((url) => !!url).join(',')
  message.success('上传成功！')
}

function handleUploadError() {
  loading.value = false
  message.error('上传失败')
}

function handleBeforeUpload(file) {
  const maxSize = 5 * 1024 * 1024

  const isOverSize = file.size > maxSize

  if (isOverSize) {
    message.error(`文件大小不能超过 5MB！当前文件大小：${(file.size / 1024 / 1024).toFixed(2)}MB`)
    return false
  }

  return true
}

async function getDetail() {
  try {
    const res = await getPatternApprovalReportApi(props.scPurchaseOrderNo)

    if (!res) return

    formData.fileUrl = res.fileUrl as string
    formData.expressNo = res.expressNo

    fileBoard.value = formData.fileUrl
      .split(',')
      .filter((url) => !!url)
      .map((url) => {
        const FILE_URL = new URL(url)

        return {
          url: FILE_URL.href,
          name: FILE_URL.searchParams.get('name') as string
        }
      })
  } catch (error) {
    console.log(error)
  }
}
</script>
<style lang="less" scoped>
.el-upload__tip {
  margin-top: 0;
}

:deep(.el-upload-list__item-file-name),
:deep(.el-upload-list__item) {
  line-height: 1.2;
}

:deep(.el-upload-list__item) {
  display: flex;
  align-items: center;
  padding-bottom: 5px;
}

:deep(.el-form-item__content) > div {
  flex: 0.9;
}

:deep(.el-upload-list__item) {
  transition: none;
}

.hideUpload {
  :deep(.el-upload) {
    display: none;
  }
}

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
}
</style>
