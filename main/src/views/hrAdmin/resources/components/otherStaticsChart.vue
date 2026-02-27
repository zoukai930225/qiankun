<template>
  <div>
    <OtherStaticsChart
      class="otherStaticsChart"
      ref="lineChartRef"
      :option="barOption"
      @echart-click="echartClick"
      :modelType="modelType"
    />
    <PeopleDetailDialog ref="peopleDetailDialogRef" />
  </div>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getDictValue } from '@/utils/dict'
import { propTypes } from '@/utils/propTypes'

import OtherStaticsChart from '@/components/SWChart/hrAdmin/otherStaticsChart.vue'
import PeopleDetailDialog from './peopleDetailDialog.vue'

import { nextTick, ref } from 'vue'

const props = defineProps({
  company: propTypes.string.def(''),
  modelType: propTypes.bool.def(false)
})

const lineChartRef = ref()
const barOption = ref({
  data: [],
  tipsName: '',
  type: 'bar',
  lineColor: '#126EFE',
  direction: 'vertical',
  xAxisType: 'category',
  yAxisType: 'value'
})

const chartList = ref()
const currentTitle = ref()

const handleReqData = (list: [], title: string) => {
  barOption.value.data = []
  chartList.value = list || []
  currentTitle.value = title || ''
  if (list && list.length > 0) {
    list.forEach((item) => {
      barOption.value.data.push({
        name: item.title || '未知',
        value: item.value || 0,
        ratio: item.ratio || 0
      })
    })
  }
  nextTick(() => {
    lineChartRef.value.setChartOptions()
  })
}

const shapeDict = {
  学历分布: 1,
  男女分布: 2,
  转正分布: 3,
  年龄分布: 4,
  职级分布: 5,
  司龄分布: 6
}

const peopleDetailDialogRef = ref()
const echartClick = (e) => {
  if (e.dataIndex < chartList.value.length) {
    const data = chartList.value[e.dataIndex]
    const type = shapeDict[currentTitle.value] || ''
    let value = ''
    if (type === 1) {
      // 学历分布
      value = getDictValue(DICT_TYPE.FEISHU_LEVEL, data.title)
    } else if (type === 2) {
      // 男女分布
      value = getDictValue(DICT_TYPE.FEISHU_GENDER, data.title)
    } else if (type === 3) {
      // 转正分布
      value = getDictValue(DICT_TYPE.FEISHU_APPLICATION_STATUS, data.title)
    } else {
      value = data.title
    }
    peopleDetailDialogRef.value.open('shape', {
      company: props.company || '',
      type,
      value
    })
  }
}

defineExpose({ handleReqData })
</script>

<style lang="scss" scoped>
.otherStaticsChart {
  width: calc(100% - 47px);
}
</style>
