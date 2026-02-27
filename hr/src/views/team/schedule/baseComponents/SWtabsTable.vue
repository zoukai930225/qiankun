<!--
 * @Date: 2024-09-13 15:25:17
table tabs review
-->
<template>
  <div class="tabs-table-wapper">
    <div class="tabs-top">
      <div
        class="item"
        :class="{ active: currentSubType == item?.value }"
        v-for="item in subNodeList"
        :key="item?.value"
        @click="handleSubChange(item)"
        >{{ item?.label }}
      </div>
    </div>
    <div class="table-content">
      <div class="change-wapper" v-if="isFirst">
        <div class="item-title">操作类型：</div>
        <div
          class="item"
          :class="{ active: currentType == index }"
          @click="typaChange(index)"
          v-for="(item, index) in typeList"
          :key="item.value"
          ><img class="btn-icon" v-if="currentType != index" :src="item.img" /><img
            class="btn-icon"
            v-if="currentType == index"
            :src="item.activeImg"
          />
          <img
            class="selected-type"
            v-if="currentType == index"
            src="@/assets/imgs/team/selectedType.png"
          />
          <span class="btn-text">{{ item?.label }}</span>
        </div>
      </div>

      <el-form :model="addForm" label-width="auto" label-position="left" ref="formRef">
        <!-- 跳过 -->
        <div class="content-wapper form-item">
          <div class="empty" v-if="currentType == 0 && isFirst">
            <img src="@/assets/imgs/team/empty-img.png" class="empty-img" alt="" />
            <span class="empty-text">暂无数据</span>
          </div>
          <!-- 渲染任务完成卡片-->
          <div v-if="skipItem?.length">
            <div v-for="item in skipItem" :key="item.id">
              <BaseTitle :title="formatFinishTitle()" :recordType="3" />
              <div class="finish-task">
                <div class="content-finish">跳过</div>
                <div class="mid mid3"></div>

                <div class="title">
                  <div>
                    <img :src="item.createdAvatar" v-if="item.createdAvatar" class="avator" />
                    <span>{{ item.createdRealname }}</span>
                  </div>
                  <span>{{ formatTime(item.createdAt, 'yyyy-MM-dd HH:mm:ss') }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 任务指派 -->
        <div v-if="currentType == 1 || isAssignment" class="form-item">
          <div class="task-title-wapper">
            <span class="task-icon"></span>
            <span class="task-title">指派（{{ formatTitle() }}）</span>
          </div>
          <div class="zhipai-content">
            <el-form-item label="人员" prop="operate">
              <SWselectPeople
                v-model:modelValue="addForm.operate"
                type="operate"
                :getSearchList="remoteMethod"
              />
            </el-form-item>
            <el-form-item label="计划交付时间" prop="expectedCompletionTime">
              <el-date-picker
                v-model="addForm.expectedCompletionTime"
                type="date"
                aria-label="Pick a date"
                placeholder="请选择计划交付时间"
                style="width: 100%"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
            <el-form-item label="方案审核方" prop="audit">
              <SWselectPeople
                v-model:modelValue="addForm.audit"
                type="audit"
                :get-search-list="remoteMethod1"
              />
            </el-form-item>
            <div class="btn-wapper" v-if="isAssignment || isFirst">
              <el-button @click="handleClose" style="width: 64px; height: 32px" :disabled="loading"
                >取消</el-button
              >
              <el-button
                type="primary"
                :disabled="loading"
                style="width: 64px; height: 32px"
                @click="onSubmit"
                >保存</el-button
              >
            </div>
          </div>
        </div>
        <!-- 任务提交 -->
        <div class="task-title-wapper" v-if="currentType == 2 && !uploadItem?.length && isFirst">
          <span class="task-icon"></span>
          <span class="task-title">上传（{{ formatTitle() }}）</span>
        </div>

        <div v-if="currentType == 2 && !uploadItem?.length && isFirst" class="form-item-finish">
          <el-form-item label="备注" prop="remark">
            <s-text-area v-model="addForm.remark" placeholder="请输入备注" />
          </el-form-item>

          <el-form-item label="附件" prop="fileList">
            <!-- 上传文件和附件 -->
            <SWuploadFile :fileList="otherList" :imgList="imgList" :allFileList="fileList" />
            <!-- 动态添加链接列表 -->
            <SWaddlink v-model:modelValue="inputItems" />
          </el-form-item>
          <div class="btn-wapper" v-if="isAssignment || isFirst">
            <el-button @click="handleClose" style="width: 64px; height: 32px" :loading="loading"
              >取消</el-button
            >
            <el-button
              type="primary"
              style="width: 64px; height: 32px"
              @click="onSubmit"
              :loading="loading"
              >保存</el-button
            >
          </div>
        </div>
        <div v-if="uploadItem">
          <ReviewItem
            :detailList="uploadItem"
            :detailNode="node + 1"
            :isTemporary="isTemporary"
            :isFinished="isFinished"
            :parentId="parentId"
            @success="handleSuccess"
            :currentSubType="currentSubType"
          />
        </div>
      </el-form>
      <div class="btn-wapper" v-if="!subTypeListResult?.length && currentType == 0">
        <el-button @click="handleClose" style="width: 64px; height: 32px" :loading="loading"
          >取消</el-button
        >
        <el-button
          type="primary"
          style="width: 64px; height: 32px"
          @click="onSubmit"
          :loading="loading"
          >保存</el-button
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { createRecord, getAuditorRoster, getOperatorRoster } from '@/api/team/index'
import STextArea from '@/components/common/input/s-textarea.vue'
import { formatTime } from '@/utils/index'
import SWaddlink from '../baseComponents/SWaddlink.vue'
import SWselectPeople from '../baseComponents/SWselectPeople.vue'
import SWuploadFile from '../baseComponents/SWuploadFile.vue'
import BaseTitle from '../components/baseTitle.vue'
import { useLeaderAudit } from '../components/hooks/useLeaderAudit'
import ReviewItem from '../components/reviewItem.vue'
const message = useMessage() // 消息弹窗

import { getSubNodeList, typeList } from '../common.js'
defineOptions({ name: 'SWTabsTable' })

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0 //0:人像 1:静物 2:视频
  },
  node: {
    type: Number,
    default: -1 // 1、方案  2、拍摄 3、后期 4、页面
  },
  detail: {
    type: Object,
    default: () => {}
  },
  isTemporary: {
    type: Boolean,
    default: false
  },
  isFinished: {
    type: Boolean,
    default: false
  },
  parentId: {
    type: String,
    default: ''
  },
  newSubTab: {
    type: String
  }
})

