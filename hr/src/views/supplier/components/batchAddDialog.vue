<template>
  <s-w-dialog v-model="isShow" ref="dialogRef" title="批量新增" width="1000" @closed="handleClosed">
    <div class="commonTopFilterWrap">
      <div class="commonTopFilterWrap-filter">
        <el-form ref="queryRef" :model="queryParams" inline>
          <el-form-item prop="sku" label="SKU编码">
            <el-input
              v-model.trim="queryParams.sku"
              placeholder="请输入SKU编码"
              clearable
              @keydown.enter="
                ($event) => {
                  $event.preventDefault()
                  handleQuery()
                }
              "
            />
          </el-form-item>
        </el-form>
      </div>
      <div class="commonTopFilterWrap-search">
        <div class="commonTopFilterWrap-search-container">
          <el-button @click="handleQuery" class="commonSearchBtn">
            <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
            搜索
          </el-button>
          <el-button @click="resetQuery" class="commonResetBtn" :style="{ marginLeft: '0px' }">
            重置
          </el-button>
        </div>
      </div>
    </div>

    <sw-table
      ref="swTableRef"
      :options="tableOps"
      :data="tableData"
      :loading="loading"
      :height="440"
      :show-overflow-tooltip="true"
      v-model:filters="tableFilters"
      @select="handleTableSelected"
    />

    <Pagination
      v-if="isPage"
      :total="total"
      v-model:page="queryParams.page"
      v-model:limit="queryParams.size"
      @pagination="getList"
    />

    <div class="btns">
      <el-button @click="handleCancel">关闭</el-button>
      <el-button type="primary" @click="handleComfire"> 确定 </el-button>
    </div>
  </s-w-dialog>
</template>
<script lang="ts" setup>
import { FormInstance } from 'element-plus'
import SwTable from '@/views/supplier/components/table.vue'
import { getInfoBySku } from '@/api/supplier/purchase'
import { batchAddTableOps } from '@/views/supplier/purchase/options'

const props = withDefaults(
  defineProps<{
    isAlready: Supplier.Purchase.ListItem[]
    otherParams?: Record<string, any>
    tableOps?: any
    isPage?: boolean
    api?: (...arg: any[]) => Promise<any>
    filters?: Record<string, any[]>
  }>(),
  {
    tableOps: batchAddTableOps,
    api: getInfoBySku,
    isPage: true
  }
)

const emit = defineEmits<{
  (e: 'batch-add', val: any[]): void
  (e: 'update:filters', val: Record<string, any[]>): void
}>()

const isShow = ref(false)
const queryParams = reactive<Supplier.Purchase.GetListParams>({
  page: 1,
  size: 10
})
const tableData = ref<Supplier.Purchase.ListItem[]>([])
const selectedRows = ref<Supplier.Purchase.ListItem[]>([])
const swTableRef = ref()
const queryRef = ref<FormInstance>()
const total = ref(0)
const tableFilters = ref<Record<string, any[]>>()
const loading = ref(false)

const oldSelectedRows = computed(() => props.isAlready || [])

watch(
  () => tableFilters.value,
  (val) => emit('update:filters', val!),
  { deep: true }
)

watch(
  () => tableData.value,
  (val) => {
    const oldMap = new Map(oldSelectedRows.value.map((row) => [row.sku, true]))
    val.forEach((row) => {
      row.isSelected = oldMap.has(row.sku)
    })
  }
)

watch(
  () => tableData.value,
  (val) => {
    const selectedMap = new Map(selectedRows.value.map((row) => [row.sku, true]))
    val.forEach((row) => swTableRef.value.toggleRowSelection(row, selectedMap.has(row.sku)))
  }
)

async function open() {
  isShow.value = true
  selectedRows.value.push(...props.isAlready)
  selectedRows.value = Array.from(new Map(selectedRows.value.map((row) => [row.sku, row])).values())
  getList()
}

async function getList() {
  loading.value = true
  try {
    const params = {
      sku: queryParams.sku || '',
      pageNum: queryParams.page as number | undefined,
      pageSize: queryParams.size as number | undefined,
      ...props.otherParams
    }

    if (!props.isPage) {
      delete params.pageNum
      delete params.pageSize
    }

    const res = await props.api(params)

    if (!res) {
      tableData.value = []
      total.value = 0
      return
    }

    tableData.value = [...(props.isPage ? res.records : res.scPurchaseOrderDetailList)].map(
      (item) => {
        Object.keys(item).forEach((key) => {
          item[key] =
            item[key] === null || item[key] === '' || item[key] === undefined ? '--' : item[key]
        })
        return item
      }
    )

    total.value = res.total ?? 0
  } catch (error) {
    console.log(error)
  } finally {
    await nextTick()
    loading.value = false
  }
}
async function handleQuery() {
  queryParams.page = 1
  getList()
}
async function resetQuery() {
  queryRef.value?.resetFields()
  getList()
}
async function handleCancel() {
  isShow.value = false
}
function handleClosed() {
  selectedRows.value = []
  resetQuery()
}
async function handleComfire() {
  emit('batch-add', selectedRows.value)
  isShow.value = false
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

onBeforeMount(() => {
  tableFilters.value = props.filters

  console.log(tableFilters.value)
})

defineExpose({ open })
</script>
<style lang="less" scoped>
@import url(../index.scss);
.el-divider {
  width: calc(100% + 32px);
  margin-left: -16px;
  margin-top: 0;
  margin-bottom: 16px;
}

:deep(.el-form) {
  .el-form-item {
    margin-bottom: 24px;
  }
  .el-input__wrapper,
  .el-select__wrapper {
    width: 200px;
    box-sizing: border-box;
  }
}

.el-pagination {
  float: none;

  &::before {
    content: '';
    display: block;
    flex: 1;
  }
}

.btns {
  display: flex;
  margin-top: 16px;
  &::before {
    content: '';
    display: block;
    flex: 1;
  }
}
.headerCellStyle {
  display: none;
  background-color: '#F2F6FC';
  color: '#666';
  font-size: '14px';
  font-weight: '400';
  height: '40px';
}

:deep(.el-table-v2__header-cell) {
  --el-table-header-bg-color: #f2f6fc;
  color: '#666';
  height: '40px';

  .el-table-v2__header-cell-text {
    font-size: 14px;
    font-weight: 400;
  }
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  img {
    cursor: pointer;
  }
}
</style>
<style lang="less">
.code-dialog {
  padding: 0;

  .el-dialog__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;

    .el-dialog__headerbtn {
      width: 16px;
      height: 16px;
      position: static;
    }
  }
  .el-dialog__body {
    padding: 0 20px 24px !important;
  }
}
</style>
