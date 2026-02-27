<template>
  <ContentWrap is-auto-height ref="contentWrapRef">
    <table-box v-bind="{ maxViewHeight: innerHeight, thresholdValue: 0 }">
      <template #prePart>
        <el-row :gutter="24">
          <el-col :span="20" class="!flex-1">
            <el-form :model="queryParams" ref="queryFormRef" :label-width="90">
              <el-row :gutter="12">
                <el-col :span="6">
                  <el-form-item label-width="0">
                    <el-input
                      v-model="queryParams[codeType]"
                      clearable
                      :placeholder="codeTypes[codeType].placeholder"
                      @keydown.enter="handleQuery"
                      @clear="handleQuery"
                    >
                      <template #prepend>
                        <el-select v-model="codeType" @change="handleChangeCodeType">
                          <el-option
                            v-for="(value, key) in codeTypes"
                            :key="key"
                            :value="key"
                            :label="value.label"
                          />
                        </el-select>
                      </template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="供应商:" prop="supplierId">
                    <el-select-v2
                      v-model="supplierIds"
                      multiple
                      clearable
                      collapse-tags
                      collapse-tags-tooltip
                      filterable
                      popper-class="w-[min-content]"
                      placeholder="请选择供应商"
                      :options="supplierProduct.supplierList"
                      @change="handleQuery"
                    />
                  </el-form-item>
                </el-col>
                <el-col v-if="!isStorageReceiving" :span="6">
                  <el-form-item label="订单状态:" prop="status">
                    <el-select
                      v-model="statusList"
                      placeholder="请选择订单状态"
                      clearable
                      @change="handleStatusQuery"
                      multiple
                    >
                      <el-option
                        v-for="item in auditStatusOps2"
                        :key="item.value"
                        :value="item.value"
                        :label="item.label"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col v-if="!isStorageReceiving" :span="6">
                  <el-form-item label-width="20">
                    <sku-goods-no-select
                      v-model:params="queryParams"
                      sku-key="goodsCode"
                      goods-code-key="goodsNo"
                      @change-type="getList"
                      @change-value="handleQuery"
                    />
                  </el-form-item>
                </el-col>
                <el-col v-else-if="isStorageReceiving" :span="6">
                  <el-form-item prop="receivingWareHouse" label="收货仓库:">
                    <el-select
                      v-model="queryParams.receivingWareHouse"
                      filterable
                      clearable
                      placeholder="请选择收货仓库"
                      @change="handleQuery"
                    >
                      <el-option
                        v-for="item in supplierAppointment.receivingWarehouseOps"
                        :key="item.label"
                        :value="item.value"
                        :label="item.label"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col v-if="isStorageReceiving" :span="6">
                  <el-form-item label="预约到货日期">
                    <el-date-picker
                      type="daterange"
                      v-model="receivingDate"
                      format="YYYY-MM-DD"
                      value-format="YYYY-MM-DD"
                      start-placeholder="开始时间"
                      end-placeholder="结束时间"
                      clearable
                      @change="handleQuery"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6" v-show="isMore">
                  <el-form-item label="发货日期">
                    <el-date-picker
                      v-model="auditTime"
                      type="daterange"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      format="YYYY-MM-DD"
                      value-format="YYYY-MM-DD"
                      clearable
                      @change="handleQuery"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-col>

          <el-col :span="4" class="min-w-350px !flex justify-end">
            <el-button @click="handleQuery" class="commonSearchBtn">
              <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
              搜索
            </el-button>
            <el-button @click="resetQuery" class="commonResetBtn" :style="{ marginLeft: '0px' }">
              重置
            </el-button>

            <special-dropdown :btns="btnOps" :loading-btns="['导出']" />

            <el-button @click="isMore = !isMore" type="primary" link class="ml12px !h32px">
              <img
                src="@/assets/svgs/supplier/zhankai.svg"
                alt=""
                class="mr4px"
                :style="{ transform: !isMore ? 'rotate(180deg)' : 'rotate(0)' }"
              />
              {{ isMore ? '收起' : '展开' }}
            </el-button>
          </el-col>
        </el-row></template
      >

      <special-table
        :data="tableData"
        :options="tableOptions"
        :loading="loading"
        :btns-options="btnsOptions"
        :cell-class-name="cellClassName"
        @cell-click="handleCellClick"
      >
        <template #scPurchaseOrderNo="{ row, col }">
          <span
            @contextmenu="
              ($event) => {
                $event.preventDefault()
                handleCopyCode(col)
              }
            "
            @click="canShowDetail(col) ? gotoOrderDetail(row) : ''"
            :class="canShowDetail(col) ? 'oderNo' : ''"
          >
            {{ col || '--' }}
          </span>
        </template>

        <template #deliveryGoodsQuantityTotal="{ row }">
          <popover-cell
            :reference="row.deliveryGoodsQuantityTotal"
            :row-data="row"
            :api="appointAuditApi.getAdvancedShippingRequestOrderById"
            :option="goodsDeliveryQuantityTable"
            :asr-id="row.id"
            isNotPage="asrId"
            isNotPageApi
            title="发货量"
            @show-more="handleShowMore(row, '发货量')"
          />
        </template>
        <template #inboundGoodsQuantityTotal="{ row }">
          <popover-cell
            :reference="row.inboundGoodsQuantityTotal"
            :row-data="row"
            :api="getScStockInPageDetail"
            :option="inboundGoodsQuantityTotalTable"
            :asr-id="row.id"
            title="入库单"
            @show-more="handleShowMore(row, '入库量')"
          />
        </template>
      </special-table>

      <div class="w100% mt20px flex justify-between">
        <div v-if="total" class="flex items-center font-size-14px">
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
  </ContentWrap>

  <po-drawer
    ref="poDrawerRef"
    v-model:model-value="isShowPoDrawer"
    :title="poDrawerTableOptions.title"
    :table-options="poDrawerTableOptions.option"
    :api="poDrawerTableOptions.api"
    :type="poDrawerTableOptions.type"
    :open-type="openDrawerType"
    :asr-id="rowData.id"
    :width="poDrawerTableOptions.width"
  />

  <!-- 审核记录 -->
  <auditLogDrawer
    ref="auditLogDrawerRef"
    time-key="auditTime"
    status-key="auditType"
    person-key="auditUserName"
    comment-key="auditComment"
    descKey="auditTypeTxt"
    :is-no-pass="(status) => status === 3"
    :is-pass="(status) => status === 2"
    :is-recall="(status) => status === 4"
    :is-submit="(status) => status === 1"
  />

  <!-- 物流信息 -->
  <logistics-dialog
    v-model:is-show="logisticDialogOption.isShow"
    :asr-code="logisticDialogOption.rowData.advancedShippingRequestOrderNo"
    :asr-id="logisticDialogOption.rowData.id"
    :logisticsRecordFlag="logisticDialogOption.rowData.logisticsRecordFlag"
    read-only
  />

  <po-detail-drawer v-bind="PoDetailProps" v-model="PoDetailProps.modelValue" />

  <!-- 订单日志 -->
  <auditLogDrawer
    drawerTitle="订单日志"
    ref="orderLogDrawerRef"
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
import { auditStatusOps2 } from '../appointment/options'
import { ElButton } from 'element-plus'
import * as appointAuditApi from '@/api/supplier/appointAudit'
import { useSupplierAppointment, useSupplierProduct } from '@/store/modules/supplier'
import {
  goodsDeliveryQuantityTable,
  inboundGoodsQuantityTotalTable,
  RKTable
} from '../purchase/options'
import {
  getScStockInPage,
  getScStockInPageDetail,
  queryListByBusinessIdApi
} from '@/api/supplier/purchase'
const PoDrawer = defineAsyncComponent(() => import('../components/PoDrawer.vue'))
const PopoverCell = defineAsyncComponent(() => import('../components/popoverDetail.vue'))
import auditLogDrawer from '@/views/supplier/appointment/components/auditLogDrawer.vue'
import { AuditBtn } from '../changeAudit/option'
import { toReactive } from '@vueuse/core'
import { exportAsrDetailApi } from '@/api/supplier/appoint'
import { formatDate } from '@/utils/formatTime'
import download from '@/utils/download'
import { handleCopyCode } from '@/utils/copyText'
const LogisticsDialog = defineAsyncComponent(() => import('../components/logisticDialog.vue'))
import specialTable from '../components/table.vue'
import { mainTable } from './options'
import PoDetailDrawer from './components/detailDrawer.vue'
import skuGoodsNoSelect from '@/views/supplier/components/sku&goodsNoSelect.vue'
import ContentWrap from '@/components/ContentWrap/src/ContentWrap.vue'
import tableBox from '@/views/supplier/components/tableBox.vue'
import specialDropdown from '../components/specialDropdown.vue'
import Icon from '@/components/Icon/src/Icon.vue'
import CommentDrawer from '../components/comment'

