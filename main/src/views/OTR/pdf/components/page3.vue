<template>
  <div class="PdfPage3">
    <div class="row">
      <img class="topIcon" src="@/assets/imgs/otr/pdf/page2_top.png" />
      <div class="column">
        <div class="descTitle">得分概览</div>
        <div class="descSubTitle">SCORE OVERVIEW</div>
        <div class="otherTitle">您的各素质项得分如下</div>
        <div class="chart" :style="{ height: onlyShowMyself ? '255px' : '245px' }">
          <div
            v-if="onlyShowMyself"
            style="
              color: #888;
              font-size: 12px;
              padding-left: 15px;
              padding-top: 10px;
              margin-bottom: -10px;
            "
            >橙色为他人评价,他人评价包含：直属上级，下级和同事</div
          >
          <SocreChart
            style="margin-top: 16px"
            ref="socreChartRef"
            :onlyShowMyself="onlyShowMyself"
            :option="lineOption1"
            :option1="lineOption2"
            :option2="lineOption3"
            :option3="lineOption4"
          />
        </div>

        <div class="socreDetailTitle" :style="{ marginTop: onlyShowMyself ? '20px' : '' }"
          >得分详情</div
        >

        <div class="scoreBg">
          <div class="item" v-for="(value, index) in headerList" :key="index">
            <div
              class="item-title"
              :class="{ 'item-title2': headerList.length >= 9 }"
              :style="{ paddingLeft: index === 0 ? '14px' : '', width: value.width }"
              >{{ value.title }}</div
            >
          </div>
        </div>

        <div class="scoreBg scoreBgNormal" v-for="(value, index) in list" :key="index">
          <div class="item" v-for="(value1, index1) in headerList" :key="index1">
            <div
              v-if="index1 === 0"
              class="item-title1"
              :class="{ 'item-title11': headerList.length >= 9 }"
              :style="{ paddingLeft: index1 === 0 ? '14px' : '', width: value1.width }"
              >{{ value.name }}</div
            >
            <div v-else class="item-content" :style="{ width: value1.width }">
              <div
                class="socre"
                :class="{ scoreRed: value.list[value1.field] > 4 }"
                :style="{ marginLeft: value1.marginLeft }"
              >
                {{ value.list[value1.field] }}</div
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SocreChart from '@/components/SWChart/otr/socreChar.vue'

import { propTypes } from '@/utils/propTypes'

const props = defineProps({
  data: propTypes.object.def({}),
  onlyShowMyself: propTypes.bool.def(false)
})

const socreChartRef = ref()

const lineOption1 = ref({
  xAxisData: [],
  yAxisData: [],
  tipsName: '',
  type: 'line',
  lineColor: '',
  direction: 'vertical',
  xAxisType: 'category',
  yAxisType: 'value'
})

const lineOption2 = ref({
  xAxisData: [],
  yAxisData: [],
  tipsName: '',
  type: 'line',
  lineColor: '',
  direction: 'vertical',
  xAxisType: 'category',
  yAxisType: 'value'
})

const lineOption3 = ref({
  xAxisData: [],
  yAxisData: [],
  tipsName: '',
  type: 'line',
  lineColor: '',
  direction: 'vertical',
  xAxisType: 'category',
  yAxisType: 'value'
})

const lineOption4 = ref({
  xAxisData: [],
  yAxisData: [],
  tipsName: '',
  type: 'line',
  lineColor: '',
  direction: 'vertical',
  xAxisType: 'category',
  yAxisType: 'value'
})
const handleStaticData = () => {
  if (props.data && props.data.actInventory) {
    const xAxisData = [] as any
    props.data.tms.forEach((item: any) => {
      if (item && item.programName) {
        xAxisData.push(item.programName)
      }
    })

    props.data.scores.forEach((item: any) => {
      const weidu = item['维度']
      if (weidu === '单项得分') {
        // if (!props.onlyShowMyself) {
        //   lineOption1.value.tipsName = weidu
        //   lineOption1.value.lineColor = '#014AFF'
        //   const yAxisData = [] as any
        //   xAxisData.forEach((item1: any) => {
        //     yAxisData.push(Number(item[item1]))
        //   })
        //   lineOption1.value.xAxisData = xAxisData
        //   lineOption1.value.yAxisData = yAxisData
        // }
      } else if (weidu === '直接上级') {
        lineOption2.value.tipsName = weidu
        lineOption2.value.lineColor = '#15C514'
        if (props.onlyShowMyself) {
          lineOption2.value.lineColor = '#F19437'
        }
        const yAxisData = [] as any
        xAxisData.forEach((item1: any) => {
          yAxisData.push(Number(item[item1]))
        })
        lineOption2.value.xAxisData = xAxisData
        lineOption2.value.yAxisData = yAxisData
      } else if (weidu === '本人') {
        lineOption3.value.tipsName = weidu
        lineOption3.value.lineColor = '#845DEE'
        const yAxisData = [] as any
        xAxisData.forEach((item1: any) => {
          yAxisData.push(Number(item[item1]))
        })
        lineOption3.value.xAxisData = xAxisData
        lineOption3.value.yAxisData = yAxisData
      } else if (weidu === '同事') {
        lineOption4.value.tipsName = weidu
        lineOption4.value.lineColor = '#F19437'
        if (props.onlyShowMyself) {
          lineOption4.value.lineColor = '#F19437'
        }
        const yAxisData = [] as any
        xAxisData.forEach((item1: any) => {
          yAxisData.push(Number(item[item1]))
        })
        lineOption4.value.xAxisData = xAxisData
        lineOption4.value.yAxisData = yAxisData
      } else if (weidu === '下级' || weidu === '同事/下级') {
        lineOption1.value.tipsName = weidu
        lineOption1.value.lineColor = '#014AFF'
        if (props.onlyShowMyself) {
          lineOption1.value.lineColor = '#F19437'
        }
        const yAxisData = [] as any
        xAxisData.forEach((item1: any) => {
          yAxisData.push(Number(item[item1]))
        })
        lineOption1.value.xAxisData = xAxisData
        lineOption1.value.yAxisData = yAxisData
      }
    })
  }
}

