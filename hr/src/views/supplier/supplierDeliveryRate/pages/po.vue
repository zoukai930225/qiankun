<template>
  <table-box v-bind="{ maxViewHeight: innerHeight - 50, thresholdValue: 0 }">
    <template #prePart>
      <!-- 筛选表单 -->
      <el-row :gutter="24">
        <el-col :span="20" class="!flex-1">
          <el-form :model="queryParams" ref="formRef" label-width="90">
            <el-row :gutter="14">
              <el-col :span="6">
                <el-form-item label="生产单号" prop="scPurchaseOrderNo">
                  <el-input
                    v-model="queryParams.scPurchaseOrderNo"
                    clearable
                    placeholder="请输入生产单号"
                    @keydown.enter="handleQuery"
                    @clear="handleQuery"
                  />
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item label="统计月份" prop="months">
                  <select-month
                    v-model="queryParams.months"
                    :clearable="false"
                    value-formate="YYYY-MM"
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
          <el-button
            v-if="permissionSet.has('SupplierDeliveryRate:Po:Export')"
            :loading="exportLoading"
            type="primary"
            @click="handleExport"
          >
            <Icon v-if="!exportLoading" icon="ep:download" />
            <span class="ml-2px">导出</span>
          </el-button>
        </el-col>
      </el-row>
    </template>

    <template #default>
      <!-- 表格 -->
      <special-table :data="tableData" :options="tableOptions" :loading="loading">
        <template v-for="slotName in autoColumns" :key="slotName" #[slotName]>
          <el-table-column v-for="item in SUB_COLUMNS" :key="item.prop" v-bind="item">
            <template #header="{ column }">
              <div class="flex items-center">
                <span>{{ column.label }}</span>
                <filter-popper
                  v-if="autoColumns.length === 1"
                  v-model:query-params="queryParams"
                  :slot-name="`${item.prop}Query`"
                  :precision="PRECISIONS[item.prop]"
                  @handle-query="handleQuery"
                />
                <el-tooltip
                  v-if="item.prop === 'deliveryRate'"
                  content="交付率：统计月份内 已发货数量 / 本月应发 * 100%"
                  placement="top"
                >
                  <Icon icon="bi:question-circle" class="ml-4px" :size="12" color="#666" />
                </el-tooltip>
              </div>
            </template>
            <template #default="{ row }">
              <div class="py10px">{{ item.transform?.(row[slotName]?.[item.prop]) }}</div>
            </template>
          </el-table-column>
        </template>
      </special-table>

      <Pagination
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </template>
  </table-box>
</template>
<script lang="ts" setup>
import { useSupplierProduct } from '@/store/modules/supplier'
import specialTable from '@/views/supplier/components/table.vue'
import { PRECISIONS, SORT_COLUMN } from '../options'
import filterPopper from '@/views/supplier/ledger/components/filterPopper.vue'
import { exportDeliveryAnalysisPoApi, poDeliveryRateApi } from '@/api/supplier/supplierData'
import { formatDate } from '@/utils/formatTime'
import { FormInstance } from 'element-plus'
import download from '@/utils/download'
import selectMonth from '../../components/selectMonth.vue'
import tableBox from '../../components/tableBox.vue'
import { copyBtn } from '../../components/twoFourSix'
import { getPermission } from '@/utils'

defineOptions({ name: 'SupplierDeliveryRate' })

const productInfoData = useSupplierProduct()
const permissionSet = new Set(getPermission())

const props = defineProps<{
  innerHeight: number
}>()

const queryParams = ref({
  scPurchaseOrderNo: '' as string | undefined,
  months: (() => {
    const today = new Date()
    today.setMonth(today.getMonth() - 1)
    return formatDate(today, 'YYYY-MM')
  })(),
  pageNum: 1,
  pageSize: 10,
  ...Object.fromEntries(SORT_COLUMN.map((ele) => [`${ele}Query`, { sort: undefined }]))
})
const total = ref(0)
const tableData = ref<Record<string, any>[]>([])
const formRef = ref<FormInstance>()

