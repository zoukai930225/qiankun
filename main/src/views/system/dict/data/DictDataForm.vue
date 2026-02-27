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
      <el-form-item label="企业" prop="company">
        <el-select
          class="dialogFormItemWidth"
          v-model="formData.company"
          placeholder="请选企业"
          clearable
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_DYNAMIC_COMPANY)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
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
          placeholder="请输入字典编码"
          :disabled="formData.id && formData.id != undefined ? true : false"
        />
      </el-form-item>

      <!--      <el-form-item label="排序" prop="sort">-->
      <!--        <el-input-->
      <!--          class="dialogFormItemWidth"-->
      <!--          v-model="formData.sort"-->
      <!--          placeholder="请输入排序值"-->
      <!--        />-->
      <!--      </el-form-item>-->

      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="formData.sort" :min="0" clearable controls-position="right" />
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
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { useDictStoreWithOut } from '@/store/modules/dict'
import * as DictDataApi from '@/api/system/dict/dict.data'
const dictStore = useDictStoreWithOut()

defineOptions({ name: 'SystemDictDataForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: '',
  company: '',
  type: 2, //字典类型 1-字典项 2-字典子项
  name: '',
  shortName: '',
  sort: Number(undefined),
  code: '',
  pCode: ''
})
const formRules = reactive({
  company: [{ required: true, message: '请选择企业', trigger: 'blur' }],
  name: [{ required: true, message: '字典名称不能为空', trigger: 'blur' }],
  code: [{ required: true, message: '字典编码不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: string, dictType?: string) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  if (dictType) {
    formData.value.pCode = dictType
  }
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await DictDataApi.getDictData(id)
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
    const data = formData.value as DictDataApi.DictDataVO
    if (!data.shortName) {
      data.shortName = data.name
    }
    if (formType.value === 'create') {
      data.id = undefined
      await DictDataApi.createDictData(data)
      message.success(t('common.createSuccess'))
      dictStore.setDictMap(true)
    } else {
      await DictDataApi.updateDictData(data)
      message.success(t('common.updateSuccess'))
      dictStore.setDictMap(true)
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
    company: '',
    type: 2, //字典类型 1-字典项 2-字典子项
    name: '',
    shortName: '',
    sort: Number(undefined),
    code: '',
    pCode: ''
  }
  formRef.value?.resetFields()
}
</script>
