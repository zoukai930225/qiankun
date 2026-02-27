<template>
  <div>
    <el-drawer v-model="drawerVisible" :title="dialogTitle" size="966">
      <TimeDiagrmaInfo v-if="isRuntime" :data="detailData" type="dynamic" />
      <el-tabs v-else v-model="activeName" class="seeHrDetailtabs" @tab-click="handleClick">
        <el-tab-pane label="基本信息" name="first">
          <TimeDiagrmaInfo :data="detailData" type="static" tab="basic" />
        </el-tab-pane>
        <el-tab-pane label="RPA类信息" name="second">
          <TimeDiagrmaInfo :data="detailData" type="static" tab="rpa" />
        </el-tab-pane>
      </el-tabs>
    </el-drawer>
  </div>
</template>
<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
const drawerVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题

import TimeDiagrmaInfo from './timeDiagrmaInfo.vue'

import * as TimeDagrmaApi from '@/api/rpaManage/timeDagrma'
import * as RpaApi from '@/api/rpaManage'

const props = defineProps({
  type: propTypes.string.def('static') //static 静态 dynamic 动态
})

const isRuntime = ref(false)
const activeName = ref('first')
const detailData = ref({})

/** 打开弹窗 */
const open = async (id?: string, runtime = false) => {
  drawerVisible.value = true
  dialogTitle.value = '查看'
  isRuntime.value = runtime
  // 修改时，设置数据
  if (id) {
    if (runtime) {
      const data = await TimeDagrmaApi.getRuntimeTimeDagrmaDetail(id).catch(() => {})
      detailData.value = data || {}
    } else {
      const data = await RpaApi.getApplicationDetail({ id: id })
      detailData.value = data || {}
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>

<style lang="scss" scoped>
// 修改备注的文本框背景
:deep(.el-textarea__inner),
:deep(.el-input__wrapper),
:deep(.el-select__wrapper) {
  background-color: #f8f8f9 !important;
  box-shadow: none !important;
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
