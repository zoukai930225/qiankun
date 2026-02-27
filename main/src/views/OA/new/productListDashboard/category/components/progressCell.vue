<template>
  <div class="progress-cell" :key="customeKey">
    <div class="animated-bar" :style="getAnimatedStyle(progress)" />
    <div class="progress-text">
      <slot></slot>
      <!-- <div>进度：</div>
      <div :style="`color: ${(row.productDesignPhaseProgress || 0) < 1 ? '#0064FF' : '#349B34'}`">{{
        Math.floor((row.productDesignPhaseProgress || 0) * 100) + '%'
      }}</div>
      <div style="margin-left: 5px">耗时：</div>
      <div
        :style="`color: ${(row.productDesignPhaseCostDays || 0) > (row.productDesignPhaseExpectedDays || 0) ? '#EB3737' : ''}`"
        >{{ row.productDesignPhaseCostDays || 0 }}</div
      >
      <div>/</div>
      <div>{{ (row.productDesignPhaseExpectedDays || 0) + '天' }}</div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  // row: {
  //   type: Object,
  //   default: () => {}
  // },
  customeKey: {
    type: String,
    default: 'id'
  },
  progress: {
    type: Number,
    default: 0
  }
})

const getAnimatedStyle = (progress) => {
  const percentage = progress <= 1 ? Math.floor(progress * 100) : 100
  let color

  // // 根据分数设置不同颜色
  if (percentage < 100) color = 'rgba(235, 55, 55, 0.1)'
  else color = '#EBF5EB'

  return {
    '--target-width': `${percentage}%`,
    backgroundColor: color
  }
}
</script>

<style scoped lang="scss">
.progress-cell {
  position: relative;
  height: 100%;
}

.animated-bar {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  animation: expandWidth 1.5s ease-in-out forwards;
}

.progress-text {
  position: relative;
  z-index: 2;
  font-size: 14px;
  color: #333333;
  min-width: 190px;
  padding: 10px 6px;
  display: flex;
  align-items: center;
}

@keyframes expandWidth {
  from {
    width: 0;
    opacity: 0.5;
  }
  to {
    width: var(--target-width, 0%);
    opacity: 1;
  }
}
</style>
