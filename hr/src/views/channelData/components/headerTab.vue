<template>
  <div class="headerTab">
    <div
      class="headerTab-item"
      v-for="(value, index1) in list"
      :key="index1"
      @click="selectTab(index1)"
    >
      <div class="top">
        <div class="top-dot"></div>
        <div class="top-text" :style="{ color: index === index1 ? '#0064FF' : '#666666' }">{{
          value
        }}</div>
      </div>
      <div v-if="index === index1" class="bottom"></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'

defineProps({
  index: propTypes.number.def(0),
  list: propTypes.array.def([])
})

const selectTab = (index) => {
  emit('headerTabSelect', index)
}

const emit = defineEmits(['headerTabSelect']) // 定义 success 事件，用于操作成功后的回调
</script>

<style lang="scss" scoped>
.headerTab {
  margin-left: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  &-item {
    font-size: 14px;
    color: #666666;
    line-height: 20px;
    display: flex;
    flex-direction: column;
    margin-right: 28px;
    cursor: pointer;
    align-items: center;
    height: 50px;
    .top {
      margin-top: 16px;
      display: flex;
      flex-direction: row;
      align-items: center;
      &-dot {
        margin-right: 12px;
        width: 4px;
        height: 4px;
        border-radius: 4px;
        background: #0064ff;
      }
      &-text {
      }
    }
    .bottom {
      margin-top: auto;
      width: calc(100% - 34px);
      margin-left: 12px;
      height: 4px;
      background: #0064ff;
      border-radius: 4px 4px 0px 0px;
    }
  }
}
</style>
