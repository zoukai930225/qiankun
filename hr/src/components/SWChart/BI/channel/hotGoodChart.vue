<template>
  <div style="width: 100%; height: 100%;position: relative;">
    <div class="chart-change-box">
      <el-radio-group v-model="chartType">
        <el-radio-button :value="1">
          <img :src="chartType === 1 ? combineOnSvg : combineSvg" class="icon-conbine" />
        </el-radio-button>
        <el-radio-button :value="2">
          <img :src="chartType === 2 ? lineOnSvg : lineSvg" class="icon-conbine" />
        </el-radio-button>
        <el-radio-button :value="3">
          <img :src="chartType === 3 ? barOnSvg : barSvg" class="icon-conbine" />
        </el-radio-button>
      </el-radio-group>
    </div>
    <Echart :options="options" :height="height" ref="echartRef" />
  </div>
</template>

<script lang="ts" setup>
//渠道总览 - 经营数据图表
import { propTypes } from '@/utils/propTypes'
import { numberFormateShow } from '@/utils/formatter'
import combineOnSvg from '@/assets/imgs/Bi/combine_on.svg'
import combineSvg from '@/assets/imgs/Bi/combine.svg'
import lineOnSvg from '@/assets/imgs/Bi/line_on.svg'
import lineSvg from '@/assets/imgs/Bi/line.svg'
import barOnSvg from '@/assets/imgs/Bi/bar_on.svg'
import barSvg from '@/assets/imgs/Bi/bar.svg'
const props = defineProps({
  height: propTypes.oneOfType([Number, String]).def('300px'),
  width: propTypes.oneOfType([Number, String]).def('100%'),
  chartData: {
    type: Array<object>,
    default: () => []
  },
  // 选中项
  checkedKeys: {
    type: Array<string>,
    default: () => []
  },
  //x轴时间
  chartTimes: {
    type: Array<string>,
    default: () => []
  },
  //是否显示头部分割线
  showSolid: {
    type: Boolean,
    default: true
  },
  //是否显示平滑area曲线
  smoothArea: {
    type: Boolean,
    default: true
  }
})

const options = ref({})
const echartRef = ref<any>()
//是否显示混合图
const userBar = ref(false);
let allSeriseData = [] as any[]
//全柱状图
const allBar = ref(false)
const COLOR = ['#0064FF', '#F0BD2F', '#FFA500', '#5DCDF5', '#39D29F']
const COLORAREA = ['rgba(0,100,255,0.2)', 'rgba(240,189,47,0.2)', 'rgba(255,165,0,0.2)', 'rgba(93,205,245,0.2)', 'rgba(57,210,159,0.2)']
// 设置图表配置
const setChartOptions = () => {

  let grid = {
    left: 5,
    right: 5,
    bottom: 18,
    top: '16%',
    containLabel: true
  }
  let tooltip = {
    trigger: 'axis',
    backgroundColor: '	rgba(36,52,90,0.9)',
    borderColor: 'rgba(36,52,90,0.9)',
    textStyle: {
      color: '#fff'
    },
    confine: true,
    //数据格式化
    formatter: function (params) {
      if (!Array.isArray(params) || params.length == 0 || !params[0]) return ''
      return getToolTipData(params)
    }
  }

  let yAxis = [
    {
      type: 'value'
    },
    {
      type: 'value',
      axisLabel: {
        formatter: '{value} %'
      }
    }
  ]
  let legend = {
    show: true,
    type: 'scroll',
    data: getLegendData()
  }

  let noData = false
  const alldata = getSeriesData()
  allSeriseData = alldata;
  let dataNumber = 0
  alldata.map(item => {
    if (item.data.length == 0) {
      noData = true
    }
    dataNumber = Math.max(dataNumber, item.data.length)
  })
  noData = alldata.length == 0 ? true : noData
  let xAxis = {
    type: 'category',
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      show: true,
      rotate: dataNumber > 20 ? 45 : 0,
      interval: 0,
      margin: dataNumber > 20 ? 18 : 8,
      formatter: function (value) {
        const maxLength = 5
        if (dataNumber > 20 && value.length > maxLength) {
          const start = value.slice(0, 2) // 获取前半部分
          const end = value.slice(-2) // 获取后半部分
          return start + '...' + end //
        }
        return value
      },
      hideOverlap: true
    },
    boundaryGap: true,
    data: props.chartTimes,
  }


  let title = {
    show: noData,   // 没数据才显示
    extStyle: {
      color: "grey",
      fontSize: 20
    },
    text: "暂无数据",
    left: "center",
    top: "center"
  }
  // 给EChart赋值
  options.value = {
    color: ['#0064FF', '#F0BD2F', '#FFA500', '#5DCDF5', '#39D29F'],
    xAxis: xAxis,
    grid: grid,
    tooltip: tooltip,
    yAxis: yAxis,
    legend: legend,
    series: alldata,
    title
  }

  echartRef.value.resizeHandler()
}
function getLegendData() {
  const data: string[] = []
  props.chartData.forEach((item: any) => {
    if (props.checkedKeys.includes(item.fieldCode)) {
      data.push(item.fieldName)
    }
  })

  return data
}



