<template>
  <div>
    <el-drawer
      v-if="dialogVisible"
      custom-class="employDrawer"
      v-model="dialogVisible"
      :title="dialogTitle"
      size="966"
    >
      <el-tabs v-model="activeName" class="seeHrDetailtabs" @tab-click="handleClick">
        <el-tab-pane label="员工信息" name="first">
          <EmployeeInfo :data="personRosterDetail" type="employInfo" />
        </el-tab-pane>
        <el-tab-pane label="员工关系" name="second">
          <EmployeeInfo :data="personRosterDetail" type="employReleation" />
        </el-tab-pane>
        <el-tab-pane label="员工背景" name="third">
          <EmployeeInfo :data="personRosterDetail" type="employBackground" />
        </el-tab-pane>
      </el-tabs>
    </el-drawer>
  </div>
</template>
<script lang="ts" setup>
import type { TabsPaneContext } from 'element-plus'

import EmployeeInfo from './employeeInfo.vue'

import * as PersonRosterApi from '@/api/hrAdmin/personRoster'

const personRosterDetail = ref()

const activeName = ref('first')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题

/** 打开弹窗 */
const open = async (userId: string) => {
  dialogVisible.value = false
  dialogTitle.value = '查看'
  nextTick(async () => {
    dialogVisible.value = true
    activeName.value = 'first'
    personRosterDetail.value = await PersonRosterApi.getPersonRosterDetail(userId)
  })
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>

<style lang="scss" scoped>
.employDrawer {
}
.seeHrDetailtabs {
  margin-top: 0px;
  border-bottom: none;
}
:deep(.el-drawer__body) {
  background: #f8f9fb;
}
</style>

<style scoped>
:deep(.el-tabs__nav-wrap::after) {
  background-color: transparent;
}
:deep(.el-tab-pane) {
  height: calc(100vh - 140px);
  overflow-y: auto;
}
:deep(.el-tabs__item.is-active) {
  font-weight: 500;
  font-size: 16px;
  color: #0064ff;
  line-height: 24px;
}

:deep(.el-tabs__item) {
  font-size: 16px;
  color: #666666;
  line-height: 24px;
}
:deep(.el-drawer__header) {
  margin-bottom: 0px;
}
:deep(.el-drawer__title) {
  font-size: 14px;
  color: #333333;
  line-height: 20px;
  font-weight: 500;
}

:deep(.el-drawer) {
  border-radius: 12px 0px 0px 0px;
  width: 100%;
  height: 100%;
  background: url('@/assets/imgs/common/drawer-bg.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  box-sizing: border-box;
}
:deep(.el-drawer__body) {
  width: 100%;
  height: 100%;
  background: url('@/assets/imgs/common/drawer-bg.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  box-sizing: border-box;
}
:deep(.el-input__wrapper) {
  background: transparent;
  border-radius: 4px;
  box-shadow: none;
}
:deep(.el-table .cell) {
  margin-left: 5px;
}

:deep(.el-table) {
  --el-table-row-hover-bg-color: transparent;
}
</style>
