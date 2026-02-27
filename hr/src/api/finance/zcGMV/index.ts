import request from '@/config/axios'

//  种草商品GMV监控列表
export const getList = (params) => {
  return request.get({ url: '/api/grassPlantingGMVMonitoring/list', params })
}

//  种草商品GMV监控  详情
export const getDetail = (params) => {
  return request.get({ url: '/api/grassPlantingGMVMonitoring/detail', params })
}

// 种草产品列表
export const getGrassList = (params) => {
  return request.get({ url: '/api/grassPlantingGMVMonitoring/getGrassList', params })
}

// 种草商品数据导出
export const exportList = (params) => {
  return request.download({ url: '/api/grassPlantingGMVMonitoring/export', params })
}

// 数据同步
export const syncDataList = (params?) => {
  return request.get({ url: '/api/grassPlantingGMVMonitoring/syncData', params })
}
