<template>
  <div style="width: 100%; height: 100%">
    <Echart :options="options" :height="height" />
  </div>
</template>

<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'

const props = defineProps({
  height: propTypes.oneOfType([Number, String]).def('320px'),
  width: propTypes.oneOfType([Number, String]).def(''),
  showAxis: propTypes.bool.def(false),
  option: propTypes.object.def({
    xAxisData: [], //X轴数据
    yAxisData: [], //Y轴数据
    tipsName: '', //提示
    type: 'line', // line  折线 bar 树状图
    xAxisType: 'category',
    yAxisType: 'value',
    lineColor: '' // 折线的颜色})
  }),
  option1: propTypes.object.def({
    xAxisData: [], //X轴数据
    yAxisData: [], //Y轴数据
    tipsName: '', //提示
    type: 'line', // line  折线 bar 树状图
    xAxisType: 'category',
    yAxisType: 'value',
    lineColor: '' // 折线的颜色})
  }),
  option2: propTypes.object.def({
    xAxisData: [], //X轴数据
    yAxisData: [], //Y轴数据
    tipsName: '', //提示
    type: 'line', // line  折线 bar 树状图
    xAxisType: 'category',
    yAxisType: 'value',
    lineColor: '' // 折线的颜色})
  })
})

const options = ref({})

// 设置图表配置
const setChartOptions = () => {
  let xAxis = {
    type: props.option.xAxisType || 'category',
    data: props.option.xAxisType === 'value' ? [] : props.option.xAxisData || [],

    boundaryGap: true, // x 坐标轴两边留白策略，类目轴和非类目轴的设置和表现不一样。
    axisLabel: {
      // rotate: this.option1.type === "bar" ? 0 : -45, // X 轴标签文字旋转角度
      rotate: 0, // X 轴标签文字旋转角度
      interval: props.option.xAxisData && props.option.xAxisData.length >= 30 ? 2 : 0, //设置 X 轴数据间隔几个显示一个，为0表示都显示
      color: '#666',
      fontSize: 14,
      fontWeight: 400
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: '#F0F0F0'
      }
    },
    nameGap: 15, //坐标轴名称与轴线之间的距离。
    axisTick: {
      show: false,
      //是否显示坐标轴刻度。
      inside: false //坐标轴刻度是否朝内，默认朝外。
    }
  }
  let grid = {
    left: 8,
    right: 50,
    bottom: 12,
    top: 40,
    containLabel: true
  }
  let tooltip = {
    trigger: 'axis',
    backgroundColor: '#fff',
    borderRadius: 8,
    boxShadow: '0px 2px 4px 2px rgba(0,0,0,0.17)',
    textStyle: {
      color: '#333',
      fontSize: 14
    },
    padding: [12, 12]
  }

  let yAxis = {
    type: props.option.yAxisType || 'value',
    data: props.option.yAxisType === 'category' ? props.option.yAxisData : [],

    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      color: '#666',
      fontSize: 14,
      fontWeight: 400
    },
    splitLine: {
      lineStyle: {
        type: 'dashed' //虚线
      },
      show: true //隐藏
    }
  }
  let legend = {}

  let series = [{}]
  // 加载第一条折线
  series[0] = {
    name: props.option.tipsName || '',
    itemStyle: {
      normal: {
        // label : {
        //     show: true
        //   },
        color: props.option.lineColor,
        lineStyle: {
          color: props.option.lineColor,
          width: 2
        }
      }
    },
    smooth: 0, // 设置折线弧度
    type: props.option.type || 'line',
    symbol: 'emptyCircle', // 拐点的形状
    showSymbol: true,
    symbolSize: 8, // 拐点大小
    data:
      props.option.yAxisType === 'category' ? props.option.xAxisData : props.option.yAxisData || [],
    animationDuration: 1800,
    animationEasing: 'cubicInOut'
  }
  series[1] = {
    name: props.option1.tipsName || '',
    itemStyle: {
      normal: {
        // label : {
        //     show: true
        //   },
        color: props.option1.lineColor,
        lineStyle: {
          color: props.option1.lineColor,
          width: 2
        }
      }
    },
    smooth: 0, // 设置折线弧度
    type: props.option1.type || 'line',
    symbol: 'emptyCircle', // 拐点的形状
    showSymbol: true,
    symbolSize: 8, // 拐点大小
    data:
      props.option1.yAxisType === 'category'
        ? props.option1.xAxisData
        : props.option1.yAxisData || [],
    animationDuration: 1800,
    animationEasing: 'cubicInOut'
  }
  series[2] = {
    name: props.option2.tipsName || '',
    itemStyle: {
      normal: {
        // label : {
        //     show: true
        //   },
        color: props.option2.lineColor,
        lineStyle: {
          color: props.option2.lineColor,
          width: 2
        }
      }
    },
    smooth: 0, // 设置折线弧度
    type: props.option2.type || 'line',
    symbol: 'emptyCircle', // 拐点的形状
    showSymbol: true,
    symbolSize: 8, // 拐点大小
    data:
      props.option2.yAxisType === 'category'
        ? props.option2.xAxisData
        : props.option2.yAxisData || [],
    animationDuration: 1800,
    animationEasing: 'cubicInOut'
  }

  // 给EChart赋值
  options.value = {
    xAxis: xAxis,
    grid: grid,
    tooltip: tooltip,
    yAxis: yAxis,
    legend: legend,
    series: series
  }
}

defineExpose({ setChartOptions }) // 提供 setChartOptions 方法，用于设置图表配置
</script>

<style lang="scss" scoped></style>
