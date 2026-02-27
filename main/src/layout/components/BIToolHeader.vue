<template>
  <div class="BIToolHeader">
    <img class="logo" src="@/assets/imgs/Bi/toolHeader/back-icon.png" @click="backSWPlatform" />
    <div class="name">Secret World BI</div>
    <BIMenu />
    <div class="userInfo">
      <UserInfo />
    </div>
  </div>
</template>
<script lang="ts" setup>
import BIMenu from './Menu/BIMenu/index.vue'

const router = useRouter() // 路由对象

import UserInfo from '@/layout/components/UserInfo/src/UserInfo.vue'

defineOptions({ name: 'BIToolHeader' })

// 返回SW平台
const backSWPlatform = () => {
  router.push({
    path: `/admin/index`
  })
}
</script>

<style scoped lang="scss">
.BIToolHeader {
  width: 100%;
  height: 48px;
  background: #1e47ab;
  display: flex;
  flex-direction: row;
  align-items: center;

  .logo {
    width: 24px;
    height: 24px;
    padding: 0 18px;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }
  }

  .name {
    padding-left: 16px;
    font-size: 20px;
    font-weight: 400;
    color: #ffffff;
  }

  .userInfo {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    width: 95px;
    padding-right: 20px;

    :deep(.userInfo-name) {
      color: #fff;
    }
  }
}
</style>
