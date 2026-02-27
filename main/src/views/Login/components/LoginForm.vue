<template>
  <el-form v-show="getShow" ref="formLogin" :model="loginData.loginForm" :rules="LoginRules" class="login-form"
    label-position="top" label-width="120px" size="large">
    <el-row style="margin-right: -10px; margin-left: -10px">
      <el-col :span="24" style="padding-right: 10px; padding-left: 10px">
        <el-form-item>
          <LoginFormTitle style="width: 100%" />
        </el-form-item>
      </el-col>
      <el-col :span="24" style="padding-right: 10px; padding-left: 10px" />
      <el-col :span="24" style="padding-right: 10px; padding-left: 10px; padding-bottom: 5px">
        <el-form-item prop="userName">
          <el-input id="puppeteer-login-userName" class="loginInput" v-model="loginData.loginForm.userName"
            :placeholder="t('login.usernamePlaceholder')" :clearable="true" @keyup.enter="getCode()">
            <template #prefix>
              <img style="width: 26px; height: 26px" src="@/assets/imgs/login_account.png" />
              <div class="loginLine"></div>
            </template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24" style="padding-right: 10px; padding-left: 10px">
        <el-form-item prop="password">
          <el-input id="puppeteer-login-password" class="loginInput" v-model="loginData.loginForm.password"
            :placeholder="t('login.passwordPlaceholder')" show-password type="password" @keyup.enter="getCode()">
            <template #prefix>
              <img style="width: 26px; height: 26px" src="@/assets/imgs/login_password.png" />
              <div class="loginLine"></div>
            </template></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24" class="rememberMe"
        style="padding-right: 10px; padding-left: 424px; margin-top: -10px; margin-bottom: -20px">
        <el-form-item>
          <el-row justify="space-between" style="width: 100%">
            <el-col :span="6">
              <el-checkbox v-model="loginData.loginForm.rememberMe">
                {{ t('login.remember') }}
              </el-checkbox>
            </el-col>
          </el-row>
        </el-form-item>
      </el-col>

      <el-col :span="24" style="padding-right: 10px; padding-left: 10px">
        <el-form-item>
          <XButton id="puppeteer-login-loginBtn" :loading="loginLoading" :title="t('login.login')" class="loginBtn"
            type="primary" style="margin-top: 10px; background: #126efe" @click="getCode()" />
          <div class="feishuLoginSection">
            <div class="feishuLoginSection-lineLeft"> </div>
            <div class="feishuLoginSection-title">
              <img src="@/assets/imgs/login/feishulogin.png" alt="" class="feishu-icon" />
              <span class="title">使用飞书登录</span>
            </div>
            <div class="feishuLoginSection-lineRight"> </div>
          </div>
          <!-- 新增 -->
          <div class="feishu-content">
            <!-- 杭州 -->
            <el-popover placement="bottom" trigger="hover" width="104" :show-arrow="false" :popper-style="popoverStyle">
              <template #reference>
                <div class="feishu-item">
                  <div class="item-icon hangzhou-icon"></div>
                  <!-- <img src="@/assets/imgs/login/hangzhou-normal.png" alt="" class="item-icon" /> -->
                  <!-- <img src="@/assets/imgs/login/hangzhou-activity.png" alt="" class="item-icon" /> -->
                  <span class="title">杭州</span>
                </div>
              </template>
              <div class="feishu-item-pop">
                <div class="feishu-item-pop-item" v-for="(item, index) in hangzhouInfoList" :key="index"
                  @click="feishuLoginByInfo(item)">
                  <div class="feishu-item-pop-title">{{ item.name }}</div>
                </div>
              </div>
            </el-popover>
            <!-- 新乡 -->
            <el-popover placement="bottom" trigger="hover" width="104" :show-arrow="false" :popper-style="popoverStyle">
              <template #reference>
                <div class="feishu-item">
                  <div class="item-icon xinxinag-icon"></div>
                  <!-- <img src="@/assets/imgs/login/xinxiang-normal.png" alt="" class="item-icon" /> -->
                  <!-- <img src="@/assets/imgs/login/xinxiang-activity.png" alt="" class="item-icon" /> -->
                  <span class="title">新乡</span>
                </div>
              </template>
              <div class="feishu-item-pop">
                <div class="feishu-item-pop-item" v-for="(item, index) in xinxiangInfoList" :key="index"
                  @click="feishuLoginByInfo(item)">
                  <div class="feishu-item-pop-title">{{ item.name }}</div>
                </div>
              </div>
            </el-popover>
            <el-popover placement="bottom" trigger="hover" width="104" :show-arrow="false" :popper-style="popoverStyle">
              <template #reference>
                <div class="feishu-item">
                  <div class="item-icon yiwu-icon"></div>
                  <!-- <img src="@/assets/imgs/login/yiwu-normal.png" alt="" class="item-icon" /> -->
                  <!-- <img src="@/assets/imgs/login/yiwu-activity.png" alt="" class="item-icon" /> -->
                  <span class="title">义乌</span>
                </div>
              </template>
              <div class="feishu-item-pop">
                <div class="feishu-item-pop-item" v-for="(item, index) in yiwuInfoList" :key="index"
                  @click="feishuLoginByInfo(item)">
                  <div class="feishu-item-pop-title">{{ item.name }}</div>
                </div>
              </div>
            </el-popover>
            <!-- wuhu -->
            <el-popover placement="bottom" trigger="hover" width="104" :show-arrow="false" :popper-style="popoverStyle">
              <template #reference>
                <div class="feishu-item">
                  <div class="item-icon wuhu-icon"></div>
                  <!-- <img src="@/assets/imgs/login/wuhu-normal.png" alt="" class="item-icon" /> -->
                  <!-- <img src="@/assets/imgs/login/wuhu-activity.png" alt="" class="item-icon" /> -->
                  <span class="title">芜湖</span>
                </div>
              </template>
              <div class="feishu-item-pop">
                <div class="feishu-item-pop-item" v-for="(item, index) in wuhuInfoList" :key="index"
                  @click="feishuLoginByInfo(item)">
                  <div class="feishu-item-pop-title">{{ item.name }}</div>
                </div>
              </div>
            </el-popover>
          </div>

          <!-- <el-popover
            placement="bottom"
            :width="442"
            trigger="hover"
            :show-arrow="false"
            :popper-style="{ borderRadius: '2px', padding: '14px 22px', cursor: 'pointer' }"
          >
            <template #reference>
              <div class="feishuLogin">
                <img src="@/assets/imgs/login_feishu.png" alt="" />
              </div>
            </template>
            <div class="feishuLoginSection-content">
              <div
                class="feishuLoginSection-content-item"
                v-for="(item, index) in feishuLoginInfo"
                :key="index"
                @click="feishuLoginByInfo(item)"
              >
                <div class="feishuLoginSection-content-item-icon">
                  <img :src="item.iconUrl" alt="" />
                </div>

                <div class="feishuLoginSection-content-item-title">{{ item.name }}</div>
              </div>
            </div>
          </el-popover> -->
        </el-form-item>
      </el-col>
      <!-- <Verify
        ref="verify"
        :captchaType="captchaType"
        :imgSize="{ width: '400px', height: '200px' }"
        mode="pop"
        @success="handleLogin"
      /> -->
    </el-row>
  </el-form>

  <ChangePassword ref="changePasswordRef" />
