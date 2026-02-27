<template>
  <div class="monthly-settle-drawer">
    <div class="toolbar text-right">
      <el-button type="primary" @click="onRefresh">刷新</el-button>
      <el-button type="primary" @click="onCreate">新建月度汇算</el-button>
    </div>

    <s-table :columns="columns" :fetch="getZtoPriceMatchRecordList" ref="tableRef">
      <template #status="{ row }">
        <span :style="{ color: statusColor(row.status) }">{{ statusText(row.status) }}</span>
      </template>
    </s-table>
  </div>
</template>

<script lang="tsx" setup>
import { ref, defineAsyncComponent } from 'vue'
import type { TableColumn } from '@/components/SWTable/src/table'
import { useDialog } from '@/hooks/web/useDialog'
import { getZtoPriceMatchRecordList } from '@/api/finance/zto'

const tableRef = ref()
const { openDialog } = useDialog()

const columns: TableColumn[] = [
  { prop: 'ztoDataBelong', label: '中通账单月份', minWidth: 130 },
  { prop: 'configDataBelong', label: '阶梯单价月份', minWidth: 130 },
  { prop: 'matchTime', label: '汇算时间', minWidth: 180 },
  { prop: 'status', label: '状态', minWidth: 100, slot: 'status' }
]

const statusColor = (status: number) => {
  if (status === 1) return '#ff9900' // 进行中
  if (status === 2) return '#67c23a' // 成功
  if (status === 3) return '#f56c6c' // 失败
  return '#909399'
}

const statusText = (status: number) => {
  if (status === 1) return '汇算中'
  if (status === 2) return '汇算成功'
  if (status === 3) return '汇算失败'
  return '-'
}

const onCreate = async () => {
  await openDialog({
    title: '新建月度汇算',
    width: 400,
    content: defineAsyncComponent(() => import('./monthlySettleStartDialog.vue')),
    showConfirmFooter: true,
    confirmText: '开始汇算',
    cancelText: '取消',
    onSuccess: async () => {
      tableRef.value?.refresh?.(true)
    }
  })
}

const onRefresh = () => {
  tableRef.value?.refresh?.(true)
}
</script>

<style scoped lang="scss">
.monthly-settle-drawer {
  padding: 10px 4px;
  .toolbar {
    margin-bottom: 10px;
  }
}
</style>
