<!--
 * @Date: 2024-08-02 14:08:30
 右侧弹出框
-->
<template>
  <el-drawer v-model="state.visible" :with-header="false" size="50%" @close="resetFlag">
    <div class="drawer-wapper">
      <div class="content-wapper">
        <div class="step">
          <el-steps style="max-width: 100%" :active="activeStatus" class="steps">
            <el-step
              v-for="(item, index) in isTemporary ? temporaryListProcess : listProcess"
              :key="item.name"
            >
              <template #title>
                <!-- title 展示 -->
                <div class="title-wapper">
                  <div class="title">{{ item.name }}</div>
                  <span class="desc" :class="formatDesc(index, detail)"
                    ><text class="text" :class="formatText(index, detail)">
                      {{ formatStatus1(index, detail) }}
                    </text></span
                  >
                </div>
                <!-- 下面操作按钮 评论 -->
                <div
                  v-hasPermi="['team:optimization:comment']"
                  class="zhipai-wapper"
                  @click="handleComment(1)"
                  v-if="index == 0 && status != 0 && detail?.state != 5"
                >
                  <img :src="bgUrl('zhipai.png')" class="btn-icon" alt="" />
                  <text class="zhipai-desc">评论</text>
                </div>

                <!-- 审核 -->
                <div
                  v-hasPermi="['team:optimization:audit']"
                  class="zhipai-wapper shenhe"
                  @click="handleComment(4)"
                  v-if="
                    index == 1 &&
                    status != 0 &&
                    detail?.auditState != 1 &&
                    detail?.auditState != 2 &&
                    detail?.state != 5
                  "
                >
                  <img src="@/assets/imgs/team/shenhe-icon.png" class="btn-icon" alt="" />
                  <text class="zhipai-desc shenhe-desc">审核</text>
                </div>
                <!-- 任务提交 -->
                <div
                  v-hasPermi="['team:optimization:submit']"
                  class="zhipai-wapper submit submit-wapper"
                  v-if="
                    status != 0 &&
                    status != 8 &&
                    item.showSbumit &&
                    isMyTask() &&
                    !isAssignmentFlag &&
                    !reviewItem
                  "
                  @click="submitTaskBtn"
                >
                  <img :src="bgUrl('submit.png')" class="btn-icon" alt="" />
                  <div class="zhipai-desc submit-desc">任务提交</div>
                </div>
                <!-- 操作 -->
                <div
                  class="zhipai-wapper submit submit-wapper"
                  v-if="status != 0 && status != 8 && item.showOperate && isAssignmentFlag"
                  @click="showOperateBtn"
                >
                  <img :src="bgUrl('submit.png')" class="btn-icon" alt="" />
                  <div class="zhipai-desc submit-desc">操作</div>
                </div>
                <!-- 暂停 -->
                <div
                  v-hasPermi="['team:optimization:pause']"
                  class="zhipai-wapper stop"
                  @click="handleComment(2)"
                  v-if="
                    ((isTemporary && index == 3) || (!isTemporary && index == 6)) &&
                    status !== 0 &&
                    !isStopFlag &&
                    detail?.state != 3 &&
                    detail?.auditState != 2 &&
                    detail?.state != 5
                  "
                >
                  <img src="@/assets/imgs/team/stop-icon.png" class="btn-icon" alt="" />
                  <text class="zhipai-desc">任务暂停</text>
                </div>
                <!-- 终止 -->
                <div
                  v-if="
                    ((isTemporary && index == 3) || (!isTemporary && index == 6)) &&
                    status !== 0 &&
                    detail?.state != 5 &&
                    detail?.state != 3
                  "
                >
                  <div
                    v-hasPermi="['team:optimization:stop']"
                    class="zhipai-wapper stop stop-new"
                    @click="handleComment(5)"
                  >
                    <img src="@/assets/imgs/team/stop-new.png" class="btn-icon" alt="" />
                    <text class="zhipai-desc">终止</text>
                  </div>
                </div>

                <!-- 取消暂停 -->
                <div
                  class="zhipai-wapper stop pause"
                  @click="handleComment(3)"
                  v-hasPermi="['team:optimization:canclePause']"
                  v-if="
                    ((isTemporary && index == 3) || (!isTemporary && index == 6)) &&
                    status !== 0 &&
                    isStopFlag &&
                    detail?.state == 2 &&
                    detail?.state != 5
                  "
                >
                  <img src="@/assets/imgs/team/cancle-stop-icon.png" class="btn-icon" alt="" />
                  <text class="zhipai-desc">取消暂停</text>
                </div>
              </template>
              <!-- icon展示 -->
              <template #icon>
                <div @click="showDetail(index)">
                  <!-- 临时 / 进行中 -->
                  <img :src="bgUrl('select.png')" class="icon-img" v-if="showZP(index, detail)" />
                  <!-- 未开始 -->
                  <img
                    :src="bgUrl(item.startIcon)"
                    alt=""
                    class="icon-img"
                    v-if="status == 0 || showStart(index, detail)"
                  />
                  <!-- 已经开始 -->
                  <!-- 第一个 -->
                  <img
                    :src="bgUrl('start.png')"
                    alt=""
                    class="icon-img"
                    v-if="showFinished(index, detail) && index == 0"
                  />
                  <!-- 方案 -->
                  <ProgressItem
                    v-if="
                      detail?.planProgress > 0 &&
                      detail?.planProgress < 100 &&
                      index == 2 &&
                      !isTemporary &&
                      status != 0
                    "
                    :percentage="detail?.planProgress"
                  />
                  <!-- 拍摄 -->
                  <ProgressItem
                    v-if="
                      detail?.shootProgress > 0 &&
                      detail?.shootProgress < 100 &&
                      index == 3 &&
                      !isTemporary &&
                      status != 0
                    "
                    :percentage="detail?.shootProgress"
                  />
                  <!-- 后期 -->
                  <ProgressItem
                    v-if="
                      detail?.retouchProgress > 0 &&
                      detail?.retouchProgress < 100 &&
                      index == 4 &&
                      !isTemporary &&
                      status != 0
                    "
                    :percentage="detail?.retouchProgress"
                  />
                  <!-- 页面 -->
                  <ProgressItem
                    v-if="
                      detail?.pageProgress > 0 &&
                      detail?.pageProgress < 100 &&
                      index == 5 &&
                      !isTemporary &&
                      status != 0
                    "
                    :percentage="detail?.pageProgress"
                  />
                  <!--非第一个 -->
                  <img
                    :src="bgUrl('start-mid.png')"
                    alt=""
                    class="icon-img"
                    v-if="showFinished(index, detail) && index != 0"
                  />

                  <!-- 审核拒绝 -->
                  <img
                    :src="bgUrl('stop.png')"
                    alt=""
                    class="icon-img"
                    v-if="detail?.auditState == 2 && index == 1 && status != 0"
                  />

                  <!-- 完成绿色 -->
                  <img :src="bgUrl('finish.png')" class="icon-img" v-if="showWancheng(index)" />

                  <img
                    src="@/assets/imgs/team/stop-new-icon.png"
                    class="icon-img"
                    v-if="
                      detail?.state == 5 &&
                      status != 0 &&
                      ((isTemporary && index == 3) || (!isTemporary && index == 6))
                    "
                  />
                </div>
              </template>
            </el-step>
          </el-steps>
        </div>
        <!-- 基本信息 -->
        <div v-if="status != 0">
          <div class="form-wapper" style="box-sizing: border-box">
            <BaseTitle title="详情">
              <template #expand>
                <div class="flex-row-wapper" @click="handleExpand">
                  <span class="desc">{{ flag ? '收起' : '展开' }}</span>
                  <img class="shouqi" src="@/assets/imgs/team/shouqi.png" v-if="!flag" />
                  <img class="shouqi" src="@/assets/imgs/team/zhankai.png" v-else />
                </div>
              </template>
            </BaseTitle>
            <BasicInfo v-if="flag" :detail="detail" />
          </div>
        </div>
        <!-- 新增 需求录入 -->
        <div class="form-wapper" v-if="status == 0" style="padding: 15px; box-sizing: border-box">
          <AddForm @success="handleSuccess" @cancle="onCancle" :detail="detail" :isEdit="isEdit" />
        </div>
      </div>

      <!-- 任务节点信息查看 -->
      <div class="detail-item-custom" v-if="!isSubTaskFlag && detailList?.length">
        <ReviewItem
          :detailList="detailList"
          :detailNode="detailNode"
          :isTemporary="isTemporary"
          :isFinished="detail?.state == 3"
          :parentId="detail?.id"
          @success="handleSuccess"
        />
      </div>
      <div v-if="isSubTaskFlag && detailList?.length > 0" class="detail-item-custom">
        <ReviewSubTaskItem
          :detailList="detailList"
          :detailNode="detailNode"
          :currentSubNode="currentSubNode"
          :isFinished="detail.state == 3"
          :parentId="detail.id"
          :resetIndex="resetIndex"
          @success="handleSuccess"
        />
      </div>
      <!-- table切换 -->

      <div
        class="detail-item-custom"
        v-if="[1, 2, 3, 4].includes(status) && isAssignmentFlag && showOperateFlag"
      >
        <!-- 任务编辑/提交 -->
        <SWtabsTable
          v-model:modelValue="currentIndex"
          :detail="detail"
          :node="status"
          :isTemporary="isTemporary"
          @cancel="showOperateFlag = false"
          @success="handleSuccess"
          :isFinished="detail?.state == 3"
          :parentId="detail?.id"
          :newSubTab="newSubTab"
      /></div>
      <!-- 任务提交 -->
      <div
        class="detail-item-custom"
        v-if="[5].includes(status) && submitFlag && !isAssignmentFlag"
      >
        <AddTask
          :node="status"
          :detail="detail"
          @success="handleSuccess"
          @cancel="handleTaskSbumitCancel"
      /></div>

      <div
        class="detail-item-custom"
        v-if="[1, 2, 3, 4].includes(status) && submitFlag && !isAssignmentFlag"
      >
        <!-- 任务提交有子节点 -->
        <SubAddTask
          :node="status"
          :currentSubNode="currentSubNode"
          :detail="detail"
          @success="handleSuccess"
          @cancel="handleTaskSbumitCancel"
          :isFinished="detail?.state == 3"
          :parentId="detail?.id"
        />
      </div>
      <!-- table 任务查看 -->

      <!-- 评论编辑 -->
      <div class="detail-item" v-if="commentFlag">
        <CommentTask
          v-if="commentFlag"
          :detail="detail"
          @success="handleSuccess"
          @cancel="handleCommentTaskCancle"
          :commonType="commonType"
        />
      </div>
    </div>
  </el-drawer>
