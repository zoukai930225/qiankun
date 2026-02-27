<template>
  <div ref="chartRef" class="chart-container"></div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import { debounce } from 'lodash-es'
import type { ChartDataItem } from '../../type'

const props = defineProps({
  chartData: {
    type: Array as () => ChartDataItem[],
    default: () => []
  },
  activeType: {
    type: Number,
    default: 0
  }
})

// 图表引用
const chartRef = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null

// 初始化默认数据（用于开发测试）
const getDefaultData = () => {
  const months = ['2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06',
    '2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12']

  // 模拟人均停留时长数据（秒），范围约在45-75之间
  const viewsData = [60, 70, 65, 58, 52, 57, 65, 72, 68, 55, 60, 65]

  // 模拟同行同层均值数据，范围约在40-60之间
  const ratioData = [50, 55, 58, 48, 45, 42, 50, 53, 47, 49, 45, 47]

  return {
    xAxisData: months,
    viewsData,
    ratioData
  }
}

// 创建图表选项配置
const createChartOptions = (xData: string[], viewsData: number[], ratioData: number[]) => {
  // 根据激活类型确定图例名称
  const legendNames = props.activeType === 0
    ? ['完播率（%）', '同行同层均值（%）']
    : ['平均观看时长（秒）', '同行同层均值（秒）']

  return {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(36,36,38,0.68)',
      borderWidth: 0,
      textStyle: {
        color: '#ffffff',
        fontSize: 14
      },
      padding: [12, 12]
    },
    legend: {
      data: legendNames,
      top: 10,
      left: 'center',
      icon: 'rect',
      itemWidth: 20,
      itemHeight: 10,
      textStyle: {
        color: '#666',
        fontSize: 14,
        rich: {
          a: {
            verticalAlign: 'middle',
          }
        },
        padding: [0, 0, -2, 0]
      },
      itemGap: 30,
      align: 'auto',
      symbolKeepAspect: true,
      formatter: (name: any) => {
        return name;
      }
    },
    grid: {
      left: '1%',
      right: '2%',
      bottom: '3%',
      top: 50,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xData,
      axisLine: {
        show: true,
        lineStyle: {
          color: '#F0F0F0'
        }
      },
      axisLabel: {
        color: '#666',
        fontSize: 14,
        fontWeight: 400
      },
      axisTick: {
        show: false
      }
    },
    yAxis: [
      {
        type: 'value',
        // 移除名称
        position: 'left',
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: '#E2E8EE'
          }
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: '#666',
          fontSize: 14
        },
        interval: 15, // 设置刻度间距为15
        min: 0, // 确保从0开始
        max: (value: { max: number }) => {
          // 向上取整到最近的15的倍数
          return Math.ceil(value.max / 15) * 15
        }
      }
    ],
    series: [
      {
        name: legendNames[0],
        type: 'line',
        data: viewsData,
        smooth: 0.5,
        symbol: 'emptyCircle',
        showSymbol: false, // 默认不显示符号
        symbolSize: 8,
        emphasis: {
          scale: true,
          focus: 'series'
        },
        itemStyle: {
          color: '#0064FF'
        },
        lineStyle: {
          width: 2,
          color: '#0064FF'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(0, 100, 255, 0.3)' },
              { offset: 1, color: 'rgba(0, 100, 255, 0)' }
            ]
          }
        },
        tooltip: {
          valueFormatter: (value: any) => {
            return `${value}${props.activeType === 0 ? '%' : ''}`
          }
        }
      },
      {
        name: legendNames[1],
        type: 'line',
        data: ratioData,
        smooth: 0.5,
        symbol: 'emptyCircle',
        showSymbol: false, // 默认不显示符号
        symbolSize: 8,
        emphasis: {
          scale: true,
          focus: 'series'
        },
        itemStyle: {
          color: '#39D29F'
        },
        lineStyle: {
          width: 2,
          color: '#39D29F'
        },
        tooltip: {
          valueFormatter: (value: any) => {
            return `${value}${props.activeType === 0 ? '%' : ''}`
          }
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(57, 210, 159, 0.3)' },
              { offset: 1, color: 'rgba(57, 210, 159, 0)' }
            ]
          }
        }
      }
    ]
  }
}

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return

  // 如果已有实例则销毁
  if (chartInstance) {
    chartInstance.dispose()
  }

  // 创建ECharts实例
  chartInstance = echarts.init(chartRef.value)

  // 获取数据并更新图表
  updateChart()

  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
}

const handleResize = debounce(() => {
  if (chartInstance) {
    chartInstance.resize()
  }
}, 200)

// 更新图表数据
const updateChart = () => {
  if (!chartInstance) return

  let xData: string[] = []
  let viewsData: number[] = []
  let ratioData: number[] = []

  if (props.chartData && props.chartData.length > 0) {
    xData = props.chartData.map(item => item.date)
    viewsData = props.chartData.map(item => item.views)
    ratioData = props.chartData.map(item => item.ratio)
  } else {
    // 无数据时使用默认数据
    const defaultData = getDefaultData()
    xData = defaultData.xAxisData
    viewsData = defaultData.viewsData
    ratioData = defaultData.ratioData
  }

  // 设置图表配置
  const options = createChartOptions(xData, viewsData, ratioData)

  // 更新图表
  chartInstance.setOption(options, true)
}

// 监听数据变化
watch(
  () => props.chartData,
  () => {
    updateChart()
  },
  { deep: true }
)

// 监听激活类型变化
watch(
  () => props.activeType,
  () => {
    updateChart()
  }
)

// 组件挂载时初始化
onMounted(() => {
  initChart()
})

// 组件卸载时清理
onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<style lang="scss" scoped>
.chart-container {
  width: 100%;
  height: calc(100Vh - 455px) // 设置图表高度为581px
}
</style>
