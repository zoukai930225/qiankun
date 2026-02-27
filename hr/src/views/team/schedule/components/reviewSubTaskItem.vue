<!--
多任务子节点查看（拍摄、后期）
-->
<template>
  <div class="tabs-table-wapper">
    <div class="tabs-top">
      <div
        class="item"
        :class="{ active: currentSubType == item.value }"
        v-for="item in subNodeList"
        :key="item.value"
        @click="handleSubChange(item)"
        >{{ item.label }}
      </div>
    </div>
    <div class="table-content">
      <!-- 跳过 -->
      <div v-if="isSkip" style="margin-bottom: 20px">
        <div v-for="item in skipItem" :key="item.id">
          <BaseTitle :title="formatTitle()" :recordType="3" />
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
      <div v-if="uploadItem" style="margin-bottom: 20px">
        <ReviewItem
          :detailList="uploadItem"
          :detailNode="detailNode"
          :currentSubType="currentSubType"
          :isFinished="isFinished"
          :parentId="parentId"
          @success="handleSuccess"
          :currentSubNode="currentSubNode"
        />
      </div>
      <div v-if="assignmentItem">
        <ReviewItem
          :detailList="assignmentItem"
          :detailNode="detailNode"
          :currentSubType="currentSubType"
          :isFinished="isFinished"
          :parentId="parentId"
          :currentSubNode="currentSubNode"
          @success="handleSuccess"
        />
      </div>
      <div class="content-wapper form-item" v-if="!subTypeListResult?.length">
        <div class="empty">
          <img src="@/assets/imgs/team/empty-img.png" class="empty-img" alt="" />
          <span class="empty-text">暂无数据</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import BaseTitle from '../components/baseTitle.vue'
import ReviewItem from '../components/reviewItem.vue'
import { formatTime } from '@/utils/index'
const message = useMessage() // 消息弹窗
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { getSubNodeList } from '../common.js'

defineOptions({ name: 'ReviewSubTaskItem' })

const props = defineProps({
  detailList: {
    type: Array<any>,
    default: () => {
      return []
    }
  },
  detailNode: {
    type: Number,
    default: -1
  },
  isTemporary: {
    type: Boolean,
    default: false
  },
  currentSubNode: {
    type: String,
    default: ''
  },
  isFinished: {
    type: Boolean,
    default: false
  },
  parentId: {
    type: String,
    default: ''
  },
  resetIndex: {
    //点开进度条需要重新赋值currentSubType
    type: Boolean,
    default: false
  }
})

// 新增了审核  node + 1
const formatTitle = () => {
  switch (props.detailNode) {
    case 2:
      return `任务完成(方案)`
    case 3:
      return `任务完成(拍摄)`
    case 4:
      return `任务完成(后期)`
    case 5:
      return `任务完成(页面)`
  }
}

const emit = defineEmits(['update:modelValue', 'success'])
const currentSubType = ref() //当前子任务类型
const handleSubChange = (item) => {
  currentSubType.value = item.code
  // 重新渲染数据
  subTypeListResult.value = []
  findSubNodeRecords()
}

const subNodeList = ref()
const initSubNode = async () => {
  let type = [3, 4].includes(props.detailNode) ? 3 : 2
  const res = await getSubNodeList(type)
  if (props.resetIndex) {
    currentSubType.value = res && res[0].code
  }

  subNodeList.value = res
}

//寻找当前子任务二级节点
const subTypeListResult = ref([])
const findSubNodeRecords = () => {
  const arr = props?.detailList || []
  arr.forEach((item) => {
    if (item.subNode == currentSubType.value) {
      // @ts-ignore
      subTypeListResult.value.push(item)
    }
  })
}

// 当前子节点是跳过节点
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

// 任务提交的列表
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

watch(
  () => props.detailList,
  async () => {
    currentSubType.value = props.currentSubNode
    subTypeListResult.value = []
    await initSubNode()
    findSubNodeRecords()
  },
  {
    deep: true,
    immediate: true
  }
)

const handleSuccess = () => {
  emit('success')
}
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
