<template>
  <table-box v-bind="{ thresholdValue: 0, maxViewHeight: innerHeight - 50 }">
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
                    sku-key="goodsCode"
                    goods-code-key="goodsNo"
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

              <el-col v-if="userInfo.user.supplierFlag !== 1" :span="6">
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
      :options="purchaseTable"
      :loading="loading"
      :show-overflow-tooltip="true"
      @select="handleTableSelected"
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

      <!-- 操作 -->
      <template #options="{ row, index, optionsBtnsNum }">
        <div class="options">
          <s-w-table-btns
            :can-loading-btn="['确认订单']"
            :options="tableBtns[index] || []"
            :row="row"
            :static-btns-num="optionsBtnsNum"
          >
            <template #预约发货>
              <div :class="{ 'ml-12px': optionsBtnsNum }">
                <el-tooltip
                  content="当前生产单已全部发货"
                  :disabled="!!row.goodsUnDeliveryQuantityTotal"
                >
                  <el-button
                    link
                    type="primary"
                    @click="handleClickAppoint(row)"
                    :disabled="!row.goodsUnDeliveryQuantityTotal"
                  >
                    预约发货
                  </el-button>
                </el-tooltip>
              </div>
            </template>

            <template #确认订单>
              <div :class="{ 'ml-12px': optionsBtnsNum }">
                <el-tooltip content="合同未完成签约" :disabled="!row.needElectronicSignature">
                  <el-button
                    link
                    type="primary"
                    @click="handleConfireOrder(row)"
                    :disabled="row.needElectronicSignature"
                  >
                    确认订单
                  </el-button>
                </el-tooltip>
              </div>
            </template>
          </s-w-table-btns>
        </div>
      </template>
      <!-- 采购数量 -->
      <template #purchasedGoodsQuantityTotal="{ col, row }">
        <popover-cell
          :reference="col"
          :row-data="row"
          :api="getScPurchaseDetailApi"
          :option="purchasedGoodsQuantityTotalTable"
          :po-id="row.id"
          title="采购生产单明细"
          :isNotPageApi="true"
          @show-more="handleCheck(row)"
        />
      </template>

      <!-- 已发货 -->
      <template #goodsDeliveryQuantityTotal="{ col, row }">
        <popover-cell
          :reference="col"
          :row-data="row"
          :api="getScPurchaseDetailApi"
          :option="goodsDeliveryQuantityTable"
          :po-id="row.id"
          isNotPageApi
          title="预约发货单"
          @show-more="handleCheck(row)"
        />
      </template>
    </sw-table>

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

  <detail-drawer :row-data="rowData" ref="detailDrawerRef" :type="1" />

  <!-- 批版报告弹窗 -->
  <version-report-dialog v-bind="versionReportProps" v-model:is-show="versionReportProps.isShow" />
</template>
<script lang="tsx" setup>
import { purchaseTable, statusOps } from '../options'
import SwTable from '../../components/table.vue'
import {
  getScPersonsApi,
  getScPurchaseDetailApi,
  scPurchaseOrderExportApi
} from '@/api/supplier/purchase'
import { cloneDeep } from 'lodash-es'
import DetailDrawer from '../components/detailDrawer.vue'
import { confirmScPurchaseOrderApi, getOrderPageBySupplierApi } from '@/api/supplier/appoint'
import { useUserStore } from '@/store/modules/user'
import { AuditBtn } from '../../changeAudit/option'
import {
  goodsDeliveryQuantityTable,
  purchasedGoodsQuantityTotalTable
} from '../../purchase/options'
import { formatDate } from '@/utils/formatTime'
import download from '@/utils/download'
import { useSupplierAppointment } from '@/store/modules/supplier'
import { SORT_COLUMN } from '../../product/options'
const PopoverCell = defineAsyncComponent(() => import('../../components/popoverDetail.vue'))
import filterPopper from '@/views/supplier/ledger/components/filterPopper.vue'
import skuGoodsNoSelect from '@/views/supplier/components/sku&goodsNoSelect.vue'
import tableBox from '@/views/supplier/components/tableBox.vue'
import specialDropdown from '../../components/specialDropdown.vue'
import Icon from '@/components/Icon/src/Icon.vue'
import { toReactive } from '@vueuse/core'
import versionReportDialog from '../../product/components/versionReportDialog.vue'
import CommentDrawer from '../../components/comment'

