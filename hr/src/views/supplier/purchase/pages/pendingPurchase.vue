<template>
  <table-box v-bind="{ maxViewHeight: innerHeight - 50, thresholdValue: 0 }">
    <template #prePart>
      <el-row :gutter="24" id="searchForm1">
        <el-col :span="20" class="!flex-1">
          <el-form :model="queryParams" ref="queryFormRef" :label-width="90">
            <el-row :gutter="24" :style="{ maxWidth: '1340px' }">
              <el-col :span="6">
                <el-form-item label="需求来源:" prop="requestSource">
                  <el-select
                    v-model="queryParams.requestSource"
                    clearable
                    placeholder="请选择需求来源"
                    @change="handleQuery"
                  >
                    <el-option
                      v-for="{ value, label } in requestSourceOption"
                      :key="value"
                      :value="value"
                      :label="label"
                    />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item prop="skuQuery" label-width="20">
                  <sku-goods-no-select
                    v-model:params="queryParams"
                    goods-code-key="goodsNoQuery"
                    sku-key="skuQuery"
                    @change-type="getList"
                    @change-value="handleQuery"
                  />
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item label="需求单号:" prop="requestNo">
                  <el-input
                    v-model.trim="queryParams.requestNo"
                    placeholder="请输入需求单号"
                    clearable
                    @keydown.enter="handleQuery"
                    @clear="handleQuery"
                  />
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item label="状态:" prop="status">
                  <el-select
                    v-model="queryStatus"
                    placeholder="请选择状态"
                    clearable
                    multiple
                    collapse-tags
                    collapse-tags-tooltip
                    @change="handleQuery"
                    @clear="handleQuery"
                  >
                    <el-option
                      v-for="item in PENDING_STATUS"
                      :key="item.value"
                      :value="item.value"
                      :label="item.label"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-col>

        <el-col :span="4" class="!flex justify-end min-w-284px">
          <el-button @click="handleQuery" class="commonSearchBtn">
            <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
            搜索
          </el-button>
          <el-button @click="resetQuery" class="commonResetBtn" :style="{ marginLeft: '0px' }">
            重置
          </el-button>
          <el-button
            type="primary"
            v-if="hasPermiJs('SupplierPurchase:PendingPurchase:BatchAdd')"
            @click="handleBatchAdd"
          >
            批量分配
          </el-button>
        </el-col>
      </el-row>
    </template>

    <sw-table
      ref="swTableRef"
      :data="tableData"
      :options="pendingPurchaseTable"
      :loading="loading"
      :show-overflow-tooltip="true"
      :cell-class-name="cellClassName"
      :btns-options="btnsOptions"
      :loading-btns="['撤回']"
      row-key="id"
      @select="handleTableSelected"
      @cell-click="handleCellClick"
    >
      <!-- 补单量 -->
      <template #goodsQuantityTotal="{ col, row }">
        <popover-cell
          :reference="col"
          :row-data="row"
          :api="scPurchaseRequestPoolQueryDetailsApi"
          :option="applicationQtyTable"
          is-not-page-api
          title="需求单"
          :params="row.id"
          @show-more="handleCheck(row)"
        />
      </template>
    </sw-table>

    <div class="w100% mt20px flex justify-between">
      <div class="flex items-center font-size-14px">
        <span v-for="item in summaryItems" :key="item.prop">
          <span class="color-#666 mr-1.5">{{ item.label }}</span>
          <span class="fw-600 mr-3">{{
            new Intl.NumberFormat().format(summary?.[item.prop] ?? 0)
          }}</span>
        </span>
      </div>
      <!-- 分页 -->
      <Pagination
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.size"
        @pagination="getList"
      />
    </div>
  </table-box>

  <pending-detail :row-data="rowData" ref="detailDrawerRef" />
