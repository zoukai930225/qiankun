<template>
  <div class="title mt20px"> 发货预约单明细 </div>
  <el-divider />
  <sw-table
    class="form-table"
    :data="tableData"
    :options="tableOptions"
    :loading="loading"
    :max-height="620"
    :show-overflow-tooltop="true"
  />
</template>
<script lang="tsx" setup>
import { addPurchaseTable } from '../options'
import SwTable from '../../components/table.vue'

defineOptions({ name: 'PurchaseProductOrderInfo' })

const props = withDefaults(
  defineProps<{
    data?: any
    tableOptions?: TableOption
  }>(),
  {
    tableOptions: () => addPurchaseTable
  }
)

const tableData = computed(() => {
  const sumRow: any = {}
  sumRow[addPurchaseTable[0].prop!] = '合计'

  function computedSum(key: string) {
    return Math.round(props.data.reduce((arr, cur) => arr + (cur[key] ?? 0), 0) * 100) / 100
  }

  const keys = [
    'purchasedGoodsQuantity',
    'remainingDeliveryQuantity',
    'deliveryGoodsQuantity',
    'inboundGoodsQuantity',
    'stockIn'
  ]

  keys.forEach((key) => {
    sumRow[key] = computedSum(key)
  })

  sumRow.price =
    Math.round(
      props.data.reduce(
        (arr, cur) => arr + (cur?.deliveryGoodsQuantity ?? 0) * (cur?.supplierGoodsPrice ?? 0),
        0
      ) * 100
    ) / 100

  sumRow.key = 'sumRow'

  return props.data.length ? [sumRow, ...props.data] : []
})

const loading = ref(false)
</script>
<style lang="less" scoped>
@import url(../../index.scss);
.is_warning {
  // display: none;

  :deep(.el-input__wrapper) {
    box-shadow: 0 0 0 1px #ffca57;

    &:focus {
      box-shadow: 0 0 0 1px #ffca57 inset;
    }
  }
}
</style>
