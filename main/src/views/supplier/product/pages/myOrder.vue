<template>
  <table-box v-bind="{ maxViewHeight: innerHeight - 140, thresholdValue: 0 }">
    <template #prePart>
      <search-form
        v-model:params="queryParams"
        ref="searchFormRef"
        @handle-query="handleQuery"
        @reset-query="resetQuery"
      >
        <template #options>
          <special-dropdown :btns="btnOps" :loading-btns="['导出']" />
        </template>
      </search-form>
    </template>

    <sw-table
      ref="swTableRef"
      :data="tableData"
      :options="myOrderTable"
      :loading="loading"
      :show-overflow-tooltip="true"
      :cell-class-name="cellClassName"
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

      <template #options="{ row, index, optionsBtnsNum }">
        <SWTableBtns
          ref="swTableBtnsRef"
          :row="row"
          :options="btnsOptions[index] || []"
          :row-index="index"
          :can-loading-btn="['结单', '提交', '取消结单']"
          :static-btns-num="optionsBtnsNum"
        >
          <template #跟单员变更="{ index: i }">
            <div>
              <cooperate-popover
                :ref="(ele) => (cooperateRefs[index] = ele ? (ele as any) : null)"
                :row="row"
                :style="
                  i
                    ? { marginLeft: '10px', lineHeight: '20px' }
                    : { lineHeight: '20px', marginRight: '10px' }
                "
                @refresh="handleQuery"
                @close-others="handleCloseOtherCooperatePopover(index)"
                @submit="(val) => handleConfirmAssistant(row, val, index)"
              >
                跟单员变更
              </cooperate-popover>
            </div>
          </template>
        </SWTableBtns>
      </template>

      <template
        v-for="(item, slotName) in POPOVER_CELL_OPTION"
        :key="slotName"
        #[slotName]="{ col, row }"
      >
        <popover-cell
          :reference="col"
          :row-data="row"
          :po-id="row.id"
          v-bind="item"
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
  </table-box>

  <detail-drawer :row-data="rowData" ref="detailDrawerRef" :type="2" />

  <!-- 撤回弹出页面 -->
  <recallDialog ref="recallDialogRef" @success="handleQuery" />

  <!-- 撤回记录 -->
  <recallDetail ref="recallDetailRef" />

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

  <!-- 产前样上传弹窗 -->
  <before-product-dialog v-bind="beforeProductProps" v-model="beforeProductProps.modelValue" />

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

  <!-- 同步价格弹窗 -->
  <sync-price-dialog v-bind="syncPriceProp" v-model:model-value="syncPriceProp.modelValue" />

  <!-- 批版报告弹窗 -->
  <version-report-dialog
    v-bind="versionReportProps"
    v-model:is-show="versionReportProps.isShow"
    @refresh="getList"
  />

  <!-- 免检申请列表 -->
  <exemption-drawer
    v-bind="exemptionProp"
    v-model="exemptionProp.modelValue"
    title="免检申请"
    @refresh="getList"
  />
</template>
<script lang="tsx" setup>
import { myOrderTable, SORT_COLUMN } from '../options'
import filterPopper from '@/views/supplier/ledger/components/filterPopper.vue'
import SwTable from '../../components/table.vue'
import {
  cancelPOOverApi,
  deleteProductOrderApi,
  finishProductOrderApi,
  getProductProgressIds,
  getScASRPage,
  getScASRPageDetail,
  getScPoPage,
  getScPurchaseDetailApi,
  getScPurchaseOrderApi,
  getScStockInPage,
  getScStockInPageDetail,
  queryListByBusinessIdApi,
  scPurchaseOrderExportApi,
  scPurchaseOrderUpdateOrderHandlerApi,
  submitProductOrderApi
} from '@/api/supplier/purchase'
import { cloneDeep } from 'lodash-es'
import DetailDrawer from '../components/detailDrawer.vue'
import recallDetail from '../components/recallDetail.vue'
import recallDialog from '../components/recallDialog.vue'
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
import CooperatePopover from '../components/cooperatePopover.vue'
import { toReactive } from '@vueuse/core'
import beforeProductDialog from '../components/beforeProductDialog.vue'
import SearchForm from '../components/searchForm.vue'
import auditLogDrawer from '@/views/supplier/appointment/components/auditLogDrawer.vue'
import Icon from '@/components/Icon/src/Icon.vue'
import specialDropdown from '../../components/specialDropdown.vue'
import tableBox from '../../components/tableBox.vue'
import syncPriceDialog from '../components/syncPriceDialog.vue'
import versionReportDialog from '../components/versionReportDialog.vue'
import exemptionDrawer from '../../shippingVerification/components/exemptionDrawer.vue'
import CommentDrawer from '../../components/comment'

