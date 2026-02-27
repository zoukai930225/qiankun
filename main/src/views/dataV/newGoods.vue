<template>
  <div v-if="slideList && slideList.length > 0">
    <rSwiper
      :fast="true"
      :mobile="true"
      :indicator="false"
      :autoPlay="true"
      :playTime="playTime"
      @transitionend="funTransitionend"
    >
      <rSlide v-for="(_, index) in slideList" :key="index">
        <div class="bg">
          <div class="itemBg">
            <NewGoodsBoardItem
              class="baordItem"
              :ref="getItemRef"
              v-for="(value, index1) in getCurrentList(index)"
              :key="index1"
              :data="value"
              :style="{ marginLeft: index1 === 0 ? '36px' : '42px' }"
            />
          </div>
        </div>
      </rSlide>
    </rSwiper>
  </div>
</template>

<script lang="ts" setup>
import { rSwiper, rSlide } from 'r-swiper'
import NewGoodsBoardItem from './components/newGoodsBoard/item.vue'

import * as DataVApi from '@/api/dataV'

const route = useRoute()
const storeStr = (route.query.store || '') as string

const playTime = ref(60000)

const slideList = ref()
const list = ref<any>([])

const getCurrentList = (index) => {
  const arr = [] as any
  if (index * 3 + 0 < list.value.length) {
    arr.push(list.value[index * 3 + 0])
  }
  if (index * 3 + 1 < list.value.length) {
    arr.push(list.value[index * 3 + 1])
  }
  if (index * 3 + 2 < list.value.length) {
    arr.push(list.value[index * 3 + 2])
  }
  return arr
}

const screenIndex = ref(0)
const funTransitionend = (i) => {
  screenIndex.value = i
}

let itemRefList = ref<HTMLElement[]>([])
const getItemRef = (el: any) => {
  if (el) {
    itemRefList.value.push(el)
  }
}

const loadingInstance = ref()
const getList = async (isLoading: boolean) => {
  if (isLoading) {
    loadingInstance.value = ElLoading.service({
      fullscreen: true,
      text: '数据加载中'
    })
  }
  const data = await DataVApi.customerServiceDataNewProduct(storeStr).catch(() => {
    if (isLoading) {
      loadingInstance.value.close()
    }
  })
  if (isLoading) {
    loadingInstance.value.close()
  }
  if (data) {
    list.value = data || []
    let slideCount = 0
    if (list.value.length % 3 === 0) {
      slideCount = list.value.length / 3
    } else {
      slideCount = list.value.length / 3 + 1
    }

    slideList.value = []
    for (let i = 0; i < slideCount; i++) {
      slideList.value.push(i)
    }
  }
  setTimeout(() => {
    itemRefList.value.forEach((item) => {
      item.updateChartData()
    })
  })
}

const getTimePeriod = async () => {
  const data = await DataVApi.bigScreenSildingTimeTimeNewProduct().catch((err) => {})
  if (data) {
    playTime.value = Number(data) * 1000
  }
}

// 每隔60分钟请求一次接口
const reqTimeInterval = 1000 * 60 * 60

window.setInterval(() => {
  setTimeout(() => {
    getList(false)
  }, 0)
}, reqTimeInterval)
onMounted(() => {
  getTimePeriod()
  getList(true)
})
</script>

<style lang="scss" scoped>
.bg {
  background-image: url('@/assets/imgs/dataV/team/rank_bg.jpg');
  background-size: 100% 100%;
  display: flex;
  width: 100%;
  height: 100%;
  min-width: 1920px;
  min-height: 1080px;
  .itemBg {
    margin-top: 36px;
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
