<template>
  <s-w-dialog v-model="dialogVisible" width="1110px" :title="'查看趋势图'" :showTitleLine="true" @closed="handleClosed">
    <div class="trend-line-container w-full h-full">
      <!-- 视频信息区域 -->
      <div class="video-info w-full">
        <div class="info-row flex items-center mb-4">
          <div class="flex gap-20px">
            <div class="info-item">
              <span class="label text-gray-500">内容标题:</span>
              <span class="value text-gray-800 font-medium">{{ currentRow.contentTitle || '暂无' }}</span>
            </div>
            <div class="info-item">
              <span class="label text-gray-500">内容ID:</span>
              <span class="value text-gray-800 font-medium">{{ currentRow.contentId || '暂无' }}</span>
            </div>
          </div>
          <div class="ml-90px">
            <s-form :schema="formSchema" :model="formModel" />
            <!-- <el-select v-model="indicatorType" size="small" @change="updateChart">
              <el-option label="有效播放引导成交金额" value="1" />
              <el-option label="播放趋势" value="2" />
            </el-select> -->
          </div>
        </div>
      </div>


      <!-- 图表区域 -->
      <div class="chart-container rounded-md p-2 h-430px" ref="chartRef"></div>
    </div>
  </s-w-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { inject, ComputedRef } from 'vue'
import { getSingleTrendChart } from '@/api/visualCenter/headerImagevVideo'
import type { SelectOption, SearchParams, VideoRow, TrendDataItem } from '../../type'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  videoData: {
    type: Object,
    default: () => ({})
  },
  selectOptions: {
    type: Array as () => SelectOption[],
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

const searchParams = inject<ComputedRef<SearchParams>>('searchParams')

const dialogVisible = ref(false)
const chartRef = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null
const formModel = ref({
  indicatorType: 'completionRate'
})
const chartData = ref<{
  dates: string[]
  values: number[]
  indicatorName: string
}>({
  dates: [],
  values: [],
  indicatorName: ''
})
const formSchema = [{
  field: 'indicatorType',
  component: 'Select',
  label: '指标筛选',
  componentProps: {
    options: props.selectOptions.map(v => {
      return {
        label: v.label,
        value: v.prop
      }
    }),
    onChange: (value: string) => {
      formModel.value.indicatorType = value
      updateChartWithData()
    }
  },
  value: 'completionRate'
}]

// 视频信息
const currentRow = ref<VideoRow>({} as VideoRow)

// API数据
const apiData = ref<TrendDataItem[]>([])

// 图表数据
// const chartData = reactive({
//   dates: ['07-09', '07-10', '07-11', '07-12', '07-13', '07-14', '07-15', '07-16', '07-17', '07-18', '07-19', '07-20'],
//   values: [2850, 3000, 2950, 2650, 2750, 2450, 2250, 2850, 3050, 3000, 2800, 2650, 2850]
// })

// 创建图表
function initChart() {
  // 确保DOM元素已经渲染
  if (!chartRef.value) return

  // 销毁之前的实例
  if (chartInstance) {
    chartInstance.dispose()
  }

  // 创建新实例
  chartInstance = echarts.init(chartRef.value)
  updateChart()

  // 窗口大小改变时重新渲染
  window.addEventListener('resize', resizeChart)
}

// 更新图表
function updateChart() {
  if (!chartInstance) return
  const option = {
    legend: {
      data: [chartData.value.indicatorName],
      top: 0,
      left: 'center',
      icon: 'rect',
      itemWidth: 20,
      itemHeight: 10,
      textStyle: {
        color: '#666',
        fontSize: 14,
        rich: {
          a: {
            verticalAlign: 'middle',
          }
        },
        padding: [0, 0, -2, 0]
      },
      itemGap: 30,
      align: 'auto',
      symbolKeepAspect: true,
      formatter: function (name) {
        return name;
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#333'
        }
      },
      backgroundColor: 'rgba(50,50,50,0.9)',
      borderColor: 'rgba(50,50,50,0.9)',
      textStyle: {
        color: '#fff'
      },
      // extraCssText: 'z-index: 100',
      appendToBody: true,
      formatter: function (params) {
        return params[0].name + '<br/>' + params[0].marker + params[0].value + `${['completionRate', 'validPlayRate'].includes(formModel.value.indicatorType) ? '%' : ''}`;
      }
    },
    grid: {
      left: '10',
      right: '45',
      bottom: '0',
      top: '50',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: chartData.value.dates,
      axisLine: {
        lineStyle: {
          color: '#E0E0E0'
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#666666'
      }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#E2E8EE'
        }
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#666666'
      }
    },
    series: [
      {
        name: chartData.value.indicatorName,
        type: 'line',
        smooth: true,
        symbol: 'emptyCircle',
        symbolSize: 6,
        showSymbol: false,
        emphasis: {
          scale: true,
          focus: 'series'
        },
        itemStyle: {
          color: '#FF9B28'
        },
        lineStyle: {
          width: 2,
          color: '#FF9B28'
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
                color: 'rgba(255, 155, 40, 0.3)'
              },
              {
                offset: 1,
                color: 'rgba(255, 155, 40, 0.05)'
              }
            ]
          }
        },
        data: chartData.value.values
      }
    ]
  }

  chartInstance.setOption(option)
}

function updateChartWithData() {
  if (!apiData.value.length) return

  const indicator = formModel.value.indicatorType
  const selectedOption = props.selectOptions.find(opt => opt.prop === indicator)

  chartData.value = {
    dates: apiData.value.map(item => item.datadate).reverse(), // 格式化日期为 MM-DD 并反转顺序
    values: apiData.value.map(item => {
      const value = item[indicator]
      if (value === null || value === undefined) return 0
      // 处理百分比格式，如 "50%" -> 50
      if (typeof value === 'string' && value.includes('%')) {
        return parseFloat(value.replace('%', '')) || 0
      }
      return Number(value) || 0
    }).reverse(), // 获取指标数据并反转顺序
    indicatorName: selectedOption?.label || ''
  }

  updateChart()
}

// 图表大小调整
function resizeChart() {
  if (chartInstance) {
    chartInstance.resize()
  }
}

function open(row: any) {
  currentRow.value = row
  getChartData()
  dialogVisible.value = true
  nextTick(() => {
    initChart()
  })
}

function handleClosed() {
  dialogVisible.value = false
  emit('update:modelValue', false)
}

async function getChartData() {
  if (!searchParams) return
  const data = await getSingleTrendChart({ ...searchParams.value, dateType: 0, storeCode: currentRow.value.storeCode, contentId: currentRow.value.contentId })
  apiData.value = data
  updateChartWithData()
}

// 组件挂载时的处理
// onMounted(() => {
//   if (dialogVisible.value) {
//     nextTick(() => {
//       initChart()
//     })
//   }
// })

onUnmounted(() => {
  window.removeEventListener('resize', resizeChart)
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
})

defineExpose({
  open
})
</script>

<style scoped lang="scss">
.trend-line-container {
  padding: 20px 0;
}

.info-item {
  // margin-right: 20px;

  .label {
    margin-right: 4px;
  }
}

:deep(.el-form) {
  .el-form-item {
    margin-bottom: 0;
  }
}
</style>