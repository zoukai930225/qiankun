<template>
  <ContentWrap>
    <s-w-search-form
      ref="searchFormRef"
      :schema="schema"
      @search="onSearch"
      @reset="onReset"
      auto-search-on-change
      :show-expand="false"
    />

    <div>
      <el-table
        :header-cell-style="appStore.headerCellStyle"
        v-loading="loading"
        :data="list"
        :show-overflow-tooltip="true"
        row-class-name="commonTableRow"
        class="SWCommonTable"
        v-horizontal-scroll="'always'"
        @sort-change="handleSortChange"
        :default-sort="{ prop: 'executionTimeStr', order: 'ascending' }"
      >
        <el-table-column label="数据日期" prop="dataDate" width="120" fixed />
        <el-table-column
          label="程序名称"
          prop="serviceName"
          min-width="200"
          show-overflow-tooltip
        />
        <el-table-column label="昨日数据" prop="yesterdayResult" min-width="120" align="right">
          <template #default="{ row }">
            <el-tooltip placement="bottom" effect="dark" :disabled="!hasChartData(row)">
              <template #content>
                <LineChart :xData="getXDataByRow(row)" :yData="getYDataByRow(row)" />
              </template>
              <span style="cursor: pointer">{{
                numberFormateShow(row.yesterdayResult) || '-'
              }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="昨日浮动" prop="yesterdayFluctuation" min-width="100" align="right">
          <template #default="scope">
            {{ numberFormateShow(scope.row.yesterdayFluctuation) || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="七天平均值" prop="sevenDayAverage" min-width="100" align="right">
          <template #default="scope">
            {{ numberFormateShow(scope.row.sevenDayAverage) || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="是否确认" prop="checkFlag" min-width="120">
          <template #default="scope">
            <el-tag type="info" v-if="!scope.row.id">未执行</el-tag>
            <el-tag type="success" v-else-if="scope.row.checkFlag === '1'">已确认</el-tag>
            <el-tag type="danger" v-else>未确认</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="确认人" prop="checkUserName" min-width="120">
          <template #default="scope">{{ scope.row.checkUserName || '-' }}</template>
        </el-table-column>
        <el-table-column label="店铺名称" prop="storeName" min-width="150">
          <template #default="scope">{{ scope.row.storeName || '-' }}</template>
        </el-table-column>
        <el-table-column label="入库时间" min-width="160" show-overflow-tooltip>
          <template #default="{ row }">
            {{
              row.storageTime ||
              row.inboundTime ||
              row.insertTime ||
              row.dataCreateTime ||
              row.createTime ||
              row.createdAt ||
              '-'
            }}
          </template>
        </el-table-column>
        <el-table-column
          label="cron表达式"
          prop="executionTimeStr"
          min-width="180"
          show-overflow-tooltip
          sortable="custom"
        >
          <template #default="{ row }">
            <div>
              <div>{{ row.executionTime }}</div>
              <div>{{ row.executionTimeStr }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="监控数据名称"
          prop="dataName"
          min-width="200"
          show-overflow-tooltip
        />
        <el-table-column label="类型" prop="type" min-width="100">
          <template #default="scope">
            {{ getTypeName(scope.row.type) }}
          </template>
        </el-table-column>
        <el-table-column
          label="业务表名"
          prop="businessTable"
          min-width="180"
          show-overflow-tooltip
        />
        <el-table-column
          label="查询拓展列"
          prop="extWhereFiled"
          min-width="180"
          show-overflow-tooltip
        />
        <el-table-column label="服务类型" prop="serviceType" min-width="200" show-overflow-tooltip>
          <template #default="{ row }">
            {{ getDictLabel(DICT_TYPE.DATA_CHECK_SERVICE_TYPE, row.serviceType) }}
          </template>
        </el-table-column>
        <el-table-column label="PRA负责人" prop="userName" min-width="120" />

        <el-table-column label="操作" fixed="right" width="180">
          <template #default="scope">
            <template v-if="scope.row.id">
              <el-button
                v-if="scope.row.checkFlag === '1'"
                type="text"
                @click="handleEdit(scope.row)"
                >编辑</el-button
              >
              <el-button
                type="text"
                :loading="scope.row.btnLoading"
                @click="confirmSelf(scope.row)"
                >{{ scope.row.checkFlag === '1' ? '查看' : '确认' }}</el-button
              >
              <el-button
                v-if="scope.row.serviceType === '0'"
                type="text"
                @click="handleReExecute(scope.row)"
                >重执行</el-button
              >
            </template>
            <template v-else> <el-button type="text" disabled>未执行</el-button> </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-wrapper">
      <Pagination
        :total="total"
        v-model:page="queryParams.page"
        v-model:limit="queryParams.size"
        @pagination="getList"
      />
    </div>
    <edit
      v-model="confirmDialogVisible"
      :row="currentRow"
      :editable="isEditMode"
      @success="handleConfirmSuccess"
    />
    <ExecuteDialog v-model="executeDialogVisible" :row="currentRow" @success="getList" />
  </ContentWrap>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'
import * as dataCheckResultApi from '@/api/dataMonitor/index'
import LineChart from '@/views/rpaManage/monitorConfig/components/lineChart.vue'
import Edit from './components/edit.vue'
import ExecuteDialog from './components/executeDialog.vue'
import dayjs from 'dayjs'
import { numberFormateShow } from '@/utils/formatter'
import { useRpaDashboardStore } from '@/store/modules/rpaDashboard'
import { getDictLabel, DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import type { FormSchema } from '@/types/form'
import { ref, computed, onMounted } from 'vue'
import { getProgramTypeList } from '@/api/rpaManage/programType'
import { getApplicationListNew } from '@/api/rpaManage'
import * as rpaApi from '@/api/rpaManage'
import { useUserStore } from '@/store/modules/user'
import { useRoute } from 'vue-router'

defineOptions({ name: 'BillbordDataMonitor' })
const rpaDashboardData = useRpaDashboardStore()
const appStore = useAppStore()
const searchFormRef = ref<any>()
const userStore = useUserStore()
const route = useRoute()

const loading = ref(false) // 列表的加载中
const list = ref<any[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数

interface QueryParams {
  page: number
  size: number
  alarmLevel: string //警告类型
  createDate: string //日期
  rpaUserId: string | number //Rpa负责人
  serviceType?: string
  serviceCode?: string
  businessTable?: string
  taskPriority?: string
  checkFlag?: string
  unexecutedTime?: string
  sortType?: string // 排序类型
}

const typeList = [
  { label: '总花费', value: '0' },
  { label: '总数量', value: '1' }
]

const getTypeName = (type: string) => {
  return typeList.find((item) => item.value === type)?.label || ''
}
const queryParams = ref<QueryParams>({
  page: 1,
  size: 10,
  // alarmLevel: '', //警告类型
  alarmLevel: '2,4', //警告类型：默认 警告 未执行
  createDate: dayjs().format('YYYY-MM-DD'), //日期
  // createDate: '', //日期
  rpaUserId: userStore.user.id, //Rpa负责人
  checkFlag: '0', // 是否确认：默认未确认
  sortType: 'asc' // 默认排序值，与 el-table 的 default-sort order 对应
})

// 字典与下拉选项
const serviceTypeOptions = ref<Array<{ label: string; value: string | number }>>([])
const applicationOptions = ref<Array<{ label: string; value: string | number }>>([])
const priorityOptions = ref<Array<{ label: string; value: string | number }>>([
  { label: '高', value: '1' },
  { label: '中', value: '2' },
  { label: '低', value: '3' }
])
const checkFlagOptions = ref<Array<{ label: string; value: string | number }>>([
  { label: '已确认', value: '1' },
  { label: '未确认', value: '0' }
])

// 搜索表单 schema
const schema = computed<FormSchema[]>(() => [
  {
    field: 'createDate',
    label: '日期',
    component: 'DatePicker',
    value: dayjs().format('YYYY-MM-DD'),
    // value: '',
    componentProps: {
      type: 'date',
      disabledDate: disabledDateFun,
      clearable: false,
      valueFormat: 'YYYY-MM-DD',
      format: 'YYYY-MM-DD'
    }
  },
  {
    field: 'alarmLevel',
    label: '警告类型',
    component: 'Select',
    // value: '',
    value: ['2', '4'],
    componentProps: {
      multiple: true,
      collapseTags: true,
      options: [
        { label: '正常', value: '0' },
        { label: '警告', value: '2' },
        { label: '未执行', value: '4' }
      ]
    }
  },
  {
    // 是否确认
    field: 'checkFlag',
    label: '是否确认',
    component: 'Select',
    value: '0',
    componentProps: {
      options: checkFlagOptions.value
    }
  },
  {
    field: 'rpaUserId',
    label: '负责人',
    component: 'Select',
    value: userStore.user.id,
    componentProps: {
      filterable: true,
      clearable: true,
      options: rpaDashboardData.resUserList.map((dict: any) => ({
        label: dict.realName,
        value: dict.id
      }))
    }
  },
  {
    // 业务表名
    field: 'businessTable',
    label: '业务表名',
    component: 'Input',
    value: '',
    componentProps: {}
  },
  {
    // 优先级
    field: 'taskPriority',
    label: '优先级',
    component: 'Select',
    value: '',
    componentProps: {
      options: priorityOptions.value
    }
  },
  {
    field: 'serviceType',
    label: '服务类型',
    component: 'Select',
    value: '',
    componentProps: {
      filterable: true,
      clearable: true,
      options: serviceTypeOptions.value,
      onChange: (value: string | number) => {
        // 先清空应用名称的值，再联动加载选项，确保自动搜索使用清空后的值
        if (searchFormRef.value?.formModel) {
          searchFormRef.value.formModel['serviceCode'] = ''
        }
        applicationOptions.value = []
        loadApplicationOptionsByServiceType(value)
      }
    }
  },
  {
    field: 'serviceCode',
    label: '应用名称',
    component: 'Select',
    value: '',
    componentProps: {
      filterable: true,
      clearable: true,
      options: applicationOptions.value
    }
  }
])

// s-w-search-form 事件
const onSearch = (formModel: Record<string, any>) => {
  queryParams.value.page = 1
  queryParams.value.alarmLevel = Array.isArray(formModel.alarmLevel)
    ? formModel.alarmLevel.join(',')
    : formModel.alarmLevel || ''
  queryParams.value.rpaUserId = formModel.rpaUserId || ''
  queryParams.value.createDate = formModel.createDate
    ? dayjs(formModel.createDate).format('YYYY-MM-DD')
    : ''
  queryParams.value.unexecutedTime = formModel.unexecutedTime || ''
  queryParams.value.serviceType = formModel.serviceType || ''
  queryParams.value.serviceCode = formModel.serviceCode || ''
  queryParams.value.businessTable = formModel.businessTable || ''
  queryParams.value.taskPriority = formModel.taskPriority || ''
  queryParams.value.checkFlag = formModel.checkFlag || ''
  getList()
}

const onReset = () => {
  // 重置后会触发一次 search，这里无需额外处理
  applicationOptions.value = []
}

/** 排序触发事件 */
const handleSortChange = ({ prop, order }: { prop: string; order: string }) => {
  if (prop === 'executionTimeStr') {
    if (order === 'ascending') {
      queryParams.value.sortType = 'asc'
    } else if (order === 'descending') {
      queryParams.value.sortType = 'desc'
    } else {
      queryParams.value.sortType = ''
    }
    queryParams.value.page = 1
    getList()
  }
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await dataCheckResultApi.getList(queryParams.value)
    if (data) {
      list.value = data.records
      total.value = data.total
    }
  } finally {
    loading.value = false
  }
}

const disabledDateFun = (Date: any) => {
  return dayjs().isBefore(dayjs(Date))
}
// 获取用户列表
const getUserList = async () => {
  let data = await rpaApi.getUserList({ page: 1, size: 99999 })
  rpaDashboardData.resUserList = data.data
}

// 加载服务类型字典
const loadServiceTypeOptions = async () => {
  serviceTypeOptions.value =
    (await getIntDictOptions(DICT_TYPE.DATA_CHECK_SERVICE_TYPE, true)) || []
}

// 根据服务类型加载应用列表选项
async function loadApplicationOptionsByServiceType(serviceType: string | number) {
  if (!serviceType && serviceType !== 0) {
    applicationOptions.value = []
    return
  }
  try {
    if (serviceType === '1' || serviceType === 1) {
      const { records = [] } = (await getProgramTypeList({ page: 1, pageSize: 99999 })) || {}
      applicationOptions.value = records.map((item: any) => ({
        label: item.typeName,
        value: item.typeCode
      }))
    } else if (serviceType === '0' || serviceType === 0) {
      const { records = [] } = (await getApplicationListNew({ page: 1, pageSize: 99999 })) || {}
      applicationOptions.value = records.map((item: any) => ({
        label: item.name,
        value: item.code
      }))
    } else {
      applicationOptions.value = []
    }
  } catch (error) {
    applicationOptions.value = []
  }
}

/** 初始化 **/
onMounted(async () => {
  await loadServiceTypeOptions()
  getUserList()

  // 检查是否从 TeamComponent 跳转过来
  const { serviceName, serviceType } = route.query
  if (serviceType && serviceName) {
    const sType = serviceType as string
    const sName = serviceName as string

    // 1. 设置服务类型
    queryParams.value.serviceType = sType
    // 还需要回填到 searchForm 的 formModel 中，以便 UI 显示
    if (searchFormRef.value?.formModel) {
      searchFormRef.value.formModel['serviceType'] = sType
      searchFormRef.value.formModel['alarmLevel'] = []
      searchFormRef.value.formModel['checkFlag'] = ''
      searchFormRef.value.formModel['rpaUserId'] = ''
    }

    // 2. 加载对应的应用名称列表
    await loadApplicationOptionsByServiceType(sType)

    // 3. 根据名称匹配 Code
    const targetOption = applicationOptions.value.find((item) => item.label === sName)
    if (targetOption) {
      queryParams.value.serviceCode = targetOption.value as string
      // 回填 searchForm
      if (searchFormRef.value?.formModel) {
        searchFormRef.value.formModel['serviceCode'] = targetOption.value
      }
    }
  }

  // 最后执行查询
  searchFormRef.value?.search()
})

// --------------- 显示图表  -----------------------
function formatXAxisLabel(value: string | number): string {
  const text = String(value)
  if (/^\d{4}[-\/]/.test(text)) {
    return text.replace(/^\d{4}[-\/]?/, '')
  }
  if (/^\d{8,}$/.test(text)) {
    return text.slice(4)
  }
  return text
}
function extractChartDetailData(row: any): Record<string, number> {
  const raw = row?.data
  let dataObj: Record<string, any> = {}
  if (raw) {
    if (typeof raw === 'string') {
      try {
        dataObj = JSON.parse(raw)
      } catch (e) {
        dataObj = {}
      }
    } else {
      dataObj = raw as Record<string, any>
    }
  }
  const result: Record<string, number> = {}
  Object.keys(dataObj || {}).forEach((k) => {
    const n = Number((dataObj as any)[k])
    result[k] = isNaN(n) ? 0 : n
  })
  return result
}

function hasChartData(row: any): boolean {
  return Object.keys(extractChartDetailData(row)).length > 0
}

function getXDataByRow(row: any): string[] {
  return Object.keys(extractChartDetailData(row))
    .sort()
    .map((k) => formatXAxisLabel(k))
}

function getYDataByRow(row: any): number[] {
  const dataObj = extractChartDetailData(row)
  return Object.keys(dataObj)
    .sort()
    .map((k) => Number(dataObj[k] ?? 0))
}

// 人工确认相关
const confirmDialogVisible = ref(false)
const currentRow = ref<any>({})
const isEditMode = ref(false)

// 处理确认成功
const handleConfirmSuccess = () => {
  // 刷新列表
  getList()
}

//人工确认
async function confirmSelf(data: any) {
  try {
    // 设置当前行数据
    currentRow.value = data
    isEditMode.value = false
    // 打开确认弹窗
    confirmDialogVisible.value = true
  } catch (err) {}
}

const executeDialogVisible = ref(false)
const handleReExecute = async (row: any) => {
  currentRow.value = row
  executeDialogVisible.value = true
}

const handleEdit = (row: any) => {
  currentRow.value = row
  isEditMode.value = true
  confirmDialogVisible.value = true
}
</script>

<style lang="less" scoped></style>
