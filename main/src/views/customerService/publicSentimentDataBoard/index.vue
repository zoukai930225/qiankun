<!--
 * @Author: wangxifeng-ZJ3bu
 * @Date: 2026-01-08 16:17:45
 * @LastEditors: wangxifeng-ZJ3bu
 * @LastEditTime: 2026-01-22 17:20:27
-->
<!--
 * @Description: 舆情数据看板
-->
<template>
  <div v-loading="loading" class="opinion-data-board">
    <div class="board-header">
      <div class="board-title">舆情数据看板</div>
      <time-filter
        v-model="selectedDay"
        layout="日,自定义"
        :default-value="'日'"
        :default-date="defaultDay"
        :is-tooltip="false"
        :show-arrow="false"
        @change="loadAllData"
      />
    </div>
    <div class="opinion-board-container">
      <div class="board-filter-item">
        <span class="board-filter-item-label">发布类型：</span>
        <el-select
          v-model="publishType"
          placeholder="请选择发布类型"
          @change="loadAllData"
          clearable
        >
          <el-option
            v-for="item in publishTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <!-- 汇总看板 -->
      <summary-board ref="summaryBoardRef" />

      <!-- 数据看板 -->
      <statistics-board ref="statisticsBoardRef" />

      <!-- 人员数据看板 -->
      <personnel-board ref="personnelBoardRef" />
    </div>
  </div>
</template>

<script lang="tsx">
export default { name: 'PublicSentimentDataBoard' }
</script>

<script lang="tsx" setup>
import dayjs from 'dayjs'
import SummaryBoard from './components/SummaryBoard.vue'
import StatisticsBoard from './components/StatisticsBoard.vue'
import PersonnelBoard from './components/PersonnelBoard.vue'
import request from '@/config/axios'
const summaryBoardRef = ref()
const statisticsBoardRef = ref()
const personnelBoardRef = ref()
const loading = ref(false)
const selectedDay = ref('')
const defaultDay = ref('')

// 默认日期为前一天
defaultDay.value = dayjs().subtract(1, 'day').format('YYYY-MM-DD')

const publishType = ref('')
const publishTypeOptions = ref<{ label: string; value: string }[]>([])
const getDictDataList = async () => {
  const res = await request.get({
    url: `/api/dict/list?page=1&size=99&name=&type=2&pCode=pi_publishing_type&company=`
  })
  publishTypeOptions.value = res.data.map((_i: any) => ({
    label: _i.name,
    value: _i.code
  }))
}
// 加载所有数据
const loadAllData = async () => {
  loading.value = true
  try {
    const res = await request.get({
      url: '/api/publicOpinionInfo/statistics',
      params: {
        registerDateStart:
          typeof selectedDay.value === 'string' ? selectedDay.value : selectedDay.value?.[0],
        registerDateEnd:
          typeof selectedDay.value === 'string' ? selectedDay.value : selectedDay.value?.[1],
        publishType: publishType.value
      }
    })
    await Promise.all([
      summaryBoardRef.value?.getData(res),
      statisticsBoardRef.value?.getData(res),
      personnelBoardRef.value?.getData()
    ])
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await getDictDataList()
  loadAllData()
})

// 通过 provide 提供共享数据
provide('opinionDataBoard', {
  selectedDay,
  publishType
})
</script>

<style lang="scss" scoped>
@use './style.scss';
</style>
