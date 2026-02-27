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
              v-model="queryParams.executeResult"
              placeholder="请选择"
              style="width: 280px"
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
          <el-form-item label="应用" prop="programParam">
            <el-input
              v-model="queryParams.programParam"
              clearable
              style="width: 250px"
              placeholder="请输入应用名称/编码"
              @clear="handleQuery"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item v-show="isExpand" label="业务编码" prop="serviceCode">
            <el-input
              v-model="queryParams.serviceCode"
              clearable
              style="width: 250px"
              placeholder="请输入业务编码"
              @clear="handleQuery"
              @keyup.enter="handleQuery"
            />
          </el-form-item>

          <el-form-item v-show="isExpand" label="负责人" prop="superintendent" label-width="120px">
            <el-select
              v-model="queryParams.superintendent"
              placeholder="请选择"
              clearable
              filterable
              style="width: 250px"
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
              v-model="queryParams.typeId"
              placeholder="请选择"
              clearable
              filterable
              style="width: 250px"
              @change="handleQuery"
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

  <!-- 列表 -->
  <ContentWrap>
    <el-table
      :header-cell-style="{ background: '#f2f6fc' }"
      v-loading="loading"
      :data="list"
      show-overflow-tooltip
      class="SWCommonTable"
      v-horizontal-scroll="'always'"
    >
      <el-table-column label="任务名称" prop="taskName">
        <template #default="scope">
          {{ scope.row.taskName || '--' }}
        </template>
      </el-table-column>
      <el-table-column label="应用名称" prop="skName">
        <template #default="scope">
          {{ scope.row.skName || '--' }}
        </template>
      </el-table-column>

      <el-table-column label="负责人" prop="superintendent">
        <template #default="scope">
          {{ getUserRealName(scope.row.superintendent) || '--' }}
        </template>
      </el-table-column>
      <!--  执行人 executeUserName -->
      <el-table-column label="执行人" prop="executeUserName">
        <template #default="scope">
          {{ scope.row.executeUserName || '--' }}
        </template>
      </el-table-column>
      <el-table-column label="业务编码" prop="serviceCode">
        <template #default="scope">
          {{ scope.row.serviceCode || '--' }}
        </template>
      </el-table-column>
      <el-table-column label="任务执行开始时间" prop="startTime">
        <template #default="scope">
          {{ formatTime(scope.row.startTime) || '--' }}
        </template>
      </el-table-column>
      <el-table-column label="任务运行结果" prop="executeResult">
        <template #default="scope">
          <span v-if="scope.row.executeResult === '成功'">
            {{ scope.row.executeResult || '--' }}
          </span>
          <el-tooltip v-else placement="top">
            {{ scope.row.executeResult || '--' }}
            <template #content>
              {{ scope.row.resultParams || '--' }}
            </template>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column align="left" fixed="right" label="操作" width="150px">
        <template #default="scope">
          <el-button
            class="operate-btn-space"
            link
            type="primary"
            @click="openForm(scope.row.id)"
            v-if="scope.row.executeResult !== '成功'"
          >
            查看处理记录
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      v-model:limit="queryParams.size"
      v-model:page="queryParams.page"
      :total="total"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <TaskRecordForm ref="formRef" @success="getList" />
</template>

<script lang="ts" setup>
import * as DashboardApi from '@/api/dashboard'

import TaskRecordForm from './taskRecordForm.vue'
import SWFilterExpandAll from '@/components/SWBaseComponent/SWFilterExpandAll/index.vue' // 展开组件
import { debounce } from 'lodash-es'
import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'
import * as rpaApi from '@/api/rpaManage'
import { formatDate } from '@/utils/formatTime'

import { useRpaDashboardStore } from '@/store/modules/rpaDashboard'
const rpaDashboardData = useRpaDashboardStore()
import { ref } from 'vue'
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const isExpand = ref(false) // 是否展开
const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref<any[]>([]) // 字典表格数据

const now = new Date()
const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)

const timeRange = ref([startOfDay, endOfDay]) // 时间段 默认为当天 00:00:00 - 23:59:59
const queryParams = reactive({
  page: 1,
  size: 10,
  typeId: undefined, //应用类型
  groupType: undefined, //应用类型
  taskParam: undefined, //任务
  programParam: undefined, //程序
  serviceCode: undefined, //业务编码
  executeResult: ['失败', '失败已处理', '告警'], //结果
  superintendent: undefined, //负责人
  startTime: undefined, //开始时间
  endTime: undefined //结束时间
})
const queryFormRef = ref() // 搜索的表单

// 搜索条件选项 结果
const resultOptions = [
  { label: '成功', value: '成功' },
  { label: '失败', value: '失败' },
  { label: '失败已处理', value: '失败已处理' },
  { label: '告警', value: '告警' }
]

/** 查询字典类型列表 */
const getList = async () => {
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
    const data = await DashboardApi.getTaskTableList(tempQueryParams)
    list.value = data.records || []
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = debounce(async () => {
  queryParams.page = 1
  getList()
}, 200)

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  timeRange.value = [startOfDay, endOfDay]
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (id: string) => {
  formRef.value.open(id)
}

// 格式化时间
const formatTime = (originalTime) => {
  return originalTime ? formatDate(new Date(originalTime)) : '--'
}

// 获取用户真实姓名
const getUserRealName = (superintendents) => {
  if (!superintendents) return '--'
  const superintendentArray = superintendents.split(',')
  return superintendentArray
    .map((superintendent) => {
      const user = rpaDashboardData.resUserList.find((item) => item.id === superintendent.trim())
      return user ? user.realName : superintendent
    })
    .join(',')
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>

<style scoped>
:deep(.el-input__wrapper) {
  padding: 0 11px !important;
}
</style>
