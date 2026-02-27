// 引入unocss css
import '@/plugins/unocss'

// 导入全局的svg图标
import '@/plugins/svgIcon'

// 初始化多语言
import { setupI18n } from '@/plugins/vueI18n'

// 引入状态管理
import { setupStore } from '@/store'

// 全局组件
import { setupGlobCom } from '@/components'

// 引入 element-plus
import { setupElementPlus } from '@/plugins/elementPlus'

// 引入 form-create
import { setupFormCreate } from '@/plugins/formCreate'

// 引入全局样式
import '@/styles/index.scss'

// 引入动画
import '@/plugins/animate.css'

// 引入ElementPlus 图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import horizontalScroll from 'el-table-horizontal-scroll'

import { autoRefresh } from '@/utils/auto-update';

// 路由
import router, { setupRouter } from '@/router'

// 权限
import { setupAuth } from '@/directives'

import { createApp, type App as VueApp } from 'vue'

import App from './App.vue'

import './permission'

import Logger from '@/utils/Logger'

import VueDOMPurifyHTML from 'vue-dompurify-html' // 解决v-html 的安全隐患'
import Menus from 'vue3-menus'

import '@/utils/preventDefault' // 清除默认行为

import VxeUIAll from 'vxe-pc-ui'
import 'vxe-pc-ui/es/style.css'

import VxeUITable from 'vxe-table'
import VXETablePluginElement from 'vxe-table-plugin-element'
import 'vxe-table-plugin-element/dist/style.css'
import 'vxe-table/es/style.css'

// 从 Element Plus 中同时引入组件和其内部使用的 dayjs 实例，避免打包后出现多个 dayjs 实例不一致的问题
import { ElCollapseTransition, dayjs } from 'element-plus'

// 全局配置 dayjs：设置中文且周一为一周的第一天，保证 Element Plus 日历周起始日正确
import 'dayjs/locale/zh-cn'
import updateLocale from 'dayjs/plugin/updateLocale'

dayjs.extend(updateLocale)
dayjs.locale('zh-cn')
dayjs.updateLocale('zh-cn', { weekStart: 1 })

import VueVirtualScroller from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

import 'uno.css'
import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper'

let app: VueApp<Element> | null = null

const render = async (props: any = {}) => {
  const { container } = props
  const isQiankun = !!qiankunWindow.__POWERED_BY_QIANKUN__

  // 避免在同一个容器上重复挂载
  if (app) {
    app.unmount()
    app = null
  }

  app = createApp(App)

  await setupI18n(app)

  setupStore(app)

  setupGlobCom(app)

  setupElementPlus(app)

  setupFormCreate(app)

  setupRouter(app)

  setupAuth(app)

  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

  app.component((ElCollapseTransition as any).name, ElCollapseTransition)

  VxeUIAll.use(VXETablePluginElement)

  // @ts-ignore
  app.use(Menus)
  app.use(VueDOMPurifyHTML)
  app.use(horizontalScroll)
  app.use(VueVirtualScroller)

  app.use(VxeUIAll)

  app.use(VxeUITable)

  const mountContainer = (container
    ? (container.querySelector('#app') as HTMLElement | null)
    : (document.querySelector('#app') as HTMLElement | null))

  if (!mountContainer) {
    console.error('[hrAdmin] mount container #app not found')
    return
  }

  if (isQiankun) {
    // Qiankun 模式：先挂载应用再异步等待路由就绪，避免 mount 生命周期超时
    app.mount(mountContainer)
    router.isReady().then(() => {
      console.log('[hrAdmin] router ready (qiankun)')
    })
  } else {
    await router.isReady()
    app.mount(mountContainer)
    Logger.prettyPrimary(`欢迎使用`, import.meta.env.VITE_APP_TITLE)
  }
}

renderWithQiankun({
  async bootstrap() {
    console.log('[hrAdmin] qiankun bootstrap')
  },
  async mount(props) {
    console.log('[hrAdmin] qiankun mount', props)
    await render(props)
  },
  async unmount() {
    console.log('[hrAdmin] qiankun unmount')
    if (app) {
      app.unmount()
      app = null
    }
  }
})

// 独立运行时直接渲染
if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render()
}
