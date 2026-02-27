<template>
  <el-dialog class="configFormDialog" v-model="dialogVisible" :title="dialogTitle" :destroy-on-close="true" style="
      width: 490px;
      border-radius: 14px;
      background: linear-gradient(226deg, #f2f3ff 0%, #ffffff 39%, #ffffff 87%, #f0f8ff 100%);
    ">
    <el-form class="dialogForm" ref="formRef" v-loading="formLoading" :model="formData" :rules="formRules"
      label-width="110px">
      <el-form-item label="参数名称" prop="paramName">
        <el-input class="dialogFormItemWidth" v-model="formData.paramName" placeholder="请输入参数名称" :disabled="isEdit" />
      </el-form-item>
      <el-form-item label="参数编码" prop="paramKey">
        <el-input class="dialogFormItemWidth" v-model="formData.paramKey" placeholder="请输入参数编码" :disabled="isEdit" />
      </el-form-item>
      <el-form-item label="参数值" prop="paramValue">
        <el-input class="dialogFormItemWidth" v-model="formData.paramValue" placeholder="请输入参数值" />
      </el-form-item>

      <el-form-item label="运行环境" prop="paramsEnvironment" style="width: 300px">
        <el-select class="dialogFormItemWidth" v-model="formData.paramsEnvironment" placeholder="请选择" clearable
          :disabled="isEdit">
          <el-option v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_PROGRAM, true)" :key="dict.value"
            :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否公共参数" prop="isCommonParam" style="width: 300px">
        <el-select class="dialogFormItemWidth" v-model="formData.isCommonParam" placeholder="请选择" clearable
          :disabled="isEdit || isCurrentCustom">
          <el-option v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_WHETHER, true)" :key="dict.value"
            :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="备注说明" prop="explanation">
        <s-text-area class="dialogFormItemWidth" v-model="formData.explanation" placeholder="请输入备注"
          :autosize="{ minRows: 6, maxRows: 8 }" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { propTypes } from '@/utils/propTypes'
import * as rpaApi from '@/api/rpaManage'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
defineOptions({ name: 'ConfigForm' })

const props = defineProps({
  editType: propTypes.string.def('other') //oteher self
})

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  paramsEnvironment: '',
  isCommonParam: '',
  paramName: '',
  paramKey: '',
  paramValue: '',
  explanation: '',
  typeId: undefined, //应用id
  store: 'ALL',
  isCustomize: undefined //是否自定义参数
})
const formRules = reactive({
  paramName: [
    { required: true, message: '参数名称不能为空', trigger: 'blur', whitespace: true },
    { max: 50, message: '参数名称不超过50字', trigger: 'blur' }
  ],
  paramKey: [
    { required: true, message: '参数编码不能为空', trigger: 'blur', whitespace: true },
    { max: 200, message: '参数编码不超过200字', trigger: 'blur' }
  ],
  paramValue: [
    { required: true, message: '参数值不能为空', trigger: 'blur', whitespace: true },
    { max: 1000, message: '参数值不超过1000字', trigger: 'blur' }
  ],
  paramsEnvironment: [{ required: true, message: '运行环境不能为空', trigger: 'blur' }],
  isCommonParam: [{ required: true, message: '是否公共参数不能为空', trigger: 'blur' }]
})

const formRef = ref() // 表单 Ref
const isEdit = ref(false) //控制输入框是否禁用
const isCurrentCustom = ref(false) //是否自定义参数

/** 打开弹窗 */
const open = async (
  type: string,
  id?: string,
  isCustom: boolean = false,
  typeId?: string,
  storeData?: any
) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  isEdit.value = !!id // 如果 id 存在，则设置 isEdit 为 true
  isCurrentCustom.value = isCustom //如果是true，则表示是私有参数，禁止修改isCommonParam，默认是false

  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await rpaApi.getConfigDetail(id)
    } finally {
      formLoading.value = false
    }
  }
  if (isCurrentCustom.value) {
    formData.value.isCommonParam = '0'
  }
  formData.value.typeId = typeId
  if (storeData) {
    console.log('storeData', storeData)
    formData.value.isCustomize = storeData.isCustomize //是否自定义参数
    formData.value.store = storeData.storeCode //店铺编码
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
    const data = formData.value as any

    if (formType.value === 'create') {
      data.id = undefined
      await rpaApi.addConfig(data)
      message.success(t('common.createSuccess'))
    } else {
      console.log('请求参数', data)
      if (data.isCustomize === '是') {
        data.isCustomize = '否'
      } else if (data.isCustomize === '否') {
        data.isCustomize = '是'
      }
      if (props.editType === 'self') {
        await rpaApi.updateConfig1(data)
      } else {
        await rpaApi.updateConfig(data)
      }
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
    paramsEnvironment: '',
    isCommonParam: '',
    paramName: '',
    paramKey: '',
    paramValue: '',
    explanation: '',
    typeId: undefined, //应用id
    store: 'ALL',
    isCustomize: undefined //是否自定义参数
  }
  formRef.value?.resetFields()
}

// 执行环境--获取字典数据并过滤掉 '全部' 选项
const getFilteredDictOptions = (dictType) => {
  return getIntDictOptions(dictType).filter((dict) => dict.label !== '全部')
}
// 执行环境--正式环境/测试环境
const filteredDictOptions = computed(() => getFilteredDictOptions(DICT_TYPE.SYSTEM_PARAM_PROGRAM))
// 是否公共参数--是/否
const isPublicDictOptions = computed(() => getFilteredDictOptions(DICT_TYPE.SYSTEM_PARAM_WHETHER))
</script>

<style lang="scss" scoped>
// 修改备注的文本框背景
:deep(.el-textarea__inner) {
  background-color: #f1f1f1 !important;
}

.configFormDialog {
  border-radius: 14px;
}
</style>
