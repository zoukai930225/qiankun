<template>
  <div>
    <!-- 列表 -->
    <ContentWrap>
      <div class="commonTopFilterWrap">
        <div class="commonTopFilterWrap-filter">
          <el-form ref="queryFormRef" :inline="true" :model="queryParams" class="-mb-15px" label-width="68px">
            <el-form-item label="运行节点" prop="node">
              <el-select style="width: 200px" v-model="queryParams.node" placeholder="请选择运行节点" :clearable="false"
                @change="handleQuery">
                <el-option v-for="dict in nodeManageList" :key="dict.id" :label="getNodeLabel(dict)" :value="dict.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="浏览器" prop="browser">
              <el-select style="width: 200px" v-model="queryParams.browser" placeholder="请选择浏览器" clearable
                @change="handleQuery">
                <el-option v-for="dict in getIntDictOptions(DICT_TYPE.YINGDAO_BROWSER, true)" :key="dict.value"
                  :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="渠道" prop="channel">
              <el-select style="width: 200px" v-model="queryParams.channel" placeholder="请选择渠道" clearable
                @change="handleQuery">
                <el-option v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_CHANNEL, true)" :key="dict.value"
                  :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="日期:" prop="date">
              <el-date-picker v-model="queryParams.date" value-format="YYYY-MM-DD" type="date" placeholder="请选择日期时间"
                class="!w-200px" @change="handleQuery" />
            </el-form-item>
            <el-form-item v-show="isExpand" label="应用" prop="groupName">
              <el-input v-model="queryParams.groupName" clearable placeholder="请输入" @clear="handleQuery"
                @keyup.enter="handleQuery" style="width: 200px" />
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
          <NodeTimeDiagrmaChart :height="chartHeight()" v-show="chartShow" :ref="getNodeTimeDiagrmaChartRef"
            :option="getChartOptions(value, index)" @echart-click="echartClick" />
        </div>
        <div v-show="value.isExpand" style="height: 20px"></div>
      </div>
    </ContentWrap>

    <DetailDrawer ref="detailDrawerRef" type="dynamic" @success="getList" />
  </div>
</template>

<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { formatDate } from '@/utils/formatTime'
import NodeTimeDiagrmaChart from '@/components/SWChart/timeDiagrma/nodeTimeDiagrmaChart.vue'
import SWFilterExpandAll from '@/components/SWBaseComponent/SWFilterExpandAll/index.vue' // 展开组件
import DetailDrawer from './components/detailDrawer.vue'

import * as TimeDagrmaApi from '@/api/rpaManage/timeDagrma'
import * as NodeManageApi from '@/api/rpaManage/nodeManage'

defineOptions({ name: 'TimeDiagrmaDynamic' })
const isExpand = ref(false) // 是否展开
const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref<any[]>([]) // 表格数据
const queryParams = ref({
  node: '',
  browser: '',
  channel: '',
  date: '',
  groupName: ''
})

// 获取当前日期
queryParams.value.date = formatDate(new Date(), 'YYYY-MM-DD')

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
    runtime: true,
    yAxisData: value.list,
    beginTimes: value.beginTimes,
    endTimes: value.endTimes,
    addInterval: value.addInterval,
    resultList: value.resultList,
    handleList: value.handleList
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
      date: queryParams.value.date || '',
      groupName: queryParams.value.groupName || ''
    }
    const data = await TimeDagrmaApi.getRuntimeTimeDagrmaList(param).catch(() => {
      loading.value = false
    })
    list.value = data || []
    handleRequestResult()
    total.value = data.total
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
    nodeManageList.value = data?.data || [];
    const tar: any = nodeManageList.value.find((ns: any) => getNodeLabel(ns) === 'executor1@zhouwen');
    queryParams.value.node = tar?.id || '';
  }
}

nodeTimeDiagrmaChartRefList.value = []
const nodeList = ref([])
// 处理请求结果
const handleRequestResult = () => {
  let beginTimes = []
  let endTimes = []
  let nodeNameList = []
  let resultList = []
  let handleList = []
  let minSpaceInterval = 0
  let maxSpaceInterval = 0
  if (list.value?.length > 0) {
    list.value.forEach((item, index) => {
      const startTimestamp = new Date(item.startTime).getTime()
      const endTimestamp = new Date(item.endTime).getTime()
      const spaceInterval = endTimestamp - startTimestamp
      if (minSpaceInterval === 0) {
        minSpaceInterval = spaceInterval
      } else {
        if (spaceInterval < minSpaceInterval) {
          minSpaceInterval = spaceInterval
        }
      }
      if (maxSpaceInterval === 0) {
        maxSpaceInterval = spaceInterval
      } else {
        if (spaceInterval > maxSpaceInterval) {
          maxSpaceInterval = spaceInterval
        }
      }
      beginTimes.push(item.startTime)
      endTimes.push(item.endTime)
      nodeNameList.push(item.sktname)
      resultList.push(item.executeResult)
      handleList.push(item.isHandle ? true : false)
    })
  }

  const addInterval = 1000 * 60 * 5
  const addEndTimes = []
  endTimes.forEach((item) => {
    const timestamp = new Date(item).getTime() + addInterval
    addEndTimes.push(formatDate(new Date(timestamp)))
  })
  nodeList.value = []
  nodeList.value.push({
    name: '',
    list: nodeNameList,
    beginTimes: beginTimes,
    endTimes: addEndTimes,
    resultList: resultList,
    handleList: handleList,
    addInterval: addInterval,
    isExpand: true
  })
  setTimeout(() => {
    nodeTimeDiagrmaChartRefList.value?.forEach((item: any, _) => {
      item.setChartOptions()
      item.resizeHandler()
    })
  })
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
      detailDrawerRef.value.open(id, true)
    }
  }
}

/** 初始化 **/
onMounted(async () => {
  await getNodeLst()
  getList()

})
</script>

<style lang="scss" scoped>
.timeDiagrmaBg {
  // background: #ffffff;
  // border-radius: 8px;
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
    padding-top: 10px;
    margin-top: 0px;
    margin-bottom: -10px;
    border: 1px solid #e5e5e5;
  }
}
</style>