</template>

<script lang="ts" setup>
import { getSingleRecord, getVisualApprovalById } from '@/api/team/index'
import { useUserStore } from '@/store/modules/user'
import SWtabsTable from '../baseComponents/SWtabsTable.vue'
import AddForm from './addForm.vue'
import AddTask from './AddTask.vue'
import BasicInfo from './baseInfo.vue'
import BaseTitle from './baseTitle.vue'
import CommentTask from './commentTask.vue'
import ProgressItem from './ProgressItem.vue'
import ReviewItem from './reviewItem.vue'
import ReviewSubTaskItem from './reviewSubTaskItem.vue'
import SubAddTask from './subAddTask.vue'
const userStore = useUserStore()
const currentIndex = ref(1)

const props = defineProps({
  reload: Function,
  status: {
    type: Number,
    default: -1 //0 新增 8、查看  1、方案 2、拍摄 3、后期 4、页面 5、临时
  },
  isEdit: {
    type: Boolean,
    default: false
  }
})

const listProcess = ref() //其他任务
const temporaryListProcess = ref() //临时任务
const isTemporary = ref(false) //是否是临时任务
const submitFlag = ref(true) //控制提交按钮
const showOperateFlag = ref(false) //是否展示操作按钮

const initData = () => {
  temporaryListProcess.value = [
    { name: '需求录入', startIcon: 'one-no-start.png', showSbumit: false },
    { name: '审核', startIcon: 'no-start-mid.png', showSbumit: false },
    { name: '临时', startIcon: 'no-start-mid.png', showSbumit: false },
    { name: '任务完成', startIcon: 'no-start-mid.png', showSbumit: false }
  ]
  listProcess.value = [
    { name: '需求录入', startIcon: 'one-no-start.png', titleDesc: '未开始', showSbumit: false },
    { name: '审核', startIcon: 'no-start-mid.png', titleDesc: '未审核', showSbumit: false },
    { name: '方案', startIcon: 'no-start-mid.png', titleDesc: '未指派', showSbumit: false },
    {
      name: '拍摄',
      startIcon: 'no-start-mid.png',
      titleDesc: '未指派',
      showSbumit: false,
      showOperate: false
    },
    {
      name: '后期',
      startIcon: 'no-start-mid.png',
      titleDesc: '未指派',
      showSbumit: false,
      showOperate: false
    },
    { name: '页面', startIcon: 'no-start-mid.png', titleDesc: '未指派', showSbumit: false },
    { name: '任务完成', startIcon: 'no-start-mid.png', titleDesc: '', showSbumit: false }
  ]
}
const bgUrl = (name) => {
  return `https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/common/obs/${name}`
}

