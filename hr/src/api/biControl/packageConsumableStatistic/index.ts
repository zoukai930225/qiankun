import request from '@/config/axios'

const prefix = '/api/packageConsumableStatistic'

// 导出
export const exportList = (params) => {
  return request.download({ url: `${prefix}/export`, params })
}
//列表
export const getList = (params) => {
  return request.get({ url: `${prefix}/list`, params })
}