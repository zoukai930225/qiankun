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
      <el-form-item label="字典名称" prop="name">
        <el-input
          class="dialogFormItemWidth"
          v-model="formData.name"
          placeholder="请输入字典名称"
        />
      </el-form-item>
      <el-form-item label="字典编码" prop="code">
        <el-input
          class="dialogFormItemWidth"
          v-model="formData.code"
          :disabled="formData.id && formData.id != undefined ? true : false"
          placeholder="请输入字典编码"
        />
      </el-form-item>
      <el-form-item label="简称" prop="shortName">
        <el-input
          class="dialogFormItemWidth"
          v-model="formData.shortName"
          placeholder="请输入简称"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import * as DictTypeApi from '@/api/system/dict/dict.type'

defineOptions({ name: 'SystemDictTypeForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: '',
  type: 1, //字典类型 1-字典项 2-字典子项
  name: '',
  shortName: '',
  code: ''
})
const formRules = reactive({
  name: [{ required: true, message: '字典名称不能为空', trigger: 'blur' }],
  code: [{ required: true, message: '字典编码不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: string) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await DictTypeApi.getDictType(id)
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
    const data = formData.value as DictTypeApi.DictTypeVO
    if (!data.shortName) {
      data.shortName = data.name
    }
    if (formType.value === 'create') {
      data.id = undefined
      await DictTypeApi.createDictType(data)
      message.success(t('common.createSuccess'))
    } else {
      await DictTypeApi.updateDictType(data)
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
    id: '',
    type: 1, //字典类型 1-字典项 2-字典子项
    name: '',
    shortName: '',
    code: ''
  }
  formRef.value?.resetFields()
}
</script>
