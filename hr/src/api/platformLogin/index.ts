import request from '@/config/axios'

// 查询列表
export const getPlatformList = (params) => {
  return request.get({ url: '/api/platform/list', params })
}
// 删除操作
export const deletePlatform = (id) => {
  return request.get({ url: `/api/platform/delete/${id}` })
}
// 获取详情
export const getPlatformDetail = (id) => {
  return request.get({ url: `/api/platform/get/${id}` })
}
// 新增/编辑
export const savePlatform = (data) => {
  return request.post({ url: '/api/platform/save', data: data })
}
