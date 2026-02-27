<template>
  <div style="width: 100%; height: 100%">
    <Echart :options="options" :height="height" />
  </div>
</template>

<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'

const props = defineProps({
  height: propTypes.oneOfType([Number, String]).def('26.041667vw'),
  width: propTypes.oneOfType([Number, String]).def(''),
  // 只有一个折线的时
  option1: propTypes.object.def({
    xAxisData: [], //X轴数据
    yAxisData: [], //Y轴数据
    tipsName: '', //提示
    type: 'line', // line  折线 bar 树状图
    xAxisType: 'category',
    yAxisType: 'value',
    direction: 'horizontal', //树状图的方向 horizontal 垂直: vertical
    lineColor: '' // 折线的颜色
  }),
  // 有两条折线的时候
  option2: propTypes.object.def({
    xAxisData: [], //X轴数据
    yAxisData: [], //Y轴数据
    tipsName: '', //提示
    type: 'line', // line  折线 bar 树状图
    xAxisType: 'category',
    yAxisType: 'value',
    direction: 'horizontal', //树状图的方向 horizontal 垂直: vertical
    lineColor: '' // 折线的颜色
  })
})

const options = ref({})

// 设置图表配置
const setChartOptions = () => {
  let xAxis = {
    type: props.option1.xAxisType || 'category',
    data: props.option1.xAxisType === 'value' ? [] : props.option1.xAxisData || [],
    boundaryGap: false,
    axisLabel: {
      rotate: 0,
      interval: props.option1.xAxisData && props.option1.xAxisData.length >= 30 ? 2 : 0,
      color: '#666666',
      fontSize: 14,
      fontWeight: 400,
      margin: 20 // 添加 margin，控制 x 轴 label 与轴的距离
    },
    axisLine: {
      show: true,
      lineStyle: {
        type: 'dashed', //虚线
        color: '#666666' // 修改 X 轴线颜色与 Y 轴分割线一致
      }
    },
    nameGap: 5,
    axisTick: {
      show: false,
      inside: false
    }
  }
  let grid = {
    left: 30, // 增大 left 的值，例如从 8 改为 30，可根据实际效果调整
    right: 50,
    bottom: 12,
    top: 40,
    containLabel: true
  }
  let tooltip = {
    trigger: 'axis',
    html: true, // 启用 HTML 格式
    formatter: (params) => {
      const date = params[0].axisValue // 获取日期
      let content = ``
      content += `<div style="margin:-10px;background: rgba(76, 76, 76, 0.7); border-radius: 0.208333vw; padding: 0.833333vw;box-shadow: 0vw 0.104167vw 0.625vw 0vw #282828;">`
      // 为日期所在 p 标签添加透明背景
      content += `<p style="margin: 0px 0px 0.520833vw 0px; background: transparent;">${date}</p>`
      params.forEach((param, index) => {
        const color = param.seriesName === '访客数' ? '#3B76FF' : '#FF7D08'
        const marginStyle = index === params.length - 1 ? 'margin: 0' : 'margin: 0 0 0.520833vw 0px'
        // 为数据项所在 p 标签添加透明背景，并在前面添加带颜色的小点
        content += `<p style="display: flex; justify-content: space-between; ${marginStyle}; background: transparent;">
      <span style="color: ${color}; margin-right: 0.416667vw;font-size: 28px;">•</span><span style="color:'#fff'">${param.seriesName}</span>
      <span style="margin-left: 0.625vw;">${param.value || 0}</span>
    </p>`
      })
      content += `</div>`
      return content
    },
    textStyle: {
      color: '#ffffff',
      fontSize: 14
    }
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
      fontWeight: 400,
      margin: 20 // 添加 margin，控制 y 轴 label 与轴的距离
    },
    splitLine: {
      lineStyle: {
        type: 'dashed', //虚线
        color: '#E2E8EE '
      },
      show: true //隐藏
    }
  }
  let legend = {
    textStyle: {
      color: '#333' // 设置图例字体颜色
    },
    itemGap: 40 // 新增：设置图例项之间的间距为 0.520833vw
  }

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
        colorStops: []
      },
      global: false // 缺省为 false
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
      }
    },
    areaStyle,
    smooth: 0.5, // 设置折线弧度
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
  // 加载第二条折线
  if (props.option2.xAxisData.length > 0) {
    series.push({
      name: props.option2.tipsName || '',
      itemStyle: {
        normal: {
          color: props.option2.lineColor,
          lineStyle: {
            color: props.option2.lineColor,
            width: 2
          }
        }
      },
      areaStyle,
      smooth: 0.5, // 设置折线弧度
      type: props.option2.type || 'line',
      symbol: 'emptyCircle', // 拐点的形状
      showSymbol: true,
      symbolSize: 8, // 拐点大小
      data: props.option2.yAxisData || [],
      animationDuration: 1800,
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
