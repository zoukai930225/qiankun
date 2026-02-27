<template>
  <el-card shadow="never" class="mb-20px" v-loading="loading">
    <template #header>
      <div class="flex items-center justify-between">
        <span class="font-500">
          <slot name="title">
            <span>{{ title }}</span>
          </slot>
        </span>
        <time-filter
          layout="自定义"
          :swift-options="timeSwiftOptions"
          :is-tooltip="false"
          :is-show-time="true"
          default-value="7天"
          :default-date="defaultDate"
          show-str="统计时间"
          :show-arrow="false"
          v-model="searchTime"
          @change="() => getData()"
        />
      </div>
    </template>

    <template #default>
      <slot name="filter" :params="queryParams"></slot>
      <div v-if="chartsData.length" ref="chartDomRef" class="h-318px"></div>
      <div v-else class="flex column items-center justify-center h-318px">
        <img src="@/assets/imgs/common/empty_list.png" alt="" />
        <span class="mt-20px font-size-14px color-#999">暂无数据</span>
      </div>
    </template>
  </el-card>
</template>
<script lang="ts" setup>
import { toReactive } from '@vueuse/core'
import { defaultDate, timeSwiftOptions } from '../options'
import * as echarts from 'echarts'

const props = defineProps<{
  title?: string
  api: (...arg: any[]) => Promise<any>
}>()

const queryParams = reactive<Record<string, any>>({
  startTime: defaultDate[0],
  endTime: defaultDate[1]
})
let chartInstance: echarts.ECharts | null = null
const chartDomRef = ref()
const chartsData = ref<any[]>([])
const loading = ref(false)

const searchTime = computed({
  get: () => [queryParams.startTime, queryParams.endTime],
  set: (val) => (
    (queryParams.startTime = val ? val[0] : defaultDate[0]),
    (queryParams.endTime = val ? val[1] : defaultDate[1])
  )
})

const dates = computed(() => chartsData.value?.[0].items.map((ele) => ele.date))
const series = computed(() => {
  if (chartsData.value.length === 0) return []

  const result = chartsData.value.map((item) => ({
    type: 'line',
    name: item.goodsNo,
    data: item.items.map((ele) => ele.num),
    smooth: true,
    showSymbol: false
  }))

  return result
})

const chartsConfig = computed(() => ({
  legend: {},
  tooltip: {
    trigger: 'axis',
    backgroundColor: '#000000bf',
    borderWidth: 0,
    textStyle: {
      color: '#E7E7E7'
    },
    formatter: function (params) {
      let tooltipHtml = `<div>${params[0].axisValue}</div>`
      tooltipHtml +=
        '<div style="width:100%;display:grid;grid-template-columns: 1fr 1fr;gap:0px 20px;">'
      params.forEach((item) => {
        tooltipHtml += `
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span style="display:flex;align-items:center;padding: 2px 0;"><div style="width:12px;height:12px;margin-right:5px;border-radius:50%;background-color:${item.color}"></div>${item.seriesName}</span>
          <span style="text-align: right; padding: 2px 0;font-weight:600;margin-left:5px">${Intl.NumberFormat().format(Number(item.data) || 0)}</span>
        </div>
      `
      })
      tooltipHtml += '</div>'
      return tooltipHtml
    }
  },
  grid: {
    top: '40px',
    left: 'auto',
    right: '10px',
    bottom: '0',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      axisLine: { show: true, lineStyle: { color: '#ebeef5' } },
      axisLabel: { color: '#909399' },
      splitLine: { showMaxLine: false, lineStyle: { color: '#ebeef5', type: 'dashed' } },
      data: dates.value
    }
  ],
  yAxis: [
    {
      type: 'value',
      axisTick: { show: false },
      axisLine: { show: true, lineStyle: { color: '#ebeef5' } },
      axisLabel: { color: '#909399' },
      splitLine: { lineStyle: { color: '#ebeef5', type: 'dashed' } }
    }
  ],
  series: series.value
}))

async function getData(goodsNos?: string[]) {
  loading.value = true
  if (goodsNos) queryParams.goodsNo = goodsNos.join(',')

  try {
    const res = await props.api({
      ...queryParams,
      startTime: queryParams.startTime + ' 00:00:00',
      endTime: queryParams.endTime + ' 23:59:59',
      goodsNos: queryParams.goodsNo ? queryParams.goodsNo.split(',') : undefined
    })
    if (res) {
      chartsData.value = res
      nextTick(() => {
        renderChart()
      })
    }
  } catch (error) {
    console.log(error)
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

function clearForm() {
  queryParams.goodsNo = undefined
}

defineExpose({
  getData,
  clearForm,
  get queryParams() {
    return toReactive({ ...queryParams })
  }
})

onBeforeMount(() => {
  getData()
})
</script>
<style lang="less" scoped></style>
