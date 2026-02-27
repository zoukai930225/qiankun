<template>
  <scheme-dialog ref="detailsRef" name="quotationAndPricingDialog" :width="920">
    <template #card>
      <el-form
        :model="form"
        label-width="118px"
        ref="formRef"
        :rules="rules"
        label-position="right"
      >
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="生产周期" prop="lifeCycle">
              <el-input v-model="form.lifeCycle" placeholder="请填写生产周期" :disabled="isView" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="singleColorOrderQuantity" label="单色起订量">
              <!-- <template #label>
                <span class="text-right lh-16px whitespace-nowrap"> 单色起<br />订量</span>
              </template> -->
              <el-input
                v-model="form.singleColorOrderQuantity"
                placeholder="请填写单色起订量"
                :disabled="isView"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <!-- <el-col :span="12">
            <el-form-item prop="productCostExcludingTax" class="longLabel">
              <template #label>
                <span class="text-right lh-16px"> 裸货价<br />(不含税)元</span>
              </template>
              <el-input-number
                placeholder="如有多个成本,填写最大的"
                v-model="form.productCostExcludingTax"
                style="width: 100%"
                :controls="false"
                :precision="3"
                :disabled="isView"
                @change="autoCountFinishedProductPrice"
              />
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="含税裸货价(元)" prop="productCostIncludingTax">
              <!-- <template #label>
                <span class="text-right lh-16px whitespace-nowrap"> 含税<br />裸货价/元</span>
              </template> -->
              <!-- @change="autoCountFinishedProductPrice" -->
              <el-input-number
                placeholder="如有多个成本,填写最大的"
                v-model="form.productCostIncludingTax"
                style="width: 100%"
                :controls="false"
                :precision="3"
                :disabled="isView"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="包装人工费(元)" prop="packagingManpowerNew">
              <!-- <template #label>
                <span class="text-right lh-16px"> 包装人<br />工费(元)</span>
              </template> -->
              <!--  @change="autoCountFinishedProductPrice" -->
              <el-input-number
                placeholder="请填写包装人工费"
                v-model="form.packagingManpowerNew"
                style="width: 100%"
                :controls="false"
                :precision="3"
                :disabled="isView"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="成品价(元)" prop="finishedProductPrice">
              <el-input-number
                placeholder="成品价等于 裸货价+包装人工费"
                v-model="form.finishedProductPrice"
                style="width: 100%"
                :controls="false"
                :precision="3"
                :disabled="isView"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="packagingCostNew" label="包材费用(元)">
              <!-- <template #label>
                <span class="text-right lh-16px"> 包材费用<br />(元)</span>
              </template> -->
              <el-input-number
                placeholder="请填写包材费用"
                v-model="form.packagingCostNew"
                style="width: 100%"
                :controls="false"
                :precision="3"
                :disabled="isView"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="成品价(元)" prop="finishedProductPrice">
              <el-input-number placeholder="成品价等于 裸货价+包装人工费" v-model="form.finishedProductPrice" style="width: 100%"
                :controls="false" :precision="3" :disabled="isView" />
            </el-form-item>
          </el-col>
        </el-row> -->
        <el-row>
          <el-col>
            <el-form-item prop="productCostPatch" class="long-label" label="产品成本补充">
              <!-- <template #label>
                <span class="text-right lh-16px"> 产品成本<br />补充</span>
              </template> -->
              <s-text-area
                v-model="form.productCostPatch"
                placeholder="请填写产品成本补充"
                :disabled="isView"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <s-text-area placeholder="请填写备注" v-model="form.remark" :disabled="isView" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="报价单" prop="quotationForm">
              <transfer
                v-model="form.quotationForm"
                accept-type="all"
                width="100%"
                :disabled="isView"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </template>
    <template #button>
      <div>
        <el-button @click="detailsRef?.close()" :disabled="loading">取消</el-button>
        <el-button
          v-if="!isView"
          type="primary"
          @click="submitForm"
          :disabled="loading"
          :loading="loading"
        >
          提交
        </el-button>
      </div>
    </template>
  </scheme-dialog>
