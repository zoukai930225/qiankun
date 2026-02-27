/*
 * @Date: 2024-08-16 11:16:49
 */
import request from '@/config/axios'
import download from '@/utils/download'

// 获取商品总览列表
export const getGoodsOverviewList = (params) => {
  return request.get({ url: '/api/bi/goods/goodsOverviewList', params })
}

// 获取商品数据汇总
export const getProductOverviewSum = (params) => {
  return request.get({ url: '/api/bi/goods/productOverviewSum', params })
}

// 根据商品ID，支付时间返回 省的金额数据
export const getBiGoodsAmountByArea = (params) => {
  return request.get({ url: '/api/bi/goods/getAmountByArea', params })
}

// 根据商品ID，支付时间，所在的省code 返回 市的金额数据
export const getBiGoodsCityAmountByArea = (params) => {
  return request.get({ url: '/api/bi/goods/getCityAmountByArea', params })
}

// 销售时段分析
export const getBiGoodsSalesPeriod = (params) => {
  return request.get({ url: '/api/bi/goods/salesPeriod', params })
}

// 销售地域分析-按城市

export const getBiGoodsSalesRegionalAnalysisCity = (params) => {
  return request.get({ url: '/api/bi/goods/salesRegionalAnalysis/city', params })
}

// 销售地域分析-按省份

export const getBiGoodsSalesRegionalAnalysisProvince = (params) => {
  return request.get({ url: '/api/bi/goods/salesRegionalAnalysis/province', params })
}
// 根据商品ID获取商品基本信息
export const getBiGoodsById = (id?: string) => {
  return request.get({ url: `/api/bi/goods/getInfo?param=${id}` })
}

// 商品库存明细
export const getWdtInventoryDetails = (params) => {
  return request.get({ url: `/api/wdt-inventory-details/list`, params })
}

// 查询商品总库存综合指标
export const getWdtInventoryDetailsQuota = () => {
  return request.get({ url: `/api/wdt-inventory-details/quota` })
}

// 渠道布局分析列表
export const getBiGoodsGetChannelLayoutGoods = (params) => {
  return request.get({ url: '/api/bi/goods/getChannelLayout/goods', params })
}

// SKU全渠道分析
export const getBiGoodscChannelLayoutSku = (params) => {
  return request.get({ url: '/api/bi/goods/channelLayout/sku', params })
}

// sku销售分析列表
export const getBiGoodsSalesSku = (params) => {
  return request.get({ url: '/api/bi/goods/sales/sku', params })
}

// sku销量走势
export const getBiGoodsSalesSkuTrend = (params) => {
  return request.get({ url: '/api/bi/goods/sales/sku/trend', params })
}

// 商品-商品全景分析-总览数据
export const getBiGoodsOverviewGoods = (params) => {
  return request.get({ url: '/api/bi/goods/overview/goods', params })
}

// 商品-总览-导出
export const biGoodsOverviewExport = (params) => {
  return request.download({ url: '/api/bi/goods/overview/export', params })
}
export const biGoodsOverviewExport2 = (params) => {
  return request.download({ url: '/api/bi/goods/overview/exportdeatil', params })
}
// 商品-总览数据-汇总
export const getBiGoodsOverviewGoodsSum = (params) => {
  return request.get({ url: '/api/bi/goods/overview/goods/sum', params })
}

// 商品运营分析 - 获取推广列表
export const getBiGoodsOperationalPromotion = (params) => {
  return request.get({ url: '/api/bi/goods/operational/promotion', params })
}

// 商品运营分析 - 根据计划id获取关键词列表
export const getBiGoodsOperationalGetKeyWordsByPlanId = (params) => {
  return request.get({ url: '/api/bi/goods/operational/getKeyWordsByPlanId', params })
}

// 商品运营分析 - 根据计划id获取人群列表
export const getBiGoodsOperationalGetPeoplesByPlanId = (params) => {
  return request.get({ url: '/api/bi/goods/operational/getPeoplesByPlanId', params })
}

// 日期选择最大时间
export const queryBiMaxDate = () => {
  return request.get({ url: '/api/bi/goods/queryBiMaxDate' })
}

// 获得综合指标
export const compositeIndicators = () => {
  return request.get({ url: '/api/bi/goods/compositeIndicators' })
}

