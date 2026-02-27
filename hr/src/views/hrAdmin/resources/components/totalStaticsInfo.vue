<template>
  <div class="totalStaticsInfo">
    <div
      class="totalStaticsInfo-top"
      :style="{
        background: modelType ? '#303030' : '#fff'
      }"
    >
      <StaticsSection title="各部门入离职情况（月）" :modelType="modelType" />
      <div class="totalStaticsInfo-top-row">
        <div
          class="bg"
          @click="totalRuZhiClick"
          :style="{
            background: modelType ? '#303030' : '#fff'
          }"
        >
          <div class="title common-title">入职</div>
          <div class="row-center">
            <img class="icon" src="@/assets/imgs/hrAdmin/total_onJob.png" />
            <div
              class="value"
              :style="{
                color: modelType ? '#FFF5E9' : '#333333'
              }"
              >{{ numberFormateShow(onboardResignateData?.incumbencyCount) }}</div
            >
          </div>
          <!-- <div class="blurBg"></div> -->
          <!-- <div class="blurLine"></div> -->
        </div>
        <div
          class="bg"
          @click="totalLiZhiClick"
          :style="{
            background: modelType ? '#303030' : '#fff'
          }"
        >
          <div class="title1 common-title">离职</div>
          <div class="row-center">
            <img class="icon" src="@/assets/imgs/hrAdmin/total_offJob.png" />
            <div
              class="value"
              :style="{
                color: modelType ? '#FFF5E9' : '#333333'
              }"
              >{{ numberFormateShow(onboardResignateData?.dimissionCount) }}</div
            >
          </div>
          <!-- <div class="blurBg blurBg1"></div> -->
          <!-- <div class="blurLine blurLine1"></div> -->
        </div>
        <div
          class="bg"
          @click="totalRuLiZhiClick"
          :style="{
            background: modelType ? '#303030' : '#fff'
          }"
        >
          <div class="title2 common-title">总入离职</div>
          <div class="row-center">
            <img class="icon" src="@/assets/imgs/hrAdmin/total_totalOnoffJob.png" />
            <div
              class="value"
              :style="{
                color: modelType ? '#FFF5E9' : '#333333'
              }"
              >{{ numberFormateShow(onboardResignateData?.incumDimCount) }}</div
            >
          </div>
          <!-- <div class="blurBg blurBg2"></div> -->
          <!-- <div class="blurLine blurLine2"></div> -->
        </div>
      </div>
    </div>

    <div
      class="totalStaticsInfo-bottom"
      :style="{
        background: modelType ? '#303030' : '#fff'
      }"
    >
      <!-- <div class="row-center">
        <DateStatics ref="yearDateSelectRef" type="year" @date-change="yearDateChange" />
        <DateStatics
          ref="monthDateSelectRef"
          type="month"
          @date-change="monthDateChange"
          style="margin-left: -8px"
        />
      </div> -->
      <AllOnOffChart
        class="totalStaticsInfo-bottom-chart"
        ref="lineChartRef"
        :option="barOption"
        :option1="barOption1"
        :option2="lineOption"
        :option3="barOption2"
        @echart-click="echartClick"
        :modelType="modelType"
      />
    </div>
    <PeopleDetailDialog ref="peopleDetailDialogRef" />
  </div>
</template>
<script lang="ts" setup>
import { numberFormateShow } from '@/utils/formatter'
import dayjs from 'dayjs'

import AllOnOffChart from '@/components/SWChart/hrAdmin/allOnOffChart.vue'
import PeopleDetailDialog from './peopleDetailDialog.vue'
import StaticsSection from './staticsSection.vue'

import * as PersonRosterApi from '@/api/hrAdmin/personRoster'
import { nextTick, onMounted, ref } from 'vue'

const props = defineProps({
  date: {
    type: Array,
    default: () => []
  },
  modelType: {
    type: Boolean,
    default: false
  }
})

const list = ref([])

const onboardResignateData = ref() // 入职/离职/离职总数

// 总入职总离职数量
const queryOnboardResignate = async (company) => {
  if (!company) return
  currentCompany.value = company
  const param = {
    beginDate: props.date[0],
    endDate: props.date[1],
    company
  }
  const data = await PersonRosterApi.humanResourcesQueryOnboardResignate(param)

  console.log(data, '1111222')
  if (data) {
    onboardResignateData.value = data
  }
  queryIntoResignation(company)
}

const queryIntoResignation = async (company) => {
  const param = {
    beginDate: props.date[0],
    endDate: props.date[1],
    company
  }
  const data = await PersonRosterApi.humanResourcesQueryIntoResignation(param)
  console.log(data, '1111222333')
  list.value = data
  handleReqData(data)
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
  tipsName: '本期入职',
  type: 'bar',
  lineColor: '#F4D268',
  direction: 'vertical',
  xAxisType: 'category',
  yAxisType: 'value'
})

const barOption1 = ref<{
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
  tipsName: '本期离职',
  type: 'bar',
  lineColor: '#E38D35',
  direction: 'vertical',
  xAxisType: 'category',
  yAxisType: 'value'
})

const barOption2 = ref<{
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
  tipsName: '总入离职',
  type: 'bar',
  lineColor: '#F76560',
  direction: 'vertical',
  xAxisType: 'category',
  yAxisType: 'value'
})

