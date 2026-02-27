<template>
  <s-w-drawer
    :model-value="modelValue"
    title="交付率明细"
    width=""
    @open="handleOpen"
    @closed="handleClosed"
  >
    <el-card shadow="never" class="!border-0">
      <el-descriptions :column="3">
        <el-descriptions-item :label="description.label" label-class-name="font-600">{{
          description.value
        }}</el-descriptions-item>
        <el-descriptions-item label="统计月份" label-class-name="font-600">{{
          month
        }}</el-descriptions-item>
      </el-descriptions>

      <special-table :data="tableData" :options="detailTable" :loading="loading" :max-height="680">
        <template
          v-for="slotName in SORT_COLUMN"
          :key="slotName"
          #[`${slotName}_header`]="{ column }"
        >
          <div class="flex items-center justify-end">
            <span>{{ column.label }}</span>
            <filter-popper
              v-model:query-params="queryParams"
              :slot-name="`${slotName}Query`"
              :precision="PRECISIONS[slotName]"
              @handle-query="getDetail"
            />

            <el-tooltip v-if="slotName === 'deliveryRate'" placement="top">
              <template #content>
                <div class="mb-12px">
                  <p class="font-600">合同首批日期和合同清单日期在同一个月内的生产订单</p>
                  <p>交付率 = 预约发货数量 / 下单数量</p>
                </div>

                <div>
                  <p class="font-600">合同首批日期和合同清单日期在两个月内的生产订单</p>
                  <p> 非合同清单日期所在月份：交付率 = 预约发货数量 / 每日应发货数量 </p>
                  <p> 合同清单日期所在月份：A 交付率 = 预约发货数量 / 下单数量 </p>
                  <p> 预约发货数量 = 合同期内（合同清单日期后延3天）预约发货的数量 </p>
                  <p> 下单数量 = 采购生产订单的“采购数量” </p>
                  <p> 每日应发货数量 = 下单数量 / 交期天数 </p>
                  <p> 交期天数 = 合同清单日期 - 合同首批日期 </p>
                </div>
              </template>

              <Icon icon="bi:question-circle" :size="12" class="ml-4px" />
            </el-tooltip>
          </div>
        </template>
      </special-table>
    </el-card>

    <template #footer>
      <el-button @click="handleClosed">关闭</el-button>
    </template>
  </s-w-drawer>
</template>
<script lang="ts" setup>
import specialTable from '@/views/supplier/components/table.vue'
import filterPopper from '@/views/supplier/ledger/components/filterPopper.vue'
import { getDeliveryAnalysisDetail } from '@/api/supplier/supplierData'
import { detailTable } from '../options'

const props = defineProps<{
  modelValue: boolean
  code?: string
  type?: '1' | '2' | '3'
  supplierName?: string
  categoryName?: string
  goodsName?: string
  month?: string
}>()

const description = computed(() => {
  return {
    1: {
      label: '供应商名称',
      value: props.supplierName
    },
    2: {
      label: '品类',
      value: props.categoryName
    },
    3: {
      label: '货品名称',
      value: props.goodsName
    }
  }[props.type!]
})

const SORT_COLUMN = [
  'purchasedGoodsQuantity',
  'toShipQuantity',
  'deliveryQuantity',
  'deliveryRate',
  'deliveryDays'
]
const PRECISIONS = { requestQuantity: 0, deliveryQuantity: 0, deliveryRate: 2 }

const emit = defineEmits<{
  (e: 'update:model-value', v: boolean): void
}>()

const tableData = ref<any[]>([])

const queryParams = ref({
  ...Object.fromEntries(SORT_COLUMN.map((ele) => [`${ele}Query`, { sort: undefined }]))
})

function handleOpen() {
  getDetail()
}

function handleClosed() {
  tableData.value = []
  emit('update:model-value', false)
}

const loading = ref(false)
async function getDetail() {
  try {
    loading.value = true
    const res = await getDeliveryAnalysisDetail({
      ...queryParams.value,
      code: props.code!,
      month: props.month!,
      type: props.type!
    })

    tableData.value = res
  } catch (error) {
  } finally {
    loading.value = false
  }
}
</script>
<style lang="less" scoped>
@import url(../../index.scss);
</style>
