import request from '@/config/axios'
//渠道总览新接口

const channelOverviewApi = '/api/bi/channelOverview'

// 获得综合指标（新）
export const comprehensiveIndicators = (params) => {
  return request.get({ url: `${channelOverviewApi}/comprehensiveIndicators`, params })
}

//总览数据-渠道列表（新）
export const getChannelList = (params) => {
  return request.get({ url: `${channelOverviewApi}/overviewDate/channelList`, params })
}

//总览数据-店铺列表（新）
export const getStoreList = (params) => {
  return request.get({ url: `${channelOverviewApi}/overviewDate/storeList`, params })
}

//总览数据-店铺列表-导出（新）
export const exportStoreList = (params) => {
  return request.download({ url: `${channelOverviewApi}/overviewDate/storeList/export`, params })
}

//总览数据-渠道列表-导出（新）
export const exportChannelList = (params) => {
  return request.download({ url: `${channelOverviewApi}/overviewDate/channelList/export`, params })
}
