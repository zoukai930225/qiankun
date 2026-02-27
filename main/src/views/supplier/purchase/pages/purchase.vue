<template>
  <table-box v-bind="{ thresholdValue: 0, maxViewHeight: innerHeight - 50 }">
    <template #prePart>
      <el-row ref="searchRef" :gutter="0">
        <el-col :span="20" class="!flex-1">
          <el-form :model="queryParams" ref="queryFormRef" :label-width="90">
            <el-row :gutter="24" :style="{ maxWidth: '1340px' }">
              <el-col :span="6">
                <el-form-item label="需求单号:" prop="scPurchaseRequestOrderNo">
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

          <el-button @click="isMore = !isMore" type="primary" link class="ml12px !h-32px">
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
      :cell-class-name="cellClassName"
      row-key="id"
      :btns-options="btnsOptions"
      :loading-btns="['撤回', '提交', '结单', '订单日志', '催办', '取消结单']"
      @select="handleTableSelected"
      @cell-click="handleCellClick"
    >
      <!-- 已下单 -->
      <template #goodsPlaceQuantityTotal="{ col, row }">
        <popover-cell
          :reference="col"
          :row-data="row"
          :pr-id="row.id"
          :api="getScPoPageDetail"
          :option="popoverTable"
          title="采购数量明细"
          @show-more="handleShowMore(row, '已下单')"
        />
      </template>

      <!-- 已发货 -->
      <template #goodsDeliveryQuantityTotal="{ col, row }">
        <popover-cell
          :reference="col"
          :row-data="row"
          :pr-id="row.id"
          :api="getScASRPageDetail"
          :option="ASRPopoverTable"
          title="预约发货单"
          @show-more="handleShowMore(row, '已发货')"
        />
      </template>

      <!-- 已入库 -->
      <template #finishGoodsQuantityTotalNum="{ col, row }">
        <popover-cell
          :reference="col"
          :row-data="row"
          :pr-id="row.id"
          :api="getScStockInPageDetail"
          :option="StockinPopoverTable"
          title="入库单"
          @show-more="handleShowMore(row, '已入库')"
        />
      </template>

      <!-- 补单量 -->
      <template #goodsQuantityTotal="{ col, row }">
        <popover-cell
          :reference="col"
          :row-data="row"
          :api="getCheckInfo"
          :option="goodsQuantityTotalTable"
          is-not-page-api
          :pr-id="row.id"
          title="需求单"
          @show-more="handleCheck(row)"
        />
      </template>
    </sw-table>

    <div class="w100% mt16px flex justify-between">
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

  <detail-drawer v-bind="rowData" ref="detailDrawerRef" />

  <po-drawer
    ref="poDrawerRef"
    v-model:model-value="isShowPoDrawer"
    :pr-id="rowData.id"
    :title="poDrawerTableOptions.title"
    :table-options="poDrawerTableOptions.option"
    :api="poDrawerTableOptions.api"
    :type="poDrawerTableOptions.type"
    :open-type="openDrawerType"
    :is-not-page="isNotPageDetail"
    :width="poDrawerTableOptions.width"
  />

  <upload-dialog
    ref="uploadDialogRef"
    :show-upload-type="false"
    :upload-api="uploadPrFile"
    file-url="https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/supplyChain/1a8420f8-c359-46f8-8895-2c0d2c299d38.xlsx"
    @success="handleQuery"
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

  <!-- 评论 -->
