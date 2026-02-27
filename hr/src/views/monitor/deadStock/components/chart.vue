<template>
  <div class="chart-part">
    <div ref="chartRef" class="chart-container">
      <!-- 图表容器 -->
      <div ref="chartDomRef" class="chart-content"></div>
      <!-- 统计信息 -->
      <div class="sum-up m-auto">
        <div class="sum-item">剩余总货值</div>
        <div class="sum-item">{{ totalCargoValue }}</div>
        <div class="sum-item">已清货值</div>
        <div class="sum-item">{{ yesterdayCargoValue }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="tsx" setup>
import { getChartData } from '@/api/monitor/deadStock'
import { canvasToBlob } from '@/utils/common'
import * as echarts from 'echarts'
import html2canvas from 'html2canvas-plus'
import { categoryOps } from '../options'

const props = defineProps<{
  date: string
  fileName?: string
  title: string
}>()

const chartRef = ref<HTMLDivElement>()
const chartDomRef = ref<HTMLDivElement>()
const totalCargoValue = ref('0 万')
const yesterdayCargoValue = ref('0 万')

// 图表数据
const consumeCargoValueData = ref<number[]>([]) // 消耗货值
const dailyConsumeCargoValueData = ref<number[]>([]) // 每日剩余货值

const message = useMessage()
const file = ref<File | null>(null)
let chartInstance: echarts.ECharts | null = null

// X轴标签
const xAxisLabels = computed(() => categoryOps.map((ele) => ele.label))

/**
 * 计算Y轴最大刻度和间隔
 * @param data 数据源
 */
const calculateYAxisConfig = (data: number[]) => {
  if (!data.length) return { max: 100, interval: 20 }

  const maxNumber = Math.max(...data)
  if (maxNumber <= 0) return { max: 100, interval: 20 }

  const magnitude = Math.floor(Math.log10(maxNumber))
  const baseUnit = Math.pow(10, magnitude)
  const coefficient = maxNumber / baseUnit
  let ceilingCoefficient: number

  if (coefficient <= 1) ceilingCoefficient = 1
  else if (coefficient <= 1.5) ceilingCoefficient = 1.5
  else if (coefficient <= 2) ceilingCoefficient = 2
  else if (coefficient <= 2.5) ceilingCoefficient = 2.5
  else if (coefficient <= 5) ceilingCoefficient = 5
  else ceilingCoefficient = 10

  return {
    max: ceilingCoefficient * baseUnit,
    interval: (ceilingCoefficient * baseUnit) / 5
  }
}

/**
 * 格式化大额数值（转为"万"单位）
 * @param value 原始值
 */
const formatLargeNumber = (value: number | string): string => {
  const num = Number(value) || 0
  return (Math.floor((num / 10000) * 100) / 100).toFixed(2) + ' 万'
}

const getChartOption = () => {
  const yAxis1Config = calculateYAxisConfig(consumeCargoValueData.value)
  const yAxis2Config = calculateYAxisConfig(dailyConsumeCargoValueData.value)

  return {
    title: {
      text: `${props.date} 货值统计图`,
      textAlign: 'center',
      left: '50%',
      textStyle: { fontWeight: 'normal', fontSize: 16 }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      valueFormatter: (val: number) => val + ' 万'
    },
    grid: { top: '20%' },
    legend: {
      data: ['消耗货值', '剩余货值'],
      top: 25
    },
    xAxis: [
      {
        type: 'category',
        data: xAxisLabels.value,
        position: 'bottom',
        axisTick: { alignWithLabel: false },
        axisLabel: { fontWeight: '600', color: '#333' },
        offset: 22
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '消耗货值',
        min: 0,
        ...yAxis1Config,
        nameGap: 23,
        axisLabel: { formatter: '{value} 万' },
        axisLine: { show: true }
      },
      {
        type: 'value',
        name: '剩余货值',
        min: 0,
        ...yAxis2Config,
        nameGap: 23,
        axisLabel: { formatter: '{value} 万' },
        axisLine: { show: true }
      }
    ],
    series: [
      {
        name: '消耗货值',
        type: 'bar',
        barWidth: 45,
        label: { show: true, position: 'bottom', formatter: '{c} 万', offset: [0, 5] },
        data: consumeCargoValueData.value,
        yAxisIndex: 0,
        itemStyle: { color: '#D0DD51' }
      },
      {
        name: '剩余货值',
        type: 'line',
        label: { show: true, position: 'top', formatter: '{c} 万' },
        data: dailyConsumeCargoValueData.value,
        yAxisIndex: 1,
        itemStyle: { color: '#7262FD' }
      }
    ]
  }
}

/**
 * 图例点击事件：动态调整Y轴范围
 */
const handleLegendSelect = ({
  name,
  selected
}: {
  name: string
  selected: Record<string, boolean>
}) => {
  if (!chartInstance) return

  const currentOption = chartInstance.getOption() as any
  const seriesIndex = currentOption.series.findIndex((s: any) => s.name === name)
  if (seriesIndex === -1) return

  const currentYAxisIndex = currentOption.series[seriesIndex].yAxisIndex
  const activeSeries = currentOption.series.filter(
    (s: any) => s.yAxisIndex === currentYAxisIndex && selected[s.name]
  )

  const allData = activeSeries.flatMap((s: any) => {
    switch (s.name) {
      case '消耗货值':
        return consumeCargoValueData.value
      case '剩余货值':
        return dailyConsumeCargoValueData.value
      default:
        return []
    }
  })
  const { max, interval } = calculateYAxisConfig(allData)
  currentOption.yAxis[currentYAxisIndex].max = max
  currentOption.yAxis[currentYAxisIndex].interval = interval
  chartInstance.setOption(currentOption)
}

/**
 * 获取图表数据并更新状态
 */
const fetchChartData = async () => {
  try {
    const response = await getChartData(props.date)

    consumeCargoValueData.value = []
    dailyConsumeCargoValueData.value = []
    totalCargoValue.value = '0.00 万'
    yesterdayCargoValue.value = '0.00 万'

    if (!response) return message.warning(`${props.date} 未查询到数据`)

    const { histogramData, totalCargoValue: total, yesterdayCargoValue: yesterday } = response

    if (histogramData?.length) {
      consumeCargoValueData.value = histogramData.map(
        (item) => Math.round(Number(item.yesterdayCargoValue || 0) / 100) / 100
      )
      dailyConsumeCargoValueData.value = histogramData.map(
        (item) => Math.round(Number(item.totalCargoValue || 0) / 100) / 100
      )
    }
    totalCargoValue.value = formatLargeNumber(total || 0)
    yesterdayCargoValue.value = formatLargeNumber(yesterday || 0)
    await nextTick()
    renderChart()
  } catch (error) {
    message.error(`数据加载失败：${error instanceof Error ? error.message : '未知错误'}`)
    console.error('图表数据获取失败：', error)
  }
}

/**
 * 渲染/更新图表
 */
const renderChart = () => {
  const chartDom = chartDomRef.value
  if (!chartDom) return
  if (chartInstance) {
    chartInstance.dispose()
  }
  chartInstance = echarts.init(chartDom)
  chartInstance.setOption(getChartOption())
  chartInstance.off('legendselectchanged')
  chartInstance.on('legendselectchanged', handleLegendSelect)
}

/**
 * 导出图表为图片
 */
const exportChartAsImage = async () => {
  if (!chartRef.value) return

  try {
    await nextTick()
    const canvas = await html2canvas(chartRef.value)
    const blob = await canvasToBlob(canvas)
    if (!blob) throw new Error('生成图片失败')

    file.value = new File([blob], props.fileName || '图表数据.png', {
      type: blob.type,
      lastModified: Date.now()
    })

    const downloadLink = document.createElement('a')
    downloadLink.href = URL.createObjectURL(blob)
    downloadLink.download = props.fileName || '图表数据.png'
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
    URL.revokeObjectURL(downloadLink.href) // 释放URL对象
  } catch (error) {
    message.error(`导出失败：${error instanceof Error ? error.message : '未知错误'}`)
    console.error('图表导出失败：', error)
  }
}

/**
 * 获取图表图片文件（供外部调用）
 */
const getChartFile = async (): Promise<File | null> => {
  if (!chartRef.value) return null

  try {
    await nextTick()
    const canvas = await html2canvas(chartRef.value)
    const blob = await canvasToBlob(canvas)
    if (!blob) return null

    return new File([blob], props.fileName || '图表数据.png', {
      type: blob.type,
      lastModified: Date.now()
    })
  } catch (error) {
    message.error(`获取文件失败：${error instanceof Error ? error.message : '未知错误'}`)
    return null
  }
}

onMounted(() => {
  fetchChartData()
})

defineExpose({
  exportChart: exportChartAsImage,
  getData: fetchChartData,
  file,
  getFile: getChartFile
})
</script>

<style lang="less" scoped>
.chart-part {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.chart-container {
  width: 100%;
  max-width: 1000px;
  padding: 20px;
  box-sizing: border-box;
}

.chart-content {
  width: 100%;
  height: 400px;
}

.sum-up {
  display: flex;
  width: 100%;
  max-width: 800px;
  margin-top: 20px;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;

  .sum-item {
    flex: 1;
    padding: 12px 0;
    border-right: 1px solid #eee;
    text-align: center;
    color: #333;
    font-size: 14px;

    &:last-of-type {
      border-right: none;
    }
  }
}
</style>
