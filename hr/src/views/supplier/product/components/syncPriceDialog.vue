<template>
  <s-w-dialog
    width="1300"
    :model-value="modelValue"
    title="采购价格同步"
    @open="handleOpen"
    @closed="handleClosed"
  >
    <special-table
      ref="swTableRef"
      :data="tableData"
      :options="TABLE_OPTIONS"
      :max-height="600"
      v-model:filters="filters"
      :cell-class-name="cellClassName"
      @select="handleTableSelected"
    />

    <template #footer>
      <el-button @click="emit('update:model-value', false)">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </s-w-dialog>
</template>

<script lang="tsx" setup>
import { queryPoDetailPriceChangeListApi, syncPoDetailPriceApi } from '@/api/supplier/purchase'
import specialTable from '../../components/table.vue'
import { copyBtn } from '../../components/twoFourSix'
const TABLE_OPTIONS: TableOption = [
  { type: 'index', width: 60, fixed: 'left' },
  { type: 'selection', width: 60, fixed: 'left' },
  {
    label: '生产订单号',
    prop: 'poNo',
    minWidth: 130,
    formatter: copyBtn
  },
  {
    label: '货品编码',
    prop: 'goodsCode',
    minWidth: 110,
    formatter: copyBtn
  },
  { label: '货品名称', prop: 'goodsName', minWidth: 130 },
  {
    label: 'SKU',
    prop: 'sku',
    minWidth: 130,
    formatter: copyBtn,
    fixed: 'left'
  },
  { label: '规格名称', prop: 'formName', minWidth: 110 },
  { label: '规格码', prop: 'formCode', minWidth: 110 },
  { label: '供应商', prop: 'supplierName', minWidth: 110 },
  { label: '变更前裸货价', prop: 'beforeBaseProdCost', minWidth: 110, fixed: 'right' },
  { label: '变更后裸货价', prop: 'afterBaseProdCost', minWidth: 110, fixed: 'right' },
  { label: '变更前成品价', prop: 'beforeFgCost', minWidth: 110, fixed: 'right' },
  { label: '变更后成品价', prop: 'afterFgCost', minWidth: 110, fixed: 'right' }
]

const message = useMessage()

const props = defineProps<{
  modelValue: boolean
  poId: string
}>()

const emit = defineEmits<{
  (e: 'update:model-value', v: boolean): void
}>()

// 1. 请求控制器：用于中断前一次未完成的请求
const abortController = ref<AbortController | null>(null)
// 2. 请求版本号：标记最新请求，仅处理最新版本的响应
const requestId = ref(0)
const filters = ref({
  poNo: [],
  goodsCode: [],
  sku: []
})
const tableData = ref<any[]>([])
const selectedRows = ref<any[]>([])
const swTableRef = ref<InstanceType<typeof specialTable>>()

watch(
  () => filters.value,
  async () => {
    await nextTick()
    const selectMap = new Map(
      selectedRows.value.map((selectedRow) => [selectedRow.sku, selectedRow])
    )

    swTableRef.value?.filterData.forEach((row) => {
      swTableRef.value?.toggleRowSelection(row, selectMap.has(row.sku))
    })
  },
  { deep: true }
)

function handleOpen() {
  getList()
}
function handleClosed() {
  emit('update:model-value', false)
  tableData.value = []
}
async function handleSubmit() {
  const loading = ElLoading.service({ text: '价格同步中...' })
  try {
    const selectedMap = new Map(
      selectedRows.value.map((selectedRow) => [selectedRow.sku, selectedRow])
    )

    const params = tableData.value.map((row) => ({ ...row, checkFlag: selectedMap.has(row.sku) }))

    const res = await syncPoDetailPriceApi(params)
    if (res.success) {
      message.success('价格同步成功！')
      emit('update:model-value', false)
    }
  } catch (error) {
  } finally {
    loading.close()
  }
}

async function getList() {
  if (abortController.value) {
    abortController.value.abort('新请求触发，中断旧请求')
  }
  abortController.value = new AbortController()
  const currentRequestId = ++requestId.value

  try {
    const res = await queryPoDetailPriceChangeListApi(props.poId, abortController.value.signal)
    if (currentRequestId !== requestId.value) return
    tableData.value = res
    selectedRows.value = res.filter((row) => row.checkFlag)

    tableData.value.forEach((row) => {
      swTableRef.value?.toggleRowSelection(row, row.checkFlag)
    })
  } catch (error) {}
}

function handleTableSelected(val: typeof selectedRows.value, item: Supplier.Purchase.ListItem) {
  const selectedMap = new Map(selectedRows.value.map((row) => [row.sku, row]))
  const currentMap = new Map(val.map((row) => [row.sku, row]))
  if (item) {
    if (!selectedMap.has(item.sku) && currentMap.has(item.sku)) selectedRows.value.push(item)
    else if (selectedMap.has(item.sku) && !currentMap.has(item.sku))
      selectedRows.value = selectedRows.value.filter((row) => row.sku !== item.sku)
  } else {
    if (val.some((row) => !selectedMap.has(row.sku))) selectedRows.value.push(...val)
    if (val.every((row) => selectedMap.has(row.sku))) {
      const removeItems = tableData.value.filter((row) => !currentMap.has(row.sku))
      const removeItemsMap = new Map(removeItems.map((row) => [row.sku, row]))
      selectedRows.value = selectedRows.value.filter((row) => !removeItemsMap.has(row.sku))
    }
  }

  selectedRows.value = Array.from(new Map(selectedRows.value.map((row) => [row.sku, row])).values())
}

function cellClassName({ column }) {
  if (['afterBaseProdCost', 'afterFgCost'].includes(column.rawColumnKey)) return 'after-change-cell'
  else return ''
}
</script>
<style lang="less" scoped>
@import url(../../index.scss);
</style>

<style>
.after-change-cell {
  background-color: #fef1ce !important;
  color: #d25d5a !important;
}
</style>
