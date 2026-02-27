<template>
  <table-box v-bind="{ maxViewHeight: innerHeight - 140, thresholdValue: 0 }">
    <template #prePart>
      <el-row>
        <el-col :span="20" class="!flex-1">
          <el-form :model="queryParams" ref="queryFormRef" :label-width="90">
            <el-row :gutter="14">
              <el-col :span="6">
                <el-form-item prop="scPurchaseRequestOrderNo" label="需求单号:">
                  <el-input
                    v-model="queryParams.scPurchaseRequestOrderNo"
                    clearable
                    placeholder="请输入需求单号"
                    @keydown.enter="handleQuery"
                    @clear="handleQuery"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="需求名称:" prop="scPurchaseRequestOrderName">
                  <el-input
                    v-model.trim="queryParams.scPurchaseRequestOrderName"
                    placeholder="请输入需求名称"
                    clearable
                    @keydown.enter="handleQuery"
                    @clear="handleQuery"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label-width="20">
                  <sku-goods-no-select
                    v-model:params="queryParams"
                    goods-code-key="goodsNo"
                    sku-key="skuQuery"
                    @change-type="getList"
                    @change-value="handleQuery"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="订单状态" prop="status">
                  <el-select
                    v-model="queryStatus"
                    placeholder="请选择订单状态"
                    clearable
                    multiple
                    collapse-tags
                    collapse-tags-tooltip
                    @change="handleQuery"
                    @clear="handleQuery"
                  >
                    <el-option
                      v-for="item in statusOps"
                      :key="item.value"
                      :value="item.value"
                      :label="item.label"
                    />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="6" v-show="isMore">
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
              <el-col :span="6" v-show="isMore">
                <el-form-item label="跟单人" prop="">
                  <select-people
                    v-model:list="supplierProduct.personList"
                    v-model:model-value="queryParams.orderHandlerId"
                    :multiple="false"
                    placeholder="请选择跟单人"
                    get-list-method="visible"
                    :api="getScPersonsApi"
                    @change="handleQuery"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6" v-show="isMore">
                <el-form-item label="分配状态" prop="">
                  <el-select
                    v-model="queryParams.allocationStatus"
                    clearable
                    placeholder="请选择分配状态"
                    @change="handleQuery"
                  >
                    <el-option value="0" label="待分配" />
                    <el-option value="1" label="已分配" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
        <el-col :span="4" class="!flex justify-end min-w-350px">
          <el-button @click="handleQuery" class="commonSearchBtn">
            <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
            搜索
          </el-button>
          <el-button @click="resetQuery" class="commonResetBtn" :style="{ marginLeft: '0px' }">
            重置
          </el-button>

          <special-dropdown :btns="btnOps" :loading-btns="['导出']" />

          <el-button @click="isMore = !isMore" type="primary" text>
            <img
              src="@/assets/svgs/supplier/zhankai.svg"
              alt=""
              class="mr4px"
              :style="{ transform: !isMore ? 'rotate(180deg)' : 'rotate(0)' }"
            />
            {{ isMore ? '收起' : '展开' }}
          </el-button>
        </el-col>
      </el-row>
    </template>

    <template #default>
      <sw-table
        ref="swTableRef"
        :data="tableData"
        :options="purchaseTable"
        :loading="loading"
        :cell-class-name="cellClassName"
        @select="handleTableSelected"
        @cell-click="handleCellClick"
      >
        <template
          v-for="(item, slotName) in POPOVER_CELL_OPTION"
          :key="slotName"
          #[slotName]="{ col, row }"
        >
          <popover-cell
            :reference="col"
            :row-data="row"
            :pr-id="row.id"
            v-bind="item"
            @show-more="item.showMore(row)"
          />
        </template>

        <template #options="{ row, index, optionsBtnsNum }">
          <SWTableBtns
            :ref="`swTableBtnsRef_${index}`"
            :row="row"
            :options="btnsOptions[index] || []"
            :row-index="index"
            :can-loading-btn="['撤回', '订单日志']"
            :static-btns-num="optionsBtnsNum"
          >
            <template #协办="{ index: i }">
              <div>
                <cooperate-popover
                  :ref="`cooperate_${index}`"
                  :row="row"
                  :loading="assistantLoading"
                  :style="
                    i
                      ? { marginLeft: '10px', lineHeight: '20px' }
                      : { lineHeight: '20px', marginRight: '10px' }
                  "
                  @refresh="handleQuery"
                  @close-others="handleCloseOtherCooperatePopover(index)"
                  @submit="(val) => handleConfirmAssistant(row, val, index)"
                />
              </div>
            </template>
          </SWTableBtns>
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

  <detail-drawer :row-data="rowData" ref="detailDrawerRef" :type="1" />

  <po-drawer
    ref="poDrawerRef"
    v-model:model-value="isShowPoDrawer"
    :pr-id="rowData.id"
    v-bind="poDrawerTableOptions"
    :open-type="openDrawerType"
    :is-not-page="isNotPage"
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
</template>
<script lang="tsx" setup>
import { purchaseTable, statusOps } from '../options'
import SwTable from '../../components/table.vue'
import {
  getScPersonsApi,
  getPurchasePruductOrderList,
  getScPoPage,
  getScASRPage,
  getScStockInPage,
  getScPoPageDetail,
  getScASRPageDetail,
  getScStockInPageDetail,
  getCheckInfo,
  setCooperateApi,
  exportInfo,
  queryListByBusinessIdApi,
  getProductProgressIds
} from '@/api/supplier/purchase'
import { cloneDeep } from 'lodash-es'
import DetailDrawer from '../components/detailDrawer.vue'
import download from '@/utils/download'
import { formatDate } from '@/utils/formatTime'
import {
  ASRPopoverTable,
  ASRTable,
  detailTable,
  goodsQuantityTotalTable,
  popoverTable,
  PoTable,
  RKTable,
  StockinPopoverTable
} from '../../purchase/options'
const PoDrawer = defineAsyncComponent(() => import('../../components/PoDrawer.vue'))
const PopoverCell = defineAsyncComponent(() => import('../../components/popoverDetail.vue'))
import CooperatePopover from '../components/cooperatePopover.vue'
import { AuditBtn } from '../../changeAudit/option'
import { toReactive } from '@vueuse/core'
import { getDictOptions, DICT_TYPE } from '@/utils/dict'
import { useSupplierProduct } from '@/store/modules/supplier'
const SelectPeople = defineAsyncComponent(
  () => import('@/views/supplier/components/selectPeople.vue')
)
import auditLogDrawer from '@/views/supplier/appointment/components/auditLogDrawer.vue'
import skuGoodsNoSelect from '@/views/supplier/components/sku&goodsNoSelect.vue'
import Icon from '@/components/Icon/src/Icon.vue'
import specialDropdown from '../../components/specialDropdown.vue'
import tableBox from '../../components/tableBox.vue'
import CommentDrawer from '../../components/comment'