// 背景
const formatDesc = (value, detail) => {
  const str = formatStatus1(value, detail)
  return commonStyle(str, 'desc')
}

// 文字
const formatText = (value, detail) => {
  const str = formatStatus1(value, detail)
  return commonStyle(str, 'text')
}

const commonStyle = (str, type) => {
  if (str == '进行中') {
    return `${type}-ing`
  } else if (str == '已完成' || str == '审核通过') {
    return `${type}-activity`
  } else if (str == '审核未通过') {
    return `stop-${type}`
  }
}

// 取消提交任务
const handleTaskSbumitCancel = () => {
  submitFlag.value = false
}

// 评论取消按钮
const handleCommentTaskCancle = () => {
  commentFlag.value = false
}

// 是不是我的任务
const userId = computed(() => userStore.user.id || '')
const isMyTask = () => {
  const arr = findOperators()
  const flag = arr.some((item) => {
    return item.operatorId == userId.value
  })
  return flag
}

// 格式化操作人员
const findOperators = () => {
  const ite = (detail.value.records || [])?.filter((it) => {
    if (it.node == `${props.status}` && it.type == 1) {
      return it
    }
  })

  if (ite.length > 0) {
    return ite[ite.length - 1]['operators'] || []
  }

  return []
}

// 需求录入阶段
const firstStateMap = {
  0: '进行中',
  1: '已完成'
}