</template>
<script lang="ts" setup>
import { applicationQtyTable, PENDING_STATUS, pendingPurchaseTable } from '../options'
import SwTable from '../../components/table.vue'
import {
  allocatedScPurchaseRequestPool,
  getProductProgressIds,
  scPurchaseRequestPoolApi,
  scPurchaseRequestPoolQueryDetailsApi
} from '@/api/supplier/purchase'
import { Column } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import { toReactive } from '@vueuse/core'
import { AuditBtn } from '../../changeAudit/option'
import pendingDetail from '../components/pendingDetail.vue'
import { getDictOptions, DICT_TYPE } from '@/utils/dict'
const PopoverCell = defineAsyncComponent(() => import('../../components/popoverDetail.vue'))
import skuGoodsNoSelect from '../../components/sku&goodsNoSelect.vue'
import { hasPermiJs } from '@/utils'
import tableBox from '../../components/tableBox.vue'

const message = useMessage()
const router = useRouter()

const props = withDefaults(
  defineProps<{
    innerHeight?: number
  }>(),
  {
    innerHeight: 0
  }
)

const queryParams = reactive<Supplier.Purchase.PurchaseRequestPoolPageQuery>({
  pageNum: 1,
  size: 10
})
const loading = ref(false)
const total = ref(0)
const tableData = ref<Supplier.Purchase.ListItem[]>([])

const selectedRows = ref<Supplier.Purchase.ListItem[]>([])
const swTableRef = ref()
const rowData = ref<Supplier.Purchase.ListItem>({})
const detailDrawerRef = ref()
const isShowPoDrawer = ref(false)
const currentPoDrawerType = ref('')
const openDrawerType = ref<'click' | 'popover'>('click')
const summary = ref({
  finishGoodsQuantityTotal: 0,
  goodsDeliveryQuantityTotal: 0,
  goodsPlaceQuantityTotal: 0,
  goodsQuantityTotal: 0
})
const summaryItems = [
  { label: '总补单量', prop: 'goodsQuantityTotal' },
  { label: '总分配量', prop: 'allocatedGoodsQuantityTotal' }
]

const requestSourceOption = computed(() => getDictOptions(DICT_TYPE.SC_PR_REQUEST_SOURCE))

const queryStatus = computed({
  get: () => (queryParams.status ? queryParams.status?.split(',') : undefined),
  set: (val) => {
    queryParams.status = val && val.length ? val?.join(',') : undefined
  }
})

/** 计算按钮配置 */
const btnsOptions = computed(() =>
  tableData.value.map(({ status, requestSource }) => {
    const hideBtns: AuditBtn[] = [
      new AuditBtn('查看', handleCheck, { permission: 'SupplierPurchase:PendingPurchase:Check' })
    ]

    switch (status) {
      case '0':
        hideBtns.push(
          new AuditBtn('分配需求', handleAllocate, {
            permission: 'SupplierPurchase:PendingPurchase:Allocate'
          })
        )
        break
    }

    if (['2', '5'].includes(requestSource)) {
      hideBtns.push(
        new AuditBtn('查看源数据', handleCheckOriginData, {
          permission: 'SupplierPurchase:PendingPurchase:CheckOriginData'
        })
      )
    }

    return toReactive(hideBtns)
  })
)

// 监听表格数据变化，恢复选中状态
watch(tableData, async () => {
  await nextTick()
  tableData.value.forEach((row) => {
    if (selectedRows.value.some((selectedRow) => selectedRow.id === row.id)) {
      swTableRef.value.toggleRowSelection(row, true)
    }
  })
})

let timer: NodeJS.Timeout | null
function getList() {
  if (timer !== null) {
    clearTimeout(timer)
    timer = null
  }
  loading.value = true
  timer = setTimeout(async () => {
    try {
      const res = await scPurchaseRequestPoolApi(queryParams)
      tableData.value = res.records
      summary.value = res.extras.summary
      total.value = res.total
    } catch (error) {
    } finally {
      loading.value = false
    }
  }, 1000)
}

async function handleQuery() {
  queryParams.pageNum = 1
  selectedRows.value = []
  getList()
}

