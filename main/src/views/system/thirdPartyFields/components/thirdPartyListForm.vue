<template>
  <Dialog
    class="commomDialig"
    v-model="dialogVisible"
    :title="dialogTitle"
    :destroy-on-close="true"
  >
    <el-form
      class="dialogForm"
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="101px"
    >
      <el-form-item label="渠道" prop="channel">
        <el-select
          class="dialogFormItemWidth"
          v-model="formData.channel"
          placeholder="请选择渠道"
          clearable
        >
          <el-option
            v-for="dict in filteredDictOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="来源" prop="source">
        <el-input class="dialogFormItemWidth" v-model="formData.source" placeholder="请输入来源" />
      </el-form-item>
      <el-form-item label="模块" prop="module">
        <el-input
          class="dialogFormItemWidth"
          v-model="formData.module"
          placeholder="请输入模块内容"
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
defineOptions({ name: 'ThirdPartyListForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
import * as ThirdPartyFieldsApi from '@/api/system/thirdPartyFields'
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { debounce } from 'lodash-es'

const formData = ref({
  id: '',
  channel: '',
  source: '',
  module: ''
})
const formRules = reactive({
  channel: [{ required: true, message: '请选择渠道', trigger: 'blur' }],
  source: [{ required: true, message: '请输入来源', trigger: 'blur' }],
  module: [{ required: true, message: '请输入模块内容', trigger: 'blur' }]
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
      formData.value = await ThirdPartyFieldsApi.getThirdPartyFieldsbyId(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

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
    if (formType.value === 'create') {
      data.id = undefined
      await ThirdPartyFieldsApi.saveThirdPartyFields(data)
      message.success(t('common.createSuccess'))
    } else {
      await ThirdPartyFieldsApi.saveThirdPartyFields(data)
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
    channel: '',
    source: '',
    module: ''
  }
  formRef.value?.resetFields()
}

// 执行环境--获取字典数据并过滤掉 '全部' 选项
const getFilteredDictOptions = (dictType) => {
  return getIntDictOptions(dictType).filter((dict) => dict.label !== '全部')
}

// 渠道
const filteredDictOptions = computed(() => getFilteredDictOptions(DICT_TYPE.SYSTEM_PARAM_CHANNEL))
</script>
<style lang="scss" scoped>
// 修改备注的文本框背景
:deep(.el-textarea__inner) {
  background-color: #f1f1f1 !important;
}
</style>
