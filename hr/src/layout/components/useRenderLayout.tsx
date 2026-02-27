import { computed } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { CusMenu } from '@/layout/components/Menu'
import { TagsView } from '@/layout/components/TagsView'
import AppView from './AppView.vue'
import BIAppView from './BIAppView.vue'
import OTRAppView from './OTRAppView.vue'
import ToolHeader from './ToolHeader.vue'
import BIToolHeader from './BIToolHeader.vue'
import OTRToolHeader from './OTRToolHeader.vue'

import { ElScrollbar } from 'element-plus'
import { useDesign } from '@/hooks/web/useDesign'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('layout')

const appStore = useAppStore()

const adminScrollBarRef = ref();

const pageLoading = computed(() => appStore.getPageLoading)

// 标签页
const tagsView = computed(() => appStore.getTagsView)

// logo

// 固定头部
const fixedHeader = computed(() => appStore.getFixedHeader)

// 是否是移动端
const mobile = computed(() => appStore.getMobile)

// 固定菜单

export const useRenderLayout = () => {


  const renderClassic = () => {
    return (
      <>
        <div class="toolHeader" style={{ width: `calc(100vw - var(--left-menu-width))`, marginLeft: `var(--left-menu-width)` }}>
          <ToolHeader />
        </div>

        <div
          class={[
            'absolute top-0 left-0 h-full  bg-[var(--cus-menu-bg-color)]',
            { '!fixed z-3000': mobile.value }
          ]}
        >
          <CusMenu></CusMenu>
        </div>
        <div
          class={[
            `${prefixCls}-content`,
            'absolute top-0 h-[100%]',
            {
              'w-[calc(100%-var(--left-menu-width))] left-[var(--left-menu-width)]':
                !mobile.value && !mobile.value && !appStore.showRightMenu,
              'w-[calc(100%-var(--left-menu-width))] left-[var(--left-menu-max-width)]':
                !mobile.value && !mobile.value && appStore.showRightMenu,
              'fixed !w-full !left-0': mobile.value
            }
          ]}
          style="transition: all var(--transition-time-02);"
        >
          <ElScrollbar ref={adminScrollBarRef}
            v-loading={pageLoading.value}
            class={[
              `${prefixCls}-content-scrollbar`,
              {
                '!h-[calc(100%-var(--top-tool-height)-var(--tags-view-item-height))] mt-[calc(var(--top-tool-height)+var(--tags-view-item-height)+10px)] adminScrollBar':
                  fixedHeader.value
              }
            ]}
          >
            <div
              class={[
                {
                  'fixed top-0 left-0': fixedHeader.value,
                  'w-[calc(100%-var(--left-menu-width))] !left-[var(--left-menu-width)]':
                    fixedHeader.value && !mobile.value && !appStore.showRightMenu,
                  'w-[calc(100%-var(--left-menu-width))] !left-[var(--left-menu-max-width)]':
                    fixedHeader.value && !mobile.value && appStore.showRightMenu,
                  '!w-full !left-0': mobile.value
                }
              ]}
              style="transition: all var(--transition-time-02);"
            >
              <ToolHeader
                class={[
                  'bg-[var(--top-header-bg-color)]',
                  {
                    'layout-border__bottom': !tagsView.value
                  }
                ]}
              ></ToolHeader>

              {tagsView.value ? (
                <TagsView class="layout-border__top layout-border__bottom"></TagsView>
              ) : undefined}
            </div>

            <AppView></AppView>
          </ElScrollbar>
        </div>
      </>
    )
  }

  const renderBiMenu = () => {
    return (
      <>
        <div class="toolHeader">
          <BIToolHeader />
        </div>
        {/* <div class="BITopCrumb">
          <BICrumb />
        </div> */}
        <div class="BIMainContainer">
          {/* <BIMenu /> */}
          <div class="BIMainContainer-content">
            <ElScrollbar v-loading={pageLoading.value} class={[`${prefixCls}-content-scrollbar`]}>
              <BIAppView></BIAppView>
            </ElScrollbar>
          </div>
        </div>
      </>
    )
  }

  const renderOtrMenu = () => {
    return (
      <>
        <div class="toolHeader">
          <OTRToolHeader />
        </div>
        <div class="OTRMainContainer">
          <div class="OTRMainContainer-content">
            <ElScrollbar v-loading={pageLoading.value} class={[`${prefixCls}-content-scrollbar`]}>
              <OTRAppView></OTRAppView>
            </ElScrollbar>
          </div>
        </div>
      </>
    )
  }
  return {
    adminScrollBarRef,
    renderClassic,
    renderBiMenu,
    renderOtrMenu
  }
}
