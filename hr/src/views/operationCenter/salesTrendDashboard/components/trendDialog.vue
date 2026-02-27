<template>
  <div class="trend-dialog">
    <section class="toolbar">
      <s-w-search-form
        :schema="schema"
        @search="onSearch"
        @reset="onReset"
        :show-expand="false"
        :show-search="true"
        :show-reset-button="false"
        :show-search-button="false"
        auto-search-on-change
      >
        <div class="meta text-14px">
          <span class="meta-label text-#666 font-400">商品ID：</span>
          <span class="meta-value text-#333 font-500">{{ productId }}</span>
        </div>
      </s-w-search-form>
    </section>

    <section class="chart-wrap" v-loading="loading">
      <div ref="chartRef" class="chart"></div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import type { FormSchema } from '@/types/form'
import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { EChartsType, EChartsCoreOption } from 'echarts/core'
import { getInfoBy } from '@/api/operationCenter/salesTrendDashboard'

echarts.use([LineChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer])

const props = defineProps({
  legendName: { type: String, default: '销售件数(支付)' },
  legendName2: { type: String, default: '' },
  xData: { type: Array as () => string[], default: () => [] },
  yData: { type: Array as () => number[], default: () => [] },
  productId: { type: [String, Number], default: '' },
  code: { type: [String, Number], default: '' },
  defaultStartDate: { type: String, default: '' },
  defaultEndDate: { type: String, default: '' }
})

const chartRef = ref<HTMLElement | null>(null)
let chart: EChartsType | null = null

const innerX = ref<string[]>([])
const legendNames = ref<string[]>([props.legendName])
const seriesList = ref<number[][]>([])
const seriesIsPercent = ref<boolean[]>([])
const defaultRange: string[] =
  props.defaultStartDate && props.defaultEndDate
    ? [props.defaultStartDate, props.defaultEndDate]
    : []
const loading = ref(false)

const schema = ref<FormSchema[]>([
  {
    field: 'dateRange',
    label: '日期',
    component: 'DatePicker',
    componentProps: {
      type: 'daterange',
      valueFormat: 'YYYY-MM-DD',
      startPlaceholder: '开始时间',
      endPlaceholder: '结束时间',
      unlinkPanels: true,
      clearable: false
    },
    value: defaultRange
  }
])

function buildOptions(): EChartsCoreOption {
  const leftIsPercent = seriesIsPercent.value[0] === true
  const rightIsPercent = seriesIsPercent.value[1] === true
  return {
    grid: { left: 56, right: 50, top: 52, bottom: 20 },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      textStyle: { color: '#ffffff' },
      formatter: (params: any) => {
        const list = Array.isArray(params) ? params : [params]
        const title = (list[0] && (list[0].axisValueLabel ?? list[0].name)) || ''
        const lines = list.map((p: any) => {
          const idx = typeof p.seriesIndex === 'number' ? p.seriesIndex : 0
          const val = p.value
          const suffix = seriesIsPercent.value[idx] ? '%' : ''
          return `${p.marker}${p.seriesName}：${val}${suffix}`
        })
        return [title, ...lines].join('<br/>')
      }
    },
    legend: {
      top: 8,
      left: 'center',
      itemWidth: 24,
      itemHeight: 8,
      textStyle: { color: '#333' },
      data: legendNames.value
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: innerX.value,
      axisTick: { show: false },
      axisLine: { lineStyle: { color: '#EDEDED' } },
      axisLabel: { color: '#666' }
    },
    yAxis:
      seriesList.value.length > 1
        ? [
            {
              type: 'value' as const,
              axisLine: { show: false },
              axisTick: { show: false },
              splitLine: { lineStyle: { color: '#F0F0F0' } },
              axisLabel: leftIsPercent
                ? { color: '#666', formatter: (v: number | string) => `${v}%` }
                : { color: '#666' }
            },
            {
              type: 'value' as const,
              position: 'right',
              axisLine: { show: false },
              axisTick: { show: false },
              splitLine: { show: false },
              axisLabel: rightIsPercent
                ? { color: '#666', formatter: (v: number | string) => `${v}%` }
                : { color: '#666' }
            }
          ]
        : {
            type: 'value' as const,
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: { lineStyle: { color: '#F0F0F0' } },
            axisLabel: leftIsPercent
              ? { color: '#666', formatter: (v: number | string) => `${v}%` }
              : { color: '#666' }
          },
    series: seriesList.value.map((yData, idx) => ({
      type: 'line',
      name: legendNames.value[idx] || `系列${idx + 1}`,
      showSymbol: false,
      smooth: true,
      lineStyle: { width: 2, color: idx === 0 ? '#0064FF' : '#EB2730' },
      itemStyle: { color: idx === 0 ? '#0064FF' : '#EB2730' },
      areaStyle:
        idx === 0
          ? {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0.02, color: 'rgba(0, 100, 255, 0.10)' },
                { offset: 0.85, color: 'rgba(0, 100, 255, 0)' }
              ])
            }
          : {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0.02, color: 'rgba(235, 39, 48, 0.10)' },
                { offset: 0.85, color: 'rgba(235, 39, 48, 0)' }
              ])
            },
      yAxisIndex: seriesList.value.length > 1 ? (idx === 0 ? 0 : 1) : 0,
      data: yData
    }))
  }
}

function render() {
  if (!chartRef.value) return
  if (!chart) chart = echarts.init(chartRef.value)
  chart.setOption(buildOptions(), true)
}