const supplierProduct = useSupplierProduct()

const emit = defineEmits(['refresh'])

const router = useRouter()
const message = useMessage()

const props = withDefaults(
  defineProps<{
    innerHeight?: number
  }>(),
  { innerHeight: 0 }
)

const queryParams = reactive<Supplier.Purchase.GetListParams>({
  page: 1,
  size: 10,
  queryType: 0
})
const loading = ref(false)
const poDrawerRef = ref()
const total = ref(0)
const tableData = ref<Supplier.Purchase.ListItem[]>([])
const selectedRows = ref<Supplier.Purchase.ListItem[]>([])
const swTableRef = ref()
const isMore = ref(false)
const rowData = ref<Supplier.Purchase.ListItem>({})
const detailDrawerRef = ref()
const queryStatus = computed({
  get: () => (queryParams.status ? queryParams.status.split(',') : undefined),
  set: (val) => (queryParams.status = val && val.length ? val.join(',') : undefined)
})
const personList = ref<{ userId: string; avatarOrigin: string; name: string }[]>([])
const isShowPoDrawer = ref(false)
const currentPoDrawerType = ref('')
const openDrawerType = ref<'click' | 'popover'>('click')
const summary = ref({
  finishGoodsQuantityTotal: 0,
  goodsDeliveryQuantityTotal: 0,
  goodsPlaceQuantityTotal: 0,
  goodsStockOutQuantityTotal: 0,
  goodsQuantityTotal: 0
})
const summaryItems = [
  { label: '总补单量', prop: 'goodsQuantityTotal' },
  { label: '总已下单', prop: 'goodsPlaceQuantityTotal' },
  { label: '总已发货', prop: 'goodsDeliveryQuantityTotal' },
  { label: '总已退货', prop: 'goodsStockOutQuantityTotal' },
  { label: '总完成量', prop: 'finishGoodsQuantityTotal' }
]
const auditLogDrawerRef = ref<InstanceType<typeof auditLogDrawer>>()

