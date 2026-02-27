<template>
  <div class="dataV-layout1">
    <div class="title">{{ data.title }}</div>
    <div class="data"> {{ middleValue }}</div>
    <div class="time"> {{ data.subTitle }}</div>
  </div>
</template>

<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
import { priceShowFormat } from '@/utils/formatter'

const props = defineProps({
  data: propTypes.object.def({}) // 数据
})

// 中间值
const middleValue = computed(() => {
  if (props.data.value && props.data.symbol) {
    return priceShowFormat(props.data.value)
  }
  if (props.data.value && props.data.rate) {
    if (Number(props.data.value)) {
      return `${Number(props.data.value).toFixed(2)}%`
    } else {
      return props.data.value
    }
  }
  return props.data.value
})
</script>

<style lang="scss" scoped>
.dataV-layout1 {
  width: 100%;
  height: 100%;
  .title {
    // font-size: 16px;
    font-size: calc(100vw * 16 / 1200);
    padding-left: 15%;

    color: #b8c0c8;
  }
  .data {
    padding-top: 20%;
    font-size: calc(100vw * 40 / 1200);
    color: #be5048;
    text-align: center;
  }
  .time {
    padding-top: 20px;
    font-size: calc(100vw * 16 / 1200);
    color: #b9514a;
    text-align: center;
  }
}
</style>