const shenheMap = {
  0: '未审核',
  1: '审核通过',
  2: '审核未通过'
}

/**
 * @description: 展示文字的描述 修改数组
 */
const formatStatus1 = (value, detail) => {
  // 临时 0需求录入阶段 1审核阶段 2临时阶段
  if (isTemporary.value) {
    if (value == 0) {
      return firstStateMap[detail?.state] || ''
    } else if (value == 1) {
      if (detail?.miId && detail.miId.includes(',copy')) {
        return '未审核'
      }
      return shenheMap[detail?.auditState] || '未审核'
    } else if (value == 2) {
      return formatTitleDesc(detail?.temporaryState)
    }
  } else {
    // 常规 0需求录入 1审核阶段 2方案 3拍摄 4后期 5页面 6任务完成
    const stateHandlers = {
      0: () => {
        if (props.status == 0) return '未开始'
        return firstStateMap[detail?.state] || ''
      },
      1: () => {
        if (detail?.miId && detail.miId.includes(',copy')) return '未审核'
        return shenheMap[detail?.auditState] || '未审核'
      },
      2: () => {
        if (props.status == 0) return '未指派'
        return formatTitleDesc(detail?.planState)
      },
      3: () => {
        if (props.status == 0) return '未指派'
        return formatTitleDesc(detail?.shootState)
      },
      4: () => {
        if (props.status == 0) return '未指派'
        return formatTitleDesc(detail?.retouchState)
      },
      5: () => {
        if (props.status == 0) return '未指派'
        return formatTitleDesc(detail?.pageState)
      },
      6: () => ''
    }
    return stateHandlers[value] ? stateHandlers[value]() : ''
  }
}

const formatTitleDesc = (value) => {
  const valueDescriptions = {
    0: '未指派',
    1: '进行中',
    2: '已完成'
  }
  return valueDescriptions[value] || ''
}

