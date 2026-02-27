<script lang="ts" setup>
import { onMounted, watch, computed, unref, ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import type {
  RouteLocationNormalizedLoaded,
  RouteLocationMatched,
  RouterLinkProps
} from 'vue-router'
import { usePermissionStore } from '@/store/modules/permission'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { useAppStore } from '@/store/modules/app'
import { useI18n } from '@/hooks/web/useI18n'
import { filterAffixTags } from './helper'
import { ContextMenu, ContextMenuExpose } from '@/layout/components/ContextMenu'
import { useDesign } from '@/hooks/web/useDesign'
import { useTemplateRefsList } from '@vueuse/core'
import { ElScrollbar } from 'element-plus'
import { useScrollTo } from '@/hooks/event/useScrollTo'
import detailsRouter from '@/router/modules/details';
import { CACHE_KEY, useCache } from '@/hooks/web/useCache';
import { treeToArray } from '@/utils';

const { wsCache } = useCache();

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('tags-view')

const { t } = useI18n()

const { currentRoute, push, replace } = useRouter()

const permissionStore = usePermissionStore()

const routers = computed(() => permissionStore.getRouters)

const tagsViewStore = useTagsViewStore()

const visitedViews = computed(() => {
  let filterTags = [{}]
  filterTags = []
  tagsViewStore.getVisitedViews.forEach((item) => {
    if (item.path !== '/' && !item.path.startsWith('/bi') && !item.path.startsWith('/otr')) {
      if (item.path === '/index' || item.path === '/admin/index') {
        let match1 = {
          path: '/',
          meta: item.meta
        } as RouteLocationMatched
        let match2 = {
          path: '/admin/index',
          meta: item.meta
        } as RouteLocationMatched
        item.matched = [match1, match2]
      }
      filterTags.push(item)
    }
  })
  return filterTags
})

const affixTagArr = ref<RouteLocationNormalizedLoaded[]>([])

const appStore = useAppStore()

const tagsViewIcon = computed(() => appStore.getTagsViewIcon)

const isDark = computed(() => appStore.getIsDark)

// 初始化tag
const initTags = () => {
  affixTagArr.value = filterAffixTags(unref(routers))
  for (const tag of unref(affixTagArr)) {
    // Must have tag name
    if (tag.name) {
      tagsViewStore.addVisitedView(tag)
    }
  }
}

const tagWidth = computed(() => {
  return appStore.showRightMenu ? 'calc(100% + 128px)' : 'calc(100vw - var(--left-menu-width) - 4px)'
})

const tagMarginLeft = computed(() => {
  return appStore.showRightMenu ? '-128px' : '4px'
})

const selectedTag = ref<RouteLocationNormalizedLoaded>()

// 新增tag
const addTags = () => {
  const { name } = unref(currentRoute)
  if (name) {
    selectedTag.value = unref(currentRoute)
    tagsViewStore.addView(unref(currentRoute))
  }
  return false
}



// 关闭选中的tag
const closeSelectedTag = (view: RouteLocationNormalizedLoaded) => {
  const routes: any = (detailsRouter?.length && detailsRouter[0]?.children?.length ? detailsRouter[0].children : []).map((cci: any) => cci.name);
  if (routes.includes(view.name)) {
    if (view?.query?.type && view.query.type !== 'view') {
      ElMessageBox.confirm('此操作将关闭当前页,请确认是否有数据修改未保存?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        closeTagView(view);
      }).catch(() => { })
    } else {
      closeTagView(view);
    }
  } else {
    closeTagView(view);
  }
}

const closeTagView = (view: RouteLocationNormalizedLoaded) => {
  if (view?.meta?.affix) return
  tagsViewStore.delView(view)
  if (isActive(view)) {
    toLastView()
  }
};

// 关闭全部
const closeAllTags = () => {
  tagsViewStore.delAllViews()
  toLastView()
}

