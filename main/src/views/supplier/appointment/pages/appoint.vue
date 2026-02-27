<template>
  <table-box v-bind="{ thresholdValue: 0, maxViewHeight: innerHeight - 50 }">
    <template #prePart>
      <el-row :gutter="24">
        <el-col :span="20" class="!flex-1">
          <el-form :model="queryParams" ref="queryFormRef" :label-width="90">
            <el-row :gutter="12" :style="{ maxWidth: '1340px' }">
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
                <el-form-item label="订单状态:" prop="auditStatus">
                  <el-select
                    v-model="auditStatus"
                    placeholder="请选择订单状态"
                    clearable
                    multiple
                    collapse-tags
                    collapse-tags-tooltip
                    @change="handleQuery"
                  >
                    <el-option
                      v-for="item in auditStatusOps"
                      :key="item.value"
                      :value="item.value"
                      :label="item.label"
                    />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="6">
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

              <el-col v-if="userInfo.user.supplierFlag !== 1" :span="6">
                <el-form-item prop="supplierId" label="供应商：">
                  <el-select-v2
                    v-model="queryParams.supplierId"
                    :options="appointment.supplierIdOptions"
                    filterable
                    clearable
                    placeholder="请选择供应商"
                    @change="handleQuery"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-show="isMore" :gutter="12">
              <el-col :span="6">
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
        <el-col :span="4" class="!flex justify-end min-w-350px">
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
      </el-row>
    </template>
    <sw-table
      ref="swTableRef"
      :data="tableData"
      :options="allOrderTable"
      :loading="loading"
      :show-overflow-tooltip="true"
      :btns-options="btnsOptions"
      :loading-btns="['提交', '撤回', '结单']"
    >
      <template #deliveryGoodsQuantityTotal="{ row }">
        <popover-cell
          :reference="row.deliveryGoodsQuantityTotal"
          :row-data="row"
          :api="getAdvancedShippingRequestOrderById"
          :option="ASRPopoverTable"
          :asr-id="row.id"
          isNotPage="asrId"
          isNotPageApi
          title="发货量"
          @show-more="handleShowMore(row, '发货量')"
        />
      </template>
    </sw-table>

    <div class="w100% mt20px flex justify-between">
      <div v-if="total" class="flex items-center font-size-14px">
        <span>
          <span class="color-#666 mr-1.5">总发货量</span>
          <span class="fw-600 mr-3">
            {{ new Intl.NumberFormat().format(summary?.deliveryGoodsQuantityTotal ?? 0) }}
          </span>
        </span>
        <span>
          <span class="color-#666 mr-1.5">总入库量</span>
          <span class="fw-600 mr-3">
            {{ new Intl.NumberFormat().format(summary?.stockInTotal ?? 0) }}
          </span>
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

  <!-- 填写装箱单 -->
  <pickinglist-drawer :row-data="rowData" ref="pickinglistDrawerRef" />

  <!-- 撤回弹窗 -->
  <recall-dialog
    v-model:is-show="isShowRecallDialog"
    :asr-id="rowData.id"
    :asr-code="rowData.advancedShippingRequestOrderNo"
    @refresh="handleQuery"
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

  <!-- 物流信息 -->
  <logistics-dialog
    v-model:is-show="logisticDialogOption.isShow"
    :asr-code="logisticDialogOption.rowData.advancedShippingRequestOrderNo"
    :asr-id="logisticDialogOption.rowData.id"
    :logisticsRecordFlag="logisticDialogOption.rowData.logisticsRecordFlag"
    @refresh="handleQuery"
  />

  <!-- 结单弹窗 -->
  <finish-dialog
    v-model:is-show="finishDialogShow"
    :asr-id="rowData.id"
    :asr-code="rowData.advancedShippingRequestOrderNo"
    @refresh="handleQuery"
  />

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
import { allOrderTable, auditStatusOps } from '../options'
import SwTable from '../../components/table.vue'
import { cloneDeep } from 'lodash-es'
import {
  deleteScAdvancedShippingRequestOrderApi,
  exportAsrDetailApi,
  getScAdvancedShippingRequestOrderApi,
  getWaitingDeliveryQuantity,
  submitScAdvancedShippingRequestOrderApi
} from '@/api/supplier/appoint'
import PickinglistDrawer from '../components/pickinglistDrawer.vue'
import { AuditBtn } from '../../changeAudit/option'
import auditLogDrawer from '@/views/supplier/appointment/components/auditLogDrawer.vue'
import { getAdvancedShippingRequestOrderById } from '@/api/supplier/appointAudit'
import { ASRPopoverTable, RKTable } from '../../purchase/options'
import { getScStockInPage, queryListByBusinessIdApi } from '@/api/supplier/purchase'
import { formatDate } from '@/utils/formatTime'
import download from '@/utils/download'
import { useUserStore } from '@/store/modules/user'
import { useSupplierAppointment } from '@/store/modules/supplier'
import tableBox from '@/views/supplier/components/tableBox.vue'
import skuGoodsNoSelect from '@/views/supplier/components/sku&goodsNoSelect.vue'
const RecallDialog = defineAsyncComponent(() => import('../components/recallDialog.vue'))
const PoDrawer = defineAsyncComponent(() => import('../../components/PoDrawer.vue'))
const PopoverCell = defineAsyncComponent(() => import('../../components/popoverDetail.vue'))
const LogisticsDialog = defineAsyncComponent(() => import('../../components/logisticDialog.vue'))
const FinishDialog = defineAsyncComponent(() => import('../components/finishDialog.vue'))
import specialDropdown from '../../components/specialDropdown.vue'
import Icon from '@/components/Icon/src/Icon.vue'
import { toReactive } from '@vueuse/core'
import CommentDrawer from '../../components/comment'

