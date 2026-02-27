<template>
  <div class="paymentAmountChart">
    <ClickRateChart2 ref="chartRef" :option="lineOption" :option1="barOption" />
  </div>
</template>
<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
import ClickRateChart2 from './chart.vue'

const props = defineProps({
  udid: propTypes.string.def(''),
  list: propTypes.array.def([]), // 支付金额
  list1: propTypes.array.def([]) // 搜索引导访客数
})

watch(
  () => props.udid,
  () => {
    setTimeout(() => {
      updateOptions()
    }, 300)
  },
  { deep: true }
)

const chartRef = ref()

const lineOption = ref({
  xAxisData: [],
  yAxisData: [],
  tipsName: '支付金额',
  type: 'line',
  lineColor: '#FF8400',
  direction: 'vertical',
  xAxisType: 'category',
  yAxisType: 'value'
}) as any

const barOption = ref({
  xAxisData: [],
  yAxisData: [],
  tipsName: '搜索引导访客数',
  type: 'bar',
  lineColor: '#3270FF',
  direction: 'vertical',
  xAxisType: 'category',
  yAxisType: 'value'
}) as any

const updateOptions = () => {
  lineOption.value.xAxisData = []
  lineOption.value.yAxisData = []
  const dateArr = [] as any

  props.list &&
    props.list.forEach((item: any) => {
      if (lineOption.value.xAxisData.length < 7) {
        if (item.date && !dateArr.includes(item.date)) {
          dateArr.push(item.date)
        }
        lineOption.value.yAxisData.push(item.value || '')
      }
    })

  barOption.value.xAxisData = []
  barOption.value.yAxisData = []
  props.list1 &&
    props.list1.forEach((item: any) => {
      if (barOption.value.xAxisData.length < 7) {
        if (item.date && !dateArr.includes(item.date)) {
          dateArr.push(item.date)
        }
        barOption.value.yAxisData.push(item.value || '')
      }
    })

  lineOption.value.xAxisData = dateArr || []
  barOption.value.xAxisData = dateArr || []

  nextTick(() => {
    chartRef.value.setChartOptions()
  })
}

updateOptions()
</script>

<style lang="scss" scoped>
.paymentAmountChart {
  background: #fff;
}
</style>
