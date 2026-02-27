<template>
  <div v-if="node" class="nodeStatus" :style="{ background: bgColor }">
    <div class="status" :style="{ color: textColor }">{{ statusValue }}</div>
  </div>
</template>

<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'

const props = defineProps({
  node: propTypes.number.def(1) // 1: 空闲，2：沟通，3：寄样 4:直播
})

const statusValue = computed(() => {
  if (props.node === 1) {
    return '空闲'
  } else if (props.node === 2) {
    return '沟通'
  } else if (props.node === 3) {
    return '寄样'
  } else if (props.node === 4) {
    return '直播'
  }
  return '-'
})

const bgColor = computed(() => {
  if (props.node === 1) {
    return '#FFF4E8'
  } else if (props.node === 2) {
    return '#E8F7EA'
  } else if (props.node === 3) {
    return '#E7F0FF'
  } else if (props.node === 4) {
    return '#FFEBEB'
  }
  return '#FFF4E8'
})

const textColor = computed(() => {
  if (props.node === 1) {
    return '#FA8C15'
  } else if (props.node === 2) {
    return '#15AD31'
  } else if (props.node === 3) {
    return '#126EFE'
  } else if (props.node === 4) {
    return '#FA3536'
  }
  return '#FA8C15'
})

/** 初始化 **/
onMounted(() => {})
</script>

<style lang="scss" scoped>
.nodeStatus {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 24px;
  border-radius: 4px;
  width: auto;
  .status {
    padding-left: 8px;
    padding-right: 8px;
    font-size: 14px;
    line-height: 24px;
  }
}
</style>
