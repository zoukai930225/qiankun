<!--
 * @Description: 人员数据看板
-->
<template>
  <div class="board-section">
    <div class="section-header">
      <div class="section-title">
        <span>人员数据看板</span>
        <div v-if="showMoreButton" class="more-button-wrapper">
          <el-button link type="primary" @click="handleShowMore">
            <span>查看更多</span>
            <el-icon>
              <ArrowRight />
            </el-icon>
          </el-button>
        </div>
      </div>
      <div class="section-filter">
        <label>登记人</label>
        <el-input
          v-model="selectedUser"
          clearable
          @change="getData"
          @keyup.enter="getData"
          placeholder="请输入登记人"
        />
      </div>
    </div>

    <div class="personnel-board-content">
      <!-- 左侧：人员数据表格 -->
      <div class="personnel-table">
        <table-with-more
          :table-data="tableData"
          ref="tableWithMoreRef"
          :display-limit="5"
          dialog-title="人员数据"
        >
          <el-table-column prop="tjwd" label="登记人" align="left">
            <template #default="{ row }">
              <div class="user-cell">
                <div class="user-avatar">
                  <el-avatar :src="row.registrantAvatar" :size="20" />
                </div>
                <span class="user-name">{{ row.tjwd }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="djsl" label="登记数量" align="center" />
          <el-table-column prop="stsl" label="删帖数量" align="center" />
          <el-table-column prop="wstsl" label="未删帖数量" align="center" />
          <el-table-column prop="stzb" label="删帖进度" min-width="120" align="center">
            <template #default="{ row }">
              <div class="progress-cell">
                <div class="progress-wrapper">
                  <el-progress
                    :percentage="parseFloat(row.stzb) || 0"
                    :stroke-width="8"
                    :show-text="false"
                  />
                  <span class="progress-text">{{ row.stzb }}%</span>
                </div>
              </div>
            </template>
          </el-table-column>
        </table-with-more>
      </div>

      <!-- 右侧：图表 -->
      <div class="personnel-chart">
        <div ref="chartRef" class="chart-container" v-show="tableData.length > 0"></div>
        <div class="chart-empty" v-show="tableData.length === 0">
          <el-empty description="暂无数据" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="tsx" setup>
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import TableWithMore from './TableWithMore.vue'
import request from '@/config/axios'

const { selectedDay, publishType } = inject('opinionDataBoard') as {
  selectedDay: Ref<string>
  publishType: Ref<string>
}
// 选中的用户
const selectedUser = ref('')
// 表格引用
const tableWithMoreRef = ref<InstanceType<typeof TableWithMore>>()
// 图表引用
const chartRef = ref<HTMLElement>()
let chartInstance: echarts.ECharts | null = null
// 表格数据
const tableData = ref<any[]>([])
const showMoreButton = computed(() => {
  return tableData.value.length > 5
})
const handleShowMore = () => {
  console.log(tableWithMoreRef.value)
  tableWithMoreRef.value?.openDialog()
}

// 图表数据（根据选中用户动态生成）
const chartData = computed(() => {
  return {
    dates: tableData.value.map((item) => item.tjwd).slice(0, 5),
    registerCount: tableData.value.map((item) => item.djsl).slice(0, 5),
    deleteCount: tableData.value.map((item) => item.stsl).slice(0, 5),
    notDeleteCount: tableData.value.map((item) => item.wstsl).slice(0, 5)
  }
})

// 获取数据
const getData = async () => {
  try {
    // TODO: 调用后端接口
    const res = await request.get({
      url: '/api/publicOpinionInfo/persionStatistics',
      params: {
        registerDateStart:
          typeof selectedDay.value === 'string' ? selectedDay.value : selectedDay.value?.[0],
        registerDateEnd:
          typeof selectedDay.value === 'string' ? selectedDay.value : selectedDay.value?.[1],
        registrant: selectedUser.value,
        publishType: publishType.value
      }
    })
    tableData.value = res || []

    // 等待 DOM 更新后再初始化/更新图表
    await nextTick()
    if (tableData.value.length > 0) {
      if (chartInstance) {
        updateChart() // 如果已存在实例，只更新数据
      } else {
        initChart() // 如果不存在实例，初始化
      }
    }
  } catch (error) {
    console.error('获取人员数据失败:', error)
  }
}

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return

  // 如果已存在实例，先销毁
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }

  // 创建新实例
  chartInstance = echarts.init(chartRef.value)
  updateChart()
}

