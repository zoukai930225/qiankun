<template>
  <div class="mini-trend-chart">
    <div class="header">
      <span class="title">{{ title }}</span>
      <div class="meta-row">
        <div class="legend-left">
          <template v-for="(item, idx) in legendList" :key="idx">
            <span v-if="!item.showDot" class="legend-name single">{{ item.name }}</span>
            <div v-else class="legend-item"
              ><i class="dot mr-4px" :class="item.colorClass || ''"></i>{{ item.name }}</div
            >
          </template>
        </div>
        <div class="total">
          <div class="total-line" v-for="(t, idx) in totalList" :key="idx">
            <span class="total-value">{{ t }}</span>
          </div>
        </div>
      </div>
    </div>
    <div ref="chartRef" class="chart" :style="{ height: chartHeight }"></div>
  </div>
</template>

<script lang="ts" setup>
import { computed, PropType, ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { EChartsOption } from 'echarts'
import type { EChartsType } from 'echarts/core'

echarts.use([LineChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer])

type Mode = 'single' | 'double'
type LegendItem = { name: string; showDot: boolean; colorClass?: 'blue' | 'red' }

const props = defineProps({
  mode: { type: String as PropType<Mode>, default: 'single' },
  title: { type: String, default: '' },
  name1: { type: String, default: '' },
  name2: { type: String, default: '' },
  xData: { type: Array as PropType<string[]>, default: () => [] },
  yData: { type: Array as PropType<number[]>, default: () => [] },
  y2Data: { type: Array as PropType<number[]>, default: () => [] },
  height: { type: [String, Number], default: 88 },
  totals: { type: Array as PropType<Array<string | number>>, default: () => [] },
  // whether series values represent percent (for tooltip)
  y1IsPercent: { type: Boolean, default: false },
  y2IsPercent: { type: Boolean, default: false },
  // digits for percent tooltip rounding
  percentDigits: { type: Number, default: 2 }
})

const chartRef = ref<HTMLElement | null>(null)
let chartInstance: EChartsType | null = null

const chartHeight = computed(() =>
  typeof props.height === 'number' ? `${props.height}px` : props.height
)

const blueLineGradient = () =>
  new echarts.graphic.LinearGradient(1, 0, 0, 0, [
    { offset: 0.04, color: '#38BAF8' },
    { offset: 1, color: '#3978E6' }
  ])

const blueAreaGradient = () =>
  new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    { offset: 0, color: 'rgba(56, 186, 248, 0.12)' },
    { offset: 1, color: 'rgba(57, 125, 232, 0)' }
  ])

const redLineGradient = () =>
  new echarts.graphic.LinearGradient(1, 0, 0, 0, [
    { offset: 0.04, color: '#FA5B0B' },
    { offset: 1, color: '#EB2730' }
  ])

const redAreaGradient = () =>
  new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    { offset: 0, color: 'rgba(250, 91, 11, 0.12)' },
    { offset: 1, color: 'rgba(235, 39, 48, 0)' }
  ])

const total1 = computed(() => (props.yData || []).reduce((sum, v) => sum + (Number(v) || 0), 0))
const total2 = computed(() => (props.y2Data || []).reduce((sum, v) => sum + (Number(v) || 0), 0))

const legendList = computed<LegendItem[]>(() =>
  props.mode === 'single'
    ? [{ name: props.name1, showDot: false }]
    : [
        { name: props.name1, showDot: true, colorClass: 'blue' },
        { name: props.name2, showDot: true, colorClass: 'red' }
      ]
)

const totalList = computed(() => {
  if (props.totals && props.totals.length > 0) {
    return props.totals as Array<string | number>
  }
  return props.mode === 'single' ? [total1.value] : [total1.value, total2.value]
})

function formatTooltipValue(value: any, isPercent: boolean): string {
  const num = Number(value)
  if (!Number.isFinite(num)) return '-'
  if (isPercent) {
    const s = num.toFixed(props.percentDigits as number)
    return `${parseFloat(s)}%`
  }
  return `${num}`
}

