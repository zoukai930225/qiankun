<template>
  <s-w-drawer
    ref="drawerRef"
    v-model="isShow"
    :with-header="false"
    :wrapper-closable="true"
    body-class="drawer-body"
    footer-class="drawer-footer"
    width="90%"
    append-to-body
    :title="title"
    :close-on-click-modal="!loading"
    @closed="handleClosed"
  >
    <div class="drawerContent" v-loading="loading">
      <el-card shadow="never">
        <div v-if="type === 1">
          <div class="title"> 采购需求单信息 </div>
          <el-divider />
          <el-form
            class="mb-12px"
            :model="rowData"
            ref="queryFormRef"
            label-width="100"
            scroll-to-error
          >
            <el-row :gutter="40">
              <el-col :span="6">
                <el-form-item label="需求单号:" prop="scPurchaseRequestOrderNo">
                  <el-input
                    :model-value="rowData.scPurchaseRequestOrderNo"
                    clearable
                    placeholder="请输入需求单名称"
                    disabled
                  />
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item label="需求单名称:" prop="scPurchaseRequestOrderName">
                  <el-input
                    :model-value="rowData.scPurchaseRequestOrderName"
                    clearable
                    placeholder="请输入需求单名称"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="需求来源:" prop="requestSource">
                  <el-select
                    :model-value="rowData.requestSource"
                    clearable
                    placeholder="请选择需求来源"
                    disabled
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
              <el-col :span="24">
                <el-form-item label="备注:" prop="remarks">
                  <el-input
                    :model-value="rowData.remarks"
                    type="textarea"
                    :maxlength="500"
                    :rows="5"
                    show-word-limit
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="18">
                <el-form-item label="附件:" prop="fileUrl">
                  <files-upload disabled v-model:model-value="fileUrl" :url="fileUrl" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>

        <div v-else>
          <add-form ref="formRef" v-model:model-value="formData" :is-check="true" />
        </div>

        <div class="title">
          {{ type === 1 ? '采购需求明细单' : '采购生产单明细' }}
          <span
            v-if="type === 3 && formData.statisticDate"
            class="color-#DB6A0F !flex items-center ml-16px"
          >
            <Icon icon="ep:warning-filled" class="mr-4px" :size="14" />
            <span class="font-400">数据统计日期：{{ formData.statisticDate }}</span>
          </span>
        </div>
        <el-divider />
        <el-row :gutter="24">
          <el-col :span="20">
            <el-form :model="queryParams" ref="queryFormRef" :label-width="90">
              <el-row :gutter="12" :style="{ maxWidth: '1340px' }">
                <el-col :span="6">
                  <el-form-item label="SKU编码" prop="sku">
                    <scroll-select
                      class-name="!w-100%"
                      v-model:model-value="queryParams.sku"
                      :api="getInfoBySku2"
                      item-label-key="sku"
                      item-value-key="sku"
                      selectKey="sku"
                      clearable
                      @change="handleQuery"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
          <el-col :span="4" class="!flex justify-end">
            <el-button @click="handleQuery" class="commonSearchBtn">
              <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
              搜索
            </el-button>
            <el-button @click="resetQuery" class="commonResetBtn" :style="{ marginLeft: '0px' }">
              重置
            </el-button>
            <component :is="easyBtnGroup(btns)" />
          </el-col>
        </el-row>
        <div class="content userInfo">
          <sw-table
            :data="tableData"
            :options="optionTable"
            :show-overflow-tooltip="true"
            :max-height="672"
            :loading="loading"
            :row-class-name="rowClassName"
            :row-style="rowStyle"
            :btns-options="tableBtns"
            show-summary
            :summary-method="summaryMethod"
            @scroll="handleScrollTable"
          />
        </div>
      </el-card>
    </div>

    <template #footer>
      <el-button class="mlauto" @click="drawerRef.handleClose()">取消</el-button>
    </template>
  </s-w-drawer>
