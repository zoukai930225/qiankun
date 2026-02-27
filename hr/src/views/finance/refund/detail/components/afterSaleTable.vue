<template>
  <div class="title">售后信息</div>
  <!-- 列表 -->
  <el-table :header-cell-style="appStore.headerCellStyle" v-loading="loading" :data="list" :show-overflow-tooltip="true"
    :tooltip-options="{ popperClass: 'refund-tips' }" ref="tableRef" row-class-name="commonTableRow"
    class="SWCommonTable" v-horizontal-scroll="'always'">
    <el-table-column label="售后单号" prop="refundNumber" min-width="200"
      :formatter="(row: any) => formatterValue(row, 'refundNumber', '-')" fixed="left" />
    <el-table-column label="订单号" prop="orderNo" min-width="200"
      :formatter="(row: any) => formatterValue(row, 'orderNo', '-')" />
    <el-table-column label="买家实付金额" prop="buyerPaymentAmount" min-width="150" align="right"
      :formatter="(row: any) => dealNumber(row.buyerPaymentAmount)" />
    <el-table-column label="退款金额" prop="refundAmount" min-width="150" align="right"
      :formatter="(row: any) => dealNumber(row.refundAmount)" />
    <el-table-column label="退款类型" prop="partialOrFullRefund" min-width="120"
      :formatter="(row: any) => formatterValue(row, 'partialOrFullRefund', '-')" />
    <el-table-column label="退款原因" prop="buyerRefundReason" min-width="180"
      :formatter="(row: any) => formatterValue(row, 'buyerRefundReason', '-')" />
    <el-table-column label="退款状态" prop="refundStatus" min-width="120"
      :formatter="(row: any) => formatterValue(row, 'refundStatus', '-')" />
    <el-table-column label="退款说明" prop="buyerRefundDescription" min-width="120"
      :formatter="(row: any) => formatterValue(row, 'buyerRefundDescription', '-')" />
    <el-table-column label="退款完成时间" prop="refundTime" width="180"
      :formatter="(row: any) => formatTime(row.refundTime, 'yyyy-MM-dd HH:mm:ss')" />
    <el-table-column label="是否小额打款" prop="smallAmountReceipt" min-width="120"
      :formatter="(row: any) => formatterValue(row, 'smallAmountReceipt', '-')" />
    <el-table-column label="退货时间" prop="buyerReturnTime" width="180"
      :formatter="(row: any) => formatTime(row.buyerReturnTime, 'yyyy-MM-dd HH:mm:ss') || '-'" />
    <el-table-column label="商家备注" prop="merchantRemark" min-width="180"
      :formatter="(row: any) => formatterValue(row, 'merchantRemark', '-')" />
    <el-table-column label="退货物流信息" prop="returnLogisticsInfo" min-width="150"
      :formatter="(row: any) => formatterValue(row, 'returnLogisticsInfo', '-')" />
    <el-table-column label="退货物流公司" prop="returnLogisticsCompany" min-width="150"
      :formatter="(row: any) => formatterValue(row, 'returnLogisticsCompany', '-')" />
    <el-table-column label="退货物流单号" prop="returnLogisticsNumber" min-width="150"
      :formatter="(row: any) => formatterValue(row, 'returnLogisticsNumber', '-')" />
    <el-table-column label="申请时间" prop="applyTime" width="180"
      :formatter="(row: any) => formatTime(row.applyTime, 'yyyy-MM-dd HH:mm:ss')" />
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