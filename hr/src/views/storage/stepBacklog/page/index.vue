<!--
 * @Author: wangxifeng-ZJ3bu
 * @Date: 2025-12-25 15:54:56
 * @LastEditors: wangxifeng-ZJ3bu
 * @LastEditTime: 2026-01-04 10:45:25
-->
<template>
  <div class="step-backlog-container">
    <el-tabs v-model="activeTab" class="step-backlog-tabs">
      <el-tab-pane label="环节积压统计" name="statistics">
        <Statistics />
      </el-tab-pane>
      <el-tab-pane label="环节积压时效" name="timeliness">
        <Timeliness />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="tsx">
export default { name: 'Stepbacklog' }
</script>

<script lang="tsx" setup>
import Statistics from './statistics.vue'
import Timeliness from './timeliness.vue'
import request from '@/config/axios'

const activeTab = ref('statistics')
const warehouseList = ref<{ label: string; value: string }[]>([])
const getWarehouseList = async () => {
  const res = await request.get({ url: '/api/stageBacklog/getWarehouse' })
  warehouseList.value = res.map((item) => {
    return {
      label: item,
      value: item
    }
  })
}

onMounted(() => {
  getWarehouseList()
})

provide('warehouseList', warehouseList)
</script>

<style lang="scss" scoped>
.step-backlog-container {
  min-height: calc(100vh - 125px);
  background-color: #fff;
  padding: 0px 20px 12px;
  border-radius: 8px;
  :deep(.step-backlog-tabs) {
    .el-tabs__header {
      margin-bottom: 0;
    }

    .el-tabs__content {
      flex: 1;
      overflow: auto;
    }

    .el-tabs__item {
      font-weight: normal;
      line-height: 46px;
      height: 46px;
      color: #666666;
      &.is-active {
        color: #0064ff;
        font-weight: 500;
      }
    }
  }
}
</style>
