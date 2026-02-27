<template>
  <s-w-dialog :model-value="isShow" :title="`${title}（${asrCode}）`" @closed="handleCancel">
    <el-form :model="formData" ref="formRef" :rules="rules" label-width="100">
      <el-form-item label="撤回说明：" prop="comment">
        <s-text-area v-model="formData.comment" :rows="5" placeholder="请输入撤回说明" :maxlength="200" show-word-limit />
      </el-form-item>
      <el-form-item label="附件：" prop="attachmentUrls">
        <el-upload ref="uploadRef" v-model="fileList" multiple name="files"
          accept=".xlsx,.xls,image/*,.txt,.pdf,.doc,.docx" :action="importUrl" :data="{ code: 'SUPPLY_CHAIN' }"
          :headers="uploadHeaders" :before-upload="handleBeforeUpload" :on-success="handleSuccess"
          :on-remove="handleRemove">
          <el-button type="primary">选择文件</el-button>

          <template #tip>
            <div class="el-upload__tip">请上传 图片、txt、excel、pdf、word 类型的文件 </div>
          </template>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" :loading="loading" :disabled="loading" @click="handleSubmit">
        确定
      </el-button>
    </template>
  </s-w-dialog>
</template>
<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { scAdvancedShippingRequestOrderCancelApi } from '@/api/supplier/appoint'
import { getAccessToken } from '@/utils/auth'
import { FormInstance, FormRules, UploadFile, UploadInstance, UploadRawFile } from 'element-plus'

const message = useMessage()

const props = withDefaults(
  defineProps<{
    asrId?: string
    isShow: boolean
    asrCode?: string
    title?: string
  }>(),
  {
    title: '撤回发货预约单'
  }
)

const emit = defineEmits<{
  (e: 'update:is-show', value: boolean): void
  (e: 'refresh'): void
}>()

const formData = reactive({
  comment: '',
  attachmentUrls: [] as string[]
})
const formRef = ref<FormInstance>()
const rules: FormRules = {
  comment: { required: true, message: '请输入撤回原因' }
}
const fileList = ref<any[]>([])
const importUrl =
  import.meta.env.VITE_BASE_URL + import.meta.env.VITE_API_URL + '/api/ossInfo/upload'
const uploadHeaders = ref({ token: getAccessToken() })
const uploadRef = ref<UploadInstance>()

watch(
  () => fileList.value,
  (val) => {
    formData.attachmentUrls = val.map(
      (res) => res.data[0].fileUrl + '?name=' + res.data[0].fileName
    )
  },
  { deep: true }
)

const loading = ref(false)
async function handleSubmit() {
  loading.value = true
  await message.confirm(
    `您确定要撤回 ${props.asrCode} 发货预约单吗？频繁撤回发货预约单可能会影响您的考核评分`
  )
  try {
    await formRef.value?.validate()
    const res = await scAdvancedShippingRequestOrderCancelApi({
      ...formData,
      asrId: props.asrId || ''
    })
    if (res.success) {
      message.success('撤回成功！')
      emit('refresh')
      handleCancel()
    }
  } catch (error) {
  } finally {
    loading.value = false
  }
}

function handleCancel() {
  Object.assign(formData, {})
  formRef.value?.resetFields()
  uploadRef.value?.clearFiles()
  emit('update:is-show', false)
}

function handleSuccess(res: any) {
  fileList.value?.push(res)
}

function handleRemove(file: UploadFile & UploadRawFile) {
  const fileListMap = new Map(fileList.value.map((ele) => [ele.data[0].fileName, ele]))
  if (file.response?.data) {
    fileListMap.delete(file.response.data[0].fileName)
  }
  fileList.value = [...Array.from(fileListMap.values())]
}

function handleBeforeUpload(rawFile: UploadRawFile) {
  const filesMap = new Map(fileList.value.map((ele) => [ele.data[0].fileName, ele]))
  if (filesMap.has(rawFile.name)) {
    message.warning('文件名重复')
    return false
  }
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

:deep(.el-form-item__content)>div {
  flex: 0.9;
}
</style>