// 指派展示逻辑
const showZP = (value, detail) => {
  if (props.status == 0) return false

  // 临时
  if (isTemporary.value) {
    if (value == 0 && detail?.state == 0) return true
    if (value == 2) return detail?.temporaryState == 1
    return false
  } else {
    // 常规需求 0需求录入 1审核阶段 2方案 3拍摄 4后期 5页面 6任务完成
    // 视觉审核 auditState      0-未审核 1-审核通过 2-审核未通过
    if (value == 0 && detail?.state == 0 && detail?.auditState == 0) return true
    switch (value) {
      case 2:
        return !detail?.planProgress && detail?.planState == 1
      case 3:
        return !detail?.shootProgress && detail?.shootState == 1
      case 4:
        return !detail?.retouchProgress && detail?.retouchState == 1
      case 5:
        return !detail?.pageProgress && detail?.pageState == 1
      default:
        return false
    }
  }
}
//未开始图标
const showStart = (index, detail) => {
  if (isTemporary.value) {
    //临时
    switch (index) {
      case 0:
        if (activeStatus.value < 1) return false
      case 1:
        return detail?.auditState == 0
      case 2:
        return detail?.temporaryState == 0
      case 3:
        if (detail?.state == 5) return false
        return activeStatus.value < 3
      default:
        return false
    }
  } else {
    // 常规需求
    switch (index) {
      case 0:
        if (activeStatus.value < 1) return false
      case 1:
        return detail?.auditState == 0
      case 2:
        if (detail?.planProgress) return false
        return detail?.planState == 0
      case 3:
        if (detail?.shootProgress) return false
        return detail?.shootState == 0
      case 4:
        if (detail?.retouchProgress) return false
        return detail?.retouchState == 0
      case 5:
        if (detail?.pageProgress) return false
        return detail?.pageState == 0
      case 6:
        if (detail?.state == 5) return false
        return activeStatus.value < 6
      default:
        return false
    }
  }
}

// 完成的图标展示
const showFinished = (index, detail) => {
  if (props.status == 0) return false
  if (detail?.state == 5 && index == 0) return true

  if (isTemporary.value) {
    // 临时需求
    if (index != 1) {
      if (index == 3 && detail?.state == 5) return false
      const isFinish = index == 3 && detail?.state == 3
      if (isFinish) return false
      if (activeStatus.value > index) return true
      if (index == 0 && detail?.state == 1) return true
    } else {
      // 审核处理
      return detail?.auditState == 1
    }
  } else {
    //常规需求
    if (index != 1) {
      if (index == 6 && detail?.state == 5) return false
      const isFinish = index == 6 && detail?.state == 3
      if (isFinish) return false
      // TODO：
      if (index == 2) return detail?.planState == 2
      if (index == 3) return detail?.shootState == 2
      if (index == 4) return detail?.retouchState == 2
      if (index == 5) return detail?.pageState == 2

      if (activeStatus.value > 5) return true
      if (activeStatus.value > index) return true
      if (index == 0 && detail?.state == 1) return true
    } else {
      // 审核处理
      return detail?.auditState == 1
    }
  }
}

const showWancheng = (index) => {
  if (isTemporary.value) {
    if (index == 3 && detail.value?.state == 3) return true
  } else {
    if (index == 6 && detail.value?.state == 3) return true
  }
}

// 评论
const commentFlag = ref(false)
const commonType = ref(1) //1、评论 2、暂停 3/取消暂停 4/审核 5终止
const handleComment = (type) => {
  if (detail.value?.state != 5) {
    commentFlag.value = true
  }
  commonType.value = type
  submitFlag.value = false //关闭任务提交
  showDetail(6) //关闭其他节点信息
}

const submitTaskBtn = () => {
  submitFlag.value = !submitFlag.value
  commentFlag.value = false //关闭评论
  detailList.value = []
}

const showOperateBtn = () => {
  commentFlag.value = false //关闭评论
  showOperateFlag.value = !showOperateFlag.value
  detailList.value = []
}

const detail = ref() //基本信息展示
const detailNode = ref(-1) //展示节点信息 2、方案 3、拍摄 4/后期 5、页面 6\完成 7\终止
const detailList = ref() //节点详情
const isSubTaskFlag = ref(false) //展示多节点的查看

const resetIndex = ref(false)

