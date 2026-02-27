import request from '@/config/axios'

export interface IProgramType {
  id: string
  typeCode: string // 类型编码
  typeName: string // 类型名称
  typeCategory: string // 类型类别
  typeDbName: string // 数据库名称
  businessScenario: string // 业务场景
}
// 新增
export const saveProgramType = (data) => {
  return request.post({ url: '/api/skGroupType/save', data: data })
}

// 查询
export const getProgramTypeList = (params) => {
  return request.get({ url: '/api/skGroupType/list', params })
}

// 回显
export const getProgramType = (params) => {
  return request.get({ url: '/api/skGroupType/getById', params })
}

// 修改
export const updateProgramType = (data) => {
  return request.post({ url: '/api/skGroupType/update', data: data })
}

// 删除
export const deleteProgramType = (params) => {
  return request.get({ url: '/api/skGroupType/deleted', params })
}

// 店铺管理查看参数列表
export const getShopParamsList = (params) => {
  return request.get({ url: '/api/skGroupType/getParamList', params })
}

// 重置参数
export const resetShopParams = (data) => {
  return request.post({ url: '/api/sk-dynamic-param/resetParam', data })
}