function getSeriesData() {
  allSeriseData = []
  const seriesData: any[] = []
  let index = 0
  props.chartData.forEach((item: any) => {
    if (props.checkedKeys.includes(item.fieldCode)) {
      const seriesItem = {
        name: item.fieldName,
        type: allBar.value ? 'bar' : item.isPrecent ? 'line' : userBar.value ? 'bar' : 'line',
        tooltip: {
          valueFormatter: function (value) {
            if (item.isPrecent) {
              return value + '%'
            } else {
              return numberFormateShow(value)
            }
          },
        },
        data: item.value,
        yAxisIndex: item.isPrecent ? 1 : 0,
        smooth: props.smoothArea,
        showSymbol: !props.smoothArea,
        itemStyle: {
          color: COLOR[index % COLOR.length]
        },
        itemData: item,
      }
      //设置area
      if (props.smoothArea) {
        Object.assign(seriesItem, {
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: COLORAREA[index % COLORAREA.length] // 0% 处的颜色
              }, {
                offset: 1, color: 'rgba(255,255,255,0)' // 100% 处的颜色
              }],
            },
          },
        })
      }
      if (item.isPrecent) {
        Object.assign(seriesItem, {
          itemStyle: {
            borderRadius: 2,
            color: COLOR[index % COLOR.length]
          },
          barMaxWidth: 10
        })
      } else {
        Object.assign(seriesItem, {
          itemStyle: {
            borderRadius: 2,
            color: COLOR[index % COLOR.length]
          },
          barMaxWidth: 10
        })
      }
      seriesData.push(seriesItem)
      index++;
    }
  })
  return seriesData
}

function getToolTipData(params: any) {
  const item = allSeriseData[params[0].seriesIndex]?.itemData;
  return `<div style="padding: 0;display:flex;align-items:center;flex-direction:row;">
      <img src=${item.other.goodsImage} style="width:90px;height:90px;margin-right:10px;border-radius:5px;"/>
      <div style="width:180px">
      <div style="font-size:14px;color:#fff;margin-bottom:5px;" class="text2">${item.other.goodsName}</div>
      <div style="display:flex;justify-content:space-between;align-items:center;flex-direction:row;font-size:12px;color:#fff"><div>${item.fieldName}排名</div><div>${params[0].axisValue}</div></div>
      <div style="display:flex;justify-content:space-between;align-items:center;flex-direction:row;font-size:12px;color:#fff"><div>${item.fieldName}</div><div>${item.isPrecent ? params[0].value + '%' : numberFormateShow(params[0].value)}</div></div>
      </div>
      </div>`
}
//1-组合图 2-折线图 3-柱状图
const chartType = ref(2)
watch(chartType, (val) => {
  switch (val) {
    case 1:
      userBar.value = true
      allBar.value = false;
      break;
    case 2:
      userBar.value = false
      allBar.value = false;
      break;
    case 3:
      userBar.value = false
      allBar.value = true;
      break;
  }
  setChartOptions()
})
defineExpose({ setChartOptions }) // 提供 setChartOptions 方法，用于设置图表配置
</script>

<style lang="scss" scoped>
.sloid {
  width: 100%;
  height: 1px;
  background-color: #DDE2E9;
  margin-top: 10px;
  margin-bottom: 15px;
}

.chart-change-box {
  position: absolute;
  right: 0;
  z-index: 99;

  :deep(.el-radio-button__inner) {
    padding: 0;
    width: 52px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .el-radio-button {
    --el-radio-button-checked-bg-color: transparent;
    --el-border-color: #DADADA;
  }



}

.icon-line {
  width: 16px;
  height: 15px;
}

.icon-conbine {
  width: 18px;
  height: 18px;
}

.icon-bar {
  width: 18px;
  height: 17px;
}
</style>
