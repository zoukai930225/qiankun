<!--
 * @Date: 2024-12-04 10:17:38
-->
<template>
  <div>
    <Vue3Menus v-model:open="showMenu" :event="cusEventVal" :menus="menus" hasIcon>
      <template #icon="{ activeIndex }">{{ activeIndex }}</template>
      <template #label="{ menu }"
        ><div @click="itemClick(menu)">插槽: {{ menu.label }}</div></template
      >
    </Vue3Menus>
  </div>
</template>

<script lang="ts" setup>
import { Vue3Menus } from 'vue3-menus'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  eventVal: {
    type: Object,
    default: () => ({})
  },
  menus: {
    type: Array as () => any[],
    default: () => []
  }
})

const showMenu = ref(false)
const cusEventVal: any = ref({})
watch(
  () => props.eventVal,
  (value) => {
    cusEventVal.value = value || {}
  }
)

watch(
  () => props.isOpen,
  (value) => {
    showMenu.value = value
  }
)

const emit = defineEmits(['itemClick'])
// 点击右键
const itemClick = (item) => {
  emit('itemClick', item)
}
</script>