</template>

<script lang="ts" setup>
import { computed, nextTick, provide, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import { useMessage } from '@/hooks/web/useMessage'
import {
  addSelectionProductQuotation,
  updateSelectionProductQuotation,
  getSelectionProductQuotationDetail
} from '@/api/oa/buyer/productReference'
import STextArea from '@/components/common/input/s-textarea.vue'
import Transfer from '@/components/common/upload/transfer.vue'
import eventBus from '@/utils/eventBus'

type QuotationForm = {
  lifeCycle: string
  singleColorOrderQuantity: string
  productCostExcludingTax: number | undefined
  productCostIncludingTax: number | undefined
  packagingManpowerNew: number | undefined
  packagingCostNew: number | undefined
  finishedProductPrice: number | undefined
  productCostPatch: string
  quotationForm: string
  remark: string
}

type QuotationContext = {
  bpCandidateProductInfoId: string | number | ''
  quoteInfoId: string | number | ''
  reviewId: string | number | ''
  mode: 'add' | 'edit' | 'view'
}

const message = useMessage()
const detailsRef = ref<any>(null)
const formRef = ref<FormInstance>()
const loading = ref(false)
const viewType = ref<'add' | 'edit' | 'view'>('add')

const title = computed(() => '报价核价')

const defaultForm = (): QuotationForm => ({
  lifeCycle: '',
  singleColorOrderQuantity: '',
  productCostExcludingTax: undefined,
  productCostIncludingTax: undefined,
  packagingManpowerNew: undefined,
  packagingCostNew: undefined,
  finishedProductPrice: undefined,
  productCostPatch: '',
  quotationForm: '',
  remark: ''
})

const form = ref<QuotationForm>(defaultForm())
const bukValue = ref(cloneDeep(form.value))

provide('quotationAndPricingDialogDetails', { dataValue: form, bukValue, viewType, title, loading })

const isView = computed(() => viewType.value === 'view')

const rules = ref<FormRules<QuotationForm>>({
  lifeCycle: [{ required: true, message: '请输入生产周期', trigger: 'blur' }],
  singleColorOrderQuantity: [{ required: true, message: '请输入单色起订量', trigger: 'blur' }],
  productCostExcludingTax: [
    { required: true, message: '请输入裸货价（不含税）', trigger: 'change' }
  ],
  productCostIncludingTax: [{ required: true, message: '请输入含税裸货价', trigger: 'change' }],
  packagingManpowerNew: [{ required: true, message: '请输入包装人工费', trigger: 'change' }],
  // packagingCostNew: [{ required: true, message: '请输入包材费用', trigger: 'change' }],
  finishedProductPrice: [{ required: true, message: '请输入成品价', trigger: 'change' }],
  quotationForm: [{ required: true, message: '请上传报价单', trigger: 'change' }]
})

const context = ref<QuotationContext>({
  bpCandidateProductInfoId: '',
  quoteInfoId: '',
  reviewId: '',
  mode: 'add'
})

const resetForm = () => {
  form.value = defaultForm()
  bukValue.value = cloneDeep(form.value)
}

const fillForm = (initialData: any = {}) => {
  resetForm()
  Object.assign(form.value, {
    lifeCycle: initialData.lifeCycle ?? '',
    singleColorOrderQuantity: initialData.singleColorOrderQuantity ?? '',
    productCostExcludingTax: initialData.productCostExcludingTax ?? undefined,
    productCostIncludingTax: initialData.productCostIncludingTax ?? undefined,
    packagingManpowerNew: initialData.packagingManpowerNew ?? undefined,
    packagingCostNew: initialData.packagingCostNew ?? undefined,
    finishedProductPrice: initialData.finishedProductPrice ?? undefined,
    productCostPatch: initialData.productCostPatch ?? '',
    quotationForm: initialData.quotationForm ?? '',
    remark: initialData.remark ?? ''
  })
  bukValue.value = cloneDeep(form.value)
}

const autoCountFinishedProductPrice = () => {
  const cost = Number(form.value.productCostIncludingTax)
  const manpower = Number(form.value.packagingManpowerNew)
  if (!Number.isNaN(cost) && !Number.isNaN(manpower)) {
    form.value.finishedProductPrice = Number((cost + manpower).toFixed(3))
  }
}

const handleQuotationFormChange = () => {
  nextTick(() => {
    formRef.value?.validateField('quotationForm')
  })
}

const unwrapDetail = (res: any): Record<string, any> => {
  if (!res || typeof res !== 'object') return {}
  const candidates = [res.data, res.result, res.record, res.detail]
  for (const candidate of candidates) {
    if (candidate && typeof candidate === 'object') {
      return candidate as Record<string, any>
    }
  }
  return res as Record<string, any>
}

const buildPayload = () => {
  const payload: Record<string, any> = {
    bpCandidateProductInfoId: context.value.bpCandidateProductInfoId,
    lifeCycle: form.value.lifeCycle?.trim(),
    singleColorOrderQuantity: form.value.singleColorOrderQuantity?.trim(),
    productCostExcludingTax: form.value.productCostExcludingTax,
    productCostIncludingTax: form.value.productCostIncludingTax,
    packagingManpowerNew: form.value.packagingManpowerNew,
    packagingCostNew: form.value.packagingCostNew,
    finishedProductPrice: form.value.finishedProductPrice,
    productCostPatch: form.value.productCostPatch?.trim() ?? '',
    quotationForm: form.value.quotationForm?.trim() ?? '',
    remark: form.value.remark?.trim() ?? ''
  }
  if (context.value.quoteInfoId) {
    payload.id = context.value.quoteInfoId
  }
  return payload
}

const emit = defineEmits<{ (e: 'success'): void }>()

const submitForm = async () => {
  if (isView.value) {
    detailsRef.value?.close()
    return
  }
  if (!formRef.value) return
  const valid = await formRef.value.validate()
  if (!valid) return
  loading.value = true
  try {
    const payload = buildPayload()
    if (context.value.quoteInfoId) {
      await updateSelectionProductQuotation(payload)
    } else {
      await addSelectionProductQuotation(payload)
    }
    message.success('提交成功')
    bukValue.value = cloneDeep(form.value)
    emit('success')
    eventBus.emit('upload:delete')
    detailsRef.value?.close()
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const openDialog = async (options: {
  mode: 'add' | 'edit' | 'view'
  bpCandidateProductInfoId: string | number
  quoteInfoId?: string | number
  reviewId?: string | number
  initialData?: any
}) => {
  context.value = {
    bpCandidateProductInfoId: options.bpCandidateProductInfoId ?? '',
    quoteInfoId: options.quoteInfoId ?? '',
    reviewId: options.reviewId ?? '',
    mode: options.mode
  }
  viewType.value = options.mode
  let initialData = options.initialData ?? {}
  if (options.mode !== 'add' && options.bpCandidateProductInfoId) {
    loading.value = true
    try {
      const res = await getSelectionProductQuotationDetail(options.bpCandidateProductInfoId)
      initialData = unwrapDetail(res)
      if (initialData?.id) {
        context.value.quoteInfoId = initialData.id
      }
    } catch (error) {
      console.error(error)
      message.error('获取报价信息失败，请重试')
      loading.value = false
      return
    }
    loading.value = false
  }
  fillForm(initialData)
  detailsRef.value?.openDialog(
    () => Promise.resolve(),
    () => {
      nextTick(() => formRef.value?.clearValidate())
    }
  )
}

defineExpose({ openDialog, autoCountFinishedProductPrice })
</script>

<style scoped lang="scss">
:deep(.el-form) {
  .el-input-number {
    .el-input__inner {
      text-align: left;
    }
  }

  .long-label {
    .el-form-item__label::before {
      line-height: 20px;
    }
  }
}
</style>
