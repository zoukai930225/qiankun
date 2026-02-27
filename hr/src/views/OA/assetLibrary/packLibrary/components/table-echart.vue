<template>
  <div class="clickRateChart">
    <div ref="chartContainer" style="width: 100%;height: 100%;"></div>
  </div>
</template>
<script setup lang="ts">
import * as echarts from 'echarts'
const chartContainer = ref()
let myChart: Nullable<echarts.ECharts> = null

const options =ref({
  grid:{
    bottom:10,
    top:10,
  },
  tooltip: {
      trigger: 'axis',
      // axisPointer: { type: 'shadow' },
      // valueFormatter: (val: number) => val + ' 万'
       backgroundColor:'rgba(36, 52, 90, 0.9)',
       textStyle:{
        color:'#fff'
       }, 
      formatter:(val)  =>{
         console.log("val",val)
         return `<div>${val[0].marker}<span>${val[0].name}</span><span style='margin-left:20px'>${val[0].value}</span></div>`
      }
    },
  xAxis: {
    show:false,
    type: 'category',
    boundaryGap: false,  // 折线从坐标轴起点开始:cite[2]
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: { type: 'value',show:false },
  series: [{
    name: '数据系列',
    type: 'line',
    // symbol: 'none',      // 不显示数据点:cite[3]
    smooth: true,        // 平滑曲线:cite[3]
    lineStyle: {
      color: '#38BAF8',
      width: 2
    },
    areaStyle: {
      color: {
        type: 'linear',
        x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [{
          offset: 0, color: 'rgba(56, 186, 248, 0.8)'  // 带透明度
        }, {
          offset: 1, color: 'rgba(56, 186, 248, 0.1)'  // 更透明
        }]
      }
    },
    data: [10, 20, 34, 55, 35, 42, 11]
  }]
})
// 统一处理resize事件
const handleResize = () => {
  myChart?.resize()
}

onMounted(() => {
  setTimeout(() => {
     console.log(chartContainer.value)
      myChart = echarts.init(chartContainer.value)
      myChart.setOption(options.value) 
  }, 0);
  // 添加resize监听器
  window.addEventListener('resize', handleResize)
})

// 在组件卸载前移除resize监听器
onBeforeUnmount(() => {
  // 移除resize监听器
  window.removeEventListener('resize', handleResize)
})

//   myChart.setOption(options.value)


</script>
<style lang="scss" scoped>
.clickRateChart{
  width: 100%;
  height: 100%;
}

</style>