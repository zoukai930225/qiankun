<template>
  <el-dialog title="审核" :model-value="visible" @close="handleClose" class="commomDialig">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="90px" :inline="true">
      <el-form-item label="审核结果" prop="isExamine" style="width: 100%">
        <el-select class="dialogFormItemWidth" v-model="formData.isExamine" placeholder="请选择" clearable
          style="width: 100%">
          <el-option v-for="dict in statusList" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" style="width: 100%">
        <s-text-area v-model="formData.examineMes" placeholder="请输入备注" :autosize="{ minRows: 5, maxRows: 5 }" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button :disabled="btnDisabled" type="primary" @click="handleOk">提 交</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="tsx">
import STextArea from "@/components/common/input/s-textarea.vue";
import { updateAudit } from '@/api/supplier'
defineOptions({ name: 'AuditForm' })
const btnDisabled = ref(false)
const formData = ref({
  id: '',
  isExamine: '',
  examineMes: ''
})
const formRules = reactive({
  isExamine: [{ required: true, message: '请选择审核结果', trigger: 'change' }]
})

const statusList = ref([
  { id: 3, value: '1', label: '审核通过' },
  { id: 4, value: '2', label: '审核不通过' }
])
const visible = ref(false)
const formRef = ref()
const open = (id: string, isExamine: number, examineMes: string) => {
  visible.value = true
  btnDisabled.value = false
  resetForm()
  formData.value.id = id
  formData.value.isExamine = isExamine === 0 ? '' : isExamine + ''
  formData.value.examineMes = examineMes || ''
}
/** 重置表单 */
const resetForm = () => {
  formRef.value?.resetFields()
  formData.value = {
    id: '',
    isExamine: '',
    examineMes: ''
  }
}
const emit = defineEmits(['onClose'])
const handleClose = () => {
  visible.value = false
}
const handleOk = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  btnDisabled.value = true
  await updateAudit({ ...formData.value, isExamine: parseInt(formData.value.isExamine) })
  visible.value = false
  btnDisabled.value = false
  emit('onClose')
}
defineExpose({
  open
})
</script>
<style lang="scss" scoped>
:deep(.el-form-item--default .el-form-item__label) {
  text-align: right;
  line-height: 20px !important;
  align-items: center;
}

:deep(.el-form--inline .el-form-item) {
  align-items: center;
}

.el-form--inline .el-form-item:nth-child(2n) {
  margin-right: 0;
}

.el-form--inline .el-form-item:nth-child(2n + 1) {
  margin-right: 20px;
}

.dialog-footer {
  text-align: center;
}
</style>
