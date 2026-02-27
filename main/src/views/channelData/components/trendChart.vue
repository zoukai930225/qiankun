<template>
  <div class="clickRateChart">
    <Chart ref="lineChartRef" :option="lineOption" :option1="line1Option" />
  </div>
</template>
<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
import Chart from './chart.vue'

const props = defineProps({
  text: propTypes.string.def(''),
  udid: propTypes.string.def(''),
  list: propTypes.array.def([]),
  list1: propTypes.array.def([]) // 转换率
})

// 监听 udid 变化
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

// 监听 list 数据变化
watch(
  () => props.list,
  (newList) => {
    if (newList && newList.length > 0) {
      nextTick(() => {
        updateLineOptions()
      })
    }
  },
  {
    deep: true,
    immediate: true
  }
)

// 监听 list1 数据变化
watch(
  () => props.list1,
  (newList1) => {
    if (newList1 && newList1.length > 0) {
      nextTick(() => {
        updateLineOptions()
      })
    }
  },
  {
    deep: true,
    immediate: true
  }
)

const lineChartRef = ref()

const lineOption = ref({
  xAxisData: [],
  yAxisData: [],
  tipsName: props.text,
  type: 'line',
  lineColor: '#3270FF',
  direction: 'vertical',
  xAxisType: 'category',
  yAxisType: 'value'
})

const line1Option = ref({
  xAxisData: [],
  yAxisData: [],
  tipsName: props.text,
  type: 'line',
  lineColor: '#3270FF',
  direction: 'vertical',
  xAxisType: 'category',
  yAxisType: 'value'
})

const updateLineOptions = () => {
  // 清空之前的数据
  lineOption.value.xAxisData = []
  lineOption.value.yAxisData = []
  line1Option.value.xAxisData = []
  line1Option.value.yAxisData = []

  const dateArr = [] as any

  // 处理第一条线数据
  if (props.list && props.list.length > 0) {
    props.list.forEach((item) => {
      if (item.date && !dateArr.includes(item.date)) {
        dateArr.push(item.date)
      }
      lineOption.value.yAxisData.push(item.value)
    })
  }

  // 处理第二条线数据
  if (props.list1 && props.list1.length > 0) {
    props.list1.forEach((item) => {
      if (line1Option.value.yAxisData.length < 7) {
        if (item.date && !dateArr.includes(item.date)) {
          dateArr.push(item.date)
        }
        line1Option.value.yAxisData.push(item.value)
      }
    })
  }

  // 设置 X 轴数据
  lineOption.value.xAxisData = dateArr || []
  line1Option.value.xAxisData = dateArr || []

  // 确保图表实例存在后再更新
  nextTick(() => {
    if (lineChartRef.value && lineChartRef.value.setChartOptions) {
      lineChartRef.value.setChartOptions()
    }
  })
}

// 初始化时调用一次
onMounted(() => {
  updateLineOptions()
})
</script>

<style lang="scss" scoped></style>
