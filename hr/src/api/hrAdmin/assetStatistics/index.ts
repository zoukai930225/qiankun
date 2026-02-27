import request from '@/config/axios'

const prefix = '/api/asset/confirmationRecord'

// 资产分类统计
export const getAssetStatistics = (params) => {
  return request.get({ url: `${prefix}/getAssetStatistics`, params })
}

// 资产统计列表
export const getAssetPage = (data) => {
  return request.post({ url: `${prefix}/statisticsPage`, data })
}

// 添加资产确认记录，一次可以添加多个
export const addAssetConfirms = (params) => {
  return request.get({ url: `${prefix}/add`, params })
}

// 个人资产确认列表
export const getSingleAssetPage = (params) => {
  return request.get({ url: `${prefix}/page`, params })
}

// 资产确认
export const addAssetConfirmById = (params) => {
  return request.get({ url: `${prefix}/confirm`, params })
}
//资产明细
const prefix2 = '/api/fixedAsset/detail'

// 个人资产明细分页列表
export const getAssetDetailPage = (data) => {
  return request.post({ url: `${prefix2}/page`, data })
}

// 批量释放资产明细
export const batchDetailAssetDetail = (params) => {
  return request.get({ url: `${prefix2}/returnAsset`, params })
}

// 获取资产确认用户列表
export const getAssetConfirmationUsers = (params) => {
  return request.get({ url: `/api/asset/confirmationRecord/getAssetConfirmationUsers`, params })
}