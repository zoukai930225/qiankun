<!--
 * @Author: wangxifeng-ZJ3bu
 * @Date: 2025-12-17 14:00:00
 * @LastEditors: wangxifeng-ZJ3bu
 * @LastEditTime: 2025-12-22 17:17:54
-->
<template>
  <div class="board-card main-container">
    <div class="card-header">
      <div class="card-title">总奖金看板</div>
    </div>
    <div class="summary-section">
      <el-card class="box-card">
        <template #header>
          <div class="section-header">
            <span class="section-label">个人奖金排行</span>
            <el-button
              text
              type="primary"
              class="more-btn"
              v-if="summaryData.length > 6"
              @click="handleShowMore"
            >
              查看更多
              <el-icon class="ml-4px"><ArrowRight /></el-icon>
            </el-button>
          </div>
        </template>
        <div class="summary-layout">
          <!-- 左侧：总览排名表格 -->
          <div class="summary-table-wrapper">
            <summary-rank-table :data="displayData" />
          </div>

          <!-- 右侧：总奖金柱状图 -->
          <div class="chart-wrapper">
            <div ref="bonusChartRef" class="bonus-chart"></div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script lang="tsx" setup>
import * as echarts from 'echarts'
import type { ECharts } from 'echarts'
import { ArrowRight } from '@element-plus/icons-vue'
import request from '@/config/axios'
import SummaryRankTable from './tables/SummaryRankTable.vue'

const emit = defineEmits(['show-detail'])
const { selectedMonth } = inject('bonusBoard') as { selectedMonth: Ref<string> }
const bonusChartRef = ref<HTMLDivElement>()
let bonusChart: ECharts | null = null

// onMounted(async () => {
//   getData()
// })
const getData = async () => {
  await getSummaryData()
  nextTick(() => {
    initBonusChart()
  })
  window.addEventListener('resize', handleResize)
}
const getSummaryData = async () => {
  const res = await request.get({
    url: '/api/nmBonusBoard/getSummary',
    params: { month: selectedMonth.value }
  })
  summaryData.value = res || []
}
// 汇总看板数据
const summaryData = ref<any[]>([])

// 显示数据（前6条）
const displayData = computed(() => summaryData.value.slice(0, 6))

// 初始化柱状图
const initBonusChart = () => {
  if (!bonusChartRef.value) return

  bonusChart = echarts.init(bonusChartRef.value)

  // 只显示前5个数据
  const chartData = summaryData.value.slice(0, 6)

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params: any) => {
        return `${params[0].name}<br/>${params[0].marker}总奖金: ¥${params[0].value}`
      }
    },
    grid: {
      left: '4%',
      right: '4%',
      bottom: '3%',
      top: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: chartData.map((item) => item.userName),
      axisLabel: {
        interval: 0,
        rotate: 0,
        lineHeight: 18,
        formatter: (_value: string, index: number) => {
          const item = chartData[index]
          return `{name|${item.userName}}\n{group|${item.groupName}}`
        },
        rich: {
          name: {
            fontSize: 14,
            color: '#333',
            fontWeight: 500,
            padding: [5, 0, 0, 0]
          },
          group: {
            fontSize: 12,
            color: '#666',
            padding: [15, 0, 0, 0]
          }
        }
      },
      axisLine: {
        lineStyle: {
          color: '#e5e5e5'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: '',
      axisLabel: {
        formatter: '{value}',
        fontSize: 12,
        color: '#333'
      },
      splitLine: {
        lineStyle: {
          color: '#e5e5e5',
          type: 'solid'
        }
      }
    },
    series: [
      {
        name: '总奖金',
        type: 'bar',
        data: chartData.map((item) => item.bonus),
        itemStyle: {
          color: '#0064FF',
          borderRadius: [3, 3, 0, 0]
        },
        barWidth: 50
      }
    ]
  }

  bonusChart.setOption(option)
}

// 监听窗口大小变化
const handleResize = () => {
  bonusChart?.resize()
}

// 查看更多
const handleShowMore = () => {
  emit('show-detail', {
    type: 'summary',
    title: '总奖金看板',
    data: summaryData.value
  })
}

onBeforeUnmount(() => {
  if (bonusChart) {
    bonusChart.dispose()
    bonusChart = null
  }
  window.removeEventListener('resize', handleResize)
})

defineExpose({
  getData
})
</script>

<style lang="scss" scoped>
@use './style.scss';
.summary-section {
  padding: 0 16px 16px;
}

.summary-layout {
  display: flex;
  gap: 20px;

  .summary-table-wrapper {
    width: calc(50% - 10px);
    flex-shrink: 0;
  }

  .chart-wrapper {
    width: calc(50% - 10px);
    min-width: 0;

    .bonus-chart {
      width: 100%;
      height: 340px;
    }
  }
}

// .ranking-table {
//   .rank-badge {
//     font-size: 20px;
//     line-height: 1;
//   }

//   .amount-link {
//     font-size: 14px;
//     padding: 0;
//     font-weight: 400;
//   }
// }
</style>
