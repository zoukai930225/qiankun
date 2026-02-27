<template>
  <div class="column items-end charts-part">
    <el-button-group>
      <el-button :class="{ active: chartType === 1 }" @click="handleChengChartType(1)"
        ><bar-line
      /></el-button>
      <el-button :class="{ active: chartType === 2 }" @click="handleChengChartType(2)"
        ><Line
      /></el-button>
      <el-button :class="{ active: chartType === 3 }" @click="handleChengChartType(3)"
        ><Bar
      /></el-button>
    </el-button-group>
    <!-- 图表容器 -->
    <div ref="chartDomRef" v-loading="loading" class="w-100% h-252px"></div>
  </div>
</template>
<script lang="ts" setup>
import { supplierLedgerTrend } from '@/api/supplier/supplierData'
import * as echarts from 'echarts'
import barLine from '@/assets/svgs/supplier/bar-line.vue'
import Line from '@/assets/svgs/supplier/line.vue'
import Bar from '@/assets/svgs/supplier/bar.vue'
import { formatDate } from '@/utils/formatTime'

interface Props {
  params: Pick<
    Supplier.Ledger.Request,
    'supplierId' | 'goodsNo' | 'purchaseTimeStart' | 'purchaseTimeEnd'
  >
  api?: (...arg: any[]) => Promise<any>
}
const props = withDefaults(defineProps<Props>(), {
  api: supplierLedgerTrend
})
const chartDomRef = ref<HTMLDivElement | null>(null)
const chartsData = ref<
  {
    date: string
    purchaseNum: number
    stockInNum: number
  }[]
>([])
let chartInstance: echarts.ECharts | null = null
const loading = ref(false)
const chartType = ref(1)
const datazoomStart = ref(0)
const datazoomEnd = ref(100)

const timer = ref<NodeJS.Timeout>()

const dates = computed(() => chartsData.value.map((ele) => ele.date) || [])
const purchaseNum = computed(() => chartsData.value.map((ele) => ele.purchaseNum) || [0])
const stockInNum = computed(() => chartsData.value.map((ele) => ele.stockInNum) || [0])

const getData = () => {
  if (timer.value) {
    loading.value = true
    clearTimeout(timer.value)
  }

  timer.value = setTimeout(async () => {
    try {
      const res = await props.api(props.params)
      chartsData.value = Array.isArray(res) ? res : res.data || []
      await nextTick()
      renderChart()
    } catch (error) {
      console.error('图表数据请求失败:', error)
      chartsData.value = []
      renderChart()
    } finally {
      loading.value = false
      if (timer.value) clearTimeout(timer.value)
    }
  }, 1000)
}

const calculateYAxisConfig = (data: number[]) => {
  const validData = data.filter((num) => !isNaN(num))
  if (validData.length === 0) return { max: 100, min: 0, interval: 20 }

  const maxNumber = Math.max(...validData)
  const minNumber = Math.min(...validData)

  const calculateCeiling = (value: number): number => {
    if (value === 0) return 1
    if (value < 0) return 0

    const orderOfMagnitude = Math.floor(Math.log10(value))
    const baseValue = Math.pow(10, orderOfMagnitude)
    const coefficient = value / baseValue

    const coefficients = [1, 1.5, 2, 2.5, 5, 10]
    let ceilingCoeff = coefficients.find((coeff) => coeff >= coefficient) || 10

    if (ceilingCoeff * baseValue === value) {
      ceilingCoeff += 0.5
    }

    return ceilingCoeff * baseValue
  }

  const calculateFloor = (value: number): number => {
    if (value >= 0) return 0

    const absValue = -value
    const orderOfMagnitude = Math.floor(Math.log10(absValue))
    const baseValue = Math.pow(10, orderOfMagnitude)
    const coefficient = absValue / baseValue

    const coefficients = [1, 1.5, 2, 2.5, 5, 10]
    let floorCoeff = coefficients.find((coeff) => coeff >= coefficient) || 10

    if (floorCoeff * baseValue === absValue) {
      floorCoeff += 0.5
    }

    return -floorCoeff * baseValue
  }

  const max = calculateCeiling(maxNumber)
  const min = minNumber <= 0 ? calculateFloor(minNumber) : 0
  const interval = (max - min) / 5

  return { max, min, interval }
}

