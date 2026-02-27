<template>
  <div class="chartDetailTable">
    <el-table
      :header-cell-style="appStore.headerCellStyle"
      v-loading="loading"
      :data="list"
      class="SWCommonTable fixedHeaderTable"
      v-horizontal-scroll="'always'"
      row-class-name="house-hover-row"
    >
      <el-table-column prop="dataDate" label="数据日期" />
      <el-table-column prop="transactionAmount" label="成交金额" />
      <el-table-column prop="preShipmentRefundRate" label="发货前退款率" />
      <el-table-column prop="refundRate" label="退款率" />
      <el-table-column prop="postShipmentRefundRate" label="发货后退款率" />
    </el-table>
  </div>
</template>
<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'
import { propTypes } from '@/utils/propTypes'
const appStore = useAppStore()

const props = defineProps({
  loading: propTypes.bool.def(false),
  data: propTypes.object.def({}),
  list: propTypes.array.def([]),
  staticsDate: propTypes.string.def('')
})
</script>
<style lang="scss" scoped>
.chartDetailTable {
  max-height: 53vh;
  overflow: auto;
}
:deep(.el-table__cell) {
  border-left: none !important;
}

:deep(.el-table td.el-table__cell, .el-table th.el-table__cell.is-leaf) {
  border-left: none !important;
}

:deep(.el-table__body tr.house-hover-row:hover > td) {
  background-color: #e6e6e6 !important;
  --el-fill-color-light: ##e6e6e6 !important;
  --el-fill-color-lighter: ##e6e6e6 !important;
}
</style>
