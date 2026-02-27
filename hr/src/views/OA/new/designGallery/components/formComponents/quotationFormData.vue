<template>
  <div class="plan-detail" :style="{ paddingBottom: planInfoIsExpand ? '20px' : '0px' }">
    <FormTitle title="报价核价" :is-show-expand="true" :is-expand="planInfoIsExpand"
      @expand-click="planInfoIsExpand = !planInfoIsExpand" />
    <div v-show="planInfoIsExpand">
      <el-form label-width="120px" :rules="supplierRules" :model="params" ref="supplierMatchFormRef">
        <el-form-item label="供应商名称" prop="supplierId">
          <el-select v-model="params.supplierId" placeholder="请选择供应商" clearable filterable :disabled="!isEdit">
            <el-option v-for="item in supplierOptions" :key="item.id" :label="item.supplierName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="匹配原因" prop="matchReason">
          <s-text-area :disabled="!isEdit" v-model="params.matchReason" :autosize="{ minRows: 3, maxRows: 3 }"
            placeholder="请输入匹配原因" />
        </el-form-item>
      </el-form>
      <!-- 报价表单 -->
      <quotationForm :form="params" ref="quotationRef" :isEdit="isEdit" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { defineProps } from 'vue'
import FormTitle from './formTitle.vue'
import quotationForm from './quotationForm.vue'
import {
  getSupplierList,
} from '@/api/oa/new/designGallery/index'

const planInfoIsExpand = ref(true)

const props = defineProps({
  params: {
    type: Object as any,
    default: () => { }
  },
  isEdit: {
    type: Boolean,
    default: true
  }
})

// 匹配供应商相关
const supplierMatchFormRef = ref()
const supplierMatchForm = ref({ supplierId: '', matchReason: '' })
const supplierOptions = ref<any>([])
const getSupplierListReq = async () => {
  const data = await getSupplierList().catch(() => { })
  if (data && data.length > 0) {
    supplierOptions.value = []
    data.forEach((item) => {
      if (item) {
        supplierOptions.value.push(item)
      }
    })
  }
}
const supplierRules = reactive({
  supplierId: [{ required: true, message: '请选择供应商', trigger: 'change' }],
  matchReason: [{ required: true, message: '请输入匹配原因', trigger: 'change' }],
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
const form = ref({
  physicalQuotePrice: undefined,
  lifeCycle: undefined,
  singleColorOrderQuantity: undefined,
  productCostExcludingTax: undefined,
  productCostIncludingTax: undefined,
  productCost: undefined,
  finishedProductPrice: undefined,
  packagingManpowerNew: 0,
  packagingCostNew: 0,
  remark: undefined,
  attachmentUrl: []
})
const quotationRef = ref()
const quotationValidate = async () => {
  await Promise.all([supplierMatchFormRef.value?.validate(), quotationRef.value?.validateForm()])
}
defineExpose({ quotationValidate })
onMounted(() => {
  getSupplierListReq()
})
</script>

<style lang="scss" scoped>
.plan-detail {
  width: 100%;
  min-height: 60px;
  background: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-sizing: border-box;
  margin-bottom: 20px;
}
</style>