function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}
function resetQuery() {
  Object.assign(
    queryParams.value,
    Object.fromEntries(Object.keys(queryParams.value).map((key) => [key, undefined])),
    {
      pageNum: 1,
      pageSize: 10,
      ...Object.fromEntries(SORT_COLUMN.map((ele) => [`${ele}Query`, { sort: undefined }]))
    }
  )
  formRef.value?.resetFields()
  getList()
}

/**获取动态列 */
const autoColumns = computed(() => {
  const autoColumnsSet = new Set(tableData.value.map((ele) => Object.keys(ele)).flat())
  autoColumnsSet.delete('scPurchaseOrderNo')
  return Array.from(autoColumnsSet)
})
const tableOptions = computed<TableOption>(() => {
  return [
    { type: 'index', label: '序号', width: 60, fixed: 'left' },
    {
      label: '生产单号',
      prop: 'scPurchaseOrderNo',
      minWidth: 150,
      fixed: 'left',
      formatter: copyBtn
    },
    ...autoColumns.value.map((month) => ({
      label: month,
      prop: month,
      align: 'center'
    }))
  ] as TableOption
})

/**动态列子列的配置 */
const SUB_COLUMNS = [
  {
    label: '采购数量',
    prop: 'purchasedGoodsQuantity',
    slotName: 'requestQuantity',
    minWidth: 130,
    transform: (col) => (col === 0 || col ? Intl.NumberFormat().format(col) : '--')
  },
  {
    label: '本月应发',
    prop: 'toShipQuantity',
    slotName: 'toShipQuantity',
    minWidth: 130,
    transform: (col) => (col === 0 || col ? Intl.NumberFormat().format(col) : '--')
  },
  {
    label: '已发货数量',
    prop: 'deliveryQuantity',
    slotName: 'deliveryQuantity',
    minWidth: 130,
    transform: (col) => (col === 0 || col ? Intl.NumberFormat().format(col) : '--')
  },
  {
    label: '交付率',
    prop: 'deliveryRate',
    minWidth: 130,
    headertip: '统计月份内供应商所有生产订单的交付平均值',
    transform: (col) => (col ? `${col}%` : '--')
  },
  {
    label: '交付天数',
    prop: 'deliveryDays',
    minWidth: 110,
    transform: (col) => (col === 0 || col ? Intl.NumberFormat().format(col) : '--')
  }
]

const loading = ref(false)
const timer = ref<NodeJS.Timeout | null>(null)
function getList() {
  loading.value = true
  timer.value && clearTimeout(timer.value)

  timer.value = setTimeout(async () => {
    try {
      const res = await poDeliveryRateApi(queryParams.value)
      tableData.value = res.records
      total.value = res.total
    } catch (error) {
    } finally {
      loading.value = false
      timer.value && clearTimeout(timer.value)
    }
  }, 1000)
}

const exportLoading = ref(false)
async function handleExport() {
  exportLoading.value = true
  let fileName = `生产订单交付率-${formatDate(new Date(), 'YYYYMMDDHHmmss')}.xlsx`

  try {
    const res = await exportDeliveryAnalysisPoApi({
      ...queryParams.value,
      maxSize: total.value
    })
    download.excel(res, fileName)
  } catch (error) {
  } finally {
    exportLoading.value = false
  }
}

onBeforeMount(() => {
  productInfoData.getSupplierList()
  const today = new Date()
  // 重置当前的day为1，避免直接setMonth的31号溢出
  const lastMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1)
  queryParams.value.months = formatDate(lastMonthDate, 'YYYY-MM')
})
defineExpose({ getList })
</script>
<style lang="less" scoped>
@import url(../../index.scss);

:deep(.el-select) {
  .el-select__suffix {
    display: none;
  }
}
</style>
