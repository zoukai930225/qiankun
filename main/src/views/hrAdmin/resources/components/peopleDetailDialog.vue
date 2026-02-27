<template>
  <div>
    <Dialog
      v-model="dialogVisible"
      :modal-append-to-body="false"
      :title="dialogTitle"
      width="1320px"
      @close="handleCLose"
    >
      <div class="mainContent">
        <div class="mainContent-top">
          <!-- 搜索工作栏 -->
          <div class="row-center">
            <el-form
              :model="queryParams"
              ref="queryFormRef"
              :inline="true"
              label-width="78px"
              style="margin-top: 5px"
              @submit.prevent
            >
              <el-form-item label="查询条件" prop="inquire">
                <el-input
                  v-model="queryParams.inquire"
                  placeholder="姓名/手机号码/工号"
                  clearable
                  @clear="handleQuery"
                  @keyup.enter="handleQuery"
                  :prefix-icon="Search"
                  class="searchFormItemWidth"
                />
              </el-form-item>

              <el-form-item label="人员类型" prop="employeeType">
                <el-select
                  class="searchFormItemWidth"
                  v-model="queryParams.employeeType"
                  placeholder="请选择人员类型"
                  clearable
                  @change="handleQuery"
                >
                  <el-option
                    v-for="dict in getIntDictOptions(DICT_TYPE.FEISHU_EMPLOYOEE_TYPE, true)"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-form>
            <div style="margin-left: auto; margin-top: -10px">
              <el-button @click="handleQuery" class="commonSearchBtn">
                <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
                搜索
              </el-button>
              <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0px">
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

          <el-table
            :header-cell-style="appStore.headerCellStyle"
            v-loading="loading"
            :data="list"
            :stripe="true"
            :show-overflow-tooltip="true"
            row-class-name="commonTableRow"
            @sort-change="handleSortChange"
          >
            <el-table-column label="姓名" prop="name" min-width="100" />

            <el-table-column label="性别" prop="gender">
              <template #default="scope">
                <div>{{ getDictLabel(DICT_TYPE.FEISHU_GENDER, scope.row.gender) || '--' }}</div>
              </template>
            </el-table-column>
            <el-table-column label="手机号码" prop="mobile" min-width="160" />
            <el-table-column label="员工状态" prop="status" min-width="120">
              <template #default="scope">
                <EmployStatus :status="scope.row.status" />
              </template>
            </el-table-column>
            <el-table-column label="人员类型" prop="employeeType" width="120">
              <template #default="scope">
                <div class="row-center">
                  <div class="personType">
                    <div class="personType-dot"></div>
                    <div class="personType-value">{{
                      getDictLabel(DICT_TYPE.FEISHU_EMPLOYOEE_TYPE, scope.row.employeeType) || '--'
                    }}</div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="入职时间" prop="hireDate" sortable="custom" min-width="120" />
            <el-table-column label="工号" prop="employeeNo" />
            <el-table-column label="职位名称" prop="jobName" min-width="120" />
            <el-table-column label="职级名称" prop="jobLevelName" />

            <el-table-column fixed="right" width="80" label="操作" :show-overflow-tooltip="false">
              <template #default="scope">
                <div class="row-center" @click="seeDetail(scope.row)">
                  <img class="operateSeeIcon" src="@/assets/imgs/common/operate_see.png" />
                  <div class="operateText">查看</div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 分页 -->
        <div class="pagination">
          <Pagination
            style="margin-right: 20px"
            :total="total"
            v-model:page="queryParams.page"
            v-model:limit="queryParams.size"
            @pagination="getList"
          />
        </div>
      </div>
      <!-- 查看弹窗 -->
      <SeeDialog ref="seeDialogRef" />
    </Dialog>
  </div>
</template>
<script lang="ts" setup>
import * as PersonRosterApi from '@/api/hrAdmin/personRoster'
import { ElNotification } from 'element-plus'
import { useAppStore } from '@/store/modules/app'
import { DICT_TYPE, getDictLabel, getIntDictOptions } from '@/utils/dict'
import { Search } from '@element-plus/icons-vue'
import EmployStatus from './employStatus.vue'
import SeeDialog from './seeDialog.vue'
import download from '@/utils/download'
const appStore = useAppStore()

