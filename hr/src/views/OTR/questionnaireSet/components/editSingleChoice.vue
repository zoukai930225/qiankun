<template>
  <div>
    <div class="drawerContent">
      <div class="flex-row">
        <div class="select-btn" @click="quicklySelect" style="margin-right: 16px">快速选择</div>
        <el-button type="primary" @click="saveItem">提交</el-button>
      </div>

      <el-form class="dialogForm" ref="formRef" :model="formData">
        <el-form-item label="名称" prop="name">
          <el-input class="dialogFormItemWidth" v-model="formData.name" placeholder="请输入名称" clearable maxlength="20" />
        </el-form-item>
        <el-form-item label="定义" prop="definition">
          <s-text-area class="dialogFormItemWidth" v-model="formData.definition" placeholder="请输入定义" maxlength="200"
            :autosize="{ minRows: 3, maxRows: 4 }" />
        </el-form-item>
        <el-form-item label="权重" prop="weight">
          <div class="flex-row">
            <el-input class="dialogFormItemWidth" v-model="formData.weight" placeholder="请输入名称" clearable
              type="number" />
            <span style="margin-left: 10px">%</span>
          </div>
        </el-form-item>
      </el-form>
    </div>

    <div class="drawerContent-title">
      <div class="drawerContent-title-icon"></div>
      <div>等级</div>
    </div>
    <!--  -->
    <div class="drawerContent" v-for="(item, index) in list" :key="index">
      <div class="drawerContent-title" style="margin-bottom: 10px">
        <div class="drawerContent-item" @click="deleteClick(index)">
          <img class="drawerContent-item-icon" v-if="index == list.length - 1 && index != 0"
            src="@/assets/imgs/common/del.png" />
          <img v-else class="drawerContent-item-icon" src="@/assets/imgs/otr/schemeSet/delete_icon.png" />
        </div>
      </div>

      <el-form class="dialogForm" :model="item">
        <el-form-item label="" prop="name">
          <div class="itemBg">
            <el-input v-model="item.name" placeholder="请输入" clearable maxlength="10"
              style="width: 300px; margin-right: 16px" />
            <div class="flex-row form-item">
              <el-input v-model="item.minScore" class="start" type="number" placeholder="请输入" clearable min="0" />
              <span class="mid">至</span>
              <el-input v-model="item.maxScore" :min="item.minScore" class="end" type="number" placeholder="请输入"
                clearable />
            </div>
          </div>
        </el-form-item>
        <el-form-item prop="description">
          <s-text-area class="dialogFormItemWidth" v-model="item.description" placeholder="请输入" maxlength="200"
            :autosize="{ minRows: 3, maxRows: 4 }" />
        </el-form-item>
      </el-form>
    </div>
    <div class="addMoreBg">
      <div class="addMore" @click="addMoreClick">
        <el-icon class="addMore-icon" color="#0064ff" :size="12">
          <Plus />
        </el-icon>
        <div class="addMore-text">点击添加</div>
      </div>
    </div>

    <QuicklySelect ref="quicklySelectRef" @selected="selected" />
  </div>
</template>
<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import QuicklySelect from './quicklySelect.vue'
import { cloneDeep } from 'lodash-es'

const props = defineProps({
  detail: {
    type: Object,
    default: () => { }
  },
  id: {
    type: String,
    default: ''
  }
})

const formData = ref({
  id: undefined,
  name: undefined, //项目名称
  definition: undefined,
  weight: undefined
})

// 项目对象列表
const list = ref([
  {
    name: undefined, //等级名称
    description: undefined, //等级描述
    minScore: 0, //等级最小分值
    maxScore: undefined //等级最大分值
  }
])

watch(
  () => props.detail,
  (detail) => {
    // 赋值
    formData.value.name = detail.name
    formData.value.definition = detail.definition
    formData.value.weight = detail.weight
    formData.value.id = detail.id

    list.value = cloneDeep(detail.programRankList) || [
      {
        name: undefined, //等级名称
        description: undefined, //等级描述
        minScore: 0, //等级最小分值
        maxScore: undefined //等级最大分值
      }
    ]
  },
  { deep: true, immediate: true }
)

const selected = (item) => {
  formData.value = item
  list.value = item.programRankList || []
}

// 校验题目信息
const formatParams = () => {
  if (!formData.value.name) {
    message.error('名称不能为空')
    return true
  } else if (!formData.value.definition) {
    message.error('定义不能为空')
    return true
  } else if (!formData.value.weight) {
    message.error('权重不能为空')
    return true
  }
}
// 校验选项是不是为空
const formatList = () => {
  const arr = list.value
  let errors: string[] = []
  arr.forEach((obj, index) => {
    if (!obj.name) {
      errors.push(`等级 第${index + 1}项 选项名字不能为空`)
    }
    if (!obj.minScore && index != 0) {
      errors.push(`等级 第${index + 1}项 选项最小分数值不能为空`)
    }
    if (!obj.maxScore) {
      errors.push(`等级 第${index + 1}项 选项最大分数值不能为空`)
    }
    if (index == 0 && obj.minScore != 0) {
      errors.push(`等级 第1项最小值必须是0`)
    }
    if (Number(obj.minScore) > Number(obj.maxScore)) {
      errors.push(`等级 第${index + 1}项，最大分不能小于等级最小分值`)
    }

    if (!obj.description) {
      errors.push(`等级 第${index + 1}项 选项描述不能为空`)
    }
  })
  return errors
}

