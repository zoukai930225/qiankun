<template>
  <span class="custom-tag" :style="tagStyle">
    <slot></slot>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// 定义预设主题类型
type TagType = 'success' | 'warning' | 'info' | 'danger' | 'primary'

interface Props {
  /** 预设主题类型 */
  type?: TagType
  /** 自定义文字颜色 (优先级高于 type) */
  color?: string
  /** 自定义背景颜色 (优先级高于 type) */
  bgColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'primary'
})

// 预设颜色配置表
const themeMap: Record<TagType, { color: string; bg: string }> = {
  success: {
    color: '#349B34',
    bg: 'rgba(52, 155, 52, 0.2)'
  },
  warning: {
    color: '#F3AF12',
    bg: '#FFF3D6'
  },
  info: {
    color: '#333333',
    bg: '#E8E8E8'
  },
  danger: {
    color: '#EB3737',
    bg: 'rgba(228, 54, 54, 0.1)'
  },
  primary: {
    color: '#0064FF',
    bg: '#CCE0FF'
  }
}

// 计算最终样式
const tagStyle = computed(() => {
  // 获取当前主题的预设值
  const theme = themeMap[props.type] || themeMap.info

  return {
    color: props.color || theme.color, // 如果传入了 color 属性，则覆盖预设
    backgroundColor: props.bgColor || theme.bg // 如果传入了 bgColor，则覆盖预设
  }
})
</script>

<style scoped>
.custom-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  /* 核心样式需求 */
  font-size: 14px;
  padding: 4px 16px;
  border-radius: 158px;

  /* 防止文字换行，保持胶囊形状 */
  white-space: nowrap;
  line-height: 1.5;
  transition: all 0.2s;
  cursor: default;
}
</style>
