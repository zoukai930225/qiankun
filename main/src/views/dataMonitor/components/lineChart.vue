<template>
  <el-popover
    ref="popoverRef"
    :virtual-ref="virtualRef"
    virtual-triggering
    :visible="isVisible"
    :width="280"
    effect="dark"
    popper-style="padding:0"
  >
    <div style="width: 100%; height: 100%" @mouseleave="handleLineMouseLeave">
      <Echart :options="options" :height="height" ref="echartRef" />
    </div>
  </el-popover>
</template>
<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
import { formatDate } from '@/utils/formatTime'
const props = defineProps({
  //虚拟dom
  virtualRef: propTypes.oneOfType([HTMLElement, String]),
  //是否显示
  visible: {
    type: Boolean,
    required: true
  },
  height: propTypes.oneOfType([Number, String]).def('200px'),
  width: propTypes.oneOfType([Number, String]).def('100%'),
  detailData: propTypes.oneOfType([Object]).def({})
})
const isVisible = ref(props.visible)
const emit = defineEmits(['update:visible', 'leave'])

watchEffect(() => {
  isVisible.value = props.visible
})

watch(
  () => isVisible.value,
  (v: boolean) => {
    emit('update:visible', v)
  }
)

function handleLineMouseLeave() {
  emit('leave')
}

//--------------------- 折线图 ---------------------

const options = ref({})
const echartRef = ref<any>()
// 设置图表配置
const setChartOptions = () => {
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
      color: '#cccccc'
    },
    boundaryGap: true,
    data: dealxAxis(),
    color: '#cccccc'
  }
  let grid = {
    left: 15,
    right: 5,
    bottom: 18,
    top: 40,
    containLabel: true
  }
  let tooltip = {
    trigger: 'axis'
  }

  let yAxis = {
    show: true,
    name: '总量',
    nameTextStyle: {
      color: '#cccccc'
    },
    splitLine: {
      show: true,
      lineStyle: {
        type: 'dashed'
      }
    },
    axisLabel: {
      show: true,
      color: '#cccccc'
    },
    color: '#cccccc'
  }
  let legend = {
    show: false
  }

  let series = [
    {
      name: '总量',
      type: 'line',
      smooth: true,
      emphasis: { focus: 'series' },
      lineStyle: {
        color: '#38BAF8'
      },
      itemStyle: {
        color: '#38BAF8'
      },
      areaStyle: {
        color: 'rgba(56,186,248,0.1)'
      },
      data: Object.values(props.detailData)
    }
  ]

  // 给EChart赋值
  options.value = {
    xAxis: xAxis,
    grid: grid,
    tooltip: tooltip,
    yAxis: yAxis,
    legend: legend,
    series: series
  }

  echartRef.value.resizeHandler()
}

function dealxAxis() {
  const data = Object.keys(props.detailData)
  const xData: string[] = []
  data.map((item) => {
    xData.push(formatDate(new Date(item), 'MM-DD'))
  })
  console.log(xData)
  return xData
}

defineExpose({ setChartOptions }) // 提供 setChartOptions 方法，用于设置图表配置
</script>
