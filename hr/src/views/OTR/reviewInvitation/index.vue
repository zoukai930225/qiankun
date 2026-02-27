<template>
  <stepBox />
  <div class="OTRCommonMainContainer">
    <!-- 搜索工作栏 -->
    <ContentWrap :border-radius="0">
      <div class="commonTopFilterWrap">
        <div class="commonTopFilterWrap-filter">
          <el-form
            ref="queryFormRef"
            :inline="true"
            :model="queryParams"
            label-width="68px"
            label-position="left"
            @submit.prevent
          >
            <el-form-item label="姓名" prop="keyword" label-width="40px">
              <el-input
                :prefix-icon="Search"
                class="searchFormItemWidth"
                v-model="queryParams.keyword"
                clearable
                placeholder="请输入姓名"
                @keyup.enter="handleQuery"
                @clear="handleQuery"
              />
            </el-form-item>
            <el-form-item label="评价状态" prop="status">
              <el-select
                v-model="queryParams.status"
                placeholder="请选择评价状态"
                class="searchFormItemWidth"
                @change="handleQuery"
                @clear="handleQuery"
                clearable
              >
                <el-option label="未开始" value="0" />
                <!-- <el-option label="进行中" value="1" /> -->
                <el-option label="已完成" value="2" />
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
          <el-button type="primary" color="#0064ff" @click="exportList" v-if="grabCheck('人才盘点总管理员')">导出</el-button>
        </div>
        <div class="commonTopFilterWrap-search">
          <div class="commonTopFilterWrap-search-container">
            <div class="search-btn-wapper invitation" @click="invitation" v-if="showBtn">
              <span class="search-btn-desc">一键邀请</span>
            </div>
            <div class="search-btn-wapper stop" @click="closeActivity" v-if="showBtn">
              <img
                src="@/assets/imgs/otr/reviewInvitation/closeActivity.svg"
                class="search-btn-icon"
              />
              <span class="search-btn-desc">开启校准</span>
            </div>
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
        >
          <el-table-column label="工号" prop="employeeNo" />
          <el-table-column label="评价人" prop="evaluator">
            <template #default="{ row }">
              <otrUser :data="{ name: row.evaluator, avatarOrigin: row.avatarOrigin }" />
            </template>
          </el-table-column>
          <el-table-column label="评价状态" prop="status">
            <template #default="{ row }">
              <div class="flex">
                <img :src="statusImg(row)" />
                <span style="margin-left: 4px">{{ formatStatus(row) }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="关联问卷" prop="surveyNames">
            <template #default="scope">
              <div>{{ scope.row.surveyNames }}</div>
            </template>
          </el-table-column>
          <el-table-column label="评价时间" prop="updateTime" />
          <el-table-column label="操作" :show-overflow-tooltip="false" width="170" align="center">
            <template #default="{ row }">
              <el-button
                class="action-btn"
                v-hasPermi="['otr_evaluate_info_detail']"
                @click="goDetail(row.evaluatorId)"
                link
              >
                评价详情
              </el-button>
              <el-button
                class="action-btn"
                style="cursor: pointer"
                @click="sendInvite(row)"
                link
                v-if="formatStatus(row) !== '已完成'"
              >
                发送邀请
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
    <!-- table-list -->
    <!-- <CardList :list="list" :inventoryId="inventoryId" @go-detail="goDetail" :showBtn="showBtn">
      <template #default>
        <div style="height: 70px">
          <Pagination
            v-model:limit="queryParams.size"
            v-model:page="queryParams.page"
            :total="total"
            @pagination="getList"
          />
        </div>
      </template>
    </CardList> -->

    <DetailDialog ref="detailDialogRef" @success="getList" />
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
// import CardList from './components/cardList.vue'
// import DetailDialog from './components/detailDrawer.vue'
import DetailDialog from './components/detailDialog.vue'
import otrUser from '../components/otrUser.vue'
import { getActStatusById } from '@/api/otr/evaluationRelationship/index'
import {
  getInvitationList,
  invitationInviteAll,
  invitationInvite,
  closeSurvey,
  checkLockState
} from '@/api/otr/reviewInvitation/index'
import request from '@/config/axios'
import download from '@/utils/download'
import stepBox from '../components/stepBox.vue'
import { useAppStore } from '@/store/modules/app'
const appStore = useAppStore()
import { useRole } from '@/hooks/common/useRole'

import finish from '@/assets/imgs/otr/reviewInvitation/finish.svg'
import ing from '@/assets/imgs/otr/reviewInvitation/ing.svg'
import noStart from '@/assets/imgs/otr/reviewInvitation/noStart.svg'

defineOptions({ name: 'ReviewInvitaion' })
const router = useRouter()
const route = useRoute()

const { getPermissionInfo, grabCheck } = useRole('人才盘点')

const message = useMessage() // 消息弹窗

const total = ref(0) // 列表的总页数
const list = ref<any[]>([]) // 表格数据
const queryParams = reactive({
  page: 1,
  size: 10,
  keyword: '',
  status: ''
})
const queryFormRef = ref() // 搜索的表单
const detailDialogRef = ref() // 新增弹窗
const inventoryId = ref()

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.page = 1
  getList()
}
/** 重置按钮操作 */
const resetQuery = () => {
  // queryFormRef.value.resetFields()
  // 修改后不重置问卷
  queryParams.keyword = ''
  queryParams.status = ''
  queryParams.page = 1
  queryParams.size = 10
  handleQuery()
}

