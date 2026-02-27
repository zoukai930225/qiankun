<template>
  <s-w-drawer
    :model-value="modelValue"
    :title="title"
    width="900px"
    @open="open"
    @closed="handleClosed"
  >
    <el-card shadow="never" class="!border-0">
      <div ref="chartRef" class="chart-container">
        <div ref="chartDomRef" class="chart-content"></div>
      </div>

      <sw-table
        :data="tableData"
        :options="skuLogListTable"
        :show-overflow-tooltip="true"
        :max-height="300"
      />
      <div class="flex justify-end">
        <!-- 分页 -->
        <Pagination
          :total="total"
          v-model:page="queryParams.page"
          v-model:limit="queryParams.size"
          @pagination="getList"
        />
      </div>
    </el-card>

    <template #footer>
      <el-button @click="handleClosed">关闭</el-button>
    </template>
  </s-w-drawer>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'
import SwTable from '../../components/table.vue'
import { skuLogListTable } from '../options'
import { getDetailChangeHisSkuLogApi } from '@/api/supplier/supplierProduct'

interface PriceDataItem {
  updatedAt: string // 更新时间
  fgCost: number // 成品采购价格
  baseProdCost: number // 裸货采购价格
}

const props = defineProps<{
  title: string
  data: PriceDataItem[]
  type: number
  supplierGoodsDetailId: string
  sku: string
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:model-value', value: boolean): void
}>()

const chartRef = ref<HTMLDivElement>()
const chartDomRef = ref<HTMLDivElement>()
let chartInstance: echarts.ECharts | null = null
let resizeHandler: () => void

/** x轴数据（更新时间） */
const xAxisData = computed(() => {
  return props.data.map((ele) => ele.updatedAt) || []
})

/** 成品采购价格数据 */
const fgCost = computed(() => {
  return props.data.map((ele) => ele.fgCost) || []
})

/** 裸货采购价格数据 */
const baseProdCost = computed(() => {
  return props.data.map((ele) => ele.baseProdCost) || []
})

/**
 * 计算Y轴最大刻度和间隔
 * @param data 价格数据数组
 * @returns 最大刻度和间隔配置
 */
const calculateYAxisConfig = (data: number[]) => {
  if (!data.length || Math.max(...data) <= 0) {
    return { max: 100, interval: 20 }
  }

  const maxNumber = Math.max(...data)
  const magnitude = Math.floor(Math.log10(maxNumber))
  const baseUnit = Math.pow(10, magnitude)
  const coefficient = maxNumber / baseUnit

  let ceilingCoefficient: number
  if (coefficient < 1) ceilingCoefficient = 1
  else if (coefficient < 1.5) ceilingCoefficient = 1.5
  else if (coefficient < 2) ceilingCoefficient = 2
  else if (coefficient < 2.5) ceilingCoefficient = 2.5
  else if (coefficient < 5) ceilingCoefficient = 5
  else ceilingCoefficient = 10

  return {
    max: ceilingCoefficient * baseUnit,
    interval: (ceilingCoefficient * baseUnit) / 5
  }
}

/**
 * 获取图表配置项
 * @returns ECharts配置对象
 */