const router = useRouter()
const message = useMessage()
const userInfo = useUserStore()
const appointment = useSupplierAppointment()

const props = withDefaults(
  defineProps<{
    manangerment?: boolean
    innerHeight?: number
  }>(),
  {
    innerHeight: 0
  }
)

const queryParams = reactive<Supplier.Appoint.GetPageParams>({
  page: 1,
  size: 10
})
const loading = ref(false)
const total = ref(0)
const tableData = ref<Supplier.Appoint.PageItem[]>([])
const rowData = ref<Supplier.Purchase.ListItem>({})
const pickinglistDrawerRef = ref()
const auditStatus = computed({
  get: () => (queryParams.auditStatus ? queryParams.auditStatus.split(',') : undefined),
  set: (val) => (queryParams.auditStatus = val && val.length ? val.join(',') : undefined)
})
const codeTypes = {
  advancedShippingRequestOrderNo: { label: '预约单号', placeholder: '请输入预约单号' },
  scPurchaseOrderNo: { label: '生产订单号', placeholder: '请输入生产订单号' },
  wdtPurchaseNo: { label: 'ERP采购单号', placeholder: '请输入ERP采购单号' }
}
const codeType = ref('advancedShippingRequestOrderNo')
const auditLogDrawerRef = ref()
const logisticDialogOption = reactive({
  isShow: false,
  rowData: {} as Supplier.Purchase.ListItem
})
const summary = ref({
  deliveryGoodsQuantityTotal: 0,
  stockInTotal: 0
})
const isMore = ref(false)
const isExportLoading = ref(false)
const btnOps = [
  {
    label: '新增',
    option: () => {
      router.push({ name: 'PurchaseAppointmentOrderAdd' })
    },
    permission: 'SupplierAppointmentIndex:Appoint:Add',
    icon: () => <Icon icon="ep:plus" />
  },
  {
    label: '导出',
    option: handleExport,
    permission: 'SupplierAppointmentIndex:Appoint:Export',
    icon: () => <Icon icon="ep:download" />
  }
]
const auditTime = computed({
  get: () => [queryParams.auditTimeStart ?? '', queryParams.auditTimeEnd ?? ''],
  set: (val) => {
    queryParams.auditTimeStart = val?.[0]
    queryParams.auditTimeEnd = val?.[1]
  }
})
const orderLogDrawerRef = ref<InstanceType<typeof auditLogDrawer>>()

