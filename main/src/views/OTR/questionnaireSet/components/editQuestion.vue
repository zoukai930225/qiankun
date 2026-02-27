<!--
 * @Date: 2024-10-14 10:00:52
-->
<template>
  <div class="edit-content">
    <!-- 按钮 -->
    <div class="btn-wapper">
      <span class="btn-item" @click="resetList">恢复默认</span>
      <span class="btn-item" @click="preView">预览</span>
    </div>
    <!-- 内容 -->
    <div class="flex-row" v-if="list?.length == 0">
      <span class="btn-item" @click="addQuestion(0)">添加单选题</span>
      <span class="btn-item" @click="addQuestion(1)">添加填空题</span>
    </div>
    <!-- 题目列表 -->
    <div class="content">
      <!--  题目 -->
      <div class="content-left">
        <div
          v-for="(item, index) in list"
          :key="item.id"
          @click="itemClick(item, index)"
          style="margin-bottom: 16px"
        >
          <SingleChoice
            v-if="item.type == 0"
            :detail="item"
            @btn-click="handleBtnClick"
            @inset="handleInset"
            :currentIndex="index"
          />
          <EssayQuestions
            v-if="item.type == 1"
            :detail="item"
            @btn-click="handleBtnClick"
            @inset="handleInset"
            :currentIndex="index"
          />
        </div>
      </div>
      <!-- 编辑区 -->
      <div class="content-right">
        <div v-for="(item, index) in editList" :key="index">
          <EditSingleChoice
            v-if="item.type == 0"
            :detail="item"
            @save-item="saveItem"
            :id="id"
            :wapperDetail="wapperDetail"
          />
          <EditEssayQuestions v-if="item.type == 1" :detail="item" @save-item="saveItem" :id="id" />
        </div>

        <div class="empty" v-if="!editList?.length">
          <div class="empty-content"
            ><img src="@/assets/imgs/common/empty-edit.png" class="empty-icon" /><span
              class="empty-desc"
              >编辑区</span
            ></div
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SingleChoice from './singleChoice.vue'
import EssayQuestions from './essayQuestions.vue'
import EditSingleChoice from './editSingleChoice.vue'
import EditEssayQuestions from './editEssayQuestions.vue'
import { cloneDeep } from 'lodash-es'
const message = useMessage()

const props = defineProps({
  programDtoList: {
    //题目(项目)与等级数据集合
    type: Array,
    default: () => []
  },
  id: {
    type: String,
    default: ''
  },
  wapperDetail: {
    type: Object,
    default: () => {}
  }
})

const list = ref() //重新赋值题目列表

watch(
  () => props.programDtoList,
  (newValue) => {
    list.value = cloneDeep(newValue) || []
  },
  { deep: true, immediate: true }
)

const editList = ref() // 编辑区域的题目
const currentIndex = ref() // 当前编辑的第几个index
const itemClick = (item, index) => {
  editList.value = [item]
  currentIndex.value = index
}

const addQuestion = (type) => {
  currentIndex.value = 0
  const arr = cloneDeep(list.value)
  if (type == 0) {
    //单选
    const item = {
      name: undefined,
      definition: undefined,
      weight: undefined,
      type: 0,
      programRankList: [
        { name: undefined, description: undefined, minScore: undefined, maxScore: undefined }
      ]
    }
    arr.push(item)
    list.value = arr
    editList.value = [item]
  }
}

// 编辑过的选择题
const saveItem = (item) => {
  // 区分是不是自定义添加的
  const index = item.name ? currentIndex.value : currentIndex.value + 1
  list.value[index] = item
}

// 插入
//type  single 单选题  question 填空题
// index 操作的 list 的 index 坐标
const handleInset = (type, index) => {
  // const item = list.value[index + 1]
  // if (!item.id && !item.name) return //不能连续添加过个空的项
  currentIndex.value = index + 1
  console.log('index', index)
  const arr = cloneDeep(list.value)
  if (type == 'single') {
    const item = {
      name: undefined,
      definition: undefined,
      weight: undefined,
      type: 0,
      programRankList: [
        { name: undefined, description: undefined, minScore: undefined, maxScore: undefined }
      ]
    }
    arr.splice(index + 1, 0, item)
    list.value = arr
    editList.value = [item]
  } else if (type == 'question') {
    const item = {
      name: undefined,
      definition: undefined,
      type: 1 //填空题
    }
    arr.splice(index + 1, 0, item)
    list.value = arr
    editList.value = [item]
  }
}

// 单个按钮点击处理
// type moveTop 置顶 moveBottom 置底 moveUp 上移 moveDown 下移 del 删除
// index 操作的 list 的 index 坐标
const handleBtnClick = (type, index) => {
  console.log(type, index)
  // 先删除在操作
  if (type == 'moveTop') {
    //置顶
    if (index == 0) return // 最上面无需置顶
    const arr = cloneDeep(list.value)
    const item = arr.splice(index, 1)
    arr.unshift(item[0])
    list.value = arr
  } else if (type == 'moveBottom') {
    if (index == list.value?.length - 1) return // 最下面无需置底
    const arr = cloneDeep(list.value)
    const item = arr.splice(index, 1)
    arr.push(item[0])
    list.value = arr
  } else if (type == 'moveUp') {
    if (index == 0) return // 最上面无需上移动
    const arr = cloneDeep(list.value)
    const item = arr.splice(index, 1)
    arr.splice(index - 1, 0, item[0])
    list.value = arr
  } else if (type == 'moveDown') {
    if (index == list.value?.length - 1) return // 最下面无需移动
    const arr = cloneDeep(list.value)
    const item = arr.splice(index, 1)
    arr.splice(index + 1, 0, item[0])
    list.value = arr
  } else if (type == 'del') {
    const arr = cloneDeep(list.value)
    arr.splice(index, 1)
    list.value = arr
  }
}

const emit = defineEmits(['reset', 'preview'])

// 预览
const preView = () => {
  emit('preview', list.value)
}
//重置
const resetList = async () => {
  let content = `恢复默认后，您的所有编辑内容将丢失，问卷恢复到初始题型，是否确认？`
  let statusT = '恢复默认'
  // 删除的二次确认
  await message.delConfirm(content, statusT)
  message.success('恢复成功')
  editList.value = []
  emit('reset')
}

defineExpose({ list })
</script>

<style lang="scss" scoped>
.edit-content {
  .btn-wapper {
    margin-bottom: 16px;
  }
  .btn-item {
    cursor: pointer;
    height: 34px;
    line-height: 34px;
    background: #ffffff;
    border-radius: 17px;
    border: 1px solid #c7c6cb;
    padding: 7px 20px;
    box-sizing: border-box;
    margin-right: 20px;
  }

  .content {
    display: flex;
    flex-direction: row;
    .content-left {
      flex: 1;
      height: 600px;
      overflow-y: scroll;
    }
    .content-right {
      height: 600px;
      overflow-y: scroll;
      margin-left: 16px;
      width: 630px;
      padding: 16px;
      box-sizing: border-box;
      background: #ffffff;
      border-radius: 10px;
      border: 2px dashed #d3d3d3;
      margin-bottom: 10px;
      .empty {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        margin-top: 200px;
        padding-bottom: 200px;
        box-sizing: border-box;
        .empty-content {
          display: flex;
          flex-direction: row;
          align-items: center;
          .empty-desc {
            font-size: 24px;
            color: #0064ff;
          }
          .empty-icon {
            width: 20px;
            height: 20px;
            margin-right: 18px;
          }
        }
      }
    }
  }
}
</style>
