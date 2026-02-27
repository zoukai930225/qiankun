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
  index: propTypes.number.def(0), // 内部索引
  year: propTypes.style.def(''), // 年
  month: propTypes.style.def('') // 月
})

const title = computed(() => {
  let storeName = ''
  if (props.index === 0) {
    storeName = '淘宝'
  } else if (props.index === 1) {
    storeName = '天猫'
  } else if (props.index === 2) {
    storeName = '拼多多'
  } else if (props.index === 3) {
    storeName = '京东抖音'
  }
  return `${props.year}年${props.month}月${storeName}数据看板`
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
  }
}
</style>
