<template>
  <div class="overflow-tags" ref="containerRef">
    <div class="visible-tags">
      <template v-for="(item, index) in visibleList" :key="index">
        <slot name="tag" :item="item" :style="computedTagStyle">
          <span :style="computedTagStyle">{{ item }}</span>
        </slot>
      </template>

      <el-popover
        v-if="overflowCount > 0"
        placement="top"
        width="auto"
        trigger="hover"
        popper-class="overflow-tags-popper"
      >
        <template #reference>
          <span class="overflow-count-tag" :style="overflowStyle"> +{{ overflowCount }} </span>
        </template>

        <div class="popover-tags-wrapper">
          <template v-for="(item, index) in hiddenList" :key="index">
            <slot name="tag" :item="item" :style="computedTagStyle">
              <span :style="computedTagStyle">{{ item }}</span>
            </slot>
          </template>
        </div>
      </el-popover>
    </div>

    <div class="shadow-tags" ref="shadowRef" v-if="lines > 0">
      <div v-for="(item, index) in items" :key="index" class="shadow-item">
        <slot name="tag" :item="item" :style="computedTagStyle">
          <span :style="computedTagStyle">{{ item }}</span>
        </slot>
      </div>
      <span class="shadow-overflow-tag" :style="overflowStyle">+99</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick, onBeforeUnmount, type CSSProperties } from 'vue'

const props = defineProps({
  items: {
    type: Array as () => string[] | any[],
    default: () => []
  },
  lines: {
    type: Number,
    default: 1
  },
  overflowStyle: {
    type: Object,
    default: () => ({})
  },
  tagStyle: {
    type: Object,
    default: () => ({})
  }
})

// 默认的基础样式配置
const defaultTagStyle: CSSProperties = {
  fontSize: '12px',
  padding: '3px 8px',
  borderRadius: '4px',
  whiteSpace: 'nowrap',
  display: 'inline-block',
  lineHeight: '1.4',
  backgroundColor: '#e7eaf1',
  color: '#333',
  boxSizing: 'border-box'
}

const computedTagStyle = computed<CSSProperties>(() => {
  return { ...defaultTagStyle, ...props.tagStyle }
})

const containerRef = ref<HTMLElement>()
const shadowRef = ref<HTMLElement>()
const renderIndex = ref(0)

let resizeObserver: ResizeObserver | null = null

const visibleList = computed(() => props.items.slice(0, renderIndex.value))
const hiddenList = computed(() => props.items.slice(renderIndex.value))
const overflowCount = computed(() => props.items.length - renderIndex.value)

const calculate = () => {
  // === 修改重点 ===
  // 如果 lines 为 0，直接展示全部，不进行折叠计算
  if (props.lines === 0) {
    renderIndex.value = props.items.length
    return
  }
  // ===============

  if (!containerRef.value || !shadowRef.value || props.items.length === 0) {
    renderIndex.value = props.items.length
    return
  }

  const containerWidth = containerRef.value.offsetWidth
  if (containerWidth === 0) return
  shadowRef.value.style.width = `${containerWidth}px`

  const shadowItems = Array.from(shadowRef.value.querySelectorAll('.shadow-item')) as HTMLElement[]
  const overflowTag = shadowRef.value.querySelector('.shadow-overflow-tag') as HTMLElement

  if (shadowItems.length === 0) return

  const firstItemHeight = shadowItems[0].offsetHeight
  const gap = 6
  const maxTopAllowed = (props.lines - 1) * (firstItemHeight + gap) + 2

  let splitIndex = props.items.length
  overflowTag.style.display = 'none'

  for (let i = 0; i < shadowItems.length; i++) {
    const item = shadowItems[i]
    if (item.offsetTop > maxTopAllowed) {
      splitIndex = i
      break
    }
  }

  if (splitIndex === props.items.length) {
    renderIndex.value = props.items.length
    return
  }

  overflowTag.style.display = 'inline-flex'

  while (splitIndex > 0) {
    const overflowWidth = overflowTag.offsetWidth
    const containerRight = containerWidth
    const prevItem = shadowItems[splitIndex - 1]
    const prevItemRight = prevItem.offsetLeft + prevItem.offsetWidth

    const isPrevItemInLine = prevItem.offsetTop <= maxTopAllowed
    const hasSpace = prevItemRight + gap + overflowWidth <= containerRight

    if (isPrevItemInLine && hasSpace) {
      break
    } else {
      splitIndex--
    }
  }

  renderIndex.value = Math.max(0, splitIndex)
  overflowTag.style.display = ''
}

watch(
  () => [props.items, props.lines, props.tagStyle],
  () => {
    nextTick(calculate)
  },
  { deep: true }
)

onMounted(() => {
  nextTick(() => {
    calculate()
  })
  if (containerRef.value) {
    resizeObserver = new ResizeObserver(() => {
      window.requestAnimationFrame(() => {
        calculate()
      })
    })
    resizeObserver.observe(containerRef.value)
  }
})

onBeforeUnmount(() => {
  if (resizeObserver) resizeObserver.disconnect()
})
</script>

<style scoped lang="scss">
.overflow-tags {
  width: 100%;
  position: relative;
}

.visible-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  width: 100%;
}

.shadow-tags {
  position: absolute;
  top: 0;
  left: 0;
  visibility: hidden;
  z-index: -100;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  width: 100%;
  opacity: 0;
  pointer-events: none;
}

.overflow-count-tag {
  font-size: 12px;
  padding: 3px 8px;
  border-radius: 4px;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1.4;
  background: #f4f4f5;
  color: #909399;
  cursor: pointer;
  box-sizing: border-box;

  &:hover {
    color: var(--el-color-primary);
    background: var(--el-color-primary-light-9);
  }
}

.shadow-overflow-tag {
  @extend .overflow-count-tag;
}
</style>

<style lang="scss">
.overflow-tags-popper {
  max-width: 400px;
  .popover-tags-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
}
</style>
