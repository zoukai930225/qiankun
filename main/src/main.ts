// 引入unocss css
import '@/plugins/unocss'
import 'uno.css'

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

import { createApp } from 'vue'

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

// 创建实例
const setupAll = async () => {
  const app = createApp(App)

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

  await router.isReady()
  VxeUIAll.use(VXETablePluginElement)

  // @ts-ignore
  app.use(Menus)
  app.use(VueDOMPurifyHTML)
  app.use(horizontalScroll)
  app.use(VueVirtualScroller)

  app.use(VxeUIAll)

  app.use(VxeUITable)

  app.mount('#app');

  // import.meta.env.VITE_DETECTION === 'true' && autoRefresh();
}

setupAll()

Logger.prettyPrimary(`欢迎使用`, import.meta.env.VITE_APP_TITLE)
