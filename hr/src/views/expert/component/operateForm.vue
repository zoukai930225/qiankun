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
      <el-form-item label="操作类型" prop="type">
        <el-select
          class="dialogFormItemWidth"
          v-model="formData.type"
          placeholder="请选操作类型"
          clearable
        >
          <el-option
            v-for="dict in typeOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="orderNoVisible" label="订单号" prop="orderNo">
        <el-input
          class="dialogFormItemWidth"
          v-model="formData.orderNo"
          placeholder="请输入订单号"
        />
      </el-form-item>
      <el-form-item v-if="imgsVisible" label="图片上传" prop="imgs">
        <UploadImg v-model="formData.imgs" :limit="5">
          <template #tip></template>
        </UploadImg>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
// import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import * as DynamicParamsApi from '@/api/system/param'

import { DynamicParamTypeVO } from '@/api/system/param'

defineOptions({ name: 'ExpertOperateForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const currentNode = ref()
const formData = ref({
  id: 0,
  type: 0,
  orderNo: '',
  imgs: ''
})

/** 操作类型枚举 */
const typeOptions = computed(() => {
  if (currentNode.value === 1) {
    // 空闲 -> 沟通
    return [
      {
        value: 2,
        label: '沟通'
      }
    ]
  } else if (currentNode.value === 2) {
    // 沟通 -> 寄样
    return [
      {
        value: 3,
        label: '寄样'
      }
    ]
  } else if (currentNode.value === 3 || currentNode.value === 4) {
    // 寄样 -> 直播 播 -> 直播
    return [
      {
        value: 4,
        label: '直播'
      }
    ]
  }
})

/** 订单号是否显示 */
const orderNoVisible = computed(() => {
  if (formData.value.type && formData.value.type === 3) {
    return true
  }
  return false
})

/** 图片上传是否显示 */
const imgsVisible = computed(() => {
  if (formData.value.type && formData.value.type !== 3) {
    return true
  }
  return false
})

const formRules = reactive({
  type: [{ required: true, message: '请输选择操作类型', trigger: 'blur' }],
  orderNo: [{ required: true, message: '请输入订单号', trigger: 'blur' }]
})

const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (id?: number, node?: number) => {
  dialogVisible.value = true
  dialogTitle.value = '操作达人'
  currentNode.value = node
  let operateType = node + 1
  if (node === 4) {
    operateType = 4
  }
  resetForm()
  // 修改时，设置数据
  formData.value = {
    id: id,
    type: operateType,
    orderNo: '',
    imgs: ''
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
    await DynamicParamsApi.updateDynamicParamType(data)
    message.success(t('common.updateSuccess'))
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
    type: '',
    orderNo: '',
    imgs: ''
  }
  formRef.value?.resetFields()
}
</script>
