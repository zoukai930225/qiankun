<template>
  <div class="risk-donut-chart" v-loading="loading">
    <div class="risk-donut-chart__left">
      <div class="risk-donut-chart__header">
        <div class="risk-donut-chart__title">{{ title }}</div>
      </div>
      <div class="risk-donut-chart__list">
        <div v-for="item in displayedSeries" :key="item.name" class="risk-item">
          <span class="risk-item__label">{{ item.name }}</span>
          <span class="risk-item__value">
            <template v-if="item.hasData">
              <template v-if="showCount">
                <span class="risk-item__count">{{
                  numberFormatter(item.value, {
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0
                  })
                }}</span>
              </template>
              <template v-else>
                <span class="risk-item__percent">{{ percentFormatter(item.percent) }}</span>
              </template>
            </template>
            <template v-else>-</template>
          </span>
        </div>
      </div>
    </div>
    <div class="risk-donut-chart__content">
      <div ref="chartRef" class="risk-donut-chart__chart"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, computed } from 'vue'
import * as echarts from 'echarts/core'
import { PieChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { EChartsOption } from 'echarts'
import { numberFormatter } from '@/utils/formatter'
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'

echarts.use([PieChart, TooltipComponent, LegendComponent, CanvasRenderer])

interface RiskItem {
  name: string
  value: number
  color?: string
}

const props = withDefaults(
  defineProps<{
    title: string
    data?: RiskItem[]
    loading?: boolean
    showCount?: boolean
  }>(),
  {
    data: () => [],
    loading: false,
    showCount: false
  }
)

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: ReturnType<typeof echarts.init> | null = null

const riskColorMap: Record<string, string> = {
  高风险: '#F33C51',
  中风险: '#FE9719',
  低风险: '#06C21B'
}

const fallbackColors = ['#06C21B', '#FE9719', '#F33C51']

const riskLevelOptions = computed(() => getIntDictOptions(DICT_TYPE.PROBLEM_RISK_LEVEL, true) || [])

const riskLabelMap = computed<Record<string, string>>(() => {
  const map: Record<string, string> = {}
  riskLevelOptions.value.forEach((option: any) => {
    const value = option?.value
    if (value === undefined || value === null) return
    const key = String(value).trim()
    if (!key) return
    map[key] = option?.label || ''
    map[key.toLowerCase()] = option?.label || ''
  })
  return map
})

const resolveRiskLabel = (source: unknown): string => {
  const key = String(source ?? '').trim()
  if (!key) return '-'
  return riskLabelMap.value[key] || riskLabelMap.value[key.toLowerCase()] || key || '-'
}

const baseRiskLabels = computed(() => {
  const fromDict = riskLevelOptions.value
    .map((option: any) =>
      option?.label ? String(option.label).trim() : resolveRiskLabel(option?.value)
    )
    .filter((label) => !!label)

  if (fromDict.length) {
    return Array.from(new Set(fromDict))
  }

  return ['高风险', '中风险', '低风险']
})

const resolveColor = (label: string, index: number, explicit?: string) => {
  if (explicit) return explicit
  const normalized = (label || '').trim()
  if (!normalized || normalized === '-') return fallbackColors[index % fallbackColors.length]
  if (normalized.includes('高')) return riskColorMap['高风险']
  if (normalized.includes('中')) return riskColorMap['中风险']
  if (normalized.includes('低')) return riskColorMap['低风险']
  return fallbackColors[index % fallbackColors.length]
}

const displayedSeries = computed(() => {
  const normalizedInput = props.data.map((item) => ({
    ...item,
    name: resolveRiskLabel(item?.name),
    value: Number(item?.value) || 0
  }))

  const total = normalizedInput.reduce((sum, item) => sum + (item.value || 0), 0)
  const usedLabels = new Set<string>()

  const buildEntry = (label: string, index: number) => {
    const matched = normalizedInput.find((entry) => entry.name === label)
    const value = matched ? matched.value : 0
    const hasData = value > 0
    const colorCandidate = resolveColor(label, index, matched?.color)

    if (label) usedLabels.add(label)

    return {
      name: label || '-',
      value,
      color: colorCandidate,
      percent: total > 0 ? (value / total) * 100 : 0,
      hasData
    }
  }

  const baseSeries = baseRiskLabels.value.map((label, index) => buildEntry(label, index))

  const extraSeries = normalizedInput
    .filter((item) => item.name && !usedLabels.has(item.name))
    .map((item, index) => ({
      name: item.name || '-',
      value: item.value,
      color: resolveColor(item.name || '-', baseSeries.length + index, item.color),
      percent: total > 0 ? (item.value / total) * 100 : 0,
      hasData: item.value > 0
    }))

  return [...baseSeries, ...extraSeries]
})

const hasChartData = computed(() => displayedSeries.value.some((item) => item.hasData))

const percentFormatter = (value: number) => {
  if (!Number.isFinite(value)) return '0%'
  const formatted = numberFormatter(value, {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  })
  return `${formatted}%`
}

const renderChart = () => {
  if (!chartRef.value) return
  if (!chartInstance) {
    chartInstance = echarts.init(chartRef.value)
  }

  const placeholderColor = '#DDE2E9'
  const colorPalette = hasChartData.value
    ? displayedSeries.value.map((item) => item.color)
    : [placeholderColor]
  const seriesData = hasChartData.value
    ? displayedSeries.value.map((item) => ({
        value: item.value,
        name: item.name,
        itemStyle: { color: item.color },
        percent: item.percent
      }))
    : [
        {
          value: 1,
          name: '-',
          itemStyle: { color: placeholderColor },
          percent: 0
        }
      ]

  const option: EChartsOption = {
    color: colorPalette,
    legend: {
      top: 0,
      left: 'center',
      icon: 'rect',
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 16,
      padding: [2, 0, 16, 0],
      orient: 'horizontal',
      align: 'auto',
      textStyle: {
        color: '#4b5563',
        fontSize: 12
      },
      data: displayedSeries.value.map((item) => item.name)
    },
    tooltip: {
      trigger: 'item',
      padding: 12,
      backgroundColor: '#000',
      borderRadius: 2,
      borderWidth: 0,
      textStyle: {
        color: '#fff'
      },
      formatter: (params: any) => {
        if (!params?.data) return ''
        const { name, percent } = params.data
        if (!hasChartData.value) return '暂无数据'
        return `${name}：${percentFormatter(percent)}`
      }
    },
    series: [
      {
        type: 'pie',
        // top: 48,
        radius: ['50%', '75%'],
        center: ['50%', '60%'],
        avoidLabelOverlap: false,
        label: { show: false },
        labelLine: { show: false },
        data: seriesData
      }
    ]
  }

  chartInstance?.setOption(option)
}

const resizeHandler = () => chartInstance?.resize()

watch(
  () => props.data,
  () => {
    renderChart()
  },
  { deep: true }
)

onMounted(() => {
  renderChart()
  window.addEventListener('resize', resizeHandler)
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeHandler)
  chartInstance?.dispose()
  chartInstance = null
})
</script>

<style scoped lang="scss">
.risk-donut-chart {
  display: flex;
  padding: 20px;
  background: #fbfcfd;
  border-radius: 4px;
  border: 1px solid #dde2e9;
  min-height: 220px;
  gap: 20px;
  &__left,
  &__content {
    flex: 1 0 auto;
    width: 0;
  }
  &__content {
    display: flex;
    justify-content: flex-end;
  }
  &__header {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 16px;
  }

  &__title {
    font-size: 14px;
    font-weight: 500;
    color: #333;
  }
  &__list {
    display: flex;
    max-width: 260px;
    gap: 36px;
    flex-wrap: wrap;
    margin-top: 62px;
    font-size: 14px;
    .risk-item__label {
      color: #666666;
    }
  }

  &__chart {
    width: 100%;
    height: 100%;
  }
}

.risk-item {
  display: flex;
  justify-content: flex-start;
  gap: 16px;
  font-size: 14px;
  color: #333;

  &__value {
    font-weight: 600;
    color: #333;
  }

  &__count {
    font-weight: 600;
  }

  &__percent {
    margin-left: 4px;
    font-weight: 400;
    color: #666;
  }
}
</style>