</template>
<script lang="ts" setup>
import { ElLoading } from 'element-plus'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import LoginFormTitle from './LoginFormTitle.vue'

import { useIcon } from '@/hooks/web/useIcon'

import * as LoginApi from '@/api/login'
import { TokenType } from '@/api/login/types'
import { CACHE_KEY, useCache } from '@/hooks/web/useCache'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { usePermissionStore } from '@/store/modules/permission'
import * as authUtil from '@/utils/auth'
import { ref, StyleValue } from 'vue'
import { LoginStateEnum, useFormValid, useLoginState } from './useLogin'
import { userMessageStore } from '@/store/modules/userMessage'
import { debounce } from 'lodash-es'

import ChangePassword from './changePassword.vue'
const changePasswordRef = ref()

const { wsCache } = useCache()

defineOptions({ name: 'LoginForm' })

const { t } = useI18n()
const message = useMessage()
const iconAvatar = useIcon({ icon: 'ep:avatar' })
const iconLock = useIcon({ icon: 'ep:lock' })
const formLogin = ref()
const { validForm } = useFormValid(formLogin)
const { getLoginState } = useLoginState()
const { currentRoute, push } = useRouter()
const permissionStore = usePermissionStore()
const dictStore = useDictStoreWithOut()
const redirect = ref<string>('')
const loginLoading = ref(false)

