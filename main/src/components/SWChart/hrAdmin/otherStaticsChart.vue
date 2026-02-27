<template>
  <div style="width: 100%; height: 100%">
    <Echart :options="options" :height="height" @echart-click="echartClick" />
  </div>
</template>

<script lang="ts" setup>
import Echart from '@/components/Echart/src/Echart.vue'
import { propTypes } from '@/utils/propTypes'

const props = defineProps({
  height: propTypes.oneOfType([Number, String]).def('244px'),
  width: propTypes.oneOfType([Number, String]).def(''),
  option: propTypes.object.def({
    data: [],
    line: 1,
    xAxisData: [], //X轴数据
    yAxisData: [], //Y轴数据
    tipsName: '', //提示
    type: 'bar', // line  折线 bar 树状图
    xAxisType: 'category',
    yAxisType: 'value',
    direction: 'horizontal', //树状图的方向 horizontal 垂直: vertical
    lineColor: '' // 折线的颜色})
  }),
  modelType: propTypes.bool.def(false)
})

const options = ref({})

watch(
  () => props.modelType,
  () => {
    setTimeout(() => {
      setChartOptions()
    }, 20)
  }
)

// 设置图表配置
const setChartOptions = () => {
  let grid = {
    left: 8,
    right: 0,
    bottom: 12,
    top: 40,
    containLabel: true
  }
  let tooltip = {
    trigger: 'item'
  }

  let legend = {
    orient: 'horizontal ',
    x: 'right',
    y: 'center',
    icon: 'circle',
    itemGap: 20,
    padding: 8,
    align: 'left',
    textStyle: {
      textAlign: 'right',

      rich: {
        a: {
          width: props.option.data.length > 7 ? 20 : 90,
          fontWeight: '500',
          fontSize: '14px',
          color: props.modelType ? '#FFD7A4' : '#4F5470'
        },
        b: {
          fontWeight: '500',
          fontSize: '14px',
          color: props.modelType ? '#FFF5E9' : '#4F5470'
        }
      }
    },
    // name 对应的是 series.data 中的 name 属性
    formatter: function (name) {
      return `{a|${name}}     {b|${getRatioValue(name)}%}`
    }
  }

  let series = [{}]
  // 加载第一条折线
  series[0] = {
    type: 'pie',
    radius: ['50%', '90%'], // 设置环形饼状图， 第一个百分数设置内圈大小，第二个百分数设置外圈大小
    center: ['28%', '50%'],
    data: props.option.data || [],
    label: {
      show: false
    },
    itemStyle: {
      normal: {
        color: function (colors) {
          var colorList = [
            '#708AFF',
            '#42A4F5',
            '#9D73FF',
            '#56B3F6',
            '#F7C12D',
            '#FF992B',
            '#A0A5C6',
            '#F76560'
          ]
          var darkColorList = [
            '#F7CD9B',
            '#ED5A49',
            '#F78C62',
            '#AD806F',
            '#F78C62',
            '#BA5D53',
            '#D5BFBA',
            '#E6B3A0'
          ]
          return props.modelType
            ? darkColorList[colors.dataIndex % 8]
            : colorList[colors.dataIndex % 8]
        }
      }
    },
    textStyle: {
      rich: {
        a: {
          fontWeight: '500',
          fontSize: '14px',
          color: '#4F5470',
          lineHeight: '20px'
        },
        b: {
          fontWeight: '500',
          fontSize: '14px',
          color: '#4F5470',
          lineHeight: '20px'
        }
      }
    },
    emphasis: {
      itemStyle: {
        shadowBlur: 5,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      }
    },
    // data: props.option.xAxisData,
    animationDuration: 1200,
    animationEasing: 'cubicInOut'
  }
  // 给EChart赋值
  options.value = {
    // xAxis: xAxis,
    grid: grid,
    tooltip: tooltip,
    label: false,
    legend,
    // yAxis: yAxis,
    series: series
  }
}

const getRatioValue = (name: string) => {
  let ratioValue = ''
  props.option.data.forEach((item) => {
    if (item.name === name) {
      ratioValue = item.ratio
    }
  })
  return ratioValue
}

const echartClick = (e) => {
  emit('echartClick', e)
}
const emit = defineEmits(['echartClick'])
defineExpose({ setChartOptions }) // 提供 setChartOptions 方法，用于设置图表配置
</script>
