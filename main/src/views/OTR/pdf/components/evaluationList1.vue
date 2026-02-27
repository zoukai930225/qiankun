<template>
  <div class="evaluationList">
    <div class="item" v-for="(value, index) in list" :key="index">
      <div class="item-dot" :style="{ background: dotColor }"></div>
      <div class="item-value" :style="{ color: color }">{{ value }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'

defineProps({
  list: propTypes.array.def([]),
  color: propTypes.string.def(''),
  dotColor: propTypes.string.def('')
})
onMounted(() => { })
</script>

<style lang="scss" scoped>
.evaluationList {
  display: flex;
  flex-direction: column;

  .item {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 7px;

    &-dot {
      width: 5px;
      height: 5px;
      background: #0098f3;

      margin-right: 6px;
    }

    &-value {
      width: calc(100% - 11px);
      font-weight: 400;
      font-size: 12px;
      color: #232323;
      line-height: 17px;
    }
  }
}
</style>
