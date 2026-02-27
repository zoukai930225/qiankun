<template>
  <el-dialog
    title="主要合作客户"
    :model-value="visible"
    style="
      width: 904px;
      background: linear-gradient(226deg, #ffffff 0%, #ffffff 88%, #e8f6fd 95%, #f0f8ff 100%);
      border-radius: 14px;
    "
    @close="handleClose"
  >
    <el-form
      class="base-form"
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="90px"
      :inline="true"
    >
      <el-form-item label="产品类目" style="width: 48%">
        <el-select
          v-model.trim="formData.supplierProductType"
          placeholder="请选择"
          clearable
          style="width: 100%"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.SUPPLIER_PRODUCT_TYPE, true)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select> </el-form-item
      ><el-form-item label="名称" prop="name">
        <el-input
          class="dialogFormItemWidth"
          v-model.trim="formData.name"
          placeholder="请输入"
        /> </el-form-item
      ><el-form-item label="月度产能" prop="monthlyProductionCapacity">
        <el-input
          class="dialogFormItemWidth"
          v-model.trim="formData.monthlyProductionCapacity"
          placeholder="请输入"
        /> </el-form-item
      ><el-form-item label="总体量占比" prop="proportionOverallQuantity">
        <el-input
          class="dialogFormItemWidth"
          v-model.trim="formData.proportionOverallQuantity"
          placeholder="请输入"
        /> </el-form-item
      ><el-form-item label="合作周期" prop="cooperationPeriod">
        <el-input
          class="dialogFormItemWidth"
          v-model.trim="formData.cooperationPeriod"
          type="number"
          placeholder="请输入"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" :disabled="btnDisabled" @click="handleOk">提 交</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { addSupplierCo } from '@/api/supplier'

defineOptions({ name: 'AddMainCustoms' })
const props = defineProps({
  // visible: propTypes.bool.def(false),
  id: {
    type: String,
    default: ''
  }
})
const formRef = ref()
const btnDisabled = ref(false)
const formData = ref({
  supplierId: props.id,
  supplierProductType: '', //产品类型
  name: '', //合作客户名称
  monthlyProductionCapacity: '', //月度产能
  proportionOverallQuantity: '', //总体量占比
  cooperationPeriod: '' //合作周期
})

const validateCount = (rule: any, value: any, callback: any) => {
  let reg = /^(([1-9]\d*)(\.\d{1})?)$|^0\.\d{1}$|^0$/
  if (value && (value > 100 || 0 >= value)) {
    callback(new Error('总体量占比取值范围为大于0小于等于100,请重新输入'))
  } else {
    callback()
  }
}
const validateNumber = (rule: any, value: any, callback: any) => {
  const flag = typeof value === 'string' ? value.indexOf('-') > -1 : -1 >= value
  if (!!value && flag) {
    callback(new Error('请输入正确的数值，不能为负数'))
  } else {
    callback()
  }
}
const formRules = reactive({
  proportionOverallQuantity: [{ validator: validateCount, trigger: ['blur'] }],
  monthlyProductionCapacity: [{ validator: validateNumber, trigger: 'blur' }],
  cooperationPeriod: [{ validator: validateNumber, trigger: 'blur' }]
})
const visible = ref(false)
const open = () => {
  visible.value = true
  btnDisabled.value = false
  resetForm()
}
const emit = defineEmits(['onClose'])
const handleClose = () => {
  visible.value = false
  // emit('onClose')
}
/** 重置表单 */
const resetForm = () => {
  formRef.value?.resetFields()
  formData.value = {
    supplierId: props.id,
    supplierProductType: '', //产品类型
    name: '', //合作客户名称
    monthlyProductionCapacity: '', //月度产能
    proportionOverallQuantity: '', //总体量占比
    cooperationPeriod: '' //合作周期
  }
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
    await addSupplierCo(formData.value)
    visible.value = false
    btnDisabled.value = false
    emit('onClose')
  }
}

defineExpose({
  open
})
onMounted(() => {})
</script>
<style lang="scss" scoped>
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
