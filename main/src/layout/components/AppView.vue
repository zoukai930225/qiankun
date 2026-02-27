<!--
 * @Date: 2025-03-13 11:32:19
-->
<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { useRoute } from 'vue-router'
// import { Footer } from '@/layout/components/Footer'

defineOptions({ name: 'AppView' })

const appStore = useAppStore()
const layout = computed(() => appStore.getLayout)

const fixedHeader = computed(() => appStore.getFixedHeader)

const footer = computed(() => appStore.getFooter)

const tagsViewStore = useTagsViewStore()

const getCaches = computed((): string[] => {
  return tagsViewStore.getCachedViews
})

const getRouteKey = (route: any): string => {
  if (route.path?.startsWith('/admin/hrAdmin')) {
    return '__micro_hr_admin__'
  }
  return route.fullPath
}

const tagsView = computed(() => appStore.getTagsView)
const fullPath = ref()
const route = useRoute()

// 监听路由变化
watch(
  () => route.fullPath,
  (newFullPath) => {
    fullPath.value = newFullPath
  }
)

onMounted(() => {
  updateFullPath(route.fullPath)
})

const updateFullPath = (newFullPath) => {
  fullPath.value = newFullPath
}

// 不需要padding的页面路由
const whitelist = ref(['/admin/team/schedule/dataDashboard', '/admin/hrAdmin/resources/dashboard'])
const baseClass =
  'p-[var(--app-content-padding)] pt-[var(--app-content-padding-top)] w-[calc(100%-var(--app-content-padding)-var(--app-content-padding))] bg-[var(--app-content-bg-color)]'
const computedClass = computed(() => {
  return !whitelist.value.includes(fullPath.value) ? baseClass : ''
})

//region 无感刷新
const routerAlive = ref(true)
// 无感刷新，防止出现页面闪烁白屏
const reload = () => {
  routerAlive.value = false
  nextTick(() => (routerAlive.value = true))
}
// 为组件后代提供刷新方法
provide('reload', reload)
//endregion
</script>

<template>
  <section
    :class="[
      computedClass,
      {
        '!min-h-[calc(100%-var(--app-content-padding)-var(--app-content-padding)-var(--app-footer-height))]':
          (fixedHeader &&
            (layout === 'classic' || layout === 'topLeft' || layout === 'top') &&
            footer) ||
          (!tagsView && layout === 'top' && footer),
        '!min-h-[calc(100%-var(--app-content-padding)-var(--app-content-padding)-var(--app-footer-height)-var(--tags-view-item-height))]':
          tagsView && layout === 'top' && footer,

        '!min-h-[calc(100%-var(--tags-view-item-height)-var(--app-content-padding)-var(--app-content-padding)-var(--top-tool-height)-var(--app-footer-height))]':
          !fixedHeader && layout === 'classic' && footer,

        '!min-h-[calc(100%-var(--tags-view-item-height)-var(--app-content-padding)-var(--app-content-padding)-var(--app-footer-height))]':
          !fixedHeader && layout === 'topLeft' && footer,

        '!min-h-[calc(100%-var(--top-tool-height)-var(--app-content-padding)-var(--app-content-padding))]':
          fixedHeader && layout === 'cutMenu' && footer,

        '!min-h-[calc(100%-var(--top-tool-height)-var(--app-content-padding)-var(--app-content-padding)-var(--tags-view-item-height))]':
          !fixedHeader && layout === 'cutMenu' && footer
      }
    ]"
  >
    <router-view v-if="routerAlive">
      <template #default="{ Component, route: routeProps }">
        <keep-alive :include="getCaches">
          <component :is="Component" :key="getRouteKey(routeProps)" />
        </keep-alive>
      </template>
    </router-view>
  </section>
  <!-- <Footer v-if="footer" /> -->
</template>