/* 查看源数据 */
async function handleCheckOriginData({
  requestSource,
  sourceBusinessId
}: Supplier.Purchase.ListItem) {
  switch (requestSource) {
    case '2':
      try {
        const res = await getProductProgressIds(sourceBusinessId)

        if (!res) return

        router.push({
          name: 'ProductProgress',
          params: { id: sourceBusinessId },
          query: {
            developmentPlanId: res.developmentPlanId,
            productType: res.productType
          }
        })
      } catch (error) {}

      break
    case '5':
      const ids = sourceBusinessId.split(',')

      router.push({
        name: 'FactoryProductProgress',
        params: { id: ids[0] },
        query: { supplierId: ids?.[1] }
      })
      break
  }
}

async function resetQuery() {
  selectedRows.value = []
  Object.assign(
    queryParams,
    Object.fromEntries(Object.entries(queryParams).map(([key]) => [key, undefined])),
    { pageNum: 1, size: 10 }
  )
  getList()
}

function handleTableSelected(
  selection: typeof selectedRows.value,
  item?: Supplier.Purchase.ListItem
) {
  if (item) {
    const currentSelection = swTableRef.value.getSelectionRows()
    const isRowSelected = currentSelection.some((row) => row.id === item.id)
    if (isRowSelected) {
      selectedRows.value.push(item)
    } else {
      selectedRows.value = selectedRows.value.filter((row) => row.id !== item.id)
    }
  } else {
    if (selection.length) {
      tableData.value.forEach(
        (tableRow) =>
          !selectedRows.value.some((selectredRow) => selectredRow.id === tableRow.id) &&
          selectedRows.value.push(tableRow)
      )
    } else {
      selectedRows.value = selectedRows.value.filter(
        (selectedRow) => !tableData.value.some((tableRow) => tableRow.id === selectedRow.id)
      )
    }
  }
}

async function handleAllocate(row: Supplier.Purchase.ListItem) {
  await message.confirm('确定分配采购需求吗？')
  loading.value = true

  try {
    const res = await allocatedScPurchaseRequestPool({ ids: row.id! })
    if (res.success) {
      message.success('分配成功！')
      getList()
    }
  } catch (error) {
  } finally {
    getList()
  }
}

function handleCheck(row: Supplier.Purchase.ListItem) {
  detailDrawerRef.value.open()
  rowData.value = cloneDeep(row)
}

function handleCellClick(row: Supplier.Purchase.ListItem, column: Column) {
  if (!row[column.rawColumnKey]) return
  const canClickColumn = ['已发货', '已入库', '已下单']
  if (!canClickColumn.includes(column.label)) return
  currentPoDrawerType.value = column.label

  // 打开采购生产订单弹窗
  isShowPoDrawer.value = true
  rowData.value = row
  openDrawerType.value = 'click'
}

function cellClassName({ column, row }) {
  const canClickColumn = ['已发货', '已入库', '已下单']
  if (['补单量'].includes(column.label)) return 'cursor-default'
  if (!canClickColumn.includes(column.label)) return ''
  else if (row[column.rawColumnKey] || column.label === '已入库') return 'can-click-cell'
  else return 'disabled-click-cell'
}

async function handleBatchAdd() {
  if (selectedRows.value.length === 0) return message.warning('请先选择需要分配的需求')
  loading.value = true
  const ids = selectedRows.value.map((ele) => ele.id).join(',')
  try {
    const res = await allocatedScPurchaseRequestPool({ ids })
    if (res.success) {
      message.success('批量分配成功！')
      getList()
    }
  } catch (error) {
  } finally {
    loading.value = false
  }
}

onUnmounted(() => {
  if (timer) clearTimeout(timer)
})

defineExpose({
  handleQuery
})
</script>
<style lang="less" scoped>
@import url(../../index.scss);

* {
  --el-color-primary: #0064ff;
  --el-input-width: 220px;
}

.commonTopFilterWrap-filter {
  flex: 1;
}

.commonTopFilterWrap-search {
  padding-left: 24px;
  justify-content: flex-end;
}

.options {
  display: flex;
  align-items: center;
}

:deep(.el-pagination) {
  margin: 0;
  // margin-bottom: 0;margin-bottom
  float: none;
}
</style>
