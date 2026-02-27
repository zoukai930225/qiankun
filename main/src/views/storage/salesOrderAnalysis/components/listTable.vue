<template>
  <el-table
    class="SWCommonTable"
    stripe
    border
    :data="list"
    :show-overflow-tooltip="false"
    v-loading="loading"
    v-horizontal-scroll="'always'"
    row-class-name="commonTableRow"
    :header-cell-style="appStore.headerCellStyle"
    @sort-change="handleSortChange"
  >
    <el-table-column prop="orderNumber" label="订单号">
      <template #default="{ row }">
        <span class="cursor-pointer" @click="copyText(row.orderNumber)">{{ row.orderNumber }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="outboundOrderNumber" label="出库单号">
      <template #default="{ row }">
        <span class="cursor-pointer" @click="copyText(row.outboundOrderNumber)">{{
          row.outboundOrderNumber
        }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="orderSource" label="订单来源" />
    <el-table-column prop="paymentTime" label="付款时间" />
    <el-table-column prop="createTime" label="审核时间" />
    <el-table-column prop="deliveryTime" label="发货时间" />
    <el-table-column prop="storeName" label="店铺" min-width="120" />
    <el-table-column prop="warehouse" label="仓库" />
    <el-table-column prop="auditDuration" label="审核用时(h)" sortable="custom">
      <template #default="{ row }">
        {{ row.auditDuration || '-' }}
      </template>
    </el-table-column>
    <el-table-column prop="deliveryDuration" label="发货用时(h)" sortable="custom">
      <template #default="{ row }">
        {{ row.deliveryDuration || '-' }}
      </template>
    </el-table-column>
    <template #empty>
      <div class="empty-img">
        <img src="@/assets/imgs/common/empty_list.png" alt="" />
        <div>暂无数据</div>
      </div>
    </template>
  </el-table>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { copyText } from '@/utils/copyText'
import { useAppStore } from '@/store/modules/app'
const appStore = useAppStore()

const props = defineProps({
  list: {
    type: Array,
    default: () => []
  },
  total: {
    type: Number,
    default: 0
  },
  loading: {
    type: Boolean,
    default: false
  },
  orderSourceOps: {
    type: Array,
    default: () => []
  }
})

// 排序事件
const handleSortChange = ({ prop, order }) => {
  emits('sort', { prop, order })
}

const emits = defineEmits(['sort'])
</script>

<style lang="scss" scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
