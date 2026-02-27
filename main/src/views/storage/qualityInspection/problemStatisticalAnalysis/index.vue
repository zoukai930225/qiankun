<template>
  <ex-screen class="dashboard-container">
    <div class="dashboard-content-container">
      <div class="filter-bar">
        <el-form class="filter-form" :inline="true" :model="queryParams" label-width="70px">
          <el-form-item label="抽检日期" class="each-form">
            <el-date-picker
              style="width: 240px"
              v-model="queryParams.inspectionTimeRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              @change="handleQuery"
            />
          </el-form-item>
        </el-form>
      </div>

      <div class="content">
        <div class="top-row">
          <div class="chart-card">
            <div class="chart-header">
              <span class="chart-title">问题数量 TOP10</span>
            </div>
            <div class="chart-body" v-loading="loading">
              <Empty v-if="isTop10Empty" description="暂无数据" />
              <div v-else ref="topBarRef" class="chart-instance"></div>
            </div>
          </div>

          <div class="chart-card">
            <div class="chart-header">
              <span class="chart-title">问题占比 TOP10</span>
            </div>
            <div class="chart-body" v-loading="loading">
              <Empty v-if="isTop10Empty" description="暂无数据" />
              <div v-else ref="pieRef" class="chart-instance"></div>
            </div>
          </div>
        </div>

        <div class="bottom-row">
          <div class="chart-card full-width">
            <div class="section-header">
              <span class="chart-title">疵点问题明细</span>
              <el-button type="primary" :loading="exportLoading" @click="handleExport">
                导出
              </el-button>
            </div>
            <div class="chart-body bottom-body" v-loading="loading">
              <Empty v-if="isBottomEmpty" description="暂无数据" />
              <div v-else ref="bottomBarRef" class="chart-instance bottom-chart"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ex-screen>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import dayjs from 'dayjs'
import download from '@/utils/download'
import { getDictLabel } from '@/utils/dict'
import { useMessage } from '@/hooks/web/useMessage'
import Empty from '@/components/SWTable/src/empty.vue' // 引入指定的 Empty 组件
import {
  exportProblemStatisticalAnalysis,
  getProblemStatisticalAnalysis,
  getProblemStatisticalAnalysisTop10
} from '@/api/storage/qualityInspection/problemStatisticalAnalysis'

// DOM 引用
const topBarRef = ref<HTMLElement | null>(null)
const pieRef = ref<HTMLElement | null>(null)
const bottomBarRef = ref<HTMLElement | null>(null)

const message = useMessage()

// 挂载状态标记，防止异步回调报错
const isMounted = ref(false)

// 空状态标记
const isTop10Empty = ref(false)
const isBottomEmpty = ref(false)

const queryParams = ref<{ inspectionTimeRange: string[] }>({
  inspectionTimeRange: []
})

const loading = ref(false)
const exportLoading = ref(false)

// ECharts 实例
let topBarChart: echarts.ECharts | null = null
let pieChart: echarts.ECharts | null = null
let bottomBarChart: echarts.ECharts | null = null

// --- 颜色配置 ---

// 1. 左上角：橙色渐变
const orangeGradient = new echarts.graphic.LinearGradient(0, 0, 1, 0, [
  { offset: 0, color: '#FFA940' },
  { offset: 1, color: '#FFD666' }
])

// 2. 底部：蓝色渐变
const blueGradient = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
  { offset: 0, color: '#77B5FF' },
  { offset: 1, color: '#287CFD' }
])

// 3. 饼图颜色
const pieColors = [
  '#EB3737',
  '#FA628A',
  '#38CFA2',
  '#0164FF',
  '#FFA500',
  '#FFD10C',
  '#49BFFF',
  '#B6D633',
  '#9737EB',
  '#515272'
]

// --- 图表初始化 ---

const getInspectionTimeQuery = () => {
  const range = queryParams.value.inspectionTimeRange || []
  const [begin, end] = range
  return {
    inspectionTimeBegin: begin || '',
    inspectionTimeEnd: end || ''
  }
}

const normalizeList = (res: any): any[] => {
  if (Array.isArray(res)) return res
  if (Array.isArray(res?.records)) return res.records
  if (Array.isArray(res?.list)) return res.list
  if (Array.isArray(res?.data)) return res.data
  return []
}

const defectLabel = (val: any) => {
  const key = val === null || val === undefined ? '' : String(val)
  return getDictLabel('inspection_info_defect', key) || key
}

type DefectStatItem = {
  name: string
  value: number
  defectType?: string
  defectRate?: number | null
}