const emit = defineEmits(['refresh'])

const router = useRouter()
const route = useRoute()
const message = useMessage()

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
const beforeProductProps = reactive({
  modelValue: false,
  poId: ''
})
const auditLogDrawerRef = ref<InstanceType<typeof auditLogDrawer>>()
const cooperateRefs = ref<InstanceType<typeof CooperatePopover>[]>([])
const searchFormRef = ref<InstanceType<typeof SearchForm>>()
const syncPriceProp = ref({
  modelValue: false,
  poId: ''
})
const versionReportProps = ref({
  isShow: false,
  scPurchaseOrderNo: '',
  status: '18'
})
const exemptionProp = reactive({
  modelValue: false,
  id: '',
  type: 2
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

enum BTNS_KEY {
  /** 查看 */ CHECK,
  /** 评论 */ COMMENT,
  /** 编辑 */ EDIT,
  /** 提交 */ SUBMIT,
  /** 跟单员变更 */ CHANGE_ORDER_HANDLER,
  /** 批版报告 */ VERSION_REPORT,
  /** 结单 */ OVER,
  /** 取消结单 */ CANCEL_OVER,
  /** 产前样上传 */ BEFORE_PRODUCT,
  /** 删除 */ DELETE,
  /** 变更 */ CHANGE,
  /** 撤回 */ RECALL,
  /** 撤回记录 */ RECALL_LOG,
  /** 采购合同 */ CONTRACT,
  /** 免检申请 */ EXEMPTION_APPLICATION,
  /** 查看源数据 */ CHECK_ORIGIN,
  /** 采购价格同步 */ SYNC_PRICE,
  /** 订单日志 */ ORDER_LOG
}

const BASE_BTN_CONFIGS = {
  [BTNS_KEY.CHECK]: {
    label: '查看',
    method: handleCheck,
    options: { permission: 'SupplierProduct:MyOrder:Check' }
  },
  [BTNS_KEY.COMMENT]: {
    label: '评论',
    method: (row) => CommentDrawer.open(row),
    options: { permission: 'SupplierProduct:MyOrder:Comment' }
  },
  [BTNS_KEY.EDIT]: {
    label: '编辑',
    method: handleEdit,
    options: { permission: 'SupplierProduct:MyOrder:Edit' }
  },
  [BTNS_KEY.SUBMIT]: {
    label: '提交',
    method: handleSubmitRow,
    options: { permission: 'SupplierProduct:MyOrder:Submit' }
  },
  [BTNS_KEY.CHANGE_ORDER_HANDLER]: {
    label: '跟单员变更',
    method: undefined,
    options: { permission: 'SupplierProduct:MyOrder:ChangeOrderHandler' }
  },
  [BTNS_KEY.OVER]: {
    label: '结单',
    method: handleFinishRow,
    options: { permission: 'SupplierProduct:MyOrder:Over', type: 'danger' }
  },
  [BTNS_KEY.CANCEL_OVER]: {
    label: '取消结单',
    method: handleCancelOver,
    options: { permission: 'SupplierProduct:MyOrder:CancelOver' }
  },
  [BTNS_KEY.BEFORE_PRODUCT]: {
    label: '产前样上传',
    method: hancleBeforeProduct,
    options: { permission: 'SupplierProduct:MyOrder:BeforeProduct' }
  },
  [BTNS_KEY.DELETE]: {
    label: '删除',
    method: handleDeleteRow,
    options: { permission: 'SupplierProduct:MyOrder:Delete', type: 'danger' }
  },
  [BTNS_KEY.CHANGE]: {
    label: '变更',
    method: handleChange,
    options: { permission: 'SupplierProduct:MyOrder:Change' }
  },
  [BTNS_KEY.RECALL]: {
    label: '撤回',
    method: handleRecall,
    options: { permission: 'SupplierProduct:MyOrder:Recall', type: 'danger' }
  },
  [BTNS_KEY.RECALL_LOG]: {
    label: '撤回记录',
    method: openRecallDetail,
    options: { permission: 'SupplierProduct:MyOrder:RecallLog' }
  },
  [BTNS_KEY.CONTRACT]: {
    label: '采购合同',
    method: handleContract,
    options: { permission: 'SupplierProduct:MyOrder:Contract' }
  },
  [BTNS_KEY.CHECK_ORIGIN]: {
    label: '查看源数据',
    method: handleCheckOriginData,
    options: { permission: 'SupplierProduct:MyOrder:CheckOrigin' }
  },
  [BTNS_KEY.ORDER_LOG]: {
    label: '订单日志',
    method: handleCheckOrderLog,
    options: { permission: 'SupplierProduct:MyOrder:OrderLog' }
  },
  [BTNS_KEY.SYNC_PRICE]: {
    label: '价格同步',
    method: handleSyncPrice,
    options: { permission: 'SupplierProduct:MyOrder:SyncPrice' }
  },
  [BTNS_KEY.VERSION_REPORT]: {
    label: '批版报告',
    method: handleVersionReport,
    options: { permission: 'SupplierProduct:MyOrder:VersionReport' }
  },
  [BTNS_KEY.EXEMPTION_APPLICATION]: {
    label: '免检申请',
    method: handleExemptionApplication,
    options: { permission: 'SupplierProduct:MyOrder:ExemptionApplication' }
  }
} as const

const STATUS_HIDE_RULES: Record<string, BTNS_KEY[]> = {
  '0': [BTNS_KEY.EDIT, BTNS_KEY.SUBMIT, BTNS_KEY.DELETE, BTNS_KEY.SYNC_PRICE],
  '4': [BTNS_KEY.CHECK, BTNS_KEY.RECALL, BTNS_KEY.SYNC_PRICE],
  '7': [BTNS_KEY.EDIT, BTNS_KEY.SUBMIT, BTNS_KEY.DELETE, BTNS_KEY.SYNC_PRICE],
  '10': [
    BTNS_KEY.CHECK,
    BTNS_KEY.CONTRACT,
    BTNS_KEY.OVER,
    BTNS_KEY.RECALL,
    BTNS_KEY.CHANGE,
    BTNS_KEY.SYNC_PRICE
  ],
  '13': [BTNS_KEY.CHECK, BTNS_KEY.OVER, BTNS_KEY.RECALL, BTNS_KEY.CHANGE, BTNS_KEY.SYNC_PRICE],
  '14': [BTNS_KEY.CHECK, BTNS_KEY.CONTRACT],
  '16': [BTNS_KEY.CHECK, BTNS_KEY.BEFORE_PRODUCT, BTNS_KEY.SYNC_PRICE],
  '18': [
    BTNS_KEY.CHECK,
    BTNS_KEY.CHANGE,
    BTNS_KEY.SYNC_PRICE,
    BTNS_KEY.VERSION_REPORT,
    BTNS_KEY.OVER
  ],
  '19': [
    BTNS_KEY.CHECK,
    BTNS_KEY.CHANGE,
    BTNS_KEY.SYNC_PRICE,
    BTNS_KEY.OVER,
    BTNS_KEY.EXEMPTION_APPLICATION
  ],
  '191': [
    BTNS_KEY.CHECK,
    BTNS_KEY.CHANGE,
    BTNS_KEY.SYNC_PRICE,
    BTNS_KEY.OVER,
    BTNS_KEY.EXEMPTION_APPLICATION
  ],
  '192': [
    BTNS_KEY.CHECK,
    BTNS_KEY.CHANGE,
    BTNS_KEY.SYNC_PRICE,
    BTNS_KEY.OVER,
    BTNS_KEY.EXEMPTION_APPLICATION
  ],
  '193': [
    BTNS_KEY.CHECK,
    BTNS_KEY.CHANGE,
    BTNS_KEY.SYNC_PRICE,
    BTNS_KEY.OVER,
  ],
  '20': [BTNS_KEY.CHECK, BTNS_KEY.OVER, BTNS_KEY.CHANGE, BTNS_KEY.SYNC_PRICE],
  '30': [BTNS_KEY.CHECK, BTNS_KEY.OVER, BTNS_KEY.CHANGE, BTNS_KEY.SYNC_PRICE],
  '50': [BTNS_KEY.CHECK, BTNS_KEY.CANCEL_OVER],
  default: [BTNS_KEY.CHECK]
}

const btnsOptions = computed<any>(() =>
  tableData.value.map(({ status, revokeLogFlag, requestSource, hasPatternApproval }) => {
    const hideBtnKeys = new Set([
      BTNS_KEY.ORDER_LOG,
      BTNS_KEY.COMMENT,
      ...(STATUS_HIDE_RULES[status!] || STATUS_HIDE_RULES.default),
      ...(revokeLogFlag ? [BTNS_KEY.RECALL_LOG] : []), // 撤回记录
      ...(status !== '4' ? [BTNS_KEY.CHANGE_ORDER_HANDLER] : []), // 跟单员变更
      ...(['2', '5'].includes(requestSource) ? [BTNS_KEY.CHECK_ORIGIN] : []) // 查看源数据
    ])

    // 若是买手宽，增加批版报告
    if (hasPatternApproval) hideBtnKeys.add(BTNS_KEY.VERSION_REPORT)

    const hideBtns = Array.from(hideBtnKeys)
      .sort((a, b) => {
        return a - b
      })
      .map((key) => {
        const config = BASE_BTN_CONFIGS[key]
        return new AuditBtn(config.label, config.method, config.options)
      })

    return toReactive(hideBtns)
  })
)
const btnOps = [
  {
    label: '新增',
    option: handleAdd,
    permission: 'SupplierProduct:MyOrder:Add',
    icon: () => <Icon icon="ep:plus" />
  },
  {
    label: '导出',
    option: handleExport,
    permission: 'SupplierProduct:MyOrder:Export',
    icon: () => <Icon icon="ep:download" />
  }
]

function handleAdd() {
  router.push({
    name: 'PurchaseProductOrderAdd'
  })
}

function handleCheckOrderLog(row) {
  auditLogDrawerRef.value?.open(row.id)
}

function handleSyncPrice(row) {
  syncPriceProp.value = {
    modelValue: true,
    poId: row.id
  }
}

function handleVersionReport(row) {
  versionReportProps.value = {
    isShow: true,
    scPurchaseOrderNo: row.scPurchaseOrderNo,
    status: row.status
  }
}

function handleExemptionApplication(row) {
  exemptionProp.id = row.id
  exemptionProp.modelValue = true
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

function handleCloseOtherCooperatePopover(index: number) {
  tableData.value.forEach((_, i) => {
    if (i === index) return
    cooperateRefs.value[i]?.close()
  })
}

function handleCloseCooperatePopper() {
  tableData.value.forEach((_, i) => {
    cooperateRefs.value[i]?.close()
  })
}

async function handleExport(row?: Supplier.Purchase.ListItem, index?: number) {
  if (index === undefined) isExportLoading.value = true
  try {
    const res = await scPurchaseOrderExportApi({ ...queryParams.value })
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

      const res = await getScPurchaseOrderApi(params)
      tableData.value = res.records
      summary.value = res.extras.summary
      total.value = res.total
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

async function handleDeleteRow(row: Supplier.Purchase.ListItem) {
  await message.confirm('确定删除该生产订单吗？')
  try {
    const res = await deleteProductOrderApi({ id: row.id || '' })
    if (res.success) {
      message.success('删除成功')
      handleQuery()
    }
  } catch (error) {}
}

async function handleSubmitRow(row: Supplier.Purchase.ListItem) {
  await message.confirm('您确定提交生产订单吗？')
  try {
    const res = await submitProductOrderApi(row.id!)
    if (res && res.success) {
      message.success('提交成功')
      handleQuery()
    }
  } catch (error) {}
}

async function handleFinishRow(row: Supplier.Purchase.ListItem) {
  const residue = Number(row.goodsQuantityTotal) - Number(row.finishGoodsQuantityTotal)
  if (residue) await message.confirm(`该订单还差${residue}未完成，您确定提前结单吗？`)
  else await message.confirm('您确定提前结单吗？')
  try {
    const res = await finishProductOrderApi(row.id!)
    if (res.success) {
      message.success('结单成功')
      handleQuery()
    }
  } catch (error) {}
}

async function handleCancelOver(row: Supplier.Purchase.ListItem) {
  await message.confirm('确定要取消结单吗？')
  try {
    const res = await cancelPOOverApi({ id: row.id! })
    if (res && res.success) {
      message.success('取消结单成功！')
      getList()
    }
  } catch (error) {}
}

function handleEdit(row: Supplier.Purchase.ListItem) {
  router.push({
    name: 'PurchaseProductOrderEdit',
    params: {
      id: row.id
    },
    query: {
      status: row.status || '0',
      tab: 1,
      purchaseId: row.scPurchaseRequestOrderId
    }
  })
}

function handleCheck(row: Supplier.Purchase.ListItem) {
  detailDrawerRef.value.open()
  rowData.value = cloneDeep(row)
}

function handleContract(row: Supplier.Purchase.ListItem) {
  router.push({
    name: 'PurchaseContract',
    params: {
      id: row.id
    },
    query: {
      poStatus: row.status,
      from: route.name as string
    }
  })
}

function hancleBeforeProduct(row: Supplier.Purchase.ListItem) {
  beforeProductProps.modelValue = true
  beforeProductProps.poId = row.id!
}

// 撤回
const recallDialogRef = ref()
const recallDetailRef = ref()
async function handleRecall(row: Supplier.Purchase.ListItem) {
  recallDialogRef.value?.open(row.id, row.scPurchaseOrderNo)
}
// 撤回记录
async function openRecallDetail(row: Supplier.Purchase.ListItem) {
  recallDetailRef.value?.open(row.id)
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
function handleShowMore(row: any, type: '已下单' | '已入库' | '已发货' | '查看') {
  rowData.value = row
  currentPoDrawerType.value = type
  isShowPoDrawer.value = true
  poDrawerRef.value.autoOpenDetail()
  openDrawerType.value = 'popover'
}

function handleChange(row: Supplier.Purchase.ListItem) {
  router.push({
    name: 'PurchaseProductOrderChange',
    params: {
      id: row.id
    },
    query: {
      status: row.status || '0',
      tab: 1,
      purchaseId: row.scPurchaseRequestOrderId
    }
  })
}

async function handleConfirmAssistant(row: any, orderHandlerId: string, i: number) {
  try {
    const res = await scPurchaseOrderUpdateOrderHandlerApi({
      userId: orderHandlerId,
      poId: row.id
    })
    if (res.success) {
      message.success('跟单员变更成功')
      handleQuery()
      cooperateRefs.value[i]?.close()
    }
  } catch (error) {
  } finally {
  }
}

function cleartable() {
  tableData.value = []
}

defineExpose({ handleQuery, cleartable, handleCloseCooperatePopper })

onBeforeMount(() => {
  if (route.query.scPurchaseOrderNo)
    queryParams.value.scPurchaseOrderNo = route.query.scPurchaseOrderNo as string

  getList()
})
</script>
<style lang="less" scoped>
@import url(../../index.scss);
</style>
