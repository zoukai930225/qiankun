<template>
  <div>
    <!-- 列表 -->
    <ContentWrap>
      <div class="commonTopFilterWrap">
        <div class="commonTopFilterWrap-filter">
          <el-form
            ref="queryFormRef"
            :inline="true"
            :model="queryParams"
            class="-mb-15px"
            label-width="68px"
          >
            <el-form-item label="运行节点" prop="node">
              <el-select
                style="width: 200px"
                v-model="queryParams.node"
                placeholder="请选择运行节点"
                clearable
                @change="handleQuery"
              >
                <el-option
                  v-for="dict in nodeManageList"
                  :key="dict.id"
                  :label="getNodeLabel(dict)"
                  :value="dict.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="浏览器" prop="browser">
              <el-select
                style="width: 200px"
                v-model="queryParams.browser"
                placeholder="请选择浏览器"
                clearable
                @change="handleQuery"
              >
                <el-option
                  v-for="dict in getIntDictOptions(DICT_TYPE.YINGDAO_BROWSER, true)"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="渠道" prop="channel">
              <el-select
                style="width: 200px"
                v-model="queryParams.channel"
                placeholder="请选择渠道"
                clearable
                @change="handleQuery"
              >
                <el-option
                  v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_CHANNEL, true)"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="应用" prop="groupName">
              <el-input
                v-model="queryParams.groupName"
                clearable
                placeholder="请输入"
                @clear="handleQuery"
                @keyup.enter="handleQuery"
                style="width: 200px"
              />
            </el-form-item>
          </el-form>
        </div>
        <div class="commonTopFilterWrap-search">
          <div class="commonTopFilterWrap-search-container">
            <el-button @click="handleQuery" class="commonSearchBtn">
              <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
              搜索
            </el-button>
            <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0px">
              重置
            </el-button>
          </div>
        </div>
      </div>
    </ContentWrap>
    <ContentWrap>
      <div class="timeDiagrmaBg" v-for="(value, index) in nodeList" :key="index">
        <!-- <div class="timeDiagrmaBg-node" @click="value.isExpand = !value.isExpand">
        <el-icon class="timeDiagrmaBg-node-icon">
          <CaretBottom v-if="value.isExpand" />
          <CaretTop v-else />
        </el-icon>
        <div class="timeDiagrmaBg-node-text">{{ value.name }}</div>
      </div> -->
        <div style="height: 20px"></div>
        <div v-show="value.isExpand" class="timeDiagrmaBg-chartBg">
          <NodeTimeDiagrmaChart
            :height="chartHeight()"
            v-show="chartShow"
            :ref="getNodeTimeDiagrmaChartRef"
            :option="getChartOptions(value, index)"
            @echart-click="echartClick"
          />
        </div>
        <div v-show="value.isExpand" style="height: 20px"></div>
      </div>
    </ContentWrap>

    <DetailDrawer ref="detailDrawerRef" type="static" @success="getList" />
  </div>
</template>

<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { formatDate } from '@/utils/formatTime'
import NodeTimeDiagrmaChart from '@/components/SWChart/timeDiagrma/nodeTimeDiagrmaChart.vue'

import DetailDrawer from './components/detailDrawer.vue'

import * as TimeDagrmaApi from '@/api/rpaManage/timeDagrma'
import * as NodeManageApi from '@/api/rpaManage/nodeManage'

defineOptions({ name: 'TimeDiagrma' })
const loading = ref(true) // 列表的加载中
const list = ref<any[]>([]) // 表格数据
const queryParams = ref({
  node: '',
  browser: '',
  channel: '',
  groupName: ''
})
const chartShow = ref(true) // 图表是否显示
const queryFormRef = ref() // 搜索的表单
const detailDrawerRef = ref()

let nodeTimeDiagrmaChartRefList = ref<HTMLElement[]>([])
const getNodeTimeDiagrmaChartRef = (el: any) => {
  if (el) {
    nodeTimeDiagrmaChartRefList.value.push(el)
  }
}
const getChartOptions = (value: any, index) => {
  return {
    nodeName: '时序图',
    legendColor: '#0064FF',
    runtime: false,
    yAxisData: value.list,
    beginTimes: value.beginTimes,
    endTimes: value.endTimes,
    addInterval: value.addInterval
  }
}

