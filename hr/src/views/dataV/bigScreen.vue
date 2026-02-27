<template>
  <div class="bg">
    <rSwiper
      :fast="true"
      :mobile="true"
      :indicator="false"
      :autoPlay="true"
      :playTime="60000"
      @transitionend="funTransitionend"
    >
      <rSlide>
        <div class="box box2">
          <div class="layout" v-for="index of firstPageDataRow" :key="index">
            <DataLayout4
              v-for="(item, index1) in firstPageData[`${index - 1}`]"
              :key="index1"
              :row="firstPageDataRow"
              :innerIndex="index1"
              :data="item"
            />
          </div>
        </div>
      </rSlide>
      <rSlide>
        <div class="box box2">
          <div
            class="layout"
            :class="{ layout2Row: secondPageDataRow === 2 }"
            v-for="index of secondPageDataRow"
            :key="index"
          >
            <DataLayout4
              v-for="(item, index1) in secondPageData[`${index - 1}`]"
              :key="index1"
              :row="secondPageDataRow"
              :innerIndex="index1"
              :data="item"
            />
          </div>
        </div>
      </rSlide>
      <rSlide>
        <div class="box box2">
          <div class="layout" v-for="index of thirdPageDataRow" :key="index">
            <DataLayout4
              v-for="(item, index1) in thirdPageData[`${index - 1}`]"
              :key="index1"
              :row="thirdPageDataRow"
              :innerIndex="index1"
              :data="item"
            />
          </div>
        </div>
      </rSlide>
      <rSlide>
        <div class="box box2">
          <div class="layout" v-for="index of fourPageDataRow" :key="index">
            <DataLayout4
              v-for="(item, index1) in fourPageData[`${index - 1}`]"
              :key="index1"
              :row="fourPageDataRow"
              :innerIndex="index1"
              :data="item"
            />
          </div>
        </div>
      </rSlide>
    </rSwiper>
    <Top :year="year" :month="month" :index="screenIndex" />
  </div>
</template>

<script lang="ts" setup>
import { rSwiper, rSlide } from 'r-swiper'
import Top from './components/top1.vue'
import DataLayout4 from './components/dataLayout4.vue'

import * as DataVApi from '@/api/dataV'

const nowDate = new Date()
const year = ref(nowDate.getFullYear())
const month = ref('')
month.value = `${nowDate.getMonth() + 1}`

const screenIndex = ref(0)

const storeTaobao = 'tabbao'
const storeTmallAndDouyinbao = 'tmallAndDouyin'
const storePdd = 'pdd'
const storedDouyinAndJd = 'douyinAndJd'

const firstPageDataList = ref([] as DataVApi.StoreBigScreenData[])
const secondPageDataList = ref([] as DataVApi.StoreBigScreenData[])
const thirdPageDataList = ref([] as DataVApi.StoreBigScreenData[])
const fourPageDataList = ref([] as DataVApi.StoreBigScreenData[])

const firstPageDataRow = ref(0)
const firstPageData = ref({})
const secondPageDataRow = ref(0)
const secondPageData = ref({})
const thirdPageDataRow = ref(0)
const thirdPageData = ref({})
const fourPageDataRow = ref(0)
const fourPageData = ref({})

const color_55C348 = '#55C348'
const color_CC4643 = '#CC4643'
const color_F2972C = '#F2972C'
const color_4B87FF = '#4B87FF'

const color_68B06E = '#68B06E'
const color_B05253 = '#B05253'
const color_90622E = '#90622E'
const color_5486EB = '#5486EB'

/**
 * 获取淘宝大屏信息
 */