const headerList = ref<any>([])
const list = ref<any>([])

const handleScoreData = () => {
  if (props.data && props.data.actInventory) {
    const weiduList = [] as any
    props.data.tms.forEach((item: any) => {
      if (item && item.programName) {
        weiduList.push(item.programName)
      }
    })
    const itemWidth = Math.floor((543 - 14) / (weiduList.length + 1))
    headerList.value.push({
      title: '维度',
      width: `${itemWidth}px`,
      field: ''
    })
    weiduList.forEach((item: any) => {
      headerList.value.push({
        title: item,
        width: `${itemWidth}px`,
        field: item
      })
    })

    if (props.onlyShowMyself) {
      props.data.scores.forEach((item: any, index) => {
        const weidu = item['维度']
        if (weidu === '本人') {
          list.value.push({
            name: weidu,
            list: item
          })
        }
      })
    } else {
      props.data.scores.forEach((item: any, index) => {
        const weidu = item['维度']
        if (weidu !== '单项得分') {
          list.value.push({
            name: weidu,
            list: item
          })
        }
      })
    }
  }
}

onMounted(() => {
  handleStaticData()
  handleScoreData()
  nextTick(() => {
    socreChartRef.value.setChartOptions()
  })
})
</script>

<style lang="scss" scoped>
.PdfPage3 {
  background-image: url('@/assets/imgs/otr/pdf/page3_bg.png');
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background: #e9f2fb;

  .row {
    display: flex;
    flex-direction: row;
    .topIcon {
      margin-top: 28px;
      margin-left: 14px;
      width: 23px;
      height: 27px;
    }
    .column {
      margin-left: 13px;
      margin-top: 20px;
      display: flex;
      flex-direction: column;
      .descTitle {
        font-weight: 500;
        font-size: 30px;
        color: #232323;
      }
      .descSubTitle {
        font-weight: 400;
        font-size: 12px;
        color: #666666;
        line-height: 18px;
      }
      .otherTitle {
        margin-top: 24px;
        font-weight: 400;
        font-size: 17px;
        color: #232323;
      }
      .chart {
        margin-left: -24px;
        margin-top: 20px;
        width: 543px;
        height: 245px;
        background: #ffffff;
        border-radius: 10px;
      }
      .socreDetailTitle {
        padding-top: 29px;
        font-size: 17px;
        color: #232323;
        line-height: 25px;
        margin-bottom: 17px;
      }
      .scoreBg {
        margin-left: -24px;
        display: flex;
        margin-bottom: 12px;
        flex-direction: row;
        width: 543px;
        height: 43px;
        background: linear-gradient(270deg, #0069fb 0%, #69b3ff 100%);
        border-radius: 4px;
        align-items: center;
        align-content: center;
        .item {
          height: 43px;
          display: flex;
          flex-direction: column;
          &-title {
            margin-top: auto;
            margin-bottom: auto;
            font-weight: 500;
            font-size: 12px;
            color: #ffffff;
            line-height: 17px;
            letter-spacing: 1px;
          }
          &-title1 {
            margin-top: auto;
            margin-bottom: auto;
            font-weight: 500;
            font-size: 12px;
            color: #333333;
            line-height: 17px;
            letter-spacing: 1px;
          }
          &-title11 {
            font-size: 11px;
          }
          &-title2 {
            margin-top: auto;
            margin-bottom: auto;
            font-size: 10px;
            color: #ffffff;
            line-height: 17px;
          }
          &-content {
            display: flex;
            flex-direction: column;
            height: calc(100%);
            .socre {
              margin-top: auto;
              margin-bottom: auto;
              width: 44px;
              height: 28px;
              background: #d1e2c8;
              border-radius: 5px;
              text-align: center;
              font-weight: 600;
              font-size: 13px;
              color: #1a7874;
              line-height: 28px;
            }
            .scoreRed {
              background: #ffb5b5;
              color: #820000;
            }
          }
        }
      }
      .scoreBgNormal {
        background: #ffffff;
        box-shadow: 0px 2px 6px 0px rgba(52, 52, 52, 0.03);
      }
    }
  }
}
</style>
