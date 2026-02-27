<template>
  <div class="title">出库信息</div>
  <!-- 列表 -->
  <el-table :header-cell-style="appStore.headerCellStyle" v-loading="loading" :data="list" :show-overflow-tooltip="true"
    :tooltip-options="{ popperClass: 'refund-tips' }" ref="tableRef" row-class-name="commonTableRow"
    class="SWCommonTable" v-horizontal-scroll="'always'">
    <el-table-column label="出库单号" prop="outboundOrderCode" min-width="200"
      :formatter="(row: any) => formatterValue(row, 'outboundOrderCode', '-')" fixed="left" />
    <el-table-column label="订单号" prop="subOriginalNum" min-width="200"
      :formatter="(row: any) => formatterValue(row, 'subOriginalNum', '-')" />
    <el-table-column label="子订单号" prop="originalSubNum" min-width="200"
      :formatter="(row: any) => formatterValue(row, 'originalSubNum', '-')" />
    <el-table-column label="出库仓库" prop="warehouse" min-width="150"
      :formatter="(row: any) => formatterValue(row, 'warehouse', '-')" />
    <el-table-column label="货品编码" prop="productCode" min-width="120"
      :formatter="(row: any) => formatterValue(row, 'productCode', '-')" />
    <el-table-column label="商品编码" prop="merchantCode" min-width="120"
      :formatter="(row: any) => formatterValue(row, 'merchantCode', '-')" />
    <el-table-column label="出库数量" prop="goodsQuantity" min-width="120" align="right"
      :formatter="(row: any) => dealNumber(row.goodsQuantity)" />
    <el-table-column label="子单应收金额" prop="subAmountReceivable" min-width="150" align="right"
      :formatter="(row: any) => dealNumber(row.subAmountReceivable)" />
    <el-table-column label="实际货品成本" prop="goodsTotalCost" min-width="150" align="right"
      :formatter="(row: any) => dealNumber(row.goodsTotalCost)" />
    <el-table-column label="出库状态" prop="outboundOrderStatus" min-width="120"
      :formatter="(row: any) => formatterValue(row, 'outboundOrderStatus', '-')" />
    <el-table-column label="发货时间" prop="deliverTime" width="180"
      :formatter="(row: any) => formatTime(row.deliverTime, 'yyyy-MM-dd HH:mm:ss')" />
    <!-- <el-table-column label="店铺" prop="storeName" width="165">
      <template v-slot="{ row }">
        <span>{{ row.storeName }}</span>
      </template>
</el-table-column> -->
    <el-table-column label="物流公司" prop="logistics" min-width="120"
      :formatter="(row: any) => formatterValue(row, 'logistics', '-')" />
    <el-table-column label="物流单编号" prop="logisticsCode" min-width="180"
      :formatter="(row: any) => formatterValue(row, 'logisticsCode', '-')" />
    <template #empty>
      <div class="flex-column" style="align-items: center;">
        <!-- <img class="empty-table" src="@/assets/imgs/promotion/empty.png" alt="" object-fit="contain" /> -->
        <span>暂无数据</span>
      </div>
    </template>
  </el-table>
</template>
<script lang="ts" setup>

import { formatterValue, formatTime } from "@/utils";
import { useAppStore } from '@/store/modules/app';
const appStore = useAppStore();
import { dealNumber } from '@/views/finance/refund/components/common'
const propos = defineProps({
  list: {
    type: Array as PropType<any>,
    required: true
  },
  loading: {
    type: Boolean as PropType<boolean>,
    required: true
  }
})

const tableRef = ref<any>();
watch(() => propos.list, () => {
  tableRef.value?.scrollTo(0)
  tableRef.value?.setScrollLeft(0)
})
</script>

<style lang="scss" scoped>
.title {
  font-size: 16px;
  color: #333333;
  margin-bottom: 16px;
  margin-top: 20px;
}

* {
  --el-table-border-color: #F0F0F0;
}

:deep(.el-table__body-wrapper) {
  border-left: 1px solid #F0F0F0;
  border-right: 1px solid #F0F0F0;
  width: calc(100% - 2px);
}

:deep(.refund-tips) {
  max-width: 335px;
}
</style>