const formatFinishTitle = () => {
  switch (props.node) {
    case 2:
      return '任务完成(拍摄)'
    case 3:
      return '任务完成(后期)'
  }
}

const formatTitle = () => {
  switch (props.node) {
    case 1:
      return '方案'
    case 2:
      return '拍摄'
    case 3:
      return '后期'
    case 4:
      return '页面'
  }
}

const imgList = ref([])
const otherList = ref([])
const inputItems = ref([
  { label: 'URL', value: '', placeholder: '', description: '备注：方案设计图、链接、PPT', desc: '' }
])
const fileList = ref([]) // 文件列表

const remoteMethod = async (value) => {
  const params = {
    userName: value,
    node: props.node,
    subNode: currentSubType.value
  }
  return await getOperatorRoster(params)
}

//审核
const remoteMethod1 = async (value) => {
  const params = {
    userName: value,
    parentId: props.detail.id
  }
  return await getAuditorRoster(params)
}

let addForm = reactive({
  operate: [], //操作人员
  expectedCompletionTime: undefined, //计划完成时间
  audit: [], //审核人员
  remark: undefined //备注
})

// 自动同步审核方容器与 hook
interface Operator {
  avatarOrigin: string
  dept: string
  jobNum: number
  operatorId: string
  operatorRealname: string
}
const auditList = ref<Operator[]>([])
const auditSearchResult = ref<Operator[]>([])
const { syncAuditorsByOperators } = useLeaderAudit(addForm as any, auditList, auditSearchResult)

watch(
  () => (addForm.operate ?? []).slice(),
  async (val) => {
    await syncAuditorsByOperators(val || [])
  },
  { deep: false }
)

const currentType = ref(0) //操作类型
const typaChange = (index) => {
  currentType.value = index
  if (!addForm.expectedCompletionTime) {
    addForm.expectedCompletionTime = originItem.value.deliveryTime
  }
}

const emit = defineEmits(['update:modelValue', 'success', 'cancel'])

const handleClose = () => {
  emit('cancel')
}

const formatType = () => {
  switch (currentType.value) {
    case 0:
      return 9
    case 1:
      return 1
    case 2:
      return 2
  }
}

const currentSubType = ref<any>() //子任务类型
const handleSubChange = async (item) => {
  currentSubType.value = item.code
  // currentType.value = 0
  // 重新渲染数据
  subTypeListResult.value = []

  findNodeRecords()
  await nextTick()
  if (!addForm.expectedCompletionTime) {
    addForm.expectedCompletionTime = originItem.value.deliveryTime
  }
  console.log(addForm.expectedCompletionTime, 'addForm.expectedCompletionTime')
}

const formRef = ref()
const loading = ref(false)

