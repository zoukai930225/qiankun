<template>
  <div style="width: 100%; height: 100%">
    <Echart :options="options" :height="height" @echart-click="echartClick" />
  </div>
</template>

<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
import { numberFormateShow } from '@/utils/formatter'
import Echart from '@/components/Echart/src/Echart.vue'

const props = defineProps({
  height: propTypes.oneOfType([Number, String]).def('397px'),
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
  option1: propTypes.object.def({
    xAxisData: [], //X轴数据
    yAxisData: [], //Y轴数据
    tipsName: '', //提示
    type: 'bar', // line  折线 bar 树状图
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
    rate: true,
    xAxisType: 'category',
    yAxisType: 'value',
    direction: 'horizontal', //树状图的方向 horizontal 垂直: vertical
    lineColor: '' // 折线的颜色})
  }),
  option3: propTypes.object.def({
    xAxisData: [], //X轴数据
    yAxisData: [], //Y轴数据
    tipsName: '', //提示
    rate: true,
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
    type: props.option.xAxisType || 'category',
    data: props.option.xAxisType === 'value' ? [] : props.option.xAxisData || [],
    boundaryGap: true, // x 坐标轴两边留白策略，类目轴和非类目轴的设置和表现不一样。
    axisLabel: {
      rotate: 0, // X 轴标签文字旋转角度
      interval: props.option.xAxisData && props.option.xAxisData.length >= 15 ? 1 : 0, //设置 X 轴数据间隔几个显示一个，为0表示都显示
      color: '#888',
      fontSize: 14,
      fontWeight: 400
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
    left: 20,
    right: 26,
    bottom: 12,
    top: 40,
    containLabel: true
  }
  let tooltip = {
    trigger: 'axis',
    position: function (point, params, dom, rect, size) {
      // 固定距离左边的距离
      return [point[0] - 100, point[1] - 120]
    },
    backgroundColor: '#000000ad',
    borderRadius: 8,
    boxShadow: '0px 2px 12px 0px rgba(0,0,0,0.16)',
    borderImage: 'linear-gradient(45deg, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0)) 1 1',
    backdropFilter: 'blur(0px)',
    textStyle: {
      color: '#8186A5',
      fontSize: 14
    },
    formatter: function (param) {
      if (param.length === 4) {
        return (
          '<div style="width: 166px;height: auto;background: transparent;border-radius: 4px;display: flex;flex-direction: column;color: #fff; ">' +
          `<div style="display: flex;flex-direction: row;align-items: center;padding-top: 6px;margin-left:10px;font-size: 14px;">` +
          '<div>' +
          `${param.length > 0 ? param[0].axisValue : ''}` +
          '</div>' +
          '</div>' +
          ` <div style="display: flex;flex-direction: row;align-items: center;padding-top: 3px;margin-left:10px;font-size: 14px;">` +
          `<img  style="width:13px;height:4px;border-radius:4px;background: ${props.option3.lineColor};margin-right:10px;"/>` +
          `<div>` +
          `${param.length > 0 ? param[0].seriesName : ''}` +
          '</div>' +
          `<div style="margin-left:auto;margin-right:15px;">` +
          `${param.length > 0 ? Number(param[0].value * 100).toFixed(2) || '0' : ''}%` +
          '</div>' +
          '</div>' +
          `<div style="display: flex;flex-direction: row;align-items: center;padding-top: 3px;margin-left:10px;font-size: 14px;">` +
          `<img  style="width:13px;height:4px;border-radius:4px;background: ${props.option2.lineColor};margin-right:10px;"/>` +
          `<div>` +
          `${param.length > 1 ? param[1].seriesName : ''}` +
          '</div>' +
          `<div style="margin-left:auto;margin-right:15px;">` +
          `${param.length > 1 ? Number(param[1].value * 100).toFixed(2) || '0' : '0'}%` +
          '</div>' +
          '</div>' +
          `<div style="display: flex;flex-direction: row;align-items: center;padding-top: 3px;margin-left:10px;font-size: 14px;">` +
          `<img  style="width:13px;height:4px;border-radius:4px;background: ${props.option1.lineColor};margin-right:10px;"/>` +
          `<div>` +
          `${param.length > 2 ? param[2].seriesName : ''}` +
          '</div>' +
          `<div style="margin-left:auto;margin-right:15px;">` +
          `${param.length > 2 ? numberFormateShow(param[2].value) || '0' : '0'}` +
          '</div>' +
          '</div>' +
          `<div style="display: flex;flex-direction: row;align-items: center;padding-top: 3px;margin-left:10px;font-size: 14px;margin-bottom:5px;">` +
          `<img  style="width:13px;height:4px;border-radius:4px;background: ${props.option.lineColor};margin-right:10px;"/>` +
          `<div>` +
          `${param.length > 3 ? param[3].seriesName : ''}` +
          '</div>' +
          `<div style="margin-left:auto;margin-right:15px;">` +
          `${param.length > 3 ? numberFormateShow(param[3].value) || '0' : '0'}` +
          '</div>' +
          '</div>'
        )
        ;('</div>')
      } else {
        return (
          '<div style="width: 166px;height: auto;background: transparent;border-radius: 4px;display: flex;flex-direction: column;color: #fff; ">' +
          `<div style="display: flex;flex-direction: row;align-items: center;padding-top: 6px;margin-left:10px;font-size: 14px;">` +
          '<div>' +
          `${param.length > 0 ? param[0].axisValue : ''}` +
          '</div>' +
          '</div>' +
          `<div style="display: flex;flex-direction: row;align-items: center;padding-top: 3px;margin-left:10px;font-size: 14px;">` +
          `<img  style="width:13px;height:4px;border-radius:4px;background: ${props.option3.lineColor};margin-right:10px;"/>` +
          `<div>` +
          `${param.length > 0 ? param[0].seriesName : ''}` +
          '</div>' +
          `<div style="margin-left:auto;margin-right:15px;">` +
          `${param.length > 0 ? Number(param[0].value * 100).toFixed(2) || '0' : '0'}%` +
          '</div>' +
          '</div>' +
          `<div style="display: flex;flex-direction: row;align-items: center;padding-top: 3px;margin-left:10px;font-size: 14px;">` +
          `<img  style="width:13px;height:4px;border-radius:4px;background: ${props.option1.lineColor};margin-right:10px;"/>` +
          `<div>` +
          `${param.length > 1 ? param[1].seriesName : ''}` +
          '</div>' +
          `<div style="margin-left:auto;margin-right:15px;">` +
          `${param.length > 1 ? numberFormateShow(param[1].value) || '0' : '0'}` +
          '</div>' +
          '</div>' +
          `<div style="display: flex;flex-direction: row;align-items: center;padding-top: 3px;margin-left:10px;font-size: 14px;margin-bottom:5px;">` +
          `<img  style="width:13px;height:4px;border-radius:4px;background: ${props.option.lineColor};margin-right:10px;"/>` +
          `<div>` +
          `${param.length > 2 ? param[2].seriesName : ''}` +
          '</div>' +
          `<div style="margin-left:auto;margin-right:15px;">` +
          `${param.length > 2 ? numberFormateShow(param[2].value) || '0' : '0'}` +
          '</div>' +
          '</div>'
        )
        ;('</div>')
      }
    },
    padding: [12, 12]
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
      yAxisIndex: 1,
      axisLabel: {
        color: '#999',
        fontSize: 14,
        fontWeight: 400,
        formatter: function (value) {
          return `${Number(value * 100).toFixed(2)}%`
        }
      }
    }
  ]
  let legend = {}

  let series = [{}, {}, {}]
  // 加载第一条折线

  series[0] = {
    name: props.option3.tipsName || '',
    itemStyle: {
      normal: {
        color: props.option3.lineColor,
        lineStyle: {
          color: props.option3.lineColor,
          width: 1.5
        },
        barBorderRadius: [6, 6, 0, 0]
      }
    },
    smooth: 0.5, // 设置折线弧度
    yAxisIndex: 1,
    type: props.option2.type || 'line',
    barWidth: '26px',
    symbol: 'emptyCircle', // 拐点的形状
    showSymbol: true,
    symbolSize: 0, // 拐点大小
    data:
      props.option3.yAxisType === 'category'
        ? props.option3.xAxisData
        : props.option3.yAxisData || [],
    animationDuration: 1200,
    animationEasing: 'cubicInOut'
  }

  series[1] = {
    name: props.option2.tipsName || '',
    itemStyle: {
      normal: {
        color: props.option2.lineColor,
        lineStyle: {
          color: props.option2.lineColor,
          width: 1.5
        },
        barBorderRadius: [6, 6, 0, 0]
      }
    },
    smooth: 0.5, // 设置折线弧度
    yAxisIndex: 1,
    type: props.option2.type || 'line',
    barWidth: '26px',
    symbol: 'emptyCircle', // 拐点的形状
    showSymbol: true,
    symbolSize: 0, // 拐点大小
    data:
      props.option2.yAxisType === 'category'
        ? props.option2.xAxisData
        : props.option2.yAxisData || [],
    animationDuration: 1200,
    animationEasing: 'cubicInOut'
  }

  series[2] = {
    name: props.option1.tipsName || '',
    itemStyle: {
      normal: {
        color: props.option1.lineColor,
        lineStyle: {
          color: props.option1.lineColor,
          width: 2
        },
        barBorderRadius: [6, 6, 0, 0]
      }
    },
    smooth: 0.5, // 设置折线弧度
    yAxisIndex: 0,
    type: props.option1.type || 'bar',
    barWidth: '22px',
    symbol: 'emptyCircle', // 拐点的形状
    showSymbol: true,
    symbolSize: 8, // 拐点大小
    data:
      props.option1.yAxisType === 'category'
        ? props.option1.xAxisData
        : props.option1.yAxisData || [],
    animationDuration: 1200,
    animationEasing: 'cubicInOut'
  }

  series[3] = {
    name: props.option.tipsName || '',
    itemStyle: {
      normal: {
        color: props.option.lineColor,
        lineStyle: {
          color: props.option.lineColor,
          width: 2
        },
        barBorderRadius: [6, 6, 0, 0]
      }
    },
    smooth: 0.5, // 设置折线弧度
    yAxisIndex: 0,
    type: props.option.type || 'bar',
    barWidth: '22px',
    symbol: 'emptyCircle', // 拐点的形状
    showSymbol: true,
    symbolSize: 8, // 拐点大小
    data:
      props.option.yAxisType === 'category' ? props.option.xAxisData : props.option.yAxisData || [],
    animationDuration: 1200,
    animationEasing: 'cubicInOut'
  }

  // 给EChart赋值
  options.value = {
    xAxis: xAxis,
    grid: grid,
    tooltip: tooltip,
    legend: legend,
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
