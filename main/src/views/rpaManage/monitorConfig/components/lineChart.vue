<template>
  <div ref="chartRef" :style="{ width: containerWidth, height: containerHeight }"></div>
</template>
<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import * as echarts from 'echarts'
import type { ECharts, EChartsOption } from 'echarts'

interface Props {
  xData: Array<string | number>
  yData: number[]
  height?: string | number
  width?: string | number
}

const props = defineProps<Props>()

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: ECharts | null = null

const containerHeight = computed(() => {
  if (typeof props.height === 'number') return `${props.height}px`
  return props.height || '200px'
})
const containerWidth = computed(() => {
  if (typeof props.width === 'number') return `${props.width}px`
  return props.width || '400px'
})

function initChart() {
  if (!chartRef.value) return
  if (chartInstance) chartInstance.dispose()
  chartInstance = echarts.init(chartRef.value)
  setOption()
}

function setOption() {
  if (!chartInstance) return
  const option: EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis'
    },
    grid: { left: 10, right: 10, bottom: 0, top: 15, containLabel: true },
    xAxis: {
      type: 'category',
      data: props.xData || [],
      boundaryGap: true,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        show: true,
        color: '#cccccc',
        rotate: 45,
        hideOverlap: true
      },
      splitLine: { show: false }
    },
    yAxis: {
      type: 'value',
      nameTextStyle: { color: '#cccccc' },
      splitLine: { show: true, lineStyle: { type: 'dashed' } },
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: true, color: '#cccccc' }
    },
    legend: { show: false },
    series: [
      {
        type: 'line',
        data: props.yData || [],
        smooth: true,
        emphasis: { focus: 'series' },
        lineStyle: { color: '#0064ff' },
        itemStyle: { color: '#0064ff' },
        areaStyle: { color: 'rgba(0,100,255,0.1)' }
      }
    ]
  }
  chartInstance.setOption(option)
}

function handleResize() {
  if (chartInstance) chartInstance.resize()
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
})

watch(
  () => [props.xData, props.yData, props.height, props.width],
  () => {
    if (!chartInstance) initChart()
    else setOption()
    handleResize()
  },
  { deep: true }
)
</script>
<style scoped lang="scss"></style>
