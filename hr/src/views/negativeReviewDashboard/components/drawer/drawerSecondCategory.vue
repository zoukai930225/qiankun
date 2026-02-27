<template>
  <div class="drawer-wrapper">
    <el-drawer
      v-model="drawerVisible"
      :with-header="false"
      :wrapper-closable="true"
      class="drawer"
      @close="handleClose"
      size="950"
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
      </div>
      <div v-if="list.length > 0">
        <div v-for="(item, index) in list" :key="index" class="table-wrapper">
          <el-table
            class="SWCommonTable"
            :header-cell-style="{
              backgroundColor: '#fff',
              fontWeight: '500',
              height: '45px'
            }"
            :height="
              (item.secondaryList.length + 1) * 64 + 52 > 436
                ? '436'
                : (item.secondaryList.length + 1) * 64 + 52
            "
            :data="getLisplayedList(index, item.secondaryList)"
            width="100%"
            :show-overflow-tooltip="false"
            v-loading="loading"
            v-horizontal-scroll="'always'"
            :row-class-name="tableRowClassName"
            :row-style="{
              height: '64px'
            }"
          >
            <el-table-column prop="goodsCode" align="left" header-align="left">
              <template #default="{ row }">
                {{ row.secondaryClassification }}
              </template>
              <template #header>
                {{ item.goodsCode }}
              </template>
            </el-table-column>
            <el-table-column prop="count" label="计数" align="left" header-align="left">
              <template #default="{ row }">
                <div :class="row.secondaryClassification === '合计' ? 'summary-count' : ''">
                  {{ row.count || 0 }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="percentage"
              label="占比"
              align="left"
              header-align="left"
              class-name="tight-padding"
            >
              <template #default="{ row }">
                <div class="cell-content-wrapper">
                  <div
                    class="percentage-progress-label"
                    :style="{ width: progressLabelWidth(row.percentage) }"
                  ></div>
                  <div class="percentage"> {{ formatPercentFromRatio(row.percentage) }}% </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div v-else class="empty-wapper"> 暂无数据 </div>
    </el-drawer>
  </div>
</template>
<script lang="ts" setup>
defineOptions({ name: 'DrawerSecondCategory' })
import dayjs from 'dayjs'
import * as negativeReviewDashboardApi from '@/api/negativeReviewDashboard'
import download from '@/utils/download'
import { FormSchema } from '@/types/form'
import { StoreItem } from '../../type'
const message = useMessage() // 消息弹窗
const drawerVisible = ref(false) // 弹窗的是否展示

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

// 合计行
const summaryRow = ref<any>([])

const getLisplayedList = (index, item) => {
  return [summaryRow.value[index], ...item]
}

const tableRowClassName = ({ row }) => {
  return row.secondaryClassification === '合计' ? 'summary-row' : ''
}

const list = ref<any[]>([])
const getList = async () => {
  loading.value = true
  try {
    const data = await negativeReviewDashboardApi
      .getNegativeReviewReasonSecond(form.value)
      .catch(() => {})
    if (data) {
      list.value = data || []
      list.value.forEach((item, index) => {
        if (item.secondaryList && item.secondaryList.length > 0) {
          summaryRow.value[index] = {
            secondaryClassification: '合计',
            count: item.count || 0,
            percentage: item.percentage || 0
          }
        }
      })
    }
  } finally {
    loading.value = false
  }
}

const progressLabelWidth = (percentage: number) => {
  let width = 0
  width = (percentage / 1) * 90
  return `${width}px`
}

const formatPercentFromRatio = (ratio: unknown): string => {
  const n = Number(ratio)
  if (!Number.isFinite(n)) return '0.00'
  return (n * 100).toFixed(2)
}

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
    const res = await negativeReviewDashboardApi.exportNegativeReviewReasonSecond(params)
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
const emit = defineEmits(['close']) // 定义 close 事件

defineExpose({ open }) // 提供 open 方法，用于打开弹窗
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
  padding: 20px 20px 0 20px;
  box-sizing: border-box;
  margin-bottom: 20px;
}
.table-wrapper {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-sizing: border-box;
  margin-bottom: 20px;
}

:deep(.summary-row) {
  background-color: #e9ebef;
  font-weight: bold;
  position: sticky;
  top: 0;
  z-index: 3;
}

// 辅助容器
.cell-content-wrapper {
  position: relative;
  min-height: 32px;
  display: flex;
  align-items: center;
}

// 占比
.percentage {
  width: auto; // 去除固定宽度
  color: #333;
  border-radius: 3px;
  min-height: 32px;
  line-height: 1.4; // 优化行高
  text-align: left;
  box-sizing: border-box;
  padding: 4px 8px;
  white-space: normal; // 允许换行
  word-break: break-all;
}
.percentage-progress-label {
  background: #d9e8ff;
  height: 100%; // 高度自适应
  top: 0;
  bottom: 0;
  position: absolute;
  z-index: -1;
}

.empty-wapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  font-size: 14px;
  color: #999;
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
    // height: 45px !important; // 允许高度被内容撑开
  }
  .el-table__row:not(.summary-row) .el-table__cell.tight-padding {
    padding: 4px 0 !important;
    .cell {
      padding: 0 4px;
    }
  }
  .summary-row .percentage {
    background: transparent !important;
    text-align: left !important;
    color: #333 !important;
    padding: 0;
  }
  .summary-row .percentage-progress-label {
    display: none;
  }
}
</style>
