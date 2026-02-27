<template>
  <div class="OTRMenu">
    <!-- <ElScrollbar class="BIMenu-scroll" /> -->
    <div class="OTRMenu-container">
      <div v-for="(value, index) in menuList()" :key="index">
        <el-popover
          v-if="value.children && value.children.length > 0"
          placement="bottom"
          :width="166"
          trigger="hover"
          :show-arrow="false"
          :offset="12"
        >
          <template #reference>
            <div class="item" @click="menuClick(value)">
              <div class="item-title" :class="{ selected: menuIsSelected(value) }">
                {{ value.name }}
              </div>
              <div v-if="menuIsSelected(value)" class="item-line"> </div>
            </div>
          </template>
          <HoverMenu
            :menuList="value.children"
            :selectMenu="selectMenu"
            @select-sub-menu-item="selectSubMenuItem"
          />
        </el-popover>
        <div v-else class="item" @click="menuClick(value)">
          <div class="item-title" :style="{ color: menuIsSelected(value) ? '#0064ff' : '#333' }">
            {{ value.name }}
          </div>
          <div v-if="menuIsSelected(value)" class="item-line"> </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'
import { CACHE_KEY, useCache } from '@/hooks/web/useCache'
const { wsCache } = useCache()
const router = useRouter() // 路由对象
const { push, replace } = useRouter()
const appStore = useAppStore()

import HoverMenu from '../HoverMenu/index.vue'

const role_routers = ref(wsCache.get(CACHE_KEY.ROLE_ROUTERS))

const biMenuList = ref([])
const projectSetMenu = ref('') //题目设置菜单 默认进入这个页面
role_routers.value.forEach((item) => {
  if (item.path === '/otr') {
    biMenuList.value = item.children || []
  }
})

const handleRoleRouters = (menus, pPath: string) => {
  menus.forEach((item) => {
    item.pPath = pPath
    if (item.children && item.children.length > 0) {
      let tempPath = ''
      if (pPath) {
        tempPath = `${item.pPath}/${item.path}`
      } else {
        tempPath = item.path
      }
      handleRoleRouters(item.children, tempPath)
    }

    // 处理默认进入题目设置页面的权限
    if (pPath === '/otr') {
      if (`${item.pPath}/${item.path}` === '/otr/activitySet') {
        projectSetMenu.value = `${item.pPath}/${item.path}`
      }
    }
  })
}

handleRoleRouters(biMenuList.value, '/otr')
// 菜单列表
const menuList = () => {
  // let homeMenu = {
  //   id: '0',
  //   name: '首页',
  //   pPath: '/otr',
  //   path: 'index',
  //   children: null,
  //   pId: '0'
  // }
  return [...biMenuList.value]
}
const selectMenu = ref({})
// 菜单是否被选中
const menuIsSelected = (menu: any) => {
  if (menu.path === selectMenu.value.path) {
    return true
  }
  if (selectMenu.value.pPath === `/otr/${menu.path}`) {
    //父级
    return true
  }
  return false
}

const getNeedExpandMenuByRoute = (path: string) => {
  menuList().forEach((item) => {
    if (path === '/otr/index' && item.path === '/otr/index') {
      selectMenu.value = item
    }
    if (path === `/otr/${item.path}`) {
      selectMenu.value = item
    }
    if (item.children && item.children.length > 0) {
      item.children.forEach((item1) => {
        if (path === `${item1.pPath}/${item1.path}`) {
          selectMenu.value = item1
        }
      })
    }
  })
}

// 菜单选中
const menuClick = (menu: any) => {
  if (menu.children && menu.children.length > 0) {
    return
  }
  if (menu.path && menu.path.startsWith('/otr')) {
    appStore.setLayout('otrMenu')
  }
  selectMenu.value = menu
  menuRouterPush(menu)
}

// 子菜单选择
const selectSubMenuItem = (menu: any) => {
  selectMenu.value = menu
}

// 路由跳转
const menuRouterPush = (menu) => {
  let pushPath = menu.path
  if (menu.pPath) {
    pushPath = `${menu.pPath}/${menu.path}`
  }
  push(pushPath)
}

// 监听路由信息变化
watch(
  () => router.currentRoute.value.path,
  (newValue) => {
    if ((newValue === '/otr' || newValue === '/otr/index') && projectSetMenu.value) {
      // 处理某人进入商品预览模块
      replace({
        path: projectSetMenu.value
      })
    } else {
      if (newValue === '/otr') {
        replace({
          path: '/otr/index'
        })
      } else {
        if (router.currentRoute.value.meta?.activeMenu) {
          selectMenu.value = {
            path: router.currentRoute.value.meta?.activeMenu,
            pPath: '/otr'
          }
          return
        }
        getNeedExpandMenuByRoute(newValue)
      }
    }
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.OTRMenu {
  margin-left: 60px;
  margin-right: 20px;
  height: 50px;
  &-scroll {
    width: calc(100vw - 520px);
  }
  &-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: calc(100vw - 580px);
    height: 50px;
    .item {
      margin-right: 45px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      cursor: pointer;

      &-title {
        font-weight: 400;
        font-size: 14px;
        color: #333333;
        line-height: 20px;
        cursor: pointer;
        &.selected {
          color: #0064ff;
        }
        &:hover {
          color: #0064ff !important;
        }
      }
      &-line {
        margin-left: 4px;
        margin-right: 4px;
        margin-top: 4px;
        height: 3px;
        border-radius: 4px;
        background: #0064ff;
      }
    }
  }
}
</style>
