<template>
  <div
    class="dyCompassChart"
    :class="{ dyCompassChart1: showAxis }"
    style="width: 100%; height: 100%; z-index: 99999"
  >
    <Echart :options="options" :height="height" @echart-click="echartClick" />
  </div>
</template>

<script lang="ts" setup>
import Echart from '@/components/Echart/src/Echart.vue'
import { propTypes } from '@/utils/propTypes'
import * as echarts from 'echarts/core'

const props = defineProps({
  height: propTypes.oneOfType([Number, String]).def('150px'),
  width: propTypes.oneOfType([Number, String]).def(''),
  showAxis: propTypes.bool.def(false),
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

  option1: propTypes.object.def({
    xAxisData: [], //X轴数据
    yAxisData: [], //Y轴数据
    tipsName: '', //提示
    type: 'line', // line  折线 bar 树状图
    xAxisType: 'category',
    yAxisType: 'value',
    direction: 'horizontal', //树状图的方向 horizontal 垂直: vertical
    lineColor: '' // 折线的颜色})
  }),

  option2: propTypes.object.def({
    xAxisData: [], //X轴数据
    yAxisData: [], //Y轴数据
    tipsName: '', //提示
    type: 'line', // line  折线 bar 树状图
    xAxisType: 'category',
    yAxisType: 'value',
    direction: 'horizontal', //树状图的方向 horizontal 垂直: vertical
    lineColor: '' // 折线的颜色})
  }),

  option3: propTypes.object.def({
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

const axisYInterval = (count) => {
  if (count >= 0 && count < 30) {
    return 1
  } else if (count >= 30 && count < 60) {
    return 2
  } else if (count >= 60) {
    return 3
  }
  return 0
}
// 设置图表配置
const setChartOptions = () => {
  let xAxis = {
    type: props.option.xAxisType || 'category',
    data: props.option.xAxisType === 'value' ? [] : props.option.xAxisData || [],
    boundaryGap: true, // x 坐标轴两边留白策略，类目轴和非类目轴的设置和表现不一样。
    axisLabel: {
      rotate: 0, // X 轴标签文字旋转角度
      interval: axisYInterval(props.option.xAxisData.length), //设置 X 轴数据间隔几个显示一个，为0表示都显示
      color: '#888',
      fontSize: 14,
      fontWeight: 400,
      formatter: function (value, index) {
        const arr = value && value.split('-')
        if (arr && arr.length > 2) {
          return `${arr[1]}-${arr[2]}`
        }
        return `${value}`
      },
      show: props.showAxis
        ? true
        : props.option.xAxisData && props.option.xAxisData.length <= 7
          ? true
          : false
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: '#F0F0F0'
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
    left: 10,
    right: 10,
    bottom: 10,
    top: 10,
    containLabel: true
  }
  let tooltip = {
    trigger: 'axis',
    position: function (point, params, dom, rect, size) {
      const contentSize = size.contentSize
      const viewSize = size.viewSize
      const point_x = point[0]
      const point_Y = point[1]
      let x = point_x - 30
      let y = point[1] - contentSize[1]
      if (point_Y <= contentSize[1]) {
        y = 0
      }
      if (point_x + contentSize[0] > viewSize[0]) {
        x = viewSize[0] - contentSize[0]
      }

      // 固定距离左边的距离
      return [x, y]
    },
    formatter: function (param) {
      return (
        '<div style="width: 160px;height: 110px;background: #ffffff;border-radius: 4px;display: flex;flex-direction: column;margin:-4px; ">' +
        `<div style="display: flex;flex-direction: row;align-items: center;padding-top: 4px;margin-left:6px;font-size: 14px;color: #8186A5;">` +
        '<div>' +
        `${param[0].axisValue}` +
        '</div>' +
        '</div>' +
        `<div style="display: flex;flex-direction: row;align-items: center;padding-top: 0px;margin-left:6px;font-size: 14px;color: #333;">` +
        `<div style="padding-right:5px">` +
        `${props.option.tipsName}` +
        '</div>' +
        `<div style="width: 6px;height: 6px;background: ${props.option.lineColor} ;border-radius:3px;margin-right:4px;"></div>` +
        `<div>` +
        `${Number(param[0].value).toFixed(2)}` +
        '</div>' +
        '</div>' +
        `<div style="display: flex;flex-direction: row;align-items: center;padding-top: 0px;margin-left:6px;font-size: 14px;color: #333;">` +
        `<div style="padding-right:5px">` +
        `${props.option1.tipsName}` +
        '</div>' +
        `<div style="width: 6px;height: 6px;background: ${props.option1.lineColor};border-radius:3px;margin-right:4px;"></div>` +
        `<div>` +
        `${Number(param[1].value).toFixed(2)}%` +
        '</div>' +
        '</div>' +
        `<div style="display: flex;flex-direction: row;align-items: center;padding-top: 0px;margin-left:6px;font-size: 14px;color: #333;">` +
        `<div style="padding-right:5px">` +
        `${props.option2.tipsName}` +
        '</div>' +
        `<div style="width: 6px;height: 6px;background: ${props.option2.lineColor};border-radius:3px;margin-right:4px;"></div>` +
        `<div>` +
        `${Number(param[2].value).toFixed(2)}%` +
        '</div>' +
        '</div>' +
        `<div style="display: flex;flex-direction: row;align-items: center;padding-top: 0px;margin-left:6px;font-size: 14px;color: #333;">` +
        `<div style="padding-right:5px">` +
        `${props.option3.tipsName}` +
        '</div>' +
        `<div style="width: 6px;height: 6px;background: ${props.option3.lineColor};border-radius:3px;margin-right:4px;"></div>` +
        `<div>` +
        `${Number(param[3].value).toFixed(2)}%` +
        '</div>' +
        '</div>'
      )
    },

    backgroundColor: '#EEF4FD',
    borderRadius: 8,
    boxShadow: '0px 2px 12px 0px rgba(0,0,0,0.16)',
    borderImage: 'linear-gradient(45deg, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0)) 1 1',
    backdropFilter: 'blur(0px)',
    textStyle: {
      color: '#8186A5',
      fontSize: 14
    },
    zIndex: 9999
    // padding: [12, 12]
  }

  const commonYAxis = {
    type: props.option.yAxisType || 'value',
    data: props.option.yAxisType === 'category' ? props.option.yAxisData : [],
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      color: '#999',
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
  let yAxis = [
    { ...commonYAxis, yAxisIndex: 0 },
    {
      ...commonYAxis,
      axisLabel: {
        color: '#999',
        fontSize: 14,
        fontWeight: 400,
        formatter: function (value) {
          return Number(value) + '%'
        }
      },
      yAxisIndex: 1
    }
  ]

  let series = [{}]
  // 加载第一条折线

  series[0] = {
    name: props.option.tipsName || '',
    itemStyle: {
      normal: {
        color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
          {
            offset: 0,
            color: props.option.lineColor
          },
          {
            offset: 1,
            color: props.option.lineColor
          }
        ]),
        lineStyle: {
          color: props.option.lineColor,
          width: 2
        },
        barBorderRadius: [6, 6, 0, 0]
      }
    },
    yAxisIndex: 0,
    smooth: true, // 设置折线弧度
    type: 'bar',
    barMaxWidth: '31px',
    showSymbol: true,
    symbolSize: 0, // 拐点大小
    data:
      props.option.yAxisType === 'category' ? props.option.xAxisData : props.option.yAxisData || [],
    animationDuration: 1200,
    animationEasing: 'cubicInOut'
  }
  series[1] = {
    name: props.option1.tipsName || '',
    itemStyle: {
      normal: {
        color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
          {
            offset: 0,
            color: props.option1.lineColor
          },
          {
            offset: 1,
            color: props.option1.lineColor
          }
        ]),
        lineStyle: {
          color: props.option1.lineColor,
          width: 2
        },
        barBorderRadius: [6, 6, 0, 0]
      }
    },
    yAxisIndex: 1,
    smooth: true, // 设置折线弧度
    type: 'line',
    showSymbol: true,
    symbolSize: 0, // 拐点大小
    data:
      props.option1.yAxisType === 'category'
        ? props.option1.xAxisData
        : props.option1.yAxisData || [],
    animationDuration: 1200,
    animationEasing: 'cubicInOut'
  }

  series[2] = {
    name: props.option2.tipsName || '',
    itemStyle: {
      normal: {
        color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
          {
            offset: 0,
            color: props.option2.lineColor
          },
          {
            offset: 1,
            color: props.option2.lineColor
          }
        ]),
        lineStyle: {
          color: props.option2.lineColor,
          width: 2
        },
        barBorderRadius: [6, 6, 0, 0]
      }
    },
    yAxisIndex: 1,
    smooth: true, // 设置折线弧度
    type: 'line',
    showSymbol: true,
    symbolSize: 0, // 拐点大小
    data:
      props.option1.yAxisType === 'category'
        ? props.option2.xAxisData
        : props.option2.yAxisData || [],
    animationDuration: 1200,
    animationEasing: 'cubicInOut'
  }

  series[3] = {
    name: props.option3.tipsName || '',
    itemStyle: {
      normal: {
        color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
          {
            offset: 0,
            color: props.option3.lineColor
          },
          {
            offset: 1,
            color: props.option3.lineColor
          }
        ]),
        lineStyle: {
          color: props.option3.lineColor,
          width: 2
        },
        barBorderRadius: [6, 6, 0, 0]
      }
    },
    yAxisIndex: 1,
    smooth: true, // 设置折线弧度
    type: 'line',
    showSymbol: true,
    symbolSize: 0, // 拐点大小
    data:
      props.option3.yAxisType === 'category'
        ? props.option3.xAxisData
        : props.option3.yAxisData || [],
    animationDuration: 1200,
    animationEasing: 'cubicInOut'
  }
  // 给EChart赋值
  options.value = {
    xAxis: xAxis,
    grid: grid,
    tooltip: tooltip,
    yAxis: yAxis,
    series: series
  }
}

const echartClick = (e) => {
  emit('echartClick', e)
}
const emit = defineEmits(['echartClick'])

defineExpose({ setChartOptions }) // 提供 setChartOptions 方法，用于设置图表配置
</script>

<style lang="scss" scoped>
.dyCompassChart {
  background: #ffffff;
  border-radius: 10px;
  border: 1px solid #f1eeee;
}
.dyCompassChart1 {
  border: none;
}
</style>
