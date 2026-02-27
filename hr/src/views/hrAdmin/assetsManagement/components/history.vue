<template>
  <div class="history-table mt-20px">
    <s-table
      ref="tableRef"
      :columns="columns"
      :fetch="fetchList"
      :fetch-params="queryParams"
      :show-pagination="false"
      stripe
      :show-overflow-tooltip="true"
    />
  </div>
</template>

<script setup lang="tsx">
import { ref, watch, nextTick, onMounted } from 'vue'
import * as Asset from '@/api/hrAdmin/asset'

const props = defineProps<{ assetId?: string }>()

const tableRef = ref()
const queryParams = ref<Record<string, any>>({})

function formatDateTime(input: any): string {
  if (input === null || input === undefined || input === '') return '---'
  try {
    const date = new Date(input)
    if (isNaN(date.getTime())) return String(input)
    return date.toLocaleString('zh-CN', { hour12: false })
  } catch (e) {
    return String(input)
  }
}

const columns = ref<any[]>([
  { prop: 'username', label: '使用人', minWidth: 120, headerAlign: 'left', align: 'left' },
  { prop: 'companyName', label: '所属公司', minWidth: 200, headerAlign: 'left', align: 'left' },
  { prop: 'phone', label: '手机号码', minWidth: 140, headerAlign: 'left', align: 'left' },
  {
    prop: 'beginDate',
    label: '使用开始时间',
    minWidth: 180,
    headerAlign: 'left',
    align: 'left',
    customRender: ({ row }) => <span>{formatDateTime(row?.beginDate)}</span>
  },
  {
    prop: 'endDate',
    label: '使用结束时间',
    minWidth: 180,
    headerAlign: 'left',
    align: 'left',
    customRender: ({ row }) => <span>{formatDateTime(row?.endDate)}</span>
  }
])

const fetchList = async () => {
  if (!props.assetId) return { records: [], total: 0 }
  const data = await Asset.getAssetHistoryUser(props.assetId)
  const list = Array.isArray(data) ? data : []
  return { records: list, total: list.length }
}

const refresh = async () => {
  await nextTick()
  tableRef.value?.refresh?.(true)
}

watch(
  () => props.assetId,
  (val) => {
    if (val) refresh()
  }
)

onMounted(() => {
  if (props.assetId) refresh()
})
</script>

<style scoped lang="scss">
.history-table {
}
</style>