</template>
<script setup lang="tsx">
import {
  exportScPurchaseRequestOrderDetail,
  getCheckInfo,
  getInfoBySku2,
  getScPurchaseDetailApi,
  scPurchaseOrderQuerySnapshotByIdApi,
  stopDelivery
} from '@/api/supplier/purchase'
import { type FormInstance } from 'element-plus'
import { allOrderDetailTableOps, myPurchaseDetailTableOps, previewTableOption } from '../options'
import SwTable from '../../components/table.vue'
import { cloneDeep } from 'lodash-es'
import { getDictOptions } from '@/utils/dict'
import AddForm from './addform.vue'
import download from '@/utils/download'
import { formatDate } from '@/utils/formatTime'
import { Icon } from '@/components/Icon'
import { easyBtnGroup } from '../../components/twoFourSix'
import { AuditBtn } from '../../changeAudit/option'
import { toReactive } from '@vueuse/core'
import { COLUMN_1, inTableSort } from '../../purchaseApplication/options'
import FilesUpload from '@/views/supplier/product/components/changePageUpload.vue'

const props = defineProps<{
  rowData: any
  type: 1 | 2 | 3
}>()

const message = useMessage()

const loading = ref(false)
const drawerRef = ref()
const isShow = ref(false)
const allData = ref<Supplier.Purchase.ListItem[]>([])
const tableData = computed(() => allData.value.slice(0, maxRowNum.value))
const queryParams = ref<any>({
  sku: '',
  scPurchaseRequestOrderId: '',
  scPurchaseOrderId: ''
})
const queryParamsRef = ref<FormInstance>()
const maxRowNum = ref(100)
const stopLoading = ref<boolean[]>([])
const formRef = ref()
const exportLoading = ref(false)
const fileUrl = ref('')
/** 可以暂停的状态 */
const canPauseStatus = ['10', '13', '20', '30', '18', '193']

watch(
  () => props.rowData,
  (val) => {
    fileUrl.value = val.fileUrl
  },
  { deep: true }
)

const optionTable = computed<any[]>(() => {
  const baseColumns = {
    1: myPurchaseDetailTableOps,
    2: allOrderDetailTableOps,
    3: [
      ...previewTableOption,
      ...COLUMN_1.filter((item) => !!item.prop)
        .sort((a, b) => Number(inTableSort[a.prop!]) - Number(inTableSort[b.prop!]))
        .map((ele) => ({ ...ele, transform: (col) => col || '--' }))
    ]
  }[props.type]
  const columns = [...baseColumns]
  const shouldAddActionColumn =
    props.type === 2 && canPauseStatus.includes(props.rowData?.status ?? '')
  shouldAddActionColumn &&
    columns.push({
      label: '操作',
      type: 'options',
      fixed: 'right'
    })
  return cloneDeep(columns)
})

const btns = computed(() => {
  const origin = [
    {
      label: '导出',
      icon: <Icon icon="ep:download"></Icon>,
      type: 'primary',
      loading: exportLoading.value,
      onClick: handleExport,
      permission: 'SupplierProduct:MyPurchase:Check:Export'
    },
    {
      label: '一键暂停',
      type: 'danger',
      loading: loading.value,
      onClick: () => handleQuicklyPause('10'),
      permission: 'SupplierProduct:MyOrder:Check:QuickPurse'
    },
    {
      label: '一键重启',
      type: 'primary',
      loading: loading.value,
      onClick: () => handleQuicklyPause('0'),
      permission: 'SupplierProduct:MyOrder:Check:QuickRun'
    }
  ]

  const btnMap = new Map(origin.map((ele) => [ele.label, ele]))

  switch (true) {
    case props.type === 1:
      return toReactive([btnMap.get('导出')])
    case props.type === 2 && canPauseStatus.includes(props.rowData?.status ?? ''):
      return toReactive([btnMap.get('一键暂停'), btnMap.get('一键重启')])
    default:
      return []
  }
})

