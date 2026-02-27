<template>
  <el-dialog
    title="新增"
    v-model="dialogVisible"
    :show-close="false"
    style="
      width: 488px;
      background: linear-gradient(225deg, #f2f3ff 0%, #ffffff 39%, #ffffff 88%, #f0f8ff 100%);
      border-radius: 14px;
    "
  >
    <el-form
      class="dialogForm"
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      @submit.prevent="submitForm"
    >
      <el-form-item
        :label="labelName"
        :prop="propName"
        required
        :rules="[{ required: true, message: `请输入${labelName}` }]"
      >
        <el-input v-model.trim="formData[propName]" :placeholder="`请输入${labelName}`" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm">提 交</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import * as EvaluationApi from '@/api/serviceConfiguration/evaluation'

const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const formData = ref({
  levelOneLabel: '',
  levelTwoLabel: '',
  levelThreeLabel: ''
})
const labelName = ref('')
const propName = ref('')
/** 打开弹窗 */
const open = async (type: string, oneLevel?: string, twoLevel?: string) => {
  dialogVisible.value = true
  resetForm()
  console.log('type', type)
  // 如果是新增二级分类
  if (oneLevel) {
    formData.value.levelOneLabel = oneLevel
    labelName.value = '二级分类名称'
    propName.value = 'levelTwoLabel'
    if (twoLevel) {
      formData.value.levelTwoLabel = twoLevel
      labelName.value = '三级分类名称'
      propName.value = 'levelThreeLabel'
    }
  } else {
    labelName.value = '一级分类名称'
    propName.value = 'levelOneLabel'
  }
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const formRef = ref() // 表单 Ref
const emit = defineEmits(['success']) // 定义 submit 事件，用于保存后的回调
const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as any

    data.id = undefined
    await EvaluationApi.addEvaluation(data)
    message.success(t('common.createSuccess'))

    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  if (formRef.value) {
    formData.value.levelOneLabel = ''
    formData.value.levelTwoLabel = ''
    formData.value.levelThreeLabel = ''
    formRef.value.resetFields()
  }
}
</script>

<style lang="scss" scoped>
/* 隐藏滚动条，但保持滚动功能 */
::-webkit-scrollbar {
  display: none;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;
  img {
    width: 14px;
    cursor: pointer;
  }
}
.container {
  display: flex;
  width: 430px;
  max-height: 443px;
  margin: 0 auto;
  .channel-container {
    width: 120px;
    padding: 10px 4px;
    max-height: 320px;
    overflow: auto;
    border: 1px solid #dcdfe6;
    border-radius: 14px;
    margin-right: 14px;
    box-sizing: border-box;
    cursor: pointer;
    .channel-item {
      font-size: 14px;
      color: #333333;
      padding: 10px 0 10px 20px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      position: relative;
      margin-bottom: 6px;
    }
    .channel-item_selected {
      background: #ecf4ff;
      &::before {
        content: ' ';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 3px;
        background: #0064ff;
        border-radius: 4px 0px 0px 4px;
      }
    }
  }
  .store-container {
    min-width: 300px;
    cursor: pointer;
    padding: 10px 16px;
    box-sizing: border-box;
    border: 1px solid #dcdfe6;
    border-radius: 14px;
    max-height: 320px;
    overflow: auto;
    .store-item {
      display: flex;
      font-size: 14px;
    }
  }
}
</style>
