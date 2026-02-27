<template>
  <el-tooltip v-bind="tooltipBindings" :content="finalTooltipContent" :disabled="computedDisabled">
    <template v-if="$slots.content" #content>
      <slot name="content"></slot>
    </template>

    <component :is="tag" ref="textRef" :class="contentClass" :style="lineClampStyle">
      <slot>{{ parsedContent }}</slot>
    </component>
  </el-tooltip>
</template>

<script lang="ts" setup>
// 对于复杂嵌套，CSS 的 text-overflow: ellipsis 只有在内部元素是 inline
//  或者样式配合得当时才会生效。如果是块级元素，建议在外部样式控制一下 display。
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, watch } from 'vue'
import type { Placement } from 'element-plus'
import * as emoji from 'node-emoji'

const props = withDefaults(
  defineProps<{
    content?: string | number
    disabled?: boolean
    tag?: string
    placement?: Placement
    teleported?: boolean
    popperClass?: string
    maxWidth?: string | number
    tooltipProps?: Record<string, any>
    ellipsisClass?: string | string[] | Record<string, boolean>
    lineClamp?: number
    refreshKey?: string | number | boolean
    enableEmoji?: boolean
  }>(),
  {
    content: '',
    disabled: false,
    tag: 'div',
    placement: 'top',
    teleported: true,
    popperClass: '',
    maxWidth: '',
    tooltipProps: () => ({}),
    ellipsisClass: 'overflow-tooltip__content',
    lineClamp: 1,
    refreshKey: '',
    enableEmoji: true
  }
)

const attrs = useAttrs()
const textRef = ref<HTMLElement | null>(null)
const isOverflow = ref(false)
const tooltipMaxWidth = ref<string>()
// 新增：用于存储从 DOM 中自动提取的文本
const domInnerText = ref('')

const resolvedMaxWidth = computed(() => {
  const { maxWidth } = props
  if (maxWidth !== undefined && maxWidth !== null && maxWidth !== '') {
    return typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth
  }
  return tooltipMaxWidth.value
})

let observer: ResizeObserver | null = null

// 解析 props 中的 emoji
const parsedContent = computed(() => {
  const text = (props.content ?? '').toString()
  if (!props.enableEmoji) return text
  return emoji.emojify(text)
})

// 计算最终展示在 Tooltip 里的文字
// 逻辑：如果传了 props.content，以它为准；否则使用从 DOM 提取的纯文本
const finalTooltipContent = computed(() => {
  if (props.content) {
    const text = props.content.toString()
    return props.enableEmoji ? emoji.emojify(text) : text
  }
  return domInnerText.value
})

const contentClass = computed(() => [
  props.ellipsisClass,
  { 'overflow-tooltip__line-clamp': props.lineClamp > 1 }
])

const lineClampStyle = computed(() =>
  props.lineClamp > 1 ? { '--overflow-tooltip-line-clamp': String(props.lineClamp) } : undefined
)

const tooltipBindings = computed(() => {
  const binding: Record<string, any> = {
    placement: props.placement,
    teleported: props.teleported,
    ...props.tooltipProps,
    ...attrs
  }

  // 合并 popperClass
  const classTokens = [binding.popperClass, props.popperClass, 'overflow-tooltip__popper'].flatMap(
    (item) => (typeof item === 'string' ? item.split(/\s+/).filter(Boolean) : [])
  )
  binding.popperClass = Array.from(new Set(classTokens)).join(' ')

  // 合并 max-width 样式
  if (resolvedMaxWidth.value) {
    if (typeof binding.popperStyle === 'string') {
      const normalized = binding.popperStyle.trim()
      const suffix = normalized && !normalized.endsWith(';') ? ';' : ''
      binding.popperStyle = `${normalized}${suffix}max-width: ${resolvedMaxWidth.value};`
    } else if (
      binding.popperStyle &&
      typeof binding.popperStyle === 'object' &&
      !Array.isArray(binding.popperStyle)
    ) {
      binding.popperStyle = { ...binding.popperStyle, maxWidth: resolvedMaxWidth.value }
    } else {
      binding.popperStyle = { maxWidth: resolvedMaxWidth.value }
    }
  }

  return binding
})

const computedDisabled = computed(() => props.disabled || !isOverflow.value)

// 核心逻辑：测量溢出 + 提取文本
function measureOverflow() {
  const el = textRef.value
  if (!el) return

  // 1. 如果没有传 props.content，则尝试读取 DOM 内容作为 tooltip 文字
  if (!props.content) {
    domInnerText.value = el.innerText || el.textContent || ''
  }

  // 2. 计算宽度基准
  const parentWidth = el.parentElement?.clientWidth ?? el.clientWidth
  tooltipMaxWidth.value = parentWidth ? `${parentWidth}px` : undefined

  // 3. 判断是否溢出
  if (props.lineClamp > 1) {
    isOverflow.value = el.scrollHeight - el.clientHeight > 1
  } else {
    isOverflow.value = el.scrollWidth - el.clientWidth > 1
  }
}

watch(
  () => props.maxWidth,
  (value) => {
    if (!value) nextTick(() => measureOverflow())
  }
)

function setupObserver() {
  const el = textRef.value
  if (!el || typeof ResizeObserver === 'undefined') return
  observer = new ResizeObserver(() => measureOverflow())
  observer.observe(el)
}

onMounted(async () => {
  await nextTick()
  measureOverflow()
  setupObserver()
  window.addEventListener('resize', measureOverflow)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', measureOverflow)
  if (observer) {
    observer.disconnect()
    observer = null
  }
})

watch(
  () => props.content,
  () => nextTick(measureOverflow)
)
watch(
  () => props.refreshKey,
  () => nextTick(measureOverflow)
)
watch(
  () => props.lineClamp,
  () => nextTick(measureOverflow)
)

defineExpose({ refresh: measureOverflow })
</script>

<style scoped>
.overflow-tooltip__content {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  /* 修复方案 1：增加行高，给下伸部留出空间 */
  line-height: 1.5;
}

/* 多行省略样式 */
.overflow-tooltip__line-clamp {
  display: -webkit-box;
  -webkit-line-clamp: var(--overflow-tooltip-line-clamp, 2);
  line-clamp: var(--overflow-tooltip-line-clamp, 2);
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: normal;
  word-break: break-all;
}

:slotted(*) {
  /* 确保插槽内容的宽度受到父级限制，否则 ellipsis 可能失效 */
  max-width: 100%;
  display: inline; /* 或者是 inline-block，取决于具体需求，防止内部 div 撑开 */
}
</style>

<style>
.overflow-tooltip__popper .el-tooltip__content {
  text-align: left;
}
</style>
