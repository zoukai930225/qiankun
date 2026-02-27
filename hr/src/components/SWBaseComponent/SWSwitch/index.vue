<template>
  <el-switch
    class="SWSwitch"
    active-color="#126EFE"
    v-model="currentValue"
    :before-change="switchBeforeChange"
  />
</template>
<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'

const props = defineProps({
  value: propTypes.number.def(1)
})

const currentValue = ref(props.value)
const switchBeforeChange = (v) => {
  return new Promise((resolve) => {
    emit('change')
    return resolve(false)
  })
}

const updateValue = (val) => {
  currentValue.value = val
}

const emit = defineEmits(['change']) // 定义 success 事件，用于操作成功后的回调
defineExpose({ updateValue })
</script>

<style lang="scss" scoped>
.SWSwitch {
  height: 24px;
}
</style>