const tableBtns = computed(() =>
  tableData.value.map((row, index) => {
    const btns: AuditBtn[] = []
    if (row.detailStatus === '0') {
      btns.push(
        new AuditBtn('暂停', () => handlePause(row, '10', index), {
          type: 'danger',
          permission: 'SupplierProduct:MyOrder:Check:Purse'
        })
      )
    } else {
      btns.push(
        new AuditBtn('重启', () => handlePause(row, '0', index), {
          permission: 'SupplierProduct:MyOrder:Check:Purse'
        })
      )
    }

    return toReactive(btns)
  })
)

const formData = ref<any>({})

const title = computed(() => {
  if (props.type === 1) {
    if (props.rowData.scPurchaseRequestOrderName && props.rowData.scPurchaseRequestOrderNo)
      return `${props.rowData.scPurchaseRequestOrderName}（${props.rowData.scPurchaseRequestOrderNo}）`
  } else {
    if (props.rowData.scPurchaseOrderNo) return `${props.rowData.scPurchaseOrderNo}`
  }
})

function handleScrollTable({ scrollTop }) {
  tableData.value.length < allData.value.length &&
    scrollTop % 5600 === 4984 &&
    (maxRowNum.value += 100)
}

/** 获取详情 */
async function getDetail() {
  loading.value = true
  try {
    const { dataSource, response } = await fetchDataByType()
    const processedData = dataSource
    await nextTick()
    allData.value = processedData
    formData.value = response
  } catch (error) {
    console.error('获取详情失败:', error)
  } finally {
    loading.value = false
  }
}

interface FetchResult {
  dataSource: Array<any>
  sumFields: Record<string, string>
  response: any
}

interface ApiParams {
  [key: string]: any
  scPurchaseRequestOrderId: string
  scPurchaseOrderId: string
}

const requestSourceOption = computed(() => getDictOptions(DICT_TYPE.SC_PR_REQUEST_SOURCE))

const sumFieldsMap = {
  1: {
    goodsQuantity: 'goodsQuantity',
    goodsPlaceQuantity: 'goodsPlaceQuantity',
    goodsDeliveryQuantity: 'goodsDeliveryQuantity',
    goodsInboundQuantity: 'goodsInboundQuantity'
  },
  2: {
    purchasedGoodsQuantity: 'purchasedGoodsQuantity',
    goodsDeliveryQuantity: 'goodsDeliveryQuantity',
    goodsInboundQuantity: 'goodsInboundQuantity',
    remainingDeliveryQuantity: 'remainingDeliveryQuantity'
  },
  3: {
    purchasedGoodsQuantity: 'purchasedGoodsQuantity',
    goodsDeliveryQuantity: 'goodsDeliveryQuantity',
    goodsInboundQuantity: 'goodsInboundQuantity',
    remainingDeliveryQuantity: 'remainingDeliveryQuantity'
  }
}

async function fetchDataByType(): Promise<FetchResult> {
  const { type, rowData } = props
  const params: ApiParams = { ...queryParams.value }
  let apiCall: () => Promise<any>
  switch (type) {
    case 1:
      params.scPurchaseRequestOrderId = rowData.id || ''
      apiCall = () => getCheckInfo(params)
      break

    case 2:
      params.scPurchaseOrderId = rowData.id || ''
      apiCall = () => getScPurchaseDetailApi(params)
      break
    case 3:
      params.scPurchaseOrderId = rowData.id || ''
      apiCall = () =>
        scPurchaseOrderQuerySnapshotByIdApi({ skuQuery: params.sku, id: params.scPurchaseOrderId })
      break

    default:
      throw new Error(`不支持的类型: ${type}`)
  }
  const response = await apiCall()
  const dataSource =
    type === 1
      ? response || []
      : response?.scPurchaseOrderDetailList || response?.detailSnapshotVos || []
  if (type === 2 || type === 3) {
    stopLoading.value = dataSource.map(() => false)
  }

  return {
    dataSource,
    sumFields: sumFieldsMap[type],
    response
  }
}