const onSubmit = async () => {
  try {
    const annexes = []
    const itemsWithValue = inputItems.value.filter((item) => item.value !== '')

    itemsWithValue.forEach((item) => {
      // @ts-ignore
      annexes.push({
        type: 1,
        url: item.value,
        urlRemarks: item.desc
      })
    })

    if (otherList.value.length) {
      otherList.value.forEach((item) => {
        // @ts-ignore
        annexes.push({ ...item, type: 0 })
      })
    }
    if (imgList.value.length) {
      imgList.value.forEach((item) => {
        // @ts-ignore
        annexes.push({ ...item, type: 0 })
      })
    }
    let params = {}

    if (isSkip.value) {
      currentType.value = 0
    } else if (isUpload.value) {
      currentType.value = 2
    } else if (isAssignment.value) {
      currentType.value = 1
    }

    if (currentType.value == 0) {
      params = {
        // @ts-ignore
        parentId: props.detail.id,
        type: formatType(),
        node: props.node,
        subNode: currentSubType.value
      }
    } else if (currentType.value == 1) {
      const obj = toRaw(assignmentItem.value)
      if (addForm.operate.length == 0) {
        message.error('请选择人员')
        return
      }
      if (!addForm.expectedCompletionTime) {
        message.error('请选择计划交付时间')
        return
      }

      if (addForm.audit.length == 0) {
        message.error('请选择审核人员')
        return
      }
      params = {
        // @ts-ignore
        parentId: props.detail.id,
        type: formatType(),
        operatorIds: addForm.operate && addForm.operate.join(','), //操作
        auditorIds: addForm.audit && addForm.audit.join(','), //审核
        expectedCompletionTime: addForm.expectedCompletionTime, // 计划完成时间
        node: props.node,
        subNode: currentSubType.value,
        // @ts-ignore
        id: obj.id ? obj.id : undefined
      }
    } else if (currentType.value == 2) {
      params = {
        // @ts-ignore
        parentId: props.detail.id,
        type: formatType(),
        node: props.node,
        subNode: currentSubType.value,
        annexes: annexes, //附件
        remark: addForm.remark
      }
    }
    loading.value = true
    await createRecord(params)
    loading.value = false
    message.success('操作成功')
    emit('success')
  } catch (error) {
    loading.value = false
  }
}

const handleSuccess = () => {
  emit('success')
}

const subNodeList = ref<any[]>()

const initSubNode = async () => {
  // const res = await getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_VISUAL_SUBNODE, true)
  let res: any[] = []
  let arr: any[] = []

  if (props.node == 2 || props.node == 3) {
    // 3个子节点
    res = await getSubNodeList()
  } else {
    // 2个子节点
    res = await getSubNodeList(2)
  }

  if (props.newSubTab) {
    currentSubType.value = props.newSubTab
  } else {
    currentSubType.value = res && res[0].code
  }
  subNodeList.value = res
}

//先寻找对应的node节点
const findNodeRecords = () => {
  const resultArr: any[] = []
  const arr = props?.detail?.records || []
  arr.forEach((item) => {
    if (item.node == props.node) {
      // @ts-ignore
      resultArr.push(item)
    }
  })
  findSubTypeList(resultArr)
}

const subTypeListResult = ref<any[]>([])
// 寻找当前子任务二级节点
const findSubTypeList = (nodeList) => {
  nodeList.forEach((item) => {
    // @ts-ignore
    if (item.subNode == currentSubType.value) {
      // @ts-ignore
      subTypeListResult.value.push(item)
    }
  })
}

// 是否是跳过类型
const isSkip = computed(() => {
  // @ts-ignore
  return subTypeListResult.value.some((item) => item.type == 9)
})

// 跳过节点的list
const skipItem = computed(() => {
  const arr: any[] = []
  subTypeListResult.value.forEach((item) => {
    // @ts-ignore
    if (item.type == 9) {
      // @ts-ignore
      arr.push(item)
    }
  })
  return arr || []
})
// 是否是指派类型
const isAssignment = computed(() => {
  // @ts-ignore
  return subTypeListResult.value.some((item) => item.type == 1)
})

// 指派节点
const assignmentItem = computed(() => {
  const arr: any[] = []
  subTypeListResult.value.forEach((item) => {
    // @ts-ignore
    if (item.type == 1) {
      // @ts-ignore
      arr.push(item)
    }
  })
  return arr[arr?.length - 1] || []
})

watch(
  () => assignmentItem.value,
  (value, oldValue) => {
    // console.log('2次指派信息', value, oldValue)
    // @ts-ignore
    if (value?.id) {
      remoteMethod('')
    }
    if (value) {
      // @ts-ignore
      addForm.operate = value?.operators?.map((item) => item.operatorId) || []
      // @ts-ignore
      addForm.audit = value?.auditors?.map((item) => item.operatorId) || []
      // @ts-ignore
      addForm.expectedCompletionTime = value?.expectedCompletionTime
    }
  }
)