function toNumber(val: string | number | null | undefined): number {
  if (val == null) return 0
  if (typeof val === 'number') return Number.isFinite(val) ? val : 0
  const cleaned = String(val).replace(/[，,\s\u00A0\u202F]/g, '')
  const n = Number(cleaned)
  return Number.isNaN(n) ? 0 : n
}
function toPercentNumber(val: string | number | null | undefined): number {
  const raw = val == null ? '' : String(val)
  const str = raw.replace(/[%％﹪]/g, '').replace(/[，,\s\u00A0\u202F]/g, '')
  const n = Number(str)
  return Number.isNaN(n) ? 0 : n
}
function toPercentForCode5(val: string | number | null | undefined): number {
  if (val == null) return 0
  if (typeof val === 'number') {
    if (!Number.isFinite(val)) return 0
    return val <= 1 ? val * 100 : val
  }
  const raw = String(val)
  const hadPercent = /[%％﹪]/.test(raw)
  const str = raw.replace(/[%％﹪]/g, '').replace(/[，,\s\u00A0\u202F]/g, '')
  const n = Number(str)
  if (Number.isNaN(n)) return 0
  return hadPercent ? n : n <= 1 ? n * 100 : n
}
function normalizeX(item: any): string {
  const date = item?.statDate
  if (!date) return ''
  const s = String(date)
  return s
}
function detectIsPercentFromList(
  list: Array<{ value?: string | number | null }> | undefined
): boolean {
  if (!Array.isArray(list)) return false
  return list.some((d: any) => String(d?.value ?? '').includes('%'))
}
function buildDateToValueMap(
  list: Array<{ value?: string | number | null; statDate?: string }> | undefined
): Record<string, string | number | null | undefined> {
  const map: Record<string, string | number | null | undefined> = {}
  if (!Array.isArray(list)) return map
  for (const d of list) {
    const x = normalizeX(d)
    if (x) map[x] = (d as any)?.value
  }
  return map
}

async function fetchData(rangeArg?: string[]) {
  loading.value = true
  try {
    const beginTime = Array.isArray(rangeArg) ? rangeArg[0] ?? '' : ''
    const endTime = Array.isArray(rangeArg) ? rangeArg[1] ?? '' : ''
    const code = String(props.code)
    const goodsId = props.productId

    const res: any = await getInfoBy({ beginTime, endTime, goodsId, code }).catch(() => null)
    const data1: any[] = res && Array.isArray(res['1']) ? (res['1'] as any[]) : []
    const data2: any[] = res && Array.isArray(res['2']) ? (res['2'] as any[]) : []

    const xSet = new Set<string>()
    data1.forEach((d: any) => xSet.add(normalizeX(d)))
    data2.forEach((d: any) => xSet.add(normalizeX(d)))
    const x = Array.from(xSet).filter(Boolean).sort()
    innerX.value = x

    const isCode5 = code === '5'

    const data1IsPercent = isCode5 ? true : detectIsPercentFromList(data1)
    const data2IsPercent = isCode5 ? true : detectIsPercentFromList(data2)

    const map1 = buildDateToValueMap(data1)
    const map2 = buildDateToValueMap(data2)

    const y1 = data1.length
      ? x.map((date) =>
          isCode5
            ? toPercentForCode5(map1[date])
            : data1IsPercent
              ? toPercentNumber(map1[date])
              : toNumber(map1[date])
        )
      : []
    const y2 = data2.length
      ? x.map((date) =>
          isCode5
            ? toPercentForCode5(map2[date])
            : data2IsPercent
              ? toPercentNumber(map2[date])
              : toNumber(map2[date])
        )
      : []

    const nextSeriesList: number[][] = []
    const nextLegendNames: string[] = []
    const nextSeriesIsPercent: boolean[] = []

    if (y1.length) {
      nextSeriesList.push(y1)
      nextLegendNames.push(props.legendName)
      nextSeriesIsPercent.push(!!data1IsPercent)
    }
    if (y2.length) {
      nextSeriesList.push(y2)
      const legend2 = props.legendName2
      nextLegendNames.push(legend2 || '系列2')
      nextSeriesIsPercent.push(!!data2IsPercent)
    }

    seriesList.value = nextSeriesList
    legendNames.value = nextLegendNames.length ? nextLegendNames : [props.legendName]
    seriesIsPercent.value = nextSeriesIsPercent

    render()
  } finally {
    loading.value = false
  }
}

const onSearch = (formModel: Record<string, any>) => {
  const range = formModel && formModel.dateRange
  fetchData(range)
}
const onReset = () => {
  schema.value[0].value = defaultRange
}

onMounted(async () => {
  if (props.defaultStartDate && props.defaultEndDate) {
    fetchData([props.defaultStartDate, props.defaultEndDate])
  }
})

function resize() {
  chart?.resize()
}

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize)
  chart?.dispose()
  chart = null
})
</script>

<style scoped lang="scss">
.trend-dialog {
  .toolbar {
  }
  .meta {
    color: #666;
    font-size: 12px;
    .meta-label {
      margin-right: 4px;
    }
  }
  .chart-wrap {
    width: 100%;
  }
  .chart {
    width: 100%;
    height: 320px;
  }
}

:deep(.sw-search) {
  align-items: center;
  .el-form {
    .el-form-item {
      margin-bottom: 0;
    }
  }
}
</style>
