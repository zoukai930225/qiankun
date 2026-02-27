<!--
 * @Author: wangxifeng-ZJ3bu
 * @Date: 2025-12-15 18:19:45
 * @LastEditors: wangxifeng-ZJ3bu
 * @LastEditTime: 2025-12-19 10:26:17
-->
<template>
  <div v-loading="loading">
    <div class="board-header">
      <div class="board-title"
        ><img src="@/assets/imgs/newMedia/bonusBoard.svg" alt="" /> 汇总看板</div
      >
      <time-filter
        v-model="selectedMonth"
        layout="月"
        :default-value="'月'"
        :default-date="defaultMonth"
        :is-tooltip="false"
        :show-arrow="false"
        @change="handleMonthChange"
      />
    </div>

    <!-- 汇总看板组件 -->
    <summary-board ref="summaryBoardRef" @show-detail="handleShowDetail" />

    <!-- 挂车/站内组看板组件 -->
    <gc-board ref="gcBoardRef" @show-detail="handleShowDetail" />

    <!-- 千川组看板组件 -->
    <qc-board ref="qcBoardRef" @show-detail="handleShowDetail" />

    <!-- 详情弹框组件 -->
    <detail-dialog ref="detailDialogRef" />
  </div>
</template>

<script lang="tsx">
export default { name: 'NewMediaBonusBoard' }
</script>

<script lang="tsx" setup>
import dayjs from 'dayjs'
import TimeFilter from '~/time/timeFilter.vue'
import SummaryBoard from './components/SummaryBoard.vue'
import GcBoard from './components/GcBoard.vue'
import QcBoard from './components/QcBoard.vue'
import DetailDialog from './components/DetailDialog.vue'
// import request from '@/config/axios'

const selectedMonth = ref()
const defaultMonth = ref(dayjs().format('YYYY-MM'))
const summaryBoardRef = ref()
const gcBoardRef = ref()
const qcBoardRef = ref()
const detailDialogRef = ref()
const loading = ref(false)
// 月份筛选变化
const handleMonthChange = (value: any) => {
  loadAllData()
}

// 加载所有数据
const loadAllData = async () => {
  loading.value = true
  await summaryBoardRef.value?.getData()
  await gcBoardRef.value?.getData()
  await qcBoardRef.value?.getData()
  loading.value = false
}

// 显示详情弹框
const handleShowDetail = (detail: { type: string; title: string; data: any[] }) => {
  detailDialogRef.value?.open(detail)
}

onMounted(() => {
  loadAllData()
})

provide('bonusBoard', {
  selectedMonth,
  defaultMonth
})
</script>

<style lang="scss" scoped>
@use './styles.scss';
</style>
