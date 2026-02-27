<template>
  <el-card shadow="never" class="!border-0 !rounded-16px" header="新增免检申请">
    <el-form label-width="90px" :rules="rules" :model="formData" ref="formRef">
      <el-row>
        <el-col>
          <el-form-item label="申请原因" prop="reason">
            <s-textarea
              v-model="formData.reason"
              :rows="5"
              :maxlength="500"
              show-word-limit
              placeholder="请输入申请原因"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="附件" prop="file">
            <files-upload
              v-model:modelValue="formData.file"
              :url="formData.file"
              ref="fileUploadRef"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
</template>
<script lang="ts" setup>
import { saveExemptionApplicationApi } from '@/api/supplier/shippingVerification'
import FilesUpload from '@/views/supplier/product/components/changePageUpload.vue'
import { FormInstance, FormRules } from 'element-plus'

const message = useMessage()

const props = defineProps<{
  id: string
}>()

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'refresh'): void
}>()

const formData = reactive({
  reason: '',
  file: ''
})
const rules: FormRules = {
  reason: { required: true, message: '请输入申请原因' }
}
const formRef = ref<FormInstance>()
const fileUploadRef = ref<InstanceType<typeof FilesUpload>>()

const footerBtns = computed(() => {
  return [{ label: '提交', onClick: handleSave, type: 'primary' }]
})

async function handleSave() {
  await formRef.value?.validate()
  const loading = ElLoading.service({
    text: '免检申请提交中...'
  })
  try {
    const res = await saveExemptionApplicationApi({ ...formData, scPurchaseOrderId: props.id })
    if (res && res.success) {
      message.success('免检申请提交成功！')
      formRef.value?.resetFields()
      fileUploadRef.value?.clearBoard()
      emit('back')
    }
  } catch (error: any) {
    console.log('提交失败：', error?.message)
  } finally {
    const timer = setTimeout(() => {
      loading.close()
      clearTimeout(timer)
    }, 500)
  }
}

function afterBack() {
  nextTick(() => {
    formRef.value?.resetFields()
    fileUploadRef.value?.clearBoard()
  })
}

defineExpose({ footerBtns, resetFields: () => formRef.value?.resetFields(), afterBack })
</script>
<style lang="less" scoped></style>