const router = useRouter()
const route = useRoute()
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

const queryParams = ref<Supplier.Product.GetPageParams>({
  page: 1,
  size: 10,
  ...Object.fromEntries(SORT_COLUMN.map((ele) => [`${ele}Query`, { sort: undefined }]))
})
const isMore = ref(false)
const loading = ref(false)
const total = ref(0)
const tableData = ref<Supplier.Purchase.ListItem[]>([])
const selectedRows = ref<Supplier.Purchase.ListItem[]>([])
const swTableRef = ref()
const rowData = ref<Supplier.Purchase.ListItem>({})
const detailDrawerRef = ref()
const queryStatus = computed({
  get: () => (queryParams.value.status ? queryParams.value.status.split(',') : undefined),
  set: (val) => (queryParams.value.status = val && val.length ? val.join(',') : undefined)
})
const personList = ref<{ userId: string; avatarOrigin: string; name: string }[]>([])
const summary = ref({
  goodsDeliveryQuantityTotal: 0,
  goodsUnDeliveryQuantityTotal: 0,
  goodsStockOutQuantityTotal: 0,
  purchasedGoodsQuantityTotal: 0
})
const summaryItems = [
  { label: '总采购量', prop: 'purchasedGoodsQuantityTotal' },
  { label: '总已发货', prop: 'goodsDeliveryQuantityTotal' },
  { label: '总已退货', prop: 'goodsStockOutQuantityTotal' },
  { label: '总待发货', prop: 'goodsUnDeliveryQuantityTotal' }
]
const isExportLoading = ref(false)
const versionReportProps = ref({
  isShow: false,
  scPurchaseOrderNo: '',
  status: '18'
})

const firstBatchTime = computed({
  get: () =>
    queryParams.value.firstBatchStartTime && queryParams.value.firstBatchEndTime
      ? [queryParams.value.firstBatchStartTime, queryParams.value.firstBatchEndTime]
      : [],
  set: (val) => {
    queryParams.value.firstBatchStartTime = val ? val[0] : undefined
    queryParams.value.firstBatchEndTime = val ? val[1] : undefined
  }
})
const latestArrivalTime = computed({
  get: () =>
    queryParams.value.latestArrivalStartTime && queryParams.value.latestArrivalEndTime
      ? [queryParams.value.latestArrivalStartTime, queryParams.value.latestArrivalEndTime]
      : [],
  set: (val) => {
    queryParams.value.latestArrivalStartTime = val ? val[0] : undefined
    queryParams.value.latestArrivalEndTime = val ? val[1] : undefined
  }
})

const productBeforeDate = computed({
  get: () =>
    queryParams.value.productBeforeStartDate && queryParams.value.productBeforeEndDate
      ? [queryParams.value.productBeforeStartDate, queryParams.value.productBeforeEndDate]
      : [],
  set: (val) => {
    queryParams.value.productBeforeStartDate = val ? val[0] : undefined
    queryParams.value.productBeforeEndDate = val ? val[1] : undefined
  }
})

const btnOps = [
  {
    label: '导出',
    option: handleExport,
    permission: 'SupplierAppointmentIndex:Order:Export',
    icon: () => <Icon icon="ep:download" />
  }
]

enum BTNS_KEY {
  /** 查看 */ CHECK,
  /** 评论 */ COMMENT,
  /** 预约发货 */ APPOINT,
  /** 确认订单 */ CONFIRM,
  /** 采购合同 */ CONTRACT,
  /** 批版报告 */ VERSION_REPORT
}

const BASE_BTN_CONFIGS: Record<BTNS_KEY, [string, (params: any) => void, any]> = {
  [BTNS_KEY.CHECK]: ['查看', handleCheck, { permission: 'SupplierAppointmentIndex:Order:Check' }],
  [BTNS_KEY.COMMENT]: [
    '评论',
    (row) => CommentDrawer.open(row),
    { permission: 'SupplierAppointmentIndex:Order:Comment' }
  ],
  [BTNS_KEY.APPOINT]: [
    '预约发货',
    handleClickAppoint,
    { permission: 'SupplierAppointmentIndex:Order:Appoint' }
  ],
  [BTNS_KEY.CONFIRM]: [
    '确认订单',
    handleConfireOrder,
    { permission: 'SupplierAppointmentIndex:Order:Confirm' }
  ],
  [BTNS_KEY.VERSION_REPORT]: [
    '批版报告',
    handleVersionReport,
    { permission: 'SupplierAppointmentIndex:Order:VersionReport' }
  ],
  [BTNS_KEY.CONTRACT]: [
    '采购合同',
    handleContranct,
    { permission: 'SupplierAppointmentIndex:Order:Contranct' }
  ]
}

