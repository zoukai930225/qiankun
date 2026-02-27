<template>
  <div class="dataV-top">
    <div class="title">{{ title }}</div>
    <div class="fullScreen">
      <Screenfull class="custom-hover1 fullScreen-icon" color="#fff" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
import { Screenfull } from '@/layout/components/Screenfull'

const props = defineProps({
  year: propTypes.style.def(''), // 年
  month: propTypes.style.def('') // 月
})

const title = computed(() => {
  return `${props.year}年${props.month}月SW淘宝店每日数据看板`
})
</script>

<style lang="scss" scoped>
.dataV-top {
  position: fixed;
  top: 0px;
  width: 100%;
  height: 60px;
  .title {
    padding-top: 30px;
    width: 100%;
    text-align: center;
    font-size: 24px;
    font-weight: 500;
    color: #fff;
  }
  .fullScreen {
    position: fixed;
    top: 30px;
    right: 30px;
    // background: red;
    // display: flex;
    // flex-direction: row;
    // align-items: center;
    // border-radius: 2px;
    // border: 1px solid #2d8cf0;
    // height: 30px;
    // &-icon {
    //   margin-top: 8px;
    //   margin-left: 6px;
    // }
    // &-title {
    //   padding-left: 6px;
    //   padding-right: 10px;
    //   color: #fff;
    //   font-size: 14px;
    //   line-height: 30px;
    // }
  }
}
</style>
