import request from '@/config/axios'

// 三方业务
// 保存、编辑三方业务数据
export const saveThirdPartyFields = (data: any) => {
  return request.post({ url: '/api/third/business/saveOrUpdate', data })
}
// 根据ID获取三方业务数据
export const getThirdPartyFieldsbyId = (id: any) => {
  return request.get({ url: `/api/third/business/get/${id}` })
}
// 查询列表
export const getThirdPartyFieldsList = (params: any) => {
  return request.post({ url: '/api/third/business/list', params })
}
// 删除
export const deleteThirdPartyFields = (id: any) => {
  return request.get({ url: `/api/third/business/delete/${id}` })
}

// 三方业务接口
// 获取列表
export const getThirdPartyFieldsApiList = (params: any) => {
  return request.post({ url: '/api/third/business/field/list', params })
}
// 删除
export const deleteThirdPartyFieldsApi = (id: any) => {
  return request.get({ url: `/api/third/business/field/delete/${id}` })
}
// 根据ID获取三方业务字段数据
export const getThirdPartyFieldsApiById = (id: any) => {
  return request.get({ url: `/api/third/business/field/get/${id}` })
}
// 保存、编辑三方业务字段数据
export const saveThirdPartyFieldsApi = (data: any) => {
  return request.post({ url: '/api/third/business/field/saveOrUpdate', data })
}
//快速录入三方业务字段数据
export const quickAddThirdPartyFieldsApi = (data: any) => {
  return request.post({ url: '/api/third/business/field/jsonSave', data })
}