const series = computed(() => {
  const value = [
    {
      name: '采购数量',
      type: 'bar',
      barMaxWidth: 50,
      barWidth: '30%',
      label: {
        show: false
      },
      data: purchaseNum.value.length === 0 ? [0] : purchaseNum.value,
      yAxisIndex: 0,
      itemStyle: { color: '#0064ff', borderRadius: [2, 2, 2, 2] }
    },
    {
      name: '采购数量',
      type: 'line',
      smooth: true,
      label: {
        show: false
      },
      showSymbol: false,
      data: purchaseNum.value.length === 0 ? [0] : purchaseNum.value,
      yAxisIndex: 0,
      emphasis: {
        focus: 'series'
      },
      itemStyle: { color: '#39d29f' },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgba(57, 210, 159, 0.5)'
          },
          {
            offset: 1,
            color: 'rgba(57, 210, 159, 0)'
          }
        ])
      }
    },
    {
      name: '入库量',
      type: 'bar',
      barMaxWidth: 50,
      barWidth: '30%',
      label: {
        show: false
      },
      data: stockInNum.value.length === 0 ? [0] : stockInNum.value,
      yAxisIndex: 1,
      itemStyle: { color: '#ffa500', borderRadius: [2, 2, 2, 2] }
    },
    {
      name: '入库量',
      type: 'line',
      smooth: true,
      label: {
        show: false
      },
      data: stockInNum.value.length === 0 ? [0] : stockInNum.value,
      yAxisIndex: 1,
      showSymbol: false,
      itemStyle: { color: '#FFA9A9' },
      emphasis: {
        focus: 'series'
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: '#F7CB4B20'
          },
          {
            offset: 1,
            color: '#F7CB4B00'
          }
        ])
      }
    }
  ]

  switch (chartType.value) {
    case 1:
      return value
    case 2:
      return value.filter((ele) => ele.type === 'line')
    case 3:
      return value.filter((ele) => ele.type === 'bar')
  }
})

const getChartOption = computed(() => {
  const yAxis1Config = calculateYAxisConfig(purchaseNum.value)
  const yAxis2Config = calculateYAxisConfig(stockInNum.value)
  return {
    title: {
      textAlign: 'center',
      left: '50%',
      textStyle: { fontWeight: 'normal', fontSize: 16 }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params) => {
        const xLabel = params[0]?.name || ''
        const barDataList = params.filter(
          (item) => item.seriesType === `${chartType.value === 2 ? 'line' : 'bar'}`
        )

        let tooltipHTML = `<div style="margin-bottom: 4px;">${xLabel}</div>`
        barDataList.forEach((item) => {
          tooltipHTML += `
            <div style="display: flex; align-items: center; margin: 2px 0;">
              <span style="display: inline-block; width: 10px; height: 10px; 
                background: ${item.color}; border-radius: 5px; margin-right: 6px;">
              </span>
              <div class="flex justify-between w-100%">
                ${item.seriesName}：
                <div class="font-600">${new Intl.NumberFormat().format(item.value)}</div>
              </div>
            </div>
          `
        })
        return tooltipHTML
      }
    },
    dataZoom: [
      {
        type: 'slider',
        show: true,
        realtime: true,
        start: 0,
        end: 100
      },
      {
        type: 'inside',
        realtime: true,
        start: 0,
        end: 100
      }
    ],
    grid: {
      top: '47px',
      left: '5%',
      right: '5%',
      bottom: '35%'
    },
    legend: {
      data: ['采购数量', '入库量'],
      top: 0,
      left: 'center'
    },
    xAxis: [
      {
        type: 'category',
        position: 'bottom',
        axisTick: { show: false },
        axisLabel: {
          color: '#999',
          formatter: function (value) {
            return value ? formatDate(value, 'MM/DD') : '暂无数据'
          },
          rotate: 45,
          margin: 20,
          align: 'center'
        },
        data: dates.value
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '采购数量',
        ...yAxis1Config,
        axisLine: { show: false }
      },
      {
        type: 'value',
        name: '入库量',
        ...yAxis2Config,
        axisLine: { show: false }
      }
    ],
    series: series.value
  }
})

