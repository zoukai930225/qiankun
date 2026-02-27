<template>
  <div class="callBack">三方API回调页面获取code值</div>
</template>
<script lang="ts" setup>
const route = useRoute() // 路由

import * as ThirdPlatformApi from '@/api/system/thirdPlatform'

defineOptions({ name: 'CallBack' })

const source = route.query.source || ''
const app_auth_code = route.query.app_auth_code || ''

/**
 * 保存授权码
 */
const saveAuthCode = async () => {
  let platofrm = ''
  if (source === 'alipay_app_auth') {
    // 支付宝授权
    platofrm = 'alipay'
  }
  if (platofrm && app_auth_code) {
    await ThirdPlatformApi.updateThirdPlatformConfigAuthCode(platofrm, app_auth_code as string)
  }
}

/** 初始化 */
onMounted(() => {
  saveAuthCode()
})
</script>

<style scoped lang="scss">
.callBack {
  margin-top: 30px;
  margin-left: 60px;
}
</style>
