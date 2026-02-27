<template>
  <div>
    <Dialog
      v-model="dialogVisible"
      :modal-append-to-body="false"
      :title="dialogTitle"
      width="1395px"
    >
      <div class="search" v-if="addType !== 'evaluator'">
        <div class="commonTopFilterWrap-filter">
          <el-form
            ref="queryFormRef"
            :inline="true"
            label-width="80px"
            @submit.prevent
            :rules="formRules"
            :model="queryParams"
          >
            <el-form-item label="关联问卷" prop="questionnaireId">
              <el-select
                class="searchFormItemWidth"
                v-model="queryParams.questionnaireId"
                placeholder="请选择问卷"
                clearable
                @change="changeQuestionnaire"
              >
                <el-option
                  v-for="dict in surveyList"
                  :key="dict.id"
                  :label="dict.surveyName"
                  :value="dict.id"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="mainContainer">
        <div class="mainContainer-dept">
          <ModuleTop class="mainContainer-dept-top" />
          <div class="mainContainer-dept-container">
            <ElScrollbar
              style="
                height: calc(70vh - 70px);
                padding-left: 10px;
                padding-right: 10px;
                margin-top: 10px;
                margin-bottom: 10px;
              "
            >
              <el-tree
                v-if="deptLoading"
                ref="treeRef"
                :data="menuOptions"
                :props="defaultProps"
                highlight-current
                :default-expanded-keys="defaultExpandedKeys"
                @node-click="handleNodeClick"
                node-key="id"
              />
            </ElScrollbar>
          </div>
        </div>

        <div class="mainContainer-member">
          <ModuleTop type="user" class="mainContainer-member-top" />
          <div class="mainContainer-member-container">
            <el-table
              ref="selectTableRef"
              :header-cell-style="appStore.headerCellStyle"
              :data="memberList"
              :stripe="true"
              :show-overflow-tooltip="true"
              row-class-name="commonTableRow"
              class="SWCommonTable"
              v-horizontal-scroll="'always'"
              empty-text="选择部门展示对应人员"
              style="
                height: calc(70vh - 80px);
                width: 480px;
                margin-left: 20px;
                margin-right: 20px;
                margin-top: 20px;
                margin-bottom: 10px;
              "
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55" />
              <el-table-column label="人员编号" prop="employeeNo" />
              <el-table-column label="人员名称" prop="name" />
              <el-table-column label="部门" prop="departmentName" />
            </el-table>
          </div>
        </div>
        <div class="mainContainer-memberSelect">
          <div v-for="(value, index) in memberTypeList" :key="index">
            <!-- 评价人添加 -->
            <div v-if="addType === 'evaluator' || addType === 'edit'">
              <div
                v-if="isShowSurveyInfo(value.type)"
                class="mainContainer-memberSelect-item"
                :class="{
                  'mainContainer-memberSelect-itemDisabled': index < 2
                }"
                @click="clickSelectMemberType(value)"
              >
                <div class="mainContainer-memberSelect-item-text">{{ value.value }}</div>
                <img
                  class="mainContainer-memberSelect-item-arrow"
                  src="@/assets/imgs/otr/evluation/evluation_icon_arrow.png"
                />
              </div>
            </div>
            <!-- 被评价人 -->
            <div v-else>
              <div
                v-if="isShowSurveyInfo(value.type)"
                class="mainContainer-memberSelect-item"
                :class="{
                  'mainContainer-memberSelect-itemDisabled':
                    (!isSelectAppraisee() && index > 0) || index === 1
                }"
                @click="clickSelectMemberType(value)"
              >
                <div class="mainContainer-memberSelect-item-text">{{ value.value }}</div>
                <img
                  class="mainContainer-memberSelect-item-arrow"
                  src="@/assets/imgs/otr/evluation/evluation_icon_arrow.png"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="mainContainer-releation">
          <ModuleTop type="releation" class="mainContainer-releation-top" />
          <div class="mainContainer-releation-container">
            <ElScrollbar
              style="
                height: calc(70vh - 80px);
                width: 371px;
                margin-left: 20px;
                margin-right: 20px;
                margin-top: 20px;
                margin-bottom: 10px;
              "
            >
              <div v-for="(item, index1) in memberInfos" :key="index1">
                <div v-if="isShowSurveyInfo(index1)">
                  <div class="title">{{ item.name }}</div>
                  <div class="valueBg">
                    <div class="valueBg-item" v-for="(i, index2) in item.list" :key="index2">
                      <img class="valueBg-item-icon" :src="i.avatarOrigin" />
                      <div class="valueBg-item-text">{{ i.name || i.enName || i.nickName }}</div>
                      <div v-if="addType === 'evaluator' || addType === 'edit'">
                        <el-icon
                          v-if="index1 > 1"
                          class="valueBg-item-delete"
                          color="#333"
                          @click="deleteMember(index1, index2)"
                          ><Close
                        /></el-icon>
                        <div v-else style="margin-left: 6px"></div>
                      </div>
                      <div v-else>
                        <el-icon
                          v-if="index1 !== 1"
                          class="valueBg-item-delete"
                          color="#333"
                          @click="deleteMember(index1, index2)"
                          ><Close
                        /></el-icon>
                        <div v-else style="margin-left: 6px"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ElScrollbar>
          </div>
        </div>
      </div>
      <template #footer>
        <div style="margin-right: 33px; padding-bottom: 20px">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button></div
        >
      </template>
    </Dialog>
  </div>