// 关闭其它
const closeOthersTags = () => {
  tagsViewStore.delOthersViews(unref(selectedTag) as RouteLocationNormalizedLoaded)
}

// 重新加载
const refreshSelectedTag = async (view?: RouteLocationNormalizedLoaded) => {
  if (!view) return
  tagsViewStore.delCachedView()
  const { path, query } = view
  await nextTick()
  replace({
    path: '/redirect' + path,
    query: query
  })
}

// 关闭左侧
const closeLeftTags = () => {
  tagsViewStore.delLeftViews(unref(selectedTag) as RouteLocationNormalizedLoaded)
}

// 关闭右侧
const closeRightTags = () => {
  tagsViewStore.delRightViews(unref(selectedTag) as RouteLocationNormalizedLoaded)
}

// 跳转到最后一个
const toLastView = () => {
  const visitedViews = tagsViewStore.getVisitedViews
  const latestView = visitedViews.slice(-1)[0]
  if (latestView) {
    if (latestView.path.startsWith('/admin/')) {
      push(latestView)
    } else {
      push('/admin/index')
    }
  } else {
    if (
      unref(currentRoute).path === permissionStore.getAddRouters[0].path ||
      unref(currentRoute).path === permissionStore.getAddRouters[0].redirect
    ) {
      addTags()
      return
    }
    // TODO: You can set another route
    push('/admin/index')
  }
}

// 滚动到选中的tag
const moveToCurrentTag = async () => {
  await nextTick()
  for (const v of unref(visitedViews)) {
    if (v.fullPath === unref(currentRoute).path) {
      moveToTarget(v)
      if (v.fullPath !== unref(currentRoute).fullPath) {
        tagsViewStore.updateVisitedView(unref(currentRoute))
      }

      break
    }
  }
}

const tagLinksRefs = useTemplateRefsList<RouterLinkProps>()

const moveToTarget = (currentTag: RouteLocationNormalizedLoaded) => {
  const wrap$ = unref(scrollbarRef)?.wrapRef
  let firstTag: Nullable<RouterLinkProps> = null
  let lastTag: Nullable<RouterLinkProps> = null

  const tagList = unref(tagLinksRefs)
  // find first tag and last tag
  if (tagList.length > 0) {
    firstTag = tagList[0]
    lastTag = tagList[tagList.length - 1]
  }
  if (
    firstTag?.to &&
    currentTag.fullPath &&
    (firstTag?.to as RouteLocationNormalizedLoaded).fullPath === currentTag.fullPath
  ) {
    // 直接滚动到0的位置
    const { start } = useScrollTo({
      el: wrap$!,
      position: 'scrollLeft',
      to: 0,
      duration: 500
    })
    start()
  } else if (
    lastTag?.to &&
    currentTag.fullPath &&
    (lastTag?.to as RouteLocationNormalizedLoaded).fullPath === currentTag.fullPath
  ) {
    // 滚动到最后的位置
    const { start } = useScrollTo({
      el: wrap$!,
      position: 'scrollLeft',
      to: wrap$!.scrollWidth - wrap$!.offsetWidth,
      duration: 500
    })
    start()
  } else {
    // find preTag and nextTag
    const currentIndex: number = tagList.findIndex(
      (item) => (item?.to as RouteLocationNormalizedLoaded).fullPath === currentTag.fullPath
    )
    const tgsRefs = document.getElementsByClassName(`${prefixCls}__item`)

    const prevTag = tgsRefs[currentIndex - 1] as HTMLElement
    const nextTag = tgsRefs[currentIndex + 1] as HTMLElement

    // the tag's offsetLeft after of nextTag
    const afterNextTagOffsetLeft = nextTag.offsetLeft + nextTag.offsetWidth + 4

    // the tag's offsetLeft before of prevTag
    const beforePrevTagOffsetLeft = prevTag.offsetLeft - 4

    if (afterNextTagOffsetLeft > unref(scrollLeftNumber) + wrap$!.offsetWidth) {
      const { start } = useScrollTo({
        el: wrap$!,
        position: 'scrollLeft',
        to: afterNextTagOffsetLeft - wrap$!.offsetWidth,
        duration: 500
      })
      start()
    } else if (beforePrevTagOffsetLeft < unref(scrollLeftNumber)) {
      const { start } = useScrollTo({
        el: wrap$!,
        position: 'scrollLeft',
        to: beforePrevTagOffsetLeft,
        duration: 500
      })
      start()
    }
  }
}

