<template>
  <div class="drawer-wrapper">
    <el-drawer
      v-model="drawerVisible"
      :with-header="false"
      :wrapper-closable="true"
      class="drawer"
      size="950"
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
          :row-class-name="tableRowClassName"
          :row-style="{
            height: '64px'
          }"
        >
          <el-table-column
            prop="primaryClassification"
            label="一级分类"
            align="left"
            header-align="left"
          />
          <el-table-column :label="leftDateRangeDisplay" align="center">
            <el-table-column prop="count" label="计数" align="left" header-align="left">
              <template #default="{ row }">
                <div :class="row.primaryClassification === '总数' ? 'summary-count' : ''">
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
                <div :class="row.primaryClassification === '总数' ? 'summary-count' : ''">
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
                  class="beforePercentage-progress-label"
                  :style="{ width: progressLabelWidthchain(row.chainRatio) }"
                ></div>
                <div class="beforePercentage"> {{ formatPercentFromValue(row.chainRatio) }}% </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-drawer>
  </div>
</template>
<script lang="ts" setup>
defineOptions({ name: 'DrawerFirstCategory' })
import dayjs from 'dayjs'
import * as negativeReviewDashboardApi from '@/api/negativeReviewDashboard'
import download from '@/utils/download'
import { FormSchema } from '@/types/form'
import { StoreItem } from '../../type'
const message = useMessage() // 消息弹窗
const drawerVisible = ref(false) // 抽屉的是否展示

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
  drawerType.value = type
  await getStoreList()
  form.value.startTime = startOfYesterday
  form.value.endTime = endOfYesterday
  form.value.store = 'ALL'
  searchFormRef.value?.setProps({ autoSearchOnChange: false })
  searchFormRef.value?.setValues({
    store: 'ALL',
    dateRange: [startOfYesterday, endOfYesterday]
  })
  await getList()
  searchFormRef.value?.setProps({ autoSearchOnChange: true })
}

// 查询表单提交
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
// 重置查询条件
const onReset = () => {
  form.value.startTime = startOfYesterday
  form.value.endTime = endOfYesterday
  form.value.store = 'ALL'
  searchFormRef.value?.setValues({
    store: 'ALL',
    dateRange: [startOfYesterday, endOfYesterday]
  })
}

const form = ref({
  startTime: '',
  endTime: '',
  store: 'ALL',
  filterCount: undefined
})

/** 查询列表 */

// 总数行
const summaryRow = ref({})

// 在列表前面插入总数行
const displayedList = computed(() => {
  return [summaryRow.value, ...list.value]
})

const tableRowClassName = ({ row }) => {
  console.log('a', row)
  return row.primaryClassification === '总数' ? 'summary-row' : ''
}

const list = ref<any[]>([])
const loading = ref(false) // 列表的加载中
const getList = async () => {
  loading.value = true

  try {
    await getComparisonTime()
    leftDateRangeDisplay.value = `${form.value.startTime} ~ ${form.value.endTime}`

    const data = await negativeReviewDashboardApi
      .getNegativeReviewReasonFirst(form.value)
      .catch(() => {})

    if (data) {
      summaryRow.value = {
        primaryClassification: '总数',
        count: data.count || 0,
        beforeCount: data.beforeCount || 0,
        yesterdayPercentage: data.yesterdayPercentage || 0,
        beforePercentage: data.beforePercentage || 0,
        chainRatio: data.chainRatio || 0
      }

      list.value = data.primaryClassificationInfoList || []
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
// 百分比格式化（传入 0~100 数值）
const formatPercentFromValue = (value: unknown): string => {
  const n = Number(value)
  if (!Number.isFinite(n)) return '0.00'
  return n.toFixed(2)
}
// 关闭抽屉
const handleClose = () => {
  drawerVisible.value = false
  searchFormRef.value?.setValues({
    store: 'ALL',
    dateRange: [startOfYesterday, endOfYesterday]
  })
  emit('close')
}

const exportLoading = ref(false) // 导出状态
const exportData = async () => {
  try {
    exportLoading.value = true
    const params = { ...form.value }
    const res = await negativeReviewDashboardApi.exportNegativeReviewReasonFirst(params)
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

// 辅助容器，用于相对定位
.cell-content-wrapper {
  position: relative;
  min-height: 32px;
  display: flex;
  align-items: center;
}

// 昨日占比
.yesterdayPercentage {
  width: auto; // 去除固定宽度
  color: #333;
  border-radius: 3px;
  min-height: 32px;
  line-height: 1.4; // 优化多行行高
  text-align: left;
  box-sizing: border-box;
  padding: 4px 8px; // 增加上下内边距适应换行
  white-space: normal; // 允许换行
  word-break: break-all; // 防止长数字不换行
}

.yesterdayPercentage-progress-label {
  background: #d3e4ff;
  height: 100%; // 高度自适应
  top: 0;
  bottom: 0;
  position: absolute;
  z-index: -1;
}

// 前日占比
.beforePercentage {
  width: auto; // 去除固定宽度
  color: #333;
  border-radius: 3px;
  min-height: 32px;
  line-height: 1.4; // 优化多行行高
  text-align: left;
  box-sizing: border-box;
  padding: 4px 8px; // 增加上下内边距适应换行
  white-space: normal; // 允许换行
  word-break: break-all;
}

.beforePercentage-progress-label {
  background: #facaca;
  height: 100%; // 高度自适应
  top: 0;
  bottom: 0;
  position: absolute;
  z-index: -1;
}

.drawerFooter {
  display: flex;
  justify-content: flex-end;
  margin: 20px 0;
}

// el-table scoped styles to match DrawerFirstType
:deep(.el-table) {
  --el-table-border: 1px solid #e5e5e5;
  .el-table__row {
    // height: 45px !important; // 去除强制高度，允许内容撑开
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
  .summary-row .yesterdayPercentage-progress-label,
  .summary-row .beforePercentage-progress-label {
    display: none;
  }
}
</style>