const formatStatus = (item) => {
  // 未开始 => 未评价问卷数 = 需评价问卷数
  if (item.needEvaluateCount == item.notEvaluateCount) return '未开始'
  if (item.needEvaluateCount == item.evaluatedCount) return '已完成'
  return '进行中'
}

const statusImg = (item) => {
  if (item.needEvaluateCount == item.notEvaluateCount) return noStart
  if (item.needEvaluateCount == item.evaluatedCount) return finish
  return ing
}

//详情
const goDetail = (evaluatorId) => {
  const params = {
    evaluatorId,
    inventoryId: inventoryId.value
  }
  detailDialogRef.value.open(params)
}

// 根据活动 查询下属问卷锁定状态
const unlockSurveys = ref<any>([])
const getSurveyLockState = async () => {
  const data = await checkLockState(inventoryId.value)
  unlockSurveys.value = data.filter((item) => item.lockState === 0) || []
}

// 一键邀请
const invitation = async () => {
  // 状态的二次确认
  // 如果当前活动下存在问卷未锁定 弹窗提示
  if (unlockSurveys.value.length > 0) {
    await message.confirm('是否确定锁定当前活动问卷并进行邀请？', '提示')
  } else {
    await message.confirm('是否确认一键邀请?', '提示')
  }
  await invitationInviteAll(inventoryId.value)
  message.success('一键邀请成功')
}

// 发送邀请
const sendInvite = async (item) => {
  // 状态的二次确认
  // 如果当前问卷未锁定 弹窗提示
  let surveyId = item.surveyId.split(',')
  if (unlockSurveys.value.some((ele) => surveyId.findIndex((id) => id === ele.id) >= 0)) {
    await message.confirm('是否确定锁定当前活动问卷并进行邀请？', '提示')
  } else {
    await message.confirm('是否发送邀请?', '提示')
  }
  await invitationInvite(inventoryId.value, item.evaluatorId)
  message.success('邀请成功')
}

// 问卷设置
// const questionSetting = () => {
//   router.push({
//     path: `/otr/questionnaireSet/index`,
//     query: { inventoryId: route.query.inventoryId || inventoryId.value }
//   })
// }

// 活动设置
// const activeSetting = () => {
//   router.push({
//     path: `/otr/activitySet`
//   })
// }

// 关闭问卷
const closeActivity = async () => {
  await message.confirm('请确认问卷是否收集结束,并开启校准,否则会影响最终展示结果', '提示')
  await closeSurvey({ inventoryId: inventoryId.value })
  message.success('可以前往校验啦～')
}

// 导出
const exportList = async ()=>{
  const loadingInstance = ElLoading.service({ lock: true, text: '数据导出中,请稍等...' })
  const params = { status:queryParams.status,page:queryParams.page,size:queryParams.size,inventoryId: inventoryId.value}
  request.download({ url:`/api/otr/evaluation/invitation/export`,params}).then((res:any)=>{
    if(res){
      loadingInstance.close()
      download.excel(res,`评价邀请汇总列表.xlsx`)
    }
  }).catch(()=>{
    loadingInstance.close()
  })
}

const loading = ref(false)
/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const params = {
      ...queryParams,
      inventoryId: inventoryId.value
    }
    const res = await getInvitationList(params)
    console.log(res, '???')
    list.value = res.records
    total.value = res.total
  } finally {
    loading.value = false
  }
}

const showBtn = ref(true)
// 获取状态
const getStatus = async () => {
  const res = await getActStatusById(inventoryId.value)
  if ([1, 2, 3].includes(res)) {
    showBtn.value = true
  } else {
    showBtn.value = false
  }
}

onMounted(() => {
  getPermissionInfo(()=>{
    inventoryId.value = router.currentRoute.value.query.id
    getStatus()
    getList()
    getSurveyLockState()
  })
  
})
</script>

<style lang="scss" scoped>
.OTRCommonMainContainer {
  .commonTopFilterWrap {
    border-bottom: 1px solid #f0f0f0;
  }
  .table {
    margin-top: 16px;
    width: 100%;
  }
}

.search-btn-wapper {
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  width: 96px;
  height: 32px;
  line-height: 32px;
  margin-left: 30px;
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
}
.invitation {
  background: #0064ff;
}
.stop {
  background: #db6a0f;
}
.pagination {
  background: white;
  height: 60px;
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
