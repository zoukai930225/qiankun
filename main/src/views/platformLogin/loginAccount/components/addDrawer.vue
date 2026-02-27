<template>
  <div>
    <el-drawer custom-class="addDrawer" v-model="drawerVisible" :title="dialogTitle" size="968">
      <div class="drawerContent">
        <el-form class="dialogForm" ref="formRef" v-loading="formLoading" :model="formData" :rules="formRules"
          label-width="105px">
          <el-form-item label="账号" prop="account">
            <div v-if="formType === 'view'" class="seeBg">
              <div class="seeBg-text">{{ formData.account }}</div>
            </div>
            <el-input v-else class="dialogFormItemWidth" v-model="formData.account" placeholder="请输入账号" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <div v-if="formType === 'view'" class="seeBg">
              <div class="seeBg-text">{{ formData.password }}</div>
            </div>
            <el-input v-else class="dialogFormItemWidth" v-model="formData.password" placeholder="请输入密码" />
          </el-form-item>

          <el-form-item label="手机号" prop="phone">
            <div v-if="formType === 'view'" class="seeBg">
              <div class="seeBg-text">{{ formData.phone }}</div>
            </div>
            <el-input v-else class="dialogFormItemWidth" v-model="formData.phone" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <div v-if="formType === 'view'" class="seeBg">
              <div class="seeBg-text">{{ formData.email }}</div>
            </div>
            <el-select v-else filterable :reserve-keyword="false" remote v-model="formData.email"
              class="dialogFormItemWidth" placeholder="请输入邮箱" :remote-method="emailRemoteMethod"
              @change="handleEmailChange">
              <el-option v-for="item in emaliList" :key="item.account" :label="item.account" :value="item.account" />
            </el-select>
          </el-form-item>
          <el-form-item label="邮箱授权码" prop="emailCode">
            <div class="seeBg">
              <div class="seeBg-text">{{ formData.emailAuthCode }}</div>
            </div>
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
          <div>店铺信息</div>
          <div v-if="formType !== 'view'" class="drawerContent-store" @click="linkStoreClick">
            <img class="drawerContent-store-icon" src="@/assets/imgs/rpaManage/relateStore.png" alt="" />
            <div class="drawerContent-store-link">关联店铺</div>
          </div>
        </div>
        <el-form class="dialogForm" :model="storeData" label-width="105px">
          <el-form-item label="店铺名称" prop="storeName">
            <div class="storeBg">
              <div class="storeBg-text">{{ storeData.storeName }}</div>
            </div>
          </el-form-item>
          <el-form-item label="店铺Code" prop="store">
            <div class="storeBg">
              <div class="storeBg-text">{{ storeData.store }}</div>
            </div>
          </el-form-item>

          <el-form-item label="公司" prop="company">
            <div class="storeBg">
              <div class="storeBg-text">{{ storeData.companyName }}</div>
            </div>
          </el-form-item>
          <el-form-item label="渠道" prop="channel">
            <div class="storeBg">
              <div class="storeBg-text">{{ storeData.channelName }}</div>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div class="drawerFooter" v-if="formType == 'create' || formType == 'update'">
        <el-button @click="drawerVisible = false">取 消</el-button>
        <el-button :disabled="formLoading" type="primary" @click="submitForm">
          {{ formType === 'create' ? '提交' : '提交' }}</el-button>
      </div>
    </el-drawer>
    <StoreLinkDialog ref="storeLinkDialogRef" @select-link-object="selectLinkObject" />
  </div>
</template>
<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { DICT_TYPE, getDictLabel } from '@/utils/dict'
import { getCompanyName, strTrimSpace } from '@/utils/index'
const message = useMessage() // 消息弹窗
const drawerVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
import StoreLinkDialog from './storeLinkDialog.vue'

import * as LoginAccountApi from '@/api/platformLogin/loginAccount'

const formData = ref({
  id: '',
  account: '',
  password: '',
  phone: '',
  email: '',
  emailAuthCode: '',
  remark: '',
  sysStoreId: ''
})

const storeData = ref({
  store: '',
  storeName: '',
  companyName: '',
  channelName: ''
})

const formRef = ref() // 表单 Ref

const formRules = reactive({
  account: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
  password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
})