// 是否是当前tag
const isActive = (route: RouteLocationNormalizedLoaded): boolean => {
  return route.path === unref(currentRoute).path
}

// 所有右键菜单组件的元素
const itemRefs = useTemplateRefsList<ComponentRef<typeof ContextMenu & ContextMenuExpose>>()

// 右键菜单装填改变的时候
const visibleChange = (visible: boolean, tagItem: RouteLocationNormalizedLoaded) => {
  if (visible) {
    for (const v of unref(itemRefs)) {
      const elDropdownMenuRef = v.elDropdownMenuRef
      if (tagItem.fullPath !== v.tagItem.fullPath) {
        elDropdownMenuRef?.handleClose()
      }
    }
  }
}

// elscroll 实例
const scrollbarRef = ref<ComponentRef<typeof ElScrollbar>>()

// 保存滚动位置
const scrollLeftNumber = ref(0)

const scroll = ({ scrollLeft }) => {
  scrollLeftNumber.value = scrollLeft as number
}

// 移动到某个位置
const move = (to: number) => {
  const wrap$ = unref(scrollbarRef)?.wrapRef
  const { start } = useScrollTo({
    el: wrap$!,
    position: 'scrollLeft',
    to: unref(scrollLeftNumber) + to,
    duration: 500
  })
  start()
}

const resolveMenuPaths = (menus, parentPath = '') => {
  if (!menus) return
  for (const menu of menus) {
    if (menu.path && !menu.path.startsWith('/')) {
      menu.path = `${parentPath}/${menu.path}`.replace(/\/+/g, '/')
    }
    if (menu.children?.length) {
      resolveMenuPaths(menu.children, menu.path)
    }
  }
  return menus
}

const routerNameShow = (item: any) => {
  const list: any = wsCache.get(CACHE_KEY.ROLE_ROUTERS).filter((item: any) => !item.path.startsWith('/bi') && !item.path.startsWith('/otr') && !(item.pId === '0' && item.path === '/workbench') && item.visible);
  const targetValue: any = treeToArray(resolveMenuPaths(list)).find((rs: any) => rs.path === item.path);
  let name: string = t(item?.meta?.title as string) || targetValue?.name || '';
  if (item?.meta?.hidden && item?.name.includes('Details') && !!item?.query?.type) {
    switch (item.query.type) {
      case 'view': name += '-详情'; break;
      case 'add': name += '-新增'; break;
      case 'edit': name += '-编辑'; break;
      case 'audit': name += '-审核'; break;
      default: break;
    }
  }
  return name;
};

onMounted(() => {
  initTags()
  addTags()
})

watch(
  () => currentRoute.value,
  () => {
    addTags()
    moveToCurrentTag()
  }
)
</script>