//展示详情 切换详情展示的时候需要更新具体某个节点的数据
const showDetail = async (index, flag = false) => {
  try {
    if (!flag) {
      resetIndex.value = true
    }
    // 点击其他节点隐藏任务提交 只有一个节点可以任务提交
    if (isTemporary.value) {
      if (index != 2) {
        submitFlag.value = false
      }
    } else {
      showOperateFlag.value = false

      if (!listProcess.value[index].showSubmit) {
        submitFlag.value = false
      }

      // 非步骤节点
      if (![0, 1, 6].includes(index)) {
        commentFlag.value = false
      }
    }
    if (props.status == 0) return //新增编辑不能查看节点

    detailNode.value = index
    let midNode = index
    if (index > 1) {
      midNode = index - 1
    }

    // 暂停节点
    if (index == 6 && !isTemporary.value) {
      midNode = 6
    }
    // 临时任务
    if (index == 3 && isTemporary.value) {
      midNode = 6
    } else if (index == 2 && isTemporary.value) {
      midNode = 5
    }
    // 审批
    if (index == 1) {
      midNode = 7
    }
    const res = await getSingleRecord(detail.value.id, midNode) // id node
    detailList.value = res
    // 如果不是临时需求 index 等于3或者4的时候是多节点展示
    isSubTaskFlag.value =
      !isTemporary.value && (index == 3 || index == 4 || index == 2 || index == 5)
  } catch (error) {
    console.log(error)
  }
}

const handleSuccess = () => {
  state.visible = false
  resetFlag()
  if (props.reload) props.reload() //刷新数据
}

const onCancle = () => {
  state.visible = false
  resetFlag()
}

const flag = ref(false) //基本信息展开收起 默认收起
const handleExpand = () => {
  flag.value = !flag.value
}

const state = reactive({
  visible: false //是否显示弹出框
})
const reviewItem = ref(false) //是否是点进来需要展开详情
const activeStatus = ref(0) //当前激活的节点 需要根据后端返回值动态更新
const isAssignmentFlag = ref(false) //是不是从加号按钮进来的
// 开启弹窗
// subNode 子任务的类型
const currentSubNode = ref('') // 2视频 1 静物 0人像 3视觉 4平面
const newSubTab = ref() // 多节点分开展示 定位到特定的tab 2视频 1 静物 0人像 3视觉 4平面

const open = async (id, type?: number | string, subNode?: any, newSub?: string) => {
  initData() //初始化表头数据
  console.log(id, subNode, newSub)
  if (subNode) {
    currentSubNode.value = subNode
  }
  if (newSub) {
    newSubTab.value = newSub
  }
  state.visible = true
  // 非新增 查看详情
  if (id) {
    let miId = ''
    if (id.endsWith(',copy')) {
      miId = id.split(',')[0]
    }
    const res = await getVisualApprovalById(miId || id)
    console.log(res)
    detail.value = res
    // 特殊处理复制
    if (id.includes(',copy')) {
      detail.value.miId = id
    }
    if (props.status == 0) return
    isTemporary.value = res.demandType == 'temporary' //是不是临时节点
    formatActiveStatus() //终止节点对应的进度条状态
    findError() //任务暂停节点
    findStop() //任务终止节点
    showSubmit() //处理是否展示提交按钮
    showOperate() // 处理操作按钮
    //点击列表添加图标进来的
    if (type == 'add') {
      isAssignmentFlag.value = true
      showOperateFlag.value = true
    }
    //详情页过来的展示到指定的位置
    if ((type as number) > 8) {
      reviewItem.value = true
      showDetail((type as number) - 8, true)
    }
    console.log('end')
  } else {
    detail.value = {}
    activeStatus.value = 0
  }
}

//  子节点查看
const showOperate = () => {
  // 只有两个节点
  if (!isTemporary.value) {
    if (props.status != 2 && props.status != 3) return
    listProcess.value[props.status + 1].showOperate = true
  }
}

const showSubmit = () => {
  if (isTemporary.value) {
    //临时节点
    if (props.status == 5 && detail.value?.temporaryState == 2) return
    temporaryListProcess.value[2].showSbumit = true
  } else {
    if (props.status > 5) return
    const statusMapping = {
      1: 'planState',
      2: 'shootState',
      3: 'retouchState',
      4: 'pageState'
    }

    for (const [status, state] of Object.entries(statusMapping)) {
      if (props.status === parseInt(status) && detail.value?.[state] == 2) return
    }

    listProcess.value[props.status + 1].showSbumit = true
  }
}

// 寻找是不是终止节点
const isStopFlag = computed(() => {
  return detail.value?.state == 2
})

