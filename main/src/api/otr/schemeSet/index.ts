import request from '@/config/axios'

// 分页查询
export const getDataList = (params) => {
  return request.get({ url: '/api/otr/plan/list', params })
}

// 新增和修改方案
export const addOrUpdateData = (data) => {
  return request.post({ url: '/api/otr/plan/createOrUpdate', data })
}
// 删除
export const deleteData = (id) => {
  return request.post({ url: `/api/otr/plan/delete/${id}` })
}
// 根据id查询
export const getDataById = (id) => {
  return request.get({ url: `/api/otr/plan/getById/${id}` })
}

// 获取所有活动列表
export const getActivelyById = (id, params) => {
  return request.get({ url: `/api/otr/plan/getActively/${id}`, params })
}
