import request from '@/config/axios'

// 根据登录账户查询高危日志
export const getHighRiskLog = (params) => {
  return request.get({ url: '/api/QianNiuLoginLog/getHighRiskByNick', params })
}

// 查询登录操作日志列表
export const getLoginLogList = (params) => {
  return request.get({ url: '/api/QianNiuLoginLog/queryList', params })
}
// 异常处理
export const handleError = (params) => {
  return request.post({ url: '/api/QianNiuLoginLog/exceptionDispose', data: params })
}
