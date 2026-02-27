<template>
  <!-- 搜索工作栏 -->
  <ContentWrap>
    <div class="commonTopFilterWrap">
      <div class="commonTopFilterWrap-filter">
        <el-form
          ref="queryFormRef"
          :inline="true"
          :model="queryParams"
          class="-mb-15px"
          label-width="78px"
          @submit.prevent
        >
          <!-- 选择时间段 -->
          <el-form-item label="日期" prop="timeRange">
            <el-date-picker
              v-model="timeRange"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :clearable="true"
              @change="handleQuery"
            />
          </el-form-item>

          <el-form-item label="结果" prop="executeResult">
            <el-select
              style="width: 280px"
              v-model="queryParams.executeResult"
              placeholder="请选择"
              clearable
              multiple
              @change="handleQuery"
              @clear="handleQuery"
            >
              <el-option
                v-for="dict in resultOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="任务" prop="taskParam">
            <el-input
              v-model="queryParams.taskParam"
              style="width: 210px"
              clearable
              placeholder="请输入任务名称"
              @clear="handleQuery"
              @keyup.enter="handleQuery"
            />
          </el-form-item> -->
          <el-form-item label="应用" prop="programParam">
            <el-input
              v-model="queryParams.programParam"
              style="width: 250px"
              clearable
              placeholder="请输入应用名称/编码"
              @clear="handleQuery"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item v-show="isExpand" label="业务编码" prop="serviceCode">
            <el-input
              v-model="queryParams.serviceCode"
              style="width: 250px"
              clearable
              placeholder="请输入业务编码"
              @clear="handleQuery"
              @keyup.enter="handleQuery"
            />
          </el-form-item>

          <el-form-item v-show="isExpand" label="负责人" prop="superintendent">
            <el-select
              v-model="queryParams.superintendent"
              style="width: 250px"
              placeholder="请选择"
              clearable
              filterable
              @change="handleQuery"
            >
              <el-option
                v-for="dict in rpaDashboardData.resUserList"
                :key="dict.id"
                :label="dict.realName"
                :value="dict.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-show="isExpand" label="应用类型" prop="typeId">
            <el-select
              style="width: 250px"
              v-model="queryParams.typeId"
              placeholder="请选择"
              clearable
              filterable
              @change="handleQuery"
              @clear="handleQuery"
            >
              <el-option
                v-for="dict in rpaDashboardData.typeList"
                :key="dict.id"
                :label="dict.typeName"
                :value="dict.id"
              />
            </el-select>
          </el-form-item>

          <SWFilterExpandAll :isExpand="isExpand" @expand-click="isExpand = !isExpand" />
        </el-form>
      </div>
      <div class="commonTopFilterWrap-search">
        <div class="commonTopFilterWrap-search-container">
          <el-button @click="handleQuery" class="commonSearchBtn">
            <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
            搜索
          </el-button>
          <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0">
            重置
          </el-button>
        </div>
      </div>
    </div>
  </ContentWrap>
  <!-- 图表 -->

  <div class="loading-placeholder" v-if="loading">
    <div class="loading-text">
      <el-icon class="is-loading"><Loading /></el-icon>
      加载中...
    </div>
  </div>

  <div>程序总体运行数据汇总</div>
  <div id="main" style="width: 100%; height: 500px"></div>

  <div>异常二级错误指标汇总</div>
  <div id="main2" style="width: 100%; height: 500px"></div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'
import * as DashboardApi from '@/api/dashboard'
import * as rpaProgramTypeApi from '@/api/rpaManage/programType'
import { debounce } from 'lodash-es'
import SWFilterExpandAll from '@/components/SWBaseComponent/SWFilterExpandAll/index.vue' // 展开组件
import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'
import * as rpaApi from '@/api/rpaManage'

import { useRpaDashboardStore } from '@/store/modules/rpaDashboard'
const rpaDashboardData = useRpaDashboardStore()
import { formatDate } from '@/utils/formatTime'
type EChartsOption = echarts.EChartsOption
const isExpand = ref(false) // 是否展开
const now = new Date()
const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)

