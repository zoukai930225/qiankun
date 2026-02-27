<template>
  <div class="lineChart">
    <lineChart
      ref="lineChartRef"
      :height="height"
      :showAxis="showAxis"
      :option="lineOption"
      :option1="lineOption1"
      :option2="lineOption2"
    />
  </div>
</template>
<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
import lineChart from './lineChart.vue'

const props = defineProps({
  height: propTypes.oneOfType([Number, String]).def('400px'),
  showAxis: propTypes.bool.def(false),
  list: propTypes.array.def([]),
  channel: propTypes.string.def('') // 渠道 区分抖音
})

const lineChartRef = ref()

const lineOption = ref({
  xAxisData: [] as any,
  yAxisData: [] as any,
  tipsName: '',
  type: 'line',
  lineColor: '#3270FF',
  xAxisType: 'category',
  yAxisType: 'value'
})
const lineOption1 = ref({
  xAxisData: [] as any,
  yAxisData: [] as any,
  tipsName: '',
  type: 'line',
  lineColor: '#FF7D08',
  xAxisType: 'category',
  yAxisType: 'value'
})
const lineOption2 = ref({
  xAxisData: [] as any,
  yAxisData: [] as any,
  tipsName: '',
  type: 'line',
  lineColor: '#349B34',
  xAxisType: 'category',
  yAxisType: 'value'
})

// 处理数据
const splitData = (total, xAxisData, yAxisData) => {
  total &&
    total.forEach((item: any) => {
      const date = item.dataDate.split('-')
      xAxisData.push(`${date[1]}-${date[2]}` || '')
      yAxisData.push(item.GMV || '')
    })
}

const updateLineOptions = () => {
  lineOption.value.xAxisData = [] as any
  lineOption.value.yAxisData = [] as any

  lineOption1.value.xAxisData = [] as any
  lineOption1.value.yAxisData = [] as any

  lineOption2.value.xAxisData = [] as any
  lineOption2.value.yAxisData = [] as any

  if (props.channel === 'Douyin') {
    // 抖音的商品需要展示三个维度（店铺，直播，商务）
    const dataList = [] as any
    const dataList1 = [] as any
    const dataList2 = [] as any
    props.list &&
      props.list.forEach((item: any) => {
        if (item.type === '店铺') {
          dataList.push(item)
        }
        if (item.type === '直播间') {
          dataList1.push(item)
        }
        if (item.type === '商务') {
          dataList2.push(item)
        }
      })

    splitData(dataList, lineOption.value.xAxisData, lineOption.value.yAxisData)
    splitData(dataList1, lineOption1.value.xAxisData, lineOption1.value.yAxisData)
    splitData(dataList2, lineOption2.value.xAxisData, lineOption2.value.yAxisData)

    lineOption.value.tipsName = '店铺GMV'
    lineOption1.value.tipsName = '直播间GMV'
    lineOption2.value.tipsName = '商务GMV'
  } else {
    splitData(props.list, lineOption.value.xAxisData, lineOption.value.yAxisData)
    lineOption.value.tipsName = 'GMV'
  }
  nextTick(() => {
    lineChartRef.value.setChartOptions()
  })
}
updateLineOptions()
</script>

<style lang="scss" scoped>
.lineChart {
  background: #fff;
}
</style>