<template>
  <div :id="prefixCls" :class="prefixCls"
    class="relative w-full h-[var(--tags-view-item-height)] tagsView flex bg-[#F5F5F5]"
    :style="{ width: tagWidth, paddingLeft: tagMarginLeft }">
    <span :class="`${prefixCls}__tool ${prefixCls}__tool--first`"
      class="h-[var(--tags-view-height)] w-[var(--tags-view-height)] flex cursor-pointer items-center justify-center"
      @click="move(-200)">
      <Icon icon="ep:arrow-left" color="var(--el-text-color-placeholder)" class="tag-leftIcon"
        :hover-color="isDark ? '#fff' : 'var(--el-color-black)'" />
    </span>
    <div class="flex-1 overflow-hidden">
      <ElScrollbar ref="scrollbarRef" class="h-[var(--tags-view-height)]" @scroll="scroll">
        <div class="h-[var(--tags-view-height)] flex">
          <ContextMenu :ref="itemRefs.set" :schema="[
            {
              icon: 'ep:refresh',
              label: t('common.reload'),
              disabled: selectedTag?.fullPath !== item.fullPath,
              command: () => {
                refreshSelectedTag(item)
              }
            },
            {
              icon: 'ep:close',
              label: t('common.closeTab'),
              disabled: !!visitedViews?.length && selectedTag?.meta.affix,
              command: () => {
                closeSelectedTag(item)
              }
            },
            {
              divided: true,
              icon: 'ep:d-arrow-left',
              label: t('common.closeTheLeftTab'),
              disabled:
                !!visitedViews?.length &&
                (item.fullPath === visitedViews[0].fullPath ||
                  selectedTag?.fullPath !== item.fullPath),
              command: () => {
                closeLeftTags()
              }
            },
            {
              icon: 'ep:d-arrow-right',
              label: t('common.closeTheRightTab'),
              disabled:
                !!visitedViews?.length &&
                (item.fullPath === visitedViews[visitedViews.length - 1].fullPath ||
                  selectedTag?.fullPath !== item.fullPath),
              command: () => {
                closeRightTags()
              }
            },
            {
              divided: true,
              icon: 'ep:discount',
              label: t('common.closeOther'),
              disabled: selectedTag?.fullPath !== item.fullPath,
              command: () => {
                closeOthersTags()
              }
            },
            {
              icon: 'ep:minus',
              label: t('common.closeAll'),
              command: () => {
                closeAllTags()
              }
            }
          ]" v-for="item in visitedViews" :key="item.fullPath" :tag-item="item" :class="[
            `${prefixCls}__item`,
            item?.meta?.affix ? `${prefixCls}__item--affix` : '',
            'tagItem',
            {
              'is-active': isActive(item)
            }
          ]" @visible-change="visibleChange">
            <div>
              <router-link :ref="tagLinksRefs.set" :to="{ ...item }" custom v-slot="{ navigate }">
                <div @click="navigate" class="h-full flex items-center justify-center whitespace-nowrap pl-15px">
                  <Icon v-if="
                    item?.matched &&
                    item?.matched[1] &&
                    item?.matched[1]?.meta?.icon &&
                    tagsViewIcon
                  " :icon="item?.matched[1]?.meta?.icon" :size="12" class="mr-5px" />
                  {{ routerNameShow(item) }}
                  <Icon :class="`${prefixCls}__item--close`" color="#333" icon="ep:close" :size="12"
                    @click.prevent.stop="closeSelectedTag(item)" />
                </div>
              </router-link>
            </div>
          </ContextMenu>
        </div>
      </ElScrollbar>
    </div>
    <span :class="`${prefixCls}__tool`"
      class="h-[var(--tags-view-height)] w-[var(--tags-view-height)] flex cursor-pointer items-center justify-center"
      @click="move(200)">
      <Icon icon="ep:arrow-right" color="var(--el-text-color-placeholder)" class="tag-rightIcon"
        :hover-color="isDark ? '#fff' : 'var(--el-color-black)'" />
    </span>
    <ContextMenu trigger="click" :schema="[
      {
        icon: 'ep:refresh',
        label: t('common.reload'),
        command: () => {
          refreshSelectedTag(selectedTag)
        }
      },
      {
        icon: 'ep:close',
        label: t('common.closeTab'),
        disabled: !!visitedViews?.length && selectedTag?.meta.affix,
        command: () => {
          closeSelectedTag(selectedTag!)
        }
      },
      {
        divided: true,
        icon: 'ep:d-arrow-left',
        label: t('common.closeTheLeftTab'),
        disabled: !!visitedViews?.length && selectedTag?.fullPath === visitedViews[0].fullPath,
        command: () => {
          closeLeftTags()
        }
      },
      {
        icon: 'ep:d-arrow-right',
        label: t('common.closeTheRightTab'),
        disabled:
          !!visitedViews?.length &&
          selectedTag?.fullPath === visitedViews[visitedViews.length - 1].fullPath,
        command: () => {
          closeRightTags()
        }
      },
      {
        divided: true,
        icon: 'ep:discount',
        label: t('common.closeOther'),
        command: () => {
          closeOthersTags()
        }
      },
      {
        icon: 'ep:minus',
        label: t('common.closeAll'),
        command: () => {
          closeAllTags()
        }
      }
    ]">
      <span :class="`${prefixCls}__tool`"
        class="block h-[var(--tags-view-height)] w-[var(--tags-view-height)] flex cursor-pointer items-center justify-center">
        <el-icon color="var(--el-text-color-placeholder)" :hover-color="isDark ? '#fff' : 'var(--el-color-black)'">
          <MoreFilled />
        </el-icon>
      </span>
    </ContextMenu>
  </div>
