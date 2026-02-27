import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestHeaders,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios'

import { config } from '@/config/axios/config'
import { getAccessToken, getRefreshToken, getTenantId, removeToken } from '@/utils/auth'

import { menus } from "@/utils";
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import qs from 'qs'
import errorCode from './errorCode'

import { deleteUserCache } from '@/hooks/web/useCache'
import router, { resetRouter } from '@/router'

import { CACHE_KEY, useCache } from '@/hooks/web/useCache'

const { wsCache } = useCache()

const tenantEnable = import.meta.env.VITE_APP_TENANT_ENABLE
const { result_code, base_url, request_timeout } = config

// 需要忽略的提示。忽略后，自动 Promise.reject('error')
const ignoreMsgs = [
  '无效的刷新令牌', // 刷新令牌被删除时，不用提示
  '刷新令牌已过期' // 使用刷新令牌，刷新获取新的访问令牌时，结果因为过期失败，此时需要忽略。否则，会导致继续 401，无法跳转到登出界面
]
// 是否显示重新登录
export const isRelogin = { show: false }
// Axios 无感知刷新令牌，参考 https://www.dashingdog.cn/article/11 与 https://segmentfault.com/a/1190000020210980 实现
// 请求队列
const requestList: any[] = []
// 是否正在刷新中
const isRefreshToken = false
// 请求白名单，无须token的接口
const whiteList: string[] = ['/login', '/refresh-token']

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: base_url, // api 的 base_url
  timeout: request_timeout, // 请求超时时间
  withCredentials: false // 禁用 Cookie 等信息
})

// request拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 是否需要设置 token
    let isToken = (config!.headers || {}).isToken === false
    whiteList.some((v) => {
      if (config.url && config.url.indexOf(v) > -1) {
        return (isToken = false)
      }
    })

    if (getAccessToken() && !isToken) {
      // ; (config as Recordable).headers.Authorization = 'Bearer ' + getAccessToken() // 让每个请求携带自定义token
      ; (config as Recordable).headers.token = getAccessToken() // 让每个请求携带自定义token
    }
    const menuList: any = menus(wsCache.get(CACHE_KEY.ROLE_ROUTERS)).filter((ms: any) => ms.type === 2);
    const tar: any = menuList.find((ms: any) => (router?.currentRoute?.value?.name || '') === ms.componentName);
    tar?.id && ((config as Recordable).headers.menuid = tar.id);
    // 设置租户
    if (tenantEnable && tenantEnable === 'true') {
      const tenantId = getTenantId()
      if (tenantId) (config as Recordable).headers['tenant-id'] = tenantId
    }
    const params = config.params || {}
    const data = config.data || false

    if (params && typeof params === 'object') {
      Object.keys(params).forEach((key) => {
        if (params[key] && typeof params[key] === 'string') {
          params[key] = params[key] && params[key].trim()
        }
      })
    }
    if (data && typeof data === 'object') {
      if (data instanceof FormData) {
        data.forEach((value, key) => {
          let valueObj = value || ''
          if (typeof valueObj === 'string' && isJsonObject(valueObj)) {
            valueObj = JSON.parse(valueObj)
            Object.keys(valueObj).forEach((key) => {
              if (valueObj[key] && typeof valueObj[key] === 'string') {
                valueObj[key] = valueObj[key] && valueObj[key].trim()
              }
            })
            data.set(key, JSON.stringify(valueObj))
          }
        })
      }
      Object.keys(data).forEach((key) => {
        if (data[key] && typeof data[key] === 'string') {
          data[key] = data[key] && data[key].trim()
        }
      })
    }
    if (
      config.method?.toUpperCase() === 'POST' &&
      (config.headers as AxiosRequestHeaders)['Content-Type'] ===
      'application/x-www-form-urlencoded'
    ) {
      config.data = qs.stringify(data)
    }

    if (config.url?.startsWith('/api/otr/')) {
      //人才盘点系统
      config.baseURL = import.meta.env.VITE_BASE_URL_OTR
    }

    if (config.url?.startsWith('/api/am/')) {
      //抽奖系统
      config.baseURL = import.meta.env.VITE_BASE_URL_AM
    }

    if (config.url?.startsWith('/dts/')) {
      config.baseURL = import.meta.env.VITE_BASE_URL_DTS
    }

    if (config.url?.startsWith('/workflow-api')) {
      config.baseURL = import.meta.env.VITE_BASE_URL_WORKFLOW_API
    }

    // if (config.url?.startsWith('/api/workflow')) {
    //   config.baseURL = 'http://47.98.41.207:8089'
    // }

    // get参数编码
    if (config.method?.toUpperCase() === 'GET' && params) {
      config.params = {}
      const paramsStr = qs.stringify(params, { allowDots: true })
      if (paramsStr) {
        config.url = config.url + '?' + paramsStr
      }
    }
    return config
  },
  (error: AxiosError) => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

const isJsonObject = (obj) => {
  try {
    JSON.parse(obj)
    return true
  } catch (error) {
    return false
  }
}

