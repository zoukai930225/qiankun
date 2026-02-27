<template>
  <div class="title">订单信息</div>
  <!-- 列表 -->
  <el-table :header-cell-style="appStore.headerCellStyle" v-loading="loading" :data="list" :show-overflow-tooltip="true"
    :tooltip-options="{ popperClass: 'refund-tips' }" ref="tableRef" row-class-name="commonTableRow"
    class="SWCommonTable" v-horizontal-scroll="'always'">
    <el-table-column label="订单号" prop="orderNo" min-width="200"
      :formatter="(row: any) => formatterValue(row, 'orderNo', '-')" fixed="left" />
    <el-table-column label="子订单号" prop="subOrderNo" min-width="200"
      :formatter="(row: any) => formatterValue(row, 'subOrderNo', '-')" />
    <el-table-column label="商品价格(元)" prop="productPrice" min-width="120" align="right"
      :formatter="(row: any) => dealNumber(row.productPrice)" />
    <el-table-column label="购买数量" prop="salesQuantity" min-width="120" align="right"
      :formatter="(row: any) => dealNumber(row.salesQuantity)" />
    <el-table-column label="支付金额(元)" prop="paymentAmount" min-width="150" align="right"
      :formatter="(row: any) => dealNumber(row.paymentAmount)" />
    <el-table-column label="商品" prop="goodsName" width="225">
      <template v-slot="{ row }">
        <FinanceRefundGoodCell :row="row" />
      </template>
    </el-table-column>
    <el-table-column label="商品编码" prop="goodsCode" min-width="120"
      :formatter="(row: any) => formatterValue(row, 'goodsCode', '-')" />
    <el-table-column label="货品编码" prop="productCode" min-width="120"
      :formatter="(row: any) => formatterValue(row, 'productCode', '-')" />
    <el-table-column label="货品属性" prop="productAttributes" min-width="180"
      :formatter="(row: any) => formatterValue(row, 'productAttributes', '-')" />
    <el-table-column label="订单状态" prop="orderStatus" min-width="120"
      :formatter="(row: any) => formatterValue(row, 'orderStatus', '-')" />
    <el-table-column label="创建时间" prop="createTime" width="180"
      :formatter="(row: any) => formatTime(row.createTime, 'yyyy-MM-dd HH:mm:ss')" />
    <el-table-column label="支付时间" prop="payTime" width="180"
      :formatter="(row: any) => formatTime(row.payTime, 'yyyy-MM-dd HH:mm:ss')" />
    <el-table-column label="店铺" prop="store" width="165" :show-overflow-tooltip="false">
      <template v-slot="{ row }">
        <storeCell :row="row" v-if="row.store && row.storeName" />
        <span v-else>-</span>
      </template>
    </el-table-column>
    <template #empty>
      <div class="flex-column" style="align-items: center;">
        <!-- <img class="empty-table" src="@/assets/imgs/promotion/empty.png" alt="" object-fit="contain" /> -->
        <span>暂无数据</span>
      </div>
    </template>
  </el-table>
</template>
<script lang="ts" setup>
import FinanceRefundGoodCell from '@/views/finance/refund/components/goodCell.vue'
import { formatterValue, formatTime } from "@/utils";
import { dealNumber } from '@/views/finance/refund/components/common'
import storeCell from "../../components/storeCell.vue";
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
