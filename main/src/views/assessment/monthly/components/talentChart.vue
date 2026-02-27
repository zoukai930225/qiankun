<template>
  <div style="width: 100%; height: 100%">
    <Echart :options="options" :height="height" @echart-click="echartClick" />
  </div>
</template>

<script lang="ts" setup>
import Echart from '@/components/Echart/src/Echart.vue'
import { numberFormateShow } from '@/utils/formatter'
import { propTypes } from '@/utils/propTypes'
import * as echarts from 'echarts/core'

const props = defineProps({
  height: propTypes.oneOfType([Number, String]).def('380px'),
  width: propTypes.oneOfType([Number, String]).def(''),
  option: propTypes.object.def({
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

// watch(
//   () => props.modelType,
//   () => {
//     setTimeout(() => {
//       setChartOptions()
//     }, 20)
//   }
// )

const options = ref({})

const getData = (data: any) => {
  if (!data || data.length === 0) return [0, 0, 0, 0, 0]
  return data.map((item: any, index) => {
    return [item.zdxzs || 0, item.gnswzs || 0, item.yxlzs || 0, item.cjdxzs || 0, item.jrxzs || 0]
  })
}

// 设置图表配置
const setChartOptions = (chartData: any) => {
  const legendData = ['3', '2', '1', '0']
  const data = getData(chartData)
  let xAxis = {
    type: 'category',
    data: ['主动性', '概念思维', '影响力', '成就导向', '坚韧性'],
    boundaryGap: true, // x 坐标轴两边留白策略，类目轴和非类目轴的设置和表现不一样。
    axisLabel: {
      // rotate: 45, // X 轴标签文字旋转角度
      interval: 0, //设置 X 轴数据间隔几个显示一个，为0表示都显示
      color: '#888888',
      fontSize: 10,
      fontWeight: 400
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: '#E2E8EE'
      }
    },
    nameGap: 5, //坐标轴名称与轴线之间的距离。
    axisTick: {
      show: false,
      //是否显示坐标轴刻度。
      inside: false //坐标轴刻度是否朝内，默认朝外。
    }
  }
  let grid = {
    left: 50,
    right: 50,
    bottom: 12,
    top: 40,
    containLabel: true
  }
  let tooltip = {
    show: true,
    backgroundColor: '	rgba(0,0,0,0.7)',
    borderColor: 'rgba(0,0,0,0.7)',
    textStyle: {
      color: '#fff'
    },
    confine: true,
    extraCssText: 'text-align: left;'
  }

  let yAxis = {
    type: 'value',
    // name: '人数',
    // data: props.option.yAxisType === 'category' ? props.option.yAxisData : [],
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      color: '#666666',
      fontSize: 14,
      fontWeight: 400
    },
    splitLine: {
      lineStyle: {
        type: 'solid' //虚线
      },
      show: true //隐藏
    }
  }
  let legend = {
    show: true,
    itemWidth: 8,
    itemHeight: 8,
    data: legendData,
    borderRadius: 0
  }

  let series = [
    {
      name: legendData[0],
      itemStyle: {
        color: '#9BE59B',
        // lineStyle: {
        //   color: props.option.lineColor,
        //   width: 2
        // },
        borderRadius: [4, 4, 0, 0]
      },
      smooth: 0.5, // 设置折线弧度
      type: 'bar',
      barWidth: '25px',
      symbol: 'emptyCircle', // 拐点的形状
      showSymbol: true,
      symbolSize: 8, // 拐点大小
      data: data[0],
      animationDuration: 1200,
      animationEasing: 'cubicInOut',
      tooltip: {}
    },
    {
      name: legendData[1],
      itemStyle: {
        color: '#5999FC',
        // lineStyle: {
        //   color: props.option.lineColor,
        //   width: 2
        // },
        borderRadius: [4, 4, 0, 0]
      },
      smooth: 0.5, // 设置折线弧度
      type: 'bar',
      barWidth: '25px',
      symbol: 'emptyCircle', // 拐点的形状
      showSymbol: true,
      symbolSize: 8, // 拐点大小
      data: data[1],
      animationDuration: 1200,
      animationEasing: 'cubicInOut'
    },
    {
      name: legendData[2],
      itemStyle: {
        color: '#FDD843',
        // lineStyle: {
        //   color: props.option.lineColor,
        //   width: 2
        // },
        borderRadius: [4, 4, 0, 0]
      },
      smooth: 0.5, // 设置折线弧度
      type: 'bar',
      barWidth: '25px',
      symbol: 'emptyCircle', // 拐点的形状
      showSymbol: true,
      symbolSize: 8, // 拐点大小
      data: data[2],
      animationDuration: 1200,
      animationEasing: 'cubicInOut'
    },
    {
      name: legendData[3],
      itemStyle: {
        color: '#FD6D6D',
        // lineStyle: {
        //   color: props.option.lineColor,
        //   width: 2
        // },
        borderRadius: [4, 4, 0, 0]
      },
      smooth: 0.5, // 设置折线弧度
      type: 'bar',
      barWidth: '25px',
      symbol: 'emptyCircle', // 拐点的形状
      showSymbol: true,
      symbolSize: 8, // 拐点大小
      data: data[3],
      animationDuration: 1200,
      animationEasing: 'cubicInOut'
    }
  ]

  // 给EChart赋值
  options.value = {
    xAxis: xAxis,
    grid: grid,
    tooltip: tooltip,
    yAxis: yAxis,
    series: series,
    legend
  }
}

const echartClick = (e) => {
  emit('echartClick', e)
}
const emit = defineEmits(['echartClick'])

defineExpose({ setChartOptions }) // 提供 setChartOptions 方法，用于设置图表配置
</script>
