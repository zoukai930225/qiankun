<!--
 * @Date: 2024-11-26 22:57:22
-->
<template>
  <div class="dashboardSection">
    <div class="dashboardSection-row">
      <img class="dashboardSection-row-icon" :src="formatIcon" />
      <div class="dashboardSection-row-title" :class="modelType ? 'dark-text' : ''">{{
        title
      }}</div>
    </div>
    <div><slot></slot></div>
  </div>
</template>
<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
const props = defineProps({
  icon: propTypes.any.def(),
  darkIcon: propTypes.any.def(),
  title: propTypes.string.def(''),
  modelType: propTypes.bool.def(false)
})

const formatIcon = computed(() => {
  return props.modelType ? props.darkIcon : props.icon
})
</script>

<style lang="scss" scoped>
.dashboardSection {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  z-index: 99;
  &-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    &-title {
      font-weight: 500;
      font-size: 18px;
      color: #0064ff;
      line-height: 25px;
    }
    .dark-text {
      color: #ffd7a4;
    }
    &-icon {
      width: 16px;
      height: 16px;
      margin-right: 16px;
    }
  }
}
</style>