// 1. 初始化左上角横向柱状图
const initTopBarChart = (pairs: DefectStatItem[]) => {
  if (!topBarRef.value) return
  if (topBarChart && topBarChart.isDisposed()) topBarChart = null
  if (!topBarChart) topBarChart = echarts.init(topBarRef.value)

  const yData = pairs.map((p) => p.name)
  const xData = pairs.map((p) => p.value)

  const option: echarts.EChartsOption = {
    grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: {
      type: 'value',
      splitLine: {
        show: true,
        lineStyle: { type: 'dashed', color: '#E0E6F1' }
      },
      axisLabel: { color: '#999' }
    },
    yAxis: {
      type: 'category',
      data: yData,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#666', fontWeight: 500 },
      inverse: true
    },
    series: [
      {
        name: '问题数量',
        type: 'bar',
        data: xData,
        barWidth: 12,
        label: {
          show: true,
          position: 'right',
          color: '#FFA940',
          fontWeight: 'bold'
        },
        itemStyle: {
          color: orangeGradient,
          borderRadius: [0, 50, 50, 0]
        },
        showBackground: true,
        backgroundStyle: {
          color: '#F5F7FA',
          borderRadius: [0, 50, 50, 0]
        }
      }
    ]
  }
  topBarChart.setOption(option, { notMerge: true })
}

// 2. 初始化右上角饼图
const initPieChart = (pairs: DefectStatItem[]) => {
  if (!pieRef.value) return
  if (pieChart && pieChart.isDisposed()) pieChart = null
  if (!pieChart) pieChart = echarts.init(pieRef.value)

  const data = pairs.slice(0, 10)

  const option: echarts.EChartsOption = {
    color: pieColors,
    tooltip: {
      trigger: 'item',
      formatter: (p: any) => {
        const n = p?.name ?? ''
        const v = p?.value ?? 0
        const rate = p?.data?.defectRate
        if (rate !== null && rate !== undefined && rate !== '') {
          return `${n}<br/>数量：${v}<br/>占比：${Number(rate).toFixed(2)}%`
        }
        return `${n}<br/>数量：${v}<br/>占比：${p.percent}%`
      }
    },
    legend: {
      orient: 'vertical',
      left: '12%',
      top: 'center',
      itemWidth: 12,
      itemHeight: 12,
      textStyle: { color: '#666' }
    },
    series: [
      {
        name: '问题占比',
        type: 'pie',
        radius: '75%',
        center: ['60%', '50%'],
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 2
        },
        label: { show: false },
        data
      }
    ]
  }
  pieChart.setOption(option, { notMerge: true })
}

// 3. 初始化底部纵向柱状图
const initBottomBarChart = (categories: string[], values: number[]) => {
  if (!bottomBarRef.value) return
  if (bottomBarChart && bottomBarChart.isDisposed()) bottomBarChart = null
  if (!bottomBarChart) bottomBarChart = echarts.init(bottomBarRef.value)

  const option: echarts.EChartsOption = {
    grid: {
      top: '40px',
      left: '20px',
      right: '20px',
      bottom: '45px',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    // --- 核心修改部分 ---
    dataZoom:
      categories.length > 12
        ? [
            {
              type: 'slider',
              height: 14,
              bottom: 10,
              // 增加左右边距，防止 startValue/endValue 文字被画布边缘截断
              left: 80,
              right: 80
              // 如果你希望直接隐藏滑动条两边的文字（因为X轴已经有文字了），可以取消下面这行的注释
              // showDetail: false
            }
          ]
        : [],
    // ------------------
    xAxis: {
      type: 'category',
      data: categories,
      axisLabel: {
        fontSize: 10,
        color: '#999',
        interval: 0,
        // 数据量大时旋转文字，避免重叠
        rotate: categories.length > 12 ? 25 : 0
      },
      axisTick: { alignWithLabel: true, show: false },
      axisLine: { lineStyle: { color: '#E0E6F1' } }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: { type: 'dashed', color: '#E0E6F1' }
      },
      axisLabel: { color: '#999' }
    },
    series: [
      {
        name: '问题数量',
        type: 'bar',
        barWidth: 30,
        data: values,
        itemStyle: {
          color: blueGradient, // 确保这个变量在外部已定义
          borderRadius: [4, 4, 0, 0]
        },
        label: { show: false }
      }
    ]
  }
  bottomBarChart.setOption(option, { notMerge: true })
}

const setChartsLoading = (val: boolean) => {
  const charts = [topBarChart, pieChart, bottomBarChart].filter(
    (c) => c && !c.isDisposed()
  ) as echarts.ECharts[]

  charts.forEach((c) =>
    val ? c.showLoading('default', { maskColor: 'rgba(255,255,255,0.55)' }) : c.hideLoading()
  )
}