const getStoreBigScreenData = async (store) => {
  let responseData: DataVApi.StoreBigScreenData[] = []
  if (store === storeTaobao) {
    const data = (await DataVApi.getTaobaoBigScreenData().catch(
      () => {}
    )) as DataVApi.StoreBigScreenData[]
    firstPageDataList.value = data

    responseData = data
  } else if (store === storeTmallAndDouyinbao) {
    const data = (await DataVApi.getTmallAndDouyinBigScreenData().catch(
      () => {}
    )) as DataVApi.StoreBigScreenData[]
    secondPageDataList.value = data
    responseData = data
  } else if (store === storePdd) {
    const data = (await DataVApi.getPddBigScreenData().catch(
      () => {}
    )) as DataVApi.StoreBigScreenData[]
    thirdPageDataList.value = data
    responseData = data
  } else if (store === storedDouyinAndJd) {
    const data = (await DataVApi.getDouyinAndJdBigScreenData().catch(
      () => {}
    )) as DataVApi.StoreBigScreenData[]
    fourPageDataList.value = data
    responseData = data
  }

  if (!responseData) {
    return
  }
  if (responseData.length > 0 && responseData[0].currentMonth) {
    month.value = `${responseData[0].currentMonth}`
  }

  if (store === storeTaobao) {
    firstPageDataRow.value = responseData.length
    firstPageData.value = {}
  } else if (store === storeTmallAndDouyinbao) {
    secondPageDataRow.value = responseData.length
    secondPageData.value = {}
  } else if (store === storePdd) {
    thirdPageDataRow.value = responseData.length
    thirdPageData.value = {}
  } else if (store === storedDouyinAndJd) {
    fourPageDataRow.value = responseData.length
    fourPageData.value = {}
  }

  responseData.forEach((item, index) => {
    let titleColor = color_55C348
    let subTitleColor = color_68B06E
    if (index === 0) {
      titleColor = color_55C348
      subTitleColor = color_68B06E
    } else if (index === 1) {
      titleColor = color_CC4643
      subTitleColor = color_B05253
    } else if (index === 2) {
      titleColor = color_F2972C
      subTitleColor = color_90622E
    } else if (index === 3) {
      titleColor = color_4B87FF
      subTitleColor = color_5486EB
    } else if (index === 4) {
      titleColor = color_55C348
      subTitleColor = color_68B06E
    } else if (index === 5) {
      titleColor = color_CC4643
      subTitleColor = color_B05253
    }
    let dataArr = [{}]
    // GMV
    dataArr[0] = {
      title: `${item.title}GMV`,
      value: item.gmv || '',
      rate: false,
      titleColor,
      subTitleColor,
      subTitle: `${item.title}GMV`
    }
    // 实际完成GMV
    dataArr.push({
      title: `${item.title}实际完成GMV`,
      value: item.actualGmv || '',
      rate: false,
      titleColor,
      subTitleColor,
      subTitle: `${item.title}实际完成GMV`
    })
    // GMV完成率
    dataArr.push({
      title: `${item.title}GMV完成率`,
      value: item.gmvRate || '',
      rate: true,
      titleColor,
      subTitleColor,
      subTitle: `${item.title}GMV完成率`
    })
    if (store === storeTaobao) {
      firstPageData.value[`${index}`] = dataArr
    } else if (store === storeTmallAndDouyinbao) {
      secondPageData.value[`${index}`] = dataArr
    } else if (store === storePdd) {
      thirdPageData.value[`${index}`] = dataArr
    } else if (store === storedDouyinAndJd) {
      fourPageData.value[`${index}`] = dataArr
    }
  })
}

const funTransitionend = (i) => {
  screenIndex.value = i
}

// 每隔10分钟请求一次接口
const timeInterval = 1000 * 60 * 10
window.setInterval(() => {
  setTimeout(() => {
    // 更新年份
    year.value = nowDate.getFullYear()
    ///调取接口
    getStoreBigScreenData(storeTaobao)
    getStoreBigScreenData(storeTmallAndDouyinbao)
    getStoreBigScreenData(storePdd)
    getStoreBigScreenData(storedDouyinAndJd)
  }, 0)
}, timeInterval)

onMounted(() => {
  getStoreBigScreenData(storeTaobao)
  getStoreBigScreenData(storeTmallAndDouyinbao)
  getStoreBigScreenData(storePdd)
  getStoreBigScreenData(storedDouyinAndJd)
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
    .layout2Row {
      margin-top: calc(5%);
    }
  }

  .box2 {
    .layout {
      display: flex;
      flex-direction: row;
      width: 100%;
      height: calc(50%);
    }
  }
}
</style>