const lineOption = ref<{
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
  tipsName: '离职率',
  type: 'line',
  lineColor: '#55D0AC',
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
//   queryOnboardResignate(currentCompany.value)
// }

// const monthDateChange = (date: string) => {
//   selectDate.value = date
//   yearDateSelectRef.value.clearDateSelectDate()
//   queryOnboardResignate(currentCompany.value)
// }

interface DataItem {
  dept: string
  onboardingNum: string
  dimissionNum: string
  onbDimNum: string
  turnoverRate: string
}

const handleReqData = (data: DataItem[]) => {
  const xAxisData: string[] = []
  const onBoardData: string[] = []
  const dimissionData: string[] = []
  const totalOnDismissData: string[] = []
  const turnoverRateData: string[] = []

  data.forEach((item) => {
    xAxisData.push(item.dept)
    onBoardData.push(item.onboardingNum)
    dimissionData.push(item.dimissionNum)
    totalOnDismissData.push(item.onbDimNum)
    turnoverRateData.push(item.turnoverRate)
  })
  barOption.value.xAxisData = xAxisData
  barOption.value.yAxisData = onBoardData

  barOption1.value.xAxisData = xAxisData
  barOption1.value.yAxisData = dimissionData

  barOption2.value.xAxisData = xAxisData
  barOption2.value.yAxisData = totalOnDismissData

  lineOption.value.xAxisData = xAxisData
  lineOption.value.yAxisData = turnoverRateData
  nextTick(() => {
    lineChartRef.value.setChartOptions()
  })
}

onMounted(() => {
  const currentDate = dayjs().format('YYYY-MM')
  selectDate.value = currentDate
  // monthDateSelectRef.value.initDate(currentDate)
})

const peopleDetailDialogRef = ref()
const echartClick = (e) => {
  let type = '' // 2 入职 3 离职
  if (e.seriesName === '本期入职') {
    type = '2'
  } else if (e.seriesName === '本期离职') {
    type = '3'
  } else if (e.seriesName === '总入离职') {
    type = '6'
  }
  peopleDetailDialogRef.value.open('ssc', {
    company: currentCompany.value,
    type,
    date: props.date,
    deptName: e.name
  })
}

// 总入职
const totalRuZhiClick = () => {
  peopleDetailDialogRef.value.open('ssc', {
    company: currentCompany.value,
    date: props.date,
    type: '4'
  })
}

// 总离职
const totalLiZhiClick = () => {
  peopleDetailDialogRef.value.open('ssc', {
    company: currentCompany.value,
    date: props.date,
    type: '5'
  })
}

// 总入离职
const totalRuLiZhiClick = () => {
  peopleDetailDialogRef.value.open('ssc', {
    company: currentCompany.value,
    date: props.date,
    type: '7'
  })
}

defineExpose({ queryOnboardResignate })
</script>

<style lang="scss" scoped>
.totalStaticsInfo {
  // margin-top: 20px;
  &-top {
    // height: 221px;
    // margin-bottom: 24px;
    background: linear-gradient(270deg, #ffffff 0%, #ffffff 100%);
    box-shadow: 0px 2px 6px 0px rgba(52, 52, 52, 0.03);
    border-radius: 2px;
    &-row {
      margin-left: 30px;
      margin-right: 30px;
      margin-top: 30px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .bg {
        width: 225px;
        background: #ffffff;
        cursor: pointer;
        border: 1px solid #cacaca;
        overflow: hidden;
        border-radius: 10px;
        padding: 9px 11px;
        box-sizing: border-box;
        .common-title {
          margin-bottom: 13px;
        }
        .title {
          width: 68px;
          height: 24px;
          background: rgba(241, 190, 52, 0.12);
          border-radius: 18px;
          line-height: 24px;
          font-weight: 500;
          font-size: 12px;
          color: #f0b20b;
          text-align: center;
        }
        .title1 {
          width: 68px;
          height: 24px;
          background: rgba(227, 141, 53, 0.12);
          border-radius: 18px;
          font-weight: 500;
          font-size: 12px;
          color: #ff8d17;
          line-height: 24px;
          text-align: center;
        }
        .title2 {
          width: 92px;
          height: 24px;
          background: rgba(247, 101, 96, 0.12);
          border-radius: 18px;
          font-weight: 500;
          font-size: 12px;
          color: #f76560;
          line-height: 24px;
          text-align: center;
        }
        .icon {
          width: 40px;
          height: 40px;
        }
        .value {
          font-weight: 500;
          font-size: 40px;
          color: #000000;
          line-height: 23px;
          letter-spacing: 1px;
          margin-left: 17px;
        }
        .blurBg {
          margin-top: -27px;
          margin-left: auto;
          margin-right: auto;
          width: 194px;
          height: 171px;
          background: #ffba00;
          opacity: 0.07;
          filter: blur(21px);
        }
        .blurLine {
          margin-top: -130px;
          width: 105px;
          height: 2px;
          margin-left: auto;
          margin-right: auto;
          background: linear-gradient(
            277deg,
            rgba(242, 191, 51, 0) 0%,
            #f3bf32 51%,
            rgba(240, 191, 52, 0) 100%
          );
        }
        .blurBg1 {
          background: #ff8400;
        }
        .blurLine1 {
          background: linear-gradient(
            277deg,
            rgba(233, 141, 41, 0) 0%,
            #e88d2b 51%,
            rgba(226, 145, 48, 0) 100%
          );
        }
        .blurBg2 {
          background: #ff5e9f;
        }
        .blurLine2 {
          background: linear-gradient(
            277deg,
            rgba(226, 95, 92, 0) 0%,
            #e25f5c 51%,
            rgba(226, 95, 92, 0) 100%
          );
        }
      }
    }
  }

  &-bottom {
    margin-top: 16px;
    padding-top: 24px;
    box-sizing: border-box;
    // height: 403px;
    background: linear-gradient(270deg, #ffffff 0%, #ffffff 100%);
    box-shadow: 0px 2px 6px 0px rgba(52, 52, 52, 0.03);
    border-radius: 2px;
    &-chart {
      margin-top: -20px;
      // margin-left: 8px;
      margin-right: 20px;
      width: calc(100%);
    }
  }
}
</style>
