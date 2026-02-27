<template>
  <div style="width: 100%; height: 100%">
    <Echart :options="options" :height="height" />
  </div>
</template>

<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'

const props = defineProps({
  height: propTypes.oneOfType([Number, String]).def('397px'),
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
  }),
  areaColor: {
    type: Array<string>,
    default: () => ['rgba(256, 256, 256, 0)', 'rgba(256, 256, 256, 0)']
  },
  xName: {
    type: String,
    default: ''
  },
  yName: {
    type: String,
    default: ''
  },
  gridData: {
    type: Object,
    default: () => {}
  }
})

const options = ref({})

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
          color: props.areaColor?.[0] // 0% 处的颜色
        },
        {
          offset: 1,
          color: props.areaColor?.[1] // 100% 处的颜色
        }
      ],
      global: false // 缺省为 false
    }
  }
}

// 设置图表配置
const setChartOptions = () => {
  let xAxis = {
    name: props.xName,
    nameTextStyle: {
      color: '#888'
    },
    type: props.option1.xAxisType || 'category',
    data: props.option1.xAxisType === 'value' ? [] : props.option1.xAxisData || [],
    boundaryGap: false, // x 坐标轴两边留白策略，类目轴和非类目轴的设置和表现不一样。
    axisLabel: {
      rotate: 60, // X 轴标签文字旋转角度
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
  let grid = props.gridData
    ? {
        ...props.gridData,
        containLabel: true
      }
    : {
        left: 0,
        right: 20,
        bottom: 12,
        top: 20,
        containLabel: true
      }
  let tooltip = {
    trigger: 'axis',
    formatter: function (param) {
      return (
        '<div style="width: 100px;height: 46px;background: #ffffff;border-radius: 4px;display: flex;flex-direction: column;margin:-4px; ">' +
        `<div style="display: flex;flex-direction: row;align-items: center;padding-top: 4px;margin-left:6px;font-size: 14px;color: #8186A5;">` +
        '<div>' +
        `${param[0].axisValue}` +
        '</div>' +
        '</div>' +
        `<div style="display: flex;flex-direction: row;align-items: center;padding-top: 0px;margin-left:6px;font-size: 14px;color: #333;">` +
        `<div style="width: 6px;height: 6px;background:${props.option1.lineColor};border-radius:3px;margin-right:4px;"></div>` +
        `<div>` +
        `${param[0].value}` +
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
    }
  }

  let yAxis = {
    name: props.yName,
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
    name: props.option1.tipsName || '',
    itemStyle: {
      normal: {
        color: props.option1.lineColor,
        lineStyle: {
          color: props.option1.lineColor,
          width: 1
        }
      }
    },
    smooth: 0.5, // 设置折线弧度
    areaStyle: areaStyle,
    type: props.option1.type || 'line',
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
  // 给EChart赋值
  options.value = {
    xAxis: xAxis,
    grid: grid,
    tooltip: tooltip,
    yAxis: yAxis,
    series: series
  }
}

defineExpose({ setChartOptions }) // 提供 setChartOptions 方法，用于设置图表配置
</script>

<style lang="scss" scoped></style>
