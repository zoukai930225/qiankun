<template>
  <div class="addStore">
    <el-dialog
      class="commomDialig"
      v-model="dialogVisible"
      style="
        width: 931px;
        border-radius: 14px;
        background: linear-gradient(226deg, #f2f3ff 0%, #ffffff 39%, #ffffff 87%, #f0f8ff 100%);
      "
    >
      <template #header>
        <div class="header">
          <span class="header-title">{{ dialogTitle }}</span>
        </div>
      </template>
      <el-form
        class="dialogForm"
        ref="formRef"
        v-loading="formLoading"
        :model="formData"
        :rules="formRules"
        label-width="110px"
      >
        <!-- 标题 -->
        <div class="d_flex_between">
          <div class="drawerContent-title">
            <div class="drawerContent-title-icon"></div><div>关联账号信息</div>
          </div>
          <div style="color: #0064ff" class="cursor_pointer" @click="linkAccount">
            <img
              src="@/assets/imgs/rpaManage/relateAccount.png"
              alt=""
              class="drawerContent-link_icon"
            />
            关联账号
          </div>
        </div>

        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="登录平台名称" prop="loginPlatform">
              <div class="drawerContent-disabledInput">{{
                getDictLabel(DICT_TYPE.LOGIN_ACCOUNT_PLATFORM, formData.loginPlatform)
              }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="登录账号" prop="account">
              <div class="drawerContent-disabledInput">{{ formData.account }}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="店铺名称" prop="storeName">
              <div class="drawerContent-disabledInput">{{ formData.storeName }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="店铺编码" prop="storeCode">
              <div class="drawerContent-disabledInput">{{ formData.storeCode }}</div>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 关联节点 -->
        <div class="d_flex_between">
          <div class="drawerContent-title">
            <div class="drawerContent-title-icon"></div><div>节点信息展示</div>
          </div>
          <div style="color: #0064ff" class="cursor_pointer" @click="linkNode">
            <img
              src="@/assets/imgs/rpaManage/relateNode.png"
              alt=""
              class="drawerContent-link_icon"
            />
            关联节点
          </div>
        </div>

        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="影刀登录账户" prop="loginUserName">
              <div class="drawerContent-disabledInput">{{ formData.loginUserName }}</div>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="浏览器" prop="browser">
              <el-select
                style="width: 310px"
                v-model="formData.browser"
                placeholder="请选择"
                clearable
                @clear="clearBrowser"
              >
                <el-option
                  v-for="dict in getIntDictOptions(DICT_TYPE.YINGDAO_BROWSER, true)"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="运行环境" prop="runEnvironment">
              <el-select
                style="width: 310px"
                v-model="formData.runEnvironment"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_PROGRAM, true)"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select
                style="width: 310px"
                v-model="formData.status"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_STATUS, true)"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button :disabled="formLoading" type="primary" @click="submitForm">提 交</el-button>
      </template>
    </el-dialog>
  </div>

  <!-- 关联账号弹窗 -->
  <LinkAccountDialog
    ref="linkAccountRef"
    @select-link-object="selectLinkAccountObject"
    v-if="formData.typeId"
  />
  <!-- 关联节点弹窗 -->
  <LinkNodeDialog ref="linkNodeRef" @select-link-object="selectLinkNodeObject" />
</template>
<script lang="ts" setup>
defineOptions({ name: 'AddStore' })

import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'
import { debounce } from 'lodash-es'

import LinkAccountDialog from '../../../components/linkAccountDialog.vue'
import LinkNodeDialog from '../../../components/linkNodeDialog.vue'

import * as rpaApi from '@/api/rpaManage'
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改

const formData = ref({
  id: '',
  typeId: '', // 类型ID
  nodeId: '', // 节点ID
  platformManageId: '', // 平台管理ID
  loginPlatform: '',
  account: '',
  storeName: '',
  storeCode: '',
  loginUserName: '',
  browser: '',
  runEnvironment: '',
  status: ''
})

const clearBrowser = () => {
  formData.value.browser = ''
}
const formRules = reactive({
  runEnvironment: [{ required: true, message: '请选择运行环境', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  browser: [{ required: true, message: '请选择浏览器', trigger: 'change' }]
})

const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, typeId: string, id?: string) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  console.log('----', typeId)
  formData.value.typeId = typeId
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await rpaApi.getShopDetail({ id: id })
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
    console.log('data', formData.value)
    const data = formData.value as any
    if (formType.value === 'create') {
      data.id = undefined
      await rpaApi.addShop(data)
      message.success(t('common.createSuccess'))
    } else {
      await rpaApi.updateShop(data)
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
    typeId: '', // 类型ID
    nodeId: '', // 节点ID
    platformManageId: '', // 平台管理ID
    loginPlatform: '',
    account: '',
    storeName: '',
    storeCode: '',
    loginUserName: '',
    browser: '',
    runEnvironment: '',
    status: ''
  }
  formRef.value?.resetFields()
}

const linkAccountRef = ref()
const linkNodeRef = ref()

// 关联账号
const linkAccount = () => {
  linkAccountRef.value?.open(formData.value.typeId)
}

// 关联节点
const linkNode = () => {
  linkNodeRef.value?.open()
}

// 选择关联账号的数据
const selectLinkAccountObject = (data) => {
  console.log('关联账号的数据：', data)

  // 直接在参数中解构赋值并一次性更新formData.value
  const { platform, account, storeName, storeCode, id } = data
  Object.assign(formData.value, {
    loginPlatform: platform,
    account,
    storeName,
    storeCode,
    platformManageId: id
  })

  console.log('formData.value', formData.value)
  // platformManageId
}

// 选择关联节点的数据
const selectLinkNodeObject = (data: any) => {
  console.log('关联节点的数据：', data)
  const { id, loginUserName } = data
  Object.assign(formData.value, { nodeId: id, loginUserName })
  console.log('formData.value', formData.value)
  // nodeId
}
</script>

<style lang="scss" scoped>
// 修改文本框背景
.addStore {
  :deep(.el-input__wrapper),
  :deep(.el-select__wrapper) {
    background-color: #f8f8f9;
    box-shadow: none;
  }
}

.header {
  &-title {
    font-size: 16px;
    color: #333333;
    font-weight: bold;
    margin-bottom: 20px;
  }
}
.drawerContent {
  font-size: 14px;
  color: #666666;
  &-title {
    margin: 0 0 18px 0;
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: bold;
    font-size: 14px;
    color: #333333;
    &-icon {
      width: 3px;
      height: 10px;
      background: #0064ff;
      margin-right: 6px;
    }
  }

  &-disabledInput {
    width: 310px;
    padding: 0 16px;
    min-height: 32px;
    box-sizing: border-box;
    background-image: url(@/assets/imgs/common/input_disabled.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    word-wrap: break-word;
  }
  .disabledInput_cover {
    background-image: url(@/assets/imgs/common/input_disabled_cover.png);
    width: 100%;
  }
  .disabledInput_remark {
    background-image: url(@/assets/imgs/common/input_disabled_remark.png);
    width: 100%;
    min-height: 92px;
  }
  &-link_icon {
    vertical-align: middle;
    margin-right: 2px;
  }
}
.d_flex_between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
