<template>
  <el-card shadow="never" v-loading="loading">
    <div class="flex justify-between">
      <span class="font-500">{{ config?.label }}</span>
    </div>

    <slot :name="config?.type">
      <div v-if="pageData.length" class="h-[calc(100%-20px)] min-h-357px" ref="chartDomRef"></div>
      <div v-else class="flex column items-center justify-center h-[calc(100%-20px)] min-h-357px">
        <img src="@/assets/imgs/common/empty_list.png" alt="" />
        <span class="mt-20px font-size-14px color-#666">暂无数据</span>
      </div>
    </slot>
  </el-card>
</template>
<script lang="ts" setup>
import * as echarts from 'echarts'

const props = defineProps<{
  config: Record<string, any>
  otherParams?: any
}>()

const pageData = ref<any[]>([])
const chartDomRef = ref()
let chartInstance: echarts.ECharts | null = null
const loading = ref(false)

const chartsConfig = computed(() => ({
  tooltip: {
    trigger: 'item',
    axisPointer: { type: 'shadow' },
    backgroundColor: '#000000bf',
    borderWidth: 0,
    textStyle: {
      color: '#E7E7E7'
    },
    formatter: function (params) {
      let tooltipHtml = `<div>${params.data.name}</div>`
      tooltipHtml += '<div style="width:100%;">'
      tooltipHtml += `<div style="display:flex;justify-content:space-between">
          <span style="display:flex;align-items:center;padding: 2px 0;"><div style="width:12px;height:12px;margin-right:5px;border-radius:50%;background-color:${params.color}"></div></span>
          <span style="text-align: right; padding: 2px 0;font-weight:600;margin-left:5px">${Intl.NumberFormat().format(params.data.value)}(${params.percent}%)</span>
        </div>`
      tooltipHtml += '</div>'
      return tooltipHtml
    }
  },
  legend: {
    type: 'scroll',
    orient: 'vertical',
    left: 'left',
    top: 'center',
    height: '80%'
  },
  series: [
    {
      type: 'pie',
      radius: ['50%', '70%'],
      name: props.config.label,
      emphasis: {
        focus: 'self'
      },
      data: pageData.value,
      label: {
        position: 'outer',
        alignTo: 'edge',
        margin: 20,
        edgeDistance: '10%'
      },
      left: '10%',
      itemStyle: {
        borderColor: '#fff',
        borderWidth: 1
      }
    }
  ]
}))

async function getData() {
  loading.value = true
  try {
    const res = await props.config.api({
      ...props.otherParams
    })
    if (res) {
      pageData.value = res.filter((ele) => ele.qty).map((ele) => ({ ...ele, value: ele.qty }))
      nextTick(() => {
        renderChart()
      })
    }
  } catch (error) {
  } finally {
    loading.value = false
  }
}

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
    chartInstance.setOption(chartsConfig.value, true)
  } catch (error) {
    console.error('图表渲染失败:', error)
    chartInstance = null
  }
}

defineExpose({ getData })
</script>
<style lang="less" scoped></style>
