<template>
  <ContentWrap is-auto-height ref="contentWrapRef">
    <table-box v-bind="{ maxViewHeight: innerHeight, thresholdValue: 0 }">
      <template #prePart>
        <el-row :gutter="24">
          <el-col :span="20" class="!flex-1">
            <el-form :model="queryParams" ref="queryFormRef" :label-width="90">
              <el-row :gutter="14" :style="{ maxWidth: '1340px' }">
                <el-col :span="6">
                  <el-form-item label="生产订单号:" prop="scPurchaseOrderNo">
                    <el-input
                      v-model.trim="queryParams.scPurchaseOrderNo"
                      placeholder="请输入生产订单号"
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
                      @change-type="getList"
                      @change-value="handleQuery"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="订单状态:" prop="status">
                    <el-select
                      v-model="queryStatus"
                      placeholder="请选择订单状态"
                      clearable
                      multiple
                      collapse-tags
                      collapse-tags-tooltip
                      @change="handleQuery"
                    >
                      <el-option
                        v-for="item in statusOps()"
                        :key="item?.value"
                        :value="item!.value"
                        :label="item?.label"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item prop="supplierId" label="供应商:">
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

                <el-col :span="6" v-show="isMore">
                  <el-form-item label="跟单人" prop="">
                    <select-people
                      v-model:list="supplierProduct.personList"
                      v-model:model-value="queryParams.orderHandler"
                      :multiple="false"
                      placeholder="请选择跟单人"
                      get-list-method="visible"
                      :api="getScPersonsApi"
                      @change="handleQuery"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6" v-show="isMore">
                  <el-form-item label="QC质检员" prop="">
                    <select-people
                      v-model:model-value="queryParams.qcInspectorId"
                      v-model:list="qcInspectorList"
                      :multiple="false"
                      placeholder="请选择跟单人"
                      :api="shippingVerificationApi.getQCPersonListApi"
                      @change="handleQuery"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="6" v-show="isMore">
                  <el-form-item prop="firstBatchTime" label="合同首批日期:">
                    <el-date-picker
                      type="daterange"
                      v-model.trim="firstBatchTime"
                      value-format="YYYY-MM-DD"
                      start-placeholder="开始时间"
                      end-placeholder="结束时间"
                      clearable
                      @change="handleQuery"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6" v-show="isMore">
                  <el-form-item prop="latestArrivalTime" label="合同清单日期:">
                    <el-date-picker
                      type="daterange"
                      v-model.trim="latestArrivalTime"
                      value-format="YYYY-MM-DD"
                      placeholder="请选择"
                      start-placeholder="开始时间"
                      end-placeholder="结束时间"
                      clearable
                      @change="handleQuery"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="6" v-show="isMore">
                  <el-form-item label="产前样时间:">
                    <el-date-picker
                      type="daterange"
                      v-model="productBeforeDate"
                      value-format="YYYY-MM-DD"
                      placeholder="请选择"
                      start-placeholder="开始时间"
                      end-placeholder="结束时间"
                      clearable
                      @change="handleQuery"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="6" v-show="isMore">
                  <el-form-item label="QC质检员:">
                    <select-people
                      v-model:list="supplierProduct.personList"
                      v-model:model-value="queryParams.orderHandler"
                      :multiple="false"
                      placeholder="请选择QC质检员"
                      get-list-method="visible"
                      :api="getScPersonsApi"
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

      <special-table
        ref="swTableRef"
        :data="dataList"
        :options="mainTable"
        :loading="loading"
        :btns-options="btnsOptions"
        @select="handleTableSelected"
      >
        <template #options="{ index, row }">
          <s-w-table-btns :options="btnsOptions[index]" :row="row">
            <template #QC质检员="{ index: i }">
              <div>
                <cooperate-popover
                  :ref="(ele: any) => (QCPersonSelectRef[index] = ele)"
                  :row="row"
                  :loading="QCPersonLoading"
                  :remote="false"
                  :style="
                    i
                      ? { marginLeft: '10px', lineHeight: '20px' }
                      : { lineHeight: '20px', marginRight: '10px' }
                  "
                  :get-list-api="shippingVerificationApi.getQCPersonListApi"
                  @refresh="handleQuery"
                  @close-others="handleCloseOtherChoosePersonPopover(index)"
                  @submit="(val) => handleChooseQCPerson(row, val, index)"
                >
                  <span>QC质检员</span>
                </cooperate-popover>
              </div>
            </template>
          </s-w-table-btns>
        </template>
      </special-table>

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
  </ContentWrap>
  <detail-drawer
    ref="formRef"
    @success="getList"
    :key="detailKey"
    :scPurchaseOrderId="scPurchaseOrderId"
    :titleNo="titleNo"
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

  <!-- 免检申请 -->
  <exemption-drawer
    v-bind="exemptionDrawerProp"
    v-model="exemptionDrawerProp.modelValue"
    @close="getList"
  />
