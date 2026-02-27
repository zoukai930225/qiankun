<template>
  <el-popover :visible="visible && !!currentData" :show-after="200" :hide-after="0">
    <template #reference>
      <div class="w-100%">
        <div ref="chartDomRef" class="w-100% h-40px"></div>
      </div>
    </template>

    <template #default>
      <span>{{ currentData?.date }}</span>
      :
      <span>{{ currentData?.num }}</span>
    </template>
  </el-popover>
</template>
<script lang="ts" setup>
import * as echarts from 'echarts'

const props = defineProps<{
  data: any[] | null
}>()

const chartDomRef = ref()
let chartInstance: echarts.ECharts | null = null
const visible = ref(false)
const currentX = ref(0)

const dates = computed(() => props.data?.map((ele) => ele.date))
const nums = computed(() => props.data?.map((ele) => ele.num))
const currentData = computed(() => (props.data?.length ? props.data?.[currentX.value] : null))

const series = computed(() => [
  {
    name: '30天销量趋势',
    type: 'line',
    data: nums.value,
    showSymbol: true,
    smooth: true
  }
])

const getChartsOptions = computed(() => ({
  animationDuration: 200,
  grid: {
    left: '5px',
    top: '5px',
    bottom: '5px',
    right: '5px'
  },
  tooltip: {
    trigger: 'axis',
    formatter: () => null
  },
  xAxis: [
    {
      type: 'category',
      position: 'bottom',
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: { show: false },
      data: dates.value,
      boundaryGap: false
    }
  ],
  yAxis: [
    {
      type: 'value',
      name: '销量',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false },
      splitLine: { show: false }
    }
  ],

  series: series.value
}))

function renderChart() {
  const chartDom = chartDomRef.value
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
    chartInstance.setOption(getChartsOptions.value, true)

    chartInstance.on('mousemove', function (params) {
      const pixelX = params.event?.offsetX
      const dataCoord = chartInstance?.convertFromPixel({ seriesIndex: 0 }, [pixelX || 0])
      const dataX = dataCoord?.[0]
      currentX.value = dataX || 0
      visible.value = true
    })
    chartInstance.on('mouseout', function () {
      visible.value = false
    })
  } catch (error) {
    console.error('图表渲染失败:', error)
    chartInstance = null
  }
}

watch(
  () => props.data,
  () => nextTick(renderChart),
  { immediate: true }
)
</script>
<style lang="less" scoped></style>
