import request from '@/config/axios'

export interface ThirdPlatformConfigVO {
  id: string
  platform: string
  appId: string
  appSecret: string
  serverUrl: string
  redirectUri: string
  authCode: string // 授权码
  privateKey: string // 支付宝应用私钥
  alipayPublicKey: string // 支付宝公钥
  appAuthToken: string // 方应用授权令牌
  appKey: string // wdt 接口账号
  sid: string //wdt 卖家账号
  config: string //其它配置
  configInfo: Object // 其它配置对象
  status: Number // 状态 1启用 0 禁用
}

// 查询列表
export const getThirdPlatformConfigPage = (params: PageParamNew) => {
  return request.post({ url: '/api/third/platform/configure/list', params })
}
// 查询详情
export const getThirdPlatformConfig = (id: string) => {
  return request.get({ url: `/api/third/platform/configure/get/${id}` })
}

// 新增、修改
export const createOrUpdateThirdPlatformConfig = (data: any) => {
  return request.post({ url: '/api/third/platform/configure/saveOrUpdate', data })
}

// 删除
export const deleteThirdPlatformConfig = (id: string) => {
  return request.get({ url: `/api/third/platform/configure/delete/${id}` })
}

// 更新状态
export const updateThirdPlatformConfigStatus = (id: string, status: Number) => {
  const data = { id, status }
  return request.post({ url: `/api/third/platform/configure/updateStatus`, data })
}

// 更新授权码
export const updateThirdPlatformConfigAuthCode = (platform: string, authCode: string) => {
  const data = { platform, authCode }
  return request.post({ url: `/api/third/platform/configure/updateAuthCode`, data })
}