const timeRange = ref([startOfDay, endOfDay]) // 时间段 默认为当天 00:00:00 - 23:59:59
const queryFormRef = ref() // 搜索的表单
const queryParams = reactive({
  typeId: undefined, //应用类型
  taskParam: undefined, //任务
  programParam: undefined, //程序
  serviceCode: undefined, //业务编码
  executeResult: ['失败', '失败已处理', '告警'], //结果
  superintendent: undefined, //负责人
  startTime: undefined, //开始时间
  endTime: undefined, //结束时间
  groupType: undefined //应用类型
})

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  timeRange.value = [startOfDay, endOfDay]
  handleQuery()
}

// 搜索条件选项 结果
const resultOptions = [
  { label: '成功', value: '成功' },
  { label: '失败', value: '失败' },
  { label: '失败已处理', value: '失败已处理' },
  { label: '告警', value: '告警' }
]

const chartDom = ref<HTMLElement | null>(null)
const chartDom2 = ref<HTMLElement | null>(null)

let myChart: echarts.ECharts | null = null
let myChart2: echarts.ECharts | null = null
const excuteMap = ref<any>({})
const handleMap = ref<any>({})

const initChart = () => {
  if (chartDom.value) {
    myChart = echarts.init(chartDom.value)
    const option: EChartsOption = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {},
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          name: '节点',
          data: handleData('xAxis'),
          axisLabel: {
            interval: 0, //使x轴文字显示全
            formatter: function (params) {
              let newParamsName = ''
              const paramsNameNumber = params.length // 文字总长度
              const provideNumber = 9 //一行显示几个字
              const rowNumber = Math.ceil(paramsNameNumber / provideNumber)
              if (paramsNameNumber > provideNumber) {
                for (let p = 0; p < rowNumber; p++) {
                  const start = p * provideNumber
                  const end = start + provideNumber
                  const tempStr =
                    p === rowNumber - 1
                      ? params.substring(start, paramsNameNumber)
                      : params.substring(start, end) + '\n'
                  newParamsName += tempStr
                }
              } else {
                newParamsName = params
              }
              return newParamsName
            }
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '数量'
        }
      ],
      series: [
        {
          name: '成功',
          type: 'bar',
          stack: 'Ad',
          emphasis: {
            focus: 'series'
          },
          itemStyle: {
            color: '#509863'
          },
          data: handleData('yAxis_success')
        },
        {
          name: '失败已处理',
          type: 'bar',
          stack: 'Ad',
          emphasis: {
            focus: 'series'
          },
          itemStyle: {
            color: '#d4b45b'
          },
          data: handleData('yAxis_fail_handle')
        },
        {
          name: '失败',
          type: 'bar',
          stack: 'Ad',
          emphasis: {
            focus: 'series'
          },
          itemStyle: {
            color: '#d25d5a'
          },
          data: handleData('yAxis_fail')
        }
      ]
    }
    option && myChart.setOption(option)
  }
}
const initChart2 = () => {
  chartDom2.value = document.getElementById('main2')
  if (chartDom.value) {
    myChart2 = echarts.init(chartDom2.value)
    const option: EChartsOption = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {},
      xAxis: {
        type: 'category',
        name: '影刀异常二级分类',
        data: getHandleData('xAxis'),
        axisLabel: {
          interval: 0, //使x轴文字显示全
          formatter: function (params) {
            let newParamsName = ''
            const paramsNameNumber = params.length // 文字总长度
            const provideNumber = 6 //一行显示几个字
            const rowNumber = Math.ceil(paramsNameNumber / provideNumber)
            if (paramsNameNumber > provideNumber) {
              for (let p = 0; p < rowNumber; p++) {
                const start = p * provideNumber
                const end = start + provideNumber
                const tempStr =
                  p === rowNumber - 1
                    ? params.substring(start, paramsNameNumber)
                    : params.substring(start, end) + '\n'
                newParamsName += tempStr
              }
            } else {
              newParamsName = params
            }
            return newParamsName
          }
        }
      },
      yAxis: {
        type: 'value',
        name: '数量'
      },
      series: [
        {
          data: getHandleData('yAxis'),
          type: 'bar'
        }
      ]
    }
    option && myChart2.setOption(option)
  }
}
const loading = ref(false)
const getChartData = async () => {
  loading.value = true
  try {
    let tempQueryParams = { ...queryParams }
    if (tempQueryParams.executeResult && tempQueryParams.executeResult.length > 0) {
      tempQueryParams.executeResult = tempQueryParams.executeResult.join(',')
    }

    if (timeRange.value && timeRange.value.length > 0) {
      const endDate = new Date(timeRange.value[1]) // 结束时间始终在 23:59:59 结束
      endDate.setHours(23, 59, 59, 0)
      tempQueryParams.startTime = formatDate(new Date(timeRange.value[0]))
      tempQueryParams.endTime = formatDate(endDate)
    }

    const res = await DashboardApi.getChartData(tempQueryParams)
    excuteMap.value = res.excuteMap
    handleMap.value = res.handleMap
    console.log(res)
  } catch (error) {
    console.error('Error', error)
  } finally {
    loading.value = false
  }
}
// 处理程序运行数据
const handleData = (returnType) => {
  const excuteMapData = excuteMap.value
  const yAxisSuccessData = []
  const yAxisFailData = []
  const yAxisFailHandleData = []
  const xAxisData = []
  for (let i in excuteMapData) {
    xAxisData.push(i)
    yAxisFailData.push(excuteMapData[i]['失败'])
    yAxisFailHandleData.push(excuteMapData[i]['失败已处理'])
    yAxisSuccessData.push(excuteMapData[i]['成功'])
  }
  if (returnType === 'xAxis') {
    return xAxisData
  } else if (returnType === 'yAxis_success') {
    return yAxisSuccessData
  } else if (returnType === 'yAxis_fail') {
    return yAxisFailData
  } else if (returnType === 'yAxis_fail_handle') {
    return yAxisFailHandleData
  }
}

