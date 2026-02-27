<template>
  <div class="drawer-wrapper">
    <el-drawer
      v-model="drawerVisible"
      :with-header="false"
      :wrapper-closable="true"
      class="drawer"
      size="936"
    >
      <div>
        <div class="drawerTitle">
          <div>{{ drawerTitle }}</div>
          <div @click="drawerVisible = false">
            <el-icon><CloseBold /></el-icon>
          </div>
        </div>
      </div>
      <div class="drawerContent">
        <div class="drawerContent-title">
          <span class="line"></span>
          <span>被评价人：{{ appraisee }} </span>
          <span style="margin-left: 10px">评价问卷：{{ questionnaireName }}</span>
        </div>
        <div class="commonTopFilterWrap">
          <div class="commonTopFilterWrap-filter" style="margin-left: -30px">
            <el-form
              ref="queryFormRef"
              :inline="true"
              :model="queryParams"
              label-width="80px"
              @submit.prevent
            >
              <el-form-item label="姓名" prop="keyword" style="margin-right: 30px">
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
              <el-form-item label="评价关系" prop="evaluationRelation" style="margin-right: 30px">
                <el-select
                  class="searchFormItemWidth"
                  v-model="queryParams.evaluationRelation"
                  placeholder="请选择评价关系"
                  clearable
                  @change="handleQuery"
                >
                  <el-option
                    v-for="dict in memberRelationDictList"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
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
              <SWFilterAdd
                v-if="showAdd"
                class="commonAddBtn"
                :list="addList"
                :current-code="currentAddCode"
                @add-btn-click="addBtnClick"
              />
            </div>
          </div>
        </div>
        <el-table
          v-loading="loading"
          :header-cell-style="appStore.headerCellStyle"
          :data="list"
          :show-overflow-tooltip="true"
          row-class-name="commonTableRow1"
          class="SWCommonTable"
          v-horizontal-scroll="'always'"
        >
          <el-table-column label="工号" prop="employeeNo" />
          <el-table-column label="姓名" prop="name">
            <template #default="{ row }">
              <otrUser :data="{ name: row.name, avatarOrigin: row.avatarOrigin }" />
            </template>
          </el-table-column>
          <el-table-column label="评价关系" prop="evaluationRelation">
            <template #default="{ row }">
              <div>{{ memberRelationMap[row.evaluationRelation] }}</div>
            </template>
          </el-table-column>
          <el-table-column label="所属主体" prop="company">
            <template #default="{ row }">
              {{ getDictLabel(DICT_TYPE.PR_COMPANY,row.company) }}
            </template>
          </el-table-column>
          <el-table-column label="部门" prop="departmentName" />
          <el-table-column label="需评价人" prop="evaluationPersonInfoList">
            <template #default="scope">
              <el-popover
                v-if="
                  scope.row.evaluationPersonInfoList &&
                  scope.row.evaluationPersonInfoList.length > 0
                "
                class="evluationMemberPopover"
                placement="bottom-end"
                :width="281"
                trigger="hover"
                :show-arrow="false"
                :offset="4"
              >
                <template #reference>
                  <div class="evluationMember">{{ scope.row.evaluationPersonInfoList.length }}</div>
                </template>
                <EvaluationMembers :list="scope.row.evaluationPersonInfoList" />
              </el-popover>
              <div v-else>--</div>
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            :show-overflow-tooltip="false"
            width="120"
            align="center"
            fixed="right"
          >
            <template #default="scope">
              <el-button
                v-if="showAdd"
                type="danger"
                style="cursor: pointer"
                @click="handleDelete(scope.row.userId)"
                link
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-drawer>
    <AddDialog ref="addDialogRef" @submit-success="getList" />
  </div>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'
import { Search } from '@element-plus/icons-vue'
import AddDialog from './addDialog.vue'
import EvaluationMembers from './evaluationMembers.vue'
import otrUser from '../../components/otrUser.vue'
const drawerVisible = ref(false) // 弹窗的是否展示
const drawerTitle = ref('') // 弹窗的标题
import { DICT_TYPE, getDictLabel } from '@/utils/dict'

