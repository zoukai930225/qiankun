<!--
 * @Date: 2024-11-26 22:57:22
-->
<template>
  <div class="otherStaticSection">
    <div class="otherStaticSection-row">
      <div class="otherStaticSection-row-line" :class="modelType ? 'dark-line' : ''"> </div>
      <div class="otherStaticSection-row-title" :class="modelType ? 'dark-title' : ''">{{
        title
      }}</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
defineProps({
  title: propTypes.string.def(''),
  modelType: propTypes.bool.def(false)
})
</script>

<style lang="scss" scoped>
.otherStaticSection {
  margin-left: 20px;
  padding-top: 20px;
  display: flex;
  flex-direction: row;
  &-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    &-title {
      font-weight: 500;
      font-size: 16px;
      color: #333333;
      line-height: 22px;
    }
    .dark-title {
      color: #ffd7a4;
    }
    &-line {
      width: 5px;
      height: 14px;
      background: #0064ff;
      border-radius: 3px;
      margin-right: 14px;
    }
    .dark-line {
      background: #ffd7a4;
    }
  }
}
</style>
