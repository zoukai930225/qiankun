<template>
  <rSwiper :fast="true" :mobile="true" :indicator="false" :autoPlay="true" :playTime="60000"
    @transitionend="funTransitionend">
    <rSlide>
      <div class="rSlideItem">
        <TeamRank ref="teamRankRef" :type="0" :totalPage="totalPage" :dataYear="dataYear" :dataMonth="dataMonth"
          :topList="topList" :rankList="rankList" />
      </div>
    </rSlide>
    <!-- <rSlide>
      <div class="rSlideItem">
        <TeamRank ref="teamRankRef1" :type="1" :totalPage="totalPage1" :dataYear="dataYear1" :dataMonth="dataMonth1"
          :topList="topList1" :rankList="rankList1" />
      </div>
    </rSlide> -->
  </rSwiper>
</template>

<script lang="ts" setup>
import { rSwiper, rSlide } from 'r-swiper'
import TeamRank from './components/teamRank.vue'
import * as DataVApi from '@/api/dataV'

const screenIndex = ref(0)
const funTransitionend = (i) => {
  screenIndex.value = i
}

const topList = ref<DataVApi.BiResponsibilityAuthorityData[]>()
const originTopList = ref<DataVApi.BiResponsibilityAuthorityData[]>()
const rankList = ref<DataVApi.BiResponsibilityAuthorityData[]>()
const list = ref<DataVApi.BiResponsibilityAuthorityData[]>()

const teamRankRef = ref()
const totalPage = ref(1)
const dataYear = ref('')
const dataMonth = ref()
const timeInterval = 1000 * 10 // 每10秒滚动下一页数据

/**
 * 获取BI个人责权大屏数据统计展示大屏信息
 */
const getBiResponsibilityAuthorityData = async () => {
  const data = (await DataVApi.getBiResponsibilityAuthorityBigScreenData().catch(
    () => { }
  )) as DataVApi.BiResponsibilityAuthorityData[]
  if (data) {
    list.value = data
    handleRankList()
  }
}

const handleRankList = () => {
  topList.value = []
  originTopList.value = []
  rankList.value = []

  list.value &&
    list.value.forEach((item, index) => {
      if (index < 3) {
        originTopList.value?.push(item)
      } else {
        rankList.value?.push(item)
      }
    })
  if (originTopList.value.length >= 3) {
    topList.value.push(originTopList.value[1])
    topList.value.push(originTopList.value[0])
    topList.value.push(originTopList.value[2])
  } else {
    topList.value = originTopList.value
  }
  if (rankList.value.length > 12) {
    if (rankList.value.length % 12 === 0) {
      totalPage.value = rankList.value.length / 12
    } else {
      totalPage.value = Math.floor(rankList.value.length / 12) + 1
    }
    setTimeout(() => {
      teamRankRef.value?.rankContentScroll()
    }, timeInterval)
  }
  if (list.value && list.value.length > 0) {
    const dataMonthArr = list.value[0].dataMonth.split('-')
    if (dataMonthArr && dataMonthArr.length > 1) {
      dataYear.value = dataMonthArr[0]
      dataMonth.value = Number(dataMonthArr[1])
    }
  }
}

const topList1 = ref<DataVApi.BiResponsibilityAuthorityData[]>()
const originTopList1 = ref<DataVApi.BiResponsibilityAuthorityData[]>()
const rankList1 = ref<DataVApi.BiResponsibilityAuthorityData[]>()
const list1 = ref<DataVApi.BiResponsibilityAuthorityData[]>()

const teamRankRef1 = ref()
const totalPage1 = ref(1)
const dataYear1 = ref('')
const dataMonth1 = ref()

/**
 * 获取BI个人责权大屏数据统计展示大屏信息
 */
const getBiTargetProfitBigScreenData = async () => {
  const data = (await DataVApi.getBiResponsibilityAuthorityTargetProfitBigScreenData().catch(
    () => { }
  )) as DataVApi.BiResponsibilityAuthorityData[]
  if (data) {
    list1.value = data
    handleRankList1()
  }
}

const handleRankList1 = () => {
  topList1.value = []
  originTopList1.value = []
  rankList1.value = []

  list1.value &&
    list1.value.forEach((item, index) => {
      if (index < 3) {
        originTopList1.value?.push(item)
      } else {
        rankList1.value?.push(item)
      }
    })
  if (originTopList1.value.length >= 3) {
    topList1.value.push(originTopList1.value[1])
    topList1.value.push(originTopList1.value[0])
    topList1.value.push(originTopList1.value[2])
  } else {
    topList1.value = originTopList1.value
  }
  if (rankList1.value.length > 12) {
    if (rankList1.value.length % 12 === 0) {
      totalPage1.value = rankList1.value.length / 12
    } else {
      totalPage1.value = Math.floor(rankList1.value.length / 12) + 1
    }
    setTimeout(() => {
      teamRankRef1.value?.rankContentScroll()
    }, timeInterval)
  }
  if (list1.value && list1.value.length > 0) {
    const dataMonthArr = list1.value[0].dataMonth.split('-')
    if (dataMonthArr && dataMonthArr.length > 1) {
      dataYear1.value = dataMonthArr[0]
      dataMonth1.value = Number(dataMonthArr[1])
    }
  }
}

// 每隔10分钟请求一次接口
const reqTimeInterval = 1000 * 60 * 10
window.setInterval(() => {
  setTimeout(() => {
    getBiResponsibilityAuthorityData()
    getBiTargetProfitBigScreenData()
  }, 0)
}, reqTimeInterval)

onMounted(() => {
  getBiResponsibilityAuthorityData()
  getBiTargetProfitBigScreenData()
})
</script>

<style lang="scss" scoped></style>