async function open() {
  isShow.value = true
  formData.value = props.rowData
  await nextTick()
  formRef.value?.remoteMethod()
  getDetail()
}

function handleClosed() {
  maxRowNum.value = 100
  allData.value = []
  queryParams.value = {}
}

function handleQuery() {
  getDetail()
}

function resetQuery() {
  queryParamsRef.value?.resetFields()
  getDetail()
}

async function handleExport() {
  try {
    exportLoading.value = true
    const res = await exportScPurchaseRequestOrderDetail({
      scPurchaseRequestOrderId: props.rowData.id,
      scPurchaseRequestOrderNo: props.rowData.scPurchaseRequestOrderNo
    })
    if (res) {
      const fileName = `采购需求明细导出_${formatDate(new Date(), 'YYYYMMDDHHmmss')}.xlsx`
      download.excel(res, fileName)
      message.success('导出成功！')
    }
  } catch (error) {
  } finally {
    exportLoading.value = false
  }
}

async function handlePause(row, type: '0' | '10', index: number) {
  await message.confirm(`确定${type === '0' ? '重启' : '暂停'}当前货品吗？`)

  stopLoading.value[index] = true
  try {
    const res = await stopDelivery({
      poDetailId: row.id,
      type
    })
    if (res.success) {
      message.success(type === '0' ? '重启成功' : '暂停成功')
      getDetail()
    }
  } catch (error) {
  } finally {
    stopLoading.value[index] = false
  }
}

async function handleQuicklyPause(type: '0' | '10') {
  loading.value = true

  await message.confirm(`确定${type === '0' ? '重启' : '暂停'}全部货品吗？`)

  try {
    const result = await Promise.all(
      tableData.value.map(async (row) => {
        if (!row.id || row.detailStatus === type) return { success: true }
        return await stopDelivery({
          poDetailId: row.id,
          type
        })
      })
    )

    if (result.every((ele) => ele.success)) {
      await getDetail()
      message.success(type === '0' ? '重启成功' : '暂停成功')
    }
  } catch (error) {
  } finally {
    loading.value = false
  }
}

function rowClassName({ row }) {
  return row.detailStatus === '0' ? '' : 'isStop'
}

function rowStyle({ row, rowIndex }) {
  return row.detailStatus === '0' || !rowIndex || props.type === 1
    ? { backgroundColor: '#fff' }
    : {
        backgroundColor: '#f4f4f4'
      }
}

function summaryMethod(param) {
  const noShowSummaryColumns = [
    'imgUrl',
    'goodsCode',
    'goodsName',
    'sku',
    'formName',
    'formCode',
    'estimatePrice',
    'iterateCode',
    'orderItemTime',
    'firstOrderTime',
    'expectedArrivalTime',
    'baseProdCost',
    'fgCost',
    'orderArrivalTime',
    'orderItemTime',
    'supplierName',
    'firstBatchTime'
  ]

  const averageColumns = [
    'sevenTurnover',
    'turnoverDays',
    'fourteenTurnover',
    'thirtyTurnover',
    'turnoverDaysAfterRestocking'
  ]

  const { columns } = param
  const sums: (string | VNode)[] = []
  columns.forEach((column, index) => {
    if (noShowSummaryColumns.includes(column.rawColumnKey) || column.label === '操作') {
      return (sums[index] = '')
    } else if (index === 0) {
      return (sums[index] = '合计')
    } else {
      const values = tableData.value.map((row) => Number(row[column.rawColumnKey]))

      const num = values.reduce((pre, cur) => pre + (cur || 0), 0)
      const result = String(
        Math.round(
          averageColumns.includes(column.rawColumnKey) ? num / tableData.value.length : num
        )
      )

      return (sums[index] = String(result))
    }
  })
  return sums
}

