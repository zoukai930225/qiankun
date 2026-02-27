<template>
  <el-card shadow="never" v-loading="loading">
    <div class="flex justify-between">
      <span class="font-500">{{ config?.label }} TOP10</span>
      <el-button type="primary" link :underline="false" @click="handleShowMore">更多</el-button>
    </div>
    <slot :name="config.type" :data="pageData">
      <div v-if="pageData.length" class="h-[calc(100%-20px)]" ref="chartDomRef"></div>
      <div v-else class="flex column items-center justify-center my-60px">
        <img src="@/assets/imgs/common/empty_list.png" alt="" />
        <span class="mt-20px font-size-14px !color-#909399">暂无数据</span>
      </div>
    </slot>
  </el-card>
</template>
<script lang="ts" setup>
import { getProductTop10Api } from '@/api/supplier/supplierBoard'
import * as echarts from 'echarts'
import { TOP_10_TYPE } from '../options'

const props = defineProps<{
  config: Record<string, any>
}>()

const emit = defineEmits<{
  (e: 'update:moreDialogProp', v: any): void
}>()

const pageData = ref<{ goodsNo: string; num?: number; date?: string }[]>([])
let chartInstance: echarts.ECharts | null = null
const chartDomRef = ref()
const loading = ref(false)

const goodsNos = computed(() => pageData.value.map((ele) => ele.goodsNo || ''))
const nums = computed(() => pageData.value.map((ele) => ele.num))

const chartsConfig = computed(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow' },
    backgroundColor: '#000000bf',
    borderWidth: 0,
    textStyle: {
      color: '#E7E7E7'
    }
  },
  grid: {
    top: '18px',
    left: 'auto',
    right: '10px',
    bottom: '0',
    containLabel: true
  },
  xAxis: [
    {
      type: 'value',
      axisLine: { show: true, lineStyle: { color: '#ebeef5' } },
      axisLabel: { color: '#909399', rotate: -30, showMaxLabel: false, showMinLabel: false },
      splitLine: { showMaxLine: false, lineStyle: { color: '#ebeef5', type: 'dashed' } }
    }
  ],
  yAxis: [
    {
      type: 'category',
      data: goodsNos.value,
      axisTick: { show: false },
      axisLine: { show: true, lineStyle: { color: '#ebeef5' } },
      axisLabel: { color: '#909399' }
    }
  ],
  series: [
    {
      type: 'bar',
      name: props.config.label,
      barMaxWidth: 50,
      label: {
        show: false
      },
      data: nums.value,
      yAxisIndex: 0,
      itemStyle: { color: props.config?.barColor, borderRadius: [2, 2, 2, 2] },
      barWidth: '14px',
      barGap: '16px'
    }
  ]
}))

async function getData() {
  loading.value = true
  try {
    const res = await getProductTop10Api({
      type: props.config.type
    })
    if (res) {
      pageData.value = res.sort(() => (props.config.type === TOP_10_TYPE.GOODS_NEW ? 1 : -1))
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

function handleShowMore() {
  emit('update:moreDialogProp', { modelValue: true, type: props.config.type, config: props.config })
}

onBeforeMount(() => {
  getData()
})
</script>
<style lang="less" scoped>
* {
  color: #000000bf;
}
</style>