const requestSourceOption = computed(() => getDictOptions(DICT_TYPE.SC_PR_REQUEST_SOURCE))

const poDrawerTableOptions = computed(() => {
  let tableOptions: TableOption = []
  let api: (params: any) => Promise<any> | any = () => {}
  let title = ''
  let type: '1' | '2' | '3' | '4' = '1'
  let width: number | string = 1085
  switch (currentPoDrawerType.value) {
    case '已下单':
      tableOptions = PoTable
      api = getScPoPage
      title = `采购生产订单 (${rowData.value.scPurchaseRequestOrderName})`
      type = '1'
      width = 1350
      break
    case '已发货':
      tableOptions = ASRTable
      api = getScASRPage
      title = `预约发货单 (${rowData.value.scPurchaseRequestOrderName})`
      type = '2'
      width = 1450
      break
    case '已入库':
      tableOptions = RKTable
      api = getScStockInPage
      title = `入库单 (${rowData.value.scPurchaseRequestOrderName})`
      type = '3'
      width = 1350
      break
    case '补单量':
      tableOptions = detailTable
      api = getCheckInfo
      title = `采购需求单 (${rowData.value.scPurchaseRequestOrderName})`
      type = '4'
      width = '75%'
      break
  }

  return { tableOptions, api, title, type, width }
})

const POPOVER_CELL_OPTION = {
  goodsPlaceQuantityTotal: {
    api: getScPoPageDetail,
    option: popoverTable,
    title: '采购数量明细',
    showMore: (row) => handleShowMore(row, '已下单'),
    isNotPageApi: false
  },
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
  goodsQuantityTotal: {
    api: getCheckInfo,
    option: goodsQuantityTotalTable,
    title: '需求单',
    showMore: (row) => handleCheck(row),
    isNotPageApi: true
  }
}

/** 按钮排列次序 */
enum buttonPriority {
  '查看',
  '评论',
  '生产分配',
  '协办',
  '订单日志',
  '查看源数据'
}

enum BTNS_KEY {
  CHECK,
  COMMENT,
  CHECK_PRODUCT_ORDER,
  ASSISTANT,
  ORDER_LOG,
  CHECK_ORIGIN
}

/**计算按钮配置 */
const btnsOptions = computed<any>(() =>
  // 内部计算方法视情况而定，不一定非要设置一个明确的staticBtns，最后返回一个按钮数组即可
  tableData.value.map((rowData) => {
    const BTNS = [
      new AuditBtn('查看', handleCheck, { permission: 'SupplierProduct:MyPurchase:Check' }),
      new AuditBtn('评论', (row) => CommentDrawer.open(row), {
        permission: ''
      }),
      new AuditBtn('生产分配', handleCheckProductOrder, {
        permission: 'SupplierProduct:MyPurchase:CheckProductOrder'
      }),
      new AuditBtn('协办', undefined, { permission: 'SupplierProduct:MyPurchase:Assistant' }),
      new AuditBtn('订单日志', handleCheckOrderLog, {
        permission: 'SupplierProduct:MyPurchase:OrderLog'
      }),
      new AuditBtn('查看源数据', handleCheckOriginData, {
        permission: 'SupplierProduct:MyPurchase:CheckOrigin'
      })
    ]

    const STATUS_EXCLUSIONS = ['30', '40', '99', '4', '7'] // 排除特定状态的按钮

    const staticBtns: AuditBtn[] = [
      BTNS[BTNS_KEY.CHECK],
      BTNS[BTNS_KEY.ORDER_LOG],
      BTNS[BTNS_KEY.COMMENT]
    ]
    if (!STATUS_EXCLUSIONS.includes(rowData.status!)) {
      staticBtns.push(BTNS[BTNS_KEY.ASSISTANT], BTNS[BTNS_KEY.CHECK_PRODUCT_ORDER])
    }

    if (rowData.goodsQuantityTotal === rowData.goodsPlaceQuantityTotal) {
      const target = staticBtns.find((ele) => ele.label === '生产分配')
      if (target) {
        target.disabled = true
        target.disabledDesc = '当前需求单已全部下单'
      }
    }

    if (['2', '5'].includes(rowData.requestSource)) {
      staticBtns.push(BTNS[BTNS_KEY.CHECK_ORIGIN])
    }

    return toReactive(
      staticBtns.sort((a, b) => {
        const priorityA = buttonPriority[a.label]
        const priorityB = buttonPriority[b.label]
        return priorityA - priorityB
      })
    )
  })
)

