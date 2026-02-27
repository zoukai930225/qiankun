import request from '@/config/axios'

// /api/assetApplicationRecord/list 申请审核列表，只显示固定资产类型的
export const getApplicationApprovalList = (data: any) => {
  return request.post({ url: '/api/assetApplicationRecord/list', data })
}

// /api/assetApplicationRecord/get/{id} 根据id获取资产申请信息
export const getApplicationApprovalById = (id: string) => {
  return request.get({ url: `/api/assetApplicationRecord/get/${id}` })
}

// /api/assetApplicationRecord/sh 飞书批量审核,只有固定资产需要审核
export const shApplicationApproval = (data: any) => {
  return request.post({ url: '/api/assetApplicationRecord/sh', data, showLoading: true })
}

// /api/assetArea/getAreaFixedAssetSq
export const getAreaFixedAssetSq = (params: any) => {
  return request.get({ url: `/api/assetArea/getAreaFixedAssetSq`, params })
}
// /api/assetArea/getAreaAssetSh
export const getAreaAssetSh = (params: any) => {
  return request.get({ url: `/api/assetArea/getAreaAssetSh`, params })
}