// response 拦截器
service.interceptors.response.use(
  async (response: AxiosResponse<any>) => {
    let { data } = response
    const config = response.config
    if (!data) {
      // 返回“[HTTP]请求没有返回值”;
      throw new Error()
    }
    const { t } = useI18n()
    // 未设置状态码则默认成功状态
    // 二进制数据则直接返回，例如说 Excel 导出
    if (
      response.request.responseType === 'blob' ||
      response.request.responseType === 'arraybuffer'
    ) {
      // 注意：如果导出的响应为 json，说明可能失败了，不直接返回进行下载
      if (response.data.type !== 'application/json') {
        return response.data
      }
      data = await new Response(response.data).json()
    }
    const code = Number(data.code || result_code)
    // 获取错误信息
    const msg = data.msg || data.message || errorCode[code] || errorCode['default']
    if (ignoreMsgs.indexOf(msg) !== -1) {
      // 如果是忽略的错误码，直接返回 msg 异常
      return Promise.reject(msg)
    } else if (code === 401) {
      // 如果未认证，并且未进行刷新令牌，说明可能是访问令牌过期了
      // if (!isRefreshToken) {
      //   isRefreshToken = true
      //   // 1. 如果获取不到刷新令牌，则只能执行登出操作
      //   if (!getRefreshToken()) {
      //     return handleAuthorized()
      //   }
      //   // 2. 进行刷新访问令牌
      //   try {
      //     const refreshTokenRes = await refreshToken()
      //     // 2.1 刷新成功，则回放队列的请求 + 当前请求
      //     setToken((await refreshTokenRes).data.data)
      //     config.headers!.Authorization = 'Bearer ' + getAccessToken()
      //     requestList.forEach((cb: any) => {
      //       cb()
      //     })
      //     requestList = []
      //     return service(config)
      //   } catch (e) {
      //     // 为什么需要 catch 异常呢？刷新失败时，请求因为 Promise.reject 触发异常。
      //     // 2.2 刷新失败，只回放队列的请求
      //     requestList.forEach((cb: any) => {
      //       cb()
      //     })
      //     // 提示是否要登出。即不回放当前请求！不然会形成递归
      //     return handleAuthorized()
      //   } finally {
      //     requestList = []
      //     isRefreshToken = false
      //   }
      // } else {
      //   // 添加到队列，等待刷新获取到新的令牌
      //   return new Promise((resolve) => {
      //     requestList.push(() => {
      //       config.headers!.Authorization = 'Bearer ' + getAccessToken() // 让每个请求携带自定义token 请根据实际情况自行修改
      //       resolve(service(config))
      //     })
      //   })
      // }
    } else if (code === 500) {
      ElMessage.error(t('sys.api.errMsg500'))
      return Promise.reject(new Error(msg))
    } else if (code === 901) {
      ElMessage.error({
        offset: 300,
        dangerouslyUseHTMLString: true,
        message:
          '<div>' +
          t('sys.api.errMsg901') +
          '</div>' +
          '<div> &nbsp; </div>' +
          '<div>参考 https://doc.iocoder.cn/ 教程</div>' +
          '<div> &nbsp; </div>' +
          '<div>5 分钟搭建本地环境</div>'
      })
      return Promise.reject(new Error(msg))
    } else if (code !== 200) {
      if (msg === '无效的刷新令牌' || code === 600) {
        // 600 token已过期
        // hard coding：忽略这个提示，直接登出
        console.log(msg)
        resetRouter() // 重置静态路由表
        deleteUserCache() // 删除用户缓存
        removeToken()
        // 干掉token后再走一次路由让它过router.beforeEach的校验
        window.location.href = window.location.href
      } else {
        ElNotification.error({ title: msg })
      }
      return Promise.reject(data || 'error')
    } else {
      return data
    }
  },
  (error: AxiosError) => {
    console.log('err' + error) // for debug
    let { message } = error
    const { t } = useI18n()
    if (message === 'Network Error') {
      message = t('sys.api.errorMessage')
    } else if (message.includes('timeout')) {
      message = t('sys.api.apiTimeoutMessage')
    } else if (message.includes('Request failed with status code')) {
      message = t('sys.api.apiRequestFailed') + message.substr(message.length - 3)
    }
    if (error.code !== 'ERR_CANCELED') ElMessage.error(message)

    return Promise.reject(error)
  }
)

const refreshToken = async () => {
  axios.defaults.headers.common['tenant-id'] = getTenantId()
  return await axios.post(base_url + '/system/auth/refresh-token?refreshToken=' + getRefreshToken())
}
const handleAuthorized = () => {
  const { t } = useI18n()
  if (!isRelogin.show) {
    // 如果已经到重新登录页面则不进行弹窗提示
    if (window.location.href.includes('login?redirect=')) {
      return
    }
    isRelogin.show = true
    ElMessageBox.confirm(t('sys.api.timeoutMessage'), t('common.confirmTitle'), {
      showCancelButton: false,
      closeOnClickModal: false,
      showClose: false,
      confirmButtonText: t('login.relogin'),
      type: 'warning',
      center: true,
      cancelButtonClass: 'cancelbth',
      confirmButtonClass: 'yepbth',
      customClass: 'custom_class_confirm'
    }).then(() => {
      resetRouter() // 重置静态路由表
      deleteUserCache() // 删除用户缓存
      removeToken()
      isRelogin.show = false
      // 干掉token后再走一次路由让它过router.beforeEach的校验
      window.location.href = window.location.href
    })
  }
  return Promise.reject(t('sys.api.timeoutMessage'))
}
export { service }
