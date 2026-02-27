<template>
  <s-w-dialog v-model="isShow" ref="dialogRef" width="577" append-to-body :title="`撤回生产订单 (${scPONo})`"
    @closed="handleClosed">
    <div class="commonTopFilterWrap">
      <div class="commonTopFilterWrap-filter">
        <el-form ref="queryRef" :model="formData" label-width="80">
          <el-form-item prop="revokeReason" label="撤回说明"
            :rules="[{ required: true, message: '请输入撤回说明', trigger: 'blur' }]">
            <s-text-area v-model.trim="formData.revokeReason" class="w-400px" :rows="4" placeholder="请输入撤回说明"
              clearable />
          </el-form-item>
          <el-form-item prop="remarks" label="附件">
            <el-upload ref="uploadRef" :action="importUrl" :headers="uploadHeaders" v-model:file-list="fileList"
              name="files" :limit="1" :data="{ code: 'SUPPLY_CHAIN' }" :before-upload="beforeUpload"
              :on-success="handleSuccess" :on-error="handleUploadError" :on-exceed="handleExceed"
              :on-remove="handleRemove" class="w-400px">
              <el-button type="primary">上传附件</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <template #footer>
      <div>
        <el-button @click="handleCancel">关闭</el-button>
        <el-button type="primary" @click="handleSubmit"> 保存 </el-button>
      </div>
    </template>
  </s-w-dialog>
</template>
<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { DialogInstance, FormInstance } from 'element-plus'
const uploadRef = ref()
const importUrl =
  import.meta.env.VITE_BASE_URL + import.meta.env.VITE_API_URL + '/api/ossInfo/upload'
const uploadHeaders = ref({ token: getAccessToken() }) // 上传 Header 头
import { recallOrderApi } from '@/api/supplier/purchase'
import { getAccessToken } from '@/utils/auth'
const message = useMessage() // 消息弹窗

const isShow = ref(false)
const scPONo = ref()
const formData = ref({
  id: '',
  revokeReason: '',
  attachment: ''
})
const queryRef = ref<FormInstance>()
const dialogRef = ref<DialogInstance>()

const fileList = ref<any[]>([])

const loadingInstance = ref()
const beforeUpload = () => {
  loadingInstance.value = ElLoading.service({ fullscreen: true, text: '附件上传中......' })

  return true // 允许文件上传
}
// 上传成功
const handleSuccess = (res: any) => {
  console.log('res', res.data[0])
  formData.value.attachment = (res.data[0].fileUrl || '') + '?name=' + res.data[0].fileName
  message.success('附件上传成功')
  loadingInstance.value.close()
}
// 上传失败
const handleUploadError = () => {
  formData.value.attachment = ''
  loadingInstance.value.close()
}
// 上传超出限制
const handleExceed = (files) => {
  uploadRef.value?.clearFiles()
  const file = files[0]
  uploadRef.value?.handleStart(file)
}
// 文件移除
const handleRemove = () => {
  console.log('remove')
  formData.value.attachment = ''
}
async function open(id?: string, scPurchaseOrderNo?: string) {
  isShow.value = true
  formData.value.id = id || ''
  scPONo.value = scPurchaseOrderNo || ''
}

async function handleCancel() {
  isShow.value = false
}
function handleClosed() {
  queryRef.value?.resetFields()
  fileList.value = []
}
const emits = defineEmits(['success'])
async function handleSubmit() {
  await queryRef.value?.validate()
  await message.confirm('您确定撤回该生产订单吗？撤回后供应商将无法对该订单预约发货')
  const loadingInstance = ElLoading.service({ fullscreen: true, text: '数据提交中......' })
  try {
    const res = await recallOrderApi(formData.value)
    if (res.success) {
      message.success('撤回成功')
      isShow.value = false
      emits('success')
    }
  } finally {
    loadingInstance.close()
  }
}

defineExpose({ open })
</script>
<style lang="less" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  img {
    margin-left: auto;
  }
}

.btns {
  text-align: center;
}

.el-dialog__body {
  padding: 20px !important;
}
</style>
