<template>
  <div class="clickRateChart">
    <ClickRateChart ref="lineChartRef" :option="lineOption" :option1="line1Option" />
  </div>
</template>
<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
import ClickRateChart from '@/components/SWChart/good/clickRateChart.vue'

const props = defineProps({
  udid: propTypes.string.def(''),
  list: propTypes.array.def([]),
  list1: propTypes.array.def([]) // 转换率
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
  tipsName: '点击率',
  type: 'line',
  lineColor: '#FF8400',
  direction: 'vertical',
  xAxisType: 'category',
  yAxisType: 'value'
})

const line1Option = ref({
  xAxisData: [],
  yAxisData: [],
  tipsName: '转换率',
  type: 'line',
  lineColor: '#3270FF',
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
      if (lineOption.value.xAxisData.length < 7) {
        if (item.date && !dateArr.includes(item.date)) {
          dateArr.push(item.date)
        }
        lineOption.value.yAxisData.push(item.value || '')
      }
    })

  line1Option.value.xAxisData = []
  line1Option.value.yAxisData = []
  props.list1 &&
    props.list1.forEach((item) => {
      if (line1Option.value.xAxisData.length < 7) {
        if (item.date && !dateArr.includes(item.date)) {
          dateArr.push(item.date)
        }
        line1Option.value.yAxisData.push(item.value || '')
      }
    })
  lineOption.value.xAxisData = dateArr || []
  line1Option.value.xAxisData = dateArr || []

  nextTick(() => {
    lineChartRef.value.setChartOptions()
  })
}
updateLineOptions()
</script>

<style lang="scss" scoped>
.clickRateChart {
  background: #fff;
}
</style>
