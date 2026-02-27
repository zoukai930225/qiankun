import request from '@/config/axios'

// 获取天猫淘宝付费前10名产品
export const getPlatformList = (params) => {
  return request.get({ url: '/api/pay/getPayList', params })
}

// 各品类付费总和

export const getCategoryPayList = (params) => {
  return request.get({ url: '/api/pay/getCategoryPayList', params })
}

// 各品类数据对比和分析
export const getCategoryComparisonAndAnalysisList = (params) => {
  return request.get({ url: '/api/pay/getCategoryComparisonAndAnalysis', params })
}

//查询各类目/单品
export const getCategoryDataRemarksList = () => {
  return request.get({ url: '/api/category-data-remarks/queryCategory' })
}

//增加备注(个品类/单品)
export const categoryDataRemarksCreate = (data) => {
  return request.post({ url: '/api/category-data-remarks/create', data })
}

//更新类目备注信息
export const categoryDataRemarksUpdate = (data) => {
  return request.post({ url: '/api/category-data-remarks/update', data })
}
// //删除 类目/单品
// export const getCategoryDataRemarksList = (params) => {
//   return request.get({ url: '/api/category-data-remarks/queryCategory', params })
// }

//根据日期查询类目的信息
export const categoryDataRemarksQueryByDate = (params) => {
  return request.get({ url: `/api/category-data-remarks/queryByDate`, params })
}

//付费推广数据跟踪列表查询
export const paidPromotionQuery = (params: any) => {
  return request.get({ url: `/api/paid-promotion/query`, params })
}
// 更新产品等级,预估达成结果,推广目的
export const paidPromotionUpdate = (data) => {
  return request.post({ url: `/api/paid-promotion/update`, data })
}

// 删除产品等级,预估达成结果,推广目的
export const paidPromotionDelete = (id) => {
  return request.get({
    url: `/api/paid-promotion/delete/${id}`
  })
}

// 获取默认日期
export const getDefaultDate = (params) => {
  return request.get({ url: `/api/pay/isHaveData`, params })
}

//导出Excel
export const paidPromotionExportExcel = (data: any) => {
  return request.downloadPost({ url: `/api/paid-promotion/export`, data })
}

// 获取拼多多付费前10名产品
export const getPddPlatformList = (params) => {
  return request.get({ url: '/api/pdd/pay/getPayList', params })
}

// 拼多多各店铺付费总和
export const getStorePayList = (params) => {
  return request.get({ url: '/api/pdd/pay/getStorePayList', params })
}

// 获取默认日期 -拼多多
export const getPddDefaultDate = (params) => {
  return request.get({ url: `/api/pdd/pay/isHaveData`, params })
}

// 拼多多 拼多多品类对比
export const getStoreComparisonAndAnalysisList = (params) => {
  return request.get({ url: '/api/pay/getPDDCategoryComparisonAndAnalysis', params })
}

// 拼多多 指定时间查询拼多多店铺
export const getStoreDataRemarksList = (params) => {
  return request.get({ url: '/api/category-data-remarks/queryPddRemarks', params })
}

// dy 单品日消耗
// /api/douyinSkuControlConfig/list
export const getDouyinSkuControlConfigList = (params: any) => {
  return request.get({ url: '/api/douyinSkuControlConfig/list', params })
}
// /api/douyinSkuControlConfig/save
// 新增数据 jsdoc
/**
 * 新增数据
 * @param data
 * @returns
 */
export const saveDouyinSkuControlConfig = (data: any) => {
  return request.post({ url: '/api/douyinSkuControlConfig/save', data, showLoading: true })
}

/**
 * 更新数据
 * @param data
 * @returns
 */
export const updateDouyinSkuControlConfig = (data: any) => {
  return request.post({ url: '/api/douyinSkuControlConfig/update', data, showLoading: true })
}
// /api/douyinSkuControlConfig/delete/{id}
// 删除数据 jsdoc
/**
 * 删除数据
 * @param id
 * @returns
 */
export const deleteDouyinSkuControlConfig = (id: any) => {
  return request.get({ url: `/api/douyinSkuControlConfig/delete/${id}` })
}

// 获取数据
/**
 * 获取数据
 * @param id
 * @returns
 */
export const getDouyinSkuControlConfig = (id: any) => {
  return request.get({ url: `/api/douyinSkuControlConfig/get/${id}`, showLoading: true })
}

// /api/douyinSkuControlConfig/getGoodsInfoByStoreAndId
/**
 * 获取商品信息
 * @param data
 * @returns
 */
export const getGoodsInfoByStoreAndId = (data: any) => {
  return request.get({ url: '/api/douyinSkuControlConfig/getGoodsInfoByStoreAndId', params: data })
}

/**
 * 单品日消耗
 * @param params
 * @returns
 */
export const getDouyinGoodsList = (params: any) => {
  return request.get({ url: '/api/douyin/pay/getGoodsList', params })
}

/**
 * 获取店铺列表
 * @param params
 * @returns
 */
export const getDouyinStoreList = (params: any) => {
  return request.getOriginal({ url: '/api/douyin/pay/getStoreList', params })
}

// 获取最新有数据的日期
export const getLatestDate = () => {
  return request.get({ url: '/api/douyin/pay/getMaxDate' })
}

// /api/pay/getGoodsRufundMaxDate 淘宝/天猫销量1W+商品退款率数据最大时间
export const getGoodsRufundMaxDate = (params: any) => {
  return request.get({ url: '/api/pay/getGoodsRufundMaxDate', params })
}

// /api/pay/getGoodsRufundList 淘宝/天猫销量1W+商品退款率
export const getGoodsRufundList = (params: any) => {
  return request.get({ url: '/api/pay/getGoodsRufundList', params, showLoading: true })
}
