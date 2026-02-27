<template>
  <div style="border-radius: 16px; overflow: hidden">
    <el-drawer v-model="drawerVisible" :with-header="false" :wrapper-closable="true" class="drawer" size="968">
      <div>
        <div class="drawerTitle">{{ drawerTitle }}</div>
      </div>
      <div class="drawerContent">
        <el-form class="dialogForm" ref="formRef" v-loading="formLoading" :model="formData" :rules="formRules"
          label-width="100px">
          <el-form-item label="名称" prop="name">
            <el-input class="dialogFormItemWidth" v-model="formData.name" placeholder="请输入名称" />
          </el-form-item>
          <el-form-item label="平台" prop="platform">
            <el-select class="dialogFormItemWidth" v-model="formData.platform" placeholder="请选择平台" clearable>
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.LOGIN_ACCOUNT_PLATFORM, true)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>

          <el-form-item label="运行环境" prop="environment">
            <el-select class="dialogFormItemWidth" v-model="formData.environment" placeholder="请选择运行环境" clearable>
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_PROGRAM, true)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>

          <el-form-item label="登录地址" prop="loginAddress">
            <el-input class="dialogFormItemWidth" v-model="formData.loginAddress" placeholder="请输入登录地址" />
          </el-form-item>
          <el-form-item label="业务地址" prop="serviceAddress">
            <el-input class="dialogFormItemWidth" v-model="formData.serviceAddress" placeholder="请输入业务地址" />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <s-text-area class="dialogFormItemWidth" v-model="formData.remark" placeholder="请输入备注"
              :autosize="{ minRows: 3, maxRows: 4 }" />
          </el-form-item>
        </el-form>
      </div>
      <div class="drawerContent">
        <div class="drawerContent-title">
          <div class="drawerContent-title-icon"></div>
          <div>关联账号信息</div>
          <div v-if="formType !== 'view'" class="drawerContent-link" @click="linkAccountClick">
            <img class="drawerContent-link-icon" src="@/assets/imgs/rpaManage/relateAccount.png" alt="" />
            <div class="drawerContent-link-link">关联账号</div>
          </div>
        </div>
        <el-form class="dialogForm" :model="accountData" label-width="100px">
          <el-form-item v-for="(value, index) in linkList()" :key="index" :label="value.title">
            <div class="linkBg">
              <div class="linkBg-text">{{ value.value }}</div>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div class="drawerFooter" v-if="formType == 'create' || formType == 'update'">
        <el-button @click="drawerVisible = false">取 消</el-button>
        <el-button :disabled="formLoading" type="primary" @click="submitForm">
          {{ formType === 'create' ? '保 存' : '提 交' }}</el-button>
      </div>
    </el-drawer>
    <AccountLinkDialog ref="accountLinkDialogRef" @select-link-object="selectLinkObject" />
  </div>
</template>
<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
defineOptions({ name: 'PlatformLogin' })
import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'
import { getCompanyName, strTrimSpace } from '@/utils/index'
import AccountLinkDialog from './accountLinkDialog.vue'
import * as platformLoginApi from '@/api/platformLogin'

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const drawerVisible = ref(false) // 弹窗的是否展示
const drawerTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  name: undefined,
  platform: undefined,
  environment: undefined,
  loginAddress: undefined,
  serviceAddress: undefined,
  remark: undefined,
  accountId: '',
  sysStoreId: ''
})

// 关联的账号信息
const accountData = ref({
  account: '',
  password: '',
  phone: '',
  email: '',
  emailAuthCode: '',
  storeName: '',
  store: '',
  companyName: '',
  channelName: ''
})

const linkList = () => {
  return [
    {
      title: '账号',
      value: accountData.value.account
    },
    {
      title: '密码',
      value: accountData.value.password
    },
    {
      title: '手机号',
      value: accountData.value.phone
    },
    {
      title: '邮箱',
      value: accountData.value.email
    },
    {
      title: '邮箱授权码',
      value: accountData.value.emailAuthCode
    },
    {
      title: '店铺名称',
      value: accountData.value.storeName
    },
    {
      title: '店铺Code',
      value: accountData.value.store
    },
    {
      title: '公司',
      value: accountData.value.companyName
    },
    {
      title: '渠道',
      value: accountData.value.channelName
    }
  ]
}

const formRules = reactive({
  name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
  platform: [{ required: true, message: '平台不能为空', trigger: 'blur' }],
  environment: [{ required: true, message: '环境不能为空', trigger: 'blur' }],
  address: [{ required: true, message: '地址不能为空', trigger: 'blur' }]
})

