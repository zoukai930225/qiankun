<template>
  <div class="commonTopFilterWrap packageCostMaintenanceTopFilter">
    <div class="commonTopFilterWrap-filter">
      <el-form
        ref="queryFormRef"
        :inline="true"
        :model="queryParams"
        :label-width="80"
        @submit.prevent="handleQuery"
      >
        <el-form-item label="登录账户" prop="nick">
          <el-input
            style="width: 260px"
            :prefix-icon="Search"
            v-model="queryParams.nick"
            placeholder="请输入登录账户"
            clearable
            @clear="handleQuery"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="使用者" prop="userName">
          <el-input
            style="width: 260px"
            :prefix-icon="Search"
            v-model="queryParams.userName"
            placeholder="请输入使用者"
            clearable
            @clear="handleQuery"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="登录状态" prop="loginStatus">
          <el-select
            class="dialogFormItemWidth"
            v-model="queryParams.loginStatus"
            placeholder="请选择"
            clearable
            style="width: 260px"
            value-on-clear=""
            @change="handleQuery"
          >
            <el-option
              v-for="dict in statusList"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
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
  <ContentWrap>
    <div class="table-main">
      <el-table
        class="SWCommonTable editeTable"
        :data="list"
        width="100%"
        :show-overflow-tooltip="false"
        v-loading="loading"
        v-horizontal-scroll="'always'"
        row-class-name="commonTableRow"
        :header-cell-style="headerCellStyle"
        :header-row-style="headerRowStyle"
        :cell-style="cellStyle"
        :row-style="rowStyle"
      >
        <el-table-column prop="nick" label="登录账户">
          <template #default="{ row }">
            <span class="link-text" @click="openActionRecordDrawer(row)">{{ row.nick }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="使用者">
          <template #default="{ row }">
            {{ row.userName || '--' }}
          </template>
        </el-table-column>
        <el-table-column prop="dept" label="部门">
          <template #default="{ row }">
            {{ row.dept || '--' }}
          </template>
        </el-table-column>
        <el-table-column prop="post" label="岗位">
          <template #default="{ row }">
            {{ row.post || '--' }}
          </template>
        </el-table-column>
        <el-table-column prop="logTs" label="登录时间">
          <template #default="{ row }">
            {{ row.logTs || '--' }}
          </template>
        </el-table-column>
        <el-table-column prop="location" label="登录城市">
          <template #default="{ row }">
            {{ row.location || '--' }}
          </template>
        </el-table-column>
        <el-table-column prop="ip" label="登录IP">
          <template #default="{ row }">
            {{ row.ip || '--' }}
          </template>
        </el-table-column>
        <el-table-column prop="loginStatus" label="状态">
          <template #default="{ row }">
            <el-tag
              v-if="isStatusValid(row.loginStatus)"
              :type="loginStatusType(row.loginStatus)"
              >{{ getStatusLabel(row.loginStatus) }}</el-tag
            >
            <span v-else>--</span>
          </template>
        </el-table-column>
        <!-- 添加操作列 -->
        <el-table-column label="操作" width="120" fixed="right" align="center">
          <template #default="{ row }">
            <el-button
              v-if="row.loginStatus === '1'"
              link
              type="primary"
              @click="exceptionHandle(row)"
              >异常处理</el-button
            >
          </template>
        </el-table-column>
        <template #empty>
          <div class="empty-img">
            <img src="@/assets/imgs/common/empty_list.png" alt="" />
            <div>暂无数据</div>
          </div>
        </template>
      </el-table>

      <div class="pagination">
        <!-- 分页 -->
        <Pagination
          v-model:limit="queryParams.size"
          v-model:page="queryParams.page"
          :total="total"
          @pagination="getList"
        />
      </div>
      <!-- 运营信息弹窗 -->
      <ExceptionHandleDialog ref="exceptionHandleDialogRef" @success="getList" />
      <!-- 账户详情 -->
      <ActionRecordDrawer ref="actionRecordDrawerRef" />
    </div>
  </ContentWrap>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
const message = useMessage() // 消息弹窗
const router = useRouter()
const { t } = useI18n() // 国际化
import ExceptionHandleDialog from './components/exceptionHandleDialog.vue'
import ActionRecordDrawer from './components/actionRecordDrawer.vue'
import * as qianniuAccountApi from '@/api/qianniuAccount'

const queryFormRef = ref()
const loading = ref(false) // 加载状态
const headerCellStyle = {
  backgroundColor: '#EBF2FF',
  color: '#666',
  fontSize: '14px',
  fontWeight: '400',
  height: '30px',
  'line-height': '30px',
  borderBottom: 'none',
  padding: 0
}
const headerRowStyle = {
  backgroundColor: 'rgba(256, 256, 256, 0)'
}
const cellStyle = {
  borderBottom: 'none'
}
const rowStyle = {
  marginBottom: '16px',
  height: '50px'
}

const statusList = [
  {
    label: '正常',
    value: '0'
  },
  {
    label: '异常',
    value: '1'
  }
]

const loginStatusType = (status) => {
  switch (status) {
    case '0':
      return 'success'
    case '1':
      return 'danger'
    default:
      return ''
  }
}

const isStatusValid = (status) => {
  return ['0', '1'].includes(status)
}

const statusMap = computed(() =>
  statusList.reduce((map, item) => ((map[item.value] = item.label), map), {})
)

const getStatusLabel = (value) => statusMap.value[value] || '--'

const queryParams = ref({
  size: 10,
  page: 1,
  nick: '',
  userName: '',
  loginStatus: ''
})

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

const total = ref(0)
const list = ref<any>([])

const getList = async () => {
  try {
    const res = await qianniuAccountApi.getLoginLogList(queryParams.value)
    list.value = res.records || []
    total.value = res.total || 0
  } finally {
    loading.value = false
  }
}

// 异常处理
const exceptionHandleDialogRef = ref()
const exceptionHandle = (row) => {
  console.log(row)
  // 异常处理弹窗
  exceptionHandleDialogRef.value?.open(row)
}

// 查看账户详情
const actionRecordDrawerRef = ref()
const openActionRecordDrawer = (row) => {
  console.log(row)
  // 账户详情弹窗
  actionRecordDrawerRef.value?.open(row)
}

onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
// 查询条件
.packageCostMaintenanceTopFilter {
  background-color: #fff;
  padding: 20px 20px 0 20px;
  margin-bottom: 20px;
  border-radius: 12px;
}

// 表格样式
.table-main {
  background: linear-gradient(
    0,
    rgba(250, 252, 255, 0.19) 0%,
    rgba(242, 247, 255, 0.78) 37%,
    #ebf2ff 100%
  );
  border-radius: 6px;
  padding: 20px;
}

.editeTable {
  :deep(.el-input__wrapper) {
    box-shadow: none !important;
    border: 1px solid #e5e5e5;
  }
}

.link-text {
  color: #409eff;
  cursor: pointer;
}

.status-tag {
}

// 分页
.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
