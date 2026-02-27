<template>
  <el-dialog
    title="生产相关设备及生产能力"
    :model-value="visible"
    style="
      width: 904px;
      background: linear-gradient(226deg, #ffffff 0%, #ffffff 88%, #e8f6fd 95%, #f0f8ff 100%);
      border-radius: 14px;
    "
    @close="handleClose"
    class="commomDialig"
  >
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="90px" :inline="true">
      <el-form-item label="设备名称" prop="equipmentName">
        <el-input
          class="dialogFormItemWidth"
          v-model.trim="formData.equipmentName"
          placeholder="请输入"
        /> </el-form-item
      ><el-form-item label="品牌" prop="brand">
        <el-input class="dialogFormItemWidth" v-model.trim="formData.brand" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="应用部门">
        <el-input
          class="dialogFormItemWidth"
          v-model.trim="formData.applicationDepartment"
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item label="数量" prop="count">
        <el-input
          class="dialogFormItemWidth"
          :min="0"
          type="number"
          v-model.trim="formData.count"
          placeholder="请输入"
        />
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
import { createProductDevice } from '@/api/supplier'
defineOptions({ name: 'AddDevice' })
const props = defineProps({
  id: {
    type: String,
    default: ''
  }
})
const btnDisabled = ref(false)
const formData = ref({
  supplierId: props.id,
  equipmentName: '', //设备名称
  brand: '', //品牌
  applicationDepartment: '', //应用部门
  count: '' //数量
})

const validateNumber = (rule: any, value: any, callback: any) => {
  if (!!value && -1 >= value) {
    callback(new Error('请输入正确的数值，不能为负数'))
  } else {
    callback()
  }
}
const formRules = reactive({
  count: [{ validator: validateNumber, trigger: 'blur' }]
})
const visible = ref(false)
const formRef = ref()
const open = () => {
  visible.value = true
  btnDisabled.value = false
  resetForm()
}
/** 重置表单 */
const resetForm = () => {
  formRef.value?.resetFields()
  formData.value = {
    supplierId: props.id,
    equipmentName: '', //设备名称
    brand: '', //品牌
    applicationDepartment: '', //应用部门
    count: '' //数量
  }
}
const emit = defineEmits(['onClose'])
const handleClose = () => {
  visible.value = false
  // emit('onClose')
}
const handleOk = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  const obj = JSON.parse(JSON.stringify(formData.value))
  delete obj['supplierId']
  var arr = Object.values(obj).filter((item) => !!item.trim())
  if (arr.length === 0) {
    visible.value = false
  } else {
    btnDisabled.value = true
    await createProductDevice(formData.value)
    visible.value = false
    btnDisabled.value = false
    emit('onClose')
  }
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
:deep(.el-form--inline .el-form-item ){
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