//校验分数要以此递增
const checkMinScoreValidity = () => {
  const arr = list.value
  let errors: string[] = []
  for (let i = 1; i < arr.length; i++) {
    // @ts-ignore
    if (arr[i].minScore < arr[i - 1].maxScore) {
      errors.push(`等级第${i + 1}项最小值不能比第${i}项最大值小`)
    }
  }
  return errors
}

// 保存编辑的单选题
const saveItem = () => {
  //题库校验
  const paramsFlag = formatParams()
  if (paramsFlag) return
  // 选项空值校验
  const err = formatList()
  if (err.length) {
    message.error(err[0])
    return
  }
  // 一次递增校验
  const errList = checkMinScoreValidity()
  if (errList.length) {
    message.error(errList[0])
    return
  }
  const item = {
    ...props.detail,
    ...formData.value,
    programRankList: list.value
  }
  emit('saveItem', item)
  message.success('题目编辑成功')
}
const message = useMessage() // 消息弹窗
const formRef = ref() // 表单 Ref

const quicklySelectRef = ref()
const quicklySelect = () => {
  quicklySelectRef.value.open(props.id)
}

// 点击添加
const addMoreClick = () => {
  if (list.value.length) {
    // 校验选项是不是空
    const err = formatList()
    if (err.length) {
      message.error(err[0])
      return
    }

    // 校验分数依次递增
    const errList = checkMinScoreValidity()
    if (errList.length) {
      message.error(errList[0])
      return
    }

    const item = list.value[list.value.length - 1]

    if ((!item.minScore && item.minScore != 0) || !item.maxScore) {
      message.error('请完善等级分值')
      return
    }

    list.value.push({
      name: undefined, //等级名称
      description: undefined, //等级描述
      minScore: Number(item.maxScore) + 1, //等级最小分值
      maxScore: undefined //等级最大分值
    })
  } else {
    //判断上一个有没有填写完成
    list.value.push({
      name: undefined, //等级名称
      description: undefined, //等级描述
      minScore: 0, //等级最小分值
      maxScore: undefined //等级最大分值
    })
  }
}
// 删除按钮点击
const deleteClick = (index) => {
  if (index == 0) return
  if (index == list.value?.length - 1) {
    list.value.splice(index, 1)
  }
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗
const emit = defineEmits(['success', 'saveItem']) // 定义 success 事件，用于操作成功后的回调
</script>

<style lang="scss" scoped>
.drawerTitle {
  font-family: AlibabaPuHuiTi_2_75_SemiBold;
  font-size: 14px;
  color: #333333;
  line-height: 20px;
  font-weight: 600;
  margin: 0 0 18px 0;
}

.drawerContent-title-icon {
  width: 3px;
  height: 10px;
  background: #0064ff;
  margin-right: 6px;
}

.drawerContent {
  padding: 16px;
  box-sizing: border-box;
  width: 100%;
  background: #f7faff;
  border-radius: 8px;
  margin-bottom: 16px;

  .select-btn {
    cursor: pointer;
    width: 102px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    border-radius: 2px;
    border: 1px solid #0064ff;
    font-weight: 400;
    font-size: 14px;
    color: #0064ff;
    margin-bottom: 20px;
  }

  &-title {
    margin: 0 0 18px 25px;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 14px;
  }

  .drawerContent-title-icon {
    width: 3px;
    height: 10px;
    background: #0064ff;
    margin-right: 6px;
  }

  &-item {
    margin-left: auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;

    &-item {
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    &-icon {
      width: 14px;
      height: 14px;
    }
  }

  .itemBg {
    width: 100%;
    height: 32px;
    background: #f8f8f9;
    border-radius: 4px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;

    &-text {
      font-size: 14px;
      color: #333333;
      line-height: 20px;
      padding-left: 16px;
      line-height: 32px;
    }
  }
}

.dialogFormItemWidth {
  width: 100%;
}

.addMoreBg {
  width: calc(100%);
  display: flex;
  flex-direction: column;
  align-items: center;

  .addMore {
    cursor: pointer;
    width: 116px;
    height: 36px;
    border-radius: 4px;
    border: 1px solid #0064ff;
    display: flex;
    flex-direction: row;
    align-items: center;

    &-icon {
      margin-left: 20px;
      margin-right: 6px;
    }

    &-text {
      font-size: 14px;
      color: #0064ff;
      line-height: 20px;
    }
  }
}

:deep(.el-textarea__inner),
:deep(.el-input__wrapper) {
  background-color: white !important;
  box-shadow: none !important;
}

:deep(.el-select__wrapper) {
  background-color: white !important;
  box-shadow: none !important;
}

.form-item {
  width: 100%;

  .start {
    width: 116px;
  }

  .mid {
    margin: 0 20px;
  }

  .end {
    width: 116px;
  }
}

.flex-row {
  display: flex;
  flex-direction: row;
}
</style>
