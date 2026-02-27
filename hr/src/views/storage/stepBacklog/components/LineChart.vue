<!--
 * 折线图组件
-->
<template>
  <div class="line-chart-container">
    <Echart :options="chartOptions" :height="chartHeight" />
  </div>
</template>

<script lang="tsx" setup>
import Echart from '@/components/Echart/src/Echart.vue'
import * as echarts from 'echarts/core'

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

  const xAxisData = props.data.xAxisData?.length
    ? props.data.xAxisData
    : Array.from({ length: 24 }, (_, i) => `${i}-${i + 1}点`)

  const seriesData = props.data.seriesData?.length
    ? props.data.seriesData
    : Array.from({ length: 24 }, (_, i) => (i < 7 ? 10 : 400))

  const series: any[] = [
    {
      name: props.currentDateLabel,
      type: 'line',
      data: seriesData,
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: {
        color: currentColor,
        width: 3
      },
      itemStyle: {
        color: currentColor,
        borderColor: '#fff',
        borderWidth: 2
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: currentColor + '40' },
          { offset: 1, color: currentColor + '05' }
        ])
      }
    }
  ]

  // 如果显示对比数据
  if (props.showCompare && props.data.compareData?.length) {
    series.push({
      name: props.compareDateLabel,
      type: 'line',
      data: props.data.compareData,
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: {
        color: compareColor,
        width: 3
      },
      itemStyle: {
        color: compareColor,
        borderColor: '#fff',
        borderWidth: 2
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: compareColor + '40' },
          { offset: 1, color: compareColor + '05' }
        ])
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
      // axisPointer: {
      //   type: 'cross' as const,
      //   crossStyle: {
      //     color: '#999'
      //   }
      // },
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
      data: xAxisData,
      axisLabel: {
        // interval: 0,
        // rotate: 45,
        fontSize: 12,
        color: '#666'
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
.line-chart-container {
  width: 100%;
  height: 100%;
}
</style>
