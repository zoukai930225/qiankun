<template>
  <div class="OTRToolHeader">
    <img class="logo" src="@/assets/imgs/logo.png" style="border-radius: 15px" />
    <div class="name">SecretWorld Platform</div>
    <OTRMenu />
    <div class="manageBack" @click="backSWPlatform">管理后台</div>
    <div class="userInfo">
      <UserInfo />
    </div>
  </div>
</template>
<script lang="ts" setup>
import OTRMenu from './Menu/OTRMenu/index.vue'

const router = useRouter() // 路由对象

import UserInfo from '@/layout/components/UserInfo/src/UserInfo.vue'

defineOptions({ name: 'OTRToolHeader' })

// 返回SW平台
const backSWPlatform = () => {
  router.push({
    path: `/admin/index`
  })
}
</script>

<style scoped lang="scss">
.OTRToolHeader {
  width: 100%;
  height: 100%;
  padding-left: 15px;
  background: #fff;
  display: flex;
  flex-direction: row;
  align-items: center;
  .logo {
    width: 40px;
    height: 40px;
  }
  .name {
    padding-left: 10px;
    font-size: 18px;
    font-weight: 500;
    color: #000;
  }
  .manageBack {
    margin-left: auto;
    margin-right: 20px;
    font-size: 16px;
    color: #fff;
    background-color: #0064ff;
    width: 90px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
    cursor: pointer;
  }
  .userInfo {
    margin-right: 38px;
  }
}
</style>
