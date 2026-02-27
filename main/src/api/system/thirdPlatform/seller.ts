import request from '@/config/axios'

export interface ThirdPlatformSellerConfigVO {
  id: string
  storeCode: string //店铺code
  platform: string // 三方平台标识
  sellerName: string // 商家名称
  sellerAuthValue: string // 商家授权值(编码/token
  status: Number // 状态 1启用 0 禁用
}

// 查询列表
export const getThirdPlatformSellerConfigPage = (params: PageParamNew) => {
  return request.post({ url: '/api/third/seller/config/list', params })
}
// 查询详情
export const getThirdPlatformSellerConfig = (id: string) => {
  return request.get({ url: `/api/third/seller/config/get/${id}` })
}

// 新增、修改
export const createOrUpdateThirdPlatformSellerConfig = (data: any) => {
  return request.post({ url: '/api/third/seller/config/saveOrUpdate', data })
}

// 删除
export const deleteThirdPlatformSellerConfig = (id: string) => {
  return request.get({ url: `/api/third/seller/config/delete/${id}` })
}

// 更新状态
export const updateThirdPlatformSellerConfigStatus = (id: string, status: Number) => {
  const data = { id, status }
  return request.post({ url: `/api/third/seller/config/updateStatus`, data })
}
