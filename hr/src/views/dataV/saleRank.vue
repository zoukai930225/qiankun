<template>
  <rSwiper
    :fast="true"
    :mobile="true"
    :indicator="false"
    :autoPlay="true"
    :playTime="60000"
    @transitionend="funTransitionend"
  >
    <rSlide>
      <div class="rSlideItem">
        <BeforeWeek
          ref="beforeWeekRef"
          :totalPage="preWeekTotalPage"
          :title="beforeWeekTitle"
          :topList="preWeekGroupData"
          :rankList="preWeekServiceBaseData"
        />
      </div>
    </rSlide>
    <rSlide>
      <div class="rSlideItem"> </div>
      <BeforeMonth
        ref="beforeMonthRef"
        :totalPage="preMonthTotalPage"
        :title="beforeMonthTitle"
        :topList="preMonthGroupData"
        :rankList="preMonthServiceBaseData"
      />
    </rSlide>
    <rSlide>
      <div class="rSlideItem"> </div>
      <AfterWeek
        ref="afterWeekRef"
        :totalPage="afterWeekTotalPage"
        :title="afterWeekTitle"
        :topList="afterWeekGroupData"
        :rankList="afterWeekServiceBaseData"
      />
    </rSlide>
    <rSlide>
      <div class="rSlideItem"> </div>
      <AfterMonth
        ref="afterMonthRef"
        :totalPage="afterMonthTotalPage"
        :title="afterMonthTitle"
        :topList="afterMonthGroupData"
        :rankList="afterMonthServiceBaseData"
      />
    </rSlide>
  </rSwiper>
</template>
<!-- beforeWeek ：售前周 beforeMonth ：售前月 afterWeek ：售后周 afterMonth ：售后月 -->
<script lang="ts" setup>
import { rSwiper, rSlide } from 'r-swiper'
import BeforeWeek from './components/saleRank/beforeWeek.vue'
import BeforeMonth from './components/saleRank/beforeMonth.vue'
import AfterWeek from './components/saleRank/afterWeek.vue'
import AfterMonth from './components/saleRank/afterMonth.vue'

import * as DataVSaleApi from '@/api/dataV/sale'

const screenIndex = ref(0)
const funTransitionend = (i) => {
  if (screenIndex.value === i) {
    return
  }
  screenIndex.value = i
  if (screenIndex.value === 0) {
    beforeWeekRef.value?.rankContentScrollTop()

    setTimeout(() => {
      beforeWeekRef.value?.rankContentScroll()
    }, 100)
  } else if (screenIndex.value === 1) {
    beforeMonthRef.value?.rankContentScrollTop()

    setTimeout(() => {
      beforeMonthRef.value?.rankContentScroll()
    }, 100)
  } else if (screenIndex.value === 2) {
    afterWeekRef.value?.rankContentScrollTop()

    setTimeout(() => {
      afterWeekRef.value?.rankContentScroll()
    }, 100)
  } else if (screenIndex.value === 3) {
    afterMonthRef.value?.rankContentScrollTop()

    setTimeout(() => {
      afterMonthRef.value?.rankContentScroll()
    }, 100)
  }
}
const beforeWeekRef = ref()
const beforeMonthRef = ref()
const afterWeekRef = ref()
const afterMonthRef = ref()

const beforeWeekTitle = ref('')
const beforeMonthTitle = ref('')
const afterWeekTitle = ref('')
const afterMonthTitle = ref('')

const preWeekGroupData = ref([])
const preWeekServiceBaseData = ref([])
const preMonthGroupData = ref([])
const preMonthServiceBaseData = ref([])

const afterWeekGroupData = ref([])
const afterWeekServiceBaseData = ref([])
const afterMonthGroupData = ref([])
const afterMonthServiceBaseData = ref([])

const preWeekTotalPage = ref(1)
const preMonthTotalPage = ref(1)
const afterWeekTotalPage = ref(1)
const afterMonthTotalPage = ref(1)

const rowCount = 7
const otherRowCount = 8

const getRowCount = (count) => {
  if (count <= rowCount) {
    return 1
  } else {
    const otherCount = count - rowCount
    if (otherCount % otherRowCount === 0) {
      return Math.floor(otherCount / otherRowCount) + 1
    } else {
      return Math.floor(otherCount / otherRowCount) + 2
    }
  }
}
// 获取售前周数据
const getPreSalesWeekData = async () => {
  const data = await DataVSaleApi.customerServiceDataPreSalesWeek().catch(() => {})
  if (data) {
    preWeekGroupData.value = data.groupData || []
    preWeekServiceBaseData.value = data.serviceBaseData || []
    beforeWeekTitle.value = data.title || ''
    preWeekTotalPage.value = getRowCount(preWeekServiceBaseData.value.length)
    if (screenIndex.value === 0) {
      setTimeout(() => {
        beforeWeekRef.value?.rankContentScroll()
      }, 100)
    }
  }
}

// 获取售前月数据
const getPreSalesMonthData = async () => {
  const data = await DataVSaleApi.customerServiceDataPreSalesMonth().catch(() => {})
  if (data) {
    preMonthGroupData.value = data.groupData || []
    preMonthServiceBaseData.value = data.serviceBaseData || []
    beforeMonthTitle.value = data.title || ''
    preMonthTotalPage.value = getRowCount(preWeekServiceBaseData.value.length)
    if (screenIndex.value === 1) {
      setTimeout(() => {
        beforeMonthRef.value?.rankContentScroll()
      }, 100)
    }
  }
}

// 获取售后周数据
const getAfterSalesWeekData = async () => {
  const data = await DataVSaleApi.customerServiceDataAfterSalesWeek().catch(() => {})
  if (data) {
    afterWeekGroupData.value = data.groupData || []
    afterWeekServiceBaseData.value = (data.serviceBaseData || []).filter((item) => item.id)

    afterWeekTitle.value = data.title || ''
    afterWeekTotalPage.value = getRowCount(afterWeekServiceBaseData.value.length)
    if (screenIndex.value === 2) {
      setTimeout(() => {
        afterWeekRef.value?.rankContentScroll()
      }, 100)
    }
  }
}

// 获取售后月数据
const getAfterSalesMonthData = async () => {
  const data = await DataVSaleApi.customerServiceDataAfterSalesMonth().catch(() => {})
  if (data) {
    afterMonthGroupData.value = data.groupData || []
    afterMonthServiceBaseData.value = (data.serviceBaseData || []).filter((item) => item.id)
    afterMonthTitle.value = data.title || ''
    afterMonthTotalPage.value = getRowCount(afterMonthServiceBaseData.value.length)
    if (screenIndex.value === 3) {
      setTimeout(() => {
        afterMonthRef.value?.rankContentScroll()
      }, 100)
    }
  }
}

// 每隔10分钟请求一次接口
const reqTimeInterval = 1000 * 60 * 10
window.setInterval(() => {
  setTimeout(() => {
    getPreSalesWeekData()
    getPreSalesMonthData()
    getAfterSalesWeekData()
    getAfterSalesMonthData()
  }, 0)
}, reqTimeInterval)

onMounted(() => {
  getPreSalesWeekData()
  getPreSalesMonthData()
  getAfterSalesWeekData()
  getAfterSalesMonthData()
})
</script>

<style lang="scss" scoped></style>
