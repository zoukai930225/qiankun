<template>
  <DirIndexShell
    ref="shellRef"
    :dirs="props.dirs"
    :is-good="props.isGood"
    :content="Content"
    :type="props.type"
  />
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import DirIndexShell from '../dirIndexShell.vue'
import Content from './content.vue'
const props = withDefaults(
  defineProps<{
    dirs: any[]
    isGood?: string
    type?: 1 | 2
  }>(),
  {
    dirs: () => [],
    isGood: '0'
  }
)
const shellRef = ref<any>(null)
// 暴露给 useDialog 使用
// @ts-ignore
defineExpose({
  renderHeader: (options?: any) => shellRef.value?.renderHeader?.(options),
  renderFooter: (options?: any) => shellRef.value?.renderFooter?.(options)
})
</script>
<style scoped lang="scss"></style>
