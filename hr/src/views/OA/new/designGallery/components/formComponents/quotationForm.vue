<template>
  <el-form :model="form" label-width="120px" ref="formRef" :rules="rules" label-position="right">
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item label="生产周期" prop="lifeCycle">
          <el-input v-model="form.lifeCycle" placeholder="请填写生产周期" :disabled="!isEdit" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="单色起订量" prop="singleColorOrderQuantity">
          <el-input v-model="form.singleColorOrderQuantity" placeholder="请填写单色起订量" :disabled="!isEdit" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item label="裸货价(不含税)元" prop="productCostExcludingTax" class="longLabel">
          <el-input-number placeholder="如有多个成本,填写最大的" v-model="form.productCostExcludingTax" style="width: 100%;"
            :controls="false" :precision="3" @change="autoCountFinishedProductPrice" :disabled="!isEdit" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="含税裸货价/元" prop="productCostIncludingTax">
          <el-input-number placeholder="如有多个成本,填写最大的" v-model="form.productCostIncludingTax" style="width: 100%;"
            :controls="false" :precision="3" :disabled="!isEdit" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-form-item label="成品价" prop="finishedProductPrice">
          <el-input-number placeholder="成品价等于 裸货价+包装人工费" v-model="form.finishedProductPrice" style="width: 100%;"
            :controls="false" :precision="3" :disabled="true" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-form-item label="产品成本补充" prop="productCost">
          <s-text-area v-model="form.productCost"  placeholder="请填写产品成本补充" :disabled="!isEdit" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item label="包装人工费(元)" prop="packagingManpowerNew">
          <el-input-number placeholder="请填写包装人工费" v-model="form.packagingManpowerNew" style="width: 100%;"
            :controls="false" :precision="3" @change="autoCountFinishedProductPrice" :disabled="!isEdit" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="包材费用(元)" prop="packagingCostNew">
          <el-input-number placeholder="请填写包材费用" v-model="form.packagingCostNew" style="width: 100%;" :controls="false"
            :precision="3" :disabled="!isEdit" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="备注" prop="quotePriceRemark">
          <s-text-area placeholder="请填写备注" v-model="form.quotePriceRemark"  :disabled="!isEdit" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="报价单" prop="attachmentUrl">
          <SWUploadFile ref="swUploadFileRef" v-model:modelValue="form.attachmentUrl" :disabled="!isEdit" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script setup lang="ts">
import STextArea from "@/components/common/input/s-textarea.vue";
// import { confirmQuotePrice } from '@/api/oa/new/designGallery/index'
import SWUploadFile from '@/components/SWUoloadFile/index.vue'

const props = defineProps({
  form: {
    type: Object as any,
    default: () => { }
  },
  isEdit: {
    type: Boolean,
    default: true
  }
})
/**
 * 报价核价：physicalQuotePrice
  生产周期：lifeCycle
  单色起定量：singleColorOrderQuantity
  产品成本（裸货，含运）不含税（元）：productCostExcludingTax
  产品成本（裸货，含运）含税（元）：productCostIncludingTax
  产品成本补充：productCost
  包装人工费（元）：packagingManpowerNew
  包材费用（元）：packagingCostNew
  备注：remark
  报价单：attachmentUrl
 */
// const form = ref({
//   physicalQuotePrice: undefined,
//   lifeCycle: undefined,
//   singleColorOrderQuantity: undefined,
//   productCostExcludingTax: undefined,
//   productCostIncludingTax: undefined,
//   productCost: undefined,
//   finishedProductPrice: undefined,
//   packagingManpowerNew: 0,
//   packagingCostNew: 0,
//   remark: undefined,
//   attachmentUrl: []
// })
const rules = {
  physicalQuotePrice: [{ required: true, message: '请输入实物报价', trigger: 'blur' }],
  lifeCycle: [{ required: true, message: '请输入生命周期', trigger: 'blur' }],
  singleColorOrderQuantity: [{ required: true, message: '请输入单色起订量', trigger: 'blur' }],
  productCostExcludingTax: [{ required: true, message: '请输入产品成本(裸货,含运)不含税', trigger: 'blur' }],
  packagingManpowerNew: [{ required: true, message: '请输入包装人工费', trigger: 'blur' }],
  packagingCostNew: [{ required: true, message: '请输入包材费用', trigger: 'blur' }],
  attachmentUrl: [{ required: true, message: '请上传报价单', trigger: 'change' }]
}

const emit = defineEmits(['success']) // 定义 success 事件

const formRef = ref()
const validateForm = async () => {
  await formRef.value?.validate()
}



const autoCountFinishedProductPrice = () => {
  if (props.form.productCostExcludingTax || props.form.packagingManpowerNew) {
    props.form.finishedProductPrice = (Number(props.form.productCostExcludingTax) + Number(props.form.packagingManpowerNew) as any)
  } else {
    props.form.finishedProductPrice = undefined
  }
}

defineExpose({ validateForm }) 
</script>

<style lang="scss" scoped>
:deep(.longLabel .el-form-item__label) {
  line-height: 16px;
  text-align: right;
}

:deep(.el-input-number .el-input__inner) {
  text-align: left;
}
</style>