</template>
<script lang="ts" setup>
import { defaultProps } from '@/utils/tree'
import { useAppStore } from '@/store/modules/app'

import ModuleTop from './moduleTop.vue'

import * as DeptApi from '@/api/system/dept'
import * as PersonRosterApi from '@/api/hrAdmin/personRoster'
import * as OtrEvaluationRelationshipApi from '@/api/otr/evaluationRelationship/index'

import { memberTypeList, getBySurveyId, isShowSurveyInfo } from './memberRelationHook'

const message = useMessage() // 消息弹窗
const appStore = useAppStore()
const props = defineProps({
  surveyList: {
    type: Array as any,
    default: () => []
  }
})

const menuOptions = ref<DeptApi.DeptVO[]>([]) // 分类数据源
const defaultExpandedKeys = ref<any[]>([]) // 默认展开的节点

const memberList = ref([])
const memberInfos = ref([
  {
    name: '被评价人',
    list: [] as any
  },
  {
    name: '本人',
    list: [] as any
  },
  {
    name: '直接上级',
    list: [] as any
  },
  {
    name: '同事',
    list: [] as any
  },
  {
    name: '下级',
    list: [] as any
  },
  {
    name: '其他',
    list: [] as any
  },
  {
    name: '间接上级',
    list: [] as any
  },
  {
    name: '斜线上级',
    list: [] as any
  }
])

// 是否已选择被评价人
const isSelectAppraisee = () => {
  if (memberInfos.value[0].list.length > 0) {
    return true
  }
  return false
}