</template>

<script lang="tsx" setup>
import * as shippingVerificationApi from '@/api/supplier/shippingVerification'
import { PageItem } from './components/Type'
import DetailDrawer from './components/detailDrawer.vue'
import specialTable from '@/views/supplier/components/table.vue'
import { mainTable, statusOps } from './options'
import { useSupplierAppointment, useSupplierProduct } from '@/store/modules/supplier'
import download from '@/utils/download'
import { formatDate } from '@/utils/formatTime'
import { getScPersonsApi, queryListByBusinessIdApi } from '@/api/supplier/purchase'
const SelectPeople = defineAsyncComponent(
  () => import('@/views/supplier/components/selectPeople.vue')
)
import auditLogDrawer from '@/views/supplier/appointment/components/auditLogDrawer.vue'
import { AuditBtn } from '../changeAudit/option'
import { toReactive } from '@vueuse/core'
import skuGoodsNoSelect from '@/views/supplier/components/sku&goodsNoSelect.vue'
import tableBox from '../components/tableBox.vue'
import ContentWrap from '@/components/ContentWrap/src/ContentWrap.vue'
import { Icon } from '@/components/Icon'
import specialDropdown from '../components/specialDropdown.vue'
import cooperatePopover from '@/views/supplier/product/components/cooperatePopover.vue'
import exemptionDrawer from './components/exemptionDrawer.vue'
import CommentDrawer from '../components/comment'

defineOptions({ name: 'ShippingVerification' })

interface TableRow {
  id: string
  status: string
  scPurchaseOrderNo: string
  hasQcExemptionApply: boolean
  // 其他字段根据实际API响应添加
}

const appointment = useSupplierAppointment()
const message = useMessage()
const supplierProduct = useSupplierProduct()
const router = useRouter()

const contentWrapRef = ref<InstanceType<typeof ContentWrap>>()
const innerHeight = computed(() => contentWrapRef.value?.cardInnerHeigh || 0)
const page = ref<PageItem>({ ...new PageItem() })
const dataList = ref<TableRow[]>([])
const loading = ref(false)
const formRef = ref()
const detailKey = ref(0)
const scPurchaseOrderId = ref('')
const titleNo = ref('')
const queryParams = reactive<Supplier.Purchase.GetListParams>({
  page: 1,
  size: 10
})
const total = ref(0)
const isMore = ref(false)
const isExportLoading = ref(false)
const summary = ref({
  goodsInboundQuantityTotal: 0,
  goodsDeliveryQuantityTotal: 0,
  unshippedQuantityTotal: 0,
  goodsStockOutQuantityTotal: 0,
  purchasedGoodsQuantityTotal: 0
})
const summaryItems = [
  { label: '总采购量', prop: 'purchasedGoodsQuantityTotal' },
  { label: '总已发货', prop: 'goodsDeliveryQuantityTotal' },
  { label: '总已入库', prop: 'goodsInboundQuantityTotal' },
  { label: '总已退货', prop: 'goodsStockOutQuantityTotal' },
  { label: '总未发货', prop: 'unshippedQuantityTotal' }
]
const orderLogDrawerRef = ref<InstanceType<typeof auditLogDrawer>>()
const btnOps = [
  {
    label: '导出',
    option: handleExport,
    permission: 'ShippingVerification:Export',
    icon: () => <Icon icon="ep:download" />
  }
]
const QCPersonSelectRef = ref<any[]>([])
const qcInspectorList = ref<any[]>([])

const queryStatus = computed({
  get: () => queryParams.status && queryParams.status.split(','),
  set: (val) => (queryParams.status = val && val.length ? val.join(',') : undefined)
})

enum BTNS_KEYS {
  /** 查看 */ CHECK,
  /** 评论 */ COMMENT,
  /** QC质检员 */ QC_PERSON,
  /** 发货质检 */ SHIPPING_QC,
  /** 免检审核 */ EXEMPTION_AUDIT,
  /** 免检记录 */ EXEMPTION_LOG,
  /** 订单日志 */ LOG
}