defineOptions({ name: 'SupplierAppointmentAudit' })

const supplierProduct = useSupplierProduct()

const props = withDefaults(
  defineProps<{
    isStorageReceiving?: boolean
    codeTypes?: any
  }>(),
  {
    isStorageReceiving: false,
    codeTypes: {
      advancedShippingRequestOrderNo: { label: '预约单号', placeholder: '请输入预约单号' },
      scPurchaseOrderNo: { label: '采购生产单号', placeholder: '请输入采购生产单号' },
      wdtPurchaseNo: { label: 'ERP采购单号', placeholder: '请输入ERP采购单号' }
    }
  }
)

const emit = defineEmits(['update:code-type'])

const router = useRouter()
const route = useRoute()
const message = useMessage()
const supplierAppointment = useSupplierAppointment()

const queryParams = reactive({
  page: 1,
  size: 10,
  advancedShippingRequestOrderNo: '',
  scPurchaseOrderNo: '',
  supplierId: '' as string | undefined,
  status: undefined as string | undefined,
  startTime: '',
  endTime: '',
  goodsNo: '',
  receivingWareHouse: '',
  auditTimeStart: '',
  auditTimeEnd: ''
})
const loading = ref(false)
const total = ref(0)
const tableData = ref<any>([])
const codeType = ref(props.isStorageReceiving ? 'wdtPurchaseNo' : 'advancedShippingRequestOrderNo')
const currentPoDrawerType = ref('')
const openDrawerType = ref<'click' | 'popover'>('click')
const auditLogDrawerRef = ref()
const isShowPoDrawer = ref(false)
const poDrawerRef = ref()
const logisticDialogOption = reactive({
  isShow: false,
  rowData: {} as Supplier.Purchase.ListItem
})
const summary = ref({
  deliveryGoodsQuantityTotal: 0,
  goodsInboundQuantityTotal: 0
})
const summaryItems = [
  { label: '总发货量', prop: 'deliveryGoodsQuantityTotal' },
  { label: '总入库量', prop: 'goodsInboundQuantityTotal' }
]
const btnOps = [
  {
    label: '导出',
    option: handleExport,
    permission: `${String(route.name)}:Export`,
    icon: <Icon icon="ep:download" />
  }
]
const isMore = ref(false)
const isExportLoading = ref(false)
const PoDetailProps = reactive({
  modelValue: false,
  rowData: {} as any
})
const orderLogDrawerRef = ref<InstanceType<typeof auditLogDrawer>>()
const contentWrapRef = ref<InstanceType<typeof ContentWrap>>()

