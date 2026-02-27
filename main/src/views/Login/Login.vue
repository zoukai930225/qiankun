<template>
  <div
    :class="prefixCls"
    class="relative h-[100%] lt-md:px-10px lt-sm:px-10px lt-xl:px-10px lt-xl:px-10px"
  >
    <div class="relative mx-auto h-full flex">
      <div :class="`${prefixCls}__left flex-1 bg-gray-500 bg-opacity-20 relative p-30px`">
        <!-- 左上角的 logo + 系统标题 -->
        <div class="relative flex items-center text-white">
          <img alt="" class="mr-10px h-48px w-48px loginLogo" src="@/assets/imgs/logo.png" />
          <span class="text-20px font-bold loginTtile">{{
            underlineToHump(appStore.getTitle)
          }}</span>
        </div>
      </div>
    </div>
    <div>
      <!-- 右边的登录界面 -->
      <Transition appear enter-active-class="animate__animated animate__bounceInRight1">
        <!-- 账号登录 -->
        <div class="loginBg">
          <div class="loginBg-loginFlur">
            <LoginForm class="rightLoginForm" />
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { underlineToHump } from '@/utils'

import { useDesign } from '@/hooks/web/useDesign'
import { useAppStore } from '@/store/modules/app'

import { LoginForm } from './components'

defineOptions({ name: 'Login' })

const appStore = useAppStore()
const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('login')
</script>

<style lang="scss" scoped>
$prefix-cls: #{$namespace}-login;

.#{$prefix-cls} {
  overflow: auto;

  &__left {
    &::before {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 99;
      width: 100vw;
      height: 100vh;
      background-image: url('@/assets/imgs/login.png');
      background-size: 100vw 100vh;
      background-position: center;
      background-repeat: no-repeat;
      content: '';
    }
  }
}
.middleLoginImg {
  position: absolute;
  left: 15%;
  top: 20%;
}
.loginLogo {
  border-radius: 12px;
}
.loginTtile {
  color: #333;
}

.loginBg {
  position: absolute;
  top: 0px;
  width: 590px;
  right: 44px;
  height: 100vh;
  z-index: 99;
  &-loginFlur {
    display: flex;
    flex-direction: column;
    align-content: center;
    z-index: 1100;
    margin-top: calc((100vh - 716px) / 2);
    background-image: url('@/assets/imgs/login_blurBg1.png');
    background-size: 599px 644px;
    background-position: center;
    background-repeat: no-repeat;
    width: 599px;
    height: 716px;

    .rightLoginForm {
      // position: absolute;
      // top: 120px;
      // right: 60px;
      // width: 360px;
      // height: 380px;
      display: flex;
      flex-direction: column;
      align-content: center;
      margin-left: 40px;
      margin-top: 40px;
      height: calc(644px - 80px);
      width: calc(100% - 80px);
      z-index: 1000;
    }
  }
}
</style>
