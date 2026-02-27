<!--
 * @Date: 2025-01-03 16:22:21
-->
<template>
  <div class="bar-content">
    <div class="bar" ref="chartContainer"></div>
  </div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'
import { onBeforeUnmount, onMounted, ref } from 'vue'

const chartContainer = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null

const props = defineProps({
  item: {
    type: Object,
    required: true,
    default: () => {
      return {}
    }
  }
})

const initChart = () => {
  if (chartContainer.value) {
    chartInstance = echarts.init(chartContainer.value)

    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function (params) {
          // 过滤掉订单项为0的情况
          const xAxisName = params[0]?.axisValue || params[0]?.name // 兼容不同ECharts版本
          // 2. 构建基础HTML结构
          let html = `<div style="padding: 8px; background: #fff; border-radius: 4px;">`
          html += `<div style="font-size: 14px; color: #333; margin-bottom: 6px;">${xAxisName}</div>`
          // 3. 遍历数据项，过滤订单为0的项
          params.forEach((item) => {
            if (item.seriesName === '订单' && item.value === 0) return // 跳过无效项
            // 4. 构建每个数据项的HTML
            html += `
        <div style="
          display: flex;
          align-items: center;
          margin-bottom: 4px;
          font-size: 12px;
        ">
          <span style="
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: ${item.color};
            margin-right: 6px;
          "></span>
          <span>${item.seriesName}: ${item.value}</span>
        </div>
      `
          })
          html += `</div>`
          return html
        }
      },
      grid: {
        left: '5%',
        right: '5%',
        bottom: '5%',
        containLabel: true
      },

      xAxis: {
        type: 'category',
        data: ['账单', '订单'],
        barWidth: 30,
        axisTick: {
          show: false // 去掉 x 轴下标尺
        },
        axisLine: {
          lineStyle: {
            color: '#979797' // 自定义 x 轴颜色
          }
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: true, // 确保 y 轴显示
          lineStyle: {
            color: '#979797' // 自定义 y 轴颜色
          }
        }
      },
      series: [
        {
          name: '账单（聚合）',
          type: 'bar',
          stack: '账单',
          barWidth: 30,
          label: {
            show: false
          },
          emphasis: {
            focus: 'series'
          },
          itemStyle: {
            color: '#FB841E'
          },
          data: [props.item?.wechatActualPayment || 0]
        },
        {
          name: '账单（支付宝）',
          type: 'bar',
          stack: '账单',
          barWidth: 30,
          label: {
            show: false
          },
          emphasis: {
            focus: 'series'
          },
          itemStyle: {
            color: '#FFB74D'
          },
          data: [props.item?.alipayActualPayment || 0]
        },
        {
          name: '订单',
          type: 'bar',
          stack: '订单',
          barWidth: 30,
          label: {
            show: false
          },
          emphasis: {
            focus: 'series'
          },
          itemStyle: {
            color: '#3270FF'
          },
          data: [0, props.item?.remittanceAmount || 0]
        }
      ]
    }
    chartInstance.setOption(option)
  }
}

onMounted(async () => {
  console.log('会进来吗33333', props.item)
  initChart()
  window.addEventListener('resize', handleResize)
})

const handleResize = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.dispose()
  }
})

watch(
  () => props.item,
  async (val) => {
    //@ts-ignore
    //刷新页面
    console.log('会进来吗1111', val)

    initChart()
  },
  { deep: true, immediate: true }
)

// 抛出方法
defineExpose({
  initChart
})
</script>

<style lang="scss" scoped>
.bar-content {
  width: 100%;
  height: 100%;
  // background: url('@/assets/imgs/oa/bar-content.png') no-repeat;
  background-size: 100% 100%;
  padding-top: 20px;
  box-sizing: border-box;
  .bar {
    width: 100%;
    height: 100%;
  }
}
</style>
