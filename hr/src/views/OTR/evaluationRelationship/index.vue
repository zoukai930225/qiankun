<template>
  <stepBox />
  <div class="OTRCommonMainContainer">
    <!-- 搜索工作栏 -->
    <ContentWrap>
      <div class="commonTopFilterWrap">
        <div class="commonTopFilterWrap-filter">
          <el-form
            ref="queryFormRef"
            :inline="true"
            :model="queryParams"
            label-width="80px"
            @submit.prevent
          >
            <el-form-item label="问卷" prop="questionnaireIds">
              <el-select
                class="searchFormItemWidth"
                v-model="queryParams.questionnaireIds"
                placeholder="请选择问卷"
                multiple
                clearable
                @change="handleQuery"
              >
                <el-option
                  v-for="dict in surveyList"
                  :key="dict.id"
                  :label="dict.surveyName"
                  :value="dict.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="姓名" prop="keyword">
              <el-input
                :prefix-icon="Search"
                class="searchFormItemWidth"
                v-model="queryParams.keyword"
                clearable
                placeholder="工号/姓名模糊匹配"
                @keyup.enter="handleQuery"
                @clear="handleQuery"
              />
            </el-form-item>
            <el-form-item label="所属主体" prop="company">
              <el-select class="searchFormItemWidth" v-model="queryParams.company">
                <el-option v-for="dict in getIntDictOptions(DICT_TYPE.PR_COMPANY)" :label="dict.label" :value="dict.value"/>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div>
          <el-button @click="handleQuery" class="commonSearchBtn">
            <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
            搜索
          </el-button>
          <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0px">
            重置
          </el-button>
        </div>
        <div class="commonTopFilterWrap-search">
          <div class="commonTopFilterWrap-search-container">
            <el-button type="danger" plain :disabled="!selectedData.length" @click="handleBatchDel" v-if="showAdd">
              批量删除
            </el-button>
            <el-button v-if="showAdd" class="search-btn-wapper border" @click="downloadTemplate">
              <span class="search-btn-desc">模版下载 </span>
            </el-button>

            <el-button v-if="showAdd" class="search-btn-wapper border" @click="importTemplate" >
              <span class="search-btn-desc">导入 </span>
            </el-button>

            <SWFilterAdd
              v-if="showAdd"
              class="commonAddBtn"
              :list="addList"
              :current-code="currentAddCode"
              @add-btn-click="addBtnClick"
            />

            <el-button class="search-btn-wapper invitation" @click="invit" style="margin-left: 16px">
              <span class="search-btn-desc">邀请评价</span>
            </el-button>
          </div>
        </div>
      </div>
      <div class="table">
        <el-table
          v-loading="loading"
          :header-cell-style="appStore.headerCellStyle"
          :data="list"
          :show-overflow-tooltip="true"
          row-class-name="commonTableRow1"
          class="SWCommonTable"
          v-horizontal-scroll="'always'"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection"  width="55" />
          <el-table-column label="工号" prop="employeeNo" />
          <el-table-column label="被评价人" prop="name">
            <template #default="{ row }">
              <otrUser :data="{ name: row.name, avatarOrigin: row.avatarOrigin }" />
            </template>
          </el-table-column>
          <el-table-column label="所属主体" prop="company">
            <template #default="{ row }">
              {{ getDictLabel(DICT_TYPE.PR_COMPANY,row.company) }}
            </template>
          </el-table-column>
          <el-table-column label="部门" prop="departmentName" />
          <el-table-column label="关联问卷" prop="questionnaire">
            <template #default="scope">
              <div>{{ scope.row.questionnaire }}</div>
            </template>
          </el-table-column>

          <el-table-column label="操作" :show-overflow-tooltip="false" width="170" align="center" fixed="right">
            <template #default="scope">
              <el-button
                v-if="showAdd"
                class="action-btn"
                style="cursor: pointer"
                @click="openForm(scope.row.userId, scope.row.questionnaireId,'edit')"
                link
              >
                编辑
              </el-button>
              <el-button
                class="action-btn"
                style="cursor: pointer"
                @click="openDrawer(scope.row)"
                link
              >
                评价人
              </el-button>
              <el-button
                v-if="showAdd"
                type="danger"
                style="cursor: pointer"
                @click="handleDelete(scope.row.userId, scope.row.questionnaireId)"
                link
              >
                删除
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
      </div>
    </ContentWrap>

    <AddDialog ref="addDialogRef" @submit-success="getList" :surveyList="surveyList" />
    <!-- 表单弹窗：批量导入 -->
    <SWBatchImport
      ref="importFormRef"
      :id="inventoryId"
      :importType="SWBatchImportType.otrEvluation"
      @success="getList"
    />

    <evaluatorListDrawer ref="evaluatorListDrawerRef" @success="getList" :showAdd="showAdd" />
  </div>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'
