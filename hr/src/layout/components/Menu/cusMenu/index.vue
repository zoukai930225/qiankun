<template>
  <div class="cusMenu">
    <!-- <ElScrollbar class="leftMenuScroll" /> -->
    <LeftMenu @left-menu-click="leftMenuClick" />
  </div>
</template>

<script lang="ts" setup>
const { push } = useRouter()
const router = useRouter() // 路由对象

import LeftMenu from './leftMenu.vue'
// 左侧菜单选中
const leftMenuClick = (menu: any) => {
  push(menu);
  // menuRouterPush(menu)
}
// 路由跳转
const menuRouterPush = (menu) => {
  let pushPath = menu.path
  if (menu.pPath) {
    pushPath = `${menu.pPath}/${menu.path}`
  }
  if (router.currentRoute.value.path === pushPath) {
    return
  }
  if (menu.path === '/') {
    if (router.currentRoute.value.path === 'admin/index') {
      return
    }
    push(menu.redirect)
  } else {
    push(pushPath)
  }
}
</script>

<style lang="scss" scoped>
.cusMenu {
  height: 100vh;
  background-color: var(--app-content-bg-color);
  background: #e9eefa;
  width: var(--left-menu-width);

  .leftMenuScroll {
    width: var(--left-menu-width);
    border-radius: 8px;
    overflow-x: hidden;
    /* 隐藏水平滚动条 */
    overflow: auto;
    height: calc(100vh - 50px);
  }
}
</style>
