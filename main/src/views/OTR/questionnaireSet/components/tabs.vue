<!--
 * @Date: 2024-10-12 16:42:15
-->
<template>
  <div class="tabs">
    <div class="item" @click="changeTab(0)">
      <span class="current" v-if="currentTab == 0"></span>
      <img class="icon" src="@/assets/imgs/otr/questionnaireSet/tab1.svg" alt="" />
      <span class="tab-item" :class="{ activity: currentTab == 0 }">前导页 </span>
    </div>
    <div class="item" @click="changeTab(1)">
      <span class="current" v-if="currentTab == 1"></span>
      <img class="icon" src="@/assets/imgs/otr/questionnaireSet/tab2.svg" alt="" />
      <span class="tab-item" :class="{ activity: currentTab == 1 }">题目编辑</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  currentTab: {
    type: Number,
    default: 0
  }
})
// const emit = defineEmits(['tabChange'])

const changeTab = (value) => {
  // emit('tabChange', value)
}
</script>

<style lang="scss" scoped>
.tabs {
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid #e7e8ee;
  .item {
    cursor: pointer;
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 40px;
    line-height: 40px;
    text-align: center;
    // background: #f3f8ff;
    border-radius: 6px 6px 0px 0px;
    margin-right: 20px;
    width: 116px;
    box-sizing: border-box;
    .icon {
      width: 14px;
      height: 16px;
      margin-right: 14px;
    }
    .current {
      position: absolute;
      bottom: 0;
      left: 5px;
      display: block;
      border-radius: 6px 6px 0px 0px;
      height: 2px;
      background: #3e80ff;
      width: 106px;
    }
    .activity {
      font-weight: 400;
      font-size: 14px;
      color: #0064ff;
    }
    &:hover {
      color: #0064ff;
    }
  }
}
</style>