</template>
<script lang="tsx" setup>
import {
  ASRPopoverTable,
  ASRTable,
  detailTable,
  goodsQuantityTotalTable,
  popoverTable,
  PoTable,
  purchaseTable,
  RKTable,
  statusOps,
  StockinPopoverTable
} from '../options'
import SwTable from '../../components/table.vue'
import {
  deleteInfo,
  exportInfo,
  getCheckInfo,
  getPurchaseList,
  getScASRPage,
  getScASRPageDetail,
  getScPoPage,
  getScPoPageDetail,
  getScStockInPage,
  getScStockInPageDetail,
  scPurchaseRequestOrderRevokeApi,
  submitPurchase,
  uploadPrFile,
  queryListByBusinessIdApi,
  getProductProgressIds,
  remindPurchaseRequestOrderApi,
  cancelPROverApi
} from '@/api/supplier/purchase'
import { Column } from 'element-plus'
import download from '@/utils/download'
import { cloneDeep } from 'lodash-es'
import DetailDrawer from '../components/detailDrawer.vue'
import { formatDate } from '@/utils/formatTime'
import { toReactive } from '@vueuse/core'
import { AuditBtn } from '../../changeAudit/option'
const PoDrawer = defineAsyncComponent(() => import('../../components/PoDrawer.vue'))
const PopoverCell = defineAsyncComponent(() => import('../../components/popoverDetail.vue'))
const UploadDialog = defineAsyncComponent(() => import('../components/uploadDialog.vue'))
import auditLogDrawer from '@/views/supplier/appointment/components/auditLogDrawer.vue'
import { getDictOptions, DICT_TYPE } from '@/utils/dict'
import skuGoodsNoSelect from '../../components/sku&goodsNoSelect.vue'
import specialDropdown from '../../components/specialDropdown.vue'
import Icon from '@/components/Icon/src/Icon.vue'
import tableBox from '../../components/tableBox.vue'
import CommentDrawer from '../../components/comment'

defineOptions({ name: 'SupplierPurchaseIndex' })

const props = withDefaults(defineProps<{ innerHeight?: number }>(), { innerHeight: 0 })

const router = useRouter()
const route = useRoute()
const message = useMessage()

const poDrawerRef = ref()
const queryParams = reactive<Supplier.Purchase.GetListParams>({
  page: 1,
  size: 10,
  sourceBusinessId: route.params.sourceBusinessId
})
const loading = ref(false)
const total = ref(0)
const tableData = ref<Supplier.Purchase.ListItem[]>([])
const selectedRows = ref<Supplier.Purchase.ListItem[]>([])
const swTableRef = ref<InstanceType<typeof SwTable>>()
const rowData = ref<Supplier.Purchase.ListItem>({})
const detailDrawerRef = ref()
const isShowPoDrawer = ref(false)
const currentPoDrawerType = ref('')
const openDrawerType = ref<'click' | 'popover'>('click')
const isNotPageDetail = ref(false)
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
const uploadDialogRef = ref()
const auditLogDrawerRef = ref<InstanceType<typeof auditLogDrawer>>()
const isMore = ref(false)

const requestSourceOption = computed(() => getDictOptions(DICT_TYPE.SC_PR_REQUEST_SOURCE))
const isProgress = computed(() => route.name === 'SupplierPurchaseApplicationProgress')

const btnOps = computed(() => {
  const origin = [
    {
      label: '新增',
      option: () => {
        router.push({ name: 'PurchaseAdd' })
      },
      permission: 'SupplierPurchase:Index:Add',
      icon: () => <Icon icon="ep:plus" />
    },
    {
      label: '导入',
      option: handleImport,
      permission: 'SupplierPurchase:Index:Import',
      icon: () => <Icon icon="ep:upload" />
    },
    {
      label: '导出',
      option: handleExport,
      permission: 'SupplierPurchase:Index:Export',
      icon: () => <Icon icon="ep:download" />
    },
    {
      label: '合并货品设置',
      option: handleMergeProduct,
      permission: 'SupplierPurchase:Index:MergeProduct'
    }
  ]

  return isProgress.value ? [origin[2]] : [...origin]
})

/** 按钮排列次序 */
enum buttonPriority {
  '查看',
  '评论',
  '编辑',
  '提交',
  '催办',
  '删除',
  '撤回',
  '结单',
  '取消结单',
  '查看源数据',
  '订单日志'
}

const queryStatus = computed({
  get: () => (queryParams.status ? queryParams.status?.split(',') : undefined),
  set: (val) => {
    queryParams.status = val && val.length ? val?.join(',') : undefined
  }
})

