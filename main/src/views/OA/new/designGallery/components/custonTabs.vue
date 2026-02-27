<!--
 * @Date: 2025-02-11 14:42:52
-->
<template>
  <ElScrollbar>
    <div class="tabs-container">
      <div v-for="(tab, index) in oaCustomTabsData.tabs" :key="index" :class="['tab', { active: activeTab === index }]"
        @click="handleTabClick(index)">
        <div class="text1" :class="['tabLabel', { activeLabe: activeTab === index }]"
          style="margin-left: 16px; margin-right: 16px">
          {{ tab.label }}({{ tab.count }})
        </div>
      </div>
    </div>
  </ElScrollbar>

</template>

<script lang="ts" setup>
import { defineEmits, defineProps, ref } from 'vue'
import { oaCustomTabsStore } from '@/store/modules/oaCustomTabs'
import { ElScrollbar } from 'element-plus'

const oaCustomTabsData = oaCustomTabsStore()

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update:modelValue'])

const activeTab = ref(props.modelValue)

const handleTabClick = (index: number) => {
  activeTab.value = index
  emit('update:modelValue', index)
}
</script>

<style scoped lang="scss">
.tabs-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 0px 20px 0px 20px;
  box-sizing: border-box;
  margin-bottom: 6px;
  border-bottom: 1px solid #F0F0F0;

  .tab {
    // width: 92px;
    width: auto;
    height: 46px;
    text-align: center;
    cursor: pointer;
    font-family:
      PingFangSC,
      PingFang SC;
    font-size: 14px;
    color: #666666;
    line-height: 32px;
    background: #ffffff;
    // border: 1px solid #e5e5e5;
    border-right: none;

    // &:first-child {
    //   border-radius: 4px 0px 0px 4px;
    // }

    // &:last-child {
    //   border-right: 1px solid #e5e5e5;
    //   border-radius: 0px 4px 4px 0px;
    // }

    &:hover {
      color: #0064ff;
    }
  }

  .tab.active {
    border-bottom: 2px solid #0064ff;
    font-weight: bold;
    color: #0064ff !important;
  }
}

.tabLabel {
  display: inline;
  height: 44px;
  line-height: 44px;
  // padding: 5px 0px;
  // margin-left: 5px;
  // margin-right: 5px;
}

.activeLabe {
  /* border-bottom: 2px solid #0064ff; */
}
</style>
