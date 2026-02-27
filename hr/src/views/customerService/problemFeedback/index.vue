<template>
  <ContentWrap>
    <div class="mb-5px">
      <div class="commonTopFilterWrap">
        <div class="commonTopFilterWrap-filter">
          <el-form ref="queryFormRef" :inline="true" :model="queryParams" class="mb-5px" label-width="80">
            <el-form-item label="问题处理部门" prop="handleDept" class="longLabel">
              <el-select class="!w220px" @change="getList()" v-model="queryParams.handleDept" placeholder="请选择问题处理部门" multiple clearable>
                <el-option v-for="item in getIntDictOptions(DICT_TYPE.CS_PROBLEM_FEEDBACK_HANDLE_DEPT, true)"
                  :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="品类" prop="category">
              <el-select class="!w220px" @change="getList()"  v-model="queryParams.category" placeholder="请选择品类" multiple clearable>
                <el-option v-for="item in getIntDictOptions(DICT_TYPE.CS_PROBLEM_FEEDBACK_CATEGORY, true)"
                  :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="问题反馈类型" prop="type" class="longLabel">
              <el-select class="!w220px" @change="getList()"  v-model="queryParams.type" placeholder="请选择问题反馈类型" multiple clearable>
                <el-option v-for="item in getIntDictOptions(DICT_TYPE.CS_PROBLEM_FEEDBACK_TYPE, true)" :key="item.value"
                  :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="反馈人" prop="feedbackPersonId">
              <SelectUser v-model="queryParams.feedbackPersonId" :multiple="false" @change="getList()" :showAvatarLable="true" :role="getRole('客诉请求')"/>
            </el-form-item>
            <el-form-item label="问题对接负责人" prop="directorId" class="longLabel" v-if="isExpand">
              <SelectUser v-model="queryParams.directorId" :multiple="false" @change="getList()" :showAvatarLable="true" :role="getRole('客服处理人')"/>
            </el-form-item>
            <el-form-item label="是否按时完成" prop="finishStatus" class="longLabel" v-if="isExpand">
              <el-select class="!w220px" @change="getList()" v-model="queryParams.finishStatus" placeholder="请选择是否按时完成" multiple clearable>
                <el-option v-for="item in getIntDictOptions(
                  DICT_TYPE.CS_PROBLEM_FEEDBACK_FINISH_STATUS,
                  true
                )" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="status" v-if="isExpand">
              <el-select class="!w220px" @change="getList()" v-model="queryParams.status" placeholder="请选择状态" multiple clearable>
                <el-option v-for="item in getIntDictOptions(DICT_TYPE.CS_PROBLEM_FEEDBACK_STATUS, true)"
                  :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="反馈日期" prop="feedbackDate" v-if="isExpand">
              <el-date-picker class="!w220px" v-model="dateRange" type="daterange" value-format="YYYY-MM-DD"
                range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" @change="handleDateChange" />
            </el-form-item>
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
            <el-dropdown split-button type="primary" class="ml20px" :teleported="false" @click="openForm('add', '')">
              操作
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click.stop="openForm('add', '')" v-if="isProblemCs">新增</el-dropdown-item>
                  <el-dropdown-item @click.stop="exportData">导出</el-dropdown-item>
                  <el-dropdown-item @click.stop="openDashBoard()">数据看板</el-dropdown-item>
                  <el-dropdown-item @click.stop="router.push({name: 'CustomerComplaintSummaryDashboard'})">客诉汇总看板</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <SWFilterExpandAllNew :isExpand="isExpand" @expand-click="isExpand = !isExpand" />
          </div>
        </div>
      </div>
    </div>

    <!-- 列表 -->
    <listTable :list="list" :loading="loading" @click-btn="handleClick" :isProblemDirector="grabCheck('客服处理人')" :isProblemCs="grabCheck('客诉请求')"/>
    <!-- 分页 -->
    <div class="pagination-wrapper">
      <Pagination :total="total" v-model:page="queryParams.page" v-model:limit="queryParams.size"
        @pagination="getList()" />
    </div>
  </ContentWrap>

  <!-- 新增编辑 -->
  <editDrawer ref="formRef" @success="getList()" />

  <!-- 数据看板  -->
  <dashboardDrawer ref="dashBoardRef" />
</template>

<script lang="ts">
export default { name: 'problemFeedBack' };
</script>
<script lang="ts" setup>
import * as problemFeedbackApi from '@/api/customerService/problemFeedback'
import SelectUser from '@/components/common/user/selectUser.vue';
import listTable from './components/listTable.vue'
import editDrawer from './components/editDrawer.vue'
import dashboardDrawer from './components/dashboardDrawer.vue'
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import download from '@/utils/download'
import { ElLoading } from 'element-plus'
import { ref, onMounted } from 'vue'
import { useMessage } from '@/hooks/web/useMessage'
const message = useMessage()
const router = useRouter() // 路由对象