const handleLegendSelect = ({
  name,
  selected
}: {
  name: string
  selected: Record<string, boolean>
}) => {
  if (!chartInstance) return
  const currentOption = chartInstance.getOption() as any
  const seriesItem = currentOption.series.find((s: any) => s.name === name)
  if (!seriesItem) return
  const currentYAxisIndex = seriesItem.yAxisIndex
  const activeSeries = currentOption.series.filter(
    (s: any) => s.yAxisIndex === currentYAxisIndex && selected[s.name]
  )
  const allData: number[] = []
  activeSeries.forEach((s: any) => {
    switch (s.name) {
      case '采购数量':
        allData.push(...purchaseNum.value)
        break
      case '入库量':
        allData.push(...stockInNum.value)
        break
    }
  })
  const { max, interval } = calculateYAxisConfig(allData)
  currentOption.yAxis[currentYAxisIndex].max = max
  currentOption.yAxis[currentYAxisIndex].interval = interval
  chartInstance.setOption(currentOption, true)
}

function handleDatazoom(params) {
  if (!chartInstance || dates.value.length === 0) return

  const totalDataLength = dates.value.length
  const { start, end } = params.batch?.[0] || params

  datazoomStart.value = start
  datazoomEnd.value = end

  const startIndex = Math.floor((start / 100) * totalDataLength)
  const endIndex = Math.ceil((end / 100) * totalDataLength)

  const visibleInCounts = [...purchaseNum.value].slice(startIndex, endIndex + 1)
  const visibleInAmounts = [...stockInNum.value].slice(startIndex, endIndex + 1)

  const newYAxis1Config = calculateYAxisConfig(visibleInCounts)
  const newYAxis2Config = calculateYAxisConfig(visibleInAmounts)

  const currentOption = chartInstance.getOption() as any
  currentOption.yAxis[0] = { ...newYAxis1Config }
  currentOption.yAxis[1] = { ...newYAxis2Config }

  chartInstance.setOption(currentOption, true)
}

function handleChengChartType(type: number) {
  if (!chartInstance) return
  chartType.value = type
  const currentOption = { ...getChartOption.value } as any

  currentOption.dataZoom[0] = {
    ...currentOption.dataZoom[0],
    start: datazoomStart.value,
    end: datazoomEnd.value
  }

  chartInstance.setOption(currentOption, true)
}

const renderChart = async () => {
  await nextTick()
  const chartDom = chartDomRef.value
  datazoomEnd.value = 100
  datazoomStart.value = 0
  if (!chartDom) {
    console.warn('图表DOM容器不存在，无法渲染')
    return
  }
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
  try {
    chartInstance = echarts.init(chartDom)
    chartInstance.setOption(getChartOption.value, true)
    chartInstance.off('legendselectchanged', handleLegendSelect)
    chartInstance.on('legendselectchanged', handleLegendSelect)
    chartInstance.off('datazoom', handleDatazoom)
    chartInstance.on('datazoom', handleDatazoom)
  } catch (error) {
    console.error('图表渲染失败:', error)
    chartInstance = null
  }
}

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
})

defineExpose({
  getData,
  get loading() {
    return loading.value
  },
  renderChart
})
</script>
<style lang="less" scoped>
@import url(../../index.scss);

.chart-container {
  width: 100%;
  height: 100%;
  min-height: 252px;
}

:deep(.el-loading-mask) {
  display: flex;
  align-items: center;
  justify-content: center;
}

.active {
  background-color: var(--el-button-hover-bg-color);
  border-color: var(--el-button-hover-border-color);
  color: var(--el-button-hover-text-color);
  outline: none;
  fill: var(--el-button-hover-text-color) !important;
  border-right: 1px solid var(--el-button-hover-border-color);

  &:not(&:last-of-type) + .el-button {
    border-left: 1px solid var(--el-button-hover-border-color);
  }
}

.el-button-group {
  // display: none;

  :deep(.el-button) {
    &:not(.active) {
      border-left: -1px;
      border-right: -1px;
    }
  }
}

.charts-part {
  padding: 15px 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
}
</style>