const findStop = () => {
  if (detail.value?.state != 5) return
  if (isTemporary.value) {
    //临时节点
    temporaryListProcess.value[temporaryListProcess.value.length - 1].name = '任务终止'
  } else {
    listProcess.value[listProcess.value.length - 1].name = '任务终止'
  }
}

const findError = () => {
  if (!isStopFlag.value) return

  if (isTemporary.value) {
    //临时节点
    temporaryListProcess.value[temporaryListProcess.value.length - 1].name = '任务暂停'
    temporaryListProcess.value[temporaryListProcess.value.length - 1].startIcon = 'pause.png'
  } else {
    listProcess.value[listProcess.value.length - 1].name = '任务暂停'
    listProcess.value[listProcess.value.length - 1].startIcon = 'pause.png'
  }
}

//处理终止节点对应的进度条状态 新增审核不通过的状态
const formatActiveStatus = () => {
  if (isTemporary.value) {
    if (detail.value.temporaryState == 2 || detail.value.state == 3) {
      nextTick(() => {
        activeStatus.value = 4
      })
    } else if (detail.value.auditState == 1 || detail.value.auditState == 2) {
      // 审核通过或者不通过
      activeStatus.value = 2
      if (detail.value.auditState == 2) {
        //审核不通过
        nextTick(() => {
          temporaryListProcess.value[1].startIcon = 'stop.png'
        })
      }
    }
  }
  // 非临时节点处理 进行中不需要连线 已完成才需要连线
  if (!isTemporary.value) {
    if (detail.value.state == 3 || detail.value.pageState == 2) {
      //任务完成 pageState==2任务结束
      activeStatus.value = 7
    } else if (detail.value.pageState == 2) {
      // 页面
      activeStatus.value = 6
    } else if (detail.value.retouchState == 2) {
      // 后期
      activeStatus.value = 5
    } else if (detail.value.shootState == 2) {
      // 拍摄
      activeStatus.value = 4
    } else if (detail.value.planState == 2) {
      // 方案
      activeStatus.value = 3
    } else if (detail.value.auditState == 1) {
      // 审核通过
      activeStatus.value = 2
    } else if (detail.value.auditState == 2) {
      // 审核不通过
      activeStatus.value = 2
      nextTick(() => {
        listProcess.value[1].startIcon = 'stop.png'
      })
    }
  }
}

// 关闭弹窗
const close = () => {
  state.visible = false
  resetFlag()
}

const emit = defineEmits(['cancle'])

const resetFlag = () => {
  detailNode.value = -1 //预览滞空
  flag.value = false
  commentFlag.value = false //关闭评论弹出框
  isTemporary.value = false //是否是临时
  activeStatus.value = 0 //激活进度条的节点
  detail.value = {}
  detailList.value = [] //节点信息
  submitFlag.value = true //提交任务按钮
  reviewItem.value = false
  isSubTaskFlag.value = false
  isAssignmentFlag.value = false // 点击列表添加图标进来的
  resetIndex.value = false
  emit('cancle')
}

defineExpose({ open, close })
</script>

<style scoped lang="scss">
:deep(.el-input__inner) {
  height: 22px;
  line-height: 22px;
}
:deep(.el-input__wrapper) {
  background: #f3f4f7;
}

:deep(.el-step__icon) {
  background: transparent;
  z-index: 0;
}

:deep(.el-textarea__inner) {
  background: #f3f4f7;
}

