<template>
  <div style="width: 100%; height: 100%; position: relative">
    <Echart :options="options" :height="height" ref="echartRef" />
  </div>
</template>
<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
const props = defineProps({
  height: propTypes.oneOfType([Number, String]).def('188px'),
  width: propTypes.oneOfType([Number, String]).def('100%'),
  data: propTypes.object.def({})
})

const options = ref({})
const echartRef = ref<any>()
const lable: any = {
  ageOne: '18-24岁',
  ageTwo: '25-30岁',
  ageThree: '31-35岁',
  ageFour: '36-40岁',
  ageFive: '41-45岁',
  ageSix: '46-50岁',
  ageSeven: '50岁以上'
}

let dataValue: any = {}

interface Data {
  name: string
  value: number
}

const data = ref<Data[]>([])
const getData = () => {
  data.value = []
  dataValue = {}
  Object.keys(props.data).forEach((key) => {
    if (Object.keys(lable).includes(key)) {
      let value = props.data[key] || 0
      if (typeof value === 'string') {
        value = value.replace('%', '')
      }
      if (value < 1) {
        value = Number(value * 100).toFixed(2)
      }
      const numAttr = value.toString().split('.')
      if (numAttr.length > 1) {
        value =
          Number(numAttr[1].slice(0, 2)) > 0
            ? `${numAttr[0]}.${numAttr[1].slice(0, 2)}`
            : `${numAttr[0]}`
      }
      dataValue[key] = value + '%'
      data.value.push({ name: lable[key], value: value })
    }
  })
}

const setChartOptions = () => {
  getData()
  let title = {
    show: data.value.length === 0, // 没数据才显示
    extStyle: {
      color: 'grey',
      fontSize: 20
    },
    text: '暂无数据',
    left: 'center',
    top: 'center'
  }

  let tooltip = {
    trigger: 'item',
    confine: true,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    textStyle: { color: '#ffffff' },
    borderWidth: 0,
    valueFormatter: (value) => value + '%'
  }
  let legend = {
    type: 'scroll',
    orient: 'horizontal',
    icon: 'rect',
    itemWidth: 8,
    itemHeight: 8,
    width: '100%',
    padding: 0,
    textStyle: {
      color: '#666666'
    },
    bottom: 12
  }
  let graphic = {
    elements: [
      {
        type: 'text',
        x: 4,
        y: 34,
        style: {
          text: '年龄占比',
          font: '14px/20px PingFang SC',
          fill: '#666666'
        }
      },
      {
        type: 'text',
        x: 4,
        y: 64,
        style: {
          text: '18-24',
          font: '14px/20px PingFang SC',
          fill: '#666666'
        }
      },
      {
        type: 'text',
        x: 52,
        y: 64,
        style: {
          text: dataValue.ageOne || '-',
          font: '500 14px/20px PingFang SC',
          fill: '#333333'
        }
      },
      {
        type: 'text',
        x: 4,
        y: 94,
        style: {
          text: '25-30',
          font: '14px/20px PingFang SC',
          fill: '#666666'
        }
      },
      {
        type: 'text',
        x: 52,
        y: 94,
        style: {
          text: dataValue.ageTwo || '-',
          font: '500 14px/20px PingFang SC',
          fill: '#333333'
        }
      }
    ]
  }
  options.value = {
    title,
    tooltip: tooltip,
    legend: legend,
    graphic: data.value.length === 0 ? [] : graphic,
    color: ['#0064FF', '#39D29F', '#FFA501', '#745DF5', '#6CD5FF', '#B14FF7', '#70E134'],
    series: {
      type: 'pie',
      radius: ['65%', '100%'],
      left: 116,
      height: 120,
      width: 120,
      top: 16,
      data: data.value,
      showEmptyCircle: false,
      label: {
        show: false
      }
    }
  }

  echartRef.value?.resizeHandler()
}
watch(
  () => props.data,
  (val) => {
    nextTick(() => {
      setChartOptions()
    })
  },
  { immediate: true }
)
defineExpose({ setChartOptions }) // 提供 setChartOptions 方法，用于设置图表配置
</script>