const BTNS_CONFIG: Record<BTNS_KEYS, [string, ((...arg: any[]) => any)?, Partial<AuditBtn>?]> = {
  [BTNS_KEYS.CHECK]: ['查看', openDetail, { permission: 'ShippingVerification:Check' }],
  [BTNS_KEYS.COMMENT]: [
    '评论',
    (row) => CommentDrawer.open(row),
    { permission: 'ShippingVerification:Comment' }
  ],
  [BTNS_KEYS.QC_PERSON]: ['QC质检员', , { permission: 'ShippingVerification:QCPerson' }],
  [BTNS_KEYS.SHIPPING_QC]: [
    '发货质检',
    handleShippingQC,
    { permission: 'ShippingVerification:ShippingQC' }
  ],
  [BTNS_KEYS.EXEMPTION_AUDIT]: [
    '免检审核',
    handleAuditExemption,
    { permission: 'ShippingVerification:ExemptionAudit' }
  ],
  [BTNS_KEYS.EXEMPTION_LOG]: [
    '免检记录',
    handleExemptionLog,
    { permission: 'ShippingVerification:ExemptionLog' }
  ],
  [BTNS_KEYS.LOG]: [
    '订单日志',
    handleCheckOrderLog,
    { permission: 'ShippingVerification:OrderLog' }
  ]
}

/** 计算按钮配置 */
const btnsOptions = computed(() =>
  dataList.value.map(({ status, hasQcExemptionApply }) => {
    const btnKeys = new Set([BTNS_KEYS.CHECK, BTNS_KEYS.LOG, BTNS_KEYS.COMMENT])

    switch (status) {
      case '19':
        btnKeys.add(BTNS_KEYS.QC_PERSON).add(BTNS_KEYS.SHIPPING_QC)
        break
      case '191':
        btnKeys.add(BTNS_KEYS.EXEMPTION_AUDIT)
        break
      case '192':
        btnKeys.add(BTNS_KEYS.SHIPPING_QC).add(BTNS_KEYS.QC_PERSON)
        break
      case '193':
        btnKeys.add(BTNS_KEYS.SHIPPING_QC).add(BTNS_KEYS.QC_PERSON)
        break
      case '20':
      case '30':
        btnKeys.add(BTNS_KEYS.SHIPPING_QC).add(BTNS_KEYS.QC_PERSON)
        break
    }

    if (hasQcExemptionApply) {
      btnKeys.add(BTNS_KEYS.EXEMPTION_LOG)
    }

    const hideBtns: AuditBtn[] = Array.from(btnKeys.values())
      .sort((a, b) => a - b)
      .map((key) => new AuditBtn(...BTNS_CONFIG[key]))

    return toReactive(hideBtns)
  })
)

// 监听表格数据变化，恢复选中状态
watch(dataList, async () => {
  await nextTick()
  dataList.value.forEach((row) => {
    if (selectedRows.value.some((selectedRow) => selectedRow.id === row.id)) {
      swTableRef.value.toggleRowSelection(row, true)
    }
  })
})

async function handleQuery() {
  queryParams.page = 1
  getList()
}
async function resetQuery() {
  Object.assign(
    queryParams,
    Object.fromEntries(Object.entries(queryParams).map(([key]) => [key, undefined])),
    { page: 1, size: 10 }
  )
  getList()
}

const firstBatchTime = computed({
  get: () =>
    queryParams.firstBatchStartTime && queryParams.firstBatchEndTime
      ? [queryParams.firstBatchStartTime, queryParams.firstBatchEndTime]
      : [],
  set: (val) => {
    queryParams.firstBatchStartTime = val ? val[0] : undefined
    queryParams.firstBatchEndTime = val ? val[1] : undefined
  }
})
const latestArrivalTime = computed({
  get: () =>
    queryParams.orderArrivalStartTime && queryParams.orderArrivalEndTime
      ? [queryParams.orderArrivalStartTime, queryParams.orderArrivalEndTime]
      : [],
  set: (val) => {
    queryParams.orderArrivalStartTime = val ? val[0] : undefined
    queryParams.orderArrivalEndTime = val ? val[1] : undefined
  }
})

const productBeforeDate = computed({
  get: () =>
    queryParams.productBeforeStartDate && queryParams.productBeforeEndDate
      ? [queryParams.productBeforeStartDate, queryParams.productBeforeEndDate]
      : [],
  set: (val) => {
    queryParams.productBeforeStartDate = val ? val[0] : undefined
    queryParams.productBeforeEndDate = val ? val[1] : undefined
  }
})