defineOptions({ name: 'SystemDictTypeForm' })

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const loading = ref(false) // 数据加载是否中
const list = ref<any[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const dataType = ref('') // online: 各公司在职人员数 shape:饼状图人员数据 ssc:在职入职离职
const queryParams = ref({
  page: 1,
  size: 10,
  company: '',
  inquire: '',
  type: undefined,
  value: undefined,
  deptName: undefined,
  beginDate: undefined,
  endDate: undefined,
  employeeType: undefined,
  hireDateOrder: undefined as 'asc' | 'desc' | undefined // 入职时间排序 desc：降序  asc 升序
})
const queryFormRef = ref() // 搜索的表单

/** 打开弹窗 */
// type: online: 各公司在职人员数 shape:饼状图人员数据 ssc:在职入职离职
const open = async (type: string, data: any) => {
  dialogVisible.value = true
  dialogTitle.value = '数据'
  dataType.value = type
  queryParams.value.company = data.company || ''
  if (type === 'shape') {
    queryParams.value.type = data.type || ''
    queryParams.value.value = data.value || ''
  } else if (type === 'ssc') {
    queryParams.value.type = data.type || ''
    queryParams.value.beginDate = data.date?.[0] || undefined
    queryParams.value.endDate = data.date?.[1] || undefined
    queryParams.value.deptName = data.deptName || ''
  }
  getList()
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 查询列表 */
const getList = async () => {
  loading.value = true
  if (dataType.value === 'online') {
    // 各公司在职人员数
    const data = await PersonRosterApi.humanResourcesQueryPersonByCompany(queryParams.value).catch(
      () => {
        loading.value = false
      }
    )
    loading.value = false
    list.value = data.records || []
    total.value = data.total
  } else if (dataType.value === 'shape') {
    // 饼状图人员数据

    const data = await PersonRosterApi.humanResourcesQueryPersonByShape(queryParams.value).catch(
      () => {
        loading.value = false
      }
    )
    loading.value = false
    list.value = data.records || []
    total.value = data.total
  } else if (dataType.value === 'ssc') {
    // ssc在职入职离职
    const data = await PersonRosterApi.humanResourcesQueryDeptByShape(queryParams.value).catch(
      () => {
        loading.value = false
      }
    )
    loading.value = false
    list.value = data.records || []
    total.value = data.total
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.page = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields()
  handleQuery()
}

/** 新增操作 */
const seeDialogRef = ref()
const seeDetail = (row) => {
  seeDialogRef.value.open(row.userId)
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

    if (dataType.value === 'online') {
      // 各公司在职人员数
      const data = await PersonRosterApi.exportPersonRoster(params)
      if (data) {
        download.excel(data, `人员看板在职人员数据.xls`)
      }
    } else if (dataType.value === 'shape') {
      // 饼状图人员数据
      const data = await PersonRosterApi.exportPersonRosterByShape(params)
      if (data) {
        download.excel(data, `人员看板饼状图人员数据.xls`)
      }
    } else if (dataType.value === 'ssc') {
      // ssc在职入职离职
      const data = await PersonRosterApi.exportDeptByShape(params)
      if (data) {
        download.excel(data, `人员看板在职入职离职数据.xls`)
      }
    }
  } finally {
    exportLoading.value = false
    notificationRef.value?.close()
  }
}
// 排序事件
const handleSortChange = ({ prop, order }) => {
  if (prop === 'hireDate') {
    queryParams.value.hireDateOrder = { ascending: 'asc', descending: 'desc' }[order]
  } else {
    queryParams.value.hireDateOrder = undefined
  }
  console.log('请求参数', queryParams.value)
  getList()
}

// 弹窗关闭事件
const handleCLose = () => {
  dialogVisible.value = false
  // 重置搜索条件
  queryFormRef.value?.resetFields()
  notificationRef.value?.close()
}
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
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
</style>
<style lang="scss" scoped>
.mainContent {
  .pagination {
    height: 60px;
    background: #fff;
    width: calc(100%);
    position: absolute;
    right: 0;
    bottom: 0px;
    z-index: 99;
  }
}

.personType {
  height: 27px;
  border-radius: 4px;
  border: 1px solid #c2c6ce;
  display: flex;
  flex-direction: row;
  align-items: center;

  &-dot {
    width: 6px;
    height: 6px;
    border-radius: 6px;
    background: #0064ff;
    margin-left: 10px;
    margin-right: 10px;
  }

  &-value {
    font-size: 12px;
    color: #333333;
    line-height: 17px;
    padding-right: 10px;
  }
}
</style>

<style scoped>
:deep(.el-dialog) {
  padding: 0px;
}

:deep(.com-dialog .el-dialog__body) {
  padding-top: 0px !important;
  height: 75vh;
}

:deep(.com-dialog .el-dialog__header) {
  border-bottom: none;
}

:deep(.CommonSearchForm) {
  border-bottom: none;
}
</style>
