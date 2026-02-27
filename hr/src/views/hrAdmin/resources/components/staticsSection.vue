<!--
 * @Date: 2024-11-26 22:57:22
-->
<template>
  <div class="staticsSection">
    <div class="staticsSection-row">
      <div class="staticsSection-row-line" :class="modelType ? 'staticsSection-row-line-dark' : ''">
      </div>
      <div
        class="staticsSection-row-title"
        :class="modelType ? 'staticsSection-row-title-dark' : ''"
        >{{ title }}</div
      >
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
.staticsSection {
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
      line-height: 20px;
    }
    .staticsSection-row-title-dark {
      color: #ffd7a4;
    }
    &-line {
      width: 6px;
      height: 16px;
      background: #0064ff;
      border-radius: 3px;
      margin-right: 14px;
    }
    .staticsSection-row-line-dark {
      background: #ffd7a4;
    }
  }
}
</style>
