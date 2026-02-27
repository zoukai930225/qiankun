<template>
  <div class="form-descriptions-container">
    <div v-if="title" class="form-descriptions-title">{{ title }}</div>
    <div class="form-descriptions-body" :style="bodyStyle">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { provide, computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  column: {
    type: Number,
    default: 3 // 默认3列
  },
  // 统一控制Label的宽度，保证对齐
  labelWidth: {
    type: String,
    default: '120px'
  }
})

// 将列数和Label宽度注入给子组件
provide('descriptionsContext', {
  column: computed(() => props.column),
  labelWidth: computed(() => props.labelWidth)
})

const bodyStyle = computed(() => {
  return {
    // 模拟表格边框：容器只画 左边 和 上边
    borderLeft: '1px solid #e5e5e5',
    borderTop: '1px solid #e5e5e5'
  }
})
</script>

<style scoped lang="scss">
.form-descriptions-container {
  width: 100%;

  .form-descriptions-title {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 16px;
    color: #303133;
  }

  .form-descriptions-body {
    display: flex;
    flex-wrap: wrap; // 允许换行
    width: 100%;
    box-sizing: border-box;
  }
}
</style>