defineExpose({ open })
</script>

<style lang="less" scoped>
@import url(../../index.scss);

* {
  --el-table-header-text-color: #666;
  --el-text-color-regular: #333;
}

.drawer-wrapper {
  flex: 1;
  overflow: hidden;
  border-radius: 8px;
}

:deep(.el-drawer) {
  min-width: 500px;
  border-top-left-radius: 16px !important;
  border-bottom-left-radius: 16px !important;
  overflow: hidden !important;
}

.drawerTitle {
  font-size: 14px;
  display: flex;
  color: #333333;
  font-weight: 600;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin: 0 0 18px 0;
}

.drawerContent {
  flex: 1;
  overflow: scroll;
  border: 0;
  font-size: 14px;

  &::-webkit-scrollbar {
    display: none;
  }
}

:deep(.el-card) {
  margin-bottom: 24px;
  padding: 20px;
  border-radius: 8px;
  overflow: scroll;
  border: 0;

  &::-webkit-scrollbar {
    display: none;
  }

  .el-card__body {
    box-sizing: border-box;
    padding: 0;
  }

  .el-card__header {
    padding: 16px 20px;
  }

  .title {
    display: flex;
    align-items: center;
    font-size: 14px;
    line-height: 20px;

    &::before {
      content: '';
      display: block;
      width: 3px;
      height: 10px;
      margin-right: 6px;
      background-color: rgb(0, 100, 255);
    }
  }

  .content {
    margin-bottom: 20px;

    .item {
      display: flex;

      .el-form-item {
        flex: 1;
        margin: 0;
        padding: 16px 20px;

        .el-form-item__label {
          margin-bottom: 10px;
          line-height: 20px;
        }

        .isDisabled {
          cursor: text;

          .el-input__wrapper {
            border: none !important;
            box-shadow: none !important;
            background: #e8e9ed8c;

            .el-input__inner {
              color: #333333 !important;

              &::placeholder {
                display: none;
              }
            }
          }
        }
      }
    }
  }
}

.baseInfo {
  min-height: 288px;
}

.postInfo {
  min-height: 211px;
}

.btns {
  :deep(.el-form-item__content) {
    flex-direction: row-reverse;

    .el-button {
      margin-left: 16px;
    }
  }
}

:deep(.el-form-item) {
  margin: 2px 0 14px 0;

  .el-form-item__content {
    flex-wrap: nowrap;
  }

  .el-input__suffix {
    width: 20px;
  }
}

.endTimePicker {
  margin-left: 4px;

  :deep(label) {
    display: none;
  }
}

.store {
  display: flex;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:deep(.is-disabled),
.disabled {
  color: #cdcdcd !important;
}

.datePickers {
  :deep(.el-input__inner) {
    width: 70px;
  }
}

.footer {
  display: flex;
}

.userInfo {
  background: #f2f6fc;
}

:deep(.el-table-v2__header-cell) {
  --el-table-header-bg-color: #f2f6fc;
  height: '40px';
  padding-left: 15px;
  color: '#666';

  .el-table-v2__header-cell-text {
    font-size: 14px;
    font-weight: 400;
  }

  &:last-of-type {
    width: 116px !important;
  }
}

:deep(.el-table-v2__row-cell) {
  padding-left: 15px;

  div {
    max-width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    word-break: keep-all;
    word-wrap: normal;
  }
}

:deep(.el-table-v2__empty) {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
}

.isStop {
  background-color: #cdcdcd;
}

:deep(.el-divider) {
  width: calc(100% + 40px);
  margin: 20px -20px;
}
</style>

<style lang="less">
.drawer-footer {
  padding-bottom: 10px;
  box-shadow: 0px -4px 10px 0px rgba(0, 0, 0, 0.04);
  z-index: 999;
}
</style>