// 商品全景分析-品类分析-销售构成-看商品
export const lookGoods = (params) => {
  return request.get({
    url: '/api/bi/goods/storeOverview/categoryAnalyse/salesConstitute/lookGoods',
    params
  })
}

// 流量来源统计
export const goodsTrafficStatic = (params) => {
  return request.get({ url: '/api/bi/goods/traffic/static', params })
}

// 搜索分析统计
export const goodsSearchStatic = (params) => {
  return request.get({ url: '/api/bi/goods/search/static', params })
}

// 商品标签保存
export const saveGoodsTag = (data) => {
  return request.post({ url: '/api/goods-person-responsibility/saveGoodsTag', data })
}

// 商品全部标签
export const queryTag = (params) => {
  return request.get({ url: '/api/tag/queryTag', params })
}

// 获取商品标签
export const responsibilityList = (params) => {
  return request.get({ url: '/api/goods-person-responsibility/list', params })
}

// /api/bi/v1/goodsOverview/compositeIndicators 综合指标
export const getBiGoodsOverviewCompositeIndicators = (params?: any) => {
  return request.get({ url: '/api/bi/v1/goodsOverview/compositeIndicators', params })
}

// /api/bi/v1/goodsOverview/overview/exportdeatil 导出(包含明细)
export const goodsOverviewExportDetail = (params) => {
  return request.download({
    url: '/api/bi/v1/goodsOverview/overview/exportdeatil',
    params,
    showLoading: true
  })
}

// /api/bi/v1/goodsOverview/overview/export 导出(不包含明细)
export const goodsOverviewExport = (params) => {
  return request.download({
    url: '/api/bi/v1/goodsOverview/overview/export',
    params,
    showLoading: true
  })
}

// /api/bi/v1/goodsOverview/goodsOverviewList 商品总览
export const getBiGoodsOverviewGoodsList = (params) => {
  return request.get({ url: '/api/bi/v1/goodsOverview/goodsOverviewList', params })
}

// /api/bi/v1/goodsOverview/queryBiMaxDate 查询BI存在数据最大日期
export const queryGoodsOverviewBiMaxDate = () => {
  return request.get({ url: '/api/bi/v1/goodsOverview/queryBiMaxDate' })
}

// /api/bi/v1/channel/channelCategory
export const getChannelCategory = () => {
  return request.get({ url: '/api/bi/v1/channel/channelCategory' })
}

// /api/bi/v1/goodsOverviewAnalysis/overview/goods/sum 总览数据-汇总
export const getBiGoodsOverviewAnalysisGoodsSum = (params) => {
  return request.get({
    url: '/api/bi/v1/goodsOverviewAnalysis/overview/goods/sum',
    params,
    showLoading: true
  })
}

// /api/bi/v1/goodsOverviewAnalysis/overview/goods 总览数据-列表
export const getBiGoodsOverviewAnalysisGoods = (params) => {
  return request.get({
    url: '/api/bi/v1/goodsOverviewAnalysis/overview/goods',
    params,
    showLoading: true
  })
}

// /api/bi/v1/goodsOverviewAnalysis/overview/goods/export 总览数据-导出
export const goodsOverviewAnalysisExport = (params) => {
  return request.download({
    url: '/api/bi/v1/goodsOverviewAnalysis/overview/goods/export',
    params,
    showLoading: true
  })
}

// /api/bi/v1/goodsOverviewAnalysis/getChannelLayout/goods 渠道布局分析
export const getBiGoodsOverviewAnalysisGetChannelLayoutGoods = (params) => {
  return request.get({
    url: '/api/bi/v1/goodsOverviewAnalysis/getChannelLayout/goods',
    params,
    showLoading: true
  })
}

// /api/bi/v1/goodsOverviewAnalysis/getChannelLayout/goods/export 渠道布局分析-导出
export const goodsOverviewAnalysisGetChannelLayoutGoodsExport = (params) => {
  return request.download({
    url: '/api/bi/v1/goodsOverviewAnalysis/getChannelLayout/goods/export',
    params,
    showLoading: true
  })
}

