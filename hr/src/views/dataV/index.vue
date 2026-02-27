<template>
  <div class="bg">
    <rSwiper :fast="true" :mobile="true" :indicator="false" :autoPlay="true" :playTime="60000">
      <rSlide>
        <div class="box">
          <div class="layout1">
            <DataLayout1 v-for="(item, index) in firstPageData1" :key="index" :data="item" />
          </div>
          <div class="layout2">
            <DataLayout2
              v-for="(item, index) in firstPageData2"
              :key="index"
              :index="index"
              :selectIndex="layout2SelectIndex"
              :data="item"
              @tap-item="layout2TapItem"
            />
          </div>
        </div>
      </rSlide>
      <rSlide>
        <div class="box box2">
          <div class="layout" v-for="index of secondPageDataRow" :key="index">
            <DataLayout3
              v-for="(item, index1) in secondPageData[`${index - 1}`]"
              :key="index1"
              :index="index - 1"
              :innerIndex="index1"
              :data="item"
            />
          </div>
        </div>
      </rSlide>
    </rSwiper>
    <Top :year="year" :month="month" />
  </div>
</template>

<script lang="ts" setup>
import { rSwiper, rSlide } from 'r-swiper'
import Top from './components/top.vue'
import DataLayout1 from './components/dataLayout1.vue'
import DataLayout2 from './components/dataLayout2.vue'
import DataLayout3 from './components/dataLayout3.vue'

import * as DataVApi from '@/api/dataV'

const nowDate = new Date()
const year = ref(nowDate.getFullYear())
const month = ref('')
month.value = `${nowDate.getMonth() + 1}`

const firstPageData1 = ref<Array<object>>([])
const firstPageData2 = ref<Array<object>>([])
const secondPageDataRow = ref(0)
const secondPageData = ref({})

/**
 *
 {
        "code":200,
        "message":"",
        "code":{
                "gmv":"GMV目标",
                "actualGmv":"已完成GMV",
                "gmvRate":"GMV目标完成率",
                "repurchaseAmount":"月底复购金额",
                "promotionCost":"站内推广总花费",
                "payProportion":"全店付费占比",
                "repurchaseNumber":"近365天复购人数",
                "repurchaseRate":"月度复购率",
                "time":4
        }
    {
    gmv: '42000000',
    actualGmv: '10197674',
    gmvRate: '24.28%',
    repurchaseAmount: '3861760',
    promotionCost: '1938515',
    payProportion: '23.23%',
    repurchaseNumber: '1439981',
    repurchaseRate: '37.87%',
    time: 4
  }

}
 */
const getFirstPageDatas = async () => {
  const data = await DataVApi.getTaobaoStoreDailyData().catch(() => {})
  if (!data) {
    return
  }
  let monthStr = `${month.value}`
  if (data.time) {
    monthStr = `${data.time}`
    month.value = `${data.time}`
  }
  // 获取第一页数据
  let timeStr = `${year.value}年${monthStr}月`
  firstPageData1.value = [
    {
      title: `${timeStr}GMV目标`,
      value: data.gmv || '',
      symbol: false,
      rate: false,
      subTitle: `${timeStr}目标GMV`
    },
    {
      title: `已完成GMV`,
      value: data.actualGmv || '',
      symbol: true,
      rate: false,
      subTitle: `${timeStr}已完成GMV`
    },
    {
      title: `GMV目标完成率`,
      value: data.gmvRate || '',
      symbol: false,
      rate: true,
      subTitle: `目标完成率`
    },
    {
      title: `月度复购金额`,
      value: data.repurchaseAmount || '',
      symbol: false,
      rate: false,
      subTitle: `月度复购金额`
    }
  ]
  firstPageData2.value = [
    {
      title: `站内推广总花费`,
      value: data.promotionCost || '',
      symbol: true,
      rate: false,
      subTitle: `推广花费`
    },
    {
      title: `全店付费占比`,
      value: data.payProportion || '',
      symbol: false,
      rate: true,
      subTitle: `全店付费占比`
    },
    {
      title: `近365天复购人数`,
      value: data.repurchaseNumber || '',
      symbol: false,
      rate: false,
      subTitle: `复购人数`
    },
    {
      title: `月度复购率`,
      value: data.repurchaseRate || '',
      symbol: false,
      rate: true,
      subTitle: `月度复购率`
    }
  ]
}

