import request from '@/config/axios'

const storeGroupApi = '/api/bi/storeGroup'

// 获取店铺分组列表
export const getGroupList = (params) => {
  return request.get({ url: `${storeGroupApi}/list`, params })
}
//新增
export const addGroup = (params) => {
  return request.post({ url: `${storeGroupApi}/addGroup`, params })
}
//编辑
export const editGroup = (params) => {
  return request.post({ url: `${storeGroupApi}/editGroup`, params })
}
//作废
export const invalidGroup = (id) => {
  return request.post({ url: `${storeGroupApi}/invalidGroup/${id}` })
}
//历史记录
export const getGroupHistory = (id, params) => {
  return request.get({ url: `${storeGroupApi}/getGroupHistory/${id}`, params })
}

//更新店铺分组配置排序
export const updateSort = (data) => {
  return request.post({ url: `${storeGroupApi}/updateSort`, data })
}