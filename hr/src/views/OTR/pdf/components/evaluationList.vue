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
onMounted(() => {})
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
      width: 4px;
      height: 4px;
      background: #004aff;
      border-radius: 4px;
      margin-right: 5px;
    }

    &-value {
      width: calc(100% - 9px);
      font-size: 11px;
      color: #232323;
      line-height: 17px;
    }
  }
}
</style>
