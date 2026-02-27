<!--
 * @Date: 2025-01-03 16:22:21
-->
<template>
  <div class="bar-content">
    <div class="bar" ref="chartContainer"></div>
  </div>
</template>

<script lang="ts" setup>
import { getDesignPictureColumn } from '@/api/oa/new/designGallery/index'
import { useCategoryConfig } from '@/views/OA/new/designGallery/hooks'
import * as echarts from 'echarts'
import { onBeforeUnmount, onMounted, ref } from 'vue'

const { getNameByCode } = useCategoryConfig()

const chartContainer = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null

const props = defineProps({
  form: {
    type: Object,
    required: true,
    default: () => {
      return {
        page: 1,
        size: 10
      }
    }
  }
})
interface SeriesDataItem {
  qyCon: number
  cyCon: number
}

const mapName = {
  '0': '买手款',
  '1': '定制款'
}

const seriesData = ref<Record<string, SeriesDataItem>>({})
const xName = computed(() => {
  console.log(Object.keys(seriesData.value), '  Object.keys(seriesData.value)')
  return (
    Object.keys(seriesData.value).map((item) => {
      return mapName[item] || ''
    }) || []
  )
})

const initChart = () => {
  if (chartContainer.value) {
    chartInstance = echarts.init(chartContainer.value)

    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['出样数', '缺样数']
      },
      xAxis: {
        type: 'category',
        data: xName.value || [],
        barWidth: 30,
        axisTick: {
          show: false // 去掉 x 轴下标尺
        },
        axisLine: {
          lineStyle: {
            color: '#979797' // 自定义 x 轴颜色
          }
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: true, // 确保 y 轴显示
          lineStyle: {
            color: '#979797' // 自定义 y 轴颜色
          }
        }
      },
      series: [
        {
          name: '出样数',
          type: 'bar',
          stack: 'total',
          barWidth: 30,
          label: {
            show: false
          },
          emphasis: {
            focus: 'series'
          },
          itemStyle: {
            color: '#FB841E'
          },
          data: (Object.values(seriesData.value) || []).map((item) => item.cyCon) || []
        },
        {
          name: '缺样数',
          type: 'bar',
          stack: 'total',
          barWidth: 30,
          label: {
            show: false
          },
          emphasis: {
            focus: 'series'
          },
          itemStyle: {
            color: '#3270FF'
          },
          data: (Object.values(seriesData.value) || []).map((item) => item.qyCon) || []
        }
        // {
        //   name: '定品',
        //   type: 'bar',
        //   stack: 'total',
        //   barWidth: 30,
        //   label: {
        //     show: false
        //   },
        //   emphasis: {
        //     focus: 'series'
        //   },
        //   itemStyle: {
        //     color: '#05975B'
        //   },
        //   data: (Object.values(seriesData.value) || []).map((item) => item.dpCon) || []
        // },
        // {
        //   name: '打样',
        //   type: 'bar',
        //   stack: 'total',
        //   barWidth: 30,
        //   label: {
        //     show: false
        //   },
        //   emphasis: {
        //     focus: 'series'
        //   },
        //   itemStyle: {
        //     color: '#A9A9A9'
        //   },
        //   data: (Object.values(seriesData.value) || []).map((item) => item.dyCon) || []
        // }
      ]
    }
    chartInstance.setOption(option)
  }
}

onMounted(async () => {
  getList()
  window.addEventListener('resize', handleResize)
})

const handleResize = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}

const getList = async () => {
  var formData = new FormData()
  formData.append(
    'queryParam',
    JSON.stringify({
      ...queryParams.value,
      page: undefined,
      size: undefined
    })
  )
  const params = {
    page: queryParams.value.page,
    size: queryParams.value.size,
    data: formData
  }
  const res = await getDesignPictureColumn(params)
  seriesData.value = res || {}
  initChart()
}

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.dispose()
  }
})

const queryParams = ref({
  page: 1,
  size: 10
})

watch(
  () => props.form,
  async (newForm) => {
    //@ts-ignore
    queryParams.value = {
      ...newForm
    }
    // await getConfigCategory()
    getList()
  },
  { deep: true }
)
</script>

<style lang="scss" scoped>
.bar-content {
  width: 100%;
  height: 100%;
  background: url('@/assets/imgs/oa/bar-content.png') no-repeat;
  background-size: 100% 100%;
  padding-top: 20px;
  box-sizing: border-box;
  .bar {
    width: 100%;
    height: 100%;
  }
}
</style>