const poDrawerTableOptions = computed(() => {
  let option: TableOption = []
  let api: (params: any) => Promise<any> | any = () => {}
  let title = ''
  let type: '1' | '2' | '3' | '5' = '1'
  let width = 1400
  switch (currentPoDrawerType.value) {
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
  /** 编辑 */ EDIT,
  /** 提交 */ SUBMIT,
  /** 删除 */ DELETE,
  /** 填写装箱单 */ PICK,
  /** 物流信息 */ LOGISTICS,
  /** 撤回 */ RECALL,
  /** 结单 */ OVER,
  /** 审核日志 */ AUDIT_LOG,
  /** 订单日志 */ ORDER_LOG
}

const BASE_BTN_CONFIGS: Record<BTNS_KEY, [string, (...arg: any[]) => void, any]> = {
  [BTNS_KEY.CHECK]: ['查看', handleCheck, { permission: 'SupplierAppointmentIndex:Appoint:Check' }],
  [BTNS_KEY.COMMENT]: [
    '评论',
    (row) => CommentDrawer.open(row),
    { permission: 'SupplierAppointmentIndex:Order:Comment' }
  ],
  [BTNS_KEY.EDIT]: ['编辑', handleEdit, { permission: 'SupplierAppointmentIndex:Appoint:Edit' }],
  [BTNS_KEY.SUBMIT]: [
    '提交',
    handleSubmitRow,
    { permission: 'SupplierAppointmentIndex:Appoint:Submit' }
  ],
  [BTNS_KEY.DELETE]: [
    '删除',
    handleDeleteRow,
    { type: 'danger', permission: 'SupplierAppointmentIndex:Appoint:Delete' }
  ],
  [BTNS_KEY.PICK]: [
    '填写装箱单',
    handleFillRow,
    { permission: 'SupplierAppointmentIndex:Appoint:Pick' }
  ],
  [BTNS_KEY.LOGISTICS]: [
    '物流信息',
    handleLogistics,
    { permission: 'SupplierAppointmentIndex:Appoint:Logistics' }
  ],
  [BTNS_KEY.RECALL]: [
    '撤回',
    handleRecall,
    { permission: 'SupplierAppointmentIndex:Appoint:Recall', type: 'danger' }
  ],
  [BTNS_KEY.OVER]: [
    '结单',
    handleFinish,
    { permission: 'SupplierAppointmentIndex:Appoint:Over', type: 'danger' }
  ],
  [BTNS_KEY.AUDIT_LOG]: [
    '审核日志',
    handleCheckLog,
    { permission: 'SupplierAppointmentIndex:Appoint:AuditLog' }
  ],
  [BTNS_KEY.ORDER_LOG]: [
    '订单日志',
    handleCheckOrderLog,
    { permission: 'SupplierAppointmentIndex:Appoint:OrderLog' }
  ]
}

/**计算按钮配置 */
const btnsOptions = computed(() =>
  tableData.value.map(({ auditStatus }) => {
    const hideBtnKeys = new Set([
      BTNS_KEY.ORDER_LOG,
      BTNS_KEY.AUDIT_LOG,
      BTNS_KEY.CHECK,
      BTNS_KEY.COMMENT
    ])

    switch (auditStatus) {
      case '0':
      case '40':
        hideBtnKeys
          .add(BTNS_KEY.EDIT)
          .add(BTNS_KEY.SUBMIT)
          .add(BTNS_KEY.DELETE)
          .delete(BTNS_KEY.CHECK)
        break
      case '35':
        if (userInfo.user.supplierFlag !== 1) hideBtnKeys.add(BTNS_KEY.OVER)
        break
      case '20':
      case '30':
        hideBtnKeys.add(BTNS_KEY.PICK).add(BTNS_KEY.LOGISTICS).add(BTNS_KEY.RECALL)
        break
      default:
        hideBtnKeys.add(BTNS_KEY.CHECK)
        break
    }

    const hideBtns = Array.from(hideBtnKeys)
      .sort((a, b) => a - b)
      .map((key) => new AuditBtn(...BASE_BTN_CONFIGS[key]))

    return toReactive(hideBtns)
  })
)

const finishDialogShow = ref(false)
async function handleFinish(row: Supplier.Purchase.ListItem) {
  try {
    const res = await getWaitingDeliveryQuantity(row.id!)

    if (res || res === 0) {
      res !== 0 &&
        (await message.confirm(
          `该订单还差${res}未收到货，确定提前结束吗？\n未完成的发货请尽快安排发货！`
        ))
      finishDialogShow.value = true
      rowData.value = { ...row }
    }
  } catch (error) {}
}

const isShowRecallDialog = ref(false)
async function handleRecall(row: Supplier.Purchase.ListItem) {
  rowData.value = row
  isShowRecallDialog.value = true
}

function handleCheckOrderLog(row) {
  orderLogDrawerRef.value?.open(row.id)
}

function handleLogistics(row) {
  logisticDialogOption.isShow = true
  logisticDialogOption.rowData = { ...row }
}

function handleCheckLog(row) {
  auditLogDrawerRef.value?.open(row.id)
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

async function getList() {
  loading.value = true
  try {
    const res = await getScAdvancedShippingRequestOrderApi(queryParams)
    tableData.value = res.records
    summary.value = res?.extras?.summary
    total.value = res.total
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}
async function handleQuery() {
  queryParams.page = 1
  getList()
}
async function resetQuery() {
  Object.assign(
    queryParams,
    Object.fromEntries(Object.entries(queryParams).map(([key]) => [key, ''])),
    { page: 1, size: 10 }
  )
  getList()
}

const currentPoDrawerType = ref('')
const openDrawerType = ref<'click' | 'popover'>('click')
const isShowPoDrawer = ref(false)
const poDrawerRef = ref()
function handleShowMore(row: any, type: string) {
  rowData.value = row
  currentPoDrawerType.value = type
  isShowPoDrawer.value = true
  openDrawerType.value = 'popover'
  poDrawerRef.value.autoOpenDetail()
}

function handleChangeCodeType() {
  let val = ''
  Object.keys(codeTypes).forEach((key) => {
    queryParams[key] && (val = queryParams[key])
    queryParams[key] = ''
  })
  val && getList()
}

async function handleDeleteRow(row: Supplier.Purchase.ListItem) {
  await message.confirm('确定删除该生产订单吗？')
  try {
    const res = await deleteScAdvancedShippingRequestOrderApi({ id: row.id! })
    if (res.success) {
      message.success('删除成功')
      handleQuery()
    }
  } catch (error) {}
}

async function handleSubmitRow(row: Supplier.Purchase.ListItem, index) {
  await message
    .confirm(`您确定提交 ${row.advancedShippingRequestOrderNo} 预约发货单吗？`)
    .then(async () => {
      try {
        const res = await submitScAdvancedShippingRequestOrderApi(row.id!)
        if (res.success) {
          message.success('提交成功')
          handleQuery()
        }
      } catch (error) {
      } finally {
      }
    })
    .catch(() => {
      getFormDOM(`tableBtns`, index)?.finishLoading()
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

async function handleFillRow(row: Supplier.Purchase.ListItem) {
  rowData.value = cloneDeep(row)

  pickinglistDrawerRef.value.open()
}

function handleEdit(row: Supplier.Purchase.ListItem) {
  router.push({
    name: 'PurchaseAppointmentOrderEdit',
    params: {
      id: row.id
    },
    query: {
      PoId: row.scPurchaseOrderId,
      supplierId: row.supplierId,
      appointmentType: row.appointmentType,
      selectedSkus: row.selectedSkus
    }
  })
}

function handleCheck(row: Supplier.Purchase.ListItem) {
  router.push({
    name: 'PurchaseAppointmentOrderCheck',
    params: {
      id: row.id
    },
    query: {
      PoId: row.scPurchaseOrderId,
      pageType: 1
    }
  })
}

async function getSupplierList() {
  try {
  } catch (error) {}
}

function clearTable() {
  tableData.value = []
}

defineExpose({ handleQuery, getSupplierList, clearTable })

onBeforeMount(() => {
  getList()
  getSupplierList()
})
</script>
<style lang="less" scoped>
@import url(../../index.scss);
</style>
