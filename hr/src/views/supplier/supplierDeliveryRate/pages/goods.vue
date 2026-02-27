<template>
  <table-box v-bind="{ maxViewHeight: innerHeight - 50, thresholdValue: 0 }">
    <template #prePart>
      <!-- 筛选表单 -->
      <el-row :gutter="24">
        <el-col :span="20" class="!flex-1">
          <el-form :model="queryParams" ref="formRef" label-width="90">
            <el-row :gutter="14">
              <el-col :span="6">
                <el-form-item label="货品编码" prop="goodsCodes">
                  <scroll-select
                    v-model="queryParams.goodsCodes"
                    :api="getInfoByGoodsCode"
                    select-key="goodsCode"
                    itemLabelKey="goodsCode"
                    itemValueKey="goodsCode"
                    clearable
                    @change="handleQuery"
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
            v-if="permissionSet.has('SupplierDeliveryRate:Goods:Export')"
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
            <template v-if="item.prop === 'deliveryRate'" #default="{ row }">
              <el-button link type="primary" @click="handleCheck(row, slotName)">
                {{ item.transform?.(row[slotName]?.[item.prop]) }}
              </el-button>
            </template>
            <template v-else #default="{ row }">{{
              item.transform?.(row[slotName]?.[item.prop])
            }}</template>
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

  <detail-drawer v-bind="{ ...detailDrawerProp }" v-model="detailDrawerProp.modelValue" />
</template>
<script lang="ts" setup>
import specialTable from '@/views/supplier/components/table.vue'
import { PRECISIONS, SORT_COLUMN } from '../options'
import filterPopper from '@/views/supplier/ledger/components/filterPopper.vue'
import { exportDeliveryAnalysisGoodsApi, goodsDeliveryRateApi } from '@/api/supplier/supplierData'
import { formatDate } from '@/utils/formatTime'
import { FormInstance } from 'element-plus'
import download from '@/utils/download'
import selectMonth from '../../components/selectMonth.vue'
import tableBox from '../../components/tableBox.vue'
import { copyBtn } from '../../components/twoFourSix'
import { getInfoByGoodsCode } from '@/api/supplier/purchase'
import { getPermission } from '@/utils'
const detailDrawer = defineAsyncComponent(() => import('../components/detailDrawer.vue'))

defineOptions({ name: 'SupplierDeliveryRate' })

const permissionSet = new Set(getPermission())

const props = defineProps<{
  innerHeight: number
}>()

const queryParams = ref({
  goodsCodes: '',
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
  autoColumnsSet.delete('goodsCode')
  autoColumnsSet.delete('goodsName')
  return Array.from(autoColumnsSet)
})
const tableOptions = computed<TableOption>(() => {
  return [
    { type: 'index', label: '序号', width: 60, fixed: 'left' },
    { label: '货品编码', prop: 'goodsCode', minWidth: 110, fixed: 'left', formatter: copyBtn },
    { label: '货品名称', prop: 'goodsName', minWidth: 130, fixed: 'left' },
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
    label: '交付平均天数',
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
      const res = await goodsDeliveryRateApi(queryParams.value)
      tableData.value = res.records
      total.value = res.total
    } catch (error) {
    } finally {
      loading.value = false
      timer.value && clearTimeout(timer.value)
    }
  }, 1000)
}

const detailDrawerProp = ref<any>({ modelValue: false })
function handleCheck(row, month) {
  detailDrawerProp.value = { modelValue: true, ...row[month], code: row.goodsCode, type: '3' }
}

const exportLoading = ref(false)
async function handleExport() {
  exportLoading.value = true
  let fileName = `货品交付率-${formatDate(new Date(), 'YYYYMMDDHHmmss')}.xlsx`

  try {
    const res = await exportDeliveryAnalysisGoodsApi({
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
  const today = new Date()
  // 重置当前的day为1，避免直接setMonth的31号溢出
  const lastMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1)
  queryParams.value.months = formatDate(lastMonthDate, 'YYYY-MM')
})

defineExpose({ getList })
</script>
<style lang="less" scoped>
@import url(../../index.scss);
</style>
