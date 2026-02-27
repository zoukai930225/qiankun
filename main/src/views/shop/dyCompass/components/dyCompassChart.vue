<template>
  <div class="dyCompassChart">
    <DyCompassChart
      ref="lineChartRef"
      :height="height"
      :showAxis="showAxis"
      :option="lineOption"
      :option1="line1Option"
      :option2="line2Option"
      :option3="line3Option"
    />
  </div>
</template>
<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
import DyCompassChart from '@/components/SWChart/good/dyCompassChart.vue'

const props = defineProps({
  height: propTypes.oneOfType([Number, String]).def('150px'),
  showAxis: propTypes.bool.def(false),
  udid: propTypes.string.def(''),
  list: propTypes.array.def([]), // 成交金额
  list1: propTypes.array.def([]), // 发货前退款率
  list2: propTypes.array.def([]), // 退款率
  list3: propTypes.array.def([]) // 发货后退款率
})

watch(
  () => props.udid,
  (value) => {
    setTimeout(() => {
      updateLineOptions()
    }, 300)
  },
  {
    deep: true
  }
)

const lineChartRef = ref()

const lineOption = ref({
  xAxisData: [],
  yAxisData: [],
  tipsName: '成交金额',
  type: 'bar',
  lineColor: '#3270FF',
  direction: 'vertical',
  xAxisType: 'category',
  yAxisType: 'value'
})

const line1Option = ref({
  xAxisData: [],
  yAxisData: [],
  tipsName: '发货前退款率',
  type: 'line',
  lineColor: '#FF7D08',
  direction: 'vertical',
  xAxisType: 'category',
  yAxisType: 'value'
})

const line2Option = ref({
  xAxisData: [],
  yAxisData: [],
  tipsName: '退款率',
  type: 'line',
  lineColor: '#349B34',
  direction: 'vertical',
  xAxisType: 'category',
  yAxisType: 'value'
})

const line3Option = ref({
  xAxisData: [],
  yAxisData: [],
  tipsName: '发货后退款率',
  type: 'line',
  lineColor: '#7E46DE',
  direction: 'vertical',
  xAxisType: 'category',
  yAxisType: 'value'
})

const updateLineOptions = () => {
  lineOption.value.xAxisData = []
  lineOption.value.yAxisData = []
  const dateArr = [] as any

  props.list &&
    props.list.forEach((item) => {
      if (item.date && !dateArr.includes(item.date)) {
        dateArr.push(item.date)
      }
      lineOption.value.yAxisData.push(item.value || '')
    })

  line1Option.value.xAxisData = []
  line1Option.value.yAxisData = []
  props.list1 &&
    props.list1.forEach((item) => {
      if (item.date && !dateArr.includes(item.date)) {
        dateArr.push(item.date)
      }
      line1Option.value.yAxisData.push((Number(item.value || '') * 100).toFixed(2))
    })

  line2Option.value.xAxisData = []
  line2Option.value.yAxisData = []
  props.list2 &&
    props.list2.forEach((item) => {
      if (item.date && !dateArr.includes(item.date)) {
        dateArr.push(item.date)
      }
      line2Option.value.yAxisData.push((Number(item.value || '') * 100).toFixed(2))
    })

  line3Option.value.xAxisData = []
  line3Option.value.yAxisData = []
  props.list3 &&
    props.list3.forEach((item) => {
      if (item.date && !dateArr.includes(item.date)) {
        dateArr.push(item.date)
      }
      line3Option.value.yAxisData.push((Number(item.value || '') * 100).toFixed(2))
    })

  lineOption.value.xAxisData = dateArr || []
  line1Option.value.xAxisData = dateArr || []
  line2Option.value.xAxisData = dateArr || []
  line3Option.value.xAxisData = dateArr || []

  nextTick(() => {
    lineChartRef.value.setChartOptions()
  })
}
updateLineOptions()
</script>

<style lang="scss" scoped>
.dyCompassChart {
  background: #fff;
}
</style>