const btnOps = [
  {
    label: '导出',
    option: handleExportSelectRows,
    permission: 'SupplierProduct:MyPurchase:Export',
    icon: () => <Icon icon="ep:download" />
  }
]

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

function handleCheckOrderLog(row) {
  auditLogDrawerRef.value?.open(row.id)
}

// 监听表格数据变化，恢复选中状态
watch(tableData, async () => {
  await nextTick()
  tableData.value.forEach((row) => {
    if (selectedRows.value.some((selectedRow) => selectedRow.id === row.id)) {
      swTableRef.value.toggleRowSelection(row, true)
    }
  })
})

const isExportLoading = ref(false)
async function handleExportSelectRows() {
  const ids: string[] = selectedRows.value.map((item) => item.id || '')
  isExportLoading.value = true
  try {
    const res = await exportInfo({ ...queryParams, idList: ids })
    if (res) {
      const fileName: string = `采购需求单导出-${formatDate(new Date(), 'YYYYMMDDHHmmss')}.xlsx`
      download.excel(res, fileName)
      message.success('导出成功')
    }
  } catch (error) {
    console.log(error)
  } finally {
    isExportLoading.value = false
  }
}

function handleCloseOtherCooperatePopover(index: number) {
  tableData.value.forEach((_, i) => {
    if (i === index) return
    getFormDOM('cooperate', i)?.close()
  })
}

// 获取表单
const instance = getCurrentInstance()
function getFormDOM(key: string, index: number) {
  const refName = `${key}_${index}`
  const dom = instance?.refs[refName]
  if (dom) {
    return dom as any
  }
}

const timer = ref<NodeJS.Timeout | null>()
async function getList() {
  loading.value = true
  if (timer.value) {
    clearTimeout(timer.value)
  }

  timer.value = setTimeout(async () => {
    try {
      emit('refresh')
      const res = await getPurchasePruductOrderList(queryParams)
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
  queryParams.page = 1
  selectedRows.value = []
  getList()
}

async function resetQuery() {
  selectedRows.value = []
  Object.assign(
    queryParams,
    Object.fromEntries(Object.entries(queryParams).map(([key]) => [key, ''])),
    { page: 1, size: 10, pageType: 0 }
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

function handleCloseAssistant() {
  tableData.value = []
}

function handleCheck(row: Supplier.Purchase.ListItem) {
  detailDrawerRef.value.open()
  rowData.value = cloneDeep(row)
}

function handleCheckProductOrder(row: Supplier.Purchase.ListItem) {
  router.push({
    name: 'PurchaseProductOrderAdd',
    query: {
      status: row.status || '0',
      purchaseId: row.id,
      scPurchaseRequestOrderNo: row.scPurchaseRequestOrderNo || '',
      scPurchaseRequestOrderName: row.scPurchaseRequestOrderName || '',
      tab: 0
    }
  })
}

async function getgetScPersons() {
  try {
    const res = await getScPersonsApi()
    personList.value = res
  } catch (error) {}
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
  if (['补单量'].includes(column.label)) return 'cursor-default'
  if (!canClickColumn.includes(column.label)) return ''
  if (row[column.rawColumnKey] || column.label === '已入库') return 'can-click-cell'
  else return 'disabled-click-cell'
}

const isNotPage = ref(false)
function handleShowMore(row: any, type: string) {
  rowData.value = row
  currentPoDrawerType.value = type
  isShowPoDrawer.value = true
  poDrawerRef.value.autoOpenDetail()
  openDrawerType.value = 'popover'

  isNotPage.value = ['补单量'].includes(type)
}

const assistantLoading = ref(false)
async function handleConfirmAssistant(row: any, orderHandlerId: string, i: number) {
  try {
    assistantLoading.value = true
    const res = await setCooperateApi({
      orderHandlerId: orderHandlerId,
      orderId: row.id
    })
    if (res.success) {
      message.success('添加协办人员成功')
      handleQuery()
      getFormDOM('cooperate', i)?.close()
    }
  } catch (error) {
  } finally {
    assistantLoading.value = false
  }
}

function cleartable() {
  tableData.value = []
}

defineExpose({ handleQuery, getgetScPersons, handleCloseAssistant, cleartable })

onBeforeMount(() => {
  getList()
  getgetScPersons()
})
</script>
<style lang="less" scoped>
@import url(../../index.scss);
</style>
