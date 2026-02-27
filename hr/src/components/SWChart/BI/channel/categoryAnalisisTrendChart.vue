<template>
  <div style="width: 100%; height: 100%">
    <Echart :options="options" :height="height" />
  </div>
</template>

<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
import { numberFormateShow } from '@/utils/formatter'

const props = defineProps({
  height: propTypes.oneOfType([Number, String]).def('270px'),
  width: propTypes.oneOfType([Number, String]).def(''),
  option: propTypes.object.def({
    xAxisData: [], //X轴数据
    yAxisData: [], //Y轴数据
    tipsName: '', //提示
    percent: false, // 是是否显示百分比
    type: 'line', // line  折线 bar 树状图
    xAxisType: 'category',
    yAxisType: 'value',
    direction: 'horizontal', //树状图的方向 horizontal 垂直: vertical
    lineColor: '' // 折线的颜色})
  }),
  option1: propTypes.object.def({
    //利润
    xAxisData: [], //X轴数据
    yAxisData: [], //Y轴数据
    tipsName: '', //提示
    percent: false, // 是是否显示百分比
    type: 'line', // line  折线 bar 树状图
    xAxisType: 'category',
    yAxisType: 'value',
    direction: 'horizontal', //树状图的方向 horizontal 垂直: vertical
    lineColor: '' // 折线的颜色})
  }),
  option2: propTypes.object.def({
    //利润率
    xAxisData: [], //X轴数据
    yAxisData: [], //Y轴数据
    tipsName: '', //提示
    percent: false, // 是是否显示百分比
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
      rotate: 45, // X 轴标签文字旋转角度
      interval: props.option.xAxisData && props.option.xAxisData.length >= 40 ? 1 : 0, //设置 X 轴数据间隔几个显示一个，为0表示都显示
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
    left: 28,
    right: 50,
    bottom: 12,
    top: 50,
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
    formatter: function (params) {
      let tooltipContent =
        '<div style="color: #ffffff;fontSize: 14px;width:184px;">' + `${params[0].axisValue}</div>`

      params.forEach((param) => {
        if (param && param.seriesName && param.value !== undefined) {
          let tipsName = ''
          let value = ''
          let percentSign = ''
          switch (param.seriesName) {
            case props.option.tipsName:
              tipsName = props.option.tipsName
              value = props.option.percent ? param.value : numberFormateShow(param.value)
              percentSign = props.option.percent ? '%' : ''
              break
            case props.option1.tipsName:
              // 利润
              tipsName = props.option1.tipsName
              value = param.value
              percentSign = props.option1.percent ? '%' : ''
              break
            case props.option2.tipsName:
              // 利润率
              tipsName = props.option2.tipsName
              value = props.option2.percent ? param.value : numberFormateShow(param.value)
              percentSign = props.option2.percent ? '%' : ''
              break
          }

          if (tipsName) {
            tooltipContent += `
          <div style="display: flex;flex-direction: row;align-items:center;height:30px;margin-bottom:-10px;">
            <span>${tipsName}</span>
            <span style="margin-left:auto;">${value}${percentSign}</span>
          </div>
        `
          }
        }
      })

      return tooltipContent
    },

    padding: [12, 12]
  }
  // let tooltip = {
  //   trigger: 'axis',
  //   backgroundColor: 'rgba(36,36,38,0.68)',
  //   borderRadius: 4,
  //   boxShadow: '0px 2px 4px 2px rgba(0,0,0,0.17)',
  //   textStyle: {
  //     color: '#ffffff',
  //     fontSize: 14
  //   },
  //   formatter: function (param) {
  //     return (
  //       '<div style="color: #ffffff;fontSize: 14px;width:174px;"> ' +
  //       `${param[0].axisValue}` +
  //       '<div style="display: flex;flex-direction: row;align-item:cebter;height:30px;margin-top:19px;">' +
  //       '<span>' +
  //       `${props.option.tipsName}` +
  //       '</span>' +
  //       '<span style="margin-left:auto;">' +
  //       `${props.option.percent ? param[0].value : numberFormateShow(param[0].value)}${props.option.percent ? '%' : ''}` +
  //       '</span>' +
  //       '</div>'
  //     )
  //     ;('</div>')
  //   },
  //   padding: [12, 12]
  // }

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
      fontWeight: 400,
      formatter: function (value) {
        if (props.option.percent) {
          return `${value}%`
        }
        return value
      }
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
          return `${value}%`
        }
      }
    }
  ]

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
            color: 'rgba(58,132,255, 0.5)' // 0% 处的颜色
          },
          {
            offset: 1,
            color: 'rgba(58,132,255, 0)' // 100% 处的颜色
          }
        ],
        global: false // 缺省为 false
      }
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
    areaStyle,
    yAxisIndex: 0,
    smooth: 0, // 设置折线弧度
    type: 'line',
    barWidth: '1px',
    symbol: 'emptyCircle', // 拐点的形状
    showSymbol: true,
    symbolSize: 0, // 拐点大小
    data:
      props.option.yAxisType === 'category' ? props.option.xAxisData : props.option.yAxisData || [],
    animationDuration: 1200,
    animationEasing: 'cubicInOut'
  }
  if (props.option1.xAxisData.length > 0) {
    // 加载第二条折线
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
      areaStyle,
      yAxisIndex: 0,
      smooth: 0, // 设置折线弧度
      type: 'line',
      barWidth: '1px',
      symbol: 'emptyCircle', // 拐点的形状
      showSymbol: true,
      symbolSize: 0, // 拐点大小
      data:
        props.option1.yAxisType === 'category'
          ? props.option1.xAxisData
          : props.option1.yAxisData || [],
      animationDuration: 1200,
      animationEasing: 'cubicInOut'
    }
  }
  if (props.option2.xAxisData.length > 0) {
    series[2] = {
      name: props.option2.tipsName || '',
      itemStyle: {
        normal: {
          color: props.option2.lineColor,
          lineStyle: {
            color: props.option2.lineColor,
            width: 2
          },
          barBorderRadius: [6, 6, 0, 0]
        }
      },
      areaStyle,
      yAxisIndex: 1,
      smooth: 0, // 设置折线弧度
      type: 'line',
      barWidth: '1px',
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