import * as OtrEvaluationRelationshipApi from '@/api/otr/evaluationRelationship/index'
import { memberTypeList, isShowSurveyInfo, getBySurveyId } from './memberRelationHook'
const appStore = useAppStore()
const message = useMessage() // 消息弹窗
const total = ref(0) // 列表的总页数
const list = ref<any[]>([]) // 表格数据
const route = useRoute()
const inventoryId = (route.query.inventoryId || '') as string // 活动id
const appraisee = ref('') // 被评价人
const questionnaireName = ref('') // 评价问卷名称
const queryParams = reactive({
  page: 1,
  size: 10,
  keyword: '',
  questionnaireId: '', // 问卷id
  appraiseeId: '', // 被评价人id
  evaluationRelation: ''
})
defineProps({
  showAdd: {
    type: Boolean,
    default: () => true
  }
})
const queryFormRef = ref() // 搜索的表单
const addDialogRef = ref() // 新增弹窗
const addList = ref([
  {
    label: '添加',
    code: 'add'
  }
])

// 当前新增按钮code码
const currentAddCode = ref(addList.value[0].code)

// 新增按钮点击
const addBtnClick = (value) => {
  if (value) {
    openForm('')
  }
}
const openForm = (id?: string) => {
  if (addDialogRef.value) {
    //
    addDialogRef.value.open(queryParams.appraiseeId, queryParams.questionnaireId, 'evaluator')
  }
}
/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.page = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryParams.keyword = ''
  queryParams.evaluationRelation = ''
  queryParams.page = 1
  queryParams.size = 10
  handleQuery()
}

const memberRelationDictList = ref<any>([])
const memberRelationMap = ref({})

/** 打开弹窗 */
const open = async (params) => {
  const { userId, questionnaireId, name, questionnaire } = params
  appraisee.value = name
  questionnaireName.value = questionnaire
  queryParams.appraiseeId = userId
  queryParams.questionnaireId = questionnaireId
  drawerVisible.value = true
  drawerTitle.value = '评价人'
  getList()
  await getBySurveyId(queryParams.questionnaireId)
  memberRelationDictList.value = []
  memberTypeList.value.forEach((item) => {
    if (item.type > 0) {
      if (isShowSurveyInfo(item.type)) {
        memberRelationDictList.value.push({
          label: item.value,
          value: item.type
        })
      }
    }
  })
  memberRelationDictList.value.forEach((ele) => {
    memberRelationMap.value[ele.value] = ele.label
  })
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const loading = ref(false)
/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await OtrEvaluationRelationshipApi.getEvaluatorList(queryParams).catch(() => {
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
const handleDelete = async (evaluatorId: string) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await OtrEvaluationRelationshipApi.deleteData(
      queryParams.appraiseeId,
      evaluatorId,
      queryParams.questionnaireId
    )
    message.success('删除成功')
    // 刷新列表
    await getList()
  } catch {}
}
</script>

<style lang="scss" scoped>
:deep(.el-drawer__body){
  background-image: url('@/assets/imgs/drawer_bg.png') !important;
  background-size: cover !important;
}
:deep(.el-drawer){
  border-top-left-radius: 16px !important;
  border-bottom-left-radius: 16px !important;
  overflow: hidden !important;
}
// 修改备注的文本框背景
:deep(.el-textarea__inner),
:deep(.el-input__wrapper),
:deep(.el-select__wrapper) {
  background-color: #f8f8f9 !important;
  box-shadow: none !important;
}

// 修改弹窗的标题样式
.drawerTitle {
  font-size: 14px;
  display: flex;
  color: #333333;
  font-weight: 600;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin: 0 0 18px 0;
}

.drawerContent {
  width: 100%;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-sizing: border-box;
  margin-bottom: 12px;
  &-title {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: 700;
    &.center {
      margin-bottom: -20px;
    }
    .line {
      width: 3px;
      height: 10px;
      background: #0064ff;
      margin-right: 6px;
    }
  }
}
.evluationMemberPopover {
  margin-right: 10px;
}
.evluationMember {
  cursor: pointer;
  // width: 66px;
  // height: 26px;
  // background: rgba(210, 238, 251, 0.42);
  border-radius: 13px;
  font-size: 14px;
  color: #0064ff;
  line-height: 26px;
  text-align: left;
}
.drawerFooter {
  display: flex;
  justify-content: flex-end;
  margin: 20px 0;
}
</style>
