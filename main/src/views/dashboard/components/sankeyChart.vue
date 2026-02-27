<template>
  <div style="width: 100%">
    <div ref="chartContainer" :style="{ width: '100%', height: height + 'px' }"></div>
  </div>
</template>
<script lang="ts" setup>
import * as echarts from 'echarts'
import { getSanKeyData } from '@/api/dashboard'

defineOptions({ name: 'SankeyChart' })
const chartContainer = ref()
interface SanKey {
  data: Array<any>
  links: Array<any>
}
const sanKeyData = ref<SanKey>()
const height = ref<number>(1000)

const getDate = async () => {
  try {
    let res = await getSanKeyData()
    sanKeyData.value = res

    const data =
      sanKeyData.value?.data.map((item) => ({
        name: item.name,
        value: item.color === 'red' ? 12 : 0,
        itemStyle: {
          color: item.color,
          borderColor: item.color
        }
      })) || []
    let len: number = 0
    if (sanKeyData.value?.links.length) {
      len = sanKeyData.value?.links.length > 24 ? sanKeyData.value?.links.length - 10 : 14
    }
    const num = data.length * len
    height.value = num > 1000 ? num : 1000
    console.log(height.value)

    let option = {
      backgroundColor: '#fff',
      // title: {
      //   subtext: 'GitHub',
      //   left: 'center'
      // },
      series: [
        {
          type: 'sankey',
          left: 50.0,
          top: 20.0,
          right: 150.0,
          bottom: 25.0,
          nodeGap: 12,
          height: height.value,
          data: data,
          draggable: true,
          links: sanKeyData.value?.links.map((item) => ({
            ...item,
            value: 12
          })),
          lineStyle: {
            color: 'source',
            curveness: 0.5
          },
          itemStyle: {
            color: '#1f77b4',
            borderColor: '#1f77b4'
          },
          label: {
            color: 'rgba(0,0,0,0.7)',
            fontFamily: 'Arial',
            fontSize: 10
          }
        }
      ],
      tooltip: {
        trigger: 'item',
        formatter: `{b0}`
        // formatter: (params, ticket, callback) => {
        //   console.log(params)
        //   return params.name.replace(' > ', ' -- ')
        // }
      }
    }
    // console.log({ option })
    myChart = echarts.init(chartContainer.value)
    myChart.setOption(option)

    // const length = data.length;
    // chartContainer.value.style.height = height.value;
    myChart.getDom().style.height = height.value + 'px'
    console.log(myChart.getDom().childNodes[0])
    myChart.getDom().childNodes[0].style.height = height.value + 'px'
    myChart.getDom().childNodes[0].childNodes[0].setAttribute('height', height.value)
    myChart.getDom().childNodes[0].childNodes[0].style.height = height.value + 'px'
    handleResize()
  } catch (error) {
    console.log(error)
  }
}

let myChart: Nullable<echarts.ECharts> = null
// 统一处理resize事件
const handleResize = () => {
  myChart?.resize()
}

/** 初始化 **/
onMounted(() => {
  getDate()
  // 添加resize监听器
  window.addEventListener('resize', handleResize)
})

// 在组件卸载前移除resize监听器
onBeforeUnmount(() => {
  // 移除resize监听器
  window.removeEventListener('resize', handleResize)
})
</script>
<style lang="less"></style>
