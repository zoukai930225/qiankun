<template>
  <stepBox ref="stepBoxRef" />
  <div class="OTRCommonMainContainer">
    <ContentWrap :border-radius="0">
      <div class="commonTopFilterWrap">
        <div class="title"> 问卷管理 </div>
        <div class="commonTopFilterWrap-search">
          <div class="commonTopFilterWrap-search-container">
            <!-- <div class="search-btn-wapper invitation" @click="activeSetting">
              <img :src="imgIcon" class="search-btn-icon" />
              <span class="search-btn-desc">活动设置 </span>
            </div>
            <div class="search-btn-wapper invitation" @click="invit">
              <img :src="imgIcon" class="search-btn-icon" />
              <span class="search-btn-desc">评价邀请 </span>
            </div> -->
            <!-- <div class="search-btn-wapper invitation" @click="setEnvaluation">
              <span class="search-btn-desc">评价关系</span>
            </div> -->
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
        <el-table-column label="评价维度" prop="dimension">
          <template #default="{ row }">
            <div> {{ getDictLabel(DICT_TYPE.OTR_PROGRAM_DIMENSION, row.dimension) }}</div>
          </template>
        </el-table-column>
        <el-table-column label="评价方式" prop="evaluationWay">
          <template #default="{ row }">
            <span class="type" :class="{ import: row.evaluationWay == 1 }">{{
              formatEvaluationWay(row.evaluationWay)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="评价对象" prop="objectName">
          <template #default="{ row }">
            {{ row.objectName }}
          </template>
        </el-table-column>
        <el-table-column label="问卷名称" prop="surveyName">
          <template #default="{ row }">
            <div class="name" style="width: 15%" @click="prewView(row.id)">
              {{ row.surveyName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="问卷人数" prop="evaluateNum">
          <template #default="{ row }">
            <el-popover
              v-if="row.evaluationWay == 1"
              class="evluationMemberPopover"
              placement="bottom-end"
              :width="281"
              trigger="hover"
              :show-arrow="false"
              :offset="4"
            >
              <template #reference>
                <div class="evluationMember">{{ row.evaluateNum }}</div>
              </template>
              <PopItem :list="row.importInfos" />
            </el-popover>
            <div v-else>/</div>
          </template>
        </el-table-column>
        <el-table-column label="锁定题目" prop="questionnaire">
          <template #default="{ row }">
            <el-switch
              v-if="row.evaluationWay != 1"
              v-model="row.lockState"
              style="--el-switch-on-color: #0064ff"
              @change="switchChange(row, 'lockState')"
              :active-value="1"
              :inactive-value="0"
            />
          </template>
        </el-table-column>
        <el-table-column label="问卷暂停" prop="questionnaire">
          <template #default="{ row }">
            <el-switch
              v-if="row.evaluationWay != 1"
              v-model="row.stop"
              @change="switchChange(row, 'stop')"
              style="--el-switch-on-color: #0064ff"
              :active-value="1"
              :inactive-value="0"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" :show-overflow-tooltip="false" align="center" width="300">
          <template #default="{ row }">
            <div class="action cursor_pointer flex-row">
              <div class="flex-row" v-if="row.evaluationWay == 1 && showBtn">
                <!-- <img src="@/assets/imgs/otr/questionnaireSet/import.png" class="action-icon" /> -->
                <el-button link @click="importTemplate(row)" class="action-btn">导入</el-button>
              </div>
              <div class="flex-row" v-if="row.evaluationWay == 1">
                <!-- <img src="@/assets/imgs/otr/questionnaireSet/import.png" class="action-icon" /> -->
                <el-button link class="action-btn" @click="download">下载模版</el-button>
              </div>
              <div class="flex-row" v-if="row.lockState != 1 && row.evaluationWay != 1">
                <!-- <img src="@/assets/imgs/otr/questionnaireSet/setting.png" class="action-icon" /> -->
                <el-button link class="action-btn" @click="edit(row)">设置问卷</el-button>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="empty" v-if="list?.length == 0">
        <img src="@/assets/imgs/team/empty-img.png" class="empty-img" alt="" />
        <span class="empty-text">暂无数据</span>
      </div>
      <Pagination
        v-model:limit="queryParams.size"
        v-model:page="queryParams.page"
        :total="total"
        @pagination="getList"
      />
    </ContentWrap>
    <!--  -->

    <!-- 编辑 -->
    <QuestionDialog ref="questionDialog" @success="refresh" />
    <!-- 预览  -->
    <PrewView ref="prewViewRef" />
    <!-- 导入 -->
    <ImportQuestion ref="ImportQuestionRef" @success="refresh" />
  </div>
</template>

<script lang="ts" setup>
import QuestionDialog from './components/questionDialog.vue'
import PrewView from './components/previewView.vue'
import { DICT_TYPE, getDictLabel } from '@/utils/dict'
import { downloadByUrl } from '@/utils/download'
import ImportQuestion from './components/importQuestion.vue'
import { getActStatusById } from '@/api/otr/evaluationRelationship/index'
import PopItem from './components/popItem.vue'
import stepBox from '../components/stepBox.vue'
import { useAppStore } from '@/store/modules/app'

defineOptions({ name: 'QuestionnaireSetList' })
const router = useRouter() // 路由对象
const route = useRoute()
const message = useMessage()
const appStore = useAppStore()
import {
  getotrAactInventory,
  getSurveyList,
  updateLockAndStop,
  getSurveyById
} from '@/api/otr/questionnaireSet/index'

const inventoryId = (route.query.inventoryId || '') as string
const imgIcon = 'https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/common/obs/next.png'

const queryParams = reactive({
  page: 1,
  size: 20,
  inventoryId: inventoryId
})

const total = ref(0) // 列表的总页数
const list = ref()
const stepBoxRef = ref()

const questionDialog = ref()
const edit = (item) => {
  questionDialog.value.open(item.id)
}
const prewViewRef = ref()
const prewView = async (id) => {
  const res = await getSurveyById(id)
  prewViewRef.value.open(res)
}

const setEnvaluation = () => {
  router.push({
    name: `EvaluationRelationship`,
    query: { source: 1, inventoryId }
  })
}

//  刷新
const refresh = () => {
  getList()
}

const ImportQuestionRef = ref()

const importTemplate = (item) => {
  console.log(item.id)
  ImportQuestionRef.value.open(item.id)
}

const formatEvaluationWay = (value) => {
  if (value == 0) {
    return '问卷'
  } else if (value == 1) {
    return '导入'
  }
}

const switchChange = async (item, type) => {
  if (flag.value) return
  let loadingInstance = ElLoading.service({ fullscreen: false })
  try {
    const data = {
      id: item.id,
      lockState: type == 'lockState' ? (item.lockState ? 1 : 0) : undefined,
      stop: type == 'stop' ? (item.stop ? 1 : 0) : undefined
    }
    await updateLockAndStop(data)
    message.success('操作成功')
    getList()
  } catch (error) {
    getList()
  } finally {
    loadingInstance.close()
  }
}

const download = () => {
  downloadByUrl(
    'https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/common/template/%E9%97%AE%E5%8D%B7%E8%AE%BE%E7%BD%AE%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF(%E6%96%B0).xls',
    '问卷管理导入模版'
  )
  //
}

// 评价邀请
const invit = () => {
  router.push({
    name: `ReviewInvitaion`,
    query: { id: inventoryId }
  })
}

// 活动设置
const activeSetting = () => {
  router.push({
    name: 'OTRIndexParent'
  })
}

const flag = ref(true)
const loading = ref(false)
/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    flag.value = true
    const res = await getSurveyList(queryParams)
    list.value = res.records
    total.value = res.total
    setTimeout(() => {
      flag.value = false
    }, 20)
  } finally {
    loading.value = false
    setTimeout(() => {
      flag.value = false
    }, 20)
  }
}

const inventoryList = ref()
// 获取活动列表
const initBaseList = async () => {
  const res = await getotrAactInventory()
  inventoryList.value = res.map((item) => {
    return {
      label: item.actName,
      value: item.id
    }
  })
}
const showBtn = ref(false)
const getStatue = async () => {
  const res = await getActStatusById(route.query.inventoryId)
  if ([1, 2, 3].includes(res)) {
    showBtn.value = true
  } else if ([4, 5].includes(res)) {
    showBtn.value = false
  }
}

onMounted(() => {
  stepBoxRef.value?.jumpHasPermissionStep()
  getStatue()
  initBaseList()
  getList()
})
</script>

<style lang="scss" scoped>
.commonTopFilterWrap {
  align-items: center;
  padding-bottom: 16px;
  .title {
    font-size: 16px;
    color: #3d3d3d;
    font-weight: 600;
  }
}
.name {
  cursor: pointer;
  font-size: 14px;
  color: #0064ff;
  &:hover {
    opacity: 0.8;
  }
}
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 20px 10px 20px;
  box-sizing: border-box;
  color: #666666;
  .header-item {
    width: 20%;
    font-weight: 400;
    font-size: 14px;
    color: #666666;
  }
}

.list-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;
  padding: 10px 0px;
  box-sizing: border-box;
  border-bottom: 1px solid #f0f0f0;
  .content-item {
    cursor: pointer;
    width: 20%;
    word-wrap: break-word;
    font-weight: 400;
    font-size: 14px;
    color: #333333;
    .type {
      border-radius: 13px;
      background: rgba(210, 238, 251, 0.42);
      padding: 3px 19px;
      box-sizing: border-box;
      font-size: 14px;
      color: #0064ff;
    }
    .import {
      background: #faf5e5;
      color: #bc9900;
    }
  }
}
.list-content:last-child {
  border-bottom: none;
}

.flex-row {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.action {
  .action-icon {
    width: 14px;
    height: 13px;
    margin-right: 4px;
  }
}

.cursor_pointer {
  width: 100%;
  justify-content: center;
}
.action-btn {
  color: #0064ff;
  cursor: pointer;
  &:hover {
    color: #0064ff;
    opacity: 0.6;
  }
}
.empty {
  margin-top: 150px;
  padding-bottom: 100px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: center;
  .empty-img {
    width: 393px;
    height: 231px;
    margin-bottom: 20px;
  }
  .empty-text {
    font-weight: 400;
    font-size: 14px;
    color: #999999;
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
</style>
