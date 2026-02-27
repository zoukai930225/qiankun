<!--
 * @Author: wangxifeng-ZJ3bu
 * @Date: 2025-12-24 11:50:29
 * @LastEditors: wangxifeng-ZJ3bu
 * @LastEditTime: 2025-12-26 17:12:02
-->
<!--
 * @Description: 客服数据看板
-->
<template>
  <div v-loading="loading" class="customer-service-board">
    <div class="board-header">
      <div class="board-title">客服模块数据看板</div>
      <time-filter
        v-model="selectedDay"
        layout="日,自定义"
        :default-value="'日'"
        :default-date="defaultDay"
        :is-tooltip="false"
        :show-arrow="false"
        @change="handleDayChange"
      />
    </div>
    <div class="customer-service-container">
      <el-tabs v-model="activeTab" class="customer-service-data-board-tabs">
        <el-tab-pane label="客服问题反馈数据统计" name="problemFeedback">
          <problem-feedback-board ref="problemFeedbackRef" />
        </el-tab-pane>
        <el-tab-pane label="客服仓库反馈数据统计" name="warehouseFeedback">
          <warehouse-feedback-board ref="warehouseFeedbackRef" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang="tsx">
export default { name: 'customerServiceDataBoard' }
</script>

<script lang="tsx" setup>
import dayjs from 'dayjs'
import ProblemFeedbackBoard from './components/ProblemFeedbackBoard.vue'
import WarehouseFeedbackBoard from './components/WarehouseFeedbackBoard.vue'
const problemFeedbackRef = ref()
const warehouseFeedbackRef = ref()
const loading = ref(false)
const selectedDay = ref('')
const defaultDay = ref('')
const activeTab = ref('problemFeedback')
// 默认日期为前一天
defaultDay.value = dayjs().subtract(1, 'day').format('YYYY-MM-DD')

// 筛选变化
const handleDayChange = (value: any) => {
  loadAllData()
}

// 加载所有数据
const loadAllData = async () => {
  loading.value = true
  try {
    await Promise.all([problemFeedbackRef.value?.getData(), warehouseFeedbackRef.value?.getData()])
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadAllData()
})

// 通过 provide 提供共享数据
provide('customerServiceDataBoard', {
  selectedDay
})
</script>

<style lang="scss" scoped>
@use './style.scss';
</style>