const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: string) => {
  console.log('---', type, id)
  drawerVisible.value = true
  drawerTitle.value =
    type === 'create' ? '新增' : type === 'update' ? '编辑' : type === 'view' ? '查看' : ''
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      const data = await platformLoginApi.getPlatformDetail(id)
      if (data) {
        formData.value = data || {}
        accountData.value.account = data.account
        accountData.value.password = data.password
        accountData.value.phone = data.phone
        accountData.value.email = data.email
        accountData.value.emailAuthCode = data.emailAuthCode
        accountData.value.store = data.storeCode
        accountData.value.storeName = data.storeName
        accountData.value.companyName = getCompanyName(data.company || '')
        accountData.value.channelName =
          getDictLabel(DICT_TYPE.SYSTEM_PARAM_CHANNEL, data.channel) || ''
      }
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const accountLinkDialogRef = ref()
// 关联账号
const linkAccountClick = () => {
  accountLinkDialogRef.value?.open()
}

// 选择关联的对象
const selectLinkObject = (data: any) => {
  if (data) {
    formData.value.accountId = data.id || ''
    formData.value.sysStoreId = data.sysStoreId || ''
    accountData.value.account = data.account
    accountData.value.password = data.password
    accountData.value.phone = data.phone
    accountData.value.email = data.email
    accountData.value.emailAuthCode = data.emailAuthCode
    accountData.value.store = data.code
    accountData.value.storeName = data.name
    accountData.value.companyName = getCompanyName(data.company || '')
    accountData.value.channelName = getDictLabel(DICT_TYPE.SYSTEM_PARAM_CHANNEL, data.channel) || ''
  }
}

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
    data.name = strTrimSpace(data.name)
    data.loginAddress = strTrimSpace(data.loginAddress)
    data.serviceAddress = strTrimSpace(data.serviceAddress)
    data.phone = strTrimSpace(data.phone)
    data.remark = strTrimSpace(data.remark)
    if (formType.value === 'create') {
      data.id = undefined
      await platformLoginApi.savePlatform(data)
      message.success(t('common.createSuccess'))
    } else {
      await platformLoginApi.savePlatform(data)
      message.success(t('common.updateSuccess'))
    }
    drawerVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    name: undefined,
    platform: undefined,
    environment: undefined,
    loginAddress: undefined,
    serviceAddress: undefined,
    remark: undefined,
    accountId: '',
    sysStoreId: ''
  }
  accountData.value = {
    account: '',
    password: '',
    phone: '',
    email: '',
    emailAuthCode: '',
    storeName: '',
    store: '',
    companyName: '',
    channelName: ''
  }
  formRef.value?.resetFields()
}
</script>

<style lang="scss" scoped>
// 修改备注的文本框背景
:deep(.el-textarea__inner),
:deep(.el-input__wrapper),
:deep(.el-select__wrapper) {
  background-color: #f8f8f9 !important;
  box-shadow: none !important;
}

:deep(.el-drawer) {
  border-top-left-radius: 16px !important;
  border-bottom-left-radius: 16px !important;
  overflow: hidden !important;
}

:deep(.el-drawer__body) {
  background-image: url('@/assets/imgs/drawer_bg.png') !important;
  background-size: cover !important;
}

.drawerTitle {
  font-family: AlibabaPuHuiTi_2_75_SemiBold;
  font-size: 14px;
  color: #333333;
  line-height: 20px;
  font-weight: 600;
  margin: 0 0 18px 0;
}

.drawerContent {
  width: 100%;
  padding: 20px 20px 1px 0;
  background-color: #fff;
  border-radius: 8px;
  box-sizing: border-box;
  margin-bottom: 20px;

  &-title {
    margin: 0 0 18px 25px;
    display: flex;
    align-items: center;
    font-size: 14px;
  }

  .drawerContent-title-icon {
    width: 3px;
    height: 10px;
    background: #0064ff;
    margin-right: 6px;
  }

  &-link {
    margin-left: auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;

    &-icon {
      width: 14px;
      height: 12px;
      margin-right: 12px;
    }

    &-link {
      font-size: 14px;
      color: #0064ff;
      line-height: 20px;
    }
  }

  .linkBg {
    width: 100%;
    height: 32px;
    background-image: url(@/assets/imgs/common/input_disabled_cover.png);
    border-radius: 4px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    box-sizing: border-box;

    &-text {
      font-size: 14px;
      color: #333333;
      line-height: 20px;
      padding-left: 16px;
      line-height: 32px;
    }
  }
}

.drawerFooter {
  display: flex;
  justify-content: flex-end;
  margin: 20px 0;
}

.dialogFormItemWidth {
  width: 100%;
}
</style>
