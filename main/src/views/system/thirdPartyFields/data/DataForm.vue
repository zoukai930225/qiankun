<template>
  <Dialog class="commomDialig" v-model="dialogVisible" :title="dialogTitle">
    <el-form class="dialogForm" ref="formRef" v-loading="formLoading" :model="formData" :rules="formRules"
      label-width="130px">
      <el-form-item label="字段名" prop="fieldName">
        <el-input class="dialogFormItemWidth" v-model="formData.fieldName" placeholder="请输入字段名称" />
      </el-form-item>

      <el-form-item label="字段编码" prop="fieldCode">
        <el-input class="dialogFormItemWidth" v-model="formData.fieldCode" placeholder="请输入字段编码" />
      </el-form-item>
      <el-form-item label="字段描述" prop="fieldDesc">
        <s-text-area class="dialogFormItemWidth" v-model="formData.fieldDesc" placeholder="请输入字段描述" />
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
defineOptions({ name: 'SystemDictDataForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改

const formData = ref({
  id: '',
  businessId: '',
  fieldName: '',
  fieldCode: '',
  fieldDesc: ''
})

const formRules = reactive({
  fieldName: [{ required: true, message: '字段名不能为空', trigger: 'blur' }],
  fieldCode: [{ required: true, message: '字段编码不能为空', trigger: 'blur' }]
})

const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: string, businessId?: string) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  formData.value.businessId = businessId as string
  // console.log('businessId', formData.value.businessId)
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await ThirdPartyFieldsApi.getThirdPartyFieldsApiById(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = debounce(async () => {
  // console.log('===',formData.value);
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
    // console.log('data', formData.value)
    const data = formData.value as any
    if (formType.value === 'create') {
      data.id = undefined
      await ThirdPartyFieldsApi.saveThirdPartyFieldsApi(data)
      message.success(t('common.createSuccess'))
    } else {
      await ThirdPartyFieldsApi.saveThirdPartyFieldsApi(data)
      message.success(t('common.updateSuccess'))
    }
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
    id: '',
    businessId: '',
    fieldName: '',
    fieldCode: '',
    fieldDesc: ''
  }
  formRef.value?.resetFields()
}
</script>
