<template>
  <el-scrollbar>
    <ul v-if="dirs.length" class="dir-list">
      <li
        v-for="(item, index) in dirs"
        :key="item?.id || item?.key || item?.date || item?.name || index"
        :class="['dir-item', { selected: currentSelectedIndex === index }]"
        @click="onSelect(index)"
        @dblclick="onOpen(item, index)"
      >
        <div class="img">
          <el-image :src="DirIcon" />
        </div>
        <div v-if="item.closeable" class="close-icon" @click.stop="onRemove(item, index)">
          <el-image class="w-28px h-28px" :src="CloseIcon" />
        </div>
        <h3
          class="text-center text-#333 text-16px mt-16px overflow-hidden text-ellipsis whitespace-nowrap text"
          >{{ getDirLabel(item) }}</h3
        >
      </li>
    </ul>
    <Empty v-else />
  </el-scrollbar>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue'
import DirIcon from '@/assets/svgs/visualCenter/dir.svg'
import CloseIcon from '@/assets/svgs/visualCenter/dir_close.svg'
import Empty from '@/components/SWTable/src/empty.vue'
const props = defineProps<{
  dirs: any[]
  selectedIndex?: number | null
}>()
const emit = defineEmits<{
  (e: 'open', dir: any, index: number): void
  (e: 'remove', dir: any, index: number): void
  (e: 'update:selectedIndex', value: number | null): void
}>()
const currentSelectedIndex = ref<number | null>(props.selectedIndex ?? null)
watch(
  () => props.selectedIndex,
  (v) => {
    currentSelectedIndex.value = v ?? null
  }
)
const onSelect = (index: number) => {
  currentSelectedIndex.value = index
  emit('update:selectedIndex', index)
}
const onOpen = (dir: any, index: number) => {
  emit('open', dir, index)
}
const onRemove = (dir: any, index: number) => {
  emit('remove', dir, index)
}
const getDirLabel = (dir: any) => {
  if (typeof dir === 'string' || typeof dir === 'number') return String(dir)
  return dir?.name || dir?.title || dir?.label || dir?.date || '未命名'
}
</script>
<style scoped lang="scss">
* {
  box-sizing: border-box;
}
.dir-list {
  display: flex;
  flex-wrap: wrap;
  padding: 10px 20px;
  // row-gap: 30px;
  // column-gap: 40px;
  gap: 20px;
  .dir-item {
    position: relative;
    cursor: pointer;
    background-color: #fff;
    .img {
      padding: 10px;
      border-radius: 10px;
    }
    .text {
      margin-top: 4px;
      height: 30px;
      padding: 5px 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #333;
      font-size: 16px;
      border-radius: 6px;
    }
    &.selected {
      .img,
      .text {
        background: rgba(230, 230, 230, 0.6);
      }
    }
    .close-icon {
      position: absolute;
      top: 6.5px;
      left: 0px;
      cursor: pointer;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s ease-in-out;
    }
    &:hover .close-icon {
      opacity: 1;
      pointer-events: auto;
    }
  }
}
</style>
