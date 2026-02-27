<template>
  <el-form>
    <el-row>
      <el-col :span="6">
        <el-form-item label="日期：">
          <el-date-picker
            ref="datePickerRef"
            v-model="dateRange"
            type="daterange"
            value-format="YYYY-MM-DD"
            :clearable="false"
            :disabled-date="disabledDate"
            @change="getData"
            @calendar-change="handleCalendarChange"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
  <div class="chart-part">
    <div ref="chartRef" class="chart">
      <div id="chart_2"></div>
    </div>
  </div>
</template>
<script lang="tsx" setup>
import { opUnsalableGoodsDaily } from '@/api/monitor/deadStock'
import { canvasToBlob } from '@/utils/common'
import { formatDate } from '@/utils/formatTime'
import * as echarts from 'echarts'
import html2canvas from 'html2canvas-plus'

const props = defineProps<{
  date: string
  fileName?: string
  title: string
}>()

const chartRef = ref()
/** 销量 */
const salesData = ref<number[]>([])
/**消耗货值 */
const consumeCargoValueData = ref<number[]>([])
/**剩余库存 */
const remainInventoryData = ref<number[]>([])
/**剩余货值 */
const remainCargoValueData = ref<number[]>([])
const message = useMessage()
const file = ref<File>()
const yesterday = new Date(new Date().setDate(new Date().getDate() - 1))
const queryParams = reactive({
  dataDateStart: '',
  dataDateEnd: formatDate(yesterday, 'YYYY-MM-DD')
})
const datePickerRef = ref()
let chartInstance: echarts.ECharts | null = null

const xAxis = computed(() => {
  const list: string[] = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(queryParams.dataDateEnd)
    date.setDate(date.getDate() - i)
    formatDate(date, 'MM月DD日')
    list.unshift(formatDate(date, 'MM月DD日'))
  }
  return list
})

const dateRange = computed({
  get: () => Object.values(queryParams),
  set: (val) => {
    queryParams.dataDateStart = val[0]
    queryParams.dataDateEnd = val[1]
  }
})

watch(
  () => queryParams.dataDateEnd,
  (val) => {
    const date = new Date(val)
    date.setDate(date.getDate() - 6)
    queryParams.dataDateStart = formatDate(date, 'YYYY-MM-DD')
  },
  {
    immediate: true
  }
)

async function getFile() {
  const canvas = await html2canvas(chartRef.value)
  const blob = await canvasToBlob(canvas)
  file.value = new File([blob], props.fileName || '', {
    type: blob.type,
    lastModified: new Date().getTime()
  })

  return file.value
}

/** 获取图表数据 */
async function getData() {
  try {
    const res = await opUnsalableGoodsDaily(queryParams)

    salesData.value = res.map((item) => item.sales)
    consumeCargoValueData.value = res.map((item) => item.consumeCargoValue)
    remainInventoryData.value = res.map((item) => item.remainInventory)
    remainCargoValueData.value = res.map((item) => item.remainCargoValue)

    await nextTick()
    renderChart()
  } catch (error) {}
}

/**
 * 渲染/更新图表
 */
const renderChart = () => {
  const chartDom = document.getElementById('chart_2')
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
      case '销量':
        return salesData.value
      case '消耗货值':
        return consumeCargoValueData.value
      case '剩余库存':
        return remainInventoryData.value
      case '剩余货值':
        return remainCargoValueData.value
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

const getChartOption = () => {
  const yAxis1Config = calculateYAxisConfig([...salesData.value, ...consumeCargoValueData.value])
  const yAxis2Config = calculateYAxisConfig([
    ...remainInventoryData.value,
    ...remainCargoValueData.value
  ])

  return {
    title: {
      text: props.date,
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
      data: ['销量', '消耗货值', '剩余库存', '剩余货值'],
      top: 25
    },
    xAxis: [
      {
        type: 'category',
        data: xAxis.value,
        position: 'bottom',
        axisTick: { alignWithLabel: false },
        axisLabel: { color: '#333' },
        offset: 22
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '销量/消耗货值',
        min: 0,
        ...yAxis1Config,
        nameGap: 23,
        axisLabel: { formatter: '{value} 万' },
        axisLine: { show: true }
      },
      {
        type: 'value',
        name: '剩余库存/剩余货值',
        min: 0,
        ...yAxis2Config,
        nameGap: 23,
        axisLabel: { formatter: '{value} 万' },
        axisLine: { show: true }
      }
    ],
    series: [
      {
        name: '销量',
        type: 'bar',
        barWidth: 45,
        label: { show: true, position: 'bottom', formatter: '{c} 万', offset: [0, 5] },
        data: salesData.value,
        yAxisIndex: 0,
        itemStyle: { color: '#5DCDF5' }
      },
      {
        name: '消耗货值',
        type: 'bar',
        barWidth: 45,
        label: { show: true, position: 'bottom', formatter: '{c} 万', offset: [0, 5] },
        data: consumeCargoValueData.value,
        yAxisIndex: 0,
        itemStyle: { color: '#0064FF' }
      },
      {
        name: '剩余库存',
        type: 'line',
        label: { show: true, position: 'right', formatter: '{c} 万' },
        data: remainInventoryData.value,
        yAxisIndex: 1,
        itemStyle: { color: '#FFA500' }
      },
      {
        name: '剩余货值',
        type: 'line',
        label: { show: true, position: 'top', formatter: '{c} 万' },
        data: remainCargoValueData.value,
        yAxisIndex: 1,
        itemStyle: { color: '#39D29F' }
      }
    ]
  }
}

function handleCalendarChange(val) {
  queryParams.dataDateEnd = formatDate(val[0], 'YYYY-MM-DD')
  datePickerRef.value.handleClose()
}

function disabledDate(date: Date) {
  return date > yesterday
}

async function exportChart() {
  setTimeout(async () => {
    // 不用定时器传出来的图片不对
    try {
      const canvas = await html2canvas(chartRef.value)
      const img = canvas.toDataURL('image/png')

      const fileName = `${queryParams.dataDateStart}至${queryParams.dataDateEnd} 销量货值分析`

      const blob = await canvasToBlob(canvas)
      file.value = new File([blob], fileName, {
        type: blob.type,
        lastModified: new Date().getTime()
      })

      // 创建一个a标签模拟点击进行下载
      const downloadLink = document.createElement('a')
      downloadLink.id = 'imgDownload'
      downloadLink.style.display = 'none'
      downloadLink.href = img
      downloadLink.download = fileName!
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    } catch (error) {
      message.error('导出失败')
    }
  }, 1000)
}

defineExpose({ exportChart, getData, file, getFile })

onBeforeMount(() => {
  getData()
})
</script>
<style lang="less" scoped>
.chart-part {
  display: flex;
  justify-content: center;
}

.chart {
  padding: 0 20px;
}

#chart_2 {
  width: 1000px;
  height: 450px;

  & > div:first-of-type {
    width: 100% !important;
  }
}

.sumUp {
  display: flex;
  width: 1000px;
  border-top: 1px #eee solid;
  border-bottom: 1px #eee solid;

  .sum-item {
    flex: 1;
    padding: 8px 0;
    border-right: 1px solid #eee;
    text-align: center;
    color: #333;
    font-size: 14px;
    line-height: 1;

    &:last-of-type {
      border: 0;
    }
  }
}

.cell.current {
  width: 30px;
  height: 30px;
  margin: auto;
  background-color: #409eff;
  border-radius: 50%;
  line-height: 30px;
  color: #fff;
  text-align: center;
}

.cell {
  border-radius: 50%;
}
</style>