import { useRole } from "@/hooks/common/useRole";
const { getPermissionInfo, grabCheck,getRole} = useRole('客服');
provide('getRole',getRole)

const loading = ref(false) // 列表的加载中
const list = ref<any[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const isExpand = ref(false)

const queryParams = ref<any>({
  page: 1,
  size: 10,
  category: [],
  type: [],
  handleDept: [],
  feedbackPersonName: '',
  feedbackPersonId:'',
  directorName: '',
  directorId:'',
  finishStatus: [],
  status: [],
  feedbackDateStart: '',
  feedbackDateEnd: ''
})
const dateRange = ref([])
const handleDateChange = (vals) => {
  if (vals && vals.length) {
    queryParams.value.feedbackDateStart = vals[0]
    queryParams.value.feedbackDateEnd = vals[1]
  } else {
    queryParams.value.feedbackDateStart = ''
    queryParams.value.feedbackDateEnd = ''
  }
  getList()
}

/** 操作 */
const formRef = ref()
const openForm = (type: string, id?: string,isDirectorEdit?:any,isFeedBackEdit?:any) => {
  formRef.value?.open(type, id,isDirectorEdit,isFeedBackEdit)
}
const dashBoardRef = ref()
const openDashBoard = () => {
  dashBoardRef.value?.open()
}
const handleClick = async (type: string, id: string,isDirectorEdit:boolean,isFeedBackEdit:boolean) => {
  if (type === 'edit') {
    openForm(type, id,isDirectorEdit,isFeedBackEdit)
  }
  if (type === 'show') {
    openForm(type, id)
  }
  if(type === 'handle'){
    openForm(type, id)
  }
  if(type === 'changeDirector'){
    openForm(type, id)
  }
  if(type === 'delete'){
    await message.confirm('请确认是否删除')
    await problemFeedbackApi.deleteById({id})
    message.success('删除成功')
    getList()
  }
}
const queryFormRef = ref() // 搜索的表单
/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.page = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  queryParams.value.storeCode = ''
  dateRange.value = []
  handleQuery()
}
// 处理参数
const handleParams = () => {
  if (dateRange.value?.length) {
    queryParams.value.feedbackDateStart = dateRange.value[0]
    queryParams.value.feedbackDateEnd = dateRange.value[1]
  } else {
    queryParams.value.feedbackDateStart = ''
    queryParams.value.feedbackDateEnd = ''
  }
  const params = { ...queryParams.value }
  params.category = params.category?.join(',')
  params.type = params.type?.join(',')
  params.handleDept = params.handleDept?.join(',')
  params.finishStatus = params.finishStatus?.join(',')
  params.status = params.status?.join(',')

  return params
}
/** 查询列表 */
const getList = async (id:string = '') => {
  loading.value = true
  try {
    const params = handleParams()
    const data = await problemFeedbackApi.getList(id ? { ...params, id } : { ...params }).catch((err: {}) => {
      console.log(err)
    })
    list.value = data.records 
    total.value = data.total
  } finally {
    loading.value = false
  }
}

// 数据导出
const exportData = async () => {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: '数据导出中...'
  })
  try {
    const params = handleParams()
    delete params.page
    delete params.size
    const data = await problemFeedbackApi.exportData(params).catch((err: {}) => {
      console.log(err)
    })
    if (data) {
      download.excel(data, '客服问题反馈汇总表.xlsx')
    }
  } finally {
    loadingInstance.close()
  }
}

// 是否问题处理人
const isProblemDirector = computed(()=>grabCheck('客服处理人'))
// 是否客服
const isProblemCs = computed(()=>grabCheck('客诉请求'))

/** 初始化 **/
const route = useRoute();
onMounted(() => {
  getPermissionInfo(() => {
    if (route.query?.id) {
      getList(route.query.id as string);
    } else {
      getList()
    }
  })
})
if (route.query?.id) {
  const newUrl = window.location.href.replace(/\?.*$/, '')
  history.replaceState({}, '', newUrl)
};
</script>

<style lang="less" scoped>
:deep(.el-form--inline .el-form-item) {
  margin-right: 10px;
}

:deep(.el-form-item--default .el-form-item__label) {
  text-align: right;
}

:deep(.el-form-item__content) {
  width: 220px;
}

.longLabel {
  :deep(.el-form-item__label) {
    line-height: 16px;
  }
}

:deep(.el-button-group) {
  display: flex;
}
</style>
