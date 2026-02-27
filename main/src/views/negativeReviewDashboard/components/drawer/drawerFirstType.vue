<template>
  <div class="drawer-wrapper">
    <el-drawer
      v-model="drawerVisible"
      :with-header="false"
      :wrapper-closable="true"
      class="drawer"
      size="1200"
      @close="handleClose"
    >
      <div>
        <div class="drawerTitle">
          <div>{{ getCurrentTitle(drawerType) }}</div>
          <img
            src="@/assets/imgs/negativeReviewDashboard/close.svg"
            alt=""
            style="cursor: pointer"
            class="icon"
            @click="handleClose"
          />
        </div>
      </div>
      <div class="content-wrapper">
        <s-w-search-form
          ref="searchFormRef"
          :schema="searchSchema"
          @reset="onReset"
          @search="onSearch"
          :show-search-button="false"
          auto-search-on-change
        >
          <el-button
            @click="exportData"
            :loading="exportLoading"
            style="width: 60px"
            type="primary"
          >
            导出
          </el-button>
        </s-w-search-form>

        <el-table
          class="SWCommonTable"
          :header-cell-style="{
            backgroundColor: '#fff',
            fontWeight: '500',
            height: '45px'
          }"
          height="calc(100vh - 180px)"
          :data="displayedList"
          width="100%"
          :show-overflow-tooltip="false"
          v-loading="loading"
          v-horizontal-scroll="'always'"
          :row-class-name="form.filterCount !== 2 ? tableRowClassName : ''"
          :row-style="{
            height: '64px'
          }"
        >
          <el-table-column prop="goodsCode" label="商品编码" align="left" header-align="left" />

          <el-table-column :label="leftDateRangeDisplay" align="center">
            <el-table-column prop="count" label="计数" align="left" header-align="left">
              <template #default="{ row }">
                <div :class="row.goodsCode === '合计' ? 'summary-count' : ''">
                  {{ row.count || 0 }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="yesterdayPercentage"
              label="占比"
              align="left"
              header-align="left"
              class-name="tight-padding"
            >
              <template #default="{ row }">
                <div class="cell-content-wrapper">
                  <div
                    v-if="row.goodsCode !== '合计'"
                    class="yesterdayPercentage-progress-label"
                    :style="{ width: progressLabelWidth(row.yesterdayPercentage) }"
                  ></div>
                  <div class="yesterdayPercentage">
                    {{ formatPercentFromRatio(row.yesterdayPercentage) }}%
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column :label="rightDateRangeDisplay" align="center">
            <el-table-column prop="beforeCount" label="计数" align="left" header-align="left">
              <template #default="{ row }">
                <div :class="row.goodsCode === '合计' ? 'summary-count' : ''">
                  {{ row.beforeCount || 0 }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="beforePercentage"
              label="占比"
              align="left"
              header-align="left"
              class-name="tight-padding"
            >
              <template #default="{ row }">
                <div class="cell-content-wrapper">
                  <div
                    v-if="row.goodsCode !== '合计'"
                    class="beforePercentage-progress-label"
                    :style="{ width: progressLabelWidth(row.beforePercentage) }"
                  ></div>
                  <div class="beforePercentage">
                    {{ formatPercentFromRatio(row.beforePercentage) }}%
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column
            prop="chainRatio"
            label="环比"
            align="left"
            header-align="left"
            class-name="tight-padding"
          >
            <template #default="{ row }">
              <div class="cell-content-wrapper">
                <div
                  v-if="row.goodsCode !== '合计'"
                  class="chainRatio-progress-label"
                  :style="{ width: progressLabelWidthchain(row.chainRatio) }"
                >
                </div>
                <div class="chainRatio"> {{ formatPercentFromValue(row.chainRatio) }}% </div>
              </div>
            </template>
          </el-table-column>
          <template v-if="drawerType === '1'">
            <el-table-column
              prop="customerComplaintCountOfBN"
              label="班牛客诉量"
              align="left"
              header-align="left"
            >
              <template #default="{ row }">
                <div :class="row.goodsCode === '合计' ? 'summary-count' : ''">
                  {{
                    row.goodsCode === '合计'
                      ? row.bnTotalSum || 0
                      : row.customerComplaintCountOfBN || 0
                  }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="wdtCount" label="旺店通销量" align="left" header-align="left">
              <template #default="{ row }">
                <div :class="row.goodsCode === '合计' ? 'summary-count' : ''">
                  {{ row.goodsCode === '合计' ? row.wdtTotalSum || 0 : row.wdtCount || 0 }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="goodsBadReviewRate"
              label="货品中差评率"
              align="left"
              class-name="tight-padding"
              header-align="left"
              min-width="100px"
            >
              <template #header>
                <div class="flex items-center">
                  <span>货品中差评率</span>
                  <el-tooltip
                    effect="dark"
                    placement="top"
                    content="货品中差评率=中差评数量/旺店通销量*100%"
                  >
                    <el-icon class="header-help"><QuestionFilled /></el-icon>
                  </el-tooltip>
                </div>
              </template>
              <template #default="{ row }">
                <div class="rateCell">
                  <div
                    v-if="row.goodsCode !== '合计'"
                    class="rate-progress-label"
                    :style="{
                      width: progressLabelWidthForRate(
                        row.goodsCode === '合计'
                          ? row.goodsBadReviewRateRes
                          : row.goodsBadReviewRate
                      )
                    }"
                  ></div>
                  <div class="rate-text">
                    {{
                      row.goodsCode === '合计'
                        ? formatRawRatio(row.goodsBadReviewRateRes)
                        : formatRawRatio(row.goodsBadReviewRate)
                    }}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="goodsComplaintRate"
              label="货品客诉率"
              align="left"
              class-name="tight-padding"
              header-align="left"
              min-width="100px"
            >
              <template #header>
                <div class="flex items-center">
                  <span>货品客诉率</span>
                  <el-tooltip
                    effect="dark"
                    placement="top"
                    content="货品客诉率=(中差评数量+客诉数量)订单去重/旺店通销量*100%"
                  >
                    <el-icon class="header-help"><QuestionFilled /></el-icon>
                  </el-tooltip>
                </div>
              </template>
              <template #default="{ row }">
                <div class="rateCell">
                  <div
                    v-if="row.goodsCode !== '合计'"
                    class="rate-progress-label"
                    :style="{
                      width: progressLabelWidthForRate(
                        row.goodsCode === '合计'
                          ? row.goodsComplaintRateRes
                          : row.goodsComplaintRate
                      )
                    }"
                  ></div>
                  <div class="rate-text">
                    {{
                      row.goodsCode === '合计'
                        ? formatRawRatio(row.goodsComplaintRateRes)
                        : formatRawRatio(row.goodsComplaintRate)
                    }}
                  </div>
                </div>
              </template>
            </el-table-column>
          </template>
        </el-table>
      </div>
    </el-drawer>
  </div>
</template>
<script lang="ts" setup>
defineOptions({ name: 'DrawerFirstType' })
import dayjs from 'dayjs'
import * as negativeReviewDashboardApi from '@/api/negativeReviewDashboard'
import download from '@/utils/download'
import { FormSchema } from '@/types/form'
import { QuestionFilled } from '@element-plus/icons-vue'
import { StoreItem } from '../../type'
const message = useMessage() // 消息弹窗
const drawerVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const loading = ref(false) // 列表的加载中

// 获取当前标题
const drawerType = ref('')
const getCurrentTitle = (type: string): string => {
  const titleMap: Record<string, string> = {
    '1': '中差评数量情况',
    '2': '中差评原因产品（日度中差评数量大于2）',
    '3': '中差评原因一级分类',
    '4': '中差评原因（日度中差评数量大于3）'
  }

  return titleMap[type] || '未知类型'
}

// 默认昨日日期
const yesterday = dayjs().subtract(1, 'day')

const startOfYesterday = yesterday.startOf('day').format('YYYY-MM-DD')
const endOfYesterday = yesterday.endOf('day').format('YYYY-MM-DD')

// s-w-search-form
const searchFormRef = ref()
const storeList = ref<StoreItem[]>([])
const storeOptions = computed(() =>
  storeList.value.map((s) => ({ label: s.storeName, value: s.storeCode }))
)
const searchSchema = computed<FormSchema[]>(() => [
  {
    field: 'dateRange',
    label: '初次评价日期',
    component: 'DatePicker',
    componentProps: {
      type: 'daterange',
      rangeSeparator: '-',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期',
      valueFormat: 'YYYY-MM-DD',
      format: 'YYYY-MM-DD',
      clearable: false
    },
    value: [startOfYesterday, endOfYesterday]
  },
  {
    field: 'store',
    label: '店铺',
    component: 'Select',
    componentProps: {
      placeholder: '请选择店铺',
      filterable: true,
      options: storeOptions.value,
      clearable: false
    },
    value: 'ALL'
  }
])

const onSearch = (val: any) => {
  form.value.startTime =
    Array.isArray(val.dateRange) && val.dateRange.length
      ? dayjs(val.dateRange[0]).format('YYYY-MM-DD')
      : ''
  form.value.endTime =
    Array.isArray(val.dateRange) && val.dateRange.length
      ? dayjs(val.dateRange[1]).format('YYYY-MM-DD')
      : ''
  form.value.store = val.store ?? 'ALL'
  getList()
}

const onReset = () => {
  form.value.startTime = startOfYesterday
  form.value.endTime = endOfYesterday
  form.value.store = 'ALL'
  searchFormRef.value?.setValues({
    store: 'ALL',
    dateRange: [startOfYesterday, endOfYesterday]
  })
}

const getStoreList = async () => {
  if (storeList.value.length) return
  const res = await negativeReviewDashboardApi.getNegativeReviewShopList().catch(() => {})
  storeList.value = res || []
  storeList.value.unshift({ storeCode: 'ALL', storeName: '全部' })
}

const leftDateRangeDisplay = ref('') //左边展示的时间范围
const rightDateRangeDisplay = ref('') //右边展示的时间范围
// 查询对比时间
const getComparisonTime = async () => {
  const params = {
    startTime: form.value.startTime,
    endTime: form.value.endTime
  }
  const res = await negativeReviewDashboardApi.getComparisonTime(params).catch(() => {})
  if (res) {
    console.log('---', res)
    rightDateRangeDisplay.value = `${res.beforeStartDate} ~ ${res.beforeEndDate}`
    console.log('rightDateRangeDisplay', rightDateRangeDisplay.value)
  }
}

/** 打开弹窗 */
const open = async (type: string) => {
  drawerVisible.value = true
  formLoading.value = true
  try {
    drawerType.value = type
    await getStoreList()
    // 初始化默认查询条件并拉取数据
    form.value.startTime = startOfYesterday
    form.value.endTime = endOfYesterday
    form.value.store = 'ALL'
    form.value.filterCount = drawerType.value === '1' ? undefined : 2
    searchFormRef.value?.setValues({
      store: 'ALL',
      dateRange: [startOfYesterday, endOfYesterday]
    })
    await getList()
  } finally {
    formLoading.value = false
  }
}

interface FormType {
  startTime: string
  endTime: string
  store: string
  filterCount: number | undefined
}
const form = ref<FormType>({
  startTime: '',
  endTime: '',
  store: 'ALL',
  filterCount: undefined //中差评数量情况：undefined；中差评原因产品（日度中差评数量大于2）：2；
})

/** 查询列表 */

// 合计行
const summaryRow = ref({})

// 在列表前面插入合计行
const displayedList = computed(() => {
  if (form.value.filterCount !== 2) {
    return [summaryRow.value, ...list.value]
  }
  return list.value
})

const tableRowClassName = ({ row }) => {
  // console.log('a', row)
  return row.goodsCode === '合计' ? 'summary-row' : ''
}

const list = ref<any[]>([])
const getList = async () => {
  loading.value = true

  try {
    await getComparisonTime()
    leftDateRangeDisplay.value = `${form.value.startTime} ~ ${form.value.endTime}`

    form.value.filterCount = drawerType.value === '1' ? undefined : 2
    const data = await negativeReviewDashboardApi.getNegativeReviewCount(form.value).catch(() => {})
    // console.log('data', data)
    if (data) {
      const rawList = data.numberInfoList || []
      const mappedList = rawList.map((item: any) => {
        const newItem: any = { ...item }
        if (newItem.customerComplaintCountOfBN === undefined) {
          newItem.customerComplaintCountOfBN = newItem.banniuComplaintCount ?? 0
        }
        if (newItem.wdtCount === undefined) {
          newItem.wdtCount = newItem.wangdiantongSalesCount ?? 0
        }
        if (newItem.goodsBadReviewRate === undefined) {
          newItem.goodsBadReviewRate = newItem.productMidNegativeReviewRate ?? 0
        }
        if (newItem.goodsComplaintRate === undefined) {
          newItem.goodsComplaintRate = newItem.productComplaintRate ?? 0
        }
        return newItem
      })

      const totalWdt = Number.isFinite(Number(data.wdtTotalSum))
        ? Number(data.wdtTotalSum)
        : mappedList.reduce((sum: number, r: any) => sum + (Number(r.wdtCount) || 0), 0)
      const totalBn = Number.isFinite(Number(data.bnTotalSum))
        ? Number(data.bnTotalSum)
        : mappedList.reduce(
            (sum: number, r: any) => sum + (Number(r.customerComplaintCountOfBN) || 0),
            0
          )
      const weightedAvg = (valueKey: string, weightKey: string) => {
        const totalWeight = mappedList.reduce(
          (sum: number, r: any) => sum + (Number(r[weightKey]) || 0),
          0
        )
        if (!totalWeight) return 0
        const totalVal = mappedList.reduce(
          (sum: number, r: any) => sum + (Number(r[valueKey]) || 0) * (Number(r[weightKey]) || 0),
          0
        )
        return totalVal / totalWeight
      }
      const totalGoodsComplaintRate =
        (data.goodsComplaintRateRes ?? null) != null
          ? data.goodsComplaintRateRes
          : weightedAvg('goodsComplaintRate', 'wdtCount')
      const totalGoodsBadReviewRate =
        (data.goodsBadReviewRateRes ?? null) != null
          ? data.goodsBadReviewRateRes
          : weightedAvg('goodsBadReviewRate', 'wdtCount')

      // 中差评数量情况有合计栏，其他类型没有
      if (drawerType.value === '1') {
        summaryRow.value = {
          goodsCode: '合计',
          count: data.count || 0,
          beforeCount: data.beforeCount || 0,
          yesterdayPercentage: data.yesterdayPercentage || 0,
          beforePercentage: data.beforePercentage || 0,
          chainRatio: data.chainRatio || 0,
          wdtTotalSum: totalWdt,
          bnTotalSum: totalBn,
          goodsComplaintRateRes: totalGoodsComplaintRate,
          goodsBadReviewRateRes: totalGoodsBadReviewRate
        }
      }

      list.value = mappedList
    }
  } finally {
    loading.value = false
  }
}
// 占比（兼容 0~1 或 0~100），返回百分比宽度
const progressLabelWidth = (value: unknown) => {
  const n = Number(value)
  if (!Number.isFinite(n) || n <= 0) return '0%'
  const ratio = n <= 1 ? n : n / 100
  const clamped = Math.max(0, Math.min(1, ratio))
  return `calc(${clamped * 100}% - 8px)`
}

// 货品中差评率/客诉率：值为 0~100，直接按百分比宽度渲染
const progressLabelWidthForRate = (value: unknown) => {
  const n = Number(value)
  if (!Number.isFinite(n) || n <= 0) return '0%'
  const clamped = Math.max(0, Math.min(100, n))
  return `calc(${clamped}% - 8px)`
}

// 环比（传入 0~100 数值），返回百分比宽度
const progressLabelWidthchain = (chainRatio: unknown) => {
  const n = Number(chainRatio)
  if (!Number.isFinite(n) || n <= 0) return '0%'
  const ratio = n / 100
  const clamped = Math.max(0, Math.min(1, ratio))
  return `calc(${clamped * 100}% - 8px)`
}
// 百分比格式化（传入 0~1 比例）
const formatPercentFromRatio = (ratio: unknown): string => {
  const n = Number(ratio)
  if (!Number.isFinite(n)) return '0.00'
  return (n * 100).toFixed(2)
}
// 原始比率格式化（传入 0~1 比例，保留 4 位小数）
const formatRawRatio = (ratio: unknown): string => {
  const n = Number(ratio)
  if (!Number.isFinite(n)) return '0.0000%'
  return `${n.toFixed(4)}%`
}
// 百分比格式化（传入 0~100 数值）
const formatPercentFromValue = (value: unknown): string => {
  const n = Number(value)
  if (!Number.isFinite(n)) return '0.00'
  return n.toFixed(2)
}
// 关闭弹窗
const handleClose = () => {
  drawerVisible.value = false
  searchFormRef.value?.setValues({
    store: 'ALL',
    dateRange: [startOfYesterday, endOfYesterday]
  })
  emit('close')
}

// 导出数据
const exportLoading = ref(false) // 导出状态
const exportData = async () => {
  try {
    exportLoading.value = true
    form.value.filterCount = drawerType.value === '1' ? undefined : 2
    const params = { ...form.value }
    const res = await negativeReviewDashboardApi.exportNegativeReviewCount(params)
    if (res) {
      const title = getCurrentTitle(drawerType.value)
      download.excel(res, `${title}.xls`)
      message.success('导出成功')
    }
  } catch {
    message.error('导出失败')
  } finally {
    exportLoading.value = false
  }
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗
const emit = defineEmits(['close']) // 定义 close 事件
</script>

<style lang="scss" scoped>
// 背景颜色
:deep(.el-drawer__body) {
  background-color: #f8f8f9;
}

.drawer-wrapper {
  overflow: hidden;
  border-radius: 8px;
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

.content-wrapper {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-sizing: border-box;
}

:deep(.summary-row) {
  background-color: #e9ebef;
  font-weight: bold;
  position: sticky;
  top: 0;
  z-index: 3;
}

:deep(.el-table) {
  --el-table-border: 1px solid #e5e5e5;
  .el-table__row {
    // height: 45px !important; // 移除强制高度
  }
  .el-table__row:not(.summary-row) .el-table__cell.tight-padding {
    padding: 4px 0 !important;
    .cell {
      padding: 0 4px;
    }
  }
  .summary-row .yesterdayPercentage,
  .summary-row .beforePercentage,
  .summary-row .chainRatio,
  .summary-row .rate-text {
    background: transparent !important;
    text-align: left !important;
    color: #333 !important;
    padding: 0;
  }
}

// 辅助容器
.cell-content-wrapper {
  position: relative;
  min-height: 32px;
  display: flex;
  align-items: center;
}

// 昨日占比
.yesterdayPercentage {
  width: auto; // 去除限制
  color: #333;
  border-radius: 3px;
  min-height: 32px;
  line-height: 1.4;
  text-align: left;
  box-sizing: border-box;
  padding: 4px 8px;
  white-space: normal; // 允许换行
  word-break: break-all;
}

.yesterdayPercentage-progress-label {
  background: #d9e8ff;
  height: 100%; // 自适应高度
  top: 0;
  bottom: 0;
  position: absolute;
  z-index: -1;
}

// 前日占比
.beforePercentage {
  width: auto; // 去除限制
  color: #333;
  border-radius: 3px;
  min-height: 32px;
  line-height: 1.4;
  text-align: left;
  box-sizing: border-box;
  padding: 4px 8px;
  white-space: normal; // 允许换行
  word-break: break-all;
}

.beforePercentage-progress-label {
  background: #d9e8ff;
  height: 100%; // 自适应高度
  top: 0;
  bottom: 0;
  position: absolute;
  z-index: -1;
}

// 环比样式（绿色）
.chainRatio {
  width: auto; // 去除限制
  color: #333;
  border-radius: 3px;
  min-height: 32px;
  line-height: 1.4;
  text-align: left;
  box-sizing: border-box;
  padding: 4px 8px;
  white-space: normal; // 允许换行
  word-break: break-all;
}

.chainRatio-progress-label {
  background: #cdfacd;
  height: 100%; // 自适应高度
  top: 0;
  bottom: 0;
  position: absolute;
  z-index: -1;
}

// 中差评率/客诉率通用：全高背景条 + 默认黑字
.rateCell {
  position: relative;
  min-height: 32px;
  display: flex;
  align-items: center;
}
.rate-progress-label {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0; // 撑满表格格子高度
  background: #ffe0e0; // 红色背景条
  z-index: -1;
}
.rate-text {
  min-height: 32px;
  line-height: 1.4;
  width: auto; // 去除限制
  text-align: left;
  box-sizing: border-box;
  color: #333; // 默认黑色
  padding: 4px 8px;
  white-space: normal; // 允许换行
  word-break: break-all;
}

.drawerFooter {
  display: flex;
  justify-content: flex-end;
  margin: 20px 0;
}

// 列头帮助提示“?”样式
.header-help {
  margin-left: 2px;
  font-size: 16px;
  color: #909399;
  vertical-align: middle;
  cursor: pointer;
}
</style>