const queryFormRef = ref()
const formRules = reactive({
  questionnaireId: [{ required: true, message: '请选择关联问卷', trigger: 'blur' }]
})
const queryParams = reactive({
  questionnaireId: ''
})
const changeQuestionnaire = (value) => {
  getBySurveyId(value)
}

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
/** 打开弹窗 */
const appraiseeId = ref('') // 被评价人id
const addType = ref<any>('') // 评价人新增
const open = async (id: string, questionId: string, type?: string) => {
  dialogVisible.value = true
  dialogTitle.value = '新增'
  addType.value = type
  // 重置数据
  memberList.value = []
  memberInfos.value.forEach((item) => {
    item.list = []
  })
  appraiseeId.value = id
  queryParams.questionnaireId = questionId || props.surveyList[0].id
  getBySurveyId(queryParams.questionnaireId)
  getDeptList()
  if (id) {
    dialogTitle.value = addType.value === 'evaluator' ? '新增' : '编辑'
    const data = await OtrEvaluationRelationshipApi.getDataById(
      appraiseeId.value,
      queryParams.questionnaireId
    ).catch(() => {})
    if (data) {
      handleAppraiseeData(data)
    }
  } else {
  }
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const deptLoading = ref(false)
// 获取部门信息
const getDeptList = async () => {
  const data = await DeptApi.getDeptPage({}).catch(() => {
    deptLoading.value = true
  })
  deptLoading.value = true
  menuOptions.value = data || []
  if (menuOptions.value.length > 0) {
    defaultExpandedKeys.value = [(menuOptions.value[0].id as string) || '']
  }
}

const handleNodeClick = (data, node) => {
  getDeptMemberList(data.company, data.name, data.id)
}

/** 查询部门人员列表 */
const getDeptMemberList = async (selectCompany, selectDeptName, selectDeptId) => {
  const data = await PersonRosterApi.humanResourcesQueryDeptByShape({
    page: 1,
    size: 99999,
    company: selectCompany,
    inquire: '',
    type: '1',
    deptId: selectDeptId || '',
    deptName: selectDeptName
  }).catch(() => {})

  memberList.value = data.records || []
}

const selectTableRef = ref()
const selectedRows = ref<any[]>([])
const handleSelectionChange = (val: any[]) => {
  selectedRows.value = val
}

const clickSelectMemberType = (item) => {
  // 评价人页面  不能修改被评价人
  if (addType.value === 'evaluator') {
    if (item.type === 0) return
  }
  if (item.type === 1) {
    // 本人不能选择和被评价人一样
    return
  }
  if (selectedRows.value.length === 0) {
    message.warning('暂无人员可选择')
    return
  }
  if (selectedRows.value.length > 1) {
    if (item.type === 0 || item.type === 1 || item.type === 2) {
      // 本人 直接上级 被评价人
      message.warning('只可以选择一人')
      return
    }
  }

  if (item.type === 0 || item.type === 1 || item.type === 2) {
    memberInfos.value[item.type].list = [...selectedRows.value]
    if (item.type === 0) {
      autoCreateReleationReq(selectedRows.value[0].userId)
      memberInfos.value[1].list = [...selectedRows.value]
    }
  } else {
    if (item.type < memberInfos.value.length) {
      selectedRows.value.forEach((value) => {
        if (!isExistInMemberList(memberInfos.value[item.type].list, value)) {
          memberInfos.value[item.type].list.push(value)
        }
      })
    }
  }

  selectTableRef.value.clearSelection()
  selectedRows.value = []
}

const isExistInMemberList = (list: any, item: any) => {
  let isExist = false
  for (let i = 0; i < list.length; i++) {
    if (list[i].userId === item.userId) {
      isExist = true
    }
  }
  return isExist
}

// 删除成员
const deleteMember = (index: number, itemIndex: number) => {
  memberInfos.value[index].list = memberInfos.value[index].list.filter((_, i) => i !== itemIndex)
}
// 处理被评价人详情
// 评价关系 1-本人 2-直接上级 3-同事 4-下级 5-其他 6-间接上级 7-斜线上级
const handleAppraiseeData = (data: any) => {
  // 被评价人
  memberInfos.value[0].list = [
    {
      userId: data.userId || '',
      company:data.company || '',
      employeeNo: data.employeeNo || '',
      name: data.name || '',
      departmentName: data.departmentName || '',
      jobName: data.jobName || '',
      jobLevelName: data.jobLevelName || '',
      avatarOrigin: data.avatarOrigin || ''
    }
  ]

  //  评价关系列表对应展示
  const relationListMap = data.relationListMap || {}
  for (const value in relationListMap) {
    memberInfos.value[Number(value)].list = relationListMap[value]
    // if (Number(value) === 1) {
    //   // 被评价人
    //   memberInfos.value[0].list = relationListMap[value]
    // } else {
    //   memberInfos.value[Number(value)].list = relationListMap[value]
    // }
  }
}

// 自动生成上下级
const autoCreateReleationReq = async (id) => {
  const data = await OtrEvaluationRelationshipApi.personRosterAutoCreateReleation(id)
  if (data) {
    if (data.leader && data.leader.length > 0) {
      if (isShowSurveyInfo(2)) {
        memberInfos.value[2].list = data.leader
      }
    }
    if (data.colleague && data.colleague.length > 0) {
      if (isShowSurveyInfo(3)) {
        memberInfos.value[3].list = data.colleague
      }
    }
    if (data.subordinate && data.subordinate.length > 0) {
      if (isShowSurveyInfo(4)) {
        memberInfos.value[4].list = data.subordinate
      }
    }
  }
}

const submitForm = async () => {
  if (addType.value === 'evaluator') {
    // 被评价人
  } else {
    // 校验表单
    if (!queryFormRef) return
    const valid = await queryFormRef.value.validate()
    if (!valid) return
  }

  if (memberInfos.value[0].list.length === 0) {
    message.warning('请选择被评价人')
    return
  }
  const evaluationRelationRecordList = [] as any
  memberInfos.value.forEach((item, index) => {
    let evaluationRelation = 0
    if (index === 0) {
    } else if (index === 1) {
      evaluationRelation = 1
    } else {
      evaluationRelation = index
    }

    item.list.forEach((value) => {
      if (index !== 0) {
        evaluationRelationRecordList.push({
          questionnaireId: queryParams.questionnaireId,
          evaluationRelation: evaluationRelation ? evaluationRelation : '',
          evaluatorId: value?.userId || '',
          appraiseeId: memberInfos.value[0].list[0]?.userId || '',
          company:memberInfos.value[0].list[0]?.company || ''
        })
      }
    })
  })
  const paramData = {
    evaluationRelationRecordList
  }

  if (appraiseeId.value) {
    await OtrEvaluationRelationshipApi.updateEvaluationData({
      appraiseeId: appraiseeId.value,
      questionnaireId: queryParams.questionnaireId,
      ...paramData
    })
    message.success('更新成功')
    dialogVisible.value = false
    emit('submitSuccess')
  } else {
    await OtrEvaluationRelationshipApi.addEvaluationData(paramData)
    message.success('新增成功')
    dialogVisible.value = false
    emit('submitSuccess')
  }
}

const emit = defineEmits(['submitSuccess'])
</script>

<style lang="scss" scoped>
.mainContainer {
  display: flex;
  flex-direction: row;
  &-dept {
    display: flex;
    flex-direction: column;

    &-top {
      width: 297px;
      height: 46px;
      background: #f5f7fa;
      border-radius: 10px 10px 0px 0px;
    }
    &-container {
      width: 295px;
      background: #ffffff;
      border-radius: 0px 0px 10px 10px;
      border: 1px solid #dcdfe6;
      border-top: transparent;
    }
  }

  &-member {
    margin-left: 20px;
    display: flex;
    flex-direction: column;

    &-top {
      width: 520px;
      height: 46px;
      background: #f5f7fa;
      border-radius: 10px 10px 0px 0px;
    }
    &-container {
      width: 518px;
      background: #ffffff;
      border-radius: 0px 0px 10px 10px;
      border: 1px solid #dcdfe6;
      border-top: transparent;
    }
  }

  &-memberSelect {
    width: 102px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    &-item {
      cursor: pointer;
      margin-top: 16px;
      margin-bottom: 16px;
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 74px;
      height: 32px;
      background: #0064ff;
      border-radius: 4px;
      &-text {
        margin-left: auto;
        font-weight: 500;
        font-size: 12px;
        color: #ffffff;
        line-height: 20px;
        padding-right: 8px;
      }
      &-arrow {
        width: 6px;
        height: 9px;
        margin-right: auto;
      }
    }
    &-itemDisabled {
      opacity: 0.5;
    }
  }

  &-releation {
    display: flex;
    flex-direction: column;

    &-top {
      width: 411px;
      height: 46px;
      background: #f5f7fa;
      border-radius: 10px 10px 0px 0px;
    }
    &-container {
      width: 409px;
      background: #ffffff;
      border-radius: 0px 0px 10px 10px;
      border: 1px solid #dcdfe6;
      border-top: transparent;
      .title {
        font-size: 14px;
        color: #666666;
        line-height: 20px;
        padding-left: 16px;
      }
      .valueBg {
        margin-top: 12px;
        margin-bottom: 16px;
        margin-left: 8px;
        margin-right: 8px;
        width: 361px;
        min-height: 32px;
        background: #f8f8f9;
        border-radius: 4px;
        display: flex;
        flex-wrap: wrap;
        &-item {
          margin-top: 6px;
          margin-bottom: 7px;
          margin-left: 8px;
          margin-left: 8px;
          display: flex;
          flex-direction: row;
          align-items: center;
          height: 22px;
          background: #e6ecff;
          border-radius: 11px;
          width: auto;
          &-icon {
            margin-left: 6px;
            margin-right: 6px;
            width: 18px;
            height: 18px;
            border-radius: 7.5px;
          }
          &-text {
            font-size: 12px;
            color: #333333;
            line-height: 20px;
          }
          &-delete {
            cursor: pointer;
            margin-left: 4px;
            width: 15px;
            height: 15px;
            margin-right: 6px;
          }
        }
      }
    }
  }
}
</style>

<style scoped>
:deep(.el-dialog) {
  padding: 0px;
  /* background: linear-gradient(226deg, #f2f3ff 0%, #ffffff 39%, #ffffff 87%, #f0f8ff 100%); */
  box-shadow: 10px 10px 24px 0px rgba(0, 0, 0, 0.07);
}
:deep(.el-dialog__body) {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
  max-height: 75vh;
  min-height: 75vh;
}
:deep(.el-dialog__header) {
  border-bottom: none;
  font-weight: 500;
  font-size: 16px;
  color: #333333;
  line-height: 22px;
}
:deep(.CommonSearchForm) {
  border-bottom: none;
}
:deep(.el-checkbox__input.is-indeterminate .el-checkbox__inner) {
  background: #0064ff;
}
:deep(.el-radio__input.is-checked .el-radio__inner) {
  background: #0064ff;
}
:deep(.el-radio__input.is-checked + .el-radio__label) {
  color: #0064ff;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background: #0064ff;
}
:deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
  color: #0064ff;
}
:deep(.el-slider__button) {
  width: 14px;
  height: 14px;
  border: 2px solid #0064ff;
}
:deep(.el-slider__bar) {
  background: #0064ff;
}
/* 定制滚动条整体样式 */
::-webkit-scrollbar {
  width: 0px;
  background: transparent !important;
  background-color: transparent !important;
}

/* 滚动条轨道 */
::-webkit-scrollbar-track {
  background: transparent !important;
  /* 设置滚动条轨道的背景色 */
}
:deep(.el-tree-node__content) {
  height: 40px;
}
:deep(.el-tree-node__label) {
  font-size: 14px;
  line-height: 20px;
}

:deep(.el-tree-node__content:hover) {
  background: #ecf4ff;
  border-radius: 4px;
}
:deep(.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content) {
  color: #0064ff;
}
:deep(.el-tree-node__content) {
  color: #333;
}
</style>