const tableBtns = computed(() =>
  tableData.value.map(({ status, hasProductBefore, hasPatternApproval }) => {
    const hideBtnKeys = new Set([BTNS_KEY.CHECK, BTNS_KEY.COMMENT])

    switch (status) {
      case '10':
        hideBtnKeys.add(BTNS_KEY.CONFIRM)
        break
      case '13':
        if (!hasProductBefore) hideBtnKeys.add(BTNS_KEY.APPOINT)
        break
      case '14':
        hideBtnKeys.add(BTNS_KEY.CONTRACT)
        break
      case '193':
        hideBtnKeys.add(BTNS_KEY.APPOINT)
        break
      case '20':
      case '30':
        hideBtnKeys.add(BTNS_KEY.APPOINT)
        break
      default:
        break
    }

    // 若是买手宽，增加批版报告
    if (hasPatternApproval && status !== '18') hideBtnKeys.add(BTNS_KEY.VERSION_REPORT)

    const hideBtns = Array.from(hideBtnKeys)
      .sort((a, b) => a - b)
      .map((key) => new AuditBtn(...BASE_BTN_CONFIGS[key]))

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

function handleVersionReport(row) {
  versionReportProps.value = {
    isShow: true,
    scPurchaseOrderNo: row.scPurchaseOrderNo,
    status: row.status
  }
}

function handleContranct(row) {
  router.push({
    name: 'SupplierContractCheck',
    params: {
      id: row.id
    },
    query: { from: route.name as string }
  })
}

const timer = ref<NodeJS.Timeout | null>(null)
async function getList() {
  loading.value = true
  if (timer.value) {
    clearTimeout(timer.value)
  }
  timer.value = setTimeout(timeOutallback, 1000)

  async function timeOutallback() {
    try {
      // 合同清单日期排序
      const params = cloneDeep(queryParams.value)
      params.orderArrivalTimeSortQuery = queryParams.value.latestArrivalTimeQuery.sort
      delete params.latestArrivalTimeQuery.sort
      const res = await getOrderPageBySupplierApi(params)
      tableData.value = res.records || []
      summary.value = res.extras.summary
      total.value = res.total
    } catch (error) {
      console.log(error)
    } finally {
      loading.value = false
      timer.value && clearTimeout(timer.value)
    }
  }
}
async function handleQuery() {
  queryParams.value.page = 1
  getList()
}
async function resetQuery() {
  Object.assign(
    queryParams.value,
    Object.fromEntries(Object.entries(queryParams.value).map(([key]) => [key, ''])),
    { page: 1, size: 10 }
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

function handleCheck(row: Supplier.Purchase.ListItem) {
  detailDrawerRef.value.open()
  rowData.value = cloneDeep(row)
}

function handleClickAppoint(row: Supplier.Purchase.ListItem) {
  router.push({
    name: 'PurchaseAppointmentOrderAdd',
    query: {
      PoId: row.id,
      supplierId: userInfo.user.supplierFlag === 1 ? undefined : row.supplier
    }
  })
}

async function handleExport(row?: Supplier.Purchase.ListItem, index?: number) {
  isExportLoading.value = true
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

async function getScPersons() {
  try {
    const res = await getScPersonsApi()
    personList.value = res
  } catch (error) {}
}

async function handleConfireOrder(row: Supplier.Purchase.FormItem) {
  try {
    const res = await confirmScPurchaseOrderApi(row.id || '')
    if (res.success) {
      message.success('确认订单成功')
      handleQuery()
    }
  } catch (error) {}
}

function clearTable() {
  tableData.value = []
}

defineExpose({ handleQuery, getScPersons, clearTable })

onBeforeMount(() => {
  getList()
  getScPersons()
})
</script>
<style lang="less" scoped>
@import url(../../index.scss);
</style>
