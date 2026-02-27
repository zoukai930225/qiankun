<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <el-form
      class="dialogForm"
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="130px"
    >
      <el-form-item label="店铺" prop="storeCode">
        <el-select
          class="dialogFormItemWidth"
          v-model="formData.storeCode"
          placeholder="请选择店铺"
        >
          <el-option
            v-for="dict in storeList"
            :key="dict.code"
            :label="dict.name"
            :value="dict.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="三方平台" prop="platform">
        <el-select
          class="dialogFormItemWidth"
          v-model="formData.platform"
          placeholder="请选择三方平台"
          :disabled="true"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_THIRD_PLATFORM, true)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="商家名称" prop="sellerName">
        <el-input
          class="dialogFormItemWidth"
          v-model="formData.sellerName"
          placeholder="请输入商家名称"
        />
      </el-form-item>
      <el-form-item label="商家授权Token" prop="sellerAuthValue">
        <el-input
          class="dialogFormItemWidth"
          v-model="formData.sellerAuthValue"
          placeholder="请输入商家授权Token"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio v-for="dict in CommonStatusOptions" :key="dict.value" :label="dict.value">{{
            dict.label
          }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import { CommonStatusOptions } from '@/types/enumOptions'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'

import * as StoreApi from '@/api/system/store'
import * as ThirdPlatformSellerApi from '@/api/system/thirdPlatform/seller'
import { FormRules } from 'element-plus'

defineOptions({ name: 'SystemThirdPlatformForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const storeList = ref<StoreApi.StoreVO[]>([]) // 店铺列表
const formData = ref({
  id: '',
  storeCode: '',
  platform: '',
  sellerName: '',
  sellerAuthValue: '',
  status: 1
})
const formRules = reactive<FormRules>({
  storeCode: [{ required: true, message: '请选择店铺', trigger: 'blur' }],
  platform: [{ required: true, message: '请选择三方平台', trigger: 'blur' }],
  sellerName: [{ required: true, message: '商家名称不能为空', trigger: 'blur' }],
  sellerAuthValue: [{ required: true, message: '商家授权Token不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: string, platform: string) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  formData.value.platform = platform
  getStoreList()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      const data = await ThirdPlatformSellerApi.getThirdPlatformSellerConfig(id)
      if (data) {
        formData.value = data
      }
    } finally {
      formLoading.value = false
    }
  }
}

/**
 * 获取店铺列表
 */

const getStoreList = async () => {
  try {
    const data = await StoreApi.getStorePage({ page: 1, size: 99999 }).catch(() => {})
    storeList.value = data.data || []
  } finally {
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
    if (formType.value === 'create') {
      await ThirdPlatformSellerApi.createOrUpdateThirdPlatformSellerConfig(formData.value)
      message.success(t('common.createSuccess'))
    } else {
      await ThirdPlatformSellerApi.createOrUpdateThirdPlatformSellerConfig(formData.value)
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
    storeCode: '',
    platform: '',
    sellerName: '',
    sellerAuthValue: '',
    status: 1
  }
  formRef.value?.resetFields()
}
</script>