const chartOptions = computed<EChartsOption>(() => {
  const common = {
    grid: { left: 4, right: 4, top: 6, bottom: 6, containLabel: false },
    xAxis: {
      type: 'category' as const,
      data: props.xData,
      boundaryGap: false,
      axisLabel: { show: false },
      axisLine: { show: false },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value' as const,
      axisLabel: { show: false },
      axisLine: { show: false },
      splitLine: { show: false },
      axisTick: { show: false }
    }
  }

  const singleTooltip = {
    trigger: 'axis' as const,
    axisPointer: { type: 'line' as const },
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderRadius: 8,
    padding: [8, 10],
    textStyle: { color: '#ffffff', fontSize: 12 },
    formatter: (params: any) => {
      const p = Array.isArray(params) ? params[0] : params
      const valueText = formatTooltipValue(p.value, !!props.y1IsPercent)
      return (
        '<div>' +
        `<div style="color:#8186A5;margin-bottom:4px;">${p.axisValue}</div>` +
        `<div style="display:flex;align-items:center;gap:6px;">` +
        `<span>${props.name1 || p.seriesName}</span>` +
        `<span style="font-weight:600;">${valueText}</span>` +
        `</div>` +
        '</div>'
      )
    }
  }

  const doubleTooltip = {
    trigger: 'axis' as const,
    axisPointer: { type: 'line' as const },
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderRadius: 8,
    padding: [8, 10],
    textStyle: { color: '#ffffff', fontSize: 12 },
    formatter: (params: any[]) => {
      const header = `<div style="color:#8186A5;margin-bottom:4px;">${params[0].axisValue}</div>`
      const lines = params
        .map((p) => {
          const isPercent = p.seriesIndex === 1 ? !!props.y2IsPercent : !!props.y1IsPercent
          const valueText = formatTooltipValue(p.value, isPercent)
          return `<div style="display:flex;align-items:center;gap:6px;">${p.marker}<span>${p.seriesName}</span><span style="font-weight:600;">${valueText}</span></div>`
        })
        .join('')
      return `<div>${header}${lines}</div>`
    }
  }

  if (props.mode === 'single') {
    return {
      ...common,
      tooltip: singleTooltip,
      legend: { show: false },
      series: [
        {
          name: props.name1 || '',
          type: 'line' as const,
          smooth: true,
          showSymbol: false,
          color: '#38BAF8',
          lineStyle: { width: 2, color: blueLineGradient() },
          areaStyle: { color: blueAreaGradient() },
          data: props.yData
        }
      ]
    }
  }

  return {
    ...common,
    tooltip: doubleTooltip,
    legend: { show: false },
    // dual y-axes for the two series
    yAxis: [
      {
        type: 'value' as const,
        axisLabel: { show: false },
        axisLine: { show: false },
        splitLine: { show: false },
        axisTick: { show: false }
      },
      {
        type: 'value' as const,
        position: 'right',
        axisLabel: { show: false },
        axisLine: { show: false },
        splitLine: { show: false },
        axisTick: { show: false }
      }
    ],
    series: [
      {
        name: props.name1 || '',
        type: 'line' as const,
        smooth: true,
        showSymbol: false,
        color: '#38BAF8',
        lineStyle: { width: 2, color: blueLineGradient() },
        areaStyle: { color: blueAreaGradient() },
        data: props.yData
      },
      {
        name: props.name2 || '',
        type: 'line',
        smooth: true,
        showSymbol: false,
        color: '#EB2730',
        lineStyle: { width: 2, color: redLineGradient() },
        areaStyle: { color: redAreaGradient() },
        data: props.y2Data,
        yAxisIndex: 1
      }
    ]
  }
})

const initChart = () => {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)
  chartInstance.setOption(chartOptions.value, true)
}

const resizeHandler = () => {
  chartInstance?.resize()
}

onMounted(async () => {
  await nextTick()
  initChart()
  window.addEventListener('resize', resizeHandler)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeHandler)
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
})

watch(
  () => chartOptions.value,
  (opt) => {
    if (chartInstance && opt) {
      chartInstance.setOption(opt, true)
    }
  },
  { deep: true }
)
</script>

<style scoped lang="scss">
.mini-trend-chart {
  border-radius: 4px;
  background: #fff;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px;
  justify-content: space-between;
}
.header {
  display: flex;
  flex-direction: column;
}
.title {
  color: #333;
  font-size: 14px;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 0px;

  font-variation-settings: 'opsz' auto;
  color: #333333;
}
.meta-row {
  margin-top: 2px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.legend-left {
  align-items: center;
  gap: 12px;
  font-size: 12px;
  font-weight: normal;
  line-height: normal;
  letter-spacing: 0px;

  color: #666666;
}
.legend-item {
  align-items: center;
  gap: 6px;
}
.legend-name.single {
  font-size: 12px;
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}
.dot.blue {
  background: #38baf8;
}
.dot.red {
  background: #eb2730;
}
.total {
  font-size: 12px;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 0px;

  font-variation-settings: 'opsz' auto;
  color: #333333;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}
.total-line {
  display: flex;
  align-items: center;
  gap: 6px;
}
.total-name {
  color: #666666;
}
.total-value {
  color: #333333;
  font-weight: 600;
}
.chart {
  width: 100%;
}
</style>
