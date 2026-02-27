<template>
  <div style="width: 100%; height: 100%">
    <Echart ref="echartRef" :options="options" :height="height" @echart-click="echartClick" />
  </div>
</template>

<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
import Echart from '@/components/Echart/src/Echart.vue'
import { formatDate } from '@/utils/formatTime'
import * as echarts from 'echarts/core'

const props = defineProps({
  height: propTypes.oneOfType([Number, String]).def('440px'),
  width: propTypes.oneOfType([Number, String]).def(''),
  option: propTypes.object.def({
    nodeName: '', //节点名称
    legendColor: '',
    runtime: false, //是否运行时
    yAxisData: [], //Y轴数据
    beginTimes: [],
    resultList: [], // 运行结果
    handleList: [], // 处理结果
    endTimes: [],
    addInterval: 0 // 额外添加的时间戳 毫秒
  })
})

const options = ref({})

// 设置图表配置
const setChartOptions = () => {
  let xAxis = {
    type: 'time',
    axisLabel: {
      rotate: 0, // X 轴标签文字旋转角度
      color: '#888',
      fontSize: 14,
      fontWeight: 400,
      formatter: function (value) {
        // yyyy-MM-dd
        return echarts.format.formatTime('hh:mm:ss', value)
      }
    },
    axisLine: {
      show: false,
      lineStyle: {
        color: '#F0F0F0'
      }
    },
    nameGap: 5, //坐标轴名称与轴线之间的距离。
    axisTick: {
      show: false,
      //是否显示坐标轴刻度。
      inside: false //坐标轴刻度是否朝内，默认朝外。
    },
    splitLine: {
      // lineStyle: {
      //   type: 'dashed' //虚线
      // },
      // 显示网格线
      show: true
    }
  }
  let grid = {
    left: 20,
    right: 20,
    bottom: 12,
    top: props.option.runtime ? 10 : 40,
    containLabel: true
  }
  let tooltip = {
    trigger: 'axis',
    position: function (point, params, dom, rect, size) {
      if (props.option.runtime) {
        // 固定距离左边的距离
        return [point[0] - 170, point[1]]
      } else {
        return [point[0] - 70, point[1]]
      }
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
      if (!props.option.runtime) {
        return (
          '<div style="width: 100px;height: 30px;background: #ffffff;border-radius: 4px;display: flex;flex-direction: column; ">' +
          `<div style="display: flex;flex-direction: row;align-items: center;padding-top: 6px;margin-left:10px;font-size: 14px;color: #8186A5;">` +
          `<div style="width: 6px;height: 6px;background: #0064FF;border-radius:3px;margin-right:10px;"></div>` +
          `<div>` +
          `${showStaticTipsTime(param[1].value)}` +
          '</div>' +
          '</div>' +
          '</div>'
        )
        ;('</div>')
      }
      return (
        '<div style="width: 180px;height: 60px;background: #ffffff;border-radius: 4px;display: flex;flex-direction: column; ">' +
        `<div style="display: flex;flex-direction: row;align-items: center;padding-top: 6px;margin-left:10px;font-size: 14px;color: #8186A5;">` +
        `<div style="width: 6px;height: 6px;background: #1CCAA0;border-radius:3px;margin-right:10px;"></div>` +
        `<div>` +
        `${showTipsTime(param[1].value, false)}` +
        '</div>' +
        '</div>' +
        `<div style="display: flex;flex-direction: row;align-items: center;padding-top: 6px;margin-left:10px;font-size: 14px;color: #8186A5;">` +
        `<div style="width: 6px;height: 6px;background: #EB1730;border-radius:3px;margin-right:10px;"></div>` +
        `<div>` +
        `${showTipsTime(param[0].value, true)}` +
        '</div>' +
        '</div>'
      )
      ;('</div>')
    },
    padding: [12, 12]
  }

  let yAxis = {
    type: 'category',
    data: props.option.yAxisData || [],
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
  let legend = {
    data: [
      {
        name: props.option.nodeName || '',
        itemStyle: {
          color: props.option.legendColor
        }
      }
    ],
    align: 'auto',
    top: 'top'
  }

  let series = []
  series.push({
    name: props.option.nodeName || '',
    type: 'bar',
    stack: 'duration',
    itemStyle: {
      normal: {
        borderColor: '#fff',
        borderWidth: 1,
        color: function (params) {
          if (props.option.runtime) {
            if (params.dataIndex < props.option.resultList.length) {
              if (props.option.resultList[params.dataIndex] === '成功') {
                return '#0DE06F'
              } else if (props.option.resultList[params.dataIndex] === '失败') {
                if (props.option.handleList[params.dataIndex]) {
                  // 已处理
                  return '#FEBC40'
                } else {
                  return '#EB1730'
                }
              }
            }
            return '#0DE06F'
          } else {
            return '#0064FF'
          }
        }
      }
    },
    barWidth: props.option.runtime ? '18px ' : '10px',
    zlevel: -1,
    data: props.option.endTimes || ''
  }) // 结束时间

  series.push({
    name: props.option.nodeName || '',
    type: 'bar',
    stack: 'duration', // 堆叠标识符，同个类目轴上系列配置相同的 stack 值可以堆叠放置
    itemStyle: {
      color: '#fff',
      normal: {
        borderColor: '#fff',
        borderWidth: 1,
        color: function (params) {
          return '#fff'
        }
      }
    },
    zlevel: -1, // zlevel 大的 Canvas 会放在 zlevel 小的 Canvas 的上面
    z: 9, // z值小的图形会被z值大的图形覆盖，z相比zlevel优先级更低，而且不会创建新的 Canvas
    data: props.option.beginTimes || '' // 开始时间
  })
  // 给EChart赋值
  options.value = {
    xAxis: xAxis,
    grid: grid,
    legend: props.option.runtime ? null : legend,
    tooltip: tooltip,
    animation: false,
    yAxis: yAxis,
    series: series
  }
}

const showTipsTime = (timeStr, isAddInterval) => {
  if (isAddInterval) {
    let timestamp = new Date(timeStr).getTime()
    timestamp = timestamp - props.option.addInterval || 0
    return formatDate(new Date(timestamp))
  }
  return timeStr
}

const showStaticTipsTime = (timeStr) => {
  const timeArr = timeStr.split(' ')
  if (timeArr.length > 1) {
    return timeArr[1]
  }
  return timeStr
}

const echartClick = (e) => {
  emit('echartClick', e)
}

const echartRef = ref()
const resizeHandler = () => {
  if (echartRef.value) {
    echartRef.value.resizeHandler()
  }
}
const emit = defineEmits(['echartClick'])

defineExpose({ setChartOptions, resizeHandler }) // 提供 setChartOptions 方法，用于设置图表配置
</script>