const chartHeight = () => {
  if (list.value.length === 0) {
    return '440px'
  } else {
    if (24 * list.value.length < 440) {
      return '440px'
    }
    return `${24 * list.value.length}px`
  }
}
/** 查询字典类型列表 */
const getList = async () => {
  loading.value = true
  try {
    const param = {
      node: queryParams.value.node || '',
      browser: queryParams.value.browser || '',
      channel: queryParams.value.channel || '',
      groupName: queryParams.value.groupName || ''
    }
    const data = await TimeDagrmaApi.getTimeDagrmaList(param).catch(() => {
      loading.value = false
    })
    if (data) {
      list.value = data || []
      handleRequestResult()
    }
  } finally {
    loading.value = false
  }
}

const nodeManageList = ref([])

const getNodeLabel = (dict: any) => {
  return dict.loginUserName ? dict.loginUserName : ''
}
// 获取运行节点
const getNodeLst = async () => {
  const data = await NodeManageApi.getNodeManageList({ page: 1, size: 999999 }).catch(() => {
    loading.value = false
  })
  if (data && data.data) {
    nodeManageList.value = data?.data || []
  }
}

nodeTimeDiagrmaChartRefList.value = []
const nodeList = ref([])
// 处理请求结果
const handleRequestResult = () => {
  let beginTimes = []
  let endTimes = []
  let nodeNameList = []
  const currentDateStr = getCurrentDateYYYYMMDD()
  let minTimeInterval = 0
  let maxTimeInterval = 0
  if (list.value?.length > 0) {
    list.value.forEach((item) => {
      const startTime = `${currentDateStr} ${item.time}`
      const startTimestamp = new Date(startTime).getTime()
      if (minTimeInterval === 0) {
        minTimeInterval = startTimestamp
      } else {
        if (startTimestamp < minTimeInterval) {
          minTimeInterval = startTimestamp
        }
      }
      if (maxTimeInterval === 0) {
        maxTimeInterval = startTimestamp
      } else {
        if (startTimestamp > maxTimeInterval) {
          maxTimeInterval = startTimestamp
        }
      }
    })
  }
  const addInterval = (maxTimeInterval - minTimeInterval) / 100
  if (list.value?.length > 0) {
    list.value.forEach((item) => {
      const startTime = `${currentDateStr} ${item.time}`
      const startTimestamp = new Date(startTime).getTime()
      const endTimestamp = startTimestamp + addInterval
      beginTimes.push(startTime)
      endTimes.push(formatDate(new Date(endTimestamp)))
      nodeNameList.push(item.sktname)
    })
  }
  nodeList.value = []
  nodeList.value.push({
    name: '',
    list: nodeNameList,
    beginTimes: beginTimes,
    endTimes: endTimes,
    addInterval: 0,
    isExpand: true
  })
  setTimeout(() => {
    nodeTimeDiagrmaChartRefList.value?.forEach((item: any, _) => {
      item.setChartOptions()
      item.resizeHandler()
    })
  })
}

const getCurrentDateYYYYMMDD = () => {
  const dateObj = new Date()
  const year = dateObj.getFullYear() // 获取当前年份
  const month = ('0' + (dateObj.getMonth() + 1)).slice(-2) // 获取当前月份，其中需要将月份加1，因为月份是从0开始计数的
  const day = ('0' + dateObj.getDate()).slice(-2) // 获取当前日期
  const formattedDate = `${year}-${month}-${day}` // 格式化日期
  return formattedDate
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.page = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

// 时序图点击
const echartClick = (e: any) => {
  if (detailDrawerRef.value) {
    let id = ''
    if (e.dataIndex < list.value?.length) {
      id = list.value[e.dataIndex].id
    }
    if (id) {
      detailDrawerRef.value.open(id, false)
    }
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
  getNodeLst()
})
</script>

<style lang="scss" scoped>
.timeDiagrmaBg {
  // background: #ffffff;
  // border-radius: 8px;
  // background: red;
  // margin-bottom: 20px;
  margin-top: -20px;
  &-node {
    display: flex;
    flex-direction: row;
    margin-left: 20px;
    padding-top: 12px;
    padding-bottom: 16px;
    cursor: pointer;
    &-icon {
      margin-right: 6px;
    }
    &-text {
      font-size: 14px;
      color: #333333;
      line-height: 20px;
    }
  }
  &-chartBg {
    // margin: 20px;
    padding-top: 10px;
    margin-top: 0px;
    margin-bottom: -10px;
    border: 1px solid #e5e5e5;
  }
}
</style>
