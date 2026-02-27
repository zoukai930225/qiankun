import request from '@/config/axios'
import { getRefreshToken } from '@/utils/auth'
import type { UserLoginVO } from './types'

export interface SmsCodeVO {
  mobile: string
  scene: number
}

export interface SmsLoginVO {
  mobile: string
  code: string
}

// 登录
export const login = (data: UserLoginVO) => {
  return request.post({ url: '/api/login', data })
}

// 飞书登录
// type LOGIN - 登录 FIXED - 固定资产 companyCode - 公司编码 appId - 应用ID redirectUrl - 跳转地址
export const feishuAuthLogin = (
  code: string,
  type: string = 'LOGIN',
  companyCode,
  appId,
  redirectUrl
) => {
  return request.post({
    url: '/api/feiShu/Login',
    data: { type, code, companyCode, appId, redirectUrl }
  })
}

// 飞书登录APPID
export const feishuAuthLoginAppID = () => {
  return request.get({ url: `/api/config/getCode/FEISHU_COMMON_APP_ID` })
}

// 刷新访问令牌
export const refreshToken = () => {
  return request.post({ url: '/system/auth/refresh-token?refreshToken=' + getRefreshToken() })
}

// 使用租户名，获得租户编号
export const getTenantIdByName = (name: string) => {
  return request.get({ url: '/system/tenant/get-id-by-name?name=' + name })
}

// 使用租户域名，获得租户信息
export const getTenantByWebsite = (website: string) => {
  return request.get({ url: '/system/tenant/get-by-website?website=' + website })
}

// 登出
export const loginOut = () => {
  return request.post({ url: '/api/logout' })
}

// 获取用户权限信息
export const getInfo = () => {
  return request.get({ url: '/api/permission/selfInfo?menuEnv=1' })
}

//获取登录验证码
export const sendSmsCode = (data: SmsCodeVO) => {
  return request.post({ url: '/system/auth/send-sms-code', data })
}

// 短信验证码登录
export const smsLogin = (data: SmsLoginVO) => {
  return request.post({ url: '/system/auth/sms-login', data })
}

// 社交授权的跳转
export const socialAuthRedirect = (type: number, redirectUri: string) => {
  return request.get({
    url: '/system/auth/social-auth-redirect?type=' + type + '&redirectUri=' + redirectUri
  })
}
// 获取验证图片以及 token
export const getCode = (data) => {
  return request.postOriginal({ url: 'system/captcha/get', data })
}

// 滑动或者点选验证
export const reqCheck = (data) => {
  return request.postOriginal({ url: 'system/captcha/check', data })
}

// 飞书登录返回列表
export const feishuAuthLoginList = () => {
  return request.get({ url: '/api/config/feiShuLoginInfo' })
}
