<template>
  <table-box v-bind="{ maxViewHeight: innerHeight - 50, thresholdValue: 0 }">
    <template #prePart>
      <el-row :gutter="24">
        <el-col :span="20" class="!flex-1">
          <el-form :model="queryParams" ref="queryFormRef" :label-width="90">
            <el-row :gutter="24" :style="{ maxWidth: '1340px' }">
              <el-col :span="6">
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
              <el-col :span="6">
                <el-form-item prop="skuQuery" label-width="20">
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
                <el-form-item label="需求单号:" prop="scPurchaseRequestOrderNo">
                  <el-input
                    v-model.trim="queryParams.scPurchaseRequestOrderNo"
                    placeholder="请输入需求单号"
                    clearable
                    @keydown.enter="handleQuery"
                    @clear="handleQuery"
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
                      v-for="item in auditSelectStatusOps"
                      :key="item.value"
                      :value="item.value"
                      :label="item.label"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-col>

        <el-col :span="4" class="!flex justify-end min-w-284px">
          <el-button @click="handleQuery" class="commonSearchBtn">
            <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
            搜索
          </el-button>
          <el-button @click="resetQuery" class="commonResetBtn" :style="{ marginLeft: '0px' }">
            重置
          </el-button>
        </el-col>
      </el-row>

      <el-divider class="!mt-0 !mb-20px" />

      <el-form :inline="true" class="scheme-operate-form">
        <el-form-item label="审核状态:">
          <el-radio-group v-model="queryParams.auditStatus" @change="handleQuery">
            <el-badge
              v-for="item in AUDIT_STATUS"
              :key="item.value"
              :value="summary[item.sumKey]"
              :offset="[-22, 0]"
              color="#EB3737"
              badge-class="!h-14px ml-14px"
            >
              <el-radio class="!mr-14px" v-bind="item" border />
            </el-badge>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </template>
    <sw-table
      ref="swTableRef"
      :data="tableData"
      :options="queryParams.auditStatus === '2' ? allAuditTable : auditTable"
      :loading="loading"
      :show-overflow-tooltip="true"
      :cell-class-name="cellClassName"
      row-key="id"
      :btns-options="btnsOptions"
      :loading-btns="['撤回', '催办']"
      @select="handleTableSelected"
      @cell-click="handleCellClick"
    >
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
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.size"
        @pagination="getList"
      />
    </div>
  </table-box>

  <detail-drawer v-bind="rowData" ref="detailDrawerRef" :type="2" />

  <upload-dialog
    ref="uploadDialogRef"
    :show-upload-type="false"
    :upload-api="uploadPrFile"
    file-url="https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/supplyChain/1a8420f8-c359-46f8-8895-2c0d2c299d38.xlsx"
    @success="handleQuery"
  />

  <!-- 审核记录 -->
  <auditLogDrawer
    ref="auditLogDrawerRef"
    :api="queryReviewLogApi"
    time-key="endTime"
    status-key="approvalStatus"
    person-key="assigneePerson"
    comment-key="comment"
    descKey="taskName"
    :desc="getDesc"
    :is-no-pass="(status) => status === 0"
    :is-pass="(status) => status === 1"
    :is-recall="(status) => status === 2"
  />
</template>
<script lang="ts" setup>
import {
  allAuditTable,
  AUDIT_STATUS,
  auditSelectStatusOps,
  auditTable,
  goodsQuantityTotalTable
} from '../options'
import SwTable from '../../components/table.vue'
import {
  approvalPageQueryByUserApi,
  getAllApprovalPageQuery,
  getCheckInfo,
  getProductProgressIds,
  queryReviewLogApi,
  remindPurchaseRequestOrderApi,
  uploadPrFile
} from '@/api/supplier/purchase'
import { Column } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import DetailDrawer from '../components/detailDrawer.vue'
import { toReactive } from '@vueuse/core'
import { AuditBtn } from '../../changeAudit/option'
import auditLogDrawer from '@/views/supplier/appointment/components/auditLogDrawer.vue'
import { getDictOptions, DICT_TYPE } from '@/utils/dict'
const PopoverCell = defineAsyncComponent(() => import('../../components/popoverDetail.vue'))
const UploadDialog = defineAsyncComponent(() => import('../components/uploadDialog.vue'))
import skuGoodsNoSelect from '../../components/sku&goodsNoSelect.vue'
import tableBox from '../../components/tableBox.vue'
import CommentDrawer from '../../components/comment'

const router = useRouter()
const route = useRoute()
const message = useMessage()

const props = withDefaults(
  defineProps<{
    innerHeight?: number
  }>(),
  {
    innerHeight: 0
  }
)

const queryParams = reactive<Supplier.Purchase.ScPrApprovalPageQuery>({
  pageNum: 1,
  size: 10,
  auditStatus: (route.query?.infoType as string) || '0'
})
const loading = ref(false)
const total = ref(0)
const tableData = ref<Supplier.Purchase.ScPrApprovalVO[]>([])
const selectedRows = ref<typeof tableData.value>([])
const swTableRef = ref()
const rowData = ref<Supplier.Purchase.ScPrApprovalVO>({})
const detailDrawerRef = ref()
const isShowPoDrawer = ref(false)
const currentPoDrawerType = ref('')
const openDrawerType = ref<'click' | 'popover'>('click')
const summary = ref({
  goodsQuantityTotal: 0,
  approvedTotal: 0,
  pendingApprovalTotal: 0
})
const summaryItems = [{ label: '总补单量', prop: 'goodsQuantityTotal' }]
const auditLogDrawerRef = ref()

