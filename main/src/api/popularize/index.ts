import request from '@/config/axios'

// -----------------------产品表 -----------------------
// 查询列表
export const getPopularizeProductList = (params) => {
  return request.get({ url: '/api/Promotion/pageList', params })
}

// 更新
export const updatePopularizeProduct = (data) => {
  return request.post({ url: '/api/Promotion/update', data })
}

// 批量更新
export const allUpdatePopularizeProduct = (data) => {
  return request.post({ url: '/api/Promotion/updateBatch', data })
}

// -----------------------人群表 -----------------------
// 查询列表
export const getPopularizePeopleList = (params) => {
  return request.get({ url: '/api/PromotionReportHeader/pageList', params })
}

// 更新
export const updatePopularizePeople = (data) => {
  return request.post({ url: '/api/PromotionReportHeader/update', data })
}

// 批量更新
export const allUpdatePopularizePeople = (data) => {
  return request.post({ url: '/api/PromotionReportHeader/updateBatch', data })
}
