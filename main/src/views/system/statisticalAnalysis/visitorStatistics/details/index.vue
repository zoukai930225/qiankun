<template>
  <scheme-details ref="detailsRef" name="Visitorstatistics" width="936px">
    <template #card>
      <div class="details-container" v-loading="loading">
        <div class="header-controls">
          <div class="tabs">
            <div
              class="tab-item"
              :class="{ active: activeTab === 'version' }"
              @click="handleTabChange('version')"
            >
              按版本
            </div>
            <div
              class="tab-item"
              :class="{ active: activeTab === 'time' }"
              @click="handleTabChange('time')"
            >
              按时间
            </div>
          </div>
          <div v-if="activeTab === 'time'" class="filter-wrapper">
            <span class="filter-label">统计时间：{{ timeRangeDisplay }}</span>
            <TimeFilter
              ref="timeFilterRef"
              :default-value="activeTimeLabel"
              :default-date="filterDateRange"
              :swift-options="swiftOptions"
              :map-options="timeMapOptions"
              :layout="'日,周,月,自定义'"
              :is-show-time="false"
              :is-tooltip="false"
              :show-arrow="false"
              @change="handleTimeChange"
            />
          </div>
          <div v-else class="h-30px w-1px"> </div>
        </div>

        <div class="cards-section">
          <template v-if="activeTab === 'version'">
            <div class="stat-card">
              <div class="label">最高日访问量</div>
              <div class="value">{{ cardData.maxDailyVisits }}</div>
            </div>
            <div class="stat-card">
              <div class="label">累计访问量</div>
              <div class="value">{{ cardData.totalVisits }}</div>
            </div>
            <div class="stat-card">
              <div class="label">累计访问用户量</div>
              <div class="value">{{ cardData.totalUsers }}</div>
            </div>
          </template>

          <template v-else>
            <div class="stat-card">
              <div class="label">最高日访问量</div>
              <div class="value">{{ cardData.maxDailyVisits }}</div>
            </div>
            <div class="stat-card">
              <div class="label">累计访问量</div>
              <div class="value">{{ cardData.totalVisits }}</div>
            </div>
            <div class="stat-card">
              <div class="label">累计访问用户量</div>
              <div class="value">{{ cardData.totalUsers }}</div>
            </div>
            <div class="stat-card">
              <div class="label">平均日访问量</div>
              <div class="value">{{ cardData.avgDailyVisits }}</div>
            </div>
            <div class="stat-card">
              <div class="label">平均日访问用户量</div>
              <div class="value">{{ cardData.avgDailyUsers }}</div>
            </div>
          </template>
        </div>

        <div class="chart-section">
          <div ref="chartRef" class="chart-container"></div>
        </div>
      </div>
    </template>

    <template #button>
      <el-button @click="closeDrawer">关闭</el-button>
    </template>
  </scheme-details>
</template>

<script lang="tsx">
export default { name: 'VisitorstatisticsDetails' }
</script>

<script lang="tsx" setup>
import { ref, nextTick, onUnmounted, computed, provide } from 'vue'
import { cloneDeep } from 'lodash-es'
import { DataItem } from '../page/config'
import * as echarts from 'echarts'
import dayjs from 'dayjs'
import {
  getPatternAnalysisByDay,
  getPatternAnalysisByVersion
} from '@/api/system/statisticalAnalysis/visitorStatistics'
import TimeFilter from '@/components/common/time/timeFilter.vue'

const detailsRef = ref<any>()
const chartRef = ref<HTMLElement | null>(null)
let myChart: echarts.ECharts | null = null
let resizeObserver: ResizeObserver | null = null

// Loading 状态
const loading = ref(false)

const activeTab = ref<'version' | 'time'>('version')

const dataValue = ref<DataItem>({ ...new DataItem() })
const bukValue = ref<DataItem>({ ...new DataItem() })
const viewType = ref<string>('view')

const timeRangeDisplay = ref('')
const timeRange = ref<{ startDate: string; endDate: string }>({
  startDate: dayjs().subtract(6, 'day').format('YYYY-MM-DD'),
  endDate: dayjs().format('YYYY-MM-DD')
})

// 控制 TimeFilter 的选中高亮，默认为 '7天'
const activeTimeLabel = ref('7天')

const cardData = ref({
  maxDailyVisits: '-',
  totalVisits: '-',
  totalUsers: '-',
  avgDailyVisits: '-',
  avgDailyUsers: '-'
})

const customTitle = computed(() => '趋势分析')

const swiftOptions = [
  {
    label: '7天',
    timeOffset: { offset: 6, type: 'day', mode: 'subtract' }
  },
  {
    label: '30天',
    timeOffset: { offset: 29, type: 'day', mode: 'subtract' }
  }
]