/** 打开弹窗 */
const open = async (type?: string, id?: string) => {
  drawerVisible.value = true
  dialogTitle.value =
    type === 'create' ? '新增' : type === 'update' ? '编辑' : type === 'view' ? '查看' : ''
  formType.value = type || ''
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      const data = await LoginAccountApi.getLoginAccountDetail(id).catch(() => {
        formLoading.value = false
      })
      if (data) {
        formData.value = data
        storeData.value.store = data.code || ''
        storeData.value.storeName = data.name || ''
        storeData.value.companyName = getCompanyName(data.company || '')
        storeData.value.channelName =
          getDictLabel(DICT_TYPE.SYSTEM_PARAM_CHANNEL, data.channel) || ''
      }
    } finally {
      formLoading.value = false
    }
  }
}

const emaliList = ref([])

const emailRemoteMethod = async (query: string) => {
  if (query) {
  }
  const data = await LoginAccountApi.loginAccountGetEmail({ email: query || '' }).catch(() => { })
  emaliList.value = data || []
}

const handleEmailChange = (value: any) => {
  emaliList.value.forEach((item) => {
    if (value && item.account === value) {
      formData.value.emailAuthCode = item.password
    }
  })
}

const storeLinkDialogRef = ref()
// 关联店铺
const linkStoreClick = () => {
  storeLinkDialogRef.value?.open()
}

// 选择关联的对象
const selectLinkObject = (data: any) => {
  if (data) {
    formData.value.sysStoreId = data.id || ''
    storeData.value.store = data.code || ''
    storeData.value.storeName = data.name || ''
    storeData.value.companyName = getCompanyName(data.company || '')
    storeData.value.channelName = getDictLabel(DICT_TYPE.SYSTEM_PARAM_CHANNEL, data.channel) || ''
  }
}

const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as any
    data.account = strTrimSpace(data.account)
    data.account = strTrimSpace(data.account)
    data.password = strTrimSpace(data.password)
    data.phone = strTrimSpace(data.phone)
    data.remark = strTrimSpace(data.remark)
    if (formType.value === 'create') {
      data.id = undefined
      await LoginAccountApi.saveLoginAccount(data)
      message.success('新增成功')
    } else {
      await LoginAccountApi.updateLoginAccount(data)
      message.success('修改')
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
    id: '',
    account: '',
    password: '',
    phone: '',
    email: '',
    emailAuthCode: '',
    remark: '',
    sysStoreId: ''
  }
  storeData.value = {
    store: '',
    storeName: '',
    companyName: '',
    channelName: ''
  }
  formRef.value?.resetFields()
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
</script>

<style lang="scss" scoped>
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
  padding: 16px 20px 1px 0;
  background-color: #fff;
  border-radius: 8px;
  box-sizing: border-box;
  margin-bottom: 16px;

  &-title {
    margin: 0 0 18px 25px;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 14px;
  }

  .drawerContent-title-icon {
    width: 3px;
    height: 10px;
    background: #0064ff;
    margin-right: 6px;
  }

  &-store {
    margin-left: auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;

    &-icon {
      width: 14px;
      height: 14px;
      margin-right: 12px;
    }

    &-link {
      font-size: 14px;
      color: #0064ff;
      line-height: 20px;
    }
  }

  .storeBg {
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

  .seeBg {
    width: 100%;
    height: 32px;
    background: #f8f8f9;
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

// 修改备注的文本框背景
:deep(.el-textarea__inner),
:deep(.el-input__wrapper),
:deep(.el-select__wrapper) {
  background-color: #f8f8f9 !important;
  box-shadow: none !important;
}

:deep(.el-drawer__header) {
  margin-bottom: 0px;
}

:deep(.el-drawer__title) {
  font-size: 14px;
  color: #333333;
  line-height: 20px;
  font-weight: 500;
}

:deep(.el-drawer) {
  border-radius: 12px 0px 0px 0px;
  width: 100%;
  height: 100%;
  background: url('@/assets/imgs/common/drawer-bg.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  box-sizing: border-box;
}

:deep(.el-drawer__body) {
  width: 100%;
  height: 100%;
  background: url('@/assets/imgs/common/drawer-bg.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  box-sizing: border-box;
}

:deep(.el-input__wrapper) {
  background: transparent;
  border-radius: 4px;
  box-shadow: none;
}

:deep(.el-table .cell) {
  margin-left: 5px;
}

:deep(.el-table) {
  --el-table-row-hover-bg-color: transparent;
}
</style>
