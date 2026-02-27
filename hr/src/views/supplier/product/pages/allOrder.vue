<template>
  <table-box v-bind="{ maxViewHeight: innerHeight - 140, thresholdValue: 0 }">
    <template #prePart>
      <search-form
        ref="searchFormRef"
        v-model:params="queryParams"
        @handle-query="handleQuery"
        @reset-query="resetQuery"
      >
        <template #options>
          <special-dropdown :btns="btnOps" :loading-btns="['导出']" />
        </template>
      </search-form>
    </template>

    <template #default>
      <sw-table
        ref="swTableRef"
        :data="tableData"
        :options="allOrderTable"
        :loading="loading"
        :show-overflow-tooltip="true"
        :cell-class-name="cellClassName"
        :btns-options="btnsOptions"
        :loading-btns="['查看源数据']"
        @select="handleTableSelected"
        @cell-click="handleCellClick"
      >
        <template
          v-for="slotName in SORT_COLUMN"
          :key="slotName"
          #[`${slotName}_header`]="{ column }"
        >
          <div class="flex">
            <span class="mr-2px">{{ column.label }}</span>
            <filter-popper
              v-model:query-params="queryParams"
              :slot-name="`${slotName}Query`"
              :types="['sort']"
              @handle-query="handleQuery"
            />
          </div>
        </template>

        <template
          v-for="(item, slotName) in POPOVER_CELL_OPTION"
          :key="slotName"
          #[slotName]="{ col, row }"
        >
          <popover-cell
            :reference="col"
            :row-data="row"
            :api="item.api"
            :option="item.option"
            :po-id="row.id"
            :title="item.title"
            :isNotPageApi="item.isNotPageApi"
            @show-more="item.showMore(row)"
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
          v-model:page="queryParams.page"
          v-model:limit="queryParams.size"
          @pagination="getList"
        />
      </div>
    </template>
  </table-box>

  <detail-drawer :row-data="rowData" ref="detailDrawerRef" :type="3" />

  <po-drawer
    ref="poDrawerRef"
    v-model:model-value="isShowPoDrawer"
    :pr-id="rowData.scPurchaseRequestOrderId"
    :po-id="rowData.id"
    :title="poDrawerTableOptions.title"
    :table-options="poDrawerTableOptions.option"
    :api="poDrawerTableOptions.api"
    :type="poDrawerTableOptions.type"
    :open-type="openDrawerType"
    :width="poDrawerTableOptions.width"
  />

  <!-- 订单日志 -->
  <auditLogDrawer
    drawerTitle="订单日志"
    ref="auditLogDrawerRef"
    :api="queryListByBusinessIdApi"
    time-key="operationTime"
    status-key="orderOperation"
    person-key="operatorName"
    comment-key="message"
    descKey="orderOperation"
    :is-pass="() => true"
  />

  <!-- 批版报告弹窗 -->
  <version-report-dialog v-bind="versionReportProps" v-model:is-show="versionReportProps.isShow" />
</template>
<script lang="tsx" setup>
import { allOrderTable, SORT_COLUMN } from '../options'
import SwTable from '../../components/table.vue'
import {
  getAllScPurchaseOrderApi,
  getProductProgressIds,
  getScASRPage,
  getScASRPageDetail,
  getScPoPage,
  getScPurchaseDetailApi,
  getScStockInPage,
  getScStockInPageDetail,
  queryListByBusinessIdApi,
  scPurchaseOrderExportApi
} from '@/api/supplier/purchase'
import { cloneDeep } from 'lodash-es'
import DetailDrawer from '../components/detailDrawer.vue'
import { toReactive } from '@vueuse/core'
import {
  ASRPopoverTable,
  ASRTable,
  PoTable,
  purchasedGoodsQuantityTotalTable,
  RKTable,
  StockinPopoverTable
} from '../../purchase/options'
import download from '@/utils/download'
import { formatDate } from '@/utils/formatTime'
import { AuditBtn } from '../../changeAudit/option'
const PoDrawer = defineAsyncComponent(() => import('../../components/PoDrawer.vue'))
const PopoverCell = defineAsyncComponent(() => import('../../components/popoverDetail.vue'))
import SearchForm from '../components/searchForm.vue'
import filterPopper from '@/views/supplier/ledger/components/filterPopper.vue'
import auditLogDrawer from '@/views/supplier/appointment/components/auditLogDrawer.vue'
import specialDropdown from '../../components/specialDropdown.vue'
import Icon from '@/components/Icon/src/Icon.vue'
import tableBox from '../../components/tableBox.vue'
import versionReportDialog from '../components/versionReportDialog.vue'
import CommentDrawer from '../../components/comment'

