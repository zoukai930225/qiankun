<!--
 * @Author: wangxifeng-ZJ3bu
 * @Date: 2025-12-25 16:28:14
 * @LastEditors: wangxifeng-ZJ3bu
 * @LastEditTime: 2026-01-05 15:59:15
-->
<!--
 * 环节积压统计页面
-->
<template>
  <div class="statistics-container" v-loading="loading">
    <!-- 刷新时间 -->
    <div class="update-time-cnt">
      <div class="update-time-cnt-title">综合指标</div>
      <div class="update-time">
        刷新时间：<span class="update-time-text">{{ updateTime }}</span>
        <el-icon class="refresh-icon" @click="handleRefresh">
          <Refresh />
        </el-icon>
      </div>
    </div>

    <div class="filter-bar">
      <div class="filter-left">
        <label>仓库</label>
        <el-select v-model="selectedWarehouse" placeholder="请选择仓库" @change="getData">
          <el-option
            v-for="item in warehouseList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>

      <div class="filter-right">
        <el-button @click="handleReset"> 重置 </el-button>
      </div>
    </div>

    <!-- 综合指标卡片 -->
    <div class="metrics-cards">
      <div
        v-for="(item, index) in metricsData"
        :key="item.key"
        class="metric-card"
        :class="{ active: selectedMetric === item.key }"
        @click="handleMetricClick(item.key)"
      >
        <div class="card-content">
          <div class="card-left">
            <div class="metric-label">{{ item.label }}</div>
            <div class="metric-value">
              {{ item.value }}
              <span class="metric-unit">{{ item.unit }}</span>
            </div>
          </div>
          <div class="card-right">
            <img :src="indicatorIcons[index]" alt="" />
          </div>
          <div class="card-line"></div>
        </div>
      </div>
    </div>

    <!-- 环节积压列表标题 -->
    <div class="list-header">
      <span class="list-title">环节积压列表</span>
    </div>
    <div class="list-controls">
      <div class="list-controls-left">
        <label for="listDate">日期</label>
        <el-date-picker
          v-model="listDate"
          type="date"
          placeholder="选择日期"
          value-format="YYYY-MM-DD"
          :clearable="false"
          @change="getData"
        />
        <el-button :disabled="viewMode === 'table'" type="primary" @click="handleCompare"
          >对比昨日</el-button
        >
      </div>
      <div class="list-controls-right">
        <el-radio-group v-model="viewMode" class="view-mode-group">
          <el-radio-button value="bar">
            <img :src="barIcon" class="view-icon" alt="柱状图" />
          </el-radio-button>
          <el-radio-button value="line">
            <img :src="lineIcon" class="view-icon" alt="折线图" />
          </el-radio-button>
          <el-radio-button value="table">
            <img :src="tableIcon" class="view-icon" alt="表格" />
          </el-radio-button>
        </el-radio-group>
        <div class="export-range-group">
          <el-select v-model="exportRange" placeholder="近一周数据" style="width: 140px">
            <el-option label="今日数据" value="today" />
            <el-option label="近一周数据" value="week" />
            <el-option label="近两周数据" value="twoWeeks" />
          </el-select>
          <el-button type="primary" @click="handleExport" :loading="exportLoading">
            <el-icon><Download /></el-icon>
          </el-button>
        </div>
      </div>
    </div>
    <!-- 数据展示区域 -->
    <div class="data-display">
      <Transition name="fade" mode="out-in">
        <DataTable
          v-if="viewMode === 'table'"
          :key="'table'"
          :data="tableData"
          :selected-metric="selectedMetric"
        />
        <LineChart
          v-else-if="viewMode === 'line'"
          :key="'line'"
          :data="chartData"
          :selected-metric="selectedMetric"
          :show-compare="showCompare"
          :current-date-label="currentDateLabel"
          :compare-date-label="compareDateLabel"
        />
        <BarChart
          v-else-if="viewMode === 'bar'"
          :key="'bar'"
          :data="chartData"
          :selected-metric="selectedMetric"
          :show-compare="showCompare"
          :current-date-label="currentDateLabel"
          :compare-date-label="compareDateLabel"
        />
      </Transition>
    </div>
  </div>
</template>

