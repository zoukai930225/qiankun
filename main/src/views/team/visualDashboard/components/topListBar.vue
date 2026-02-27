<!-- filepath: /Users/yachaozhang/Desktop/淘宝&learn/platform-front/src/views/team/visualDashboard/components/TopListBar.vue -->
<template>
  <div class="top-list-bar">
    <button class="scroll-btn left" v-show="showLeft" @click="scrollLeft">‹</button>
    <div class="top-list-scroll" ref="topListScroll" @scroll="checkScroll">
      <draggable
        :list="topList"
        :group="{
          name: `tasks-${processNode?.split(',').join('-') || 'default'}`,
          pull: 'clone',
          put: false
        }"
        :clone="cloneTask"
        item-key="id"
        class="top-list"
        :sort="false"
        :chosenClass="'cell-chosen'"
        :ghostClass="'cell-hover-ghost'"
      >
        <template #item="{ element }">
          <div>
            <el-popover placement="right" :width="370" trigger="click">
              <template #reference>
                <ListItem :task="element" :isTop="true" />
              </template>
              <ItemHover
                :task="element"
                @handle-edit="handleEdit"
                beizhu="tag"
                :processNode="processNode"
              />
            </el-popover>
          </div>
        </template>
      </draggable>
    </div>
    <button class="scroll-btn right" v-show="showRight" @click="scrollRight">›</button>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref } from 'vue'
import draggable from 'vuedraggable'
import ListItem from './item.vue'
import ItemHover from './ItemHover.vue'

const props = defineProps<{
  topList: any[]
  processNode?: string // 添加流程节点标识
}>()

const emit = defineEmits<{
  (e: 'handleEdit', id: string): void
}>()

const topListScroll = ref<HTMLElement>()
const showLeft = ref(false)
const showRight = ref(false)

const handleEdit = (id: string) => {
  emit('handleEdit', id)
}

// 克隆任务时添加来源标记
const cloneTask = (task: any) => {
  return {
    ...task,
    fromTopList: true,
    processNode: props.processNode,
    sourceType: 'topList'
  }
}

const checkScroll = () => {
  const el = topListScroll.value
  if (!el) return
  showLeft.value = el.scrollLeft > 0
  showRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth
}

const scrollLeft = () => {
  const el = topListScroll.value
  if (el) {
    el.scrollBy({ left: -300, behavior: 'smooth' })
    setTimeout(checkScroll, 300)
  }
}

const scrollRight = () => {
  const el = topListScroll.value
  if (el) {
    el.scrollBy({ left: 300, behavior: 'smooth' })
    setTimeout(checkScroll, 300)
  }
}

onMounted(() => {
  nextTick(() => {
    checkScroll()
  })
})
</script>

<style scoped lang="scss">
.top-list-bar {
  display: flex;
  align-items: center;
  width: 100%;
}

.scroll-btn {
  width: 32px;
  height: 40px;
  background: #f0f2f5;
  border: none;
  border-radius: 4px;
  font-size: 22px;
  color: #666;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #e0e3ea;
  }
}

.top-list-scroll {
  flex: 1;
  overflow-x: auto;
  white-space: nowrap;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
  // margin-bottom: 20px;
}

.top-list-scroll::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}

.top-list {
  display: flex;
  flex-direction: row;
  gap: 8px;
}

.cell-hover-ghost {
  opacity: 0.3;
}
</style>
