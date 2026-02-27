<template>
  <sw-table
    :options="tableOptions"
    :data="tableData"
    :loading="loading"
    :show-overflow-tooltip="true"
  />

  <div class="w100% mt20px flex justify-between">
    <div v-if="isShowTotal" class="flex items-center font-size-14px">
      <span v-for="item in summaryItems" :key="item.prop">
        <span class="color-#666 mr-1.5">{{ item.label }}</span>
        <span class="fw-600 mr-3">{{
          new Intl.NumberFormat().format(summary?.[item.prop] ?? 0)
        }}</span>
      </span>
    </div>
    <div v-else></div>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.size"
      @pagination="getList"
    />
  </div>
</template>
<script lang="ts" setup>
const SwTable = defineAsyncComponent(() => import('@/views/supplier/components/table.vue'))

const props = withDefaults(
  defineProps<{
    rowData: any
    tableOptions: TableOption
    api: (params: any) => Promise<any>
    params: any
    isNotPage?: boolean
  }>(),
  {}
)

const queryParams = reactive({
  pageNum: 1,
  size: 10
})
const tableData = ref<Supplier.Purchase.ListItem[]>([])
const total = ref(0)
const loading = ref(false)
const summary = ref({
  purchasedGoodsQuantityTotal: 0,
  goodKindsTotal: 0,
  deliveryGoodsQuantityTotal: 0,
  inboundGoodsQuantityTotal: 0,
  stockInTotal: 0,
  priceTotal: 0
})
const summaryLabel = {
  purchasedGoodsQuantityTotal: '总采购量',
  goodKindsTotal: '款数',
  deliveryGoodsQuantityTotal: '总发货量',
  inboundGoodsQuantityTotal: '总入库量',
  stockInTotal: '总货品数',
  priceTotal: '总金额'
}
const summaryItems = computed(() => {
  return Object.keys(summary.value).map((key) => ({
    prop: key,
    label: summaryLabel[key]
  }))
})
const isShowTotal = ref(false)

async function getList() {
  try {
    isShowTotal.value = false
    loading.value = true
    const res = await props.api(
      typeof props.params === 'object' ? { ...queryParams, ...props.params } : props.params
    )
    const list = [...(res.records ?? res.scAdvancedShippingRequestOrderDetailList ?? res)]

    tableData.value = list
    total.value = res.total ?? res.length
    summary.value = res.extras.summary
    isShowTotal.value = true
  } catch (error) {
  } finally {
    loading.value = false
  }
}

defineExpose({ getList })
</script>
<style lang="less" scoped>
@import url(../index.scss);

:deep(.el-pagination) {
  margin: 0;
  // margin-bottom: 0;
  float: none;
}
</style>
