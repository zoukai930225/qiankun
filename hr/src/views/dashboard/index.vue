<template>
  <div class="Dashboard">
    <topHeader
      class="Dashboard-header"
      @send-date-select="sendDateSelect"
      :activeName="activeName"
    />

    <div class="flex flex-start justify-between">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-change="handleClick">
        <el-tab-pane label="卡片" name="first"> </el-tab-pane>
        <el-tab-pane label="表格" name="second"> </el-tab-pane>
        <el-tab-pane label="图形" name="third"> </el-tab-pane>
        <el-tab-pane label="桑基图" name="fourth"> </el-tab-pane>
        <el-tab-pane label="任务状态" name="taskStatus"> </el-tab-pane>
        <el-tab-pane label="执行记录" name="fifth"> </el-tab-pane>
        <el-tab-pane label="BI清洗看板" name="biclean"> </el-tab-pane>
      </el-tabs>
      <div id="dashboard-count-wrapper"></div>
    </div>
    <CardList
      v-if="activeName === 'first' && isInit"
      ref="cardListRef"
      class="Dashboard-cardList"
      teleportTo="#dashboard-count-wrapper"
      :init-params="dateParams"
    />
    <TableList v-if="activeName === 'second'" class="Dashboard-tableList" />
    <Chart class="Dashboard-chart" v-if="activeName === 'third'" />
    <SankeyChart v-if="activeName === 'fourth'" key="SankeyChart" />

    <TaskStatus
      v-if="activeName === 'taskStatus'"
      class="Dashboard-taskStatus"
      @jump-to-execution="handleJumpToExecution"
    />

    <ExecutionRecord v-if="activeName === 'fifth'" key="ExecutionRecord" ref="executionRecordRef" />
    <biClear v-if="activeName === 'biclean'" key="BiClean" ref="bicleanRef" />
  </div>
</template>
<script lang="ts" setup>
import TopHeader from './components/topHeader.vue'
import CardList from './components/cardList.vue'
import TableList from './components/tableList.vue'
import Chart from './components/chart.vue'
import SankeyChart from './components/sankeyChart.vue'
import TaskStatus from './components/taskStatus.vue'
import ExecutionRecord from './components/executionRecord.vue'
import * as rpaApi from '@/api/rpaManage'
import * as rpaProgramTypeApi from '@/api/rpaManage/programType'
import { useRpaDashboardStore } from '@/store/modules/rpaDashboard'
import biClear from './biClear/page/index.vue'

defineOptions({
  name: 'Dashboard'
})

const rpaDashboardData = useRpaDashboardStore()
const activeName = ref('')
const dateParams = ref({})
const isInit = ref(false)

const cardListRef = ref()
const sendDateSelect = (data) => {
  dateParams.value = data
  if (!isInit.value) {
    isInit.value = true
    return
  }
  nextTick(() => {
    if (cardListRef.value) {
      cardListRef.value.getQueryParams(data)
    }
  })
}

const handleClick = (tab: any) => {
  activeName.value = tab
  // console.log('activeName', activeName.value);
}

// 获取用户列表
const getUserList = async () => {
  let data = await rpaApi.getUserList({ page: 1, size: 99999 })
  rpaDashboardData.resUserList = data.data
}

// 查询应用类型
const getTypeList = async () => {
  let data = await rpaProgramTypeApi.getProgramTypeList({ page: 1, pageSize: 99999 })
  rpaDashboardData.typeList = data.records
}
const route = useRoute()
const executionRecordRef = ref()

const setRouterInfo = () => {
  let params: Object = {}
  const param: any = route.params
  const query: any = route.query
  Object.keys(param).forEach((key) => {
    params[key] = param[key]
  })
  Object.keys(query).forEach((key) => {
    params[key] = query[key]
  })

  Object.keys(params).forEach((key) => {
    executionRecordRef.value?.setQueryParams(key, params[key])
  })
  if (Object.keys(params).length !== 0) {
    const newUrl = window.location.href.replace(/\?.*$/, '')
    history.replaceState({}, '', newUrl)
    executionRecordRef.value?.getList()
  }
}

// 处理从 TaskStatus 跳转过来的请求
const handleJumpToExecution = (params: any) => {
  activeName.value = 'fifth' // 切换到执行记录 tab
  nextTick(() => {
    if (executionRecordRef.value) {
      // 批量设置查询参数并刷新
      executionRecordRef.value.setBatchQueryParams(params)
    }
  })
}

onMounted(() => {
  handleClick(route.query?.activeName || 'first')
  nextTick(() => {
    setRouterInfo()
  })
  getUserList()
  getTypeList()
})
</script>

<style scoped lang="scss">
.Dashboard {
  padding: 15px;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: #f6f8fa;
  &-cardList {
    width: 100%;
  }
  &-chart {
    width: 100%;
    height: 500px;
  }

  :deep(.el-tabs__nav-wrap::after) {
    position: static !important;
  }
  #dashboard-count-wrapper {
    z-index: 1000;
    margin: 10px 0 0 0;
  }
}
</style>
