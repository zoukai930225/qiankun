<template>
  <div class="chart-box" :style="{ width }">
    <Echart :options="options" :height="height" ref="echartRef" />
  </div>
</template>
<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
const props = defineProps({
  height: propTypes.oneOfType([Number, String]).def('118px'),
  width: propTypes.oneOfType([Number, String]).def('426px'),
  data: propTypes.object.def({}),
  //consumption - 消费人群 age-年龄人群
  type: propTypes.string.def('consumption')
})
const options = ref({})
const echartRef = ref<any>()
const dataBlue = ref<any[]>([])
const dataOrange = ref<any[]>([])
const xAxisData = ref<string[]>([])

const getData = () => {
  dataBlue.value = []
  dataOrange.value = []
  const xData = new Set<any>()
  let oneData: any[] = [],
    twoData: any[] = []
  if (props.type === 'consumption') {
    oneData = props.data.consumptionAnalyzePopulation
    twoData = props.data.consumptionComparisonGroup
  } else {
    oneData = props.data.ageAnalyzePopulation
    twoData = props.data.ageComparisonGroup
  }
  oneData.forEach((item: any) => {
    xData.add(item.optionName)
    dataBlue.value.push({ name: item.optionName, value: item.rate })
  })

  xData.forEach((item: any) => {
    const val = twoData.find((item2: any) => item2.optionName === item)
    if (val) {
      dataOrange.value.push({ name: val.optionName, value: val.rate })
    }
  })

  xAxisData.value = [...xData]
}

const setChartOptions = () => {
  getData()
  let title = {
    show: dataBlue.value.length === 0 && dataOrange.value.length === 0, // 没数据才显示
    extStyle: {
      color: 'grey',
      fontSize: 20
    },
    text: '暂无数据',
    left: 'center',
    top: 'center'
  }

  let grid = {
    left: 5,
    right: 5,
    bottom: 5,
    top: 15,
    containLabel: true
  }
  let tooltip = {
    show: true,
    trigger: 'axis',
    backgroundColor: '	rgba(0,0,0,0.75)',
    borderWidth: 0,
    textStyle: {
      color: '#fff'
    },
    confine: true,
    extraCssText: 'text-align: left;'
  }
  let yAxis = {
    show: dataBlue.value.length > 0 || dataOrange.value.length > 0,
    type: 'value',
    axisLabel: {
      formatter: '{value}%',
      color: '#98999B'
    },
    minInterval: 10,
    splitLine: {
      lineStyle: {
        // 使用深浅的间隔色
        color: '#E5E5E5',
        type: 'dashed'
      }
    }
  }
  let legend = {
    show: false
  }

  let xAxis = {
    show: dataBlue.value.length > 0 || dataOrange.value.length > 0,
    type: 'category',
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      show: true,
      hideOverlap: false,
      interval: 0,
      width: 60,
      overflow: 'breakAll',
      color: '#9E9E9E'
    },
    boundaryGap: true,
    data: xAxisData.value
  }

  options.value = {
    title,
    xAxis: xAxis,
    grid: grid,
    tooltip: tooltip,
    yAxis: yAxis,
    legend: legend,
    color: ['#0064FF', '#FFA500'],
    series: [
      {
        type: 'bar',
        name: '分析人群占比',
        tooltip: {
          valueFormatter: function (value) {
            return value + '%'
          }
        },
        data: dataBlue.value,
        itemStyle: {
          borderRadius: 2
        },
        barMaxWidth: 18
      },
      {
        type: 'bar',
        name: '对比人群占比',
        tooltip: {
          valueFormatter: function (value) {
            return value + '%'
          }
        },
        data: dataOrange.value,
        itemStyle: {
          borderRadius: 2
        },
        barMaxWidth: 18
      }
    ]
  }

  echartRef.value?.resizeHandler()
}
watch(
  () => props.data,
  (val) => {
    nextTick(() => {
      setChartOptions()
    })
  },
  { immediate: true }
)
defineExpose({ setChartOptions }) // 提供 setChartOptions 方法，用于设置图表配置
</script>
<style lang="scss" scoped>
.chart-box {
  height: 100%;
  position: relative;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
}
</style>
