<template>
  <div class="total">
    <div class="total-title">汇总：</div>
    <div class="total-all" :class="{ 'total-select': selectIndex === 0 }" @click="dataExchange(0)">全部</div>
    <div v-if="isAll" class="total-line"></div>
    <div v-if="isAll" class="total-current" :class="{ 'total-select': selectIndex === 1 }" @click="dataExchange(1)">当前页
    </div>
  </div>
</template>
<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'

const props = defineProps({
  isAll: propTypes.bool.def(true),
  defaultIndex: propTypes.number.def(1),
})


const selectIndex = ref(1)

const dataExchange = (index) => {
  selectIndex.value = index
  emit('dataExchange', index)
}

watch(() => props.defaultIndex, (val: number) => {
  selectIndex.value = val
}, { immediate: true})

const emit = defineEmits(['dataExchange'])
</script>

<style scoped lang="scss">
.total {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 14px;
  color: #333333;
  line-height: 20px;

  &-title {
    padding-right: 10px;
  }

  &-all {
    cursor: pointer;
    padding-right: 16px;
  }

  &-line {
    width: 1px;
    height: 12px;
    background: #e5e5e5;
  }

  &-current {
    cursor: pointer;
    padding-left: 16px;
  }

  &-select {
    color: #0064ff;
  }
}
</style>
