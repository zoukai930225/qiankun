<template>
  <div class="staticsDetail">
    <HeaderFilter @date-filter="dateFilter" :param="routerQuery" />
    <SWChart
      v-if="staticsMode === 0"
      ref="dayLineChartRef"
      :option1="dayPariselineDataOption"
      :option2="dayCollectionlineDataOption"
    />
    <SWChart
      v-if="staticsMode === 1"
      ref="hourLineChartRef"
      :option1="hourPariselineDataOption"
      :option2="hourCollectionlineDataOption"
    />
  </div>
</template>

<script lang="ts" setup>
import HeaderFilter from './staticsDetail/headerFilter.vue'
import SWChart from '@/components/SWChart/index.vue'

defineOptions({ name: 'StaticsDetail' })

const router = useRouter()
const routerQuery = router.currentRoute.value.query

//0 按天 1 按时段
const staticsMode = ref(0)

const dayLineChartRef = ref()
const hourLineChartRef = ref()
// 点赞数量
const dayPariselineDataOption = ref({})
// 收藏数量
const dayCollectionlineDataOption = ref({})

const hourPariselineDataOption = ref({})
const hourCollectionlineDataOption = ref({})

// 日期筛选完成
// mode 0 按天 1 按时段
const dateFilter = (mode, date) => {
  staticsMode.value = mode
  // staticsDataRequest(mode, date)
  if (mode === 0) {
    //按天
    let xAxisData1 = []
    let yAxisData1 = []
    let yAxisData2 = []
    for (let i = 0; i < 30; i++) {
      xAxisData1.push(`5.${i + 1}`)
      yAxisData1.push(1000 + Math.round(Math.random() * 1000))
      yAxisData2.push(2000 + Math.round(Math.random() * 1000))
    }
    dayPariselineDataOption.value = {
      xAxisData: xAxisData1, //点赞数量统计X轴数据
      yAxisData: yAxisData1, //点赞数量统计Y轴数据
      tipsName: '点赞数量',
      lineColor: '#126EFE'
    }
    dayCollectionlineDataOption.value = {
      xAxisData: xAxisData1, //收藏数量统计X轴数据
      yAxisData: yAxisData2, //收藏数量统计Y轴数据
      tipsName: '收藏数量',
      lineColor: '#FE8C4A'
    }
    nextTick(() => {
      dayLineChartRef.value.setChartOptions()
    })
  } else if (mode === 1) {
    // 按时段
    let xAxisData1 = []
    let yAxisData1 = []
    let yAxisData2 = []
    for (let i = 1; i <= 24; i++) {
      if (i < 10) {
        xAxisData1.push(`0${i}:00`)
      } else {
        if (i === 24) {
          xAxisData1.push(`23:59`)
        } else {
          xAxisData1.push(`${i}:00`)
        }
      }
      yAxisData1.push(100 + Math.round(Math.random() * 100))
      yAxisData2.push(200 + Math.round(Math.random() * 100))
    }
    hourPariselineDataOption.value = {
      xAxisData: xAxisData1, //点赞数量统计X轴数据
      yAxisData: yAxisData1, //点赞数量统计Y轴数据
      tipsName: '点赞数量',
      lineColor: '#126EFE'
    }
    hourCollectionlineDataOption.value = {
      xAxisData: xAxisData1, //收藏数量统计X轴数据
      yAxisData: yAxisData2, //收藏数量统计Y轴数据
      tipsName: '收藏数量',
      lineColor: '#FE8C4A'
    }
    nextTick(() => {
      hourLineChartRef.value.setChartOptions()
    })
  }
}

// 统计数据请求
// const staticsDataRequest = (mode, date) => {}

/** 初始化 **/
onMounted(() => {
  dateFilter(0, '')
})
</script>

<style lang="scss" scoped>
.staticsDetail {
  background: #fff;
  &-header {
    height: 100px;
  }
}
</style>
