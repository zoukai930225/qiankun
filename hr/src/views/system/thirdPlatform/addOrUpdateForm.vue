<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <el-form class="dialogForm" ref="formRef" v-loading="formLoading" :model="formData" :rules="formRules"
      label-width="130px">
      <el-form-item label="三方平台" prop="platform">
        <el-select class="dialogFormItemWidth" v-model="formData.platform" placeholder="请选择三方平台">
          <el-option v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_THIRD_PLATFORM, true)" :key="dict.value"
            :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="!['wdt'].includes(formData.platform)" label="应用ID" prop="appId">
        <el-input class="dialogFormItemWidth" v-model="formData.appId" placeholder="请输入应用ID" />
      </el-form-item>
      <el-form-item v-if="formData.platform === 'wdt'" label="卖家账号" prop="sid">
        <el-input class="dialogFormItemWidth" v-model="formData.sid" placeholder="请输入卖家账号" />
      </el-form-item>
      <el-form-item v-if="['wdt'].includes(formData.platform)" label="接口账号" prop="appKey">
        <el-input class="dialogFormItemWidth" v-model="formData.appKey" placeholder="请输入接口账号" />
      </el-form-item>
      <el-form-item label="应用秘钥" prop="appSecret">
        <el-input class="dialogFormItemWidth" v-model="formData.appSecret" placeholder="请输入应用秘钥" />
      </el-form-item>
      <el-form-item label="服务请求地址" prop="serverUrl">
        <el-input class="dialogFormItemWidth" v-model="formData.serverUrl" placeholder="请输入服务请求地址" />
      </el-form-item>
      <el-form-item label="授权回调地址" prop="redirectUri">
        <el-input class="dialogFormItemWidth" v-model="formData.redirectUri" placeholder="请输入授权回调地址" />
      </el-form-item>
      <el-form-item label="授权码" prop="authCode">
        <el-input class="dialogFormItemWidth" v-model="formData.authCode" placeholder="请输入授权码" />
      </el-form-item>

      <el-form-item v-if="formData.platform === 'alipay'" label="应用私钥" prop="privateKey">
        <s-text-area class="dialogFormItemWidth" v-model="formData.privateKey" placeholder="请输入支付宝应用私钥" :rows="3" />
      </el-form-item>
      <el-form-item v-if="formData.platform === 'alipay'" label="支付宝私钥" prop="alipayPublicKey">
        <s-text-area class="dialogFormItemWidth" v-model="formData.alipayPublicKey" placeholder="请输入支付宝私钥" :rows="3" />
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
import STextArea from "@/components/common/input/s-textarea.vue";
import { CommonStatusOptions } from '@/types/enumOptions'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'

import * as ThirdPlatformApi from '@/api/system/thirdPlatform'
import { FormRules } from 'element-plus'

defineOptions({ name: 'SystemThirdPlatformForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: '',
  platform: '',
  appId: '',
  appSecret: '',
  serverUrl: '',
  redirectUri: '',
  authCode: '',
  privateKey: '',
  alipayPublicKey: '',
  appKey: '', // wdt 接口账号
  sid: '', //wdt 卖家账号
  status: 1
})
const formRules = reactive<FormRules>({
  platform: [{ required: true, message: '请选择三方平台', trigger: 'blur' }],
  appId: [{ required: true, message: '应用ID不能为空', trigger: 'blur' }],
  privateKey: [{ required: true, message: '应用私钥不能为空', trigger: 'blur' }],
  alipayPublicKey: [{ required: true, message: '支付宝公钥不能为空', trigger: 'blur' }],
  sid: [{ required: true, message: '卖家账号不能为空', trigger: 'blur' }],
  appKey: [{ required: true, message: '接口账号不能为空', trigger: 'blur' }]
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
      const data = await ThirdPlatformApi.getThirdPlatformConfig(id)
      if (data) {
        handleConfigDetail(data)
      }
    } finally {
      formLoading.value = false
    }
  }
}

/**
 * 处理配置详情
 */
const handleConfigDetail = (data: any) => {
  formData.value = data
  if (formData.value.platform === 'alipay') {
    //支付宝
    const configInfo = formData.value['configInfo'] || {}
    formData.value.privateKey = configInfo['privateKey'] || ''
    formData.value.alipayPublicKey = configInfo['alipayPublicKey'] || ''
  } else if (formData.value.platform === 'wdt') {
    //旺店通
    const configInfo = formData.value['configInfo'] || {}
    formData.value.sid = configInfo['sid'] || ''
    formData.value.appKey = configInfo['appKey'] || ''
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
      await ThirdPlatformApi.createOrUpdateThirdPlatformConfig(getAddOrSaveData())
      message.success(t('common.createSuccess'))
    } else {
      await ThirdPlatformApi.createOrUpdateThirdPlatformConfig(getAddOrSaveData())
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/**
 * 获取新增和编辑要提交的字段
 */
const getAddOrSaveData = () => {
  const data = {
    platform: formData.value.platform,
    appSecret: formData.value.appSecret,
    serverUrl: formData.value.serverUrl,
    redirectUri: formData.value.redirectUri,
    authCode: formData.value.authCode,
    status: formData.value.status
  }
  if (formData.value.id) {
    data['id'] = formData.value.id
  }
  if (formData.value.platform === 'alipay') {
    // 支付宝
    data['appId'] = formData.value.appId
    const config = {
      privateKey: formData.value.privateKey,
      alipayPublicKey: formData.value.alipayPublicKey
    }
    data['config'] = JSON.stringify(config)
  } else if (formData.value.platform === 'wdt') {
    // 旺店通
    const config = {
      sid: formData.value.sid,
      appKey: formData.value.appKey
    }
    data['config'] = JSON.stringify(config)
  }
  return data
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: '',
    platform: '',
    appId: '',
    appSecret: '',
    serverUrl: '',
    redirectUri: '',
    authCode: '',
    privateKey: '',
    alipayPublicKey: '',
    appKey: '', // wdt 接口账号
    sid: '', //wdt 卖家账号
    status: 1
  }
  formRef.value?.resetFields()
}
</script>
