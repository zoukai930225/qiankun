<template>
  <!-- :style="{
      height: isBigScreen ? 'calc(100vh - 90px)' : 'calc(100vh - 225px - 150px)'
    }" -->
  <DynamicScroller
    v-bind="props"
    :height="height"
    :items="items"
    :min-item-size="150"
    ref="scrollRef"
    :key-field="keyField"
  >
    <template v-slot="{ item, index, active }">
      <DynamicScrollerItem :item="item" :active="active" :data-index="index">
        <slot v-bind="{ item, index, active }"></slot>
      </DynamicScrollerItem>
    </template>
  </DynamicScroller>
</template>

<script lang="ts">
export default { name: 'DynamicScroll' }
</script>

<script setup lang="ts">
const props = defineProps({
  // 渲染数组
  items: {
    type: Array,
    default: () => []
  },
  // 最小高度，单位px
  minItemSize: {
    type: Number,
    default: 150
  },
  keyField: {
    type: String,
    default: 'id'
  },
  height: {
    type: String,
    default: ''
  }
})
</script>