const filterDateRange = computed(() => {
  const { startDate, endDate } = timeRange.value
  if (['日', '周', '月', '年'].includes(activeTimeLabel.value)) {
    return startDate
  }
  return [startDate, endDate]
})

const disableTomorrowAndFuture = (time: Date) => dayjs(time).isAfter(dayjs().endOf('day'))

const timeMapOptions = computed(() => {
  const end = dayjs().format('YYYY-MM-DD')
  return ['日', '周', '月', '年', '自定义'].map((label) => ({
    label,
    timeLimit: [null, end],
    disabledDate: (time: Date) => disableTomorrowAndFuture(time)
  }))
})

const formatNum = (n: any) => {
  const v = Number(n)
  return Number.isFinite(v) ? v.toLocaleString() : '-'
}

const extractPayload = (res: any) => {
  if (res?.data && !Array.isArray(res.data) && typeof res.data === 'object') {
    return res.data
  }
  return res || {}
}

const fetchByVersion = async () => {
  const menuId = dataValue.value?.menuId
  if (!menuId) return

  loading.value = true
  try {
    const res: any = await getPatternAnalysisByVersion({ menuId })
    const payload = extractPayload(res)
    const list = Array.isArray(payload.data) ? payload.data : []

    cardData.value = {
      maxDailyVisits: formatNum(payload.maxDayVisits),
      totalVisits: formatNum(payload.totalVisits),
      totalUsers: formatNum(payload.totalVisitsIds),
      avgDailyVisits: '-',
      avgDailyUsers: '-'
    }

    const xAxisData = list.map((item: any) => item.version || '未知版本')
    const seriesData = list.map((item: any) => Number(item.visits || 0))

    renderChart(xAxisData, seriesData)
  } catch (e) {
    console.error(e)
    renderChart([], [])
  } finally {
    loading.value = false
  }
}

const fetchByDay = async () => {
  const menuId = dataValue.value?.menuId
  if (!menuId) return

  const { startDate, endDate } = timeRange.value

  loading.value = true
  try {
    const res: any = await getPatternAnalysisByDay({ menuId, startDate, endDate })
    const payload = extractPayload(res)
    const list = Array.isArray(payload.data) ? payload.data : []

    cardData.value = {
      maxDailyVisits: formatNum(payload.maxDayVisits),
      totalVisits: formatNum(payload.totalVisits),
      totalUsers: formatNum(payload.totalVisitsIds),
      avgDailyVisits: formatNum(payload.avgDayVisits),
      avgDailyUsers: formatNum(payload.avgUser)
    }

    const xAxisData = list.map((item: any) => item.archiveDay || item.day || '')
    const seriesData = list.map((item: any) => Number(item.visits || 0))

    renderChart(xAxisData, seriesData)
  } catch (e) {
    console.error(e)
    renderChart([], [])
  } finally {
    loading.value = false
  }
}

const openView = (item: any = {}, type: string = 'view') => {
  detailsRef?.value?.openDrawer(async () => {
    loading.value = true

    dataValue.value = { ...new DataItem(), ...item }
    bukValue.value = cloneDeep(dataValue.value)
    viewType.value = type
    activeTab.value = 'version'

    // 初始化时重置为 7 天
    const defaultStart = dayjs().subtract(6, 'day').format('YYYY-MM-DD')
    const defaultEnd = dayjs().format('YYYY-MM-DD')
    timeRange.value = { startDate: defaultStart, endDate: defaultEnd }
    timeRangeDisplay.value = `${defaultStart} 至 ${defaultEnd}`
    activeTimeLabel.value = '7天'

    await nextTick()

    setTimeout(async () => {
      initChart()
      await fetchByVersion()
    }, 350)
  })
}

const closeDrawer = () => {
  detailsRef?.value?.close()
}

// [核心修改] 切换 Tab 的逻辑
const handleTabChange = (tab: 'version' | 'time') => {
  activeTab.value = tab

  if (tab === 'time') {
    // 强制重置为默认的 7 天
    const defaultStart = dayjs().subtract(6, 'day').format('YYYY-MM-DD')
    const defaultEnd = dayjs().format('YYYY-MM-DD')

    // 1. 重置数据状态
    timeRange.value = { startDate: defaultStart, endDate: defaultEnd }
    timeRangeDisplay.value = `${defaultStart} 至 ${defaultEnd}`

    // 2. 重置 UI 选中状态 (TimeFilter 组件重新渲染时会读取此值)
    activeTimeLabel.value = '7天'

    // 3. 使用重置后的参数发起请求
    fetchByDay()
  } else {
    fetchByVersion()
  }
}

