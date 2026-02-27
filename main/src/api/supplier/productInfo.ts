import request from '@/config/axios'

// 获取待验厂的供应商下拉列表

export const getSupplierList = () => {
  return request.get({ url: `/api/supplier-basic-info/getAllSupplier` })
}
// 获取所有审核通过的供应商
export const getApprovedSuppliers = () => {
  return request.get({ url: `/api/supplier-basic-info/getApprovedSuppliers` })
}
// 获取供应链中心人员列表
export const getSupplyChainCenterList = () => {
  return request.get({ url: `/api/sc/goods/getScPersons` })
}

// 货品信息分页查询
export const getProductInfoList = (data: any) => {
  return request.post({ url: `/api/sc/goods/pageQuery`, data })
}

// 货品的上架下架
export const updateProductStatus = (data: any) => {
  return request.post({ url: `/api/sc/goods/changeStatus`, data })
}
// 同步ERP货品
export const syncProductsToERP = () => {
  return request.getOriginal({ url: `/api/sc/goods/syncWdtGoods` })
}

// 获取货品绑定的供应商
export const getProductSupplier = (data) => {
  return request.post({ url: `/api/sc/goods/getSupplierBinding`, data })
}

// 修改货品供应商绑定关系
export const updateProductSupplier = (data) => {
  return request.post({ url: `/api/sc/goods/updateSupplierBinding`, data })
}

// 获取货品信息,（编辑时回显）
export const getProductInfo = (params) => {
  return request.get({ url: `/api/sc/goods/getGoodsInfoById`, params })
}

// 编辑货品
export const updateProductInfo = (data) => {
  return request.post({ url: `/api/sc/goods/updateGoods`, data })
}

// 获取货品分类数据
export const getProductCategoryList = () => {
  return request.get({ url: `/api/sysCategory/queryCategoryTree` })
}

// -----------------SKU明细-----------------------------
// 获取SKU明细分页查询
export const getSkuDetailList = (data: any) => {
  return request.post({ url: `/api/sc/goods/sku/page`, data })
}

// 根据skuId查询货品信息，（编辑sku信息回显）
export const getSkuInfoById = (params) => {
  return request.get({ url: `/api/sc/goods/sku/getById`, params })
}

// 修改sku信息
export const updateSkuInfo = (data) => {
  return request.post({ url: `/api/sc/goods/sku/update`, data })
}

// sku上架下架
export const updateSkuStatus = (data: any) => {
  return request.post({ url: `/api/sc/goods/sku/changeStatus`, data })
}

// 货品信息导出
export function downloadProductInfo(data) {
  return request.downloadPost({
    url: '/api/sc/goods/export',
    data
  })
}