const useUserMessageStore = userMessageStore()
const popoverStyle: StyleValue = {
  borderRadius: '2px',
  cursor: 'pointer',
  'min-width': '85px !important',
  padding: '4px 0',
  'text-align': 'center'
}
// const verify = ref()
// const captchaType = ref('blockPuzzle') // blockPuzzle 滑块 clickWord 点击文字

const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN)

const LoginRules = {
  userName: [required],
  password: [required]
}
const loginData = reactive({
  isShowPassword: false,
  captchaEnable: import.meta.env.VITE_APP_CAPTCHA_ENABLE,
  tenantEnable: import.meta.env.VITE_APP_TENANT_ENABLE,
  loginForm: {
    userName: '',
    password: '',
    captchaVerification: '',
    rememberMe: true // 默认记录我。如果不需要，可手动修改
  }
})

// 获取验证码
const getCode = debounce(async () => {
  if (loginData.loginForm.userName && loginData.loginForm.password) {
    await handleLogin()
  }
}, 500);
// async () => {

//获取当前消息树
// await useUserMessageStore.getMessageCount()
// // 情况一，未开启：则直接登录
// if (loginData.captchaEnable === 'false') {
//   await handleLogin({})
// } else {
//   // 情况二，已开启：则展示验证码；只有完成验证码的情况，才进行登录
//   // 弹出验证码
//   verify.value.show()
// }
// }

// 记住我
const getLoginFormCache = () => {
  const loginForm = authUtil.getLoginForm()
  if (loginForm) {
    loginData.loginForm = {
      ...loginData.loginForm,
      userName: loginForm.userName ? loginForm.userName : loginData.loginForm.userName,
      password: loginForm.password ? loginForm.password : loginData.loginForm.password,
      rememberMe: loginForm.rememberMe
    }
  }
}
const loading = ref() // ElLoading.service 返回的实例
// 登录
const handleLogin = async () => {
  loginLoading.value = true
  try {
    const data = await validForm()
    if (!data) {
      return
    }
    const loginInfo = await LoginApi.login(loginData.loginForm)
    if (!loginInfo) {
      return
    }
    console.log(loginInfo?.firstLoginFlag)
    if (loginInfo?.firstLoginFlag) {
      console.log(loginInfo)
      wsCache.set('ACCESS_TOKEN', loginInfo.token)
      changePasswordRef.value.open('firstLogin', loginInfo)
      return
    }
    handleLoginInfo(loginInfo)
  } finally {
    loginLoading.value = false
    loading?.value?.close()
  }
}