const getChartOption = () => {
  const allPriceData = [...fgCost.value, ...baseProdCost.value]
  const yAxisConfig = calculateYAxisConfig(allPriceData)

  return {
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      top: '14%',
      bottom: '25%',
      right: '8%',
      left: '8%'
    },
    legend: {
      data: ['成品价格', '裸货价格'],
      top: 0,
      textStyle: { fontSize: 14 }
    },
    xAxis: [
      {
        type: 'category',
        data: xAxisData.value,
        position: 'bottom',
        axisTick: { alignWithLabel: false },
        axisLabel: {
          fontStyle: 'italic',
          rotate: -20,
          align: 'left'
        },
        boundaryGap: false,
        min: -1,
        max: xAxisData.value.length,

        offset: 10
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '价格（元）',
        nameTextStyle: { padding: [0, 0, 0, 10] },
        min: 0,
        ...yAxisConfig,
        nameGap: 23,
        axisLine: { show: true }
      }
    ],
    animationDuration: 700,
    series: [
      {
        name: '成品价格',
        type: 'line',
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { width: 2 },
        label: {
          show: true,
          fontSize: 12,
          color: 'inherit'
        },
        data: fgCost.value,
        itemStyle: { color: '#5DCDF5' },
        tooltip: {
          valueFormatter: (value: number | string) => {
            return value + ' 元'
          }
        }
      },
      {
        name: '裸货价格',
        type: 'line',
        symbolSize: 6,
        lineStyle: { width: 2 },
        label: {
          show: true,
          fontSize: 12,
          color: 'inherit'
        },
        data: baseProdCost.value,
        itemStyle: { color: '#0064FF' },
        tooltip: {
          valueFormatter: (value: number | string) => {
            return value + ' 元'
          }
        }
      }
    ]
  }
}

/**
 * 初始化或更新图表
 */
const initOrUpdateChart = async () => {
  await nextTick()
  const chartDom = chartDomRef.value
  if (!chartDom) return
  if (chartInstance) {
    chartInstance.dispose()
  }
  chartInstance = echarts.init(chartDom)
  const option = getChartOption()

  if (props.type === 1) {
    option.series = option.series.filter((ele) => ele.name === '裸货价格')
    option.legend.data = ['裸货价格']

    const allPriceData = [...fgCost.value, ...baseProdCost.value]
    const yAxisConfig = calculateYAxisConfig(allPriceData)
    option.yAxis[0] = { ...option.yAxis[0], ...yAxisConfig }
  }

  chartInstance.setOption(option)
  chartInstance.off('legendselectchanged')
  chartInstance.on('legendselectchanged', handleLegendSelect)

  resizeHandler = () => {
    chartInstance?.resize()
  }
  window.addEventListener('resize', resizeHandler, { passive: true })
}

/**
 * 图例点击事件：动态调整Y轴范围
 */
const handleLegendSelect = ({
  name,
  selected
}: {
  name: string
  selected: Record<string, boolean>
}) => {
  if (!chartInstance) return

  const currentOption = chartInstance.getOption() as any
  const seriesIndex = currentOption.series.findIndex((s: any) => s.name === name)
  if (seriesIndex === -1) return

  const activeSeries = currentOption.series.filter((s: any) => selected[s.name])

  const allData = activeSeries.flatMap((s: any) => {
    switch (s.name) {
      case '成品价格':
        return fgCost.value
      case '裸货价格':
        return baseProdCost.value
      default:
        return []
    }
  })

  const { max, interval } = calculateYAxisConfig(allData)
  currentOption.yAxis[0].max = max
  currentOption.yAxis[0].interval = interval
  chartInstance.setOption(currentOption)
}

/**
 * 关闭弹窗时清理图表
 */
const cleanChart = () => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
  }
}

/** 打开弹窗并初始化图表 */
const open = () => {
  initOrUpdateChart()
  props.data?.length && getList()
  emit('update:model-value', true)
}

const tableData = ref([])
const total = ref(0)
const loading = ref(false)
const queryParams = reactive({
  page: 1,
  size: 10
})
/** 获取详情 */
async function getList() {
  try {
    loading.value = true
    const res = await getDetailChangeHisSkuLogApi({
      ...queryParams,
      supplierGoodsDetailId: props.supplierGoodsDetailId,
      sku: props.sku
    })

    tableData.value = res.records
    total.value = res.total
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}

function handleClosed() {
  emit('update:model-value', false)
  cleanChart()
  tableData.value = []
}

onUnmounted(() => {
  cleanChart()
})
</script>

<style lang="less" scoped>
@import url(../../index.scss);
.chart-container {
  height: 300px;
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
}

.chart-content {
  width: 100%;
  height: 100%;
}

:deep(.s-w-dialog__body) {
  padding: 0 !important;
  overflow: hidden;
}

.el-pagination {
  margin-bottom: 0;
}
</style>
