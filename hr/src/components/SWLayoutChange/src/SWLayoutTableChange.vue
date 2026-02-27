<template>
  <div class="swLayoutChange">
    <div class="filterBg">
      <div
        class="filterBg-table"
        :style="{ background: layoutMode === 1 ? '#ffffff' : '' }"
        @click="clickFilterMode(1)"
      >
        <img v-if="layoutMode === 0" class="icon" src="@/assets/imgs/common/layout_table.svg" />
        <img
          v-if="layoutMode === 1"
          class="icon"
          src="@/assets/imgs/common/layout_table_actived.svg"
        />
        <div class="title" :style="{ color: layoutMode === 1 ? '#0064FF' : '#666666' }">表格</div>
      </div>
      <div
        class="filterBg-list"
        :style="{ background: layoutMode === 0 ? '#ffffff' : '' }"
        @click="clickFilterMode(0)"
      >
        <img
          v-if="layoutMode === 0"
          class="icon"
          src="@/assets/imgs/common/layout_chart_actived.svg"
        />
        <img v-if="layoutMode === 1" class="icon" src="@/assets/imgs/common/layout_chart.svg" />

        <div class="title" :style="{ color: layoutMode === 0 ? '#0064FF' : '#666666' }">折线图</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'

const props = defineProps({
  layoutMode: propTypes.number.def(1)
})

// 点击筛选模块
const clickFilterMode = (mode: number) => {
  emit('layoutModeChange', mode)
}

const emit = defineEmits(['layoutModeChange'])
</script>

<style lang="scss" scoped>
.swLayoutChange {
  .filterBg {
    margin-left: auto;
    width: 152px;
    height: 32px;
    background: #f1f2f5;
    border-radius: 20px;
    display: flex;
    flex-direction: row;
    &-list {
      margin-right: 2px;
      margin-top: 2px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      width: 74px;
      height: 28px;
      border-radius: 20px;
      align-items: center;
      cursor: pointer;

      .icon {
        width: 10px;
        height: 10px;
      }
      .title {
        padding-left: 8px;
        font-size: 14px;
        color: #0064ff;
        line-height: 14px;
      }
    }
    &-table {
      margin-left: 2px;
      margin-top: 2px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      cursor: pointer;
      width: 74px;
      height: 28px;
      border-radius: 20px;
      align-items: center;
      .icon {
        width: 10px;
        height: 10px;
      }
      .title {
        padding-left: 8px;
        font-size: 14px;
        color: #666666;
        line-height: 14px;
      }
    }
  }
}
</style>
