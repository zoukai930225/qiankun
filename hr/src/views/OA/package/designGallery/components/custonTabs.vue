<!--
 * @Date: 2025-02-11 14:42:52
-->
<template>
  <div class="tabs-container">
    <div
      v-for="(tab, index) in oaCustomTabsData.tabs"
      :key="index"
      :class="['tab', { active: activeTab === index }]"
      @click="handleTabClick(index)"
    >
      <span :class="['tabLabel', { activeLabe: activeTab === index }]">
        {{ tab.label }}({{ tab.count }})
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { oaCustomTabsStorePackage } from '@/store/modules/oaCustomTabs'
import { defineEmits, defineProps, ref } from 'vue'

const oaCustomTabsData = oaCustomTabsStorePackage()

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  }
})

// const tabs = ref([
//   { label: '全部', count: 0 },
//   { label: '未审核', count: 0 },
//   { label: '审核通过', count: 0 },
//   { label: '审核拒绝', count: 0 }
// ])

const emit = defineEmits(['update:modelValue'])

watch(
  () => props.modelValue,
  (newVal) => {
    activeTab.value = newVal
  }
)

const activeTab = ref(props.modelValue)

const handleTabClick = (index: number) => {
  activeTab.value = index
  emit('update:modelValue', index)
}
</script>

<style scoped lang="scss">
.tabs-container {
  display: flex;
  width: 100%;
  padding: 20px 20px 4px 20px;
  box-sizing: border-box;
}

.tab {
  width: 92px;
  height: 32px;
  text-align: center;
  cursor: pointer;
  font-family:
    PingFangSC,
    PingFang SC;
  font-size: 14px;
  color: #666666;
  line-height: 32px;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-right: none;
  &:first-child {
    border-radius: 4px 0px 0px 4px;
  }
  &:last-child {
    border-right: 1px solid #e5e5e5;
    border-radius: 0px 4px 4px 0px;
  }
  &:hover {
    color: #0064ff;
  }
}

.tab.active {
  border: 1px solid #0064ff;
  font-weight: bold;
  color: #0064ff !important;
}
.tabLabel {
  display: inline;
  padding: 5px 0px;
}
.activeLabe {
  /* border-bottom: 2px solid #0064ff; */
}
</style>
