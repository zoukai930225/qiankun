import request from '@/config/axios'
// 获取渠道汇总 - 店铺
export const getGoodsStoreOverviewList = (params) => {
  return request.get({ url: '/api/bi/goods/storeOverview', params })
}

// 获取渠道汇总 - 渠道
export const getGoodsChannelOverviewList = (params) => {
  return request.get({ url: '/api/bi/goods/channelOverview', params })
}

// 渠道详情-经营数据-店铺
export const getGoodsStoreOverviewDetail = (params) => {
  return request.get({ url: '/api/bi/goods/storeOverview/detail', params })
}

// 渠道详情-经营数据-渠道
export const getGoodsChannelOverviewDetail = (params) => {
  return request.get({ url: '/api/bi/goods/channelOverview/detail', params })
}

// 渠道详情-热销商品-渠道
export const getGoodsChannelOverviewHotProductDetail = (params) => {
  return request.get({ url: '/api/bi/goods/channelOverview/hotProduct/detail', params })
}

// 渠道详情-热销商品-店铺
export const getGoodsStoreOverviewHotProductDetail = (params) => {
  return request.get({ url: '/api/bi/goods/storeOverview/hotProduct/detail', params })
}

// 获取商品分类信息
export const getGoodsCategory = (params) => {
  return request.get({ url: '/api/goods/getCategory', params })
}

// 渠道详情 - 品类分析 - 销售构成 - 店铺

export const getGoodsStoreOverviewCategoryAnalyseSalesConstitute = (params) => {
  return request.get({ url: '/api/bi/goods/storeOverview/categoryAnalyse/salesConstitute', params })
}

// 渠道详情 - 品类分析 - 销售构成 - 渠道

export const getGoodsChannelOverviewCategoryAnalyseSalesConstitute = (params) => {
  return request.get({
    url: '/api/bi/goods/channelOverview/categoryAnalyse/salesConstitute',
    params
  })
}

// 渠道详情 - 品类分析 - 销售走势 - 店铺

export const getGoodsStoreOverviewCategoryAnalyseSalesTrend = (params) => {
  return request.get({ url: '/api/bi/goods/storeOverview/categoryAnalyse/salesTrend', params })
}

// 渠道汇总 - 渠道 导出

export const goodsChannelOverviewExport = (params) => {
  return request.download({
    url: '/api/bi/goods/channelOverview/export',
    params
  })
}

export const goodsChannelOverviewExport2 = (params) => {
  return request.download({
    url: '/api/bi/goods/channelOverview/exportdetail',
    params
  })
}

// 渠道汇总 - 店铺 导出

export const goodsStoreOverviewExport = (params) => {
  return request.download({
    url: '/api/bi/goods/storeOverview/export',
    params
  })
}

export const goodsStoreOverviewExport2 = (params) => {
  return request.download({
    url: '/api/bi/goods/storeOverview/exportdetail',
    params
  })
}
// 渠道详情 - 品类分析 - 销售走势 - 渠道

export const getGoodsChannelOverviewCategoryAnalyseSalesTrend = (params) => {
  return request.get({
    url: '/api/bi/goods/channelOverview/categoryAnalyse/salesTrend',
    params
  })
}

// 渠道详情 - 业绩对比
export const getGoodsChannelOverviewPerformanceComparison = (params) => {
  return request.get({
    url: '/api/bi/goods/channelOverView/performanceComparison',
    params
  })
}

// 渠道详情 经营数据 导出
export const Detailexport = (params) => {
  return request.download({ url: '/api/bi/goods/storeOverview/detail/export', params })
}
export const Detailexport2 = (params) => {
  return request.download({ url: '/api/bi/goods/storeOverview/detail/exportdetail', params })
}

// 渠道详情 业绩对比 导出
export const performanceComparisonExport = (params) => {
  return request.download({
    url: 'api/bi/goods/storeOverview/performanceComparison/export',
    params
  })
}
export const performanceComparisonExport2 = (params) => {
  return request.download({
    url: 'api/bi/goods/storeOverview/performanceComparison/exportdetail',
    params
  })
}

// 渠道详情 品类分析 销售构成 导出
export const salesConstituteExport = (params) => {
  return request.download({
    url: 'api/bi/goods/storeOverview/categoryAnalyse/salesConstitute/export',
    params
  })
}
export const salesConstituteExport2 = (params) => {
  return request.download({
    url: 'api/bi/goods/storeOverview/categoryAnalyse/salesConstitute/exportdetail',
    params
  })
}

// 渠道详情 品类分析 销售趋势 导出
export const salesTrendExport = (params) => {
  return request.download({
    url: 'api/bi/goods/storeOverview/categoryAnalyse/salesTrend/export',
    params
  })
}
export const salesTrendExport2 = (params) => {
  return request.download({
    url: 'api/bi/goods/storeOverview/categoryAnalyse/salesTrend/exportdetail',
    params
  })
}

// 渠道详情 品类分析 销售趋势 导出
export const hotProductDetailExport = (params) => {
  return request.download({
    url: 'api/bi/goods/storeOverview/hotProduct/detail/export',
    params
  })
}
export const hotProductDetailExport2 = (params) => {
  return request.download({
    url: 'api/bi/goods/storeOverview/hotProduct/detail/exportdetail',
    params
  })
}
// 商品运营分析 总览数据 导出
export const operationalGoodsExport = (params) => {
  return request.download({ url: '/api/bi/goods/operational/goods/export', params })
}
export const operationalGoodsExport2 = (params) => {
  return request.download({ url: '/api/bi/goods/operational/goods/exportdetail', params })
}

// 商品运营分析 地域分析 导出
export const salesRegionalAnalysisProvinceExport = (params) => {
  return request.download({ url: 'api/bi/goods/salesRegionalAnalysis/province/export', params })
}
export const salesRegionalAnalysisProvinceExport2 = (params) => {
  return request.download({
    url: 'api/bi/goods/salesRegionalAnalysis/province/exportdetail',
    params
  })
}
