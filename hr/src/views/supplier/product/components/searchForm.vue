<template>
  <el-row :gutter="24">
    <el-col :span="19" class="!flex-1">
      <el-form :model="queryParams" ref="queryFormRef" :label-width="90">
        <el-row :gutter="14">
          <el-col :span="6">
            <el-form-item label-width="0">
              <el-input
                v-model.trim="queryParams[codeType]"
                clearable
                :placeholder="codeTypes[codeType].placeholder"
                @keydown.enter="emit('handleQuery')"
                @clear="emit('handleQuery')"
              >
                <template #prepend>
                  <el-select v-model="codeType" @change="handleChangeCodeType(codeTypes)">
                    <el-option
                      v-for="(value, key) in codeTypes"
                      :key="key"
                      :value="key"
                      :label="value.label"
                    />
                  </el-select>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="供应商:" prop="supplierQuery">
              <el-input
                v-model="queryParams.supplierQuery"
                clearable
                placeholder="请输入供应商"
                @keydown.enter="emit('handleQuery')"
                @clear="emit('handleQuery')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="20">
              <sku-goods-no-select
                v-model:params="queryParams"
                goods-code-key="goodsNo"
                sku-key="skuQuery"
                @change-type="emit('handleQuery')"
                @change-value="emit('handleQuery')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="订单状态:" prop="status">
              <el-select
                v-model="queryStatus"
                placeholder="请选择订单状态"
                clearable
                multiple
                collapse-tags
                collapse-tags-tooltip
                @change="emit('handleQuery')"
              >
                <el-option
                  v-for="item in orderStatusOps"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-show="isMore">
            <el-form-item label="跟单人" prop="">
              <select-people
                v-model:list="supplierProduct.personList"
                v-model:model-value="queryParams.orderHandlerId"
                :multiple="false"
                placeholder="请选择跟单人"
                get-list-method="visible"
                :api="getScPersonsApi"
                @change="emit('handleQuery')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6" v-show="isMore">
            <el-form-item prop="firstBatchTime" label="合同首批日期:">
              <el-date-picker
                type="daterange"
                v-model.trim="firstBatchTime"
                value-format="YYYY-MM-DD"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                clearable
                @change="emit('handleQuery')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6" v-show="isMore">
            <el-form-item prop="latestArrivalTime" label="合同清单日期:">
              <el-date-picker
                type="daterange"
                v-model.trim="latestArrivalTime"
                value-format="YYYY-MM-DD"
                placeholder="请选择"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                clearable
                @change="emit('handleQuery')"
              />
            </el-form-item>
          </el-col>

          <el-col :span="6" v-show="isMore">
            <el-form-item label="需求来源:" prop="requestSource">
              <el-select
                v-model="queryParams.requestSource"
                clearable
                placeholder="请选择需求来源"
                @change="emit('handleQuery')"
              >
                <el-option
                  v-for="{ value, label } in requestSourceOption"
                  :key="value"
                  :value="value"
                  :label="label"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-show="isMore" v-if="!props.exclude?.includes('产前样时间')">
            <el-form-item label="产前样时间:">
              <el-date-picker
                type="daterange"
                v-model="productBeforeDate"
                value-format="YYYY-MM-DD"
                placeholder="请选择"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                clearable
                @change="emit('handleQuery')"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-col>
    <el-col :span="5" class="!flex justify-end min-w-350px">
      <el-button @click="emit('handleQuery')" class="commonSearchBtn">
        <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
        搜索
      </el-button>
      <el-button @click="emit('resetQuery')" class="commonResetBtn" :style="{ marginLeft: '0px' }">
        重置
      </el-button>

      <slot name="options"> </slot>

      <el-button @click="isMore = !isMore" type="primary" link class="ml-4px !h-32px">
        <img
          src="@/assets/svgs/supplier/zhankai.svg"
          alt=""
          class="mr4px"
          :style="{ transform: !isMore ? 'rotate(180deg)' : 'rotate(0)' }"
        />
        {{ isMore ? '收起' : '展开' }}
      </el-button>
    </el-col>
  </el-row>
</template>
<script lang="ts" setup>
import { useSupplierProduct } from '@/store/modules/supplier'
import { allOrderStatusOps } from '../options'
import { getScPersonsApi } from '@/api/supplier/purchase'
import { getDictOptions, DICT_TYPE } from '@/utils/dict'
const SelectPeople = defineAsyncComponent(() => import('../../components/selectPeople.vue'))
import skuGoodsNoSelect from '@/views/supplier/components/sku&goodsNoSelect.vue'

const supplierProduct = useSupplierProduct()

const props = withDefaults(
  defineProps<{
    params: Record<string, any>
    exclude?: string[]
    orderStatusOps?: any[]
  }>(),
  {
    orderStatusOps: () => allOrderStatusOps
  }
)

const emit = defineEmits<{
  (e: 'update:params', val: Record<string, any>): void
  (e: 'handleQuery'): void
  (e: 'resetQuery'): void
}>()

const codeTypes = {
  scPurchaseOrderNo: { label: '生产订单号', placeholder: '请输入生产订单号' },
  scPurchaseRequestOrderNo: { label: '需求单号', placeholder: '请输入需求单号' }
}
const codeType = ref('scPurchaseOrderNo')

const isMore = ref(false)

const queryParams = ref<Record<string, any>>({})

const queryStatus = computed({
  get: () => props.params.status && props.params.status.split(','),
  set: (val) => (queryParams.value.status = val && val.length ? val.join(',') : undefined)
})

const firstBatchTime = computed({
  get: () =>
    queryParams.value.firstBatchStartTime && queryParams.value.firstBatchEndTime
      ? [queryParams.value.firstBatchStartTime, queryParams.value.firstBatchEndTime]
      : [],
  set: (val) => {
    queryParams.value.firstBatchStartTime = val ? val[0] : undefined
    queryParams.value.firstBatchEndTime = val ? val[1] : undefined
  }
})
const latestArrivalTime = computed({
  get: () =>
    queryParams.value.latestArrivalStartTime && queryParams.value.latestArrivalEndTime
      ? [queryParams.value.latestArrivalStartTime, queryParams.value.latestArrivalEndTime]
      : [],
  set: (val) => {
    queryParams.value.latestArrivalStartTime = val ? val[0] : undefined
    queryParams.value.latestArrivalEndTime = val ? val[1] : undefined
  }
})

const requestSourceOption = computed(() => getDictOptions(DICT_TYPE.SC_PR_REQUEST_SOURCE))

const productBeforeDate = computed({
  get: () =>
    queryParams.value.productBeforeStartDate && queryParams.value.productBeforeEndDate
      ? [queryParams.value.productBeforeStartDate, queryParams.value.productBeforeEndDate]
      : [],
  set: (val) => {
    queryParams.value.productBeforeStartDate = val ? val[0] : undefined
    queryParams.value.productBeforeEndDate = val ? val[1] : undefined
  }
})

watch(
  () => queryParams.value,
  (val) => {
    emit('update:params', { ...props.params, ...val })
  },
  { deep: true }
)

function reset() {
  Object.assign(
    queryParams.value,
    Object.fromEntries(Object.entries(queryParams.value).map(([key]) => [key, undefined])),
    { page: 1, size: 10 }
  )
}

function handleChangeCodeType(codeTypes) {
  let val = ''
  Object.keys(codeTypes).forEach((key) => {
    queryParams.value[key] && (val = queryParams.value[key])
    queryParams.value[key] = undefined
  })
  val && emit('handleQuery')
}

defineExpose({ reset })
</script>
<style lang="less" scoped></style>