// /api/bi/v1/goodsOverviewAnalysis/channelLayout/sku SKU全渠道分析
export const getBiGoodsOverviewAnalysisChannelLayoutSku = (params) => {
  return request.get({
    url: '/api/bi/v1/goodsOverviewAnalysis/channelLayout/sku',
    params,
    showLoading: true
  })
}

// /api/bi/v1/goodsOverviewAnalysis/getChannelLayout/sku/export
export const goodsOverviewAnalysisGetChannelLayoutSkuExport = (params) => {
  return request.download({
    url: '/api/bi/v1/goodsOverviewAnalysis/getChannelLayout/sku/export',
    params,
    showLoading: true
  })
}

// /api/bi/v1/goodsOverviewAnalysis/sales/sku
export const getBiGoodsOverviewAnalysisSalesSku = (params) => {
  return request.get({
    url: '/api/bi/v1/goodsOverviewAnalysis/sales/sku',
    params,
    showLoading: true
  })
}

// /api/bi/v1/goodsOverviewAnalysis/sales/sku/export
export const goodsOverviewAnalysisSalesSkuExport = (params) => {
  return request.download({
    url: '/api/bi/v1/goodsOverviewAnalysis/sales/sku/export',
    params,
    showLoading: true
  })
}

// /api/bi/v1/goodsOverviewAnalysis/sales/sku/trend
export const getBiGoodsOverviewAnalysisSalesSkuTrend = (params) => {
  return request.get({
    url: '/api/bi/v1/goodsOverviewAnalysis/sales/sku/trend',
    params,
    showLoading: true
  })
}

// /api/bi/v1/goodsOverviewAnalysis/salesRegionalAnalysis/province/export 销售地域分析-导出-按省份
export const goodsOverviewAnalysisSalesRegionalAnalysisProvinceExport = (params) => {
  return request.download({
    url: '/api/bi/v1/goodsOverviewAnalysis/salesRegionalAnalysis/province/export',
    params,
    showLoading: true
  })
}

// /api/bi/v1/goodsOverviewAnalysis/salesRegionalAnalysis/city/export 销售地域分析-导出-按城市
export const goodsOverviewAnalysisSalesRegionalAnalysisCityExport = (params) => {
  return request.download({
    url: '/api/bi/v1/goodsOverviewAnalysis/salesRegionalAnalysis/city/export',
    params,
    showLoading: true
  })
}

// /api/bi/v1/goodsOverviewAnalysis/salesRegionalAnalysis/province 销售地域分析-列表-按省份
export const getBiGoodsOverviewAnalysisSalesRegionalAnalysisProvince = (params) => {
  return request.get({
    url: '/api/bi/v1/goodsOverviewAnalysis/salesRegionalAnalysis/province',
    params,
    showLoading: true
  })
}

// /api/bi/v1/goodsOverviewAnalysis/salesRegionalAnalysis/city 销售地域分析-列表-按城市
export const getBiGoodsOverviewAnalysisSalesRegionalAnalysisCity = (params) => {
  return request.get({
    url: '/api/bi/v1/goodsOverviewAnalysis/salesRegionalAnalysis/city',
    params,
    showLoading: true
  })
}

// /api/bi/v1/goodsOverviewAnalysis/getAmountByArea 销售地域分析-地图-按省份
export const getBiGoodsOverviewAnalysisGetAmountByArea = (params) => {
  return request.get({
    url: '/api/bi/v1/goodsOverviewAnalysis/getAmountByArea',
    params,
    showLoading: true
  })
}

// /api/bi/v1/goodsOverviewAnalysis/getCityAmountByArea 销售地域分析-地图-按城市
export const getBiGoodsOverviewAnalysisGetCityAmountByArea = (params) => {
  return request.get({
    url: '/api/bi/v1/goodsOverviewAnalysis/getCityAmountByArea',
    params,
    showLoading: true
  })
}

// /api/bi/v1/goodsOverviewAnalysis/salesPeriod 销售时段分析
export const getBiGoodsOverviewAnalysisSalesPeriod = (params) => {
  return request.get({
    url: '/api/bi/v1/goodsOverviewAnalysis/salesPeriod',
    params,
    showLoading: true
  })
}

// 根据商品ID获取商品基本信息
export const getBiGoodsV1ById = (id?: string) => {
  return request.get({ url: `/api/bi/v1/goodsOverview/getInfo?param=${id}` })
}