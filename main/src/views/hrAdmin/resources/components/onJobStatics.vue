<template>
  <div
    class="onJobStatics"
    :style="{
      background: modelType ? '#303030' : '#fff'
    }"
  >
    <div class="row-center">
      <StaticsSection title="各部门在职人数" :modelType="modelType" />
      <!-- <DateStatics ref="yearDateSelectRef" type="year" @date-change="yearDateChange" /> -->
      <!-- <DateStatics
        ref="monthDateSelectRef"
        type="month"
        @date-change="monthDateChange"
        style="margin-left: -8px"
      /> -->
    </div>
    <OnJobChart
      class="onJobStatics-chart"
      ref="lineChartRef"
      :option="barOption"
      @echart-click="echartClick"
      :modelType="modelType"
    />
    <PeopleDetailDialog ref="peopleDetailDialogRef" />
  </div>
</template>
<script lang="ts" setup>
import dayjs from 'dayjs'

import OnJobChart from '@/components/SWChart/hrAdmin/onJobChart.vue'
import PeopleDetailDialog from './peopleDetailDialog.vue'
import StaticsSection from './staticsSection.vue'
import { getToday } from './utils'

import * as PersonRosterApi from '@/api/hrAdmin/personRoster'
import { nextTick, onMounted, ref } from 'vue'

const props = defineProps({
  date: {
    type: String,
    default: ''
  },
  modelType: {
    type: Boolean,
    default: false
  }
})

const list = ref([])

const queryIncumbencyByDept = async (company) => {
  if (!company) return
  currentCompany.value = company
  const param = {
    date: (props.date && props.date[1]) || getToday(),
    company
  }
  const data = await PersonRosterApi.humanResourcesQueryIncumbencyByDept(param)
  console.log(data, '1111')
  list.value = data
  handleReqData(data || [])
}

const lineChartRef = ref()
const barOption = ref<{
  xAxisData: string[]
  yAxisData: string[]
  tipsName: string
  type: string
  lineColor: string
  direction: string
  xAxisType: string
  yAxisType: string
}>({
  xAxisData: [],
  yAxisData: [],
  tipsName: '各部门在职人数',
  type: 'bar',
  lineColor: '#54D2AA',
  direction: 'vertical',
  xAxisType: 'category',
  yAxisType: 'value'
})

// const yearDateSelectRef = ref()
// const monthDateSelectRef = ref()
const selectDate = ref('')
const currentCompany = ref('')

// const yearDateChange = (date: string) => {
//   selectDate.value = date
//   monthDateSelectRef.value.clearDateSelectDate()
//   queryIncumbencyByDept(currentCompany.value)
// }

// const monthDateChange = (date: string) => {
//   selectDate.value = date
//   yearDateSelectRef.value.clearDateSelectDate()
//   queryIncumbencyByDept(currentCompany.value)
// }

const handleReqData = (data: any[]) => {
  let xAxisData: string[] = []
  let yAxisData: string[] = []

  data.forEach((item) => {
    xAxisData.push(item.dept)
    yAxisData.push(item.incumbentsNumber)
  })

  barOption.value.xAxisData = xAxisData
  barOption.value.yAxisData = yAxisData

  if (xAxisData.length === 0) {
    barOption.value.xAxisData = ['暂无数据']
    barOption.value.yAxisData = ['0']
  }

  nextTick(() => {
    lineChartRef.value.setChartOptions()
  })
}

const peopleDetailDialogRef = ref()
const echartClick = (e) => {
  const data = list.value[e.dataIndex] as any
  peopleDetailDialogRef.value.open('ssc', {
    company: currentCompany.value,
    type: '1',
    date: props.date,
    deptName: data.dept
  })
}

onMounted(() => {
  const currentDate = dayjs().format('YYYY-MM')
  selectDate.value = currentDate
  // monthDateSelectRef.value.initDate(currentDate)
})

defineExpose({ queryIncumbencyByDept })
</script>

<style lang="scss" scoped>
.onJobStatics {
  margin-top: 20px;
  height: 440px;
  background: linear-gradient(270deg, #ffffff 0%, #ffffff 100%);
  box-shadow: 0px 2px 6px 0px rgba(52, 52, 52, 0.03);
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  &-chart {
    margin-left: 20px;
    margin-right: 20px;
    width: 100%;
  }
}
</style>
