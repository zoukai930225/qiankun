<template>
  <div class="form-description-item" :style="itemStyle">
    <div class="form-desc-label" :style="{ width: contextLabelWidth, ...labelStyle }">
      <slot name="label">{{ label }}</slot>
    </div>

    <div class="form-desc-content" :style="contentStyle">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { inject, computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  span: {
    type: Number,
    default: 1
  },
  contentStyle: {
    type: Object,
    default: () => ({
      alignItems: 'center'
    })
  },
  labelStyle: {
    type: Object,
    default: () => ({})
  }
})

const context = inject('descriptionsContext')
const column = context?.column.value || 3
const contextLabelWidth = context?.labelWidth.value || '120px'

const itemStyle = computed(() => {
  // 计算宽度百分比
  // 例如：3列模式下，span=1 是 33.333%，span=2 是 66.666%
  const widthPercentage = (props.span / column) * 100

  return {
    width: `${widthPercentage}%`
  }
})

const labelStyle = computed(() => {
  return {
    ...props.labelStyle
  }
})

const contentStyle = computed(() => {
  return {
    ...props.contentStyle
  }
})
</script>

<style scoped lang="scss">
.form-description-item {
  display: flex;
  box-sizing: border-box;
  // 模拟表格边框：每个单元格画 右边 和 下边
  border-right: 1px solid #e5e5e5;
  border-bottom: 1px solid #e5e5e5;

  // 继承自 .el-descriptions__cell 的样式
  color: #333333;
  font-size: 14px;
  font-weight: normal;

  .form-desc-label {
    flex-shrink: 0; // 防止label被挤压
    box-sizing: border-box;
    padding: 12px 10px;

    // 你的自定义样式：.el-descriptions__label
    background-color: #f4f6fa;
    color: #666666 !important;
    font-size: 14px;
    font-weight: normal;
    display: flex;
    align-items: center; // vertical-align: middle 的 flex 替代

    // 模拟表格边框：Label 和 Content 之间需要一条线
    border-right: 1px solid #e5e5e5;
  }

  .form-desc-content {
    flex-grow: 1;
    box-sizing: border-box;
    padding: 12px 10px;
    display: flex;
    // align-items: center;

    // 你的自定义样式：.el-descriptions__content
    word-break: break-all;
    overflow-wrap: anywhere;
    white-space: normal;
    color: #333333;
  }
}
</style>