const searchFormRef = ref<InstanceType<typeof SearchForm>>()
const emit = defineEmits(['refresh'])

const message = useMessage()
const route = useRoute()
const router = useRouter()

const props = withDefaults(
  defineProps<{
    innerHeight?: number
  }>(),
  { innerHeight: 0 }
)

const queryParams = ref<Supplier.Purchase.GetListParams>({
  page: 1,
  size: 10,
  sourceBusinessId: route.params.sourceBusinessId,
  ...Object.fromEntries(SORT_COLUMN.map((ele) => [`${ele}Query`, { sort: undefined }]))
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
const isExportLoading = ref(false)
const summary = ref({
  goodsInboundQuantityTotal: 0,
  goodsDeliveryQuantityTotal: 0,
  goodsUnDeliveryQuantityTotal: 0,
  goodsStockOutQuantityTotal: 0,
  purchasedGoodsQuantityTotal: 0
})
const summaryItems = [
  { label: '总采购量', prop: 'purchasedGoodsQuantityTotal' },
  { label: '总已发货', prop: 'goodsDeliveryQuantityTotal' },
  { label: '总已入库', prop: 'goodsInboundQuantityTotal' },
  { label: '总已退货', prop: 'goodsStockOutQuantityTotal' },
  { label: '总未发货', prop: 'goodsUnDeliveryQuantityTotal' }
]
const auditLogDrawerRef = ref<InstanceType<typeof auditLogDrawer>>()
const versionReportProps = ref({
  isShow: false,
  scPurchaseOrderNo: '',
  status: '18'
})

const POPOVER_CELL_OPTION = {
  goodsDeliveryQuantityTotal: {
    api: getScASRPageDetail,
    option: ASRPopoverTable,
    title: '预约发货单',
    showMore: (row) => handleShowMore(row, '已发货'),
    isNotPageApi: false
  },
  finishGoodsQuantityTotalNum: {
    api: getScStockInPageDetail,
    option: StockinPopoverTable,
    title: '入库单',
    showMore: (row) => handleShowMore(row, '已入库'),
    isNotPageApi: false
  },
  purchasedGoodsQuantityTotal: {
    api: getScPurchaseDetailApi,
    option: purchasedGoodsQuantityTotalTable,
    title: '采购单',
    showMore: (row) => handleCheck(row),
    isNotPageApi: true
  }
}

const poDrawerTableOptions = computed(() => {
  const configMap = {
    已下单: {
      option: PoTable,
      api: getScPoPage,
      titlePrefix: '采购生产订单',
      type: '1',
      width: 1350
    },
    已发货: {
      option: ASRTable,
      api: getScASRPage,
      titlePrefix: '预约发货单',
      type: '2',
      width: 1450
    },
    已入库: {
      option: RKTable,
      api: getScStockInPage,
      titlePrefix: '入库单',
      type: '3',
      width: 1250
    }
  }
  const config = configMap[currentPoDrawerType.value] || configMap['已下单']
  return {
    ...config,
    title: `${config.titlePrefix} (${rowData.value.scPurchaseRequestOrderName})`
  }
})

// 监听表格数据变化，恢复选中状态
watch(tableData, async () => {
  await nextTick()
  tableData.value.forEach((row) => {
    if (selectedRows.value.some((selectedRow) => selectedRow.id === row.id)) {
      swTableRef.value.toggleRowSelection(row, true)
    }
  })
})

const btnOps = [
  {
    label: '导出',
    option: handleExport,
    permission: 'SupplierProduct:AllOrder:Export',
    icon: () => <Icon icon="ep:download" />
  }
]
/**计算按钮配置 */
const btnsOptions = computed(() =>
  // 内部计算方法视情况而定，不一定非要设置一个明确的staticBtns，最后返回一个按钮数组即可
  tableData.value.map(({ requestSource, hasPatternApproval, status }) => {
    const ops: any[] = [
      new AuditBtn('查看', handleCheck, { permission: 'SupplierProduct:AllOrder:Check' }),
      new AuditBtn('评论', (row) => CommentDrawer.open(row), {
        permission: 'SupplierProduct:AllOrder:Comment'
      }),
      new AuditBtn('订单日志', handleCheckOrderLog, {
        permission: 'SupplierProduct:AllOrder:OrderLog'
      })
    ]
    if (['2', '5'].includes(requestSource)) {
      ops.push(
        new AuditBtn('查看源数据', handleCheckOriginData, {
          permission: 'SupplierProduct:AllOrder:CheckOrigin'
        })
      )
    }

    // 若是买手宽，增加批版报告
    if (hasPatternApproval && status !== '18') {
      ops.push(
        new AuditBtn('批版报告', handleVersionReport, {
          permission: 'SupplierProduct:AllOrder:VersionReport'
        })
      )
    }

    return toReactive(ops)
  })
)

function handleVersionReport(row) {
  versionReportProps.value = {
    isShow: true,
    scPurchaseOrderNo: row.scPurchaseOrderNo,
    status: row.status
  }
}

function handleCheckOrderLog(row) {
  auditLogDrawerRef.value?.open(row.id)
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

async function handleExport(row?: Supplier.Purchase.ListItem, index?: number) {
  isExportLoading.value = true
  try {
    const res = await scPurchaseOrderExportApi({ ...queryParams.value, isAll: true })
    if (res) {
      const fileName: string = row
        ? `${row?.scPurchaseRequestOrderName}-${row?.scPurchaseRequestOrderNo}.xlsx`
        : `采购生产订单导出-${formatDate(new Date(), 'YYYYMMDDHHmmss')}.xlsx`
      download.excel(res, fileName)
      if (index === undefined) isExportLoading.value = false
      message.success('导出成功')
    }
  } catch (error) {
    console.log(error)
  }
}

const timer = ref<NodeJS.Timeout>()
async function getList() {
  loading.value = true
  if (timer.value) {
    clearTimeout(timer.value)
  }

  timer.value = setTimeout(async () => {
    try {
      emit('refresh')
      // 合同清单日期排序
      const params = cloneDeep(queryParams.value)
      params.orderArrivalTimeSortQuery = queryParams.value.latestArrivalTimeQuery.sort
      delete params.latestArrivalTimeQuery.sort

      const res = await getAllScPurchaseOrderApi(params)
      tableData.value = res.records
      total.value = res.total
      summary.value = res.extras.summary
    } catch (error) {
    } finally {
      loading.value = false
      if (timer.value) clearTimeout(timer.value)
    }
  }, 1000)
}

async function handleQuery() {
  queryParams.value.page = 1
  getList()
}
async function resetQuery() {
  searchFormRef.value?.reset()
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

function handleCheck(row: Supplier.Purchase.ListItem) {
  detailDrawerRef.value.open()
  rowData.value = cloneDeep(row)
}

function handleCellClick(row: Supplier.Purchase.ListItem, column: any) {
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
  if (!canClickColumn.includes(column.label)) return ''
  if (row[column.rawColumnKey] || column.label === '已入库') return 'can-click-cell'
  else return 'disabled-click-cell'
}

const openDrawerType = ref<'click' | 'popover'>('click')
const poDrawerRef = ref()
function handleShowMore(row: any, type: '已下单' | '已入库' | '已发货') {
  rowData.value = row
  currentPoDrawerType.value = type
  isShowPoDrawer.value = true
  poDrawerRef.value.autoOpenDetail()
  openDrawerType.value = 'popover'
}

function cleartable() {
  tableData.value = []
}

defineExpose({ handleQuery, cleartable })

onBeforeMount(() => {
  getList()
})
</script>
<style lang="less" scoped>
@import url(../../index.scss);
</style>
