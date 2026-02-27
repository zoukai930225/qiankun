import request from '@/config/axios'

/*** 新品 主图分析  */
//  列表查询
export const getNewProductMainImageList = (params: any) => {
  return request.get({ url: '/api/opNewProductMainImage', params })
}

//  新增主图
export const addNewProductMainImageList = (params: {}) => {
  return request.post({ url: '/api/opNewProductMainImage', data: params })
}

//  编辑主图
export const updateNewProductMainImageList = (params: {}) => {
  return request.put({ url: '/api/opNewProductMainImage', data: params })
}

//  删除主图
export const deleteNewProductMainImageList = (params: {}) => {
  return request.delete({ url: `/api/opNewProductMainImage`, params })
}

// 通过id 获取数据
export const getNewProductMainImageById = (id: string) => {
  return request.get({ url: `api/opNewProductMainImage/${id}` })
}

/** 新品 主图分析 本产品特点 */
//  列表查询
export const getProductFeatureList = (params: {}) => {
  return request.get({ url: '/api/opProductFeature', params })
}

//  新增
export const addProductFeature = (params: {}) => {
  return request.post({ url: '/api/opProductFeature', data: params })
}

export const batchAddProductFeature = (data: any) => {
  return request.post({ url: '/api/opProductFeature/batchAdd', data })
}

//  编辑
export const updateProductFeature = (params: {}) => {
  return request.put({ url: '/api/opProductFeature', data: params })
}

//  删除
export const deleteProductFeature = (params: {}) => {
  return request.delete({ url: `/api/opProductFeature`, params })
}

// 通过id 获取数据
export const getProductFeatureById = (id: string) => {
  return request.get({ url: `/api/opProductFeature/${id}` })
}

/** 新品 主图分析 竞品分析 本品卖点 type 1=竞品分析，2=本品卖点 */
//  列表查询
export const getProductComparisonList = (params: {}) => {
  return request.get({ url: '/api/opProductComparison', params })
}

//  新增
export const addProductComparison = (params: {}) => {
  return request.post({ url: '/api/opProductComparison', data: params })
}

export const batchAddProductComparison = (data: any) => {
  return request.post({ url: '/api/opProductComparison/batchAdd', data })
}

//  编辑
export const updateProductComparison = (params: {}) => {
  return request.put({ url: '/api/opProductComparison', data: params })
}

//  删除
export const deleteProductComparison = (params: {}) => {
  return request.delete({ url: `/api/opProductComparison`, params })
}

// 通过id 获取数据
export const getProductComparisonById = (id: string) => {
  return request.get({ url: `/api/opProductComparison/${id}` })
}

/*** 主图分析 增加与视觉部门对接 **/
// 新增视觉部门相关
export const submitVisualInfo = (data: any) => {
  return request.post({ url: `/api/opNewProductMainImage/submit`, data })
}
// 获取视觉部门相关信息
export const getVisualInfo = (id: string) => {
  return request.get({ url: `/api/opNewProductMainImage/selectInfo/${id}` })
}
// 根据用户id集合查询上级列表
export const selectSuperiorList = (data: any) => {
  return request.post({
    url: `/api/opNewProductMainImage/selectSuperiorList
`,
    data
  })
}

// 通过主图ID查询快照
export const querySnapshotByMainId = (params: any) => {
  return request.post({ url: `/api/opNewProductMainImageSnapshot/querySnapshotByMainId`, params })
}

// 保存快照
export const saveMainImageSnapshot = (data: any) => {
  return request.post({ url: `/api/opNewProductMainImageSnapshot/save`, data })
}

// 运营确认
export const confirmMainImageSnapshot = (data: any) => {
  return request.post({ url: `/api/opNewProductMainImageSnapshot/confirm`, data })
}

// 快照解封
export const releaseMainImageSnapshot = (data: any) => {
  return request.post({ url: `/api/opNewProductMainImageSnapshot/release`, data })
}

/*** 主图分析 增加与视觉部门对接 **/

// /api/opNewProductMainImage/selectCountForUnblock 已解封/未解封数量统计
export const selectCountForUnblock = (params: any) => {
  return request.get({ url: `/api/opNewProductMainImage/selectCountForUnblock`, params })
}

// /api/opNewProductMainImage/batchUnsealing 主图分析批量解封/封版
export const batchUnsealing = (data: any) => {
  return request.post({ url: `/api/opNewProductMainImage/batchUnsealing`, data })
}

// api/opProductComparison/batchSort 竞品分析/本品卖点批量排序
export const batchSortComparison = (data: any) => {
  return request.post({ url: `/api/opProductComparison/batchSort`, data })
}

// api/opProductFeature/batchSort 本产品特点批量排序
export const batchSortFeature = (data: any) => {
  return request.post({ url: `/api/opProductFeature/batchSort`, data })
}