// 处理登录信息
const handleLoginInfo = (loginInfo) => {
  const res = {
    userId: loginInfo.userNo || '',
    company: loginInfo.company || '',
    isAdmin: loginInfo.isAdmin || 0,
    accessToken: loginInfo.token || '',
    refreshToken: loginInfo.token || '',
    expiresTime: 0
  } as TokenType
  const userInfo = {
    user: {
      id: loginInfo.userNo || '',
      company: loginInfo.company || '',
      isAdmin: loginInfo.isAdmin || 0,
      nickname: loginInfo.userName || '',
      avatar: ''
    },
    roles: [],
    permissions: [],
    menus: []
  }
  wsCache.set(CACHE_KEY.USER, userInfo)
  loading.value = ElLoading.service({
    lock: true,
    text: '正在加载系统中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  if (loginData.loginForm.rememberMe) {
    // authUtil.setLoginForm(loginData.loginForm)
  } else {
    authUtil.removeLoginForm()
  }
  authUtil.setToken(res)
  if (!redirect.value) {
    redirect.value = '/'
  }
  push({ path: redirect.value || permissionStore.addRouters[0].path })
  // 获取所有字典
  dictStore.setDictMap(true)
  dictStore.setDesignFields(true)
}

const feishuAuthCode = ref('')
const companyCode = ref('')
const appIdSave = ref('')
const redirectUrl = ref('') // 登录成功后跳转的url
//飞书授权登录
const feishuAuthLogin = async () => {
  loginLoading.value = true
  try {
    const baseUrl =
      import.meta.env.VITE_ENV === 'production'
        ? 'http://116.62.235.33'
        : import.meta.env.VITE_ENV == 'pre'
          ? 'http://106.12.72.191'
          : 'http://47.98.41.207'
    redirectUrl.value = `${baseUrl}/login?companyCode=${companyCode.value}&appId=${appIdSave.value}&redirect=${redirect.value}`

    const loginInfo = await LoginApi.feishuAuthLogin(
      feishuAuthCode.value,
      'LOGIN',
      companyCode.value,
      appIdSave.value,
      redirectUrl.value
    )
    if (!loginInfo) {
      return
    }
    handleLoginInfo(loginInfo)
  } finally {
    loginLoading.value = false
    loading?.value?.close()
  }
}

watch(
  () => currentRoute.value,
  (route: RouteLocationNormalizedLoaded) => {
    redirect.value = route?.query?.redirect as string
    feishuAuthCode.value = route?.query?.code as string
    companyCode.value = route?.query?.companyCode as string
    appIdSave.value = route?.query?.appId as string
    const state = route?.query?.state as string
    if (state && state === 'swFeiShuLogin' && feishuAuthCode.value) {
      feishuAuthLogin()
    }
  },
  {
    immediate: true
  }
)

// 飞书登录
const feishuLogin = async (data) => {
  if (data) {
    const app_id = data
    let redirect_uri = encodeURIComponent(
      `http://47.98.41.207/login?companyCode=${companyCode.value}&appId=${appIdSave.value}&redirect=${redirect.value}`
    )
    if (import.meta.env.VITE_ENV === 'production') {
      redirect_uri = encodeURIComponent(
        `http://116.62.235.33/login?companyCode=${companyCode.value}&appId=${appIdSave.value}&redirect=${redirect.value}`
      )
    }
    if (import.meta.env.VITE_ENV === 'pre') {
      redirect_uri = encodeURIComponent(
        `http://106.12.72.191/login?companyCode=${companyCode.value}&appId=${appIdSave.value}&redirect=${redirect.value}`
      )
    }
    // 权限标识 链接符号 %20
    // 获取用户手机号 :contact:user.phone:readonly
    // offline_access
    // const scope = 'contact:user.phone:readonly offline_access'
    const scope =
      'auth:user.id:read contact:user.phone:readonly offline_access calendar:calendar:readonly calendar:calendar calendar:calendar:read'
    const authUrl = `https://open.feishu.cn/open-apis/authen/v1/authorize?app_id=${app_id}&scope=${scope}&redirect_uri=${redirect_uri}&state=swFeiShuLogin`
    window.location.href = authUrl
  }
}

const yiwuInfoList = ref()
const hangzhouInfoList = ref()
const xinxiangInfoList = ref()
const wuhuInfoList = ref()
// 获取飞书返回登录信息
const feishuLoginInfo = ref([{}])
const getFeishuLoginInfo = async () => {
  const loginInfo = await LoginApi.feishuAuthLoginList().catch(() => {
    console.log('获取飞书登录信息失败')
  })
  feishuLoginInfo.value = loginInfo || [{}]

  formatFeishuLoginInfo(loginInfo || [{}])
}

const formatFeishuLoginInfo = (list) => {
  if (!list || list.length === 0) return
  yiwuInfoList.value = list.filter((item) => item.name.includes('义乌'))
  hangzhouInfoList.value = list.filter((item) => item.name.includes('杭州'))
  xinxiangInfoList.value = list.filter((item) => item.name.includes('新乡'))
  wuhuInfoList.value = list.filter((item) => item.name.includes('芜湖'))
}

const feishuLoginByInfo = (item) => {
  const { appId, code } = item
  companyCode.value = code
  appIdSave.value = appId
  feishuLogin(appId)
}

onMounted(() => {
  getLoginFormCache()
  getFeishuLoginInfo()
})
</script>

<style lang="scss" scoped>
:deep(.el-form-item__error) {
  margin-left: calc(50% - 221px)
}

:deep(.anticon) {
  &:hover {
    color: var(--el-color-primary) !important;
  }
}

.login-code {
  float: right;
  width: 100%;
  height: 38px;

  img {
    width: 100%;
    height: auto;
    max-width: 100px;
    vertical-align: middle;
    cursor: pointer;
  }
}

.loginInput {
  width: 443px;
  height: 55px;
  margin-left: calc(50% - 221px);
  line-height: 55px;
  border: none;
  border-radius: 8px;
}

.loginBtn {
  width: 443px;
  height: 58px;
  margin-left: calc(50% - 221px);
  line-height: 58px;
  border: none;
  border-radius: 8px;
  font-size: 18px;
}

.loginLine {
  margin-left: 4px;
  margin-right: 16px;
  height: 15px;
  box-shadow: 0px 4px 25px 0px rgba(0, 0, 0, 0.16);
  border: 1px solid #2c7eff;
  opacity: 0.6;
}

.loginInput .el-input__inner {
  border: none;
}

.rememberMe {
  margin-left: 100px;
  margin-left: auto;
}

:deep(.el-input__wrapper) {
  background: #ecf4ff;
  border: none;
  box-shadow: none;
  border-radius: 8px;
  height: 55px;
}

:deep(.el-input__inner) {
  border: none;
  font-size: 18px;
}

:deep(.el-checkbox__label) {
  font-size: 16px;
  color: #2c7eff;
  line-height: 22px;
}

.feishuLoginSection {
  margin-left: 40px;
  margin-top: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 20px;

  &-lineLeft {
    margin-left: auto;
    width: 145px;
    height: 1px;
    background: #e5e5e5;
  }

  &-title {
    padding-left: 16px;
    padding-right: 16px;
    font-size: 14px;
    color: #999999;
    line-height: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;

    .title {
      font-size: 14px;
      color: #999999;
    }
  }

  &-lineRight {
    margin-left: 10px;
    margin-right: auto;
    height: 1px;
    width: 145px;
    background: #e5e5e5;
  }

  &-content {
    display: flex;
    justify-content: space-between;
    align-items: center;

    &-item {
      display: flex;
      flex-direction: column;
      align-items: center;

      font-family:
        PingFangSC,
        PingFang SC;
      font-weight: 400;
      font-size: 15px;
      color: #7490cd;
      line-height: 21px;

      &-icon {
        width: 46px;
        height: 46px;
        background: linear-gradient(270deg, #ffffff 0%, #f6f8fe 100%);
        box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.12);
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 15px;

        img {
          width: 18px;
        }
      }
    }
  }
}

.feishuLogin {
  margin-left: 40px;
  margin-top: 20px;
  cursor: pointer;
  width: 442px;
  height: 56px;
  border-radius: 8px;
  border: 1px solid #2c7eff;
  display: flex;
  flex-direction: column;
  justify-content: center;

  img {
    margin-left: auto;
    margin-right: auto;
    width: 28px;
    height: 22px;
  }
}

.feishu-icon {
  width: 20px;
  height: 20px;
  margin-right: 12px;
}

.feishu-content {
  display: flex;
  flex-direction: row;
  margin-left: calc(50% - 221px);
  margin-top: 20px;
  width: calc(100% - (50% - 225px) * 2);
  justify-content: space-between;

  .feishu-item {
    width: 103.68px;
    height: 38.88px;
    border-radius: 4.32px;
    background: rgba(216, 216, 216, 0.19);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    .item-icon {
      width: 19.44px;
      height: 19.44px;
      margin-right: 11px;
    }

    .hangzhou-icon {
      background: url('@/assets/imgs/login/hangzhou-normal.png') no-repeat center center;
      background-size: 100% auto;
    }

    .yiwu-icon {
      background: url('@/assets/imgs/login/yiwu-normal.png') no-repeat center center;
      background-size: 100% auto;
    }

    .xinxinag-icon {
      background: url('@/assets/imgs/login/xinxiang-normal.png') no-repeat center center;
      background-size: 100% 100%;
    }

    .wuhu-icon {
      background: url('@/assets/imgs/login/wuhu-normal.png') no-repeat center center;
      background-size: 100% auto;
    }

    .title {
      font-family: PingFang SC;
      font-size: 16.03px;
      font-weight: normal;
      line-height: normal;
      letter-spacing: normal;
      /* 文字/一级 */
      color: #333333;
    }
  }

  .feishu-item:hover {
    background: rgba(0, 100, 255, 0.1);

    .title {
      color: #0064ff;
    }

    .hangzhou-icon {
      background: url('@/assets/imgs/login/hangzhou-activity.png') no-repeat center center;
      background-size: 100% auto;
    }

    .yiwu-icon {
      background: url('@/assets/imgs/login/yiwu-activity.png') no-repeat center center;
      background-size: 100% auto;
    }

    .xinxinag-icon {
      background: url('@/assets/imgs/login/xinxiang-activity.svg') no-repeat center center;
      background-size: 100% auto;
    }

    .wuhu-icon {
      background: url('@/assets/imgs/login/wuhu-activity.png') no-repeat center center;
      background-size: 100% auto;
    }
  }
}

.feishu-item-pop {
  padding: 4px;
  box-sizing: border-box;

  .feishu-item-pop-item {
    border-radius: 2px;
    /* 应用/灰色底色 */

    height: 32px;
    line-height: 32px;
  }

  .feishu-item-pop-item:hover {
    background: #f8f8f9;
    color: #0064ff;
  }
}
</style>
