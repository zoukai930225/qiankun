<template>
  <div class="menu-body" ref="menuRef">
    <div class="logo" @click="menuClick('/admin/index')">
      <div style="display: flex;">
        <img class="h-[calc(var(--logo-height)-10px)] w-[calc(var(--logo-height)-10px)] logo-img"
          src="@/assets/svgs/logo.svg" />
        <div v-if="!isCollapse" :class="['ml-10px text-20px font-500 logo-text']">
          {{ title }}
        </div>
      </div>
    </div>
    <ElScrollbar class="menu-card" :height="height">
      <el-menu :class="['menu-item', isActiveItem(homeMenu)]" :default-active="activeIndex" :collapse="isCollapse"
        :default-openeds="expandMenus" text-color="#fff" active-text-color="#fff" :popper-offset="5">
        <el-menu-item index="/admin/index" @click="menuClick('/admin/index')">
          <Icon icon="ep:home-filled" />
          <span>首页</span>
        </el-menu-item>
      </el-menu>
      <el-menu v-for="item in menuList" :key="item.id" :default-active="activeIndex"
        :class="['menu-item', isActiveItem(item)]" :collapse="isCollapse" :default-openeds="expandMenus"
        :text-color="textColor" :active-text-color="activeTextColor" :popper-offset="10" @select="menuClick">
        <el-sub-menu :index="pathIndex(item)">
          <template #title>
            <Icon v-if="item?.icon" :icon="item?.icon" />
            <span>{{ item.name }}</span>
          </template>
          <child-menu :menuInfo="item" />
        </el-sub-menu>
      </el-menu>
    </ElScrollbar>
    <div class="expand_body" @click="handleClickOutside">
      <span class="expand_txt" v-if="!isCollapse">点击收起导航栏</span>
      <Icon class="expand_icon" style="height: 20px;" :size="20" :icon="isCollapse ? 'ep:expand' : 'ep:fold'" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { CACHE_KEY, useCache } from '@/hooks/web/useCache';
import { ElSubMenu, ElMenuItem } from "element-plus";
import { useAppStore } from '@/store/modules/app';
import { cloneDeep } from "lodash-es";
import ChildMenu from "./menuItem";
import router from '@/router';

let observer: ResizeObserver | null = null;

const homeMenu: any = { id: '0', name: '首页', path: '/admin/index', icon: 'ep:home-filled', children: null, pId: '0' };

const { wsCache } = useCache(), appStore = useAppStore(), expandMenus = ref<any>([]), height = ref<number>(500);

const role_routers = ref(wsCache.get(CACHE_KEY.ROLE_ROUTERS)), menuRef = ref();

const isCollapse = computed(() => appStore.getCollapse === '0');

const activeIndex = computed(() => router.currentRoute.value.path);

const title = computed(() => appStore.getTitle);

const textColor = computed(() => isCollapse.value ? '#333' : '#fff');

const activeTextColor = computed(() => isCollapse.value ? '#0064FF' : '#fff');

const emit = defineEmits(['leftMenuClick']);

const setHeight = () => {
  height.value = window.innerHeight - 150;
}

const pathIndex = (item: any) => {
  return `${item?.pPath || ''}${item.path[0] === '/' ? '' : '/'}${item.path}`;
};

const handleRoleRouters = (menus, pPath: string, ppPath: string) => {
  menus.forEach((item) => {
    item.pPath = pPath
    item.ppPath = ppPath
    if (item.children && item.children.length > 0) {
      let tempPath = ''
      if (pPath) {
        tempPath = `${item.pPath}/${item.path}`
      } else {
        tempPath = item.path
      }
      handleRoleRouters(item.children, tempPath, item.pPath)
    }
  })
};

const menuList = computed(() => ([...role_routers.value.filter(
  (item: any) =>
    !item.path.startsWith('/bi') &&
    !item.path.startsWith('/otr') &&
    !(item.pId === '0' && item.path === '/workbench') &&
    item.visible
)]));

const menuClick = (ms: any) => {
  ms && emit('leftMenuClick', ms)
};

const isActiveItem = (item: any, bol: boolean = true) => {
  // console.log(pathIndex(item), (router?.currentRoute?.value?.path || '/'))
  // const isIncludes: boolean = (router?.currentRoute?.value?.path || '/').includes(pathIndex(item));
  // const isAllIn: boolean = (router?.currentRoute?.value?.path || '/') === (pathIndex(item));
  // return isIncludes && isAllIn ? `is_self_item` :
  //   (isIncludes && !isAllIn ? `is_self_sub${!bol ? '_none' : ''}` : 'no_sub');
  return (router?.currentRoute?.value?.path || '/').includes(pathIndex(item)) ? 'is_self_item' : '';
};

const handleClickOutside = () => {
  appStore.setCollapse(!isCollapse.value ? '0' : '1');
  setTimeout(() => { setbackgroundColor() }, 0);
}

watchEffect(() => {
  setHeight();
});

const setbackgroundColor = () => {
  document.documentElement.style.setProperty('--el-menu-hover-bg-color', isCollapse.value ? '#E5EFFF' : '#364CA4');
};

onMounted(() => {
  setbackgroundColor();
  handleRoleRouters(role_routers.value, '', '');
  setHeight();
  window.addEventListener('resize', setHeight);
  observer = new ResizeObserver(setHeight);
  menuRef?.value && observer.observe(menuRef.value);
});

onUnmounted(() => {
  observer && observer.disconnect();
  window.removeEventListener('resize', setHeight);
});

watch(() => router.currentRoute.value.path, (value: any) => {
  expandMenus.value = [];
  if (value?.length) {
    let routeValue: any = cloneDeep(value);
    const list: any = value.split('/');
    list.reverse().forEach((li: any) => {
      routeValue = routeValue.replace(`/${li}`, '');
      routeValue && (expandMenus.value = [...expandMenus.value, routeValue]);
    });
  }
}, { immediate: true });

</script>

<style lang="scss" scoped>
@use './style.scss';
</style>

<style lang="scss"></style>