</template>

<style lang="scss" scoped>
$prefix-cls: #{$namespace}-tags-view;

.#{$prefix-cls} {
  :deep(.#{$elNamespace}-scrollbar__view) {
    height: 100%;
  }

  &__tool {
    position: relative;

    &::before {
      position: absolute;
      top: 1px;
      left: 0;
      width: 100%;
      height: calc(100% - 1px);
      // border-left: 1px solid var(--el-border-color);
      content: '';
    }

    &--first {
      &::before {
        position: absolute;
        top: 1px;
        left: 0;
        width: 100%;
        height: calc(100% - 1px);
        // border-right: 1px solid var(--el-border-color);
        border-left: none;
        content: '';
      }
    }
  }

  &__item {
    position: relative;
    top: 2px;
    left: 0px;
    // height: calc(100% - 6px);
    padding-right: 20px;
    padding-left: 5px;
    margin-left: 4px;
    font-size: 12px;
    cursor: pointer;
    color: #313233;
    line-height: 20px;
    // border: 1px solid #d9d9d9;
    border-radius: 2px;

    &--close {
      position: absolute;
      top: 50%;
      right: 5px;
      display: none;
      transform: translate(0, -50%);
      color: #0064ff !important;
    }

    &:not(.#{$prefix-cls}__item--affix):hover {
      .#{$prefix-cls}__item--close {
        display: block;
      }
    }
  }

  &__item:not(.is-active) {
    &:hover {
      color: var(--el-color-primary);
    }
  }

  &__item.is-active {
    color: #0064ff;
    background-color: #fff;
    // border: 1px solid var(--el-color-primary);
    height: 24px;
    background: #ffffff;
    box-shadow: 3px 1px 3px 0px rgba(185, 185, 185, 0.35);

    .#{$prefix-cls}__item--close {
      :deep(span) {
        // color: var(--el-color-white) !important;
        color: #0064ff !important;
      }
    }
  }
}

.tagItem {
  margin-top: 3px;
  height: 24px;
  background-color: transparent;
  box-shadow: 1px 1px 1px 1px rgba(185, 185, 185, 0.43);
  border: 0px solid transparent;
  line-height: 24px;
  border-radius: 2px;
}

.tagsView {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 24px;
  background: #F5F5F5;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.06);
}

.tag-leftIcon {
  margin-left: -10px;
  border: 0px solid var(--el-border-color);
  width: 28px;
  height: 24px;
  background: #ffffff;
  box-shadow: 2px 0px 4px 0px rgba(0, 0, 0, 0.06);
}

.tag-rightIcon {
  border: 0px solid var(--el-border-color);
  width: 28px;
  height: 24px;
  background: #ffffff;
  box-shadow: 2px 0px 4px 0px rgba(0, 0, 0, 0.06);
}

.layout-border__top:before {
  background-color: transparent;
}

.layout-border__bottom:after {
  background-color: transparent;
}
</style>
