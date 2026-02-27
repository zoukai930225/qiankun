<template>
  <div class="task-status">
    <ContentWrap>
      <div class="commonTopFilterWrap">
        <div class="commonTopFilterWrap-filter">
          <el-form
            ref="queryFormRef"
            :inline="true"
            :model="queryParams"
            class="-mb-15px"
            label-width="90px"
            @submit.prevent
          >
            <el-form-item label="日期" prop="timeRange">
              <el-date-picker
                v-model="timeRange"
                type="datetimerange"
                value-format="YYYY-MM-DD HH:mm:ss"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :clearable="true"
                style="width: 360px"
                @change="handleQuery"
              />
            </el-form-item>

            <el-form-item label="结果" prop="executeResult">
              <el-select
                v-model="queryParams.executeResult"
                placeholder="请选择"
                clearable
                multiple
                collapse-tags
                collapse-tags-tooltip
                style="width: 260px"
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

            <el-form-item label="任务" prop="taskParam">
              <el-input
                v-model="queryParams.taskParam"
                placeholder="请输入任务名称/编码"
                clearable
                style="width: 260px"
                @clear="handleQuery"
                @keyup.enter="handleQuery"
              />
            </el-form-item>

            <el-form-item label="应用" prop="programParam">
              <el-input
                v-model="queryParams.programParam"
                placeholder="请输入应用名称/编码"
                clearable
                style="width: 260px"
                @clear="handleQuery"
                @keyup.enter="handleQuery"
              />
            </el-form-item>

            <el-form-item v-show="isExpand" label="业务编码" prop="serviceCode">
              <el-input
                v-model="queryParams.serviceCode"
                placeholder="请输入业务编码"
                clearable
                style="width: 260px"
                @clear="handleQuery"
                @keyup.enter="handleQuery"
              />
            </el-form-item>

            <el-form-item
              v-show="isExpand"
              label="负责人"
              prop="superintendent"
              label-width="120px"
            >
              <el-select
                v-model="queryParams.superintendent"
                placeholder="请选择"
                clearable
                filterable
                style="width: 260px"
                @change="handleQuery"
                value-on-clear=""
              >
                <el-option
                  v-for="dict in resUserOptions"
                  :key="dict.id"
                  :label="dict.realName"
                  :value="dict.id"
                />
              </el-select>
            </el-form-item>

            <el-form-item v-show="isExpand" label="应用类型" prop="typeId">
              <el-select
                v-model="queryParams.typeId"
                placeholder="请选择"
                clearable
                filterable
                style="width: 260px"
                @change="handleQuery"
                value-on-clear=""
              >
                <el-option
                  v-for="dict in typeOptions"
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

    <ContentWrap>
      <s-table
        ref="tableRef"
        :columns="columns"
        :fetch="loadTableData"
        :fetch-params="queryParams"
        :pagination-map="{ pageNum: 'page', pageSize: 'size' }"
      >
        <template #superintendent="{ row }">
          {{ getUserRealName(row.superintendent) }}
        </template>
        <template #executor="{ row }">
          {{ getExecutorName(row) }}
        </template>
        <template #latestExecuteTime="{ row }">
          {{ formatDisplayTime(resolveLatestExecuteTime(row)) }}
        </template>
        <template #latestExecuteResult="{ row }">
          <span v-if="isSuccessResult(row)">{{ resolveLatestExecuteResult(row) }}</span>
          <el-tooltip v-else placement="top">
            {{ resolveLatestExecuteResult(row) || '--' }}
            <template #content>
              {{ row.resultParams || '--' }}
            </template>
          </el-tooltip>
        </template>
        <template #action="{ row }">
          <el-button class="operate-btn-space" link type="primary" @click="openHandleRecord(row)">
            执行记录
          </el-button>
        </template>
      </s-table>
    </ContentWrap>

    <TaskRecordForm ref="taskRecordFormRef" @success="handleQuery" />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { TableColumn } from '@/components/SWTable/src/table'
import * as DashboardApi from '@/api/dashboard'
import SWFilterExpandAll from '@/components/SWBaseComponent/SWFilterExpandAll/index.vue'
import TaskRecordForm from './taskRecordForm.vue'
import { useRpaDashboardStore } from '@/store/modules/rpaDashboard'
import { formatDate } from '@/utils/formatTime'

// 定义 emits
const emits = defineEmits(['jump-to-execution'])

