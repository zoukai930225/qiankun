//渠道
import request from '@/config/axios'

const prefix = '/api/bi/v1/channel'


// 渠道总览/渠道详情 - 综合指标
export const getCompositeIndicator = (params) => {
  return request.get({ url: `${prefix}/compositeIndicator`, params })
}

//渠道总览店铺列表
export const getOverviewDataStoreList = (params) => {
  return request.get({ url: `${prefix}/overviewDataStoreList`, params })
}

//渠道总览渠道列表
export const getOverviewDataChannelList = (params) => {
  return request.get({ url: `${prefix}/overviewDataChannelList`, params })
}
//获取店铺/渠道
export const getBiQuery = () => {
  return request.get({ url: `${prefix}/biQuery` })
}

//渠道总览经营数据
export const getEngagedDatalList = (params) => {
  return request.get({ url: `${prefix}/engagedData`, params })
}

//渠道总览 - 总览数据 - 渠道列表导出
export const overviewDataChannelListExport = (params) => {
  return request.downloadPost({
    url: `${prefix}/overviewDataChannelList/export`,
    params
  })
}

//渠道总览 - 店铺列表-导出
export const overviewDataStoreListExport = (params) => {
  return request.downloadPost({
    url: `${prefix}/overviewDataStoreList/export`,
    params
  })
}

//渠道总览业绩对比
export const getPerformanceComparison = (params) => {
  return request.get({ url: `${prefix}/performanceComparison`, params })
}
//品类分析 - 销售构成
export const geSalesConstitute = (params) => {
  return request.get({ url: `${prefix}/categoryAnalyse/salesConstitute`, params })
}

// 渠道总览 - 品类分析 - 销售构成 - 看商品
export const getSalesConstituteLookGoods = (params) => {
  return request.get({ url: `${prefix}/categoryAnalyse/salesConstitute/lookGoods`, params })
}

// 渠道总览 - 品类分析 - 销售构成 - 看店铺
export const getSalesConstituteLookStore = (params) => {
  return request.get({ url: `${prefix}/categoryAnalyse/salesConstitute/lookStore`, params })
}

// 渠道总览 - 品类分析 - 销售走势
export const getSalesTrend = (params) => {
  return request.get({ url: `${prefix}/categoryAnalyse/salesTrend`, params })
}
// 渠道总览 - 获取类目-分渠道
export const getChannelCategory = (params = {}) => {
  return request.get({ url: `${prefix}/channelCategory`, params })
}

//渠道总览 - 热销商品
export const getHotSellingProducts = (params) => {
  return request.get({ url: `${prefix}/hotSellingProducts`, params })
}

//渠道总览 - 店铺分组
export const getStoreGroup = (params) => {
  return request.get({ url: `${prefix}/storeGroup`, params })
}

//渠道总览 - 经营数据-导出
export const engagedDataExport = (params) => {
  return request.downloadPost({
    url: `${prefix}/engagedData/export`,
    params
  })
}

//渠道总览 - 业绩对比-导出
export const performanceComparisonExport = (params) => {
  return request.downloadPost({
    url: `${prefix}/performanceComparison/export`,
    params
  })
}

//渠道总览 - 品类分析 - 销售构成-导出
export const salesConstituteExport = (params) => {
  return request.downloadPost({
    url: `${prefix}/categoryAnalyse/salesConstitute/export`,
    params
  })
}

//渠道总览 - 品类分析 - 销售走势-导出
export const salesTrendExport = (params) => {
  return request.downloadPost({
    url: `${prefix}/categoryAnalyse/salesTrend/export`,
    params
  })
}

//渠道总览 - 热销商品-导出
export const hotSellingProductsExport = (params) => {
  return request.downloadPost({
    url: `${prefix}/hotSellingProducts/export`,
    params
  })
}

export const getChannelStore = (params = {}) => {
  return request.get({ url: `${prefix}/listStore`, params })
}

export const getAllChannelStore = (params = {}) => {
  return request.get({ url: `${prefix}/listAllStore`, params })
}