// 是否是上传类型
const isUpload = computed(() => {
  // @ts-ignore
  return subTypeListResult.value.some((item) => item.type == 2)
})

const uploadItem = computed(() => {
  const arr: any[] = []
  subTypeListResult.value.forEach((item) => {
    // @ts-ignore
    if (item.type == 2) {
      // @ts-ignore
      arr.push(item)
    }
  })
  return arr || []
})
const isFirst = computed(() => {
  return !isSkip.value && !isAssignment.value && !isUpload.value
})
const originItem = inject<any>('currentDetail')
onMounted(async () => {
  await initSubNode()
  findNodeRecords()
  if (!addForm.expectedCompletionTime) {
    addForm.expectedCompletionTime = originItem.value.deliveryTime
  }
})
</script>

<style scoped lang="scss">
.tabs-table-wapper {
  .tabs-top {
    width: 100%;
    height: 52px;
    background: #fff4e6;
    border-radius: 4px 4px 0px 0px;
    border: 1px solid #e6eaf8;
    display: flex;
    flex-direction: row;
    align-items: center;

    .item {
      cursor: pointer;
      width: 83px;
      height: 58px;
      line-height: 58px;
      text-align: center;
      border-radius: 4px 0px 0px 0px;
      font-size: 14px;
      color: #666;
    }

    .active {
      background: #ffffff;
      border: none;
      height: 52px;
      color: #e98203;
    }
  }

  .tabs-content {
    box-sizing: border-box;
  }
}

.change-wapper {
  margin-top: 10px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;

  .item-title {
    font-size: 14px;
    color: #666666;
    line-height: 20px;
  }

  .item {
    cursor: pointer;
    width: 88px;
    height: 30px;
    background: #fafafa;
    border-radius: 2px;
    border: 1px solid #dfe0e3;
    line-height: 32px;
    margin-right: 50px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    position: relative;

    .btn-icon {
      width: 13px;
      height: 10px;
      margin-right: 6px;
    }

    .selected-type {
      width: 15px;
      height: 11px;
      position: absolute;
      right: -1px;
      top: 0;
    }

    .btn-text {
      font-size: 14px;
      color: #666666;
    }
  }

  .active {
    background: rgba(28, 117, 254, 0.04);
    border: 1px solid #1c75fe;

    .btn-text {
      color: #1c75fe;
    }
  }
}

.content-wapper {
  .empty {
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
}

.btn-wapper {
  display: flex;
  flex-direction: row;
  justify-content: end;
  width: 100%;
}

:deep(.el-upload--picture-card) {
  width: 110px;
  height: 110px;
  border: none;
}

.form-item-finish {
  padding: 16px;
  box-sizing: border-box;
  background: #fbfcff;
  box-shadow: 0px 2px 13px 0px rgba(0, 59, 68, 0.23);
  border-radius: 0px 0px 4px 4px;
}

.table-content {
  background: #fbfcff;
  box-shadow: 0px 2px 13px 0px rgba(0, 59, 68, 0.23);
  border-radius: 0px 0px 4px 4px;
  padding: 16px;
  box-sizing: border-box;
}

.mid {
  width: 100%;
  height: 1px;
  background: #e7edf7;
  margin: 0 0 15px 0;
}

.avator {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  margin-right: 10px;
}

.title {
  font-size: 12px;
  color: #999999;
  line-height: 20px;
  margin-bottom: 5px;
  display: flex;
  flex-direction: column;
}

.mid3 {
  border-top: 1px solid #e6eaf8;
}

.task-title-wapper {
  width: 100%;
  height: 53px;
  background: linear-gradient(90deg, #e5efff 0%, #c2daff 100%);
  box-shadow: 0px 2px 13px 0px rgba(0, 59, 68, 0.23);
  border-radius: 4px 4px 0px 0px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 16px;
  box-sizing: border-box;

  .task-icon {
    display: block;
    width: 3px;
    height: 10px;
    background: #0064ff;
    margin-right: 6px;
  }

  .task-title {
    font-size: 14px;
    color: #333333;
    line-height: 20px;
    font-weight: bold;
  }
}

.zhipai-content {
  background: #fbfcff;
  box-shadow: 0px 2px 11px 0px rgba(0, 44, 110, 0.3);
  border-radius: 0px 0px 4px 4px;
  padding: 16px;
  box-sizing: border-box;
}

.finish-task {
  background: #fbfcff;
  box-shadow: 0px 2px 11px 0px rgba(0, 44, 110, 0.3);
  border-radius: 0px 0px 4px 4px;
  margin-top: -10px;
  padding: 16px;
  box-sizing: border-box;

  .content-finish {
    font-size: 12px;
    color: #666666;
    padding-bottom: 16px;
  }
}
</style>
