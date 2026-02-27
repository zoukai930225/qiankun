import router from './router'
import type { RouteRecordRaw } from 'vue-router'
import { isRelogin } from '@/config/axios/service'
import { getAccessToken } from '@/utils/auth'
import { useTitle } from '@/hooks/web/useTitle'
import { useNProgress } from '@/hooks/web/useNProgress'
import { usePageLoading } from '@/hooks/web/usePageLoading'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { useUserStoreWithOut } from '@/store/modules/user'
import { usePermissionStoreWithOut } from '@/store/modules/permission'
import { useDepartmentStoreWithOut } from '@/store/modules/dept'
import setDetailsRouter from '@/router/modules/details';

const { start, done } = useNProgress()

const { loadStart, loadDone } = usePageLoading()

const parseURL = (
  url: string | null | undefined
): { basePath: string; paramsObject: { [key: string]: string } } => {
  // 如果输入为 null 或 undefined，返回空字符串和空对象
  if (url == null) {
    return { basePath: '', paramsObject: {} }
  }

  // 找到问号 (?) 的位置，它之前是基础路径，之后是查询参数
  const questionMarkIndex = url.indexOf('?')
  let basePath = url
  const paramsObject: { [key: string]: string } = {}

  // 如果找到了问号，说明有查询参数
  if (questionMarkIndex !== -1) {
    // 获取 basePath
    basePath = url.substring(0, questionMarkIndex)

    // 从 URL 中获取查询字符串部分
    const queryString = url.substring(questionMarkIndex + 1)

    // 使用 URLSearchParams 遍历参数
    const searchParams = new URLSearchParams(queryString)
    searchParams.forEach((value, key) => {
      // 封装进 paramsObject 对象
      paramsObject[key] = value
    })
  }

  // 返回 basePath 和 paramsObject
  return { basePath, paramsObject }
}

// 路由不重定向白名单
const whiteList = [
  '/questionnaire',
  '/empty',
  '/login',
  '/social-login',
  '/auth-redirect',
  '/bind',
  '/register',
  '/oauthLogin/gitee',
  '/dataV',
  '/bigScreen',
  '/bigScreen/xhs',
  '/bigScreen/teamPreview',
  '/bigScreen/saleRank',
  '/bigScreen/saleRankExport',
  '/bigScreen/targetProfitRank',
  '/otr/pdf',
  '/otr/pdf/download',
  '/thirdAuth/callback'
]

// 路由加载前
router.beforeEach(async (to, from, next) => {
  start()
  loadStart()
  if (getAccessToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      // 获取所有字典
      const dictStore = useDictStoreWithOut()
      const userStore = useUserStoreWithOut()
      const permissionStore = usePermissionStoreWithOut()
      const departmentStore = useDepartmentStoreWithOut()

      if (!dictStore.getIsSetDict) {
        await dictStore.setDictMap()
        await dictStore.setDesignFields()
      }
      // 获取部门数据
      if (!departmentStore.isDepartmentDataLoaded) {
        // await departmentStore.getDepartmentDataAction()
      }
      // 获取所有人员信息列表
      if (!departmentStore.isDesignerListLoaded) {
        // await departmentStore.getDesignerList()
      }
      if (!userStore.getIsSetUser) {
        isRelogin.show = true
        await userStore.setUserInfoAction()
        isRelogin.show = false
        // 后端过滤菜单
        await permissionStore.generateRoutes()
        const details: any = setDetailsRouter();

        [...permissionStore.getAddRouters, ...details].forEach((route) => {
          router.addRoute(route as unknown as RouteRecordRaw) // 动态添加可访问路由表
        })

        let redirectPath = from.query.redirect || to.path
        if (to.path === '/bi') {
          redirectPath = '/bi/index'
        }
        if (to.path === '/otr') {
          redirectPath = '/otr/index'
        }
        // 修复跳转时不带参数的问题
        const redirect = decodeURIComponent(redirectPath as string)
        const { basePath, paramsObject: query } = parseURL(redirect)
        const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect, query }
        next(nextData)
      } else {
        next()
      }
    }
  } else {
    if (
      whiteList.indexOf(to.path) !== -1 ||
      (to.path.startsWith('/bigScreen') && to.path !== '/bigScreen/newGoodProgressBoard')
    ) {
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
    }
  }
})

router.afterEach((to) => {
  useTitle(to?.meta?.title as string)
  done() // 结束Progress
  loadDone()
})
