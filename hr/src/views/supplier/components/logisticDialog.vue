<template>
  <s-w-dialog
    :model-value="isShow"
    :title="`物流信息（${asrCode}）`"
    width="600"
    @closed="handleCancel"
    @open="getDetail"
  >
    <div @paste="handlePaste">
      <el-form :model="formData" ref="formRef" :rules="rules" label-width="100">
        <el-row>
          <el-col :span="12">
            <el-form-item label="物流公司：" prop="logisticsCompany">
              <el-input
                v-model.trim="formData.logisticsCompany"
                :disabled="readOnly"
                placeholder="请输入物流公司"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="物流单号：" prop="logisticsNo">
              <el-input
                v-model.trim="formData.logisticsNo"
                :disabled="readOnly"
                placeholder="请输入物流单号"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col v-if="!!logisticsRecordFlag" :span="12">
            <el-form-item label="登记人：">
              <el-input :model-value="formData.creater.name" disabled />
            </el-form-item>
          </el-col>
          <el-col v-if="!!logisticsRecordFlag" :span="12">
            <el-form-item label="登记时间：">
              <el-input v-model="formData.createdAt" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="物流单：">
          <el-upload
            ref="uploadRef"
            v-model="fileList"
            multiple
            name="files"
            list-type="picture-card"
            accept="image/*"
            :class="{ hideUpload: readOnly }"
            :disabled="readOnly"
            :limit="1"
            :action="importUrl"
            :data="{ code: 'SUPPLY_CHAIN' }"
            :headers="uploadHeaders"
            :before-upload="handleBeforeUpload"
            :on-success="handleSuccess"
            :on-exceed="handleExceed"
            @preview="previewRef?.showPreview()"
            :on-remove="handleRemove"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
    </div>
    <el-image
      class="w0 h0"
      :src="fileList[0]?.fileUrl"
      ref="previewRef"
      :previewSrcList="[fileList[0]?.fileUrl!]"
      preview-teleported
    />
    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" :loading="loading" :disabled="loading" @click="handleSubmit">
        确定
      </el-button>
    </template>
  </s-w-dialog>
</template>
<script lang="ts" setup>
import {
  scAsrLogisticsRecordApi,
  scAsrLogisticsRecordQueryByAsrIdApi,
  updateScAsrLogisticsRecordApi
} from '@/api/supplier/appoint'
import { getAccessToken } from '@/utils/auth'
import {
  FormInstance,
  FormRules,
  genFileId,
  ImageInstance,
  UploadInstance,
  UploadProps,
  UploadRawFile
} from 'element-plus'

const message = useMessage()

const props = defineProps<{
  asrId?: string
  isShow: boolean
  asrCode?: string
  logisticsRecordFlag?: 0 | 1
  readOnly?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:is-show', value: boolean): void
  (e: 'refresh'): void
}>()

const formData = reactive({
  id: undefined as string | undefined,
  logisticsCompany: '',
  logisticsNo: '',
  url: '',
  advancedShippingRequestOrderId: '',
  creater: { name: '' } as Record<string, any>,
  createdAt: ''
})
const formRef = ref<FormInstance>()
const rules: FormRules = {
  logisticsCompany: { required: true, message: '请输入物流公司' },
  logisticsNo: { required: true, message: '请输入物流单号' }
}
const fileList = ref<any[]>([])
const importUrl =
  import.meta.env.VITE_BASE_URL + import.meta.env.VITE_API_URL + '/api/ossInfo/upload'
const uploadHeaders = ref({ token: getAccessToken() })
const uploadRef = ref<UploadInstance>()
const previewRef = ref<ImageInstance>()

const loading = ref(false)
async function handleSubmit() {
  loading.value = true

  try {
    await formRef.value?.validate()
    const params = {
      logisticsCompany: formData.logisticsCompany,
      logisticsNo: formData.logisticsNo,
      advancedShippingRequestOrderId: props.asrId || '',
      url: fileList.value.map((item) => item.fileUrl + '?name=' + item.fileName).join(','),
      id: formData.id
    }
    const api = !props.logisticsRecordFlag ? scAsrLogisticsRecordApi : updateScAsrLogisticsRecordApi
    const res = await api(params)
    if (res.success) {
      message.success('提交成功！')
      emit('update:is-show', false)
      emit('refresh')
    }
  } catch (error) {
  } finally {
    loading.value = false
  }
}

function handleCancel() {
  emit('update:is-show', false)
  nextTick(() => {
    formRef.value?.resetFields()
    uploadRef.value?.clearFiles()
    fileList.value = []
  })
}

function handleSuccess(res: any) {
  fileList.value?.push(res.data[0])
}

function handleBeforeUpload(rawFile: UploadRawFile) {
  const filesMap = new Map(fileList.value.map((ele) => [ele.fileName, ele]))
  if (filesMap.has(rawFile.name)) {
    message.warning('文件名重复')
    return false
  }
}

// 监听paste事件
const handlePaste = async (evt) => {
  if (props.readOnly) return
  const txt = evt.clipboardData.getData('Text')
  if (typeof txt == 'string' && txt !== '') {
    return
  }
  let file = null
  const items = (evt.clipboardData || window.Clipboard).items
  if (!items.length) return
  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf('image') !== -1) {
      file = items[i].getAsFile()
      break
    }
  }
  if (file) {
    // uploadRef.value?.handleStart(file)
    // uploadRef.value?.submit()
    handleExceed([file], [])
  }
}

async function getDetail() {
  if (!props.logisticsRecordFlag || !props.asrId) return
  try {
    const res = await scAsrLogisticsRecordQueryByAsrIdApi(props.asrId)
    Object.assign(formData, res)

    if (res.url) {
      const file = await urlToUploadRawFile(res.url, '')
      uploadRef.value?.handleStart(file)

      fileList.value.push({ fileUrl: res.url })
    }
  } catch (error) {}
}

async function urlToUploadRawFile(url, filename) {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`请求失败: ${response.status}`)
    }
    const blob = await response.blob()
    const file = new File([blob], filename, { type: blob.type }) as UploadRawFile

    file.uid = Date.now()
    file.isDirectory = true

    return file
  } catch (error) {
    console.error('URL 转 UploadRawFile 失败:', error)
    throw error
  }
}

const handleExceed: UploadProps['onExceed'] = (files) => {
  fileList.value.splice(0, 1)
  uploadRef.value?.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  uploadRef.value?.handleStart(file)
  uploadRef.value?.submit()
}

function handleRemove() {
  fileList.value = []
}
</script>
<style lang="less" scoped>
.el-upload__tip {
  margin-top: 0;
}

:deep(.el-upload-list--text) {
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

:deep(.el-upload-list) {
  display: block;
  max-height: calc((1.2em + 5px) * 10);
  overflow-y: auto;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 5px;
    margin-left: 10px;
  }
}

:deep(.el-form-item__content) > div {
  flex: 0.9;
}

:deep(.el-upload-list) {
  display: flex;
}

:deep(.el-upload-list__item) {
  transition: none;
}

.hideUpload {
  :deep(.el-upload) {
    display: none;
  }
}
</style>
