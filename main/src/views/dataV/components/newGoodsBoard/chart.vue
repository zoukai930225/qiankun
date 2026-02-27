<template>
  <div class="newGoodscChart">
    <div class="titleBg">
      <div class="titleBg-title">{{ title }}</div>
    </div>
    <div class="chart">
      <NewGoodsBoardChart ref="lineChartRef" :option="lineOption" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'

import NewGoodsBoardChart from '@/components/SWChart/bigScreen/newGoodsBoardChart.vue'

const props = defineProps({
  title: propTypes.string.def(''),
  list: propTypes.array.def([]),
  isPercent: propTypes.bool.def(false)
})

const lineChartRef = ref()
const lineOption = ref({
  xAxisData: [],
  yAxisData: [],
  tipsName: '',
  type: 'line',
  isPercent: props.isPercent,
  lineColor: '#3270FF',
  direction: 'vertical',
  xAxisType: 'category',
  yAxisType: 'value'
})

const updateLineOptions = () => {
  lineOption.value.xAxisData = []
  lineOption.value.yAxisData = []
  props.list &&
    props.list.forEach((item) => {
      const dateArr = item.date && item.date.split('-')
      let dateStr = item.date || ''
      if (dateArr.length > 2) {
        dateStr = `${dateArr[1]}/${dateArr[2]}`
      }
      lineOption.value.xAxisData.push(dateStr || '')
      if (props.isPercent) {
        lineOption.value.yAxisData.push((Number(item.value || '') * 100).toFixed(2))
      } else {
        lineOption.value.yAxisData.push(item.value || '')
      }
    })
  lineOption.value.tipsName = props.title
  setTimeout(() => {
    lineChartRef.value.setChartOptions()
  })
}

defineExpose({
  updateLineOptions
})
</script>

<style lang="scss" scoped>
.newGoodscChart {
  margin-left: 12px;

  .titleBg {
    margin-left: calc((100% - 148px) / 2);
    background-image: url(@/assets/imgs/dataV/newGoodsBoard/chart_title_bg.png);
    background-size: 100% 100%;
    width: 148px;
    height: 26px;
    background-repeat: no-repeat;
    // border-radius: 12px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    &-title {
      font-weight: 800;
      font-size: 17px;
      color: #ffffff;
      line-height: 26px;
    }
  }
  .chart {
    // margin-top: 9px;
    height: calc(141px - 10px);
  }
}
</style>
