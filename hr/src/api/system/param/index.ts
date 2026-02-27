import request from '@/config/axios'

export type DynamicParamTypeVO = {
  id: string | number | undefined
  typeKey: string //类型key
  typeName: string
  typeValue: string
  description: string
  startDate: string
  endDate: string
  warehoustId: string // 仓库ID
  storeId: string // 店铺ID
  dateRange: Array<string>
}

// 查询系统动态参数列表
export const getDynamicParamTypePage = (params: PageParamNew) => {
  return request.get({ url: '/api/dynamic/params/list', params })
}

// 查询系统动态参数详情
export const getDynamicParamType = (id: string) => {
  return request.get({ url: `/api/dynamic/params/get/${id}` })
}

// 新增系统动态参数
export const createDynamicParamType = (data: DynamicParamTypeVO) => {
  return request.post({ url: '/api/dynamic/params/save', data })
}

// 修改系统动态参数
export const updateDynamicParamType = (data: DynamicParamTypeVO) => {
  return request.post({ url: '/api/dynamic/params/save', data })
}

// 删除系统动态参数
export const deleteDynamicParamType = (id: string) => {
  return request.get({ url: `/api/dynamic/params/delete/${id}` })
}

// ---------复制功能---------
// 根据指定日期查询动态参数
export const getDynamicParamTypeByDate = (params) => {
  return request.get({ url: `/api/dynamic/params/getByDate`, params })
}

// 复制动态参数
export const copyDynamicParamType = (data) => {
  return request.post({ url: `/api/dynamic/params/copy`, data })
}
