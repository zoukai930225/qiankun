<template>
  <el-row>
    <el-col :span="21">
      <el-form :model="queryParams" ref="queryFormRef" :label-width="110">
        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="跟单员" prop="">
              <select-people
                v-model:list="supplierProduct.personList"
                v-model:model-value="queryParams.orderHandlerId"
                :api="getScPersonsApi"
                getListMethod="visible"
                @change="handleQuery"
              />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item prop="skuQuery" label-width="20">
              <sku-goods-no-select
                v-model:params="queryParams"
                goods-code-key="goodsNo"
                @change-type="getList"
                @change-value="handleQuery"
              />
            </el-form-item>
          </el-col>

          <el-col :span="7">
            <el-form-item prop="purchaseTime">
              <template #label>
                <span class="mr-2px">采购时间:</span>
              </template>
              <div class="flex items-center">
                <el-tooltip content="展示采购下单日期在所选时间内的采购数" placement="top">
                  <Icon icon="bi:question-circle-fill" class="ml--6px" :size="14" color="#666" />
                </el-tooltip>
                <el-date-picker
                  type="daterange"
                  class="flex-1"
                  v-model="purchaseTime"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  value-format="YYYY-MM-DD"
                  :clearable="false"
                  format="YYYY-MM-DD"
                  @change="handleQuery"
                />
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-col>
    <el-col :span="3">
      <div class="flex justify-end">
        <el-button @click="handleQuery" class="commonSearchBtn">
          <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
          搜索
        </el-button>
        <el-button @click="resetQuery" class="commonResetBtn" :style="{ marginLeft: '0px' }">
          重置
        </el-button>
      </div>
    </el-col>
  </el-row>

  <ledger-charts
    ref="ledgerChartsRef"
    :params="
      Object.fromEntries(
        Object.entries(queryParams).filter(([key, _]) =>
          ['supplierId', 'goodsNo', 'purchaseTimeStart', 'purchaseTimeEnd'].includes(key)
        )
      )
    "
    :api="orderHandlerLedgerTrend"
  />

  <div class="table-toolbar">
    <span class="color-#333 font-600">跟单台账列表</span>
    <div class="flex items-center ml-auto">
      <component :is="easyBtnGroup(btns)" />
    </div>
  </div>

  <sw-table :options="orderHandlerTable" :data="tableData" :loading="loading">
    <template v-for="slotName in SORT_COLUMN" :key="slotName" #[`${slotName}_header`]="{ column }">
      <div class="flex items-center justify-end">
        <span>{{ column.label }}</span>
        <filter-popper
          v-model:query-params="queryParams"
          :slot-name="
            slotName === 'planCompletionRate'
              ? 'plannedCompletionRateQuery'
              : `${slotName.replace(/Total$/, 'Num')}Query`
          "
          @handle-query="handleQuery"
        />
      </div>
    </template>

    <template
      v-for="slotName in ['inFactoryTotal', 'inboundTotal']"
      :key="slotName"
      #[slotName]="{ col, index, row }"
    >
      <el-button
        v-if="index"
        link
        type="primary"
        :disabled="+col === 0"
        @click="handleOpenPoDrawer(slotName, row)"
        >{{ col }}</el-button
      >
    </template>
  </sw-table>

  <po-drawer
    ref="poDrawerRef"
    v-model:model-value="isShowPoDrawer"
    :title="poDrawerTableOptions.title"
    :table-options="poDrawerTableOptions.option"
    :api="poDrawerTableOptions.api"
    :type="poDrawerTableOptions.type"
    :width="poDrawerTableOptions.width"
    :params="poDrawerTableOptions.params"
  />
</template>
<script lang="tsx" setup>
import { useSupplierAppointment, useSupplierProduct } from '@/store/modules/supplier'
import SwTable from '@/views/supplier/components/table.vue'
import { defaultDate, orderHandlerTable } from '../options'
import {
  orderHandlerLedgerExportList,
  orderHandlerLedgerOrderList,
  orderHandlerLedgerTrend,
  selectAsrStatisticByPageApi,
  selectPoStatisticByPage
} from '@/api/supplier/supplierData'
import Icon from '@/components/Icon/src/Icon.vue'
import download from '@/utils/download'
import filterPopper from '../components/filterPopper.vue'
import selectPeople from '@/views/supplier/components/selectPeople.vue'
import { getScPersonsApi } from '@/api/supplier/purchase'
import { formatDate } from '@/utils/formatTime'
import PoDrawer from '@/views/supplier/components/PoDrawer.vue'
import { ASRTable, PoTable } from '@/views/supplier/purchase/options'
import skuGoodsNoSelect from '@/views/supplier/components/sku&goodsNoSelect.vue'
import { easyBtnGroup } from '@/views/supplier/components/twoFourSix'
import Pagination from '@/components/Pagination/index.vue'
import ledgerCharts from '../components/orderHandlerCharts.vue'

defineOptions({ name: 'OrderHandlerLedger' })

const appointment = useSupplierAppointment()
const message = useMessage()
const supplierProduct = useSupplierProduct()

const SORT_COLUMN = [
  'purchaseTotal',
  'inFactoryTotal',
  'inboundTotal',
  'baseGoodsInboundTotal',
  'inboundFgGoodsTotal',
  'actualInboundTotal',
  'actualInboundAmountTotal',
  'purchaseCompletionRate'
]
const queryParams = ref<Supplier.Ledger.OrderHandlerListRequest>({
  pageNum: 1,
  pageSize: 10,
  sku: '',
  goodsNo: '',
  purchaseTimeEnd: defaultDate[1],
  purchaseTimeStart: defaultDate[0],
  ...Object.fromEntries(
    SORT_COLUMN.map((ele) => [`${ele.replace(/Total$/, 'Num')}Query`, { sort: undefined }])
  )
})

