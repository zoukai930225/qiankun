<template>
  <el-card ref="cardRef" shadow="never" class="!border-0 specialCard" :style="cardStyle">
    <div :style="{ paddingBottom: `${footerHeight ?? 0}px` }">
      <slot></slot>
    </div>
    <div
      v-show="showFooter"
      ref="footerRef"
      :style="{ width: `${footerWidth}px`, zIndex: 999 }"
      class="flex items-center justify-end noFixed special-card__footer py-10px"
      :class="{ fixed: isFixed, 'px-20px': isFixed }"
    >
      <div ref="footerContentRef" class="flex-1 flex items-center justify-end">
        <slot name="footer"></slot>
      </div>
    </div>
    <div v-show="!showFooter" class="pb-20px"></div>
  </el-card>
</template>
<script lang="ts" setup>
import { CardInstance } from 'element-plus'

interface Props {
  minHeight?: number
  showFooter?: boolean
  isAutoHeight?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showFooter: true,
  isAutoHeight: false
})

const isFixed = ref(false)
const footerWidth = ref(0)
const cardRef = ref<CardInstance>()
const footerRef = ref()
const footerContentRef = ref()

const viewportWidth = ref<number>(window.innerWidth)
const viewportHeight = ref<number>(window.innerHeight)
const footerHeight = ref<number>(0)
const cardMaxHeight = ref<string>('auto')
const cardInnerHeigh = ref(0)

const cardStyle = computed(() => ({
  maxHeight: cardMaxHeight.value
}))

let resizeTimer: NodeJS.Timeout
const getAutoHeight = () => {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(async () => {
    cardMaxHeight.value = `${window.innerHeight - 115}px`

    await nextTick()
    if (cardRef.value?.$el) {
      const dom = cardRef.value?.$el.querySelector('.el-card__body') as HTMLElement

      cardInnerHeigh.value =
        parseInt(cardMaxHeight.value) -
        parseInt(window.getComputedStyle(dom).paddingTop) -
        parseInt(window.getComputedStyle(dom).paddingBottom)
    }
  }, 500)
}

const handleResize = () => {
  viewportWidth.value = window.innerWidth
  viewportHeight.value = window.innerHeight
  handleViewportChange(viewportWidth.value, viewportHeight.value)
}

const handleViewportChange = (_: number, height: number) => {
  nextTick(() => {
    isFixed.value = height - 95 <= cardRef.value?.$el.offsetHeight
  })
}

let resizeObserver: ResizeObserver | null
onBeforeMount(() => {})

onMounted(() => {
  const cardBody = document.querySelector('.el-card__body')
  resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      footerWidth.value = entry.contentRect.width
      isFixed.value = window.innerHeight - 95 <= cardRef.value?.$el.offsetHeight
      nextTick(() => {
        footerHeight.value = footerRef.value?.offsetHeight
      })
    }
  })
  resizeObserver.observe(cardBody!)

  if (!footerContentRef.value?.offsetHeight) return

  window.addEventListener('resize', handleResize)
  ;(window as any).debouncedResizeHandler = handleResize
  handleResize()

  if (props.isAutoHeight) {
    window.addEventListener('resize', getAutoHeight)
    getAutoHeight()
  }
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }

  const handleResize = (window as any).handleResize
  if (handleResize) {
    window.removeEventListener('resize', handleResize)
  }

  if (props.isAutoHeight) {
    window.removeEventListener('resize', getAutoHeight)
    clearTimeout(resizeTimer)
  }
})

defineExpose({ cardInnerHeigh })
</script>
<style lang="less" scoped>
.noFixed {
  position: absolute;
  bottom: 0;
}

.fixed {
  // width: calc(100% - 310px);
  background-color: #fff;
  box-shadow: 0 0px 20px rgba(0, 0, 0, 0.1);
  position: fixed;
  bottom: 0;
  right: 10px;
  z-index: 2;
}

.specialCard {
  border-radius: 8px;
  :deep(.el-card__body) {
    position: relative;

    padding-bottom: 0;
  }

  :deep(&-title) {
    // display: none;
    display: flex;
    align-items: center;
    line-height: 20px;
    margin-left: -20px;
    margin-right: -20px;
    margin-bottom: 20px;
    padding: 0 20px 16px;
    border-bottom: 1px solid var(--el-card-border-color);

    &::before {
      content: '';
      display: block;
      width: 3px;
      height: 10px;
      margin-right: 6px;
      background-color: #0064ff;
    }
  }
}

:deep(.el-table .el-scrollbar__bar.is-horizontal) {
  z-index: 999;
}

:deep(.el-table__inner-wrapper) {
  &::before {
    display: none;
  }
}

:deep(.el-pagination) {
  margin-top: 0;
  margin-bottom: 0;
}
</style>
