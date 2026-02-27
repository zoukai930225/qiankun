<template>
  <Dialog class="commomDialig" v-model="dialogVisible" title="快速录入（json）">
    <el-form class="dialogForm" ref="formRef" v-loading="formLoading" :model="formData" :rules="formRules"
      label-width="60px">
      <div style="font-size: 12px; color: #999; margin-bottom: 10px">请输入JSON字段匹配规则（-前为json的字段，-后为数据库对应的字段）,多个则使用英文逗号隔开
      </div>
      <el-form-item label="规则:" prop="ruler">
        <el-input class="dialogFormItemWidth" v-model="formData.ruler" placeholder="请输入规则" style="width: 90%" />
      </el-form-item>
      <el-form-item label="JSON:" prop="json">
        <!-- 文本域 -->
        <s-text-area class="dialogFormItemWidth" v-model="formData.json" :rows="16"
          placeholder="请输入JSON数组字符串，必需以'['开头，以']'结尾" style="width: 90%" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import * as ThirdPartyFieldsApi from '@/api/system/thirdPartyFields'
import { debounce } from 'lodash-es'

defineOptions({ name: 'AddJsonForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示

// 表单
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formData = ref({
  businessId: '',
  ruler: 'name-name,code-code,description-desc', //规则
  json: ''
})

// 校验输入格式
const validateJsonFormat = () => {
  const jsonStr = formData.value.json.trim() // 去掉前后空格
  if (jsonStr.startsWith('[') && jsonStr.endsWith(']')) {
    //  "JSON字符串格式正确"
    return true
  } else {
    return false
  }
}

const formRules = reactive({
  json: [
    { required: true, message: '录入数据不能为空', trigger: 'blur' },
    {
      validator: validateJsonFormat,
      message: "JSON格式错误，必需以'['开头，以']'结尾",
      trigger: 'blur'
    }
  ],
  ruler: [{ required: true, message: '规则不能为空', trigger: 'blur' }]
})

const formRef = ref() // 表单 Ref
/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = debounce(async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as any
    await ThirdPartyFieldsApi.quickAddThirdPartyFieldsApi(data)
    message.success(t('common.createSuccess'))

    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}, 200)

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    businessId: '',
    ruler: 'name-name,code-code,description-desc', //规则
    json: ''
  }
  formRef.value?.resetFields()
}

/** 打开弹窗 */
const open = async (businessId?: string) => {
  resetForm()
  dialogVisible.value = true
  formData.value.businessId = businessId as string
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>
