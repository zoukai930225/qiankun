import request from '@/config/axios'
//中通数据匹配
export const billMatch = (data) => {
  return request.post({ url: '/api/billMatch/match', data })
}
//匹配数据列表
export const list = (params) => {
  return request.get({ url: '/api/billMatch/list', params })
}
//匹配记录列表
export const billMatchRecordList = (params) => {
  return request.get({ url: '/api/billMatchRecord/list', params })
}

//匹配数据导出
export const exportList = (params) => {
  return request.get({ url: '/api/billMatch/exportList', params })
}