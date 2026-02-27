/*
 * @Date: 2024-07-29 00:18:58
 */
import { service } from './service'
import { config } from './config'
import { useLoadingStore } from '@/store/modules/loading'

const { default_headers } = config

const request = (option: any) => {
  const {
    url,
    method,
    params,
    data,
    headersType,
    responseType,
    showLoading = false,
    signal,
    ...config
  } = option

  // 控制全局loading
  const loadingStore = useLoadingStore()
  if (showLoading) {
    loadingStore.showLoading()
  }

  return service({
    url: url,
    method,
    params,
    data,
    ...config,
    responseType: responseType,
    headers: {
      'Content-Type': headersType || default_headers
    },
    signal
  }).finally(() => {
    if (showLoading) {
      loadingStore.hideLoading()
    }
  })
}

export default {
  get: async <T = any>(option: any) => {
    const res = await request({ method: 'GET', ...option })
    return res.data as unknown as T
  },
  getOriginal: async <T = any>(option: any) => {
    const res = await request({ method: 'GET', ...option })
    return res as unknown as T
  },
  post: async <T = any>(option: any) => {
    const res = await request({ method: 'POST', ...option })
    return res.data as unknown as T
  },
  formPost: async <T = any>(option: any) => {
    option.headersType = 'multipart/form-data'
    const res = await request({ method: 'POST', ...option })
    return res.data as unknown as T
  },
  formPostOriginal: async <T = any>(option: any) => {
    option.headersType = 'multipart/form-data'
    const res = await request({ method: 'POST', ...option })
    return res as unknown as T
  },
  postOriginal: async <T = any>(option: any) => {
    const res = await request({ method: 'POST', ...option })
    return res as T
  },
  delete: async <T = any>(option: any) => {
    const res = await request({ method: 'DELETE', ...option })
    return res.data as unknown as T
  },
  deleteOriginal: async <T = any>(option: any) => {
    const res = await request({ method: 'DELETE', ...option })
    return res as unknown as T
  },
  put: async <T = any>(option: any) => {
    const res = await request({ method: 'PUT', ...option })
    return res.data as unknown as T
  },
  putOriginal: async <T = any>(option: any) => {
    const res = await request({ method: 'PUT', ...option })
    return res as unknown as T
  },
  download: async <T = any>(option: any) => {
    const res = await request({ method: 'GET', responseType: 'blob', ...option })
    return res as unknown as Promise<T>
  },
  downloadPost: async <T = any>(option: any) => {
    const res = await request({ method: 'POST', responseType: 'blob', ...option })
    return res as unknown as Promise<T>
  },
  formPostOriginalDownload: async <T = any>(option: any) => {
    option.headersType = 'multipart/form-data'
    const res = await request({ method: 'POST', responseType: 'blob', ...option })
    return res as unknown as T
  },
  upload: async <T = any>(option: any) => {
    option.headersType = 'multipart/form-data'
    const res = await request({ method: 'POST', ...option })
    return res as unknown as Promise<T>
  }
}