function handleCheckOrderLog(row) {
  orderLogDrawerRef.value?.open(row.id)
}

async function handleExport(row?: Supplier.Purchase.ListItem, index?: number) {
  isExportLoading.value = true
  try {
    const res = await shippingVerificationApi.exportList({
      ...queryParams,
      scPurchaseOrderIds: selectedRows.value.map((ele) => ele.id)
    })
    if (res) {
      const fileName: string = row
        ? `${row?.scPurchaseRequestOrderName}-${row?.scPurchaseRequestOrderNo}.xlsx`
        : `发货校验导出-${formatDate(new Date(), 'YYYYMMDDHHmmss')}.xlsx`
      download.excel(res, fileName)
      if (index === undefined) isExportLoading.value = false
      message.success('导出成功')
    }
  } catch (error) {
    console.log(error)
  } finally {
    isExportLoading.value = false
  }
}

const exemptionDrawerProp = reactive({
  modelValue: false,
  id: '',
  type: 1,
  title: ''
})

function handleAuditExemption(row) {
  exemptionDrawerProp.id = row.id
  exemptionDrawerProp.modelValue = true
  exemptionDrawerProp.type = 1
  exemptionDrawerProp.title = '免检审核'
}

function handleExemptionLog(row) {
  exemptionDrawerProp.id = row.id
  exemptionDrawerProp.modelValue = true
  exemptionDrawerProp.type = 2
  exemptionDrawerProp.title = '免检记录'
}

const selectedRows = ref<typeof dataList.value>([])
const swTableRef = ref()
function handleTableSelected(selection: typeof selectedRows.value, item?: any) {
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
      dataList.value.forEach(
        (tableRow) =>
          !selectedRows.value.some((selectredRow) => selectredRow.id === tableRow.id) &&
          selectedRows.value.push(tableRow)
      )
    } else {
      selectedRows.value = selectedRows.value.filter(
        (selectedRow) => !dataList.value.some((tableRow) => tableRow.id === selectedRow.id)
      )
    }
  }
}

const getList = async () => {
  loading.value = true
  try {
    const data = await shippingVerificationApi.pageList(queryParams)
    dataList.value = (data.records || []).map((item: any) => ({
      ...item
    }))

    page.value = { ...new PageItem(data) }

    total.value = data.total
    summary.value = data.extras.summary
  } finally {
    loading.value = false
  }
}

function openDetail(row) {
  const { scPurchaseOrderNo, id } = row
  scPurchaseOrderId.value = id
  titleNo.value = `查看(${scPurchaseOrderNo})`
  openForm('detail', id)
}
const openForm = (type: string, id?: string) => {
  detailKey.value++
  nextTick(() => {
    if (formRef.value) {
      formRef.value.open(type, id)
    }
  })
}

const route = useRoute()
if (route.query.scPurchaseOrderNo) {
  queryParams.scPurchaseOrderNo = route.query.scPurchaseOrderNo as string
  const newUrl = window.location.href.replace(/\?.*$/, '')
  history.replaceState({}, '', newUrl)
}

const QCPersonLoading = ref(false)
async function handleChooseQCPerson(row: TableRow, val: string, index: number) {
  if (QCPersonLoading.value) return
  QCPersonLoading.value = true
  try {
    const res = await shippingVerificationApi.setQCPersonApi({ inspectorId: val, poId: row.id })
    if (res.success) {
      message.success('QC质检员设置成功！')
      QCPersonSelectRef.value?.[index]?.close()
      getList()
    }
  } catch (error) {
  } finally {
    QCPersonLoading.value = false
  }
}

function handleCloseOtherChoosePersonPopover(index: number) {
  dataList.value.forEach((_, i) => {
    if (i === index) return
    QCPersonSelectRef[i]?.close()
  })
}

function handleShippingQC(row: TableRow) {
  router.push({
    name: 'Quality',
    query: {
      scPurchaseOrderNo: row.scPurchaseOrderNo
    }
  })
}

onBeforeMount(() => {
  if (route.query.scPurchaseOrderNo)
    queryParams.scPurchaseOrderNo = route.query.scPurchaseOrderNo as string

  getList()
  if (appointment.supplierIdOptions.length === 0) appointment.getSupplierIdOptions()
  supplierProduct.getgetScPersons()
})
</script>

<style lang="less" scoped>
@import url(../index.scss);

:deep(.el-pagination) {
  margin: 0;
  // margin-bottom: 0;
  float: none;
}
</style>
