<template>
  <div style="width: 100%; height: 100%">
    <Echart :options="options" :height="height" />
  </div>
</template>

<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
import { numberFormateShow } from '@/utils/formatter'

const props = defineProps({
  height: propTypes.oneOfType([Number, String]).def('348px'),
  width: propTypes.oneOfType([Number, String]).def(''),
  xAxisData: propTypes.array.def([]),
  barOptions: propTypes.array.def([]),
  lineOptions: propTypes.array.def([])
})

const options = ref({})
const chartDatas = ref([])

// 设置图表配置
const setChartOptions = () => {
  if (props.barOptions.length === 0 && props.lineOptions.length === 0) {
    return
  }
  let xAxis = {
    type: 'category',
    data: props.xAxisData || [],
    boundaryGap: true, // x 坐标轴两边留白策略，类目轴和非类目轴的设置和表现不一样。
    axisLabel: {
      rotate: 0, // X 轴标签文字旋转角度
      interval: 0, //设置 X 轴数据间隔几个显示一个，为0表示都显示
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
    left: 8,
    right: 50,
    bottom: 12,
    top: 60,
    containLabel: true
  }
  let tooltip = {
    trigger: 'axis',
    backgroundColor: 'rgba(36,36,38,0.68)',
    borderRadius: 4,
    boxShadow: '0px 2px 4px 2px rgba(0,0,0,0.17)',
    formatter: function (params) {
      var res =
        "<div style='margin-bottom:5px;line-height:17px;color:#fff;font-size:12px;'>" +
        params[0].name +
        '</div>'
      for (var i = 0; i < params.length; i++) {
        // console.log(
        //   '大家分手快乐',
        //   params[i].seriesName,
        //   params[i].data,
        //   params[i].seriesIndex,
        //   params[i].dataIndex
        // )
        res += `<div style="display:flex;flex-direction:row;align-items: center;color: #fff;font-size: 12px; line-height: 17px">
                  <span style="display:inline-block;margin-right:5px;border-radius:4px;width:8px;height:8px;background-color:${[
                    params[i].color
                  ]};"></span>
                   <span style="padding-right:20px"> ${params[i].seriesName}</span>
                  <span style="margin-left:auto">${getChartShowDataValue(params[i])}</span>

                </div>`
      }
      // ${numberFormateShow(params[i].data)}
      return res
    },
    textStyle: {
      color: '#ffffff',
      fontSize: 14
    },
    padding: [12, 12]
  }
  let yAxis = [{}]
  yAxis = []
  let series = [{}]
  series = []
  chartDatas.value = []
  let barWidth = '24px'
  if (props.barOptions.length === 2) {
    barWidth = '18px'
  } else if (props.barOptions.length === 3) {
    barWidth = '12px'
  } else if (props.barOptions.length > 3) {
    barWidth = '10px'
  }
  const commonYAxis = {
    type: 'value',
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
      show: false //隐藏
    }
  }
  const commonSeriesData = {
    yAxisIndex: 0,
    smooth: 0.5,
    type: 'line',
    barWidth: barWidth,
    symbol: 'emptyCircle', // 拐点的形状
    showSymbol: true,
    symbolSize: 8, // 拐点大小
    animationDuration: 1200,
    animationEasing: 'cubicInOut'
  }
  // 是否有正常值的显示
  let isNormalValue = true
  // 判断是否有百分比的显示
  let isPercentage = false
  let yAxisCount = 1
  props.barOptions.forEach((item) => {
    if (item.isPercentage) {
      isPercentage = true
    } else {
      isNormalValue = true
    }
    chartDatas.value.push(item)
  })

  props.lineOptions.forEach((item) => {
    if (item.isPercentage) {
      isPercentage = true
    } else {
      isNormalValue = true
    }
    chartDatas.value.push(item)
  })
  if (isNormalValue && !isPercentage) {
    yAxis.push({ ...commonYAxis, yAxisIndex: 0 })
  } else if (!isNormalValue && isPercentage) {
    yAxis.push({
      ...commonYAxis,
      yAxisIndex: 0,
      axisLabel: {
        color: '#999',
        fontSize: 14,
        fontWeight: 400,
        formatter: '{value} %'
      }
    })
  } else if (isNormalValue && isPercentage) {
    yAxis.push({ ...commonYAxis, yAxisIndex: 0 })
    yAxis.push({
      ...commonYAxis,
      yAxisIndex: 1,
      axisLabel: {
        color: '#999',
        fontSize: 14,
        fontWeight: 400,
        formatter: '{value} %'
      },
      splitLine: {
        lineStyle: {
          type: 'dashed' //虚线
        },
        show: true //隐藏
      }
    })
    yAxisCount = 2
  }

  let yAxisIndex = 0
  if (props.barOptions.length > 0) {
    props.barOptions.forEach((item) => {
      series.push({
        ...commonSeriesData,
        name: item.tipsName || '',
        itemStyle: {
          normal: {
            color: item.lineColor,
            lineStyle: {
              color: item.lineColor,
              width: 2
            }
          }
        },
        yAxisIndex: yAxisIndex,
        type: 'bar',
        data: item.yAxisData || []
      })
    })
    if (yAxisCount === 2) {
      yAxisIndex += 1
    }
  }
  if (props.lineOptions.length > 0) {
    props.lineOptions.forEach((item) => {
      series.push({
        ...commonSeriesData,
        name: item.tipsName || '',
        itemStyle: {
          normal: {
            color: item.lineColor,
            lineStyle: {
              color: item.lineColor,
              width: 2
            }
          }
        },
        smooth: 0, // 设置折线弧度
        yAxisIndex: yAxisIndex,
        type: 'line',
        data: item.yAxisData || [],
        animationEasing: 'linear'
      })
    })
  }
  // 给EChart赋值
  options.value = {
    xAxis: xAxis,
    grid: grid,
    legend: {},
    tooltip: tooltip,
    yAxis: yAxis,
    series: series
  }
}

const getChartShowDataValue = (item) => {
  let valueStr = numberFormateShow(item.data)
  if (chartDatas.value.length > item.seriesIndex) {
    let currentChartValue = chartDatas.value[item.seriesIndex]
    if (currentChartValue.isPercentage) {
      valueStr = `${item.data}%`
    }
  }
  return valueStr
}

defineExpose({ setChartOptions }) // 提供 setChartOptions 方法，用于设置图表配置
</script>

<style lang="scss" scoped></style>
