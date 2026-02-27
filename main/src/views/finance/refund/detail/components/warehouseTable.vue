<template>
  <div class="title">销退入库信息</div>
  <!-- 列表 -->
  <el-table :header-cell-style="appStore.headerCellStyle" v-loading="loading" :data="list" :show-overflow-tooltip="true"
    :tooltip-options="{ popperClass: 'refund-tips' }" ref="tableRef" row-class-name="commonTableRow"
    class="SWCommonTable" v-horizontal-scroll="'always'">
    <el-table-column label="入库单号" prop="inboundOrderNo" min-width="200"
      :formatter="(row: any) => formatterValue(row, 'inboundOrderNo', '-')" fixed="left" />
    <el-table-column label="入库单状态" prop="inboundOrderStatus" min-width="120"
      :formatter="(row: any) => formatterValue(row, 'inboundOrderStatus', '-')" />
    <el-table-column label="入库类型" prop="inboundType" min-width="120"
      :formatter="(row: any) => formatterValue(row, 'inboundType', '-')" />
    <el-table-column label="实际入库仓库" prop="actualWarehouse" min-width="120"
      :formatter="(row: any) => formatterValue(row, 'actualWarehouse', '-')" />
    <el-table-column label="入库货位" prop="warehousingLocation" min-width="120"
      :formatter="(row: any) => formatterValue(row, 'warehousingLocation', '-')" />
    <el-table-column label="商家编码" prop="merchantCode" min-width="120"
      :formatter="(row: any) => formatterValue(row, 'merchantCode', '-')" />
    <el-table-column label="货品编号" prop="goodsCode" min-width="120"
      :formatter="(row: any) => formatterValue(row, 'goodsCode', '-')" />
    <el-table-column label="货品名称" prop="goodsName" min-width="120"
      :formatter="(row: any) => formatterValue(row, 'goodsName', '-')" />
    <el-table-column label="数量" prop="quantity " min-width="150" align="right"
      :formatter="(row: any) => dealNumber(row.quantity)" />
    <el-table-column label="物流公司" prop="logisticsCompany" min-width="150"
      :formatter="(row: any) => formatterValue(row, 'logisticsCompany', '-')" />
    <el-table-column label="物流单号" prop="logisticsTrackingNo" min-width="220"
      :formatter="(row: any) => formatterValue(row, 'logisticsTrackingNo', '-')" />
    <el-table-column label="单品入库瞬时成本" prop="singleProductCost " min-width="150" align="right"
      :formatter="(row: any) => dealNumber(row.singleProductCost)" />
    <el-table-column label="单品入库瞬时总成本" prop="singleProductTotalCost " min-width="150" align="right"
      :formatter="(row: any) => dealNumber(row.singleProductTotalCost)" />
    <el-table-column label="备注" prop="remark" min-width="150"
      :formatter="(row: any) => formatterValue(row, 'remark', '-')" />
    <el-table-column label="经办人" prop="manager" min-width="120"
      :formatter="(row: any) => formatterValue(row, 'manager', '-')" />
    <el-table-column label="制单时间" prop="preparationTime" width="180"
      :formatter="(row: any) => formatTime(row.preparationTime, 'yyyy-MM-dd HH:mm:ss')" />
    <el-table-column label="审核时间" prop="reviewTime" width="180"
      :formatter="(row: any) => formatTime(row.reviewTime, 'yyyy-MM-dd HH:mm:ss')" />
    <el-table-column label="退还单号" prop="returnExchangeNo" min-width="160"
      :formatter="(row: any) => formatterValue(row, 'returnExchangeNo', '-')" />
    <el-table-column label="原始订单" prop="originalOrderNo" min-width="220"
      :formatter="(row: any) => formatterValue(row, 'originalOrderNo', '-')" />
    <el-table-column label="系统订单编号" prop="sysOrderNo" min-width="220"
      :formatter="(row: any) => formatterValue(row, 'sysOrderNo', '-')" />
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
import { dealNumber } from '@/views/finance/refund/components/common'
import { useAppStore } from '@/store/modules/app';
const appStore = useAppStore();
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