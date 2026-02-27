<template>
  <div style="width: 100%; height: 100%">
    <Echart :options="options" :height="height" />
  </div>
</template>

<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
import { numberFormateShow } from '@/utils/formatter'

const props = defineProps({
  height: propTypes.oneOfType([Number, String]).def('350px'),
  width: propTypes.oneOfType([Number, String]).def(''),
  option1: propTypes.object.def({
    xAxisData: [], //X轴数据
    yAxisData: [], //Y轴数据
    tipsName: '', //提示
    type: 'line', // line  折线 bar 树状图
    xAxisType: 'category',
    yAxisType: 'value',
    direction: 'horizontal', //树状图的方向 horizontal 垂直: vertical
    lineColor: '' // 折线的颜色})
  })
})

const options = ref({})

// 设置图表配置
const setChartOptions = () => {
  let xAxis = {
    type: props.option1.xAxisType || 'category',
    data: props.option1.xAxisType === 'value' ? [] : props.option1.xAxisData || [],
    boundaryGap: true, // x 坐标轴两边留白策略，类目轴和非类目轴的设置和表现不一样。
    axisLabel: {
      rotate: 45, // X 轴标签文字旋转角度
      interval: props.option1.xAxisData && props.option1.xAxisData.length >= 28 ? 1 : 0, //设置 X 轴数据间隔几个显示一个，为0表示都显示
      color: '#888',
      fontSize: 14,
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
    left: 0,
    right: 0,
    bottom: 12,
    top: 40,
    containLabel: true
  }
  let tooltip = {
    trigger: 'axis',
    backgroundColor: 'rgba(36,36,38,0.68)',
    borderRadius: 4,
    boxShadow: '0px 2px 4px 2px rgba(0,0,0,0.17)',
    textStyle: {
      color: '#ffffff',
      fontSize: 14
    },
    valueFormatter: function (value) {
      if (props.option1.tipsName.includes('占比')) {
        return value + '%'
      } else {
        return numberFormateShow(value) || 0
      }
    },
    padding: [12, 12]
  }

  let yAxis = {
    type: props.option1.yAxisType || 'value',
    data: props.option1.yAxisType === 'category' ? props.option1.yAxisData : [],
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
        type: 'solid', //虚线
        color: '#E2E8EE'
      },
      show: true //隐藏
    }
  }
  let legend = {}

  // 区域颜色
  const areaStyle = {
    normal: {
      opacity: 0.4,
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          {
            offset: 0,
            color: '#0064FF' // 0% 处的颜色
          },
          {
            offset: 1,
            color: 'rgba(0, 100, 255, 0.02)' // 100% 处的颜色
          }
        ],
        global: false // 缺省为 false
      }
    }
  }

  let series = [{}]
  // 加载第一条折线
  series[0] = {
    name: props.option1.tipsName || '',
    itemStyle: {
      normal: {
        color: props.option1.lineColor,
        lineStyle: {
          color: props.option1.lineColor,
          width: 2
        }
      },
    },
    areaStyle,
    smooth: 0.5, // 设置折线弧度
    type: props.option1.type || 'line',
    barWidth: '24px',
    symbol: 'emptyCircle', // 拐点的形状
    showSymbol: false,
    symbolSize: 8, // 拐点大小
    data:
      props.option1.yAxisType === 'category'
        ? props.option1.xAxisData
        : props.option1.yAxisData || [],
    animationDuration: 1200,
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