const requestSourceOption = computed(() => getDictOptions(DICT_TYPE.SC_PR_REQUEST_SOURCE))

enum BTNS_KEY {
  /**查看 */ CHECK,
  /**评论 */ COMMENT,
  /**催办 */ PRESS,
  /**审核 */ AUDIT,
  /**查看日志 */ LOG,
  /**查款源数据 */ ORIGIN_DATA
}

const BTNS_CONFIG: Record<
  BTNS_KEY,
  [string, (...arg: any[]) => any, Omit<AuditBtn, 'label' | 'method'>]
> = {
  [BTNS_KEY.CHECK]: ['查看', handleCheck, { permission: 'SupplierPurchase:audit:Check' }],
  [BTNS_KEY.COMMENT]: [
    '评论',
    (row) => CommentDrawer.open(row),
    { permission: 'SupplierPurchase:audit:Comment' }
  ],
  [BTNS_KEY.PRESS]: ['催办', handlePress, { permission: 'SupplierPurchase:audit:Press' }],
  [BTNS_KEY.AUDIT]: ['审核', handleAudit, { permission: 'SupplierPurchase:audit:Audit' }],
  [BTNS_KEY.LOG]: ['查看日志', handleCheckLog, { permission: 'SupplierPurchase:audit:CheckLog' }],
  [BTNS_KEY.ORIGIN_DATA]: [
    '查款源数据',
    handleCheckOriginData,
    { permission: 'SupplierPurchase:audit:CheckOrigin' }
  ]
}

/** 计算按钮配置 */
const btnsOptions = computed(() =>
  tableData.value.map(({ requestSource, reviewer }) => {
    const tableBtnKeys = new Set([BTNS_KEY.CHECK, BTNS_KEY.LOG, BTNS_KEY.COMMENT])
    if (queryParams.auditStatus === '0') tableBtnKeys.add(BTNS_KEY.AUDIT)
    else if (reviewer?.length) tableBtnKeys.add(BTNS_KEY.PRESS)
    if (['2', '5'].includes(requestSource!)) tableBtnKeys.add(BTNS_KEY.ORIGIN_DATA)
    const tableBtns = Array.from(tableBtnKeys)
      .sort((a, b) => a - b)
      .map((ele) => new AuditBtn(...BTNS_CONFIG[ele]))
    return toReactive(tableBtns)
  })
)

const queryStatus = computed({
  get: () => (queryParams.status ? queryParams.status?.split(',') : undefined),
  set: (val) => {
    queryParams.status = val && val.length ? val?.join(',') : undefined
  }
})

/** 根据考核状态分配分页api */
const getListApi = computed(
  () =>
    ({
      0: approvalPageQueryByUserApi,
      1: approvalPageQueryByUserApi,
      2: getAllApprovalPageQuery
    })[queryParams.auditStatus as '0' | '1' | '2']
)

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

// 监听表格数据变化，恢复选中状态
watch(tableData, async () => {
  await nextTick()
  tableData.value.forEach((row) => {
    if (selectedRows.value.some((selectedRow) => selectedRow.id === row.id)) {
      swTableRef.value.toggleRowSelection(row, true)
    }
  })
})

/* 查看日志 */
function handleCheckLog(row) {
  auditLogDrawerRef.value?.open(row.id)
}
function handleAudit(row) {
  router.push({
    name: 'PurchaseAudit',
    params: { id: row.id },
    query: { tab: 2 }
  })
}

let timer: NodeJS.Timeout | null
const getListTime = ref(0)
function getList() {
  if (timer !== null) {
    clearTimeout(timer)
    timer = null
  }
  loading.value = true
  const time = getListTime.value
  timer = setTimeout(async () => {
    getListTime.value = 1000
    try {
      const res = await getListApi.value(queryParams)
      tableData.value = res.records
      summary.value = res.extras.summary
      total.value = res.total
    } catch (error) {
    } finally {
      loading.value = false
      getListTime.value = 0
      if (timer) clearTimeout(timer)
    }
  }, time)
}

async function handleQuery() {
  queryParams.pageNum = 1
  selectedRows.value = []
  getList()
}

async function resetQuery() {
  selectedRows.value = []
  Object.assign(
    queryParams,
    Object.fromEntries(Object.entries(queryParams).map(([key]) => [key, undefined])),
    { pageNum: 1, size: 10, auditStatus: '0' }
  )
  getList()
}

function getDesc(status, desc) {
  switch (status) {
    case 0:
      return desc + '不通过'
    case 1:
      return desc + '通过'
    case 2:
      return '撤回'
    default:
      return ''
  }
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

onUnmounted(() => {
  if (timer) clearTimeout(timer)
})

defineExpose({
  handleQuery
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
