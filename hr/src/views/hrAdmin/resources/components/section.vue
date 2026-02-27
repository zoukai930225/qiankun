<template>
  <div class="section">
    <div class="section-row">
      <div class="section-row-line"> </div>
      <div class="section-row-title">{{ title }}</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
defineProps({
  title: propTypes.string.def('')
})
</script>

<style lang="scss" scoped>
.section {
  margin-left: 12px;
  padding-top: 15px;
  display: flex;
  flex-direction: row;
  &-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    &-title {
      font-size: 14px;
      color: #333333;
      line-height: 20px;
    }
    &-line {
      width: 3px;
      height: 10px;
      background: #0064ff;
      margin-right: 6px;
    }
  }
}
</style>
