<template>
  <el-scrollbar ref="scrollRef" :max-height="maxViewHeight">
    <div ref="prePart">
      <slot name="prePart"></slot>
    </div>
    <slot></slot>
  </el-scrollbar>
</template>
<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ScrollbarInstance } from 'element-plus'

declare global {
  interface HTMLElement {
    _stickyTop: ReturnType<typeof ref>
    _stickyClearTimeId: NodeJS.Timeout
    _stickyResize: ResizeObserver
    _stickySearchFormResize: ResizeObserver
    _stickyTableHeaderResize: ResizeObserver
    _stickyHandleResize: () => void
  }
}

const props = defineProps<{
  maxViewHeight: number
  thresholdValue?: number
}>()

const emit = defineEmits<{
  (e: 'update:maxViewHeight', v: number): void
}>()

const scrollRef = ref<ScrollbarInstance | null>(null)
const originTop = ref(0)
const prePart = ref<HTMLElement>()

const getDoms = () => {
  const wrapDom = scrollRef.value?.wrapRef as HTMLElement | null
  const tHeader = wrapDom?.querySelector('.el-table__header-wrapper') as HTMLElement | null
  const tBody = wrapDom?.querySelector('.el-table__body-wrapper') as HTMLElement | null
  return { el: wrapDom, tHeader, tBody }
}

const setStyle = (el: HTMLElement) => {
  const { tHeader, tBody } = getDoms()
  const top = getPrepartHeight()
  if (tHeader?.getBoundingClientRect().top) {
    originTop.value = originTop.value || tHeader.getBoundingClientRect().top - top
  }
  if (!tHeader || !tBody || !top) return
  const headerStyles: Partial<CSSStyleDeclaration> = {
    position: 'fixed',
    top: tHeader.getBoundingClientRect().top + 'px',
    zIndex: 'calc(var(--el-table-index) + 5)',
    width: `${tBody.offsetWidth}px`
  }
  Object.assign(tHeader.style, headerStyles)

  Object.assign(prePart.value!.style, { width: `${tBody.offsetWidth}px` })

  const parentEl = el.parentNode as HTMLElement | null
  if (parentEl) {
    Object.assign(parentEl.style, {
      marginRight: '8px',
      boxSizing: 'border-box'
    } as Partial<CSSStyleDeclaration>)
  }

  const searchFormStyles = {
    position: 'fixed',
    top: prePart.value!.getBoundingClientRect().top + 'px',
    zIndex: '999',
    width: `${tBody.offsetWidth}px`,
    background: '#fff'
  }

  Object.assign(prePart.value!.style, searchFormStyles)

  Object.assign(tBody.style, {
    marginTop: `${tHeader.offsetHeight + top}px`
  } as Partial<CSSStyleDeclaration>)
}

function getPrepartHeight() {
  if (prePart.value) {
    return prePart.value.offsetHeight
  } else {
    return 0
  }
}

const tableSticky = (el: HTMLElement) => {
  if (el._stickyResize) el._stickyResize.disconnect()
  if (el._stickySearchFormResize) el._stickySearchFormResize.disconnect()

  const resize = new ResizeObserver((entries) => {
    for (const _ of entries) setStyle(el)
  })
  resize.observe(el)
  el._stickyResize = resize

  const { tHeader, tBody } = getDoms()
  if (prePart.value) {
    const prePartResize = new ResizeObserver((entries) => {
      for (const _ of entries) {
        const searchHeight = getPrepartHeight()
        if (!tHeader || !tBody) return
        const headerStyles: Partial<CSSStyleDeclaration> = {
          top: `${originTop.value + searchHeight}px`,
          width: `${tBody.offsetWidth}px`
        }
        Object.assign(tHeader.style, headerStyles)

        if (window.getComputedStyle(tHeader).position === 'fixed') {
          Object.assign(tBody.style, { marginTop: tHeader.offsetHeight + searchHeight + 'px' })
        }
      }
    })
    prePartResize.observe(prePart.value)
    el._stickySearchFormResize = prePartResize
  }

  const headerResize = new ResizeObserver((entries) => {
    for (const _ of entries) {
      const searchHeight = getPrepartHeight()
      if (!tHeader || !tBody) return
      if (window.getComputedStyle(tHeader).position === 'fixed') {
        Object.assign(tBody.style, { marginTop: tHeader.offsetHeight + searchHeight + 'px' })
      }
    }
  })
  headerResize?.observe(tHeader!)
}

onMounted(() => {
  const el = scrollRef.value?.wrapRef as HTMLElement | null
  if (!el) return

  Object.assign(el.style, { marginRight: '-8px', paddingRight: '8px' })
  const random = parseInt(Math.random() * 10 + '', 10)

  el._stickyClearTimeId = setTimeout(() => {
    tableSticky(el)
  }, 1000 + random)
})

onUnmounted(() => {
  const el = scrollRef.value?.wrapRef as any
  if (!el) return

  if (el._stickyClearTimeId) clearTimeout(el._stickyClearTimeId)
  if (el._stickyResize) el._stickyResize.disconnect()
  if (el._stickySearchFormResize) el._stickySearchFormResize.disconnect()

  delete el._stickyClearTimeId
  delete el._stickyResize
  delete el._stickySearchFormResize
})
</script>
<style lang="less" scoped>
:deep(.el-scrollbar__bar) {
  z-index: 999;
}

.table-box__prepart {
  &::after {
    content: '';
    display: block;
    height: 1px;
    width: 100%;
    background-color: #fff;
    margin-bottom: -1px; // 消除缝隙
  }

  &::before {
    // 清除loading时上部的缝隙
    content: '';
    display: block;
    height: 1px;
    width: 100%;
    background-color: #fff;
    margin-top: 1px;
  }
}

.table-box__prepart {
  &::after {
    content: '';
    display: block;
    height: 1px;
    width: 100%;
    background-color: #fff;
    margin-bottom: -1px; // 消除缝隙
  }

  &::before {
    // 清除loading时上部的缝隙
    content: '';
    display: block;
    height: 1px;
    width: 100%;
    background-color: #fff;
    margin-top: 1px;
  }
}
</style>
