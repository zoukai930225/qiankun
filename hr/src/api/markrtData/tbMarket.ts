import request from '@/config/axios'

//淘系市场url  /api/taoMarketRank/getCateTree
const taoApi = '/api/taoMarketRank'

// 获取类目树
export const getCateTree = () => {
  return request.get({ url: `${taoApi}/getCateTree` })
}

// 获取列表
export const getList = (params) => {
  return request.get({ url: `${taoApi}/list`, params })
}

// 获取最新日期
export const getLatestDay = () => {
  return request.get({ url: `${taoApi}/getNewestDay` })
}
