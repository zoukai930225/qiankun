<template>
  <div class="BIMenu">
    <!-- <ElScrollbar class="BIMenu-scroll" /> -->
    <div class="BIMenu-container">
      <div class="BIMenu-container-left">
        <div v-for="(value, index) in menuList()" :key="index">
          <el-popover v-if="value.children && value.children.length > 0" placement="bottom" :width="popverWidth"
            trigger="hover" popper-style="border:none;padding:10px 0;min-width:96px;margin-left:12px;border-radius:0px"
            :show-arrow="false" :offset="0" @before-enter="handleChangeWidth(value)">
            <template #reference>
              <div class="item" @click="menuClick(value)"
                :style="{ backgroundColor: menuIsSelected(value) ? '#153278' : 'transparent' }">
                <div class="item-title">
                  {{ value.name }}
                </div>
              </div>
            </template>
            <HoverMenu :menuList="value.children" :selectMenu="selectMenu" @select-sub-menu-item="selectSubMenuItem" />
          </el-popover>
          <div v-else class="item" @click="menuClick(value)"
            :style="{ backgroundColor: menuIsSelected(value) ? '#153278' : 'transparent' }">
            <div class="item-title">
              {{ value.name }}
            </div>
          </div>
        </div>
      </div>
      <div class="BIMenu-container-right">
        <div class="BIMenu-container-right-item" @click="backSWPlatform" style="margin-right:0">管理后台</div>
      </div>
      <!-- <div class="BIMenu-container-right BIMenu-container-rightCommon">
        <div class="BIMenu-container-right-item">个人中心</div>
        <div class="BIMenu-container-right-item">下载中心</div>
        <div class="BIMenu-container-right">
          <div class="BIMenu-container-right-item" style="margin-right: 0">日志</div>
          <div class="BIMenu-container-right-tag">V4.2.0</div>
        </div>
        <el-badge :value="4" badge-class="BIMenu-container-right-badge" :offset="[0, 5]">
          <img class="BIMenu-container-right-icon" src="@/assets/imgs/Bi/toolHeader/ring.png" />
        </el-badge>
      </div> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { CACHE_KEY, useCache } from '@/hooks/web/useCache'
import { useAppStore } from '@/store/modules/app'
const { wsCache } = useCache()
const router = useRouter() // 路由对象
const { push, replace } = useRouter()
const appStore = useAppStore()

import HoverMenu from '../HoverMenu/index.vue'

const role_routers = ref(wsCache.get(CACHE_KEY.ROLE_ROUTERS))

const biMenuList = ref([]) as any
const goodViewMenu = ref('') //商品预览菜单 默认进入这个页面
role_routers.value.forEach((item) => {
  if (item.path === '/bi') {
    biMenuList.value = item.children || []
  }
})
const popverWidth = ref(96)
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

    // 处理默认进入"渠道总览"页面的权限
    if (pPath !== '/bi') {
      if (`${item.pPath}/${item.path}` === '/bi/channel/channelView') {
        goodViewMenu.value = `${item.pPath}/${item.path}`
      }
    }
  })
}

handleRoleRouters(biMenuList.value, '/bi')
// 菜单列表
const menuList = () => {
  // let homeMenu = {
  //   id: '0',
  //   name: '首页',
  //   pPath: '/bi',
  //   path: 'index',
  //   children: null,
  //   pId: '0'
  // }
  // homeMenu,
  return [...biMenuList.value]
}
const selectMenu = ref({}) as any
// 菜单是否被选中
const menuIsSelected = (menu: any) => {
  if (menu.path === selectMenu.value.path) {
    return true
  }
  if (selectMenu.value.pPath === `/bi/${menu.path}`) {
    //父级
    return true
  }
  return false
}

const getNeedExpandMenuByRoute = (path: string) => {
  menuList().forEach((item) => {
    if (path === '/bi/index' && item.path === '/bi/index') {
      selectMenu.value = item
    }
    if (path === `/bi/${item.path}`) {
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
  if (menu.path && menu.path.startsWith('/bi')) {
    appStore.setLayout('biMenu')
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
    if ((newValue === '/bi' || newValue === '/bi/index') && goodViewMenu.value) {
      // 处理某人进入商品预览模块
      replace({
        path: goodViewMenu.value
      })
    } else {
      if (newValue === '/bi') {
        console.log('见识到了非经典款', newValue)
        replace({
          path: '/bi/index'
        })
      } else {
        getNeedExpandMenuByRoute(newValue)
      }
    }
  },
  { immediate: true }
)


// 返回SW平台
const backSWPlatform = () => {
  router.push({
    path: `/admin/index`
  })
}

const handleChangeWidth = (val: any) => {

  let len = val.name.length * 14
  if (val && val.children && Array.isArray(val.children)) {
    val.children.map(item => {
      len = Math.max(len, item.name.length * 14)
    })
  }
  popverWidth.value = len + 40

}
</script>

<style lang="scss" scoped>
@mixin flex-box {
  display: flex;
  flex-direction: row;
  align-items: center;
}

@mixin common-font {
  font-weight: 400;
  font-size: 16px;
  color: #ffffff;
}

.BIMenu {
  &-scroll {
    width: calc(100vw - 390px);
  }

  &-container {
    margin-left: 34px;
    @include flex-box;
    justify-content: space-between;
    width: calc(100vw - 390px);

    &-left,
    &-right {
      @include flex-box;
    }

    .item {
      width: 72px;
      cursor: pointer;
      height: 48px;
      line-height: 48px;

      &-title {
        @include common-font;
        text-align: center;
      }
    }

    &-right {
      &-item {
        margin-right: 30px;
        @include common-font;
        cursor: pointer;
      }

      &-tag {
        height: 26px;
        padding: 0 8px;
        border: 1px solid rgba(255, 255, 255, 0.5);
        margin-left: 6px;
        @include common-font;
        line-height: 26px;
        margin-right: 20px;
      }

      &-icon {
        width: 16px;
        height: 16px;
        margin-top: 5px;
        cursor: pointer;
      }
    }
  }
}

@media (max-width: 1200px) {
  .BIMenu-container-rightCommon {
    display: none;
  }
}
</style>
<style lang="scss">
.BIMenu-container-right-badge {
  border: none;
  background-color: #eb3737;
  font-size: 10px;
  height: 14px;
  padding: 0 4px;
  line-height: 12px;
}
</style>