// 处理异常二级错误指标数据
const getHandleData = (returnType) => {
  const handleMapData = handleMap.value
  const labelArray = []
  const countArray = []
  for (const key in handleMapData) {
    if (handleMapData.hasOwnProperty(key)) {
      const label = getDictLabel(handleMapData[key]['一级异常'], key)
      labelArray.push(label)
      countArray.push(handleMapData[key]['count'])
    }
  }
  if (returnType === 'xAxis') {
    return labelArray
  } else if (returnType === 'yAxis') {
    return countArray
  }
}

// 统一处理resize事件
const handleResize = () => {
  console.log('---resize---')
  if (myChart) {
    myChart && myChart.resize()
  }
  if (myChart2) {
    myChart2 && myChart2.resize()
  }
}

// 在组件卸载前移除resize监听器
onBeforeUnmount(() => {
  console.log('before unmount')
  // 移除resize监听器
  window.removeEventListener('resize', handleResize)
  // 销毁echarts实例
  if (myChart) {
    myChart.dispose()
    myChart = null
    console.log('dispose myChart', myChart)
  }
  if (myChart2) {
    myChart2.dispose()
    myChart2 = null
  }
})

/** 搜索按钮操作 */
const handleQuery = debounce(async () => {
  await getChartData()
  initChart()
  initChart2()
}, 200)

onMounted(async () => {
  await getChartData()
  chartDom.value = document.getElementById('main')
  chartDom2.value = document.getElementById('main2')

  initChart()
  initChart2()
  // 添加resize监听器
  window.addEventListener('resize', handleResize)
})
</script>
<style lang="scss" scoped>
// 加载中的效果
.loading-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f6f8fa;
  // height: 522px;

  z-index: 9999;
  .loading-text {
    position: absolute;
    top: 20%;
  }
}

:deep(.el-input__wrapper) {
  padding: 0 11px !important;
}
</style>