// 更新图表
const updateChart = () => {
  if (!chartInstance) return
  const option: EChartsOption = {
    color: ['#0064FF', '#FC8484', '#FD9907'],
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      borderWidth: 0,
      textStyle: {
        color: '#fff'
      }
    },
    legend: {
      data: [
        {
          name: '登记数量'
        },
        {
          name: '删帖数量'
        },
        {
          name: '未删帖数量'
        }
      ],
      top: 0,
      itemWidth: 12,
      itemHeight: 12,
      itemGap: 15,
      textStyle: {
        color: '#666',
        fontSize: 14
      },
      lineStyle: {}
    },
    grid: {
      left: '30',
      right: '10',
      bottom: '20',
      top: '50',
      containLabel: false
    },
    xAxis: {
      type: 'category',
      data: chartData.value.dates,
      axisLine: {
        lineStyle: {
          color: '#E2E8EE'
        }
      },
      axisLabel: {
        color: '#333333',
        fontSize: 14
      },
      axisTick: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      axisLabel: {
        color: '#666',
        fontSize: 14
      },
      splitLine: {
        lineStyle: {
          color: '#f5f5f5',
          type: 'dashed'
        }
      }
    },
    series: [
      {
        name: '登记数量',
        type: 'bar',
        data: chartData.value.registerCount,
        barWidth: '50px',
        itemStyle: {
          color: '#0064FF',
          borderRadius: [4, 4, 0, 0]
        },
        emphasis: {
          itemStyle: {
            color: '#3e5ab8'
          }
        }
      },
      {
        name: '删帖数量',
        type: 'line',
        data: chartData.value.deleteCount,
        smooth: true,
        symbol: 'circle',
        symbolSize: 4,
        lineStyle: {
          width: 2,
          color: '#FC8484'
        },
        itemStyle: {
          color: '#FC8484',
          opacity: 0
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(235, 55, 55, 0.2)'
              },
              {
                offset: 1,
                color: 'rgba(235, 55, 55, 0)'
              }
            ]
          }
        }
      },
      {
        name: '未删帖数量',
        type: 'line',
        data: chartData.value.notDeleteCount,
        smooth: true,
        lineStyle: {
          width: 2,
          color: '#FD9907'
        },
        itemStyle: {
          color: '#FD9907',
          opacity: 0
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(255, 165, 1, 0.2)'
              },
              {
                offset: 1,
                color: 'rgba(255, 165, 0, 0)'
              }
            ]
          }
        }
      }
    ]
  }

  chartInstance.setOption(option, true)
}
// 保存 resize 处理函数的引用
const handleResize = () => {
  chartInstance?.resize()
}

onMounted(async () => {
  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  // 清理：销毁图表实例和移除事件监听
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
  window.removeEventListener('resize', handleResize)
})

defineExpose({ getData })
</script>

<style lang="scss" scoped>
@use '../style.scss';
.board-section {
  .section-header {
    margin-bottom: 20px;
    .section-filter {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 275px;
      label {
        font-size: 14px;
        color: #666;
      }
      :deep(.el-input) {
        width: 220px;
      }
    }
  }

  .personnel-board-content {
    display: flex;
    gap: 30px;

    .personnel-table {
      flex: 1;
      min-width: 0;

      :deep(.el-table) {
        .user-cell {
          display: flex;
          align-items: center;
          gap: 8px;

          .user-avatar {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            overflow: hidden;
            flex-shrink: 0;
          }

          .user-name {
            font-size: 14px;
            color: #303133;
          }
        }
      }
    }

    .personnel-chart {
      width: 55%;
      flex-shrink: 0;

      .chart-container {
        width: 100%;
        height: 299px;
        border-radius: 4px;
      }
    }
  }
}
</style>
