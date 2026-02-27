<!--
 * 柱状图组件
-->
<template>
  <div class="bar-chart-container">
    <Echart :options="chartOptions" :height="chartHeight" />
  </div>
</template>

<script lang="tsx" setup>
import Echart from '@/components/Echart/src/Echart.vue'

interface ChartData {
  xAxisData?: string[]
  seriesData?: number[]
  compareData?: number[]
}

interface Props {
  data?: ChartData
  selectedMetric?: string
  height?: string | number
  showCompare?: boolean
  currentDateLabel?: string // 当前日期标签
  compareDateLabel?: string // 对比日期标签
}

const props = withDefaults(defineProps<Props>(), {
  data: () => ({
    xAxisData: [],
    seriesData: [],
    compareData: []
  }),
  selectedMetric: 'inOrderCount',
  height: '560px',
  showCompare: false,
  currentDateLabel: '2025-11-11 (今日)',
  compareDateLabel: '2025-11-11 (昨天)'
})

const chartHeight = computed(() => {
  return typeof props.height === 'number' ? `${props.height}px` : props.height
})

// 图表配置
const chartOptions = computed(() => {
  const currentColor = '#0064FF' // 选中日期颜色（蓝色）
  const compareColor = '#FFA500' // 昨日数据颜色（橙色）

  const series: any[] = [
    {
      name: props.currentDateLabel,
      type: 'bar',
      data: props.data?.seriesData,
      barGap: 0,
      barWidth: props.showCompare ? 18 : 36,
      itemStyle: {
        color: currentColor,
        borderRadius: [2, 2, 0, 0]
      }
    }
  ]

  // 如果显示对比数据
  if (props.showCompare && props.data.compareData?.length) {
    series.push({
      name: props.compareDateLabel,
      type: 'bar',
      data: props.data?.compareData,
      barGap: 0,
      barWidth: 18,
      itemStyle: {
        color: compareColor,
        borderRadius: [2, 2, 0, 0]
      }
    })
  }

  return {
    animation: true,
    animationDuration: 800,
    animationEasing: 'cubicOut' as const,
    animationDelay: (idx: number) => idx * 10,
    tooltip: {
      trigger: 'axis' as const,
      axisPointer: {
        type: 'shadow' as const
      },
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'transparent',
      textStyle: {
        color: '#fff'
      },
      formatter: (params: any) => {
        let html = `<div style="padding: 8px;">
          <div style="margin-bottom: 6px; font-weight: bold;">${params[0].name}</div>`

        params.forEach((item: any) => {
          html += `<div style="display: flex; align-items: center; justify-content: space-between; margin-top: 4px;">
            <span>${item.marker} ${item.seriesName}</span>
            <span style="margin-left: 20px; font-weight: bold;">${item.value.toLocaleString()}</span>
          </div>`
        })

        html += '</div>'
        return html
      }
    },
    legend: {
      data: props.showCompare
        ? [props.currentDateLabel, props.compareDateLabel]
        : [props.currentDateLabel],
      top: 10,
      left: 'center',
      itemWidth: 14,
      itemHeight: 14,
      itemGap: 30,
      formatter: (name: string) => {
        return `{a|${name}}`
      },
      textStyle: {
        rich: {
          a: {
            fontSize: 14,
            color: '#666',
            lineHeight: 14,
            padding: [2, 0, 0, 0]
          }
        }
      }
    },
    grid: {
      left: 10,
      right: 10,
      top: 50,
      bottom: 10,
      containLabel: true
    },
    xAxis: {
      type: 'category' as const,
      data: props.data?.xAxisData,
      axisLabel: {
        // interval: 0,
        // rotate: 45,
        fontSize: 12,
        color: '#606266'
      },
      axisLine: {
        lineStyle: {
          color: '#E4E7ED'
        }
      },
      axisTick: {
        show: false
      }
    },
    yAxis: {
      type: 'value' as const,
      axisLabel: {
        fontSize: 12,
        color: '#606266'
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        lineStyle: {
          color: '#E4E7ED',
          type: 'dashed' as const
        }
      },
      splitNumber: 8
    },
    series
  }
})
</script>

<style lang="scss" scoped>
.bar-chart-container {
  width: 100%;
  height: 100%;
}
</style>
