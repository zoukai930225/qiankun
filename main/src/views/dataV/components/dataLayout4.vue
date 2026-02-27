<template>
  <div class="dataV-layout3">
    <div class="title">{{ data.title }}</div>
    <div
      class="data"
      :style="{
        color: titleColor,
        'font-size': valueTitleSize,
        'padding-top': valueTitlePaddingTop
      }"
    >
      {{ middleValue }}</div
    >
    <!-- <div class="time" :style="{ color: subTitleColor }">{{ data.subTitle }} </div> -->
  </div>
</template>

<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'

const props = defineProps({
  row: propTypes.number.def(0), // 行数
  innerIndex: propTypes.number.def(0), // 内部索引
  data: propTypes.object.def({}) // 数据
})

// 标题颜色
const titleColor = computed(() => {
  return props.data.titleColor || '#55C348'
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
  if (props.row === 5) {
    return '5%'
  } else if (props.row >= 6) {
    return '4%'
  }
  if (props.innerIndex === 0) {
    return '8%'
  } else if (props.innerIndex === 1) {
    return '7%'
  } else if (props.innerIndex === 2) {
    return '6%'
  }
  return '6%'
})
</script>

<style lang="scss" scoped>
.dataV-layout3 {
  width: 100%;
  height: 100%;
  // background: red;
  .title {
    font-size: calc(100vw * 14 / 1200);
    padding-left: 8%;
    // color: #757f89;
    color: #ffffff;
  }
  .data {
    font-weight: 600;
    text-align: center;
  }
  .time {
    padding-top: 10px;
    // font-size: 18px;
    font-size: calc(100vw * 14 / 1200);
    text-align: center;
  }
}
</style>
