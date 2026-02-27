<template>
  <div class="chart-box" :style="width === 270 ? `width:270px` : `border:none;width:${width}px`">
    <Echart :options="options" :height="height" ref="echartRef" />
  </div>
</template>
<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
const props = defineProps({
  height: propTypes.oneOfType([Number, String]).def('155px'),
  width: propTypes.oneOfType([Number, String]).def('270px'),
  data: propTypes.object.def({})
})
const options = ref({})
const echartRef = ref<any>()
const lable: any = {
  crowdXzzln: '小镇中老年',
  crowdDsln: '都市蓝领',
  crowdXrbl: '新锐白领',
  crowdJzmm: '精致妈妈',
  crowdDsyf: '都市银发',
  crowdZ: 'Z世代',
  crowdXzqn: '小镇青年',
  crowdZszc: '资深中产'
}

interface Data {
  name: string
  value: number
}

const data = ref<Data[]>([])
const getData = () => {
  data.value = []
  Object.keys(props.data).forEach((key) => {
    if (Object.keys(lable).includes(key)) {
      let value = props.data[key] || 0
      if (typeof value === 'string') {
        value = value.replace('%', '')
      }
      if (value < 1) {
        value = Number(value * 100).toFixed(2)
      }
      const numAttr = value.toString().split('.')
      if (numAttr.length > 1) {
        value =
          Number(numAttr[1].slice(0, 2)) > 0
            ? `${numAttr[0]}.${numAttr[1].slice(0, 2)}`
            : `${numAttr[0]}`
      }
      data.value.push({ name: lable[key], value })
    }
  })
}

const setChartOptions = () => {
  getData()
  let title = {
    show: data.value.length === 0, // 没数据才显示
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
    trigger: 'axis',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderWidth: 0,
    textStyle: {
      color: '#fff'
    },
    confine: true
  }
  let yAxis = {
    show: data.value?.length > 0,
    type: 'value',
    axisLabel: {
      formatter: '{value}%'
    }
  }
  let legend = {
    orient: 'horizontal',
    top: 'bottom',
    icon: 'circle',
    type: 'scroll'
  }

  let xAxis = {
    show: data.value?.length > 0,
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
      width: 24,
      overflow: 'breakAll'
    },
    boundaryGap: true,
    data: Object.values(lable)
  }

  options.value = {
    title,
    xAxis: xAxis,
    grid: grid,
    tooltip: tooltip,
    yAxis: yAxis,
    legend: legend,
    color: ['#0064FF'],
    series: {
      type: 'bar',
      tooltip: {
        valueFormatter: function (value) {
          return value + '%'
        }
      },
      data: data.value,
      itemStyle: {
        borderRadius: 2
      },
      barMaxWidth: 14
    }
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
  border-radius: 10px;
}
</style>