.drawer-wapper {
  min-width: 700px;
  background: #f6f6f6;
  position: relative;
  width: 100%;
  padding-top: 20px;
  padding-bottom: 20px;
  box-sizing: border-box;
  min-height: 100%;
  background: linear-gradient(102deg, #ecf0f9 0%, #effdfd 100%);
  .content-wapper {
    z-index: 100;
    margin: 0px 20px 0px 20px;
    background: #ffffff;
    border-radius: 8px 0px 0px 8px;
    width: calc(100% - 40px);
    min-height: calc(100% - 70px);
    overflow-y: scroll;
    padding: 20px;
    box-sizing: border-box;
  }

  .form-wapper {
    margin-top: -16px;
    width: 100%;
    border-radius: 4px;
    opacity: 0.8;
    box-sizing: border-box;
  }

  .step {
    width: 100%;
    min-height: 115px;
    border-radius: 4px;
    margin-bottom: 10px;
    padding: 35px 7px 0 7px;
    box-sizing: border-box;
    .title-wapper {
      display: flex;
      flex-direction: row;
      align-items: center;

      .title {
        font-weight: 400;
        font-size: 12px;
        color: #333333;
        line-height: 15px;
        margin-right: 4px;
        font-weight: bold;
      }

      .desc {
        display: inline-block;
        border-radius: 2px;
        padding: 2px;
        box-sizing: border-box;
        font-weight: 400;
        font-size: 10px;
        line-height: 10px;
        background: rgba(235, 240, 243, 0.45);
      }
      .desc-ing {
        background: rgba(233, 157, 64, 0.11);
      }
      .desc-activity {
        background: rgba(5, 103, 254, 0.11);
      }
      .stop-desc {
        background: rgba(228, 16, 39, 0.15);
      }

      .text {
        color: #9da0a4;
      }
      .text-ing {
        color: #e99d40;
      }
      .text-activity {
        color: #0567fe;
      }
      .stop-text {
        color: #e41027;
      }
    }

    .zhipai-wapper {
      cursor: pointer;
      transform: translateX(-20%);
      margin-top: 3px;
      width: 62px;
      line-height: 20px;
      border-radius: 10px;
      background: rgba(5, 103, 254, 0.15);
      display: flex;
      flex-direction: row;
      align-content: center;
      justify-content: center;
      justify-items: center;
      align-items: center;
      .btn-icon {
        width: 12px;
        height: 12px;
        margin-right: 5px;
      }
      .zhipai-desc {
        font-weight: 400;
        font-size: 10px;
        color: #0567fe;
      }
    }

    .shenhe {
      background: rgba(93, 182, 196, 0.15);
      .shenhe-desc {
        font-weight: 400;
        font-size: 10px;
        color: #47a4b2;
      }
    }

    .stop {
      background: rgba(101, 101, 101, 0.11);
      border-radius: 10px;
      width: 86px;
      .zhipai-desc {
        font-weight: 400;
        font-size: 12px;
        color: #656565;
      }
    }

    .stop-new {
      z-index: 100;
      cursor: pointer;
      border-radius: 10px;
      background: rgba(228, 16, 39, 0.15);
      .zhipai-desc {
        cursor: pointer;
        font-weight: 400;
        font-size: 12px;
        color: #e41027;
      }
    }

    .pause {
      background: rgba(4, 165, 15, 0.11);
      border-radius: 10px;
      width: 86px;
      .zhipai-desc {
        font-weight: 400;
        font-size: 12px;
        color: #04a50f;
      }
    }

    .error {
      background: rgba(228, 16, 39, 0.15);
      .error-desc {
        font-weight: 400;
        font-size: 12px;
        color: #e41027;
      }
    }

    .submit-wapper {
      width: 82px;
      background: rgba(0, 156, 240, 0.15);
    }

    .back {
      background: rgba(233, 157, 64, 0.15);
      .back-desc {
        color: #e99d40;
      }
    }

    .submit {
      .submit-desc {
        color: #009cf0;
      }
    }

    .icon-img {
      width: 40px;
      height: 40px;
      background-size: 100% auto;
      cursor: pointer;
    }
  }
}

.flex-row-wapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;

  .desc {
    font-weight: 400;
    font-size: 12px;
    color: #0064ff;
    line-height: 14px;
    margin: 0 7px 0 16px;
  }
  .shouqi {
    width: 10px;
    height: 4px;
  }
}

.steps {
  :deep(.el-step ){
    // 已完成步骤条的边框色和字体颜色
    .el-step__head.is-success {
      background: #0567fe;
    }
    // 步骤条
    .el-step__line {
      background: #ebf0f3;
      height: 6px;
      top: 8px;
    }
    .el-step__line-inner {
      background: #0567fe;
      height: 6px;
      border: none;
    }
  }
}

.detail-item {
  margin: 20px 20px 0 20px;
  background: white;
  padding: 20px 20px 20px 20px;
  box-sizing: border-box;
  border-radius: 8px;
}

.detail-item-custom {
  margin: 20px 20px 0 20px;
  padding: 20px;
  box-sizing: border-box;
  background: white;
  border-radius: 8px;
}

.table-wapper {
  margin: 0 20px;
}
</style>
