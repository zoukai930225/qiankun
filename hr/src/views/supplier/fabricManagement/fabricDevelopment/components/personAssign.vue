<template>
  <div class="composition-dialog">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">

      <el-form-item label="选供专员" :prop="showSupplyChainStaffAssignmentButton ? 'chosenSupplierStaffId' : ''">

        <SWSelectPeople :isEdit="true" :multiple="true" v-model:modelValue="form.chosenSupplierStaffId" type="operate"
          placeholder="请选择选供专员" :deptCode="'NEW_PRODUCT_DEPT_DEVELOP'" style="width: 100% !important;"
          ref="selectSupplierRef" :disabled="!showSupplyChainStaffAssignmentButton" />

        <!-- <SelectUser v-model="form.chosenSupplierStaffId" showAvatarLable :role="getRole('面料选供专员')" ref="selectSupplierRef" :disabled="fabricRDSupervisor"   /> -->
      </el-form-item>
      <el-form-item label="产研人员" :prop="showProductDevelopmentStaffAssignmentButton ? 'productDevelopmentId' : ''">
        <SWSelectPeople :isEdit="true" :multiple="true" v-model:modelValue="form.productDevelopmentId" type="operate"
          placeholder="请选择产研人员" :deptCode="'NEW_PRODUCT_DEPT_DEVELOP'" style="width: 100% !important;"
          :disabled="!showProductDevelopmentStaffAssignmentButton" selectProducterRef />

        <!-- <SelectUser v-model="form.productDevelopmentId" showAvatarLable :role="getRole('面料产研负责人')" ref="selectProducterRef" :disabled="fabricSupplyChainSupervisor " /> -->
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { assignPersion } from '@/api/supplier/fabricManagement/fabricDevelopment'
import asyncWrapper from '@/utils/asyncWrapper'
import SWSelectPeople from './selectPeople.vue'
type propsType = {
  fabricId: string,
  hasAllStaffAssignmentAuthority: boolean,
  showProductDevelopmentStaffAssignmentButton: boolean,
  showSupplyChainStaffAssignmentButton: boolean,
  getRole: any,
  chosenSupplierStaffId: []
  productDevelopmentId: []
}
const props = defineProps<propsType>()
const selectSupplierRef = ref(null)
let sourceData = ''

const formRef = ref<FormInstance>()
const form = ref({
  chosenSupplierStaffId: [],
  productDevelopmentId: [],
})

const rules = reactive<FormRules>({
  chosenSupplierStaffId: [{ required: true, message: '请选择选供专员', trigger: 'change' }],
  productDevelopmentId: [{ required: true, message: '请选择产研人员', trigger: 'change' }],
})
const isEidit = () => {
  const lastData = JSON.stringify(form.value)
  return lastData === sourceData
}

const submit = async (closeCB, handleLoading) => {
  await formRef.value?.validate()
  const chosenSupplierStaffId = form.value.chosenSupplierStaffId.map(x => x.userId).join(',')
  const productDevelopmentId = form.value.productDevelopmentId.map(x => x.userId).join(',')
  const requestParam = { chosenSupplierStaffId, productDevelopmentId, fabricId: props.fabricId }
  handleLoading(true)
  const [data, error] = await asyncWrapper(assignPersion(requestParam))
  if (!error) {
    closeCB()
  }
}

const init = () => {
  form.value.chosenSupplierStaffId = props.chosenSupplierStaffId
  form.value.productDevelopmentId = props.productDevelopmentId
  sourceData = JSON.stringify(form.value)
}
onMounted(() => {
  init()
})
defineExpose({ submit, isEidit })
</script>

<style lang="scss" scoped>
.composition-dialog {
  padding: 0 8px;
}

.composition-dialog :deep(.el-input .el-input__suffix) {
  color: var(--el-text-color-placeholder);
}

:deep() {
  .el-form-item__label {
    line-height: 32px !important;
  }
}
</style>