import { Search } from '@element-plus/icons-vue'
import AddDialog from './components/addDialog.vue'
import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'
import { useRole } from '@/hooks/common/useRole'
import SWBatchImport from '@/components/SWBatchImport/index.vue' // 导入组件
const { getPermissionInfo, grabCheck } = useRole('人才盘点')
import { SWBatchImportType } from '@/components/SWBatchImport/index'

import stepBox from '../components/stepBox.vue'
import otrUser from '../components/otrUser.vue'
import evaluatorListDrawer from './components/evaluatorListDrawer.vue'

import * as OtrEvaluationRelationshipApi from '@/api/otr/evaluationRelationship/index'
import request from '@/config/axios'
defineOptions({ name: 'EvaluationRelationship' })
const appStore = useAppStore()
const message = useMessage() // 消息弹窗
const route = useRoute()
const inventoryId = (route.query.inventoryId || '') as string // 活动id
const fromSource = route.query.source || 0 // 入口类型 0 活动 1问卷
const router = useRouter() // 路由对象

const total = ref(0) // 列表的总页数
const surveyList = ref<any[]>([]) // 问卷列表
const list = ref<any[]>([]) // 表格数据

const evaluatorListDrawerRef = ref()
const openDrawer = (params) => {
  evaluatorListDrawerRef.value.open(params)
}

const queryParams = reactive({
  page: 1,
  size: 10,
  keyword: '',
  company:"",
  questionnaireIds: [], // 问卷id
  inventoryId: inventoryId // 活动id
})
const queryFormRef = ref() // 搜索的表单
const addDialogRef = ref() // 新增弹窗
const addList = ref([
  {
    label: '新建',
    code: 'add'
  }
])

// 活动设置
// const activeSetting = () => {
//   router.push({
//     path: `/otr/activitySet`
//   })
// }

// 评价邀请
const invit = () => {
  router.push({
    name: `ReviewInvitaion`,
    query: { id: inventoryId }
  })
}

// 当前新增按钮code码
const currentAddCode = ref(addList.value[0].code)

// 模版下载
const downloadTemplate = () => {
  window.open(
    'https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/common/template/pjgxdr_template.xlsx'
  )
}

// 导入
const importTemplate = () => {
  importData()
}

// 新增按钮点击
const addBtnClick = (value) => {
  if (value) {
    currentAddCode.value = value.code
    if (currentAddCode.value === 'add') {
      openForm('')
    } else if (currentAddCode.value === 'import') {
      importData()
    } else if (currentAddCode.value === 'template') {
      window.open(
        'https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/common/template/pjgxdr_template.xlsx'
      )
    }
  }
}

/** 导入操作 */
const importFormRef = ref()
const importData = () => {
  importFormRef.value.open()
}