const handleTimeChange = (val: any, option: any) => {
  if (option?.label === '日' || (typeof val === 'string' && val.includes('-'))) {
    const dateStr = Array.isArray(val) ? val[0] : val
    timeRange.value = { startDate: dateStr, endDate: dateStr }
    timeRangeDisplay.value = dateStr

    activeTimeLabel.value = option?.label === '日' ? '日' : '自定义'
  } else if (Array.isArray(val) && val.length === 2) {
    timeRange.value = { startDate: val[0], endDate: val[1] }
    timeRangeDisplay.value = `${val[0]} 至 ${val[1]}`

    activeTimeLabel.value = option?.label || '自定义'
  }

  // 只有在 time tab 下才刷新，避免干扰
  if (activeTab.value === 'time') {
    fetchByDay()
  }
}

const initChart = () => {
  if (!chartRef.value) return
  if (myChart) myChart.dispose()
  myChart = echarts.init(chartRef.value)

  if (!resizeObserver) {
    resizeObserver = new ResizeObserver(() => {
      myChart?.resize()
    })
    resizeObserver.observe(chartRef.value)
  }
}

const renderChart = (xData: string[], sData: number[]) => {
  if (!myChart && chartRef.value) {
    initChart()
  }
  if (!myChart) return

  myChart.clear()

  const option = {
    legend: {
      show: true,
      data: ['访问量'],
      top: 0,
      itemGap: 20,
      textStyle: {
        color: '#666'
      }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(50, 50, 50, 0.8)',
      borderColor: 'rgba(50, 50, 50, 0.8)',
      textStyle: { color: '#fff' },
      formatter: (params: any) => {
        const item = params[0]
        const val = Number(item.value).toLocaleString()
        return `
          <div style="margin-bottom: 5px;">${item.name}</div>
          <div>
            <span style="display:inline-block;margin-right:5px;border-radius:50%;width:6px;height:6px;background-color:#0064FF;"></span>
            访问量: <span style="font-weight:bold; margin-left: 10px">${val}</span>
          </div>
        `
      }
    },
    grid: {
      left: '2%',
      right: '5%',
      bottom: '3%',
      top: '12%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xData,
      axisLine: { lineStyle: { color: '#E5E5E5' } },
      axisTick: { show: false },
      axisLabel: { color: '#999999', fontSize: 12 }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#F0F2F5', type: 'solid' } },
      axisLabel: { color: '#999999' }
    },
    series: [
      {
        name: '访问量',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        showSymbol: false,
        itemStyle: {
          color: '#fff',
          borderColor: '#0064FF',
          borderWidth: 2
        },
        lineStyle: { width: 2, color: '#0064FF' },
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0, 100, 255, 0.1)' },
            { offset: 1, color: 'rgba(0, 100, 255, 0)' }
          ])
        },
        data: sData
      }
    ]
  }
  myChart.setOption(option, { notMerge: true })
}

onUnmounted(() => {
  resizeObserver?.disconnect()
  myChart?.dispose()
})

defineExpose({ openView })

provide('VisitorstatisticsDetails', {
  dataValue,
  activeTab,
  viewType,
  bukValue,
  title: customTitle
})
</script>

<style lang="scss" scoped>
@use './styles.scss';

.details-container {
  padding: 0 10px;
  overflow-x: hidden;
  /* 确保 loading 遮罩层能正确覆盖 */
  min-height: 400px;
}

.header-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #f0f2f5;
  padding-bottom: 0px;
  min-height: 40px;

  .tabs {
    display: flex;
    gap: 30px;

    .tab-item {
      font-size: 14px;
      color: #666;
      cursor: pointer;
      padding-bottom: 10px;
      position: relative;
      font-weight: 500;

      &.active {
        color: #0064ff;

        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: #0064ff;
          border-radius: 2px;
        }
      }
    }
  }

  .filter-wrapper {
    display: flex;
    align-items: center;
    padding-bottom: 5px;

    .filter-label {
      font-size: 12px;
      color: #999;
      margin-right: 10px;
    }
  }
}

.cards-section {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 30px;

  .stat-card {
    flex: 0 1 270px;
    box-sizing: border-box;
    background: #ffffff;
    border: 1px solid #e5e5e5;
    border-radius: 8px;
    padding: 20px 24px;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.02);

    .label {
      font-size: 12px;
      color: #666666;
      margin-bottom: 12px;
    }

    .value {
      font-size: 24px;
      font-weight: 500;
      color: #333333;
      font-family: Arial, sans-serif;
    }
  }
}

.chart-section {
  .chart-container {
    width: 100%;
    height: 350px;
  }
}
</style>
