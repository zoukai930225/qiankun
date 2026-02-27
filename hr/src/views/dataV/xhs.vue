<template>
  <div class="bg">
    <div class="dataChart">
      <div style="width: 100%; height: 100%">
        <Echart :options="options" />
      </div>
    </div>
    <Top />
  </div>
</template>

<script lang="ts" setup>
import Top from './components/xhsTop.vue'
import * as DataVApi from '@/api/dataV'
const xhsReportData = ref<DataVApi.XhsGmvReportData>()

const color2678FF = '#2678FF'
const color0FC61C = '#0FC61C'

// 数据
const data = ref({})

// 配置图表
const options = ref({})

/**
 * 获取小红书店铺大屏信息
 */
const getXhsGmvReportData = async () => {
  const data = (await DataVApi.getXhsGmvReportBigScreenData().catch(
    () => {}
  )) as DataVApi.XhsGmvReportData
  if (data) {
    xhsReportData.value = data
    refreshEchartData()
  }
}

// 刷新Echart数据
const refreshEchartData = () => {
  data.value = {
    xAxisData: xhsReportData.value?.storeName, // X 轴数据
    seriesData: [
      { name: '点赞', data: xhsReportData.value?.likedCount, color: color2678FF }, // 第一组数据
      { name: 'GMV', data: xhsReportData.value?.gmv, color: color0FC61C } // 第二组数据
    ]
  }
  options.value = {
    grid: {
      left: 30,
      right: 30,
      containLabel: true
    },
    legend: {
      right: 20, // 距离右侧10像素
      itemHeight: 15, //修改icon图形大小
      icon: 'circle',
      textStyle: {
        color: '#333' // 文字颜色
      },
      data: ['点赞', 'GMV'] // 图例数据
    },
    xAxis: {
      data: data.value.xAxisData // 设置 X 轴数据
    },
    yAxis: {},
    series: data.value.seriesData.map(function (item) {
      return {
        type: 'bar',
        name: item.name,
        data: item.data,
        itemStyle: {
          color: item.color,
          normal: {
            barBorderRadius: [5, 5, 0, 0]
          }
        },
        barWidth: '38px',
        label: {
          show: true,
          position: 'top',
          textStyle: {
            color: '#333', // 标签字体颜色
            fontSize: 10 // 标签字体大小
          }
        }
      } // 设置柱状图的类型、名称和数据
    })
  }
}

// 每隔10分钟请求一次接口
const timeInterval = 1000 * 60 * 10
window.setInterval(() => {
  setTimeout(() => {
    ///调取接口
    getXhsGmvReportData
  }, 0)
}, timeInterval)

onMounted(() => {
  getXhsGmvReportData()
})
</script>

<style lang="scss" scoped>
.bg {
  // background-image: url('@/assets/imgs/dataV/bg.png');
  // background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
  .dataChart {
    // background: #fff;
    margin-top: 20vh;
  }
}
</style>
