<template>
  <div>
    <div class="btn">
      <el-button type="primary" @click="saveItem">提交</el-button>
    </div>

    <div class="drawerContent">
      <el-form class="dialogForm" ref="formRef" :model="formData">
        <el-form-item label="名称" prop="name">
          <el-input class="dialogFormItemWidth" v-model="formData.name" placeholder="请输入名称" clearable />
        </el-form-item>
        <el-form-item label="定义" prop="definition">
          <s-text-area class="dialogFormItemWidth" v-model="formData.definition" placeholder="请输入定义"
            :autosize="{ minRows: 3, maxRows: 4 }" />
        </el-form-item>
      </el-form>
    </div>

    <!--  -->
    <div class="drawerContent">
      <el-form class="dialogForm" :model="formData">
        <el-form-item label="描述" prop="name">
          <el-input v-model="formData.desc1" placeholder="请输入" clearable style="width: 100%; margin-bottom: 16px" />
          <el-input v-model="formData.desc2" placeholder="请输入" clearable style="width: 100%" />
        </el-form-item>
        <el-form-item label="最小字数限制" prop="minWord">
          <el-input-number v-model="formData.minWord" :min="1" />
        </el-form-item>
        <el-form-item label="必填" prop="isRequired">
          <el-switch v-model="formData.isRequired" style="--el-switch-on-color: #0064ff" />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
const message = useMessage() // 消息弹窗

const formData = ref({
  id: undefined,
  name: undefined, //项目名称
  definition: undefined, //定义
  isRequired: true,
  minWord: 1,
  desc1: '请输入内容',
  desc2: '请输入内容'
})

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

watch(
  () => props.detail,
  (detail) => {
    // 赋值
    try {
      const str = detail.description.split('$')
      formData.value.name = detail.name
      formData.value.definition = detail.definition
      formData.value.isRequired = detail.isRequired == 1 ? true : false
      formData.value.minWord = detail.minWord
      formData.value.desc1 = str[0] || ''
      formData.value.desc2 = str[1] || ''
    } catch (error) { }
  },
  { deep: true, immediate: true }
)

const formatParams = () => {
  if (!formData.value.name) {
    message.error('填空题名字不能为空')
    return true
  } else if (!formData.value.definition) {
    message.error('填空题定义不能为空')
    return true
  } else if (!formData.value.desc1 || !formData.value.desc2) {
    message.error('填空题描述不能为空')
    return true
  }

  if (formData.value.minWord < 1) {
    message.error('最小字数限制必须大于1')
    return true
  }
}

// 保存编辑的单选题
const saveItem = () => {
  // 参数校验
  const flag = formatParams()
  if (flag) return
  const item = {
    ...props.detail,
    ...formData.value,
    description: `${formData.value.desc1}$${formData.value.desc2}`,
    desc1: undefined,
    desc2: undefined,
    isRequired: formData.value.isRequired ? 1 : 0
  }
  emit('saveItem', item)
  message.success('题目编辑成功')
}

const formRef = ref() // 表单 Ref

const emit = defineEmits(['success', 'saveItem'])
</script>

<style lang="scss" scoped>
.drawerContent {
  padding: 16px;
  box-sizing: border-box;
  width: 100%;
  background: #f7faff;
  border-radius: 8px;
  margin-bottom: 16px;

  &-title {
    margin: 0 0 18px 25px;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 14px;
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
}

.dialogFormItemWidth {
  width: 100%;
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

.btn {
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: end;
  margin-bottom: 16px;
}
</style>