const innerHeight = computed(() => contentWrapRef.value?.cardInnerHeigh || 0)
const tableOptions = computed(() => {
  const tableMap = new Map(mainTable.map((ele) => [ele.label, ele]))
  if (props.isStorageReceiving) {
    tableMap.delete('采购生产单号')
  }

  return Array.from(tableMap.values())
})

const supplierIds = computed({
  get: () => (queryParams.supplierId ? queryParams.supplierId.split(',') : undefined),
  set: (val) => (queryParams.supplierId = val && val.length ? val.join(',') : undefined)
})

const receivingDate = computed({
  get: () => [queryParams.startTime, queryParams.endTime],
  set: (val) => {
    queryParams.startTime = val?.[0] ?? null
    queryParams.endTime = val?.[1] ?? null
  }
})

const auditTime = computed({
  get: () => [queryParams.auditTimeStart ?? '', queryParams.auditTimeEnd ?? ''],
  set: (val) => {
    queryParams.auditTimeStart = val?.[0]
    queryParams.auditTimeEnd = val?.[1]
  }
})

const poDrawerTableOptions = computed(() => {
  let option: TableOption = []
  let api: (params: any) => Promise<any> | any = () => {}
  let title = ''
  let type: '1' | '2' | '3' | '5' = '1'
  let width = 1250
  switch (currentPoDrawerType.value) {
    case '入库量':
      option = RKTable
      api = getScStockInPage
      title = `入库单 (${rowData.value.advancedShippingRequestOrderNo})`
      type = '3'
      break
    case '发货量':
      option = RKTable
      api = getScStockInPage
      title = `发货单 (${rowData.value.advancedShippingRequestOrderNo})`
      type = '5'
      break
  }
  return { option, api, title, type, width }
})

