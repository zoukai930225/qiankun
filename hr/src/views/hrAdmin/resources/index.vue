<template>
  <!-- 列表 -->
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <div class="commonTopFilterWrap">
      <div class="commonTopFilterWrap-filter">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="78px">
          <el-form-item label="查询条件" prop="param">
            <el-input :prefix-icon="Search" class="searchFormItemWidth" v-model="queryParams.param"
              placeholder="姓名/手机号码/工号" clearable @clear="handleQuery" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="人员类型" prop="employeeType">
            <el-select class="searchFormItemWidth" v-model="queryParams.employeeType" placeholder="请选择人员类型" clearable
              @change="handleQuery" @clear="handleQuery">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.FEISHU_EMPLOYOEE_TYPE, true)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="员工状态" prop="status">
            <el-select class="searchFormItemWidth" v-model="queryParams.status" placeholder="请选择人员类型" clearable
              @change="handleQuery" @clear="handleQuery">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.FEISHU_STATUS, true)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="部门" prop="deptId">
            <Menuitem v-model="queryParams.deptId" @change="handleSearch" style="width: 200px" />
          </el-form-item>
          <el-form-item label="入职月份" prop="onboardDate">
            <el-date-picker style="width: 200px" type="month" v-model="queryParams.onboardDate" value-format="YYYY-MM"
              format="YYYY-MM" placeholder="请选择月份" :clearable="true" @change="handleQuery" />
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
          <el-button @click="handelExport" type="primary" :loading="exportLoading">
            <el-icon style="margin-right: 5px">
              <Download />
            </el-icon>
            导出
          </el-button>
        </div>
      </div>
    </div>
    <el-table :header-cell-style="appStore.headerCellStyle" v-loading="loading" :data="list" :stripe="true"
      :show-overflow-tooltip="true" row-class-name="commonTableRow" class="SWCommonTable" v-horizontal-scroll="'always'"
      @sort-change="handleSortChange">
      <el-table-column label="姓名" prop="name" min-width="160">
        <template #default="scope">
          <div class="info-wapper">
            <img :src="scope.row.avatarOrigin" class="avator" alt="" v-if="scope.row.avatarOrigin" />
            <div class="name">{{ scope.row.name }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="公司" prop="company" min-width="160">
        <template #default="scope">
          <div>{{ getDictLabel(DICT_TYPE.PR_COMPANY, scope.row.company) || '--' }}</div>
        </template>
      </el-table-column>

      <el-table-column label="性别" prop="gender" min-width="160">
        <template #default="scope">
          <div>{{ getDictLabel(DICT_TYPE.FEISHU_GENDER, scope.row.gender) || '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="手机号码" prop="mobile" min-width="160" />
      <el-table-column label="工号" prop="employeeNo" min-width="160" />
      <el-table-column label="职位名称" prop="jobName" min-width="160" />
      <el-table-column label="职级名称" prop="jobLevelName" min-width="160" />
      <el-table-column label="人员类型" prop="employeeType" min-width="160">
        <template #default="scope">
          <div>{{
            getDictLabel(DICT_TYPE.FEISHU_EMPLOYOEE_TYPE, scope.row.employeeType) || '--'
          }}</div>
        </template>
      </el-table-column>
      <el-table-column label="员工状态" prop="status" min-width="160">
        <template #default="scope">
          <EmployStatus :status="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="入职时间" prop="hireDate" sortable="custom" min-width="120" />
      <!-- <el-table-column label="固定资产数" prop="fixedAssetsNumbers" width="120">
        <template #default="scope">
          <div v-if="scope.row.fixedAssetsNumbers > 0" class="fixedAssetsNumbers" @click="toDetail(scope.row)">{{
            scope.row.fixedAssetsNumbers }}</div>
          <div v-else>{{ scope.row.fixedAssetsNumbers }}</div>
        </template>
      </el-table-column> -->
      <el-table-column fixed="right" width="70" label="操作">
        <template #default="scope">
          <div class="row-center" @click="seeDetail(scope.row)">
            <!-- <img class="operateSeeIcon" src="@/assets/imgs/common/operate_see.png" /> -->
            <div class="operateText">查看</div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.page" v-model:limit="queryParams.size" @pagination="getList" />
    <!-- 查看弹窗 -->
    <SeeDialog ref="seeDialogRef" />
  </ContentWrap>
</template>

<script lang="ts" setup>
import * as PersonRosterApi from '@/api/hrAdmin/personRoster'
import { useAppStore } from '@/store/modules/app'
import { DICT_TYPE, getDictLabel, getIntDictOptions } from '@/utils/dict'
import download from '@/utils/download'
import { Search } from '@element-plus/icons-vue'
import EmployStatus from './components/employStatus.vue'
import Menuitem from './components/Menuitem.vue'
import SeeDialog from './components/seeDialog.vue'

const appStore = useAppStore()
const router = useRouter() // 路由对象
defineOptions({ name: 'HrResources' })

const loading = ref(false) // 列表的加载中
const list = ref<any[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = ref({
  page: 1,
  size: 10,
  param: '',
  employeeType: '',
  status: '2',
  deptId: '',
  onboardDate: '',
  hireDateOrder: undefined as 'asc' | 'desc' | undefined // 入职时间排序 desc：降序  asc 升序
})
const queryFormRef = ref() // 搜索的表单

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    // isNeedFixedAssetsNumbers -表示来源需要固定资产数
    const params = { ...queryParams.value, isNeedFixedAssetsNumbers: true }
    const data = await PersonRosterApi.getPersonRosterList(params).catch(() => { })
    list.value = data.data || []
    total.value = data.total
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = (value) => {
  queryParams.value.page = 1
  if (value) {
    queryParams.value.deptId = value[value.length - 1]
  }
  getList()
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.page = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  queryParams.value.status = '2'
  handleQuery()
}

/** 新增操作 */
const seeDialogRef = ref()
const seeDetail = (row) => {
  seeDialogRef.value.open(row.userId)
}

// 固定资产数
const toDetail = (item) => {
  const { userId } = item
  if (!userId) return
  router.push({
    // path: '/admin/hrAdmin/assetManagement/assetIndex', // 找不到
    name: 'AssetStatisticsDetailList',
    query: {
      userId: userId
    }
  })
}

// 排序事件
const handleSortChange = ({ prop, order }) => {
  if (prop === 'hireDate') {
    queryParams.value.hireDateOrder = { ascending: 'asc', descending: 'desc' }[order]
  } else {
    queryParams.value.hireDateOrder = undefined
  }
  // console.log('请求参数', queryParams.value)
  getList()
}

// 导出按钮操作
const notificationRef = ref()
const exportLoading = ref(false)
const handelExport = async () => {
  exportLoading.value = true
  notificationRef.value = ElNotification({
    message: '数据导出中，请稍后...',
    showClose: false,
    offset: 100,
    position: 'bottom-right',
    customClass: 'peoplesDetailDialog-Notification'
  })
  try {
    const { page, size, ...params } = queryParams.value

    // 人力资源 导出
    const data = await PersonRosterApi.exportPersonRosterList(params)
    if (data) {
      download.excel(data, `人力资源数据.xls`)
    }
  } finally {
    exportLoading.value = false
    notificationRef.value?.close()
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
<style lang="scss">
.peoplesDetailDialog-Notification {
  width: 200px;
  // right: 240px!important;
  background: #666;

  .el-notification__content {
    color: #fff;
  }

  border-color: #666;
}

.info-wapper {
  display: flex;
  flex-direction: row;
  align-items: center;

  .avator {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin-right: 10px;
  }
}
</style>
