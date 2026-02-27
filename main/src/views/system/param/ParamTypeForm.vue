<template>
  <Dialog class="commomDialig" v-model="dialogVisible" :title="dialogTitle">
    <el-form class="dialogForm" ref="formRef" v-loading="formLoading" :model="formData" :rules="formRules"
      label-width="130px">
      <el-form-item label="类型" prop="typeKey">
        <el-select class="dialogFormItemWidth" v-model="formData.typeKey" placeholder="请选择类型" clearable>
          <el-option v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_DYNAMIC_PARAMS)" :key="dict.value"
            :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="值" prop="typeValue">
        <el-input class="dialogFormItemWidth" v-model="formData.typeValue" placeholder="请输入值" />
      </el-form-item>
      <el-form-item label="店铺" prop="storeId">
        <el-select class="dialogFormItemWidth" v-model="formData.storeId" placeholder="请选择店铺" clearable>
          <el-option v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_STORE)" :key="dict.value"
            :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item class="dialogFormItemWidth" label="生效日期" prop="dateRange">
        <div class="dialogFormItemWidth">
          <el-date-picker v-model="formData.dateRange" value-format="YYYY-MM-DD" style="width: 308px" type="daterange"
            range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
            :disabled="formData.id && formData.id != undefined ? true : false" />
        </div>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <s-text-area class="dialogFormItemWidth" v-model="formData.description" placeholder="请输入描述" :rows="3" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import * as DynamicParamsApi from '@/api/system/param'

import { DynamicParamTypeVO } from '@/api/system/param'

defineOptions({ name: 'SystemDictTypeForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: '',
  typeKey: '',
  typeValue: '',
  storeId: '',
  description: '',
  startDate: '',
  endDate: '',
  dateRange: ref<String[]>([])
})
const dateRangeValid = (_rule, _, callback) => {
  if (!formData.value.dateRange || formData.value.dateRange.length === 0) {
    callback()
    callback(new Error('生效日期不能为空'))
  } else {
    callback()
  }
}
const formRules = reactive({
  typeKey: [{ required: true, message: '请选择类型', trigger: 'blur' }],
  typeValue: [{ required: true, message: '值不能为空', trigger: 'blur' }],
  storeId: [{ required: true, message: '请选择店铺', trigger: 'blur' }],
  dateRange: [{ required: true, validator: dateRangeValid, trigger: 'blur' }]
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
      formData.value = await DynamicParamsApi.getDynamicParamType(id)
      if (formData.value.startDate && formData.value.endDate) {
        formData.value.dateRange = [formData.value.startDate, formData.value.endDate]
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
    data.typeName = getDynamicParamsDictName(data.typeKey)
    if (data && data.dateRange && data.dateRange.length > 1) {
      data['startDate'] = `${data.dateRange[0]}`
      data['endDate'] = `${data.dateRange[1]} `
    }
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

// 获取类型对应的名称
const getDynamicParamsDictName = (code) => {
  let arr = getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_DYNAMIC_PARAMS).filter((v) => v.value === code)
  if (arr && arr.length > 0) {
    return arr[0].label || ''
  }
  return ''
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: '',
    typeKey: '',
    typeValue: '',
    storeId: '',
    description: '',
    startDate: '',
    endDate: '',
    dateRange: []
  }
  formRef.value?.resetFields()
}
</script>