const loading = ref(false)
const total = ref(0)
const tableData = ref<Supplier.Ledger.SupplierOrderList[]>([])
const rowData = ref<Supplier.Ledger.SupplierOrderList>()
const isShowPoDrawer = ref(false)
const currentPoDrawerType = ref('')
const ledgerChartsRef = ref<InstanceType<typeof ledgerCharts>>()
const abortController = ref<AbortController | null>(null)
const requestId = ref(0)

// 操作按钮
const btns = computed(() => [
  {
    label: '导出',
    type: 'primary',
    icon: <Icon icon="ep:download" />,
    permission: 'SupplierLedger:OrderHandler:Export',
    onClick: exportLedger,
    loading: exportLoading.value
  }
])

const poDrawerTableOptions = computed(() => {
  let option: TableOption = []
  let api: (params: any) => Promise<any> | any = () => {}
  let title = ''
  let type: '1' | '2' | '3' | '4' = '1'
  let width: number | string = 1085

  switch (currentPoDrawerType.value) {
    case '在厂数量':
      option = PoTable
      api = selectPoStatisticByPage
      title = `采购生产订单`
      type = '1'
      width = 1350
      break
    case '在途数量':
      option = ASRTable
      api = selectAsrStatisticByPageApi
      title = `预约发货单`
      type = '2'
      width = 1450
      break
  }

  const params = {
    sku: rowData.value?.sku,
    supplier: rowData.value?.supplierId,
    excludeFinishOrder: queryParams.value.excludeFinishOrder,
    orderHandlerId: rowData.value?.orderHandlerId
  }
  return { option, api, title, type, width, params }
})

const purchaseTime = computed({
  get: () => [queryParams.value.purchaseTimeStart ?? '', queryParams.value.purchaseTimeEnd ?? ''],
  set: (val) => {
    queryParams.value.purchaseTimeStart = val?.[0] ?? undefined
    queryParams.value.purchaseTimeEnd = val?.[1] ?? undefined
  }
})

async function getList() {
  loading.value = true
  if (abortController.value) {
    abortController.value.abort('新请求触发，中断旧请求')
  }
  abortController.value = new AbortController()
  const currentRequestId = ++requestId.value
  try {
    const res = await orderHandlerLedgerOrderList(queryParams.value, abortController.value.signal)
    if (currentRequestId !== requestId.value) return
    tableData.value = res.records.length
      ? [res.records?.[0]?.totalInfo || {}, ...res.records.map((ele) => ({ ...ele.orderList }))]
      : []
    total.value = res.total
  } catch (error) {
  } finally {
    if (currentRequestId !== requestId.value) return
    loading.value = false
  }
}

async function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
  ledgerChartsRef?.value?.getData()
}

async function resetQuery() {
  Object.assign(
    queryParams.value,
    Object.fromEntries(Object.keys(queryParams.value).map((key) => [key, undefined])),
    {
      pageNum: 1,
      pageSize: 10,
      sku: '',
      goodsNo: '',
      purchaseTimeEnd: defaultDate[1],
      purchaseTimeStart: defaultDate[0],
      ...Object.fromEntries(
        SORT_COLUMN.map((ele) => [`${ele.replace(/Total$/, 'Num')}Query`, { sort: undefined }])
      )
    }
  )
  handleQuery()
}

async function getSupplierList() {
  try {
    if (appointment.supplierIdOptions.length === 0) {
      await appointment.getSupplierIdOptions()
    }
  } catch (error) {}
}

const exportLoading = ref(false)
async function exportLedger() {
  if (exportLoading.value) return
  try {
    exportLoading.value = true
    const res = await orderHandlerLedgerExportList(queryParams.value)
    if (res) {
      download.excel(res, `跟单台账-${formatDate(new Date(), 'YYYYMMDDHHmmss')}.xlsx`)
      message.success('导出成功')
    }
  } catch (error) {
  } finally {
    const timer = setTimeout(() => {
      exportLoading.value = false
      clearTimeout(timer)
    }, 1500)
  }
}

function handleOpenPoDrawer(slotName: string, row: any) {
  const currentSlot = orderHandlerTable.find((ele) => ele.prop === slotName)

  currentPoDrawerType.value = currentSlot!.label!

  rowData.value = { ...row }

  isShowPoDrawer.value = true
}

onBeforeMount(() => {
  getList()
  getSupplierList()
  supplierProduct.getSupplierList()
})

defineExpose({
  handleQuery,
  Pagination: () => (
    <Pagination
      total={total.value}
      page={queryParams.value.pageNum}
      limit={queryParams.value.pageSize}
      onUpdate:page={(val) => (queryParams.value.pageNum = val)}
      onUpdate:limit={(val) => (queryParams.value.pageSize = val)}
      onPagination={getList}
    />
  ),
  get ledgerChartsRef() {
    return ledgerChartsRef.value
  }
})
</script>
<style lang="less" scoped>
@import url(../../index.scss);

.table-toolbar {
  display: flex;
  align-items: center;
  justify-content: end;
  margin-bottom: 10px;
}

:deep(.el-form-item__label) {
  align-items: center;
  line-height: 1.1;
  text-align: right;
}
</style>

<style lang="less">
.sort-filter-popper {
  .el-input {
    width: 82px;
  }
}
</style>
