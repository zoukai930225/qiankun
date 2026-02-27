<template>
  <div class="dataChart">
    <SWChart ref="lineChartRef" :option1="lineData1" :option2="lineData2" />
    <!-- <SWChart ref="lineChartRef1" :option1="goodSaleOption" /> -->
  </div>
</template>

<script lang="ts" setup>
import SWChart from '@/components/SWChart/index.vue'

defineOptions({ name: 'DataStat' })

const lineChartRef = ref()
const lineChartRef1 = ref()
const lineData1 = ref({
  // 总收益
  xAxisData: ['4.11', '4.12', '4.13', '4.14', '4.15', '4.16', '4.17'], //总收益统计X轴数据
  yAxisData: [111, 333, 222, 444, 666, 777, 888], //总收益统计Y轴数据
  tipsName: '收益',
  lineColor: '#126EFE'
})

const lineData2 = ref({
  // 总收益
  xAxisData: ['4.11', '4.12', '4.13', '4.14', '4.15', '4.16', '4.17'], //总收益统计X轴数据
  yAxisData: [666, 222, 444, 777, 111, 777, 888], //总收益统计Y轴数据
  tipsName: '收益',
  lineColor: '#FE8C4A'
})
const goodSaleOption = ref({
  xAxisData: ['商品1', '商品2', '商品3', '商品4', '商品5', '商品6', '商品7'], //商品销售排行榜统计X轴数据
  yAxisData: [666, 222, 444, 777, 111, 777, 888], //商品销售排行榜统计Y轴数据
  tipsName: '销售额',
  type: 'bar',
  lineColor: '#126EFE',
  direction: 'vertical',
  xAxisType: 'category',
  yAxisType: 'value'
})
/** 初始化 **/
onMounted(() => {
  nextTick(() => {
    lineChartRef.value.setChartOptions()
    lineChartRef1.value?.setChartOptions()
  })
})
</script>

<style lang="scss" scoped>
.dataChart {
  background: #fff;
}
</style>
