<template>
  <div style="width: 100%; height: 100%">
    <Echart :options="options" :height="height" ref="echartRef" />
  </div>
</template>
<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
import dayjs from 'dayjs'
const props = defineProps({
  height: propTypes.oneOfType([Number, String]).def('208px'),
  width: propTypes.oneOfType([Number, String]).def('100%'),
  data: propTypes.object.def({}),
  fieldCode: propTypes.string.def(''),
})

const options = ref({})
const echartRef = ref<any>()

const dealData = () => {
  const xData = [] as any[]
  const yData = [] as any[]
  Object.keys(props.data).forEach((key) => {
    if (dayjs(key).isValid()) {
      xData.push(dayjs(key).format('MM/DD'))
    } else {
      xData.push(key)
    }
    yData.push(props.data[key][props.fieldCode] || 0)
  })
  return { xData, yData }
}
const setChartOptions = () => {
  const { xData, yData } = dealData()
  let grid = {
    left: 10,
    right: 5,
    bottom: '15%',
    top: '16%',
    containLabel: true
  }
  let tooltip = {
    trigger: 'axis',
    backgroundColor: '	rgba(36,52,90,0.9)',
    borderColor: 'rgba(36,52,90,0.9)',
    textStyle: {
      color: '#fff'
    },
    confine: true
  }

  let yAxis = {
  }

  let xAxis = {
    type: 'category',
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      show: true,
      interval: 0,
      hideOverlap: true
    },
    boundaryGap: true,
    data: xData,
  }

  let params: any = {
    xAxis: xAxis,
    grid: grid,
    tooltip: tooltip,
    yAxis: yAxis,
    series: {
      type: 'line',
      smooth: true,
      showSymbol: false,
      data: yData,
      lineStyle: {
        color: "#3270FF"
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: 'rgba(0, 100, 255, 0.2)' // 0% 处的颜色
          }, {
            offset: 1, color: 'rgba(0, 100, 255, 0) ' // 100% 处的颜色
          }],
        },
      },
    },
  }
  if (xData.length > 10) {
    let dataZoom = [
      {
        type: 'inside',
        start: 0,
        end: Math.ceil(1000 / xData.length),
        zoomLock: true,
      },
      {
        start: 0,
        end: Math.ceil(1000 / xData.length),
        zoomLock: true,
        showDetail: false
      }
    ]
    let toolbox = {
      feature: {
        restore: {
          title: '',
          emphasis: {
            iconStyle: {
              borderColor: '#0064FF'
            }
          }
        },
      }
    }
    params.toolbox = toolbox
    params.dataZoom = dataZoom
  }

  options.value = params
  echartRef.value?.resizeHandler()
}
defineExpose({ setChartOptions }) // 提供 setChartOptions 方法，用于设置图表配置
</script>