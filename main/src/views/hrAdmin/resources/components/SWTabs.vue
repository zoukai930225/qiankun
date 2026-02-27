<!--
 * @Date: 2025-03-19 16:34:30
-->
<!-- 导师带领计划   name:毛天 date:2025年2月27日17:07:16 -->
<template>
  <div class="tabs-wapper">
    <div class="item item1" :class="{ activity0: currentTab == '' }" @click="tabsChange('')"
      >全部</div
    >
    <div class="item item2" @click="tabsChange('1')" :class="{ activity1: currentTab == '1' }">
      导师带领计划(未填写)({{ numberObj['1'] }})
      <el-popover effect="light" trigger="hover" placement="top" width="auto">
        <template #default>
          <div>入职一周未填写导师带领计划的员工</div>
        </template>
        <template #reference>
          <img class="desc" src="@/assets/imgs/hrAdmin/desc.png" />
        </template>
      </el-popover>
    </div>
    <div class="item item3" @click="tabsChange('3')" :class="{ activity3: currentTab == '3' }">
      入职一月调研问卷(未填写)({{ numberObj['3'] }})
      <el-popover effect="light" trigger="hover" placement="top" width="auto">
        <template #default>
          <div>入职一月未填写调研问卷的员工</div>
        </template>
        <template #reference>
          <img class="desc" src="@/assets/imgs/hrAdmin/desc.png" />
        </template>
      </el-popover>
    </div>
    <div class="item item4" @click="tabsChange('2')" :class="{ activity2: currentTab == '2' }">
      待转正员工({{ numberObj['2'] }})
      <el-popover effect="light" trigger="hover" placement="top" width="auto">
        <template #default>
          <div>一个月内即将转正的员工</div>
        </template>
        <template #reference>
          <img class="desc" src="@/assets/imgs/hrAdmin/desc.png" />
        </template>
      </el-popover>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  currentTab: string
  numberObj: {
    [key: string]: number
  }
}>()

const emit = defineEmits(['tabsChange'])
const tabsChange = (index: string) => {
  emit('tabsChange', index)
}
</script>

<style lang="scss" scoped>
.tabs-wapper {
  display: flex;
  flex-direction: row;
  .item {
    width: 25%;
    height: 50px;
    cursor: pointer;
    line-height: 50px;
    text-align: center;
    font-weight: 600;
    font-size: 16px;
    color: #333333;
    font-style: normal;
    .desc {
      width: 14px;
      height: 14px;
    }
  }
  .item1 {
    background: url('@/assets/imgs/hrAdmin/item1.png') no-repeat;
    background-size: 100% 100%;
  }
  .item2 {
    background: url('@/assets/imgs/hrAdmin/item2.png') no-repeat;
    background-size: 100% 100%;
  }
  .item3 {
    background: url('@/assets/imgs/hrAdmin/item3.png') no-repeat;
    background-size: 100% 100%;
  }
  .item4 {
    background: url('@/assets/imgs/hrAdmin/item4.png') no-repeat;
    background-size: 100% 100%;
  }
  .activity0 {
    background: url('@/assets/imgs/hrAdmin/act-item0.png') no-repeat;
    background-size: 100% 100%;
  }
  .activity2 {
    background: url('@/assets/imgs/hrAdmin/act-item2.png') no-repeat;
    background-size: 100% 100%;
  }
  .activity1 {
    background: url('@/assets/imgs/hrAdmin/act-item1.png') no-repeat;
    background-size: 100% 100%;
  }
  .activity3 {
    background: url('@/assets/imgs/hrAdmin/act-item1.png') no-repeat;
    background-size: 100% 100%;
  }
}
</style>
