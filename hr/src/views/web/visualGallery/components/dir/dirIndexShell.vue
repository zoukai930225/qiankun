<template>
  <div class="h-720px">
    <component
      v-if="showCollection"
      :is="content"
      :dir="activeDir"
      :is-good="isGood"
      :type="props.type"
    />
    <Dir
      v-else
      :dirs="localDirs"
      v-model:selectedIndex="selectedDirIndex"
      @open="handleOpen"
      @remove="handleRemove"
    />
  </div>
</template>
<script lang="tsx" setup>
import { ref, watch, computed, nextTick, inject } from 'vue'
import { ElButton, ElIcon } from 'element-plus'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import Dir from './dir.vue'
import * as GalleryApi from '@/api/gallery'
import { useMessage } from '@/hooks/web/useMessage'

const getList = inject<() => void>('getList')

const props = withDefaults(
  defineProps<{
    dirs: any[]
    isGood?: string
    content: any
    type?: 1 | 2
  }>(),
  {
    dirs: () => [],
    isGood: '0'
  }
)

const message = useMessage()

const showCollection = ref(false)
const activeDir = ref<any>(null)
const activeIndex = ref<number>(-1)
const localDirs = ref<any[]>(Array.isArray(props.dirs) ? [...props.dirs] : [])
const selectedDirIndex = ref<number | null>(null)
let forceHeaderRerender: null | (() => void) = null
let pendingHeaderRerender = false
const hasVisitedContent = ref(false)
const lastVisitedDir = ref<any>(null)
const lastVisitedIndex = ref<number>(-1)

// 统一的目录匹配与索引解析
const eqDefined = (x: any, y: any) => x !== undefined && y !== undefined && x === y
const isSameDir = (a: any, b: any) =>
  a === b ||
  eqDefined(a?.id, b?.id) ||
  eqDefined(a?.key, b?.key) ||
  eqDefined(a?.date, b?.date) ||
  eqDefined(a?.name, b?.name) ||
  eqDefined(a?.label, b?.label)
const findDirIndex = (dir: any): number => localDirs.value.findIndex((d) => isSameDir(d, dir))

// 当前索引：基于 activeDir 实时解析，避免因索引不同步导致按钮状态错误
const currentIndex = computed(() => {
  if (!showCollection.value || !activeDir.value) return -1
  const idx = findDirIndex(activeDir.value)
  return idx >= 0 ? idx : activeIndex.value
})

watch(
  () => props.dirs,
  (v) => {
    localDirs.value = Array.isArray(v) ? [...v] : []
  },
  { immediate: true }
)

const handleOpen = (dir: any, index?: number) => {
  let idx = typeof index === 'number' ? index : findDirIndex(dir)
  if (idx < 0) idx = 0
  activeIndex.value = idx
  lastVisitedIndex.value = idx
  const resolved = localDirs.value[idx] || dir
  activeDir.value = resolved
  showCollection.value = true
  hasVisitedContent.value = true
  lastVisitedDir.value = resolved
  selectedDirIndex.value = idx
  nextTick(() => {
    if (forceHeaderRerender) forceHeaderRerender()
    else pendingHeaderRerender = true
  })
}

const handleRemove = async (dir: any, index: number) => {
  try {
    await message.delConfirm(`确认删除日期 ${dir?.label || dir?.name || dir?.date || ''}的数据吗？`)
    const collectDate = dir?.label || dir?.name || dir?.date
    await GalleryApi.deleteDate({ type: props.type, collectDate })
    localDirs.value.splice(index, 1)
    message.success('删除成功')
    setTimeout(() => {
      getList?.()
    }, 500)
  } catch {}
}

// header 按钮可用性
const canPrev = computed(() => {
  if (!localDirs.value.length) return false
  return showCollection.value
})
const canNext = computed(() => {
  if (!localDirs.value.length) return false
  if (!showCollection.value) return hasVisitedContent.value
  return false
})
const handlePrev = () => {
  if (!canPrev.value) return
  // 在内容层：左键返回上层
  showCollection.value = false
  activeDir.value = null
  activeIndex.value = -1
  nextTick(() => {
    if (forceHeaderRerender) forceHeaderRerender()
    else pendingHeaderRerender = true
  })
}
const handleNext = () => {
  if (!localDirs.value.length) return
  if (showCollection.value) return
  if (!hasVisitedContent.value) return
  let idx = findDirIndex(lastVisitedDir.value)
  if (idx < 0)
    idx =
      lastVisitedIndex.value >= 0 ? Math.min(lastVisitedIndex.value, localDirs.value.length - 1) : 0
  const target = localDirs.value[idx] || localDirs.value[0]
  handleOpen(target, idx)
}

watch(
  [activeIndex, () => localDirs.value.length, showCollection, currentIndex, hasVisitedContent],
  () => {
    if (forceHeaderRerender) forceHeaderRerender()
    else pendingHeaderRerender = true
  }
)

const resolveHeaderTitle = () => {
  if (props.type === 1) return '个人收藏'
  if (props.type === 2) return '公共收藏'
  return props.isGood === '1' ? '优质图库' : '待提升图库'
}

const renderHeader = (helpers?: { rerender?: () => void }) => {
  forceHeaderRerender = helpers?.rerender || null
  if (pendingHeaderRerender && forceHeaderRerender) {
    // 清掉一次性待重渲标记，拉起一次重渲以同步按钮可用性
    pendingHeaderRerender = false
    nextTick(() => forceHeaderRerender && forceHeaderRerender())
  }
  const title = resolveHeaderTitle()
  console.log('renderHeader', forceHeaderRerender, canPrev.value, canNext.value)
  return (
    <div style={{ display: 'flex', alignItems: 'baseline' }}>
      <span>{title}</span>
      <span style={{ marginLeft: '8px' }}>
        <ElButton
          class="header-nav-btn"
          style={{ padding: '0px' }}
          text={true}
          circle={true}
          disabled={!canPrev.value}
          onClick={handlePrev}
        >
          <ElIcon size={18}>
            <ArrowLeft />
          </ElIcon>
        </ElButton>
        <ElButton
          class="header-nav-btn"
          style={{ padding: '0px', marginLeft: '0' }}
          text={true}
          circle={true}
          disabled={!canNext.value}
          onClick={handleNext}
        >
          <ElIcon size={18}>
            <ArrowRight />
          </ElIcon>
        </ElButton>
      </span>
    </div>
  )
}

// footer 渲染：进入文件夹后仅显示“返回”按钮
const handleBack = () => {
  showCollection.value = false
  activeDir.value = null
  activeIndex.value = -1
  nextTick(() => {
    forceHeaderRerender?.()
  })
}
const renderFooter = () => {
  return (
    <div style={{ pointerEvents: 'auto' }}>
      {showCollection.value ? (
        <ElButton type="primary" onClick={handleBack}>
          返回
        </ElButton>
      ) : null}
    </div>
  )
}
// 暴露给 useDialog 使用
// @ts-ignore
defineExpose({ renderFooter, renderHeader })
</script>
<style scoped lang="scss">
.header-nav-btn {
  color: #666 !important; // 可点击：稍深
}

.header-nav-btn.is-disabled,
.header-nav-btn.is-disabled:hover,
.header-nav-btn.is-disabled:focus {
  color: #bbb !important; // 不可点击：稍浅
}
</style>