/**
 ## 《每日数据汇总》图表相应接口
{
  "code":200,
  "message":"",
  "data":[
    {
      title: '内衣组',
      gmv: 21000000,
      actualGmv: 5956628,
      gmvRate: 28.36,
      promotionCost: 1272682.88,
      refundFee: null,
      payProportion: 28.29,
      currentMonth: 4
    },
    {
      title: '内裤组',
      gmv: 18800000,
      actualGmv: 4920590,
      gmvRate: 26.17,
      promotionCost: 800682.37,
      refundFee: null,
      payProportion: 18.37,
      currentMonth: 4
    },
    {
      title: '袜子组',
      gmv: 2200000,
      actualGmv: 650363,
      gmvRate: 29.56,
      promotionCost: 120939.73,
      refundFee: null,
      payProportion: 22.06,
      currentMonth: 4
    }
  ]
}
 */
const getSecondPageDatas = async () => {
  const data = await DataVApi.getBigScreenGroupDailyData().catch(() => {})
  if (!data) {
    return
  }
  secondPageDataRow.value = data.length
  if (data.length > 0 && data[0].currentMonth) {
    month.value = `${data[0].currentMonth}`
  }
  secondPageData.value = {}
  data.forEach((item, index) => {
    let dataArr = [{}]
    // GMV
    dataArr[0] = {
      title: `${item.title}GMV`,
      value: item.gmv || '',
      rate: false,
      subTitle: `${item.title}${item.currentMonth}月GMV`
    }
    // 实际完成GMV
    dataArr.push({
      title: `${item.title}实际完成GMV`,
      value: item.actualGmv || '',
      rate: false,
      subTitle: `${item.currentMonth}月GMV实际完成`
    })
    // GMV完成率
    dataArr.push({
      title: `${item.title}GMV完成率`,
      value: item.gmvRate || '',
      rate: true,
      subTitle: `${item.currentMonth}月GMV完成率`
    })
    // 付费推广总费用
    dataArr.push({
      title: `${item.title}付费推广总费用`,
      value: item.promotionCost || '',
      rate: false,
      subTitle: `${item.currentMonth}月付费推广总费用`
    })
    // 付费占比(去退)
    dataArr.push({
      title: `${item.title}付费占比(去退)`,
      value: item.payProportion || '',
      rate: true,
      subTitle: `${item.currentMonth}月去退付费占比`
    })
    secondPageData.value[`${index}`] = dataArr
  })
}

// 首页布局2默认选择索引
const layout2SelectIndex = ref(1)
const layout2TapItem = (index) => {
  layout2SelectIndex.value = index
}

// 每隔10分钟请求一次接口
const timeInterval = 1000 * 60 * 10
window.setInterval(() => {
  setTimeout(() => {
    // 更新年份
    year.value = nowDate.getFullYear()
    ///调取接口
    getFirstPageDatas()
    getSecondPageDatas()
  }, 0)
}, timeInterval)

onMounted(() => {
  getFirstPageDatas()
  getSecondPageDatas()
})
</script>

<style lang="scss" scoped>
.bg {
  background-image: url('@/assets/imgs/dataV/bg.png');
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  height: 100%;

  .box {
    margin-top: 120px;
    width: 100vw;
    height: calc(100% - 120px);
    display: flex;
    flex-direction: column;
    .layout1 {
      display: flex;
      flex-direction: row;
      width: 100%;
      height: calc(50%);
    }
    .layout2 {
      display: flex;
      flex-direction: row;
      width: 100%;
      height: calc(50%);
    }
  }

  .box2 {
    .layout {
      display: flex;
      flex-direction: row;
      width: 100%;
      height: calc(33.33%);
    }
  }
}
</style>
