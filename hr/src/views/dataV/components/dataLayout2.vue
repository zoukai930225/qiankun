<template>
  <div class="dataV-layout2" @click="tapItem">
    <div class="border" :class="{ 'border-select': selectIndex === index }">
      <div class="title">{{ data.title }}</div>
      <div class="data" :style="{ 'font-size': valueTitleSize }"> {{ middleValue }}</div>
      <div class="time"> {{ data.subTitle }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
import { priceShowFormat } from '@/utils/formatter'

const props = defineProps({
  data: propTypes.object.def({}), // 数据
  index: propTypes.number.def(0), // 当前索引
  selectIndex: propTypes.number.def(0) // 选中索引
})

const index = computed(() => {
  return props.index
})
const selectIndex = computed(() => {
  return props.selectIndex
})
// 值标题大小
const valueTitleSize = computed(() => {
  return 'calc(100vw * 40 / 1200)'
  // if (props.index === props.selectIndex) {
  //   return 'calc(100vw * 50 / 1200)'
  // } else {
  //   return 'calc(100vw * 40 / 1200)'
  // }
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

const emit = defineEmits(['tapItem'])

const tapItem = () => {
  // emit('tapItem', props.index)
}
</script>

<style lang="scss" scoped>
.dataV-layout2 {
  width: 100%;
  height: 100%;
  .border {
    margin-left: 12%;
    margin-right: 12%;
    .title {
      // font-size: 16px;
      font-size: calc(100vw * 16 / 1200);
      padding-left: 15px;
      padding-top: 10px;
      color: #b8c0c8;
    }
    .data {
      padding-top: 20%;
      // font-size: 40px;
      color: #5a87f7;
      text-align: center;
    }
    .time {
      padding-top: 20px;
      margin-bottom: 30px;
      // font-size: 18px;
      font-size: calc(100vw * 16 / 1200);
      color: #5b80e2;
      text-align: center;
    }
  }
  .border-select {
    // border-radius: 6px;
    // border: 1px solid #4563ab;
  }
}
</style>