enum BTNS_KEY {
  /** 查看 */ CHECK,
  /** 评论 */ COMMENT,
  /** 审核 */ AUDIT,
  /** 审核日志 */ AUDIT_LOG,
  /** 订单日志 */ ORDER_LOG,
  /** 物流信息 */ LOGISTICS
}

const BASE_BTN_CONFIGS: Record<BTNS_KEY, [string, (...arg: any[]) => void, any]> = {
  [BTNS_KEY.CHECK]: [
    '查看',
    (row) => openAuditDrawer('show', row.id, row.advancedShippingRequestOrderNo),
    { permission: `${String(route.name)}:Check` }
  ],
  [BTNS_KEY.COMMENT]: [
    '评论',
    (row) => CommentDrawer.open(row),
    { permission: `${String(route.name)}:Check` }
  ],
  [BTNS_KEY.AUDIT]: [
    '审核',
    (row) => openAuditDrawer('audit', row.id, row.advancedShippingRequestOrderNo),
    { permission: `${String(route.name)}:Audit` }
  ],
  [BTNS_KEY.LOGISTICS]: [
    '物流信息',
    handleLogistics,
    { permission: `${String(route.name)}:Logistics` }
  ],
  [BTNS_KEY.AUDIT_LOG]: [
    '审核日志',
    handleCheckLog,
    { permission: `${String(route.name)}:AuditLog` }
  ],
  [BTNS_KEY.ORDER_LOG]: [
    '订单日志',
    handleCheckOrderLog,
    { permission: `${String(route.name)}:OrderLog` }
  ]
}

/**计算按钮配置 */
const btnsOptions = computed(() =>
  tableData.value.map(({ auditStatus, logisticsRecordFlag }) => {
    const hideBtnKeys = new Set([
      BTNS_KEY.ORDER_LOG,
      BTNS_KEY.AUDIT_LOG,
      BTNS_KEY.LOGISTICS,
      BTNS_KEY.COMMENT
    ])

    switch (auditStatus) {
      case '10':
        hideBtnKeys.add(BTNS_KEY.AUDIT)
        break
      default:
        hideBtnKeys.add(BTNS_KEY.CHECK)
        break
    }

    const hideBtns = Array.from(hideBtnKeys)
      .sort((a, b) => a - b)
      .map((key) => new AuditBtn(...BASE_BTN_CONFIGS[key]))

    if (logisticsRecordFlag === 0) {
      const target = hideBtns.find((ele) => ele.label === '物流信息')
      if (target) {
        target.disabled = true
        target.disabledDesc = '当前预约发货单未填写物流信息'
      }
    }

    return toReactive(hideBtns)
  })
)

function handleCheckOrderLog(row) {
  orderLogDrawerRef.value?.open(row.id)
}

function handleLogistics(row) {
  logisticDialogOption.isShow = true
  logisticDialogOption.rowData = { ...row }
}