/** 计算按钮配置 */
const btnsOptions = computed(() => {
  return tableData.value.map(({ status, requestSource }) => {
    const hideBtns: AuditBtn[] = [
      new AuditBtn('查看', handleCheck, { permission: 'SupplierPurchase:Index:Check' }),
      new AuditBtn('评论', handleComment, { permission: 'SupplierPurchase:Index:Comment' }),
      new AuditBtn('订单日志', handleCheckOrderLog, {
        permission: 'SupplierPurchase:Index:OrderLog'
      })
    ]

    if (isProgress.value) return toReactive(hideBtns)

    switch (status) {
      case '0':
      case '7':
        hideBtns.push(
          new AuditBtn('编辑', handleEdit, { permission: 'SupplierPurchase:Index:Edit' }),
          new AuditBtn('提交', handleSubmitRow, { permission: 'SupplierPurchase:Index:Submit' }),
          new AuditBtn('删除', handleDeleteRow, {
            type: 'danger',
            permission: 'SupplierPurchase:Index:Delete'
          })
        )
        break
      case '20':
      case '10':
        hideBtns.push(
          new AuditBtn('结单', handleFinishRow, { permission: 'SupplierPurchase:Index:Over' }),
          new AuditBtn('撤回', handleRecall, {
            type: 'danger',
            permission: 'SupplierPurchase:Index:recall'
          })
        )
        break
      case '4':
        hideBtns.push(
          new AuditBtn('撤回', handleRecall, {
            type: 'danger',
            permission: 'SupplierPurchase:Index:recall'
          }),
          new AuditBtn('催办', handlePress, { permission: 'SupplierPurchase:Index:Press' })
        )
        break
      case '40':
        hideBtns.push(
          new AuditBtn('取消结单', handleCancelOver, {
            permission: 'SupplierPurchase:Purchase:CancelOver'
          })
        )
        break
    }

    if (['2', '5'].includes(requestSource)) {
      hideBtns.push(
        new AuditBtn('查看源数据', handleCheckOriginData, {
          permission: 'SupplierPurchase:Index:CheckOrigin'
        })
      )
    }
    return toReactive(
      hideBtns.sort((a, b) => {
        const priorityA = buttonPriority[a.label]
        const priorityB = buttonPriority[b.label]
        return priorityA - priorityB
      })
    )
  })
})

const poDrawerTableOptions = computed(() => {
  let option: TableOption = []
  let api: (params: any) => Promise<any> | any = () => {}
  let title = ''
  let type: '1' | '2' | '3' | '4' = '1'
  let width: number | string = 1085

  switch (currentPoDrawerType.value) {
    case '已下单':
      option = PoTable
      api = getScPoPage
      title = `采购生产订单 (${rowData.value.scPurchaseRequestOrderName})`
      type = '1'
      width = 1350
      break
    case '已发货':
      option = ASRTable
      api = getScASRPage
      title = `预约发货单 (${rowData.value.scPurchaseRequestOrderName})`
      type = '2'
      width = 1450
      break
    case '已入库':
      option = RKTable
      api = getScStockInPage
      title = `入库单 (${rowData.value.scPurchaseRequestOrderName})`
      type = '3'
      width = 1250
      break
    case '补单量':
      option = detailTable
      api = getCheckInfo
      title = `采购需求单 (${rowData.value.scPurchaseRequestOrderName})`
      type = '4'
      width = '75%'
      break
  }
  return { option, api, title, type, width }
})

// 监听表格数据变化，恢复选中状态
watch(tableData, async () => {
  await nextTick()
  tableData.value.forEach((row) => {
    if (selectedRows.value.some((selectedRow) => selectedRow.id === row.id)) {
      swTableRef.value?.toggleRowSelection(row, true)
    }
  })
})

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

