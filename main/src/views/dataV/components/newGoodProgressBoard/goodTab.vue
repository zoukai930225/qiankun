<template>
  <div class="goodTab">
    <div class="row-center" style="border-radius: 6px; opacity: 0.8014; background: #f1f1f1">
      <div
        class="goodTab-tab"
        :class="{ 'goodTab-tabActive': selectTab === value.type }"
        v-for="(value, index) in tabs"
        :key="index"
        :style="{ marginRight: index === tabs.length - 1 ? '0px' : '15px' }"
        @click="tabClick(value.type)"
      >
        {{ value.name }}</div
      >
    </div>
  </div>
</template>
<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'

const props = defineProps({
  selectTab: propTypes.number.def(0)
})

const tabs = ref([
  {
    name: '产品',
    type: 1
  },
  {
    name: '包装',
    type: 2
  },
  {
    name: '工厂二开',
    type: 3
  },
])

const tabClick = (type: number) => {
  emit('tabClick', type)
}

const emit = defineEmits(['tabClick'])
</script>
<style lang="scss" scoped>
.goodTab {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-bottom: 15px;

  &-tab {
    width: 68px;
    height: 34px;
    line-height: 34px;
    text-align: center;
    font-size: 14px;
    color: #333333;
    cursor: pointer;
  }

  &-tabActive {
    background: #0064ff;
    font-size: 16px;
    font-weight: 500;
    color: #ffffff;
    border-radius: 6px;
  }
}
</style>
