<template>
  <el-form :model="formData" label-width="120px" ref="formRef" :rules="rules" label-position="right">
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item label="实物报价" prop="physicalQuotePrice">
          <el-input v-model="formData.physicalQuotePrice" placeholder="请填写实物报价" :disabled="disabled" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="生产周期" prop="lifeCycle">
          <el-input v-model="formData.lifeCycle" placeholder="请填写生产周期" :disabled="disabled" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="单色起订量" prop="singleColorOrderQuantity">
          <el-input v-model="formData.singleColorOrderQuantity" placeholder="请填写单色起订量" :disabled="disabled" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item label="产品成本不含税(元)" prop="productCostExcludingTax" class="longLabel">
          <el-input-number :disabled="disabled" placeholder="如有多个成本,填写最大的" v-model="formData.productCostExcludingTax"
            style="width: 100%;" :controls="false" :precision="3" :step="0.001" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="产品成本含税(元)" prop="productCostIncludingTax">
          <el-input-number :disabled="disabled" placeholder="如有多个成本,填写最大的" v-model="formData.productCostIncludingTax"
            style="width: 100%;" :controls="false" :precision="3" :step="0.001" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-form-item label="产品成本补充" prop="productCost">
          <s-text-area :disabled="disabled" v-model="formData.productCost" placeholder="请填写产品成本补充" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item label="包装人工费(元)" prop="packagingManpower">
          <el-input-number :disabled="disabled" placeholder="请填写包装人工费" v-model="formData.packagingManpower"
            style="width: 100%;" :controls="false" :precision="3" :step="0.001" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="包材费用(元)" prop="packagingCost">
          <el-input-number :disabled="disabled" placeholder="请填写包材费用" v-model="formData.packagingCost"
            style="width: 100%;" :controls="false" :precision="3" :step="0.001" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="备注" prop="remark">
          <s-text-area :disabled="disabled" placeholder="请填写备注" v-model="formData.remark" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="报价单" prop="attachmentUrl">
          <SWUploadFile :disabled="disabled" ref="swUploadFileRef" v-model:modelValue="formData.attachmentUrl" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>

</template>
<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import SWUploadFile from '@/components/SWUoloadFile/index.vue'

defineProps({
  formData: {
    type: Object as any,
    default: () => { }
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const rules = {
  physicalQuotePrice: [{ required: true, message: '请输入实物报价', trigger: 'blur' }],
  lifeCycle: [{ required: true, message: '请输入生命周期', trigger: 'blur' }],
  singleColorOrderQuantity: [{ required: true, message: '请输入单色起订量', trigger: 'blur' }],
  productCostExcludingTax: [{ required: true, message: '请输入产品成本(裸货,含运)不含税', trigger: 'blur' }],
  packagingManpower: [{ required: true, message: '请输入包装人工费', trigger: 'blur' }],
  packagingCost: [{ required: true, message: '请输入包材费用', trigger: 'blur' }],
  attachmentUrl: [{ required: true, message: '请上传报价单', trigger: 'change' }]
}
const formRef = ref()
const submitForm = async () => {
  const valid = await formRef.value?.validate()
  if (!valid) return
}

const resetForm = () => {
  formRef.value?.resetFields()
}
defineExpose({ submitForm, resetForm })
</script>

<style lang="scss" scoped>
:deep(.el-form-item--default .el-form-item__label) {
  // line-height: 16px;
  text-align: right;
}

.longLabel {
  :deep(.el-form-item__label) {
    line-height: 16px;
  }
}

:deep(.el-input-number .el-input__inner) {
  text-align: left;
}
</style>
