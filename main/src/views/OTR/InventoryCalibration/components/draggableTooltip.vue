<template>
  <!-- 虚拟触发元素 -->
  <span
    ref="triggerRef"
    style="display: inline-block"
    @mouseenter="fixed = false"
  >
    <slot></slot>
  </span>
  <el-popover
    v-model:visible="visible"
    ref="tooltipRef"
    :placement="placement"
    popper-class="custom-tooltip"
    effect="light"
    virtual-triggering
    :virtual-ref="triggerRef"
    :show-arrow="!fixed"
    width="600"
    :popper-style="popoverStyle"
    :disabled="disabled"
  >
    <div
      ref="tooltipContentRef"
      class="tooltip-content"
      @click.stop
      @mouseleave="handleMouseOut"
      @mouseenter="handleMouseIn"
    >
      <div class="tooltip-header">
        <div class="tooltip-actions">
          <div @click.stop="openFixed" :class="['flex',fixed ?'fixedBtn':'']">
            <img :src="fixed ? fixedImg : unfixedImg" style="margin-right: 6px" />
            {{ fixed ? '解除窗口固定' : '开启窗口固定' }}
          </div>
        </div>
      </div>
      <div class="tooltip-body">
        <slot name="content"></slot>
      </div>
    </div>
  </el-popover>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useDraggable,useWindowSize } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import { generateUUID } from '@/utils'
import unfixedImg from '@/assets/imgs/otr/InventoryCalibration/unfixed.svg'
import fixedImg from '@/assets/imgs/otr/InventoryCalibration/fixed.svg'

const props = defineProps({
  placement: {
    type: String,
    default: 'bottom'
  },
  // 是否启用拖动功能
  draggable: {
    type: Boolean,
    default: true
  },
  disabled:{
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close', 'fixed-change'])

const tooltipRef = ref(null)
const tooltipContentRef = ref(null)
const triggerRef = ref(null)
const visible = ref(false)
const fixed = ref(false)
const popoverStyle = 'padding:0;background-color:#fff;border:none;box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);border-radius: 4px;'
let leaveTimer = null
// 使用VueUse的useDraggable实现拖动
// const { style: dragStyle, position: dragPosition } = useDraggable(tooltipContentRef, {
//   initialValue: { x: 0, y: 0 },
//   preventDefault: true,
//   stopPropagation: true,
//   onStart() {
//     if (!fixed.value) return false
//     return true
//   },
//   onMove() {
//     ensureInViewport()
//   }
// })

const { width, height } = useWindowSize()
const openFixed = async () => {
  const node = tooltipRef.value.popperRef.contentRef
  if (fixed.value) return
  if (node) {
    fixed.value = true
    await nextTick()
    // 克隆当前节点
    let siblingNode = node.cloneNode(true);
    const uuid = generateUUID()
    siblingNode.id += `_clone_${uuid}`
    siblingNode.setAttribute('class', 'custom-tooltip');
    siblingNode.setAttribute('draggable', true);
    siblingNode.style.cursor = 'move'
    // 将克隆节点添加为当前节点的下一个兄弟节点
    node.parentNode.insertBefore(siblingNode, node.nextSibling);
    closeFixedEvents(siblingNode)
    siblingNode.style.height = siblingNode.getBoundingClientRect().height + 'px'
    const { position: dragPosition } = useDraggable(siblingNode, {
      initialValue: { x: 0, y: 0 },
      preventDefault: true,
      stopPropagation: true,
      onMove(position) {
        if(position.x < 10){
          position.x = 10
        }
        if(position.y < 10){
          position.y = 10
        }
        if(position.x >= width.value - 600 ){
          position.x = width.value - 600 - 10
        }
        if( position.y >= height.value - 460){
          position.y = height.value - 460 - 10
        }
        siblingNode.style.left = `${position.x}px`
        siblingNode.style.top = `${position.y}px`
      }
    })
  }
}

const closeFixedEvents = (node) => {
  node.querySelector('.fixedBtn').addEventListener('click', () => {
    node.remove()
  })
}

const toggleFixed = () => {
  fixed.value = !fixed.value
  emit('fixed-change', fixed.value)

  if (fixed.value) {
    visible.value = true
    nextTick(() => {
      const popper = tooltipRef.value?.popperRef?.contentRef
      if (popper) {
        const rect = popper.getBoundingClientRect()
        dragPosition.value = {
          x: rect.left,
          y: rect.top
        }
        updatePopperPosition()
      }
    })
  } else {
    closeTooltip()
  }
}

const closeTooltip = () => {
  visible.value = false
  fixed.value = false
  emit('close')
}

const updatePopperPosition = () => {
  if (!fixed.value) return

  const popper = tooltipRef.value?.popperRef?.contentRef
  if (popper) {
    popper.style.position = 'fixed'
    popper.style.left = `${dragPosition.value.x}px`
    popper.style.top = `${dragPosition.value.y}px`
    popper.style.margin = '0'
    popper.style.transform = 'none'
    popper.style.cursor = 'move'
  }
}
// 手动关闭 非固定模式
const handleMouseOut = () => {
  if (!fixed.value) {
    closeTooltip()
  }
}
// 鼠标移入 tooltip 里面 不关闭
const handleMouseIn = () => {
  if (leaveTimer) {
    clearTimeout(leaveTimer)
    leaveTimer = null
  }
}
// 点击外部处理
const handleClickOutside = (event) => {
  if (fixed.value) return // 固定状态下不处理

  const popper = tooltipRef.value?.popperRef?.contentRef
  if (popper && !popper.contains(event.target)) {
    visible.value = false
  }
}
// 鼠标移出 延迟关闭
const triggerLeave = () => {
  if (fixed.value) return
  leaveTimer = setTimeout(() => {
    closeTooltip()
  }, 100)
}



// 监听fixed状态变化
// watch(fixed, (newVal) => {
//   if (newVal) {
//     ensureInViewport()
//   }
// })

// 监听拖动位置变化
// watch(dragPosition, () => {
//   if (fixed.value) {
//     updatePopperPosition()
//   }
// })

// 监听窗口大小变化
const handleResize = () => {
  if (fixed.value) {
    ensureInViewport()
  }
}

onMounted(() => {
  // document.addEventListener('click', handleClickOutside)
  // window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  // document.removeEventListener('click', handleClickOutside)
  // window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.tooltip-content {
  min-width: 600px;
  max-width: 600px;
  height: 460px;
  user-select: none;
}

.tooltip-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  height: 36px;
  border-bottom: 1px solid #ebeef5;
  font-weight: 600;
}

.tooltip-actions {
  font-size: 15px;
  line-height: 18px;
  margin: auto;
  cursor: pointer;
}

.tooltip-body {
  padding: 12px;
  cursor: default;
}
</style>

<style>
.custom-tooltip {
  min-width: 600px;
  max-width: 600px;
  height: 460px;
  border: none;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
  background: #fff;
}
.custom-tooltip.fixed-tooltip {
  position: fixed !important;
  z-index: 2999 !important;
  cursor: move;
  .tooltip-body {
    cursor: move;
  }
}
</style>