let timer: NodeJS.Timeout | null
function getList() {
  if (timer !== null) {
    clearTimeout(timer)
    timer = null
  }
  loading.value = true
  timer = setTimeout(async () => {
    try {
      const res = await getPurchaseList(queryParams)
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
  queryParams.page = 1
  selectedRows.value = []
  getList()
}

async function resetQuery() {
  selectedRows.value = []
  Object.assign(
    queryParams,
    Object.fromEntries(Object.entries(queryParams).map(([key]) => [key, undefined])),
    { page: 1, size: 10 }
  )
  getList()
}

function handleTableSelected(
  selection: typeof selectedRows.value,
  item?: Supplier.Purchase.ListItem
) {
  if (item) {
    const currentSelection = swTableRef.value?.getSelectionRows()
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

function handleImport() {
  uploadDialogRef.value?.open()
}

async function handleExport() {
  const ids: string[] = selectedRows.value.map((item) => item.id || '')
  try {
    const res = await exportInfo({ ...queryParams, idList: ids })
    if (res) {
      const fileName: string = `采购需求单导出-${formatDate(new Date(), 'YYYYMMDDHHmmss')}.xlsx`
      download.excel(res, fileName)
      message.success('导出成功')
    }
  } catch (error) {
    console.log(error)
  }
}

function handleMergeProduct() {
  router.push({
    name: 'PurchaseMergeProduct'
  })
}

async function handleDeleteRow(row: Supplier.Purchase.ListItem) {
  await message.confirm('确定删除该需求单吗？')
  try {
    const res = await deleteInfo({ id: row.id || '' })
    if (res.success) {
      message.success('删除成功')
      handleQuery()
    }
  } catch (error) {}
}

async function handleSubmitRow(row: Supplier.Purchase.ListItem) {
  await message.confirm('确定提交该需求单吗？')
  try {
    const res = await submitPurchase({
      id: row.id || '',
      type: '1'
    })
    if (res && res.success) {
      message.success('提交成功')
      handleQuery()
    }
  } catch (error) {}
}

async function handlePress(row: Supplier.Purchase.ListItem) {
  await message.confirm(
    `确认向${row.reviewer.map((ele) => `【${ele.name}】`).join('')}催促审核吗？`
  )
  try {
    const res = await remindPurchaseRequestOrderApi(row.id)
    if (res.success) {
      message.success('催办消息已发出！')
    }
  } catch (error) {}
}

async function handleFinishRow(row: Supplier.Purchase.ListItem) {
  await message.confirm('确定结单吗？结单后跟单将无法继续采购该需求单')
  try {
    const res = await submitPurchase({
      id: row.id || '',
      type: '4'
    })
    if (res && res.success) {
      message.success('结单成功')
      getList()
    }
  } catch (error) {}
}

async function handleCancelOver(row: Supplier.Purchase.ListItem) {
  await message.confirm('确定要取消结单吗？')
  try {
    const res = await cancelPROverApi({ id: row.id! })

    if (res && res.success) {
      message.success('取消结单成功！')
      getList()
    }
  } catch (error) {}
}

function handleEdit(row: Supplier.Purchase.ListItem) {
  router.push({
    name: 'PurchaseEdit',
    params: {
      id: row.id
    },
    query: {
      status: row.status || '0',
      PrNo: row.scPurchaseRequestOrderNo
    }
  })
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

function handleShowMore(row: any, type: string) {
  rowData.value = row
  currentPoDrawerType.value = type
  isShowPoDrawer.value = true
  poDrawerRef.value.autoOpenDetail()
  openDrawerType.value = 'popover'

  isNotPageDetail.value = ['补单量'].includes(type)
}

function handleComment(row) {
  CommentDrawer.open({ id: row.id })
}

async function handleRecall(row) {
  try {
    await message.confirm(`确定撤回 ${row.scPurchaseRequestOrderNo} 需求单吗？`)

    const res = await scPurchaseRequestOrderRevokeApi(row.id)

    if (res.success) {
      message.success('撤回成功')
      getList()
    }
  } catch (error) {}
}

function handleCheckOrderLog(row) {
  auditLogDrawerRef.value?.open(row.id)
}

onUnmounted(() => {
  if (timer) clearTimeout(timer)
})

defineExpose({
  handleQuery,
  handleCheck
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
