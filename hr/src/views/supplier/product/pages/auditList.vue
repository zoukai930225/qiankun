<template>
  <table-box v-bind="{ maxViewHeight: innerHeight - 140, thresholdValue: 0 }">
    <template #prePart>
      <search-form
        ref="searchFormRef"
        v-model:params="queryParams"
        :order-status-ops="auditSelectStatusOps"
        :exclude="['产前样时间']"
        @handle-query="handleQuery"
        @reset-query="resetQuery"
      />

      <el-divider class="!mt-0 !mb-20px" />

      <el-form :inline="true" class="scheme-operate-form">
        <el-form-item label="审核状态:">
          <el-radio-group v-model="queryParams.selectedStatus" @change="handleQuery">
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

    <template #default>
      <sw-table
        ref="swTableRef"
        :data="tableData"
        :options="queryParams.selectedStatus === '2' ? allAuditTable : auditTable"
        :loading="loading"
        :show-overflow-tooltip="true"
        :cell-class-name="cellClassName"
        :btns-options="btnsOptions"
        @select="handleTableSelected"
        @cell-click="handleCellClick"
      />

      <div class="w100% mt20px flex justify-end">
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
  <detail-drawer :row-data="rowData" ref="detailDrawerRef" :type="3" />

  <!-- 审核记录 -->
  <auditLogDrawer
    ref="auditLogDrawerRef"
    :api="scPurchaseOrderAuditLogApi"
    time-key="endTime"
    status-key="approvalStatus"
    person-key="assigneePerson"
    comment-key="comment"
    desc-key="taskName"
    :desc="getStatusDesc"
    :is-pass="(status) => status === 1"
    :is-recall="(status) => status === 2"
    :is-no-pass="(status) => status === 0"
  />
</template>
<script lang="ts" setup>
import { allAuditTable, AUDIT_STATUS, auditSelectStatusOps, auditTable } from '../options'
import SwTable from '../../components/table.vue'
import {
  scPurchaseOrderAuditLogApi,
  scPurchaseOrderPaginQueryAllAuditApi,
  scPurchaseOrderPaginQueryAudit
} from '@/api/supplier/purchase'
import { cloneDeep } from 'lodash-es'
import DetailDrawer from '../components/detailDrawer.vue'
import auditLogDrawer from '@/views/supplier/appointment/components/auditLogDrawer.vue'
import { AuditBtn } from '../../changeAudit/option'
import { toReactive } from '@vueuse/core'
import SearchForm from '../components/searchForm.vue'
import tableBox from '../../components/tableBox.vue'
import CommentDrawer from '../../components/comment'

const emit = defineEmits(['refresh'])

const router = useRouter()
const route = useRoute()

const queryParams = ref<Supplier.Purchase.GetListParams>({
  page: 1,
  size: 10,
  selectedStatus: route.query?.infoType || '0'
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
const summary = ref({
  alreadyAudit: 0,
  waitAudit: 0
})
const auditLogDrawerRef = ref()
const searchFormRef = ref<InstanceType<typeof SearchForm>>()

const props = withDefaults(
  defineProps<{
    innerHeight?: number
  }>(),
  { innerHeight: 0 }
)

/** 根据考核状态分配分页api */
const getListApi = computed(
  () =>
    ({
      0: scPurchaseOrderPaginQueryAudit,
      1: scPurchaseOrderPaginQueryAudit,
      2: scPurchaseOrderPaginQueryAllAuditApi
    })[queryParams.value.selectedStatus as '0' | '1' | '2']
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

/** 按钮排列次序 */
enum buttonPriority {
  '查看',
  '评论',
  '审核',
  '查看日志'
}

/** 计算按钮配置 */
const btnsOptions = computed<any>(() =>
  tableData.value.map(() => {
    const hideBtns: AuditBtn[] = [
      new AuditBtn('查看', handleCheck, { permission: 'SupplierProduct:audit:Check' }),
      new AuditBtn('评论', (row) => CommentDrawer.open(row), {
        permission: 'SupplierProduct:audit:Comment'
      }),
      new AuditBtn('查看日志', handleCheckLog, { permission: 'SupplierProduct:audit:CheckLog' })
    ]

    if (queryParams.value.selectedStatus === '0') {
      hideBtns.push(
        new AuditBtn('审核', handleAudit, { permission: 'SupplierProduct:audit:Audit' })
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
)
/* 查看日志 */
function handleCheckLog(row) {
  auditLogDrawerRef.value?.open(row.id)
}
function handleAudit(row) {
  router.push({
    name: 'PurchaseProductOrderAudit',
    params: { id: row.id },
    query: { tab: 3 }
  })
}

function getStatusDesc(status: any, desc?: string) {
  switch (status) {
    case 0:
      return desc + '不通过'
    case 1:
      return desc + '通过'
    case 2:
      return desc + '撤回'
    default:
      return ''
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
      const res = await getListApi.value(queryParams.value)
      tableData.value = res.records
      summary.value = res.extras
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

function handleCheck(row: Supplier.Purchase.ListItem) {
  detailDrawerRef.value.open()
  rowData.value = cloneDeep(row)
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

function cleartable() {
  tableData.value = []
}

defineExpose({ handleQuery, cleartable })

onBeforeMount(() => {
  getList()
})
</script>
<style lang="less" scoped>
@import url(../../index.scss);
</style>
