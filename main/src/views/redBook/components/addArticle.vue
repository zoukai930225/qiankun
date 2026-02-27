<template>
  <Dialog class="commomDialig" v-model="dialogVisible" :title="dialogTitle">
    <el-form
      class="dialogForm"
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="130px"
    >
      <el-form-item label="文章类型:" prop="noteType">
        <el-select
          class="dialogFormItemWidth"
          v-model="formData.noteType"
          placeholder="请选择文章类型"
          clearable
        >
          <el-option
            v-for="dict in XhsNoteTypeOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="文章链接" prop="link">
        <el-input
          class="dialogFormItemWidth"
          v-model="formData.link"
          placeholder="请输入文章链接"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import * as RedBookBookApi from '@/api/redBook'
import { XhsAddParam } from '@/api/redBook'
import { XhsNoteTypeOptions } from '@/types/enumOptions'

defineOptions({ name: 'RedBookAddArticle' })

const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formData = ref({
  noteType: '',
  link: ''
})

// 链接校验
const linkValidator = (_rule, _, callback) => {
  if (!formData.value.link) {
    callback(new Error('请输入文章链接'))
  } else {
    if (/^https?:\/\//.test(formData.value.link)) {
      callback()
    } else {
      callback(new Error('请输入正确格式的文章链接'))
    }
  }
}

const formRules = reactive({
  noteType: [{ required: true, message: '请选择文章类型', trigger: 'blur' }],
  link: [{ required: true, validator: linkValidator, trigger: 'blur' }]
})

const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async () => {
  dialogVisible.value = true
  dialogTitle.value = '文章录入'
  resetForm()
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as XhsAddParam
    await RedBookBookApi.saveXhsInfo(data)
    message.success('文章录入成功')
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    noteType: '',
    link: ''
  }
  formRef.value?.resetFields()
}
</script>
