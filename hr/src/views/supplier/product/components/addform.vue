<template>
  <div class="title"> 采购生产单信息 </div>
  <el-divider />
  <el-form :model="formData" ref="queryFormRef" :rules="nameRule" label-width="110">
    <el-row :gutter="6">
      <el-col :span="6">
        <el-form-item label="需求单编码：" prop="scPurchaseRequestOrderId">
          <ScrollSelect
            ref="prNoRef"
            :multiple="false"
            v-model:model-value="formData.scPurchaseRequestOrderId"
            :default-label="formData.scPurchaseRequestOrderNo"
            :api="scrollSelectApi"
            select-key="scPurchaseRequestOrderNo"
            item-label-key="scPurchaseRequestOrderNo"
            item-value-key="id"
            :other-params="{ queryType: 1 }"
            :clearable="false"
            :disabled="isEdit || isCheck"
            placeholder="请选择需求单编码"
            @change="handleChangePrCode"
          />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="需求单名称:" prop="scPurchaseRequestOrderName">
          <el-input
            :model-value="
              (route.query.scPurchaseRequestOrderName as string) ||
              formData.scPurchaseRequestOrderName
            "
            disabled
          />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="需求来源:" prop="requestSource">
          <el-select v-model="formData.requestSource" clearable placeholder="" disabled>
            <el-option
              v-for="{ value, label } in requestSourceOption"
              :key="value"
              :value="value"
              :label="label"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6" v-if="['2', '5'].includes(formData.requestSource)">
        <el-form-item label="产前样时间:" prop="productBeforeDate">
          <el-date-picker
            class="!w-100%"
            v-model="formData.productBeforeDate"
            type="datetime"
            placeholder="请选择产前样时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            :disabled="isAudit || isCheck"
          />
        </el-form-item>
      </el-col>
      <el-col
        v-if="['2', '5'].includes(formData.requestSource)"
        :span="12"
        class="!flex color-#666"
      >
        <el-form-item label-width="0" prop="preSampleFirstDelayDays">
          <div class="!flex flex-nowrap !flex-1">
            <span class="ml-14px">产前样审核通过后</span>
            <div class="w-80px mx-8px">
              <sw-input-number
                v-model="formData.preSampleFirstDelayDays"
                :disabled="isAudit || isCheck"
              />
            </div>
            <span>天后完成首批；</span>
          </div>
        </el-form-item>
        <el-form-item label-width="0">
          <div class="w-80px mr-8px">
            <sw-input-number
              v-model="formData.preSampleClearDelayDays"
              :disabled="isAudit || isCheck"
            />
          </div>
          <span>天后清单；</span>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="需求单备注：">
          <s-text-area
            :model-value="formData.scPrRemarks || '--'"
            :maxlength="500"
            :rows="5"
            show-word-limit
            disabled
          />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="生产单备注：">
          <s-text-area
            v-model="formData.scPoRemarks"
            :maxlength="500"
            :rows="5"
            show-word-limit
            :disabled="isAudit || isCheck"
            :placeholder="isAudit ? '--' : '请输入生产单备注'"
          />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="附件：">
          <files-upload
            :disabled="isAudit || isCheck"
            v-model:modelValue="formData.fileUrl"
            :url="formData.fileUrl"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script lang="ts" setup>
import STextArea from '@/components/common/input/s-textarea.vue'
import { getPurchasePruductOrderList, getPurchaseList } from '@/api/supplier/purchase'
import { getDictOptions, DICT_TYPE } from '@/utils/dict'
import { FormInstance } from 'element-plus'
import FilesUpload from '@/views/supplier/product/components/changePageUpload.vue'

const route = useRoute()

const props = defineProps<{
  modelValue: any
  isAdd?: boolean
  isEdit?: boolean
  isAudit?: boolean
  isCheck?: boolean
}>()

const emit = defineEmits<{
  (e: 'change-pr-code'): void
  (e: 'update:model-value', formData: any): void
}>()

const queryFormRef = ref<FormInstance>()
const prNoRef = ref()

const nameRule = computed(() => {
  let obj: any = {
    scPurchaseRequestOrderId: [
      { required: !props.isAudit && !props.isCheck, message: '请选择需求单编号' }
    ]
  }
  return ['2', '5'].includes(formData.value?.requestSource || '') && !formData.value.isBuyer
    ? {
        ...obj,
        productBeforeDate: [
          { required: !props.isAudit && !props.isCheck, message: '请选择产前样时间' }
        ]
      }
    : { ...obj }
})

const formData = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:model-value', val)
})

const requestSourceOption = computed(() => getDictOptions(DICT_TYPE.SC_PR_REQUEST_SOURCE))

const scrollSelectApi = computed(() =>
  props.isAdd ? getPurchasePruductOrderList : getPurchaseList
)

function handleChangePrCode() {
  emit('change-pr-code')
}

const checkValue = async () => {
  await queryFormRef?.value?.validate()
}

function remoteMethod() {
  prNoRef.value?.remoteMethod(formData.value.scPurchaseRequestOrderNo)
}

defineExpose({ checkValue, remoteMethod, clearValidate: () => queryFormRef.value?.clearValidate() })
</script>
<style lang="less" scoped>
@import url(../../index.scss);
</style>
