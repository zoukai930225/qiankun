<!--
 * @Description: 客服仓库反馈数据统计
-->
<template>
  <div class="board-section" v-loading="loading">
    <!-- 标题和搜索 -->
    <div class="section-header">
      <div class="section-filters">
        <label for="module">所属模块</label>
        <el-select
          v-model="queryParams.module"
          placeholder="请选择所属模块"
          filterable
          @change="handleSearch"
        >
          <el-option
            v-for="item in userOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="section-filters">
        <label for="registrar">登记人</label>
        <!-- <SelectUser
          v-model="queryParams.registrar"
          placeholder="请选择登记人"
          :multiple="false"
          style="width: 220px"
          :showAvatarLable="true"
          :role="getRole('客服仓库')"
          @change="handleSearch"
        /> -->
        <el-input
          v-model="queryParams.name"
          clearable
          @change="handleSearch"
          @keyup.enter="handleSearch"
          placeholder="请输入登记人"
        />
      </div>
    </div>
    <div class="board-content">
      <!-- 数据卡片 -->
      <data-card :cards="cardData" />

      <!-- 统计表格 -->
      <div class="table-container">
        <statistics-table
          table-title="客服仓库反馈列表"
          :table-data="tableData"
          :columns="tableColumns"
          @cell-click="handleCellClick"
        />
      </div>
    </div>
  </div>
</template>

<script lang="tsx" setup>
import { useRouter } from 'vue-router'
import DataCard from './DataCard.vue'
import StatisticsTable, { TableColumn } from './StatisticsTable.vue'
import request from '@/config/axios'
import SelectUser from '@/components/common/user/selectUser.vue'
import { useRole } from '@/hooks/common/useRole'
import { useRouteInfo } from '@/hooks/common/useRouteInfo'
import { tabsOptions } from '../../warehouseDocking/components/utils'
import cardIcon5 from '@/assets/svgs/customerService/dataBoard/card-icon5.svg'
import cardIcon6 from '@/assets/svgs/customerService/dataBoard/card-icon6.svg'
import cardIcon7 from '@/assets/svgs/customerService/dataBoard/card-icon7.svg'
const { permissionList, getPermissionInfo, getRole } = useRole('客服')
const roles = computed(() => permissionList.value.map((ps: any) => ps.name).join(','))
const userOptions = computed(() => tabsOptions(roles.value))
const { getRouteInfo } = useRouteInfo()
const router = useRouter()
const { selectedDay } = inject('customerServiceDataBoard') as { selectedDay: Ref<string> }
const loading = ref(false)
// 查询参数
const queryParams = ref({
  // date: selectedDay.value,
  module: userOptions.value[0]?.value,
  registrar: '',
  name: ''
})

// 卡片数值（单独存储，用于响应式更新）
const cardValues = ref({
  total: 0,
  processed: 0,
  unprocessed: 0
})

// 卡片数据（使用 computed 实现响应式）
const cardData = computed(() => [
  {
    label: '问题登记量',
    value: cardValues.value.total,
    clickable: true,
    icon: cardIcon5,
    onClick: () => jumpToList('all')
  },
  {
    label: '问题已处理量',
    value: cardValues.value.processed,
    clickable: true,
    icon: cardIcon6,
    onClick: () => jumpToList('processed')
  },
  {
    label: '问题未处理量',
    value: cardValues.value.unprocessed,
    clickable: queryParams.value.module !== '4',
    icon: cardIcon7,
    onClick: () => jumpToList('unprocessed')
  }
])
// 表格列配置
const tableColumns = computed(() => {
  const columns: TableColumn[] = [
    { prop: 'name', label: '登记人', minWidth: 100, clickable: true, align: 'left' },
    { prop: 'wtsl', label: '问题登记量', minWidth: 120, clickable: true },
    { prop: 'wcl', label: '问题已处理量', minWidth: 130, clickable: true },
    {
      prop: 'wwc',
      label: '问题未处理量',
      minWidth: 130,
      clickable: queryParams.value.module !== '4'
    },
    { prop: 'aswcsl', label: '24h内已处理量', minWidth: 140, clickable: false },
    {
      prop: 'aswcl',
      label: '24h处理率',
      minWidth: 120,
      clickable: false
    },
    {
      prop: 'wtcljd',
      label: '问题处理进度',
      minWidth: 120,
      type: 'progress',
      clickable: false
    }
  ]
  return columns
})

// 表格数据
const tableData = ref([])

// 获取数据
const getData = async () => {
  try {
    loading.value = true
    const res = await request.get({
      url: '/api/csProblemFeedback/kcStatistics',
      params: {
        startDate:
          typeof selectedDay.value === 'string' ? selectedDay.value : selectedDay.value?.[0],
        endDate: typeof selectedDay.value === 'string' ? selectedDay.value : selectedDay.value?.[1],
        ssmk: queryParams.value.module,
        // directorId: queryParams.value.registrar
        name: queryParams.value.name
      }
    })
    cardValues.value.total = res.wtsls
    cardValues.value.processed = res.wcls
    cardValues.value.unprocessed = res.wwcs
    tableData.value = res.datas.map((item: any) => ({
      ...item,
      wtcljd: (item.wcl / item.wtsl) * 100
    }))
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
    registrationTime:
      typeof selectedDay.value === 'string'
        ? [selectedDay.value, selectedDay.value]
        : selectedDay.value
  }

  // 根据类型设置处理状态筛选
  switch (type) {
    case 'processed':
      query.isHandle = 1
      break
    case 'unprocessed':
      query.isHandle = 0
      break
  }
  if (queryParams.value.module) {
    query.tabValue = queryParams.value.module
  }
  if (queryParams.value.name) {
    query.registrarName = queryParams.value.name
  }
  if (queryParams.value.registrar) {
    query.registrar = [queryParams.value.registrar]
  }

  router.push({
    path: getRouteInfo('warehouseDocking'),
    query
  })
}

// 表格单元格点击
const handleCellClick = (row: any, column: any) => {
  // const feedBackOptions: any = {
  //   avatarOrigin: row.avatarOrigin,
  //   realName: row.name,
  //   userId: row.directorId,
  //   dept: ''
  // }
  const query: any = {
    registrationTime:
      typeof selectedDay.value === 'string'
        ? [selectedDay.value, selectedDay.value]
        : selectedDay.value,
    registrarName: row.name
    // feedBackOptions: JSON.stringify(feedBackOptions)
  }

  if (queryParams.value.module) {
    query.tabValue = queryParams.value.module
  }

  // 根据列类型设置处理状态筛选
  switch (column.prop) {
    case 'wcl':
      query.isHandle = 1
      break
    case 'wwc':
      query.isHandle = 0
      break
    // case 'aswcsl':
    //   query.isHandle = 0
    //   query.registrationTime = [dayjs().format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]
    //   break
  }

  router.push({
    path: getRouteInfo('warehouseDocking'),
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
