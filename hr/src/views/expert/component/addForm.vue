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
      <el-form-item label="达人昵称" prop="nickName">
        <el-input
          class="dialogFormItemWidth"
          v-model="formData.nickName"
          placeholder="请输入达人昵称"
        />
      </el-form-item>
      <el-form-item label="抖音号" prop="douNo">
        <el-input
          class="dialogFormItemWidth"
          v-model="formData.douNo"
          placeholder="请输入抖音号"
          :disabled="formData.id ? true : false"
        />
      </el-form-item>
      <el-form-item label="联系方式" prop="phone">
        <el-input
          class="dialogFormItemWidth"
          v-model="formData.phone"
          placeholder="请输入联系方式"
        />
      </el-form-item>
      <el-form-item label="粉丝量" prop="fans">
        <el-input
          type="number"
          class="dialogFormItemWidth"
          v-model="formData.fans"
          placeholder="请输入粉丝量"
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
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import * as DynamicParamsApi from '@/api/system/param'

import { DynamicParamTypeVO } from '@/api/system/param'

defineOptions({ name: 'ExpertAddForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: 0,
  nickName: '',
  douNo: '',
  phone: '',
  fans: ''
})
const formRules = reactive({
  nickName: [{ required: true, message: '请输入达人昵称', trigger: 'blur' }],
  douNo: [{ required: true, message: '请输入抖音号', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入联系方式', trigger: 'blur' }],
  fans: [{ required: true, message: '请输入粉丝量', trigger: 'blur' }]
})

const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      // formData.value = await DynamicParamsApi.getDynamicParamType(id)
      formData.value = {
        id: 1,
        nickName: '达人1',
        douNo: '123123',
        phone: '135213123231',
        fans: '333'
      }
    } finally {
      formLoading.value = false
    }
  }
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
    const data = formData.value as DynamicParamTypeVO
    if (formType.value === 'create') {
      data.id = undefined
      await DynamicParamsApi.createDynamicParamType(data)
      message.success(t('common.createSuccess'))
    } else {
      await DynamicParamsApi.updateDynamicParamType(data)
      message.success(t('common.updateSuccess'))
    }
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
    id: 0,
    nickName: '',
    douNo: '',
    phone: '',
    fans: ''
  }
  formRef.value?.resetFields()
}
</script>
