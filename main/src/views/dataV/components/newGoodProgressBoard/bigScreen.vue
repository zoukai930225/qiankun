<!-- 新品进度看板  -->
<template>
  <div>
    <rSwiper
      :fast="true"
      :mobile="true"
      :indicator="false"
      :autoPlay="true"
      :speed="1000"
      :playTime="1000 * 30"
      @transitionend="funTransitionend"
    >
      <rSlide v-for="(value, index) in getBigScreenPageArr()" :key="index">
        <div style="width: 100vw">
          <div
            class="goodNodeBgBigScreen"
            :style="{
              marginLeft: getBigScreenScrollFrame(getCurretuPageList(index).length)[0],
              width: getBigScreenScrollFrame(getCurretuPageList(index).length)[1]
            }"
          >
            <GoodNode
              v-for="(value1, index1) in getCurretuPageList(index)"
              :key="index1"
              :data="value1"
              :isBigScreen="true"
              :style="{ marginRight: index1 === list.length - 1 ? '0px' : '20px' }"
            />
          </div>
        </div>
      </rSlide>
    </rSwiper>
  </div>
</template>
<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
import { rSwiper, rSlide } from 'r-swiper'

import GoodNode from './node.vue'

const props = defineProps({
  list: propTypes.array.def([])
})

const screenIndex = ref(0)
const funTransitionend = (i) => {
  screenIndex.value = i
}

const getBigScreenPageArr = () => {
  let page = 0
  if (props.list.length % 6 === 0) {
    page = props.list.length / 6
  } else {
    page = Math.floor(props.list.length / 6) + 1
  }
  let arr = []
  for (let i = 0; i < page; i++) {
    arr.push(i)
  }
  return arr || []
}

const getCurretuPageList = (page) => {
  if (page === 0) {
    if (props.list.length >= 6) {
      return props.list.slice(0, 6)
    } else {
      return props.list.slice(0, props.list.length)
    }
  } else {
    if (page * 6 + 6 <= props.list.length) {
      return props.list.slice(page * 6, page * 6 + 6)
    } else {
      return props.list.slice(page * 6, props.list.length)
    }
  }
  return []
}

const getBigScreenScrollFrame = (count) => {
  let marginLeft = `calc((100vw - 291px * 6 - 30 * 4px) / 2 + 15px)`
  let width = `calc(291px * 6 + 30 * 4px)`
  // if (count >= 2) {
  //   marginLeft = `calc((100vw - 291px * ${count} - 30 * ${count - 2}px) / 2 + 15px)`
  //   width = `calc(291px * ${count} + 30 * ${count - 2}px)`
  // }
  return [marginLeft, width]
}
</script>
<style lang="scss" scoped>
.goodNodeBgBigScreenSlider {
  width: 100vw;
  height: 100vh;
}
.goodNodeBgBigScreen {
  display: flex;
  flex-direction: row;
  height: calc(100vh - 30px);
  overflow: hidden;
}
</style>
