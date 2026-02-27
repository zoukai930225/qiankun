<!--
 * @Description: 客服问题反馈数据统计
-->
<template>
  <div class="board-section" v-loading="loading">
    <!-- 标题和搜索 -->
    <div class="section-header">
      <div class="section-filters">
        <label for="directorId">负责人</label>
        <!-- <SelectUser
          v-model="queryParams.directorId"
          placeholder="请选择问题对接负责人"
          :multiple="false"
          :showAvatarLable="true"
          :role="getRole('客服处理人')"
          @change="handleSearch"
        /> -->
        <el-input
          v-model="queryParams.name"
          clearable
          @change="handleSearch"
          @keyup.enter="handleSearch"
          placeholder="请输入问题对接负责人"
        />
      </div>
    </div>

    <div class="board-content">
      <!-- 数据卡片 -->
      <data-card :cards="cardData" />

      <!-- 统计表格 -->
      <div class="table-container">
        <statistics-table
          table-title="客服问题反馈列表"
          :table-data="tableData"
          :columns="tableColumns"
          @cell-click="handleCellClick"
        />
      </div>
    </div>
  </div>
</template>

<script lang="tsx" setup>
import dayjs from 'dayjs'
import { useRouter } from 'vue-router'
import DataCard from './DataCard.vue'
import StatisticsTable, { TableColumn } from './StatisticsTable.vue'
import request from '@/config/axios'
import SelectUser from '@/components/common/user/selectUser.vue'
import { useRole } from '@/hooks/common/useRole'
import { useRouteInfo } from '@/hooks/common/useRouteInfo'
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import cardIcon1 from '@/assets/svgs/customerService/dataBoard/card-icon1.svg'
import cardIcon2 from '@/assets/svgs/customerService/dataBoard/card-icon2.svg'
import cardIcon3 from '@/assets/svgs/customerService/dataBoard/card-icon3.svg'
import cardIcon4 from '@/assets/svgs/customerService/dataBoard/card-icon4.svg'
const statusList = getIntDictOptions(DICT_TYPE.CS_PROBLEM_FEEDBACK_STATUS, true)
const finishStatusList = getIntDictOptions(DICT_TYPE.CS_PROBLEM_FEEDBACK_FINISH_STATUS, true)
console.log(statusList, 'statusList')
const { getPermissionInfo, getRole, roleList } = useRole('客服')
const { getRouteInfo } = useRouteInfo()
const router = useRouter()
const { selectedDay } = inject('customerServiceDataBoard') as { selectedDay: Ref<string> }
const loading = ref(false)
// 查询参数
const queryParams = ref({
  // date: selectedDay.value,
  directorId: '',
  name: ''
})
// 卡片数据
const cardData = ref([
  {
    label: '问题登记量',
    value: 0,
    clickable: true,
    icon: cardIcon1,
    onClick: () => jumpToList('all')
  },
  {
    label: '问题完成量',
    value: 0,
    clickable: true,
    icon: cardIcon2,
    onClick: () => jumpToList('completed')
  },
  {
    label: '问题未完成量',
    value: 0,
    clickable: true,
    icon: cardIcon3,
    onClick: () => jumpToList('uncompleted')
  },
  {
    label: '问题未处理量',
    value: 0,
    clickable: true,
    icon: cardIcon4,
    onClick: () => jumpToList('unprocessed')
  }
])

// 表格列配置
const tableColumns: TableColumn[] = [
  { prop: 'name', label: '对接人', minWidth: 100, clickable: true, align: 'left' },
  { prop: 'wtsl', label: '问题数量', minWidth: 100, clickable: true },
  { prop: 'wcl', label: '问题完成量', minWidth: 120, clickable: true },
  { prop: 'wwc', label: '问题未完成量', minWidth: 130, clickable: true },
  { prop: 'wclsl', label: '问题未处理量', minWidth: 130, clickable: true },
  { prop: 'aswcsl', label: '24H内完成量', minWidth: 130, clickable: true },
  { prop: 'aswcl', label: '24H完成率', minWidth: 120 },
  {
    prop: 'zwcl',
    label: '问题完成进度',
    minWidth: 150,
    type: 'progress',
    clickable: false
  }
]

// 表格数据
const tableData = ref([])

// 获取数据
const getData = async () => {
  try {
    loading.value = true
    const res = await request.get({
      url: '/api/csProblemFeedback/kfStatistics',
      params: {
        startDate:
          typeof selectedDay.value === 'string' ? selectedDay.value : selectedDay.value?.[0],
        endDate: typeof selectedDay.value === 'string' ? selectedDay.value : selectedDay.value?.[1],
        // directorId: queryParams.value.directorId
        name: queryParams.value.name
      }
    })
    console.log(res)
    // 更新卡片数据
    cardData.value[0].value = res.wtsls
    cardData.value[1].value = res.wcls
    cardData.value[2].value = res.wwcs
    cardData.value[3].value = res.wclsls
    // 更新表格数据（按问题数量降序排序）
    tableData.value = res.datas
  } catch (error) {
    console.error('获取数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  getData()
}

// 跳转到列表页
const jumpToList = (type: string) => {
  const query: any = {
    feedbackDate:
      typeof selectedDay.value === 'string'
        ? [selectedDay.value, selectedDay.value]
        : selectedDay.value
  }

  // 根据类型设置状态筛选
  switch (type) {
    case 'completed':
      query.statusList = [statusList.find((item: any) => item.label === '已完成')?.value]
      break
    case 'uncompleted':
      query.statusList = [
        ...statusList
          .filter((item: any) => ['进行中', '待开始'].includes(item.label))
          ?.map((item: any) => item.value)
      ]
      break
    case 'unprocessed':
      query.statusList = [statusList.find((item: any) => item.label === '待开始')?.value]
      break
  }

  if (queryParams.value.name) {
    query.directorName = queryParams.value.name
  }

  console.log(query, getRouteInfo('problemFeedback'))
  router.push({
    path: getRouteInfo('problemFeedback'),
    query
  })
}

// 表格单元格点击
const handleCellClick = (row: any, column: any) => {
  const feedBackOptions: any = {
    avatarOrigin: row.avatarOrigin,
    realName: row.name,
    userId: row.directorId,
    dept: ''
  }

  const query: any = {
    feedbackDate:
      typeof selectedDay.value === 'string'
        ? [selectedDay.value, selectedDay.value]
        : selectedDay.value,
    directorId: row.directorId,
    feedBackOptions: JSON.stringify(feedBackOptions)
  }

  // 根据列类型设置状态筛选
  switch (column.prop) {
    case 'wcl':
      query.statusList = [statusList.find((item: any) => item.label === '已完成')?.value]
      break
    case 'wwc':
      query.statusList = [
        ...statusList
          .filter((item: any) => ['进行中', '待开始'].includes(item.label))
          ?.map((item: any) => item.value)
      ]
      break
    case 'wclsl':
      query.statusList = [statusList.find((item: any) => item.label === '待开始')?.value]
      break
    case 'aswcsl':
      // query.feedbackDate = [dayjs().format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]
      query.finishStatusList = [
        finishStatusList.find((item: any) => item.label === '按时完成')?.value
      ]
      break
  }

  router.push({
    path: getRouteInfo('problemFeedback'),
    query
  })
}
onMounted(() => {
  getPermissionInfo(() => {
    getData()
  })
})
defineExpose({
  getData
})
</script>

<style lang="scss" scoped>
@use './style.scss';
</style>