const openForm = (id?: string, questionId?: string,type?:string) => {
  if (addDialogRef.value) {
    addDialogRef.value.open(id, questionId,type)
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.page = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  queryParams.keyword = ''
  queryParams.questionnaireIds = []
  queryParams.page = 1
  queryParams.size = 10
  handleQuery()
}

/**
 * 查询问卷列表
 */
const getSurveyList = async () => {
  if (inventoryId) {
    const data = await OtrEvaluationRelationshipApi.getSurveyList(inventoryId).catch(() => {
      surveyList.value = []
    })
    if (data && data.length > 0) {
      surveyList.value = data || []
    }
  }
}

const loading = ref(false)
/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const params = {
      ...queryParams,
      questionnaireIds: queryParams.questionnaireIds.join(',')
    }
    const data = await OtrEvaluationRelationshipApi.getAppraiseeList(params).catch(() => {
      list.value = []
    })
    if (data) {
      list.value = data.records || []
      total.value = data.total || 0
    } else {
      list.value = []
    }
  } finally {
    loading.value = false
  }
}

/** 删除按钮操作 */
const handleDelete = async (appraiseeId: string, questionnaireId) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await OtrEvaluationRelationshipApi.deleteData(appraiseeId, '', questionnaireId)
    message.success('删除成功')
    // 刷新列表
    await getList()
  } catch {}
}

const selectedData = ref([])
const handleSelectionChange = (val:any)=>{
  selectedData.value = val
}
const handleBatchDel = async()=>{
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    const data = selectedData.value.map((el:any)=>({
      appraiseeId:el.userId,
      questionnaireId:el.questionnaireId
    }))
    // await OtrEvaluationRelationshipApi.deleteData(appraiseeId, '', questionnaireId)
    request.post({ url:`/api/otr/evaluation/record/batchDelete`,data }).then(()=>{
      message.success('删除成功')
      // 刷新列表
      getList()
    })
    
  } catch {}
}

const showAdd = ref(true)
// 查询活动状态
const getStatus = async () => {
  // 状态 1 初始化 2 评价中 3 问卷关闭 4 校准中 5 活动结束
  const res = await OtrEvaluationRelationshipApi.getActStatusById(inventoryId)
  const isInit = res == 1
  // showAdd.value = res == 1
  // 返回当前活动是否截止 true标识已截止 false未截止
  const isActFinished = await request.get({url:`/api/otr/survey/actEnd/${inventoryId}`})
  // request.get({url:`/api/otr/survey/actEnd/${inventoryId}`}).then((res:any)=>{
  //   showAdd.value = !res
  // })
  if(grabCheck('人才盘点超管')){
    // 管理员 不管活动状态 只要活动没有结束都可以编辑
    showAdd.value = !isActFinished

  }else{
    // 不是管理员 活动状态为初始化(1) 并且活动没有结束
    showAdd.value = isInit && !isActFinished
  }
}

onMounted(() => {
  getPermissionInfo(()=>{
    getStatus()
    getSurveyList()
    getList()
  })
 
})
</script>

<style lang="scss" scoped>
.OTRCommonMainContainer {
  background: #fff;
  &-tabs {
    margin-left: 20px;
    padding-top: 20px;
  }

  .commonTopFilterWrap {
    border-bottom: 1px solid #f0f0f0;
  }
  .table {
    margin-top: 16px;
    width: 100%;
  }
}
.OTRCommonMainContainer-tabs .custom-tabs-label {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.OTRCommonMainContainer-tabs .custom-tabs-label span {
  vertical-align: middle;
  margin-left: 4px;
}
item {
  &-icon {
    margin-left: 4px;
    margin-right: 4px;
    width: 15px;
    height: 15px;
    border-radius: 7.5px;
  }
  &-text {
    margin-right: 6px;
    font-size: 12px;
    color: #333;
    line-height: 20px;
  }
}
.search-btn-wapper {
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  // width: 96px;
  padding: 0 16px;
  height: 32px;
  line-height: 32px;
  margin-right: 16px;
  .search-btn-icon {
    width: 12px;
    height: 12px;
    margin-right: 3px;
  }
  .search-btn-desc {
    font-weight: 400;
    font-size: 14px;
    color: #ffffff;
  }

  &.border {
    border: 1px solid #0064ff;
    .search-btn-desc {
      color: #0064ff;
    }
  }
}
.invitation {
  background: #0064ff;
}
.action-btn {
  color: #0064ff;
  cursor: pointer;
  &:hover {
    color: #0064ff;
    opacity: 0.6;
  }
}
</style>