async function handleExport() {
  try {
    isExportLoading.value = true
    const res = await exportAsrDetailApi(queryParams)
    if (res) {
      const fileName: string = `预约发货单导出-${formatDate(new Date(), 'YYYYMMDDHHmmss')}.xlsx`
      download.excel(res, fileName)
      message.success('导出成功！')
    }
  } catch (error) {
  } finally {
    isExportLoading.value = false
  }
}

const statusList = computed({
  get: () => (queryParams.status ? queryParams.status.split(',') : undefined),
  set: (val) => (queryParams.status = val && val.length ? val.join(',') : undefined)
})

const handleStatusQuery = (vals) => {
  if (vals.length) {
    queryParams.status = vals.join(',')
  } else {
    queryParams.status = ''
  }
  getList()
}

function handleCellClick(row: Supplier.Purchase.ListItem, column: any) {
  if (!row[column.property]) return
  const canClickColumn = ['入库量']
  if (!canClickColumn.includes(column.label)) return

  currentPoDrawerType.value = column.label

  // 打开采购生产订单弹窗
  isShowPoDrawer.value = true
  rowData.value = row
  openDrawerType.value = 'click'
}

function handleCheckLog(row) {
  auditLogDrawerRef.value?.open(row.id)
}

function handleChangeCodeType() {
  let val = ''
  Object.keys(props.codeTypes).forEach((key) => {
    queryParams[key] && (val = queryParams[key])
    queryParams[key] = ''
  })
  val && getList()
}

// 查看 采购订单详情
const rowData = ref<any>({})
const canShowDetail = (col: string) => {
  return col.split(',').length <= 1
}
const gotoOrderDetail = (row) => {
  PoDetailProps.rowData = { ...row }
  PoDetailProps.modelValue = true
}
// 审核页面
const openAuditDrawer = (type, id, advancedShippingRequestOrderNo) => {
  router.push({
    name: props.isStorageReceiving ? 'StorageReceivingDetail' : 'PurchaseAppointmentOrderAudit',
    query: {
      type,
      id,
      advancedShippingRequestOrderNo
    }
  })
}

function cellClassName({ column, row }) {
  const canClickColumn = ['入库量']
  if (['发货量'].includes(column.label)) return 'cursor-default'
  if (!canClickColumn.includes(column.label)) return ''
  if (row[column.property]) return 'can-click-cell'
  else return 'disabled-click-cell'
}

const timer = ref<NodeJS.Timeout | null>()
function getList() {
  loading.value = true
  timer.value && clearTimeout(timer.value)

  timer.value = setTimeout(async () => {
    try {
      const res = await appointAuditApi[
        props.isStorageReceiving ? 'getpaginQueryWareHouseApi' : 'getAppointApproveList'
      ](
        Object.assign(
          queryParams,
          props.isStorageReceiving
            ? { status: '20,30,35', orderField: 'appointmentDate', orderType: 'desc' }
            : {}
        )
      )
      tableData.value = res.records
      total.value = res.total
      summary.value = res.extras.summary
    } catch (error) {
    } finally {
      loading.value = false
      timer.value && clearTimeout(timer.value)
    }
  }, 1000)
}
function handleQuery() {
  queryParams.page = 1
  getList()
}
function resetQuery() {
  Object.assign(
    queryParams,
    Object.fromEntries(Object.entries(queryParams).map(([key]) => [key, ''])),
    { page: 1, size: 10 }
  )
  getList()
}

function handleShowMore(row: any, type: string) {
  rowData.value = row
  currentPoDrawerType.value = type
  isShowPoDrawer.value = true
  openDrawerType.value = 'popover'
  poDrawerRef.value.autoOpenDetail()
}

onActivated(() => {
  getList()
})

onBeforeMount(() => {
  getList()
  supplierProduct.getSupplierList()
  supplierAppointment.getReceivingWarehouseOps()
})
</script>
<style lang="less" scoped>
@import url('../index.scss');

.oderNo {
  color: #0064ff;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
}

:deep(.el-pagination) {
  margin: 0;
}
</style>