<script lang="tsx" setup>
import { Refresh, Download } from '@element-plus/icons-vue'
import DataTable from '../components/DataTable.vue'
import LineChart from '../components/LineChart.vue'
import BarChart from '../components/BarChart.vue'
import dayjs from 'dayjs'
import request from '@/config/axios'
import type { MetricItem } from '../types'
import download from '@/utils/download'
// 导入指标图标
import indicatorIcon1 from '@/assets/imgs/storage/stepBacklog/indicator-icon-1.svg'
import indicatorIcon2 from '@/assets/imgs/storage/stepBacklog/indicator-icon-2.svg'
import indicatorIcon3 from '@/assets/imgs/storage/stepBacklog/indicator-icon-3.svg'
import indicatorIcon4 from '@/assets/imgs/storage/stepBacklog/indicator-icon-4.svg'
import indicatorIcon5 from '@/assets/imgs/storage/stepBacklog/indicator-icon-5.svg'
import indicatorIcon6 from '@/assets/imgs/storage/stepBacklog/indicator-icon-6.svg'
import indicatorIcon7 from '@/assets/imgs/storage/stepBacklog/indicator-icon-7.svg'
import indicatorIcon8 from '@/assets/imgs/storage/stepBacklog/indicator-icon-8.svg'
import indicatorIcon9 from '@/assets/imgs/storage/stepBacklog/indicator-icon-9.svg'
import indicatorIcon10 from '@/assets/imgs/storage/stepBacklog/indicator-icon-10.svg'

// 导入视图模式图标
import viewModeIcon1 from '@/assets/imgs/storage/stepBacklog/view-mode-icon-1.svg'
import viewModeIcon2 from '@/assets/imgs/storage/stepBacklog/view-mode-icon-2.svg'
import viewModeIcon3 from '@/assets/imgs/storage/stepBacklog/view-mode-icon-3.svg'
import viewModeIcon4 from '@/assets/imgs/storage/stepBacklog/view-mode-icon-4.svg'
import viewModeIcon5 from '@/assets/imgs/storage/stepBacklog/view-mode-icon-5.svg'
import viewModeIcon6 from '@/assets/imgs/storage/stepBacklog/view-mode-icon-6.svg'

const tableIcon = computed(() => {
  return viewMode.value === 'table' ? viewModeIcon4 : viewModeIcon3
})
const lineIcon = computed(() => {
  return viewMode.value === 'line' ? viewModeIcon5 : viewModeIcon2
})
const barIcon = computed(() => {
  return viewMode.value === 'bar' ? viewModeIcon6 : viewModeIcon1
})
// 图标数组
const indicatorIcons = [
  indicatorIcon1,
  indicatorIcon2,
  indicatorIcon3,
  indicatorIcon4,
  indicatorIcon5,
  indicatorIcon6,
  indicatorIcon7,
  indicatorIcon8,
  indicatorIcon9,
  indicatorIcon10
]

// 筛选条件
const selectedWarehouse = ref('SW-龙回仓（WMS）')
const updateTime = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))
const warehouseList = inject('warehouseList') as Ref<any[]>
// 列表筛选
const listDate = ref(dayjs().format('YYYY-MM-DD'))
const viewMode = ref('bar')
const exportRange = ref('today') // 导出时间范围
const showCompare = ref(true) // 是否显示对比昨日数据
const exportLoading = ref(false)
// 选中的指标
const selectedMetric = ref('incomingOrderCount')
const loading = ref(false)
// 日期标签
const currentDateLabel = computed(() => {
  return `${listDate.value} (今日)`
})

const compareDateLabel = computed(() => {
  const yesterday = dayjs(listDate.value).subtract(1, 'day').format('YYYY-MM-DD')
  return `${yesterday} (昨天)`
})

// 综合指标数据
const metricsData = ref<MetricItem[]>([
  {
    key: 'incomingOrderCount',
    label: '流入订单数',
    value: 0,
    unit: '单',
    todayCountList: [],
    yesterdayCountList: []
  },
  {
    key: 'incomingProductCount',
    label: '流入货品数量',
    value: 0,
    unit: '件',
    todayCountList: [],
    yesterdayCountList: []
  },
  {
    key: 'pendingReviewOrderCount',
    label: '待审核数量',
    value: 0,
    unit: '单',
    todayCountList: [],
    yesterdayCountList: []
  },
  {
    key: 'pendingBacklogQuantity',
    label: '待补货数量',
    value: 0,
    unit: '单',
    todayCountList: [],
    yesterdayCountList: []
  },
  {
    key: 'pendingPickingQuantity',
    label: '待拣货数量',
    value: 0,
    unit: '单',
    todayCountList: [],
    yesterdayCountList: []
  },
  {
    key: 'pendingInspectionQuantity',
    label: '待验货数量',
    value: 0,
    unit: '单',
    todayCountList: [],
    yesterdayCountList: []
  },
  {
    key: 'pendingPackingQuantity',
    label: '待打包数量',
    value: 0,
    unit: '单',
    todayCountList: [],
    yesterdayCountList: []
  },
  {
    key: 'packedQuantity',
    label: '已打包数量',
    value: 0,
    unit: '单',
    todayCountList: [],
    yesterdayCountList: []
  },
  {
    key: 'unshippedQuantity',
    label: '未发货数量',
    value: 0,
    unit: '单',
    todayCountList: [],
    yesterdayCountList: []
  },
  {
    key: 'shippedQuantity',
    label: '已发货数量',
    value: 0,
    unit: '单',
    todayCountList: [],
    yesterdayCountList: []
  }
])

