<!--
 * @Date: 2024-09-13 15:25:17
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
      <!-- 空数据 -->
      <div class="content-wapper form-item">
        <div class="empty" v-if="isFirst">
          <img src="@/assets/imgs/team/empty-img.png" class="empty-img" alt="" />
          <span class="empty-text">暂无数据</span>
        </div>
      </div>

      <!-- 提交任务 -->
      <div
        v-if="assignmentItem?.length && currentSubType == props.currentSubNode"
        style="margin-bottom: 20px"
      >
        <AddTask
          :node="node"
          :detail="detail"
          :currentSubType="currentSubType"
          @success="handleSuccess"
          @cancel="handleTaskSbumitCancel"
        />
      </div>
      <!-- 任务提交的渲染 -->
      <div v-if="uploadItem?.length">
        <ReviewItem
          :detailList="uploadItem"
          :detailNode="node + 1"
          :isFinished="isFinished"
          :parentId="parentId"
          :currentSubType="currentSubType"
          @success="handleSuccess"
        />
      </div>

      <div v-if="skipItem?.length">
        <!-- 渲染任务完成卡片-->
        <div v-for="item in skipItem" :key="item.id">
          <BaseTitle title="任务完成" :recordType="3" />
          <div class="finish-task">
            <div class="content-finish">跳过</div>
            <div class="mid mid3"></div>

            <div class="title"
              ><div>
                <img :src="item.createdAvatar" v-if="item.createdAvatar" class="avator" />
                <span>{{ item.createdRealname }}</span>
              </div>
              <span>{{ formatTime(item.createdAt, 'yyyy-MM-dd HH:mm:ss') }}</span></div
            >
          </div>
        </div>
      </div>
      <!-- 任务指派 -->
      <div class="form-item" v-if="assignmentItem?.length">
        <ReviewItem
          :detailList="assignmentItem"
          :detailNode="node + 1"
          :isFinished="isFinished"
          :parentId="parentId"
          :currentSubType="currentSubType"
          @success="handleSuccess"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import BaseTitle from '../components/baseTitle.vue'
import ReviewItem from '../components/reviewItem.vue'
import AddTask from './AddTask.vue'
import { formatTime } from '@/utils/index'
const message = useMessage() // 消息弹窗
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { getSubNodeList } from '../common.js'
defineOptions({ name: 'SWTabsTable' })

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0 //0:人像 1:静物 2:视频
  },
  node: {
    type: Number,
    default: -1 // 2、拍摄 3、后期
  },
  detail: {
    type: Object,
    default: () => {}
  },
  currentSubNode: {
    type: String,
    default: ''
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
  }
})

let addForm = reactive({
  operate: [], //操作人员
  expectedCompletionTime: undefined, //计划完成时间
  audit: [] //审核人员
})

const currentType = ref(0) //操作类型

const emit = defineEmits(['update:modelValue', 'success', 'cancel'])

const handleSuccess = () => {
  emit('success')
}

const handleTaskSbumitCancel = () => {
  emit('cancel')
}
const currentSubType = ref() //子任务类型

const handleSubChange = (item) => {
  currentSubType.value = item.code
  currentType.value = 0
  // 重新渲染数据
  subTypeListResult.value = []
  findNodeRecords()
}

const formRef = ref()

// 二级子节点列表
const subNodeList = ref()
const initSubNode = async () => {
  const res = await getSubNodeList()
  // const res = await getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_VISUAL_SUBNODE, true)
  // const arr = res.map((item) => {
  //   if (item.label == '视频') {
  //     return {
  //       ...item,
  //       img: `https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/common/obs/shipin.png`,
  //       activeImg: `https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/common/obs/shipin-active.png`
  //     }
  //   } else if (item.label == '人像') {
  //     return {
  //       ...item,
  //       img: `https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/common/obs/renwu.png`,
  //       activeImg: `https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/common/obs/renwu-active.png`
  //     }
  //   } else if (item.label == '静物') {
  //     return {
  //       ...item,
  //       img: `https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/common/obs/jingwu.png`,
  //       activeImg: `https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/common/obs/jingwu-active.png`
  //     }
  //   }
  // })
  subNodeList.value = res
}

//先寻找对应的node节点
const findNodeRecords = () => {
  const resultArr = []
  const arr = props?.detail?.records || []
  arr.forEach((item) => {
    if (item.node == props.node) {
      // @ts-ignore
      resultArr.push(item)
    }
  })
  findSubTypeList(resultArr)
}

const subTypeListResult = ref([])
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
  const arr = []
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
  const arr = []
  subTypeListResult.value.forEach((item) => {
    // @ts-ignore
    if (item.type == 1) {
      // @ts-ignore
      arr.push(item)
    }
  })
  return arr || []
})

// 是否是上传类型
const isUpload = computed(() => {
  // @ts-ignore
  return subTypeListResult.value.some((item) => item.type == 2)
})

const uploadItem = computed(() => {
  const arr = []
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

watch(
  () => props.detail,
  () => {
    currentSubType.value = props.currentSubNode
    findNodeRecords()
  },
  { immediate: true, deep: true }
)

onMounted(() => {
  initSubNode()
})
</script>

<style scoped lang="scss">
.tabs-table-wapper {
  .tabs-top {
    width: 100%;
    height: 52px;

    background: #f6f7fc;
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
      color: #0567fe;
    }
  }
  .tabs-content {
    box-sizing: border-box;
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

:deep(.el-upload--picture-card) {
  width: 110px;
  height: 110px;
  border: none;
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
