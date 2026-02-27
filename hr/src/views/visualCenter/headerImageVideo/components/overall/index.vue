<template>
  <ul class="flex items-center list gap-20px">
    <li
      class="flex-1 item flex items-center gap-50px justify-between"
      :class="{ active: currentActive === 0 }"
      @click="onSwitch(0)"
    >
      <div class="flex-1">
        <h3 class="primary-title"> 完播率 </h3>
        <h2 class="primary-value">{{ cardData.completionRate || '--' }}</h2>
        <div class="flex items-center gap-20px mt-8px">
          <div class="inner-item">
            <span class="inner-title">月环比</span>
            <div class="flex items-center gap-10px">
              <div class="trend-icon" :class="getTrendClass(cardData.completionRateCyclecrc)"></div>
              <span class="trend-value">{{ cardData.completionRateCyclecrc || '--' }}</span>
            </div>
          </div>
          <div class="inner-item">
            <span class="inner-title">同行同层均值</span>
            <div>
              <span class="trend-value">{{ cardData.completionRateRivalavg || '--' }}</span>
            </div>
          </div>
        </div>
      </div>
      <div>
        <pieChart :percentage="getPercentageValue(cardData.completionRate)" />
      </div>
    </li>
    <li
      class="flex-1 item flex items-center gap-50px justify-between"
      :class="{ active: currentActive === 1 }"
      @click="onSwitch(1)"
    >
      <div class="flex-1">
        <h3 class="primary-title"> 平均观看时长 </h3>
        <h2 class="primary-value">{{ formatWatchTime(cardData.avgUserWatchTimeSec) }}</h2>
        <div class="flex items-center gap-20px mt-8px">
          <div class="inner-item">
            <span class="inner-title">月环比</span>
            <div class="flex items-center gap-10px">
              <div
                class="trend-icon"
                :class="getTrendClass(cardData.avgUserWatchSecCyclecrc)"
              ></div>
              <span class="trend-value">{{ cardData.avgUserWatchSecCyclecrc || '--' }}</span>
            </div>
          </div>
          <div class="inner-item">
            <span class="inner-title">同行同层均值</span>
            <div>
              <span class="trend-value">{{
                formatWatchTime(cardData.avgUserWatchSecRivalavg)
              }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="w-124px h-124px bg-no-repeat bg-center bg-contain clock"> </div>
    </li>
  </ul>
  <div class="mt-10px">
    <line-chart :chart-data="chartData" :active-type="currentActive" />
  </div>
</template>
<script lang="ts" setup>
import pieChart from './components/pieChart.vue'
import lineChart from './components/lineChart.vue'
import { ref, inject, ComputedRef, onMounted, reactive } from 'vue'
import type { SearchParams } from '../type'
import { getOverviewCard, getOverviewTrendChart } from '@/api/visualCenter/headerImagevVideo'

const props = defineProps({ autoLoad: { type: Boolean, default: true } })

const searchParams = inject<ComputedRef<SearchParams>>('searchParams')

const currentActive = ref(0)

// 定义卡片数据结构
const cardData = reactive({
  completionRate: '',
  completionRateCyclecrc: '',
  completionRateRivalavg: '',
  avgUserWatchTimeSec: '',
  avgUserWatchSecCyclecrc: '',
  avgUserWatchSecRivalavg: ''
})

// 图表数据
const chartData = ref<
  Array<{
    date: string
    views: number
    ratio: number
  }>
>([])

const onSwitch = (index: number) => {
  if (currentActive.value === index) return
  currentActive.value = index
  // 切换卡片时重新获取趋势图数据
  getTrendChartData()
}

const getCardData = async () => {
  if (!searchParams) return
  try {
    const res = await getOverviewCard(searchParams.value)

    if (res) {
      Object.assign(cardData, {
        completionRate: res.completionRate || '',
        completionRateCyclecrc: res.completionRateCyclecrc || '',
        completionRateRivalavg: res.completionRateRivalavg || '',
        avgUserWatchTimeSec: res.avgUserWatchTimeSec || '',
        avgUserWatchSecCyclecrc: res.avgUserWatchSecCyclecrc || '',
        avgUserWatchSecRivalavg: res.avgUserWatchSecRivalavg || ''
      })
    } else {
      Object.assign(cardData, {
        completionRate: '',
        completionRateCyclecrc: '',
        completionRateRivalavg: '',
        avgUserWatchTimeSec: '',
        avgUserWatchSecCyclecrc: '',
        avgUserWatchSecRivalavg: ''
      })
    }
  } catch (error) {
    console.error('获取卡片数据失败:', error)
  }
}

const getTrendChartData = async () => {
  if (!searchParams) return
  try {
    const res = await getOverviewTrendChart(searchParams.value)
    if (Array.isArray(res)) {
      // 根据当前激活的卡片处理对应的数据
      const processedData = res.reverse().map((v) => {
        if (currentActive.value === 0) {
          // 完播率卡片
          const completionRate = v.completionRate
            ? parseFloat(v.completionRate.replace('%', ''))
            : 0
          const rivalAvg = v.completionRateRivalavg
            ? parseFloat(v.completionRateRivalavg.replace('%', ''))
            : 0

          return {
            date: v.month,
            views: completionRate,
            ratio: rivalAvg
          }
        } else {
          // 平均观看时长卡片
          const watchTime = v.avgUserWatchTimeSec ? parseFloat(v.avgUserWatchTimeSec) : 0
          const rivalWatchTime = v.avgUserWatchSecRivalavg
            ? parseFloat(v.avgUserWatchSecRivalavg)
            : 0

          return {
            date: v.month,
            views: watchTime,
            ratio: rivalWatchTime
          }
        }
      })

      console.log('图表数据:', processedData)

      // 设置图表数据
      chartData.value = processedData
    }
  } catch (error) {
    console.error('获取趋势图数据失败:', error)
  }
}

// 格式化观看时长（秒转换为带单位的字符串）
const formatWatchTime = (seconds: string) => {
  if (!seconds) return '--'
  const sec = parseFloat(seconds)
  if (isNaN(sec)) return '--'
  return `${sec}秒`
}

// 获取趋势图标的类名
const getTrendClass = (value: string) => {
  if (!value) return ''
  const numValue = parseFloat(value.replace('%', ''))
  if (isNaN(numValue) || numValue === 0) return ''
  return numValue > 0 ? 'up' : 'down'
}

// 获取饼图的百分比数值
const getPercentageValue = (percentage: string) => {
  if (!percentage) return 0
  const value = parseFloat(percentage.replace('%', ''))
  return isNaN(value) ? 0 : value
}

function refresh() {
  getCardData()
  getTrendChartData()
}

defineExpose({
  refresh
})

onMounted(() => {
  if (props.autoLoad) {
    getCardData()
    getTrendChartData()
  }
})
</script>
<style scoped lang="scss">
.list {
  .item {
    padding: 20px 30px;
    background-color: #f8f8f9;

    cursor: pointer;
    border: 1px solid transparent;

    &:first-child {
      border-radius: 10px 0px 0px 10px;
    }

    &:last-child {
      border-radius: 0px 10px 10px 0px;
    }

    &.active {
      border: 1px solid #0064ff;
      background-color: #e6f0ff;
    }
  }

  .primary-title {
    font-size: 14px;
    font-weight: normal;
    color: #666666;
    white-space: nowrap;
  }

  .primary-value {
    font-size: 28px;
    font-weight: 500;
    color: #000716;
    margin-top: 6px;
    white-space: nowrap;
  }

  .inner-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    padding-top: 12px;
    padding-bottom: 12px;
    background-color: #fff;
    width: 100%;

    .trend-icon {
      width: 14px;
      height: 14px;

      &.up {
        background: url('@/assets/svgs/visualCenter/up.svg') no-repeat center;
        width: 14px;
        height: 14px;
      }

      &.down {
        background: url('@/assets/svgs/visualCenter/down.svg') no-repeat center;
        width: 14px;
        height: 14px;
      }
    }
  }

  .clock {
    background-image: url('@/assets/svgs/visualCenter/clock.svg');
    width: 124px;
    height: 124px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
  }

  .inner-title {
    font-size: 14px;
    font-weight: normal;
    color: #666666;
    white-space: nowrap;
  }

  .trend-value {
    font-size: 18px;
    font-weight: normal;
    color: #333;
    white-space: nowrap;
  }
}
</style>