const rpaDashboardData = useRpaDashboardStore()
const resUserOptions = computed<any[]>(() => rpaDashboardData.resUserList || [])
const typeOptions = computed<any[]>(() => rpaDashboardData.typeList || [])
const tableRef = ref()
const queryFormRef = ref()
const taskRecordFormRef = ref()
const isExpand = ref(false)
const message = useMessage()

const defaultResultFilters = ['失败', '失败已处理', '告警']
const resultOptions = [
  { label: '成功', value: '成功' },
  { label: '失败', value: '失败' },
  { label: '失败已处理', value: '失败已处理' },
  { label: '告警', value: '告警' }
]

const now = new Date()
const startOfDay = formatDate(
  new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0),
  'YYYY-MM-DD HH:mm:ss'
)
const endOfDay = formatDate(
  new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59),
  'YYYY-MM-DD HH:mm:ss'
)

const timeRange = ref<[string, string]>([startOfDay, endOfDay])

const queryParams = ref({
  taskParam: '',
  programParam: '',
  serviceCode: '',
  executeResult: [...defaultResultFilters],
  superintendent: '',
  typeId: ''
})

const columns: TableColumn[] = [
  { prop: 'taskName', label: '任务名称', minWidth: 200, showOverflowTooltip: true },
  { prop: 'skName', label: '应用名称', minWidth: 200, showOverflowTooltip: true },
  { prop: 'superintendent', label: '负责人', minWidth: 140 }, // 插槽显示姓名
  { prop: 'executor', label: '执行人', minWidth: 140 }, // 插槽解析执行人
  { prop: 'serviceCode', label: '业务编码', minWidth: 180, showOverflowTooltip: true },
  { prop: 'latestExecuteTime', label: '最新执行时间', minWidth: 180 },
  { prop: 'latestExecuteResult', label: '最新执行结果', minWidth: 140 },
  { prop: 'action', label: '操作', width: 140, align: 'center', fixed: 'right' }
]

const buildRequestParams = (params: Record<string, any>) => {
  const payload = { ...params }
  if (Array.isArray(payload.executeResult) && payload.executeResult.length > 0) {
    payload.executeResult = payload.executeResult.join(',')
  }
  if (timeRange.value && timeRange.value.length === 2) {
    payload.startTime = timeRange.value[0]
    payload.endTime = timeRange.value[1]
  }
  return payload
}

const loadTableData = async (params: any) => {
  const payload = buildRequestParams(params)
  return DashboardApi.getExecuteRecordListOnlyNew(payload)
}

const handleQuery = () => {
  tableRef.value?.refresh(true)
}

const resetQuery = () => {
  queryFormRef.value?.resetFields()
  queryParams.value.executeResult = [...defaultResultFilters]
  timeRange.value = [startOfDay, endOfDay]
  handleQuery()
}

const getUserRealName = (superintendents?: string) => {
  if (!superintendents) return '--'
  const superintendentArray = superintendents.split(',')
  const userList = (rpaDashboardData.resUserList || []) as Array<Record<string, any>>
  return superintendentArray
    .map((superintendent) => {
      const user = userList.find((item) => item.id === superintendent.trim())
      return user ? user.realName : superintendent
    })
    .join(',')
}

const getExecutorName = (row: Record<string, any>) => {
  return (
    row.executorName ||
    row.executor ||
    row.executeUserName ||
    row.executeUser ||
    row.executeNode ||
    row.loginUserName ||
    row.runner ||
    row.runUserName ||
    '--'
  )
}

const resolveLatestExecuteTime = (row: Record<string, any>) => {
  return row.latestExecuteTime || row.executeTime || row.startTime || row.endTime || ''
}

const resolveLatestExecuteResult = (row: Record<string, any>) => {
  return row.latestExecuteResult || row.executeResult || row.status || ''
}

const formatDisplayTime = (value?: string | number | Date) => {
  if (!value) return '--'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return formatDate(date)
}

const isSuccessResult = (row: Record<string, any>) => resolveLatestExecuteResult(row) === '成功'

// 修改：点击执行记录跳转到 executionRecord
const openHandleRecord = (row: Record<string, any>) => {
  // 1. 打印一下 row 看看里面有没有 storeName，以防后端返回的字段是 null 或者其他字段名
  console.log('当前行数据:', row)

  // 2. 触发跳转事件
  // skName 对应 executionRecord 的 appTypeName (应用类型名称)
  // storeName 对应 executionRecord 的 storeName (店铺名称)
  emits('jump-to-execution', {
    appTypeName: row.typeName, // 取列表的 typeName
    storeName: row.skStoreName // 取列表的 storeName
  })
}
</script>

<style scoped lang="scss"></style>
