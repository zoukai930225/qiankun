<template>
  <el-dialog
    title="工厂情况"
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
      <el-form-item label="名称" prop="factoryName">
        <el-input
          class="dialogFormItemWidth"
          v-model.trim="formData.factoryName"
          placeholder="请输入"
        /> </el-form-item
      ><el-form-item label="地址" prop="factoryAddress">
        <el-input
          class="dialogFormItemWidth"
          v-model.trim="formData.factoryAddress"
          placeholder="请输入"
        /> </el-form-item
      ><el-form-item label="工厂面积(平方)" prop="factoryArea">
        <el-input
          class="dialogFormItemWidth"
          v-model.trim="formData.factoryArea"
          placeholder="请输入"
        /> </el-form-item
      ><el-form-item label="工厂人员(人)" prop="factoryPerson">
        <el-input
          class="dialogFormItemWidth"
          v-model.trim="formData.factoryPerson"
          placeholder="请输入"
        /> </el-form-item
      ><el-form-item label="运输方式">
        <el-input
          class="dialogFormItemWidth"
          v-model.trim="formData.modeOfTransport"
          placeholder="请输入"
        />
      </el-form-item>
      <!-- <el-form-item label="产品类型" style="width: 47%">
        <el-select
          v-model.trim="formData.productType"
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
        </el-select>
      </el-form-item> -->
      <el-form-item label="生产设备(台)" prop="productionEquipment">
        <el-input
          class="dialogFormItemWidth"
          v-model.trim="formData.productionEquipment"
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item label="日度产能" prop="dayProductionCapacity">
        <el-input
          class="dialogFormItemWidth"
          v-model.trim="formData.dayProductionCapacity"
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item label="月度产能" prop="monthProductionCapacity">
        <el-input
          class="dialogFormItemWidth"
          v-model.trim="formData.monthProductionCapacity"
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item label="生产人员(人)" prop="productionPersonnel">
        <el-input
          class="dialogFormItemWidth"
          v-model.trim="formData.productionPersonnel"
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
// import { propTypes } from '@/utils/propTypes'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { addFactory } from '@/api/supplier'
defineOptions({ name: 'AddFactoryInfo' })
const props = defineProps({
  id: {
    type: String,
    default: ''
  }
})
const btnDisabled = ref(false)
const formData = ref({
  supplierId: props.id,
  factoryName: '', //工厂名称
  factoryAddress: '', //工厂地址
  factoryArea: '', //工厂面积
  factoryPerson: '', //工厂人员
  modeOfTransport: '', //运输方式
  productType: '', //产品类型
  productionEquipment: '', //生产设备
  dayProductionCapacity: '', //日度产能
  monthProductionCapacity: '', //月度产能
  productionPersonnel: '' //生产人员
})
const validateNumber = (rule: any, value: any, callback: any) => {
  if (!!value && value.indexOf('-') > -1) {
    callback(new Error('请输入正确的数值，不能为负数'))
  } else {
    callback()
  }
}
const formRules = reactive({
  factoryArea: [{ validator: validateNumber, trigger: 'blur' }],
  factoryPerson: [{ validator: validateNumber, trigger: 'blur' }],
  productionEquipment: [{ validator: validateNumber, trigger: 'blur' }],
  dayProductionCapacity: [{ validator: validateNumber, trigger: 'blur' }],
  monthProductionCapacity: [{ validator: validateNumber, trigger: 'blur' }],
  productionPersonnel: [{ validator: validateNumber, trigger: 'blur' }]
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
    factoryName: '', //工厂名称
    factoryAddress: '', //工厂地址
    factoryArea: '', //工厂面积
    factoryPerson: '', //工厂人员
    modeOfTransport: '', //运输方式
    productType: '', //产品类型
    productionEquipment: '', //生产设备
    dayProductionCapacity: '', //日度产能
    monthProductionCapacity: '', //月度产能
    productionPersonnel: '' //生产人员
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
    await addFactory(formData.value)
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
