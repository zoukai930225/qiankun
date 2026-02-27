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
  option1: propTypes.object.def({
    xAxisData: [], //X轴数据
    yAxisData: [], //Y轴数据
    tipsName: '', //提示
    fieldName: '',
    isPercent: false,
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
    isPercent: false,
    fieldName: '',
    type: 'bar', // line  折线 bar 树状图
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
      rotate: 0, // X 轴标签文字旋转角度
      interval: props.option1.xAxisData && props.option1.xAxisData.length >= 30 ? 2 : 0, //设置 X 轴数据间隔几个显示一个，为0表示都显示
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
    formatter: function (param) {
      return (
        '<div style="color: #ffffff;fontSize: 14px;width:134px;"> ' +
        `${props.option1.fieldName}` +
        `      ${param[0].axisValue}月` +
        '<div style="display: flex;flex-direction: row;align-item:cebter;height:40px;margin-top:19px;">' +
        '<span>' +
        `${props.option1.tipsName}` +
        '</span>' +
        '<span style="margin-left:auto;">' +
        `${param[0].value && param[0].value !== '--' ? (props.option1.isPercent ? `${(Number(param[0].value) * 100).toFixed(2)} %` : numberFormateShow(param[0].value)) : '--'}` +
        '</span>' +
        '</div>' +
        '<div style="display: flex;flex-direction: row;align-item:cebter;height:30px">' +
        '<span>' +
        `${props.option1.tipsName}` +
        '</span>' +
        '<span style="margin-left:auto;">' +
        `${param[1].value && param[1].value !== '--' ? (props.option1.isPercent ? `${(Number(param[1].value) * 100).toFixed(2)} %` : numberFormateShow(param[1].value)) : '--'}` +
        '</span>' +
        '</span>' +
        '</div>'
      )
      ;('</div>')
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
      color: '#999',
      fontSize: 14,
      fontWeight: 400,
      formatter: function (value) {
        if (Number(value) === 0) {
          return 0
        }
        if (props.option1.isPercent) {
          return (Number(value) * 100).toFixed(2) + '%'
        }
        return numberFormateShow(value)
      }
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
    name: props.option1.tipsName || '',
    itemStyle: {
      normal: {
        color: props.option1.lineColor,
        lineStyle: {
          color: props.option1.lineColor,
          width: 31
        },
        barBorderRadius: [6, 6, 0, 0]
      }
    },
    smooth: 0.5, // 设置折线弧度
    type: 'bar',
    barWidth: '31px',
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
  //加载第二条折线
  if (props.option2.xAxisData.length > 0) {
    series.push({
      name: props.option2.tipsName || '',
      itemStyle: {
        normal: {
          color: props.option2.lineColor,
          lineStyle: {
            color: props.option2.lineColor,
            width: 31
          },
          barBorderRadius: [6, 6, 0, 0]
        }
      },
      smooth: 0, // 设置折线弧度
      type: 'bar',
      barWidth: '31px',
      symbol: 'emptyCircle', // 拐点的形状
      showSymbol: true,
      symbolSize: 8, // 拐点大小
      data: props.option2.yAxisData || [],
      animationDuration: 1200,
      animationEasing: 'cubicInOut'
    })
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
