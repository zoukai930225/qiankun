<template>
  <div class="dataV-top">
    <div class="title">{{ title }}</div>
    <div class="fullScreen">
      <Screenfull class="custom-hover1 fullScreen-icon" color="#fff" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Screenfull } from '@/layout/components/Screenfull'

const title = computed(() => {
  return `小红书店铺数据看板`
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
    color: #000;
  }
  .fullScreen {
    position: fixed;
    top: 30px;
    right: 30px;
  }
}
</style>