// 表格数据
const tableData = ref<any[]>([])

// 图表数据
const chartData = ref({
  xAxisData: [
    '0-1点',
    '1-2点',
    '2-3点',
    '3-4点',
    '4-5点',
    '5-6点',
    '6-7点',
    '7-8点',
    '8-9点',
    '9-10点',
    '10-11点',
    '11-12点',
    '12-13点',
    '13-14点',
    '14-15点',
    '15-16点',
    '16-17点',
    '17-18点',
    '18-19点',
    '19-20点',
    '20-21点',
    '21-22点',
    '22-23点',
    '23-24点'
  ],
  seriesData: [] as number[],
  compareData: [] as number[]
})

// 点击指标卡片
const handleMetricClick = (key: string) => {
  selectedMetric.value = key
  formatChartData()
}

// 刷新
const handleRefresh = () => {
  getData()
}

// 对比昨日
const handleCompare = () => {
  showCompare.value = !showCompare.value
  // TODO: 实现对比逻辑，加载昨日数据
}
const exportDates = () => {
  if (exportRange.value === 'today') {
    // 今日：返回今天的日期
    return [dayjs().format('YYYY-MM-DD')]
  } else if (exportRange.value === 'week') {
    // 近一周：返回最近 7 天的日期数组
    return Array.from({ length: 7 }, (_, i) =>
      dayjs()
        .subtract(6 - i, 'day')
        .format('YYYY-MM-DD')
    )
  } else if (exportRange.value === 'twoWeeks') {
    // 近两周：返回最近 14 天的日期数组
    return Array.from({ length: 14 }, (_, i) =>
      dayjs()
        .subtract(13 - i, 'day')
        .format('YYYY-MM-DD')
    )
  }
  return []
}
// 导出
const handleExport = async () => {
  exportLoading.value = true
  const data = {
    warehouse: selectedWarehouse.value,
    queryDates: exportDates()
  }
  const res = await request.downloadPost({
    url: `/api/stageBacklog/exportStageBacklogOrderStatistics`,
    data: data
  })
  if (res) {
    download.excel(
      res,
      `环节积压统计_${exportRange.value === 'today' ? '今日' : exportRange.value === 'week' ? '近一周' : '近两周'}.xlsx`
    )
  }
  exportLoading.value = false
}

// 重置
const handleReset = () => {
  selectedWarehouse.value = 'SW-龙回仓（WMS）'
  listDate.value = dayjs().format('YYYY-MM-DD')
  selectedMetric.value = 'incomingOrderCount'
  handleRefresh()
}
const formatData = (res: any) => {
  // 卡片数据
  metricsData.value.forEach((item) => {
    item.todayCountList = Array.from(
      { length: 24 },
      (_, index) => res[item.key][index]['todayCount']
    )
    item.yesterdayCountList = Array.from(
      { length: 24 },
      (_, index) => res[item.key][index]['yesterdayCount']
    )
    item.value = res[item.key]['total']['todayCount']
  })
  // 表格数据
  tableData.value = metricsData.value.map((item) => {
    return {
      step: item.label,
      total: item.value as number,
      ...Object.fromEntries(
        item.todayCountList?.map((_, hour) => [`hour${hour}`, item.todayCountList?.[hour]]) || []
      )
    }
  })
}
const formatChartData = () => {
  // 图表数据
  chartData.value.seriesData = metricsData.value.find((item) => item.key === selectedMetric.value)
    ?.todayCountList as number[]
  chartData.value.compareData = metricsData.value.find((item) => item.key === selectedMetric.value)
    ?.yesterdayCountList as number[]
  console.log(chartData.value)
}
const getData = async () => {
  loading.value = true
  const res = await request.get({
    url: `/api/stageBacklog/queryStageBacklogOrderStatistics`,
    params: {
      warehouse: selectedWarehouse.value,
      queryDate: listDate.value
    }
  })
  formatData(res)
  formatChartData()
  loading.value = false
  updateTime.value = dayjs().format('YYYY-MM-DD HH:mm:ss')
}

onMounted(() => {
  getData()
})
</script>

<style lang="scss" scoped>
@use './styles.scss';
</style>
