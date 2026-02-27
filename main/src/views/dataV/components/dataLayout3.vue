<template>
  <div class="dataV-layout3">
    <div class="title">{{ data.title }}</div>
    <div
      class="data"
      :style="{
        color: valueTitleColor,
        'font-size': valueTitleSize,
        'padding-top': valueTitlePaddingTop
      }"
    >
      {{ middleValue }}</div
    >
    <div class="time" :style="{ color: subTitleColor }"> {{ data.subTitle }}</div>
  </div>
</template>

<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'

const props = defineProps({
  index: propTypes.number.def(0), // 索引
  innerIndex: propTypes.number.def(0), // 内部索引
  data: propTypes.object.def({}) // 数据
})

// 中间值
const middleValue = computed(() => {
  if (props.data.value && props.data.rate) {
    if (Number(props.data.value)) {
      return `${Number(props.data.value).toFixed(2)}%`
    } else {
      return props.data.value
    }
  }
  return props.data.value
})

// 值标题大小
const valueTitleSize = computed(() => {
  if (props.innerIndex === 0) {
    return 'calc(100vw * 35 / 1200)'
  } else if (props.innerIndex === 1) {
    return 'calc(100vw * 40 / 1200)'
  } else if (props.innerIndex === 2) {
    return 'calc(100vw * 45 / 1200)'
  }
  return 'calc(100vw * 50 / 1200)'
})

// 值标题上间距
const valueTitlePaddingTop = computed(() => {
  if (props.innerIndex === 0) {
    return '8%'
  } else if (props.innerIndex === 1) {
    return '7%'
  } else if (props.innerIndex === 2) {
    return '6%'
  }
  return '6%'
})

// 值标题颜色
const valueTitleColor = computed(() => {
  if (props.index === 0) {
    return '#be5048'
  } else if (props.index === 1) {
    return '#c59945'
  }
  return '#5a87f7'
})

// 子标题颜色
const subTitleColor = computed(() => {
  if (props.index === 0) {
    return '#b9514a'
  } else if (props.index === 1) {
    return '#ca9152'
  }
  return '#5b80e2'
})
</script>

<style lang="scss" scoped>
.dataV-layout3 {
  width: 100%;
  height: 100%;
  .title {
    // font-size: 16px;
    font-size: calc(100vw * 16 / 1200);
    padding-left: 8%;
    color: #b8c0c8;
  }
  .data {
    text-align: center;
  }
  .time {
    padding-top: 10px;
    // font-size: 18px;
    font-size: calc(100vw * 16 / 1200);
    text-align: center;
  }
}
</style>