const handleQuery = async () => {
  if (!isMounted.value) return
  loading.value = true
  setChartsLoading(true)
  try {
    const query = getInspectionTimeQuery()

    // --- 1) TOP10 数据获取与处理 ---
    const top10Res = await getProblemStatisticalAnalysisTop10(query).catch(() => [])
    if (!isMounted.value) return

    const top10List = normalizeList(top10Res)
      .map((it: any) => {
        const rawType = it?.defectType ?? it?.defectCode ?? it?.value ?? it?.code ?? it?.name ?? ''
        const qty = Number(it?.defectQuantity ?? it?.count ?? it?.qty ?? it?.quantity ?? 0) || 0
        const rate =
          it?.defectRate === null || it?.defectRate === undefined ? null : Number(it.defectRate)
        return {
          defectType: String(rawType ?? ''),
          name: defectLabel(rawType),
          value: qty,
          defectRate: Number.isFinite(rate as number) ? (rate as number) : null
        } as DefectStatItem
      })
      .sort(
        (a: any, b: any) => (Number(a?.rank) || 0) - (Number(b?.rank) || 0) || b.value - a.value
      )
      .slice(0, 10)

    // 判断是否有数据
    isTop10Empty.value = top10List.length === 0

    if (!isTop10Empty.value) {
      nextTick(() => {
        initTopBarChart(top10List)
        initPieChart(top10List)
      })
    } else {
      // 核心修改：数据为空导致 v-if 销毁 DOM 时，必须销毁实例并置空引用
      // 否则下次有数据时，实例仍绑定在不存在的旧 DOM 上，无法渲染
      if (topBarChart) {
        topBarChart.dispose()
        topBarChart = null
      }
      if (pieChart) {
        pieChart.dispose()
        pieChart = null
      }
    }

    // --- 2) 明细数据获取与处理 ---
    const allDataRes = await getProblemStatisticalAnalysis(query).catch(() => [])
    if (!isMounted.value) return

    const allList = normalizeList(allDataRes)

    // 判断底部是否有数据
    isBottomEmpty.value = allList.length === 0

    if (!isBottomEmpty.value) {
      const rows = allList
        .map((it: any) => {
          const rawType = it?.defectType ?? it?.defectCode ?? it?.value ?? it?.code ?? ''
          const qty = Number(it?.defectQuantity ?? it?.count ?? it?.qty ?? it?.quantity ?? 0) || 0
          const rank = Number(it?.rank ?? 0) || 0
          return { rawType: String(rawType ?? ''), label: defectLabel(rawType), qty, rank }
        })
        .sort((a, b) => (a.rank || 0) - (b.rank || 0) || b.qty - a.qty)

      const categories = rows.map((r) => r.label)
      const values = rows.map((r) => r.qty)

      nextTick(() => {
        initBottomBarChart(categories, values)
      })
    } else {
      // 核心修改：同上，销毁底部图表实例
      if (bottomBarChart) {
        bottomBarChart.dispose()
        bottomBarChart = null
      }
    }
  } finally {
    if (isMounted.value) {
      setChartsLoading(false)
      loading.value = false
    }
  }
}
const handleExport = async () => {
  if (exportLoading.value) return
  exportLoading.value = true
  try {
    const query = getInspectionTimeQuery()
    const res = await exportProblemStatisticalAnalysis(query)
    if (res) {
      const [b, e] = queryParams.value.inspectionTimeRange || []
      const suffix = b && e ? `${b}_${e}` : dayjs().format('YYYY-MM-DD')
      download.excel(res as any, `疵点统计_${suffix}.xlsx`)
      message.success('导出成功')
    }
  } finally {
    exportLoading.value = false
  }
}

const handleResize = () => {
  if (!isMounted.value) return
  topBarChart?.resize()
  pieChart?.resize()
  bottomBarChart?.resize()
}

onMounted(() => {
  isMounted.value = true
  nextTick(() => {
    handleQuery()
    window.addEventListener('resize', handleResize)
  })
})

onUnmounted(() => {
  isMounted.value = false
  window.removeEventListener('resize', handleResize)
  topBarChart?.dispose()
  pieChart?.dispose()
  bottomBarChart?.dispose()
  topBarChart = null
  pieChart = null
  bottomBarChart = null
})
</script>

<style lang="scss" scoped>
:deep(.ex-screen) {
  border-color: transparent !important;
}
.dashboard-container {
  width: 100%;
  background-color: #eff1f7;
  border-color: transparent !important;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  box-sizing: border-box;
  :deep(.list_body) {
    padding: 0 !important;
  }
  .dashboard-content-container {
    height: 100%;
  }
}

.filter-bar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0px 2px 6px 0px rgba(52, 52, 52, 0.03);
  margin-bottom: 20px;

  .filter-form {
    flex: 1;
    min-width: 0;
  }

  :deep(.el-form-item) {
    margin: 0;
  }

  :deep(.el-input__wrapper) {
    box-shadow: none;
    border: 1px solid #e5e5e5;

    &:hover {
      border-color: #0064ff;
    }
  }
}

.chart-card {
  background: #ffffff;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  opacity: 1;
  background: #ffffff;
  box-sizing: border-box;
  border: 1px solid #e6eaeb;
}

.chart-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  line-height: 1;
}

.chart-header {
  display: flex;
  align-items: center;
  padding: 20px;
}

.top-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  height: 360px;
}

.top-row .chart-card:nth-child(1) {
  flex: 5; /* 优化 flex 比例 */
}

.top-row .chart-card:nth-child(2) {
  flex: 3;
}

.bottom-row {
  display: flex;
  height: 420px;
}

.bottom-row .chart-card {
  width: 100%;
}

.chart-body {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  position: relative;
  /* 确保 Empty 组件居中 */
  justify-content: center;
}

.chart-instance {
  flex: 1;
  width: 100%;
  min-height: 0;
  height: 100%;
}

.bottom-body {
  padding-top: 2px;
  padding-bottom: 10px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  border-bottom: 1px solid #e6eaeb;
}

.content {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
}
</style>
