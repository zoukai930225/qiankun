<template>
  <div
    style="width: 100%; height: 100%"
    :style="{
      background: modelType ? '#303030' : '#fff'
    }"
  >
    <Echart :options="options" :height="height" @echart-click="echartClick" />
  </div>
</template>

<script lang="ts" setup>
import Echart from '@/components/Echart/src/Echart.vue'
import { numberFormateShow } from '@/utils/formatter'
import { propTypes } from '@/utils/propTypes'

const props = defineProps({
  height: propTypes.oneOfType([Number, String]).def('365px'),
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
    xAxisType: 'category',
    yAxisType: 'value',
    direction: 'horizontal', //树状图的方向 horizontal 垂直: vertical
    lineColor: '' // 折线的颜色})
  }),
  option3: propTypes.object.def({
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

watch(
  () => props.modelType,
  () => {
    setChartOptions()
  },
  { deep: true }
)

const options = ref({})

// 设置图表配置
const setChartOptions = () => {
  let xAxis = {
    type: props.option.xAxisType || 'category',
    data: props.option.xAxisType === 'value' ? [] : props.option.xAxisData || [],
    boundaryGap: true, // x 坐标轴两边留白策略，类目轴和非类目轴的设置和表现不一样。
    axisLabel: {
      rotate: 45, // X 轴标签文字旋转角度
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
    top: 46,
    containLabel: true
  }
  let tooltip = {
    trigger: 'axis',
    position: function (point, params, dom, rect, size) {
      // 固定距离左边的距离
      return [point[0] - 30, point[1]]
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
    formatter: function (param) {
      if (param.length === 4) {
        return (
          '<div style="width: 160px;height: auto;background: #ffffff;border-radius: 4px;display: flex;flex-direction: column; ">' +
          `<div style="display: flex;flex-direction: row;align-items: center;padding-top: 6px;margin-left:10px;font-size: 14px;color: #8186A5;">` +
          '<div>' +
          `${param[0].axisValue}` +
          '</div>' +
          '</div>' +
          `<div style="display: flex;flex-direction: row;align-items: center;padding-top: 3px;margin-left:10px;font-size: 14px;color: #333;">` +
          `<img  style="width:6px;height:6px;border-radius:3px;background: ${getBackgroundColor(param[0].seriesName)};margin-right:10px;"/>` +
          `<div>` +
          `${param[0].seriesName}` +
          '</div>' +
          `<div style="margin-left:auto;margin-right:15px;">` +
          `${numberFormateShow(param[0].value)}` +
          `${param[0].seriesName === '离职率' ? '%' : ''}` +
          '</div>' +
          '</div>' +
          `<div style="display: flex;flex-direction: row;align-items: center;padding-top: 3px;margin-left:10px;font-size: 14px;color: #333;">` +
          `<img  style="width:6px;height:6px;border-radius:3px;background: ${getBackgroundColor(param[1].seriesName)};margin-right:10px;"/>` +
          `<div>` +
          `${param[1].seriesName}` +
          '</div>' +
          `<div style="margin-left:auto;margin-right:15px;">` +
          `${numberFormateShow(param[1].value)}` +
          `${param[1].seriesName === '离职率' ? '%' : ''}` +
          '</div>' +
          '</div>' +
          `<div style="display: flex;flex-direction: row;align-items: center;padding-top: 3px;margin-left:10px;font-size: 14px;color: #333;">` +
          `<img  style="width:6px;height:6px;border-radius:3px;background: ${getBackgroundColor(param[2].seriesName)};margin-right:10px;"/>` +
          `<div>` +
          `${param[2].seriesName}` +
          '</div>' +
          `<div style="margin-left:auto;margin-right:15px;">` +
          `${numberFormateShow(param[2].value)}` +
          `${param[2].seriesName === '离职率' ? '%' : ''}` +
          '</div>' +
          '</div>' +
          `<div style="display: flex;flex-direction: row;align-items: center;padding-top: 3px;margin-left:10px;font-size: 14px;color: #333;margin-bottom:10px;">` +
          `<img  style="width:6px;height:6px;border-radius:3px;background: ${getBackgroundColor(param[3].seriesName)};margin-right:10px;"/>` +
          `<div>` +
          `${param[3].seriesName}` +
          '</div>' +
          `<div style="margin-left:auto;margin-right:15px;">` +
          `${numberFormateShow(param[3].value)}` +
          `${param[3].seriesName === '离职率' ? '%' : ''}` +
          '</div>' +
          '</div>'
        )
      } else if (param.length === 3) {
        return (
          '<div style="width: 160px;height: auto;background: #ffffff;border-radius: 4px;display: flex;flex-direction: column; ">' +
          `<div style="display: flex;flex-direction: row;align-items: center;padding-top: 6px;margin-left:10px;font-size: 14px;color: #8186A5;">` +
          '<div>' +
          `${param[0].axisValue}` +
          '</div>' +
          '</div>' +
          `<div style="display: flex;flex-direction: row;align-items: center;padding-top: 3px;margin-left:10px;font-size: 14px;color: #333;">` +
          `<img  style="width:6px;height:6px;border-radius:3px;background: ${getBackgroundColor(param[0].seriesName)};margin-right:10px;"/>` +
          `<div>` +
          `${param[0].seriesName}` +
          '</div>' +
          `<div style="margin-left:auto;margin-right:15px;">` +
          `${numberFormateShow(param[0].value)}` +
          `${param[0].seriesName === '离职率' ? '%' : ''}` +
          '</div>' +
          '</div>' +
          `<div style="display: flex;flex-direction: row;align-items: center;padding-top: 3px;margin-left:10px;font-size: 14px;color: #333;">` +
          `<img  style="width:6px;height:6px;border-radius:3px;background: ${getBackgroundColor(param[1].seriesName)};margin-right:10px;"/>` +
          `<div>` +
          `${param[1].seriesName}` +
          '</div>' +
          `<div style="margin-left:auto;margin-right:15px;">` +
          `${numberFormateShow(param[1].value)}` +
          `${param[1].seriesName === '离职率' ? '%' : ''}` +
          '</div>' +
          '</div>' +
          `<div style="display: flex;flex-direction: row;align-items: center;padding-top: 3px;margin-left:10px;font-size: 14px;color: #333;margin-bottom:10px;">` +
          `<img  style="width:6px;height:6px;border-radius:3px;background: ${getBackgroundColor(param[2].seriesName)};margin-right:10px;"/>` +
          `<div>` +
          `${param[2].seriesName}` +
          '</div>' +
          `<div style="margin-left:auto;margin-right:15px;">` +
          `${numberFormateShow(param[2].value)}` +
          `${param[2].seriesName === '离职率' ? '%' : ''}` +
          '</div>' +
          '</div>'
        )
      } else if (param.length === 2) {
        return (
          '<div style="width: 160px;height: auto;background: #ffffff;border-radius: 4px;display: flex;flex-direction: column; ">' +
          `<div style="display: flex;flex-direction: row;align-items: center;padding-top: 6px;margin-left:10px;font-size: 14px;color: #8186A5;">` +
          '<div>' +
          `${param[0].axisValue}` +
          '</div>' +
          '</div>' +
          `<div style="display: flex;flex-direction: row;align-items: center;padding-top: 3px;margin-left:10px;font-size: 14px;color: #333;">` +
          `<img  style="width:6px;height:6px;border-radius:3px;background: ${getBackgroundColor(param[0].seriesName)};margin-right:10px;"/>` +
          `<div>` +
          `${param[0].seriesName}` +
          '</div>' +
          `<div style="margin-left:auto;margin-right:15px;">` +
          `${numberFormateShow(param[0].value)}` +
          `${param[0].seriesName === '离职率' ? '%' : ''}` +
          '</div>' +
          '</div>' +
          `<div style="display: flex;flex-direction: row;align-items: center;padding-top: 3px;margin-left:10px;font-size: 14px;color: #333;margin-bottom:10px;">` +
          `<img  style="width:6px;height:6px;border-radius:3px;background: ${getBackgroundColor(param[1].seriesName)};margin-right:10px;"/>` +
          `<div>` +
          `${param[1].seriesName}` +
          '</div>' +
          `<div style="margin-left:auto;margin-right:15px;">` +
          `${numberFormateShow(param[1].value)}` +
          `${param[1].seriesName === '离职率' ? '%' : ''}` +
          '</div>' +
          '</div>'
        )
      } else if (param.length === 1) {
        return (
          '<div style="width: 160px;height: auto;background: #ffffff;border-radius: 4px;display: flex;flex-direction: column; ">' +
          `<div style="display: flex;flex-direction: row;align-items: center;padding-top: 6px;margin-left:10px;font-size: 14px;color: #8186A5;">` +
          '<div>' +
          `${param[0].axisValue}` +
          '</div>' +
          '</div>' +
          `<div style="display: flex;flex-direction: row;align-items: center;padding-top: 3px;margin-left:10px;font-size: 14px;color: #333;margin-bottom:10px;">` +
          `<img  style="width:6px;height:6px;border-radius:3px;background: ${getBackgroundColor(param[0].seriesName)} ;margin-right:10px;"/>` +
          `<div>` +
          `${param[0].seriesName}` +
          '</div>' +
          `<div style="margin-left:auto;margin-right:15px;">` +
          `${numberFormateShow(param[0].value)}` +
          `${param[0].seriesName === '离职率' ? '%' : ''}` +
          '</div>' +
          '</div>'
        )
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
        formatter: '{value} %'
      }
    }
  ]
  let legend = {
    textStyle: {
      color: props.modelType ? '#FFF5E9' : '#666666',
      fontSize: 14
    }
  }

  let series = [{}]
  // 加载第一条折线
  series[0] = {
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
    type: props.option.type || 'line',
    barWidth: '26px',
    symbol: 'emptyCircle', // 拐点的形状
    showSymbol: true,
    symbolSize: 8, // 拐点大小
    data:
      props.option.yAxisType === 'category' ? props.option.xAxisData : props.option.yAxisData || [],
    animationDuration: 1200,
    animationEasing: 'cubicInOut'
  }
  series[1] = {
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
    type: props.option1.type || 'line',
    barWidth: '26px',
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
  series[2] = {
    name: props.option3.tipsName || '',
    itemStyle: {
      normal: {
        color: props.option3.lineColor,
        lineStyle: {
          color: props.option3.lineColor,
          width: 2
        },
        barBorderRadius: [6, 6, 0, 0]
      }
    },
    smooth: 0.5, // 设置折线弧度
    yAxisIndex: 0,
    type: props.option3.type || 'line',
    barWidth: '26px',
    symbol: 'emptyCircle', // 拐点的形状
    showSymbol: true,
    symbolSize: 8, // 拐点大小
    data:
      props.option3.yAxisType === 'category'
        ? props.option3.xAxisData
        : props.option3.yAxisData || [],
    animationDuration: 1200,
    animationEasing: 'cubicInOut'
  }
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
            color: 'rgba(84,210,170,1)' // 0% 处的颜色
          },
          {
            offset: 1,
            color: 'rgba(84,210,170,0)' // 100% 处的颜色
          }
        ],
        global: false // 缺省为 false
      }
    }
  }
  series[3] = {
    name: props.option2.tipsName || '',
    itemStyle: {
      normal: {
        color: props.option2.lineColor,
        lineStyle: {
          color: props.option2.lineColor,
          width: 2
        },
        barBorderRadius: [2, 2, 0, 0]
      }
    },
    areaStyle,
    smooth: 0.5, // 设置折线弧度
    yAxisIndex: 1,
    silent: true,
    type: props.option2.type || 'line',
    barWidth: '34px',
    symbol: 'emptyCircle', // 拐点的形状
    showSymbol: false,
    // symbolSize: 8, // 拐点大小
    data:
      props.option2.yAxisType === 'category'
        ? props.option2.xAxisData
        : props.option2.yAxisData || [],
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

const getBackgroundColor = (seriesName) => {
  if (seriesName === '本期入职') {
    return '#F4D268'
  } else if (seriesName === '本期离职') {
    return '#E38D35'
  } else if (seriesName === '离职率') {
    return '#55D0AC'
  } else if (seriesName === '总入离职') {
    return '#F76560'
  }
}
const echartClick = (e) => {
  emit('echartClick', e)
}
const emit = defineEmits(['echartClick'])
defineExpose({ setChartOptions }) // 提供 setChartOptions 方法，用于设置图表配置
</script>
