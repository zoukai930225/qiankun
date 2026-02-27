import request from '@/config/axios'

interface GetRes<T = any> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
}

/**分页获取供应商货品列表 */
export function supplierGoodsPageApi(data: Supplier.SupplierProduct.GetPageParams) {
  return request.post<GetRes<Supplier.SupplierProduct.PageItem>>({
    url: '/api/supplier/goods/page',
    data
  })
}

/**获取可用供应商列表(供应商下拉框数据) */
export function getAvailableSuppliersApi() {
  return request.get<Supplier.SupplierProduct.SupplierBasicInfoBO[]>({
    url: '/api/supplier/goods/getAvailableSuppliers'
  })
}

/**批量修改税率或价格 */
export function modifyTaxRateOrPriceApi(data: Supplier.SupplierProduct.ModifyTaxRateOrPriceParams) {
  return request.postOriginal({
    url: '/api/supplier/goods/modifyTaxRateOrPrice',
    data
  })
}

/**获取未绑定的供应商货品列表(新增时选择货品下拉框数据) */
export function getUnboundGoodsApi(params: {
  goodsNo?: string
  pageNum?: number
  pageSize?: number
  supplierId?: string
}) {
  return request.get<GetRes<Supplier.SupplierProduct.ScGoodsManagerVO>>({
    url: '/api/supplier/goods/getUnboundGoods',
    params
  })
}

/**保存/更新供应商货品 */
export function saveOrUpdateSupplierGoodsApi(
  data: Supplier.SupplierProduct.SaveOrUpdateSupplierGoodsParam
) {
  return request.postOriginal({
    url: '/api/supplier/goods/saveOrUpdateSupplierGoods',
    data
  })
}

/**获取未选择的SKU列表(新增时选择SKU) */
export function getUnSelectedSkuApi(data: { goodsId: string; selectedSku?: string[] }) {
  return request.post<Supplier.SupplierProduct.SkuInfoVO[]>({
    url: '/api/supplier/goods/getUnSelectedSku',
    data
  })
}

/**获取供应商货品详情（编辑回显） */
export function getSupplierGoodsByIdApi(params: { supplierGoodsId: string }) {
  return request.get({
    url: '/api/supplier/goods/getSupplierGoodsById',
    params
  })
}

/**停用/启用货品 */
export function enableSupplierApi(params: { enable: 0 | 1; supplierGoodsDetailId: string }) {
  return request.getOriginal({
    url: '/api/supplier/goods/enable',
    params
  })
}

/**分页查询sku明细 */
export function getDetailByIdApi(data: Supplier.SupplierProduct.GetSkuPageParams) {
  return request.post<GetRes<Supplier.SupplierProduct.SupplierGoodsDetailVO>>({
    url: '/api/supplier/goods/getDetailById',
    data
  })
}

/**修改供应商货品明细 */
export function updateDetailApi(data: Supplier.SupplierProduct.UpdateSkuDetail) {
  return request.postOriginal({
    url: '/api/supplier/goods/updateDetail',
    data
  })
}

/**sku明细批量修改税率/价格 */
export function modifySkuTaxRateOrPriceApi(
  data: Supplier.SupplierProduct.ModifySkuTaxRateOrPriceParam
) {
  return request.postOriginal({
    url: '/api/supplier/goods/modifySkuTaxRateOrPrice',
    data
  })
}

/**获取供应商货品明细变更趋势 */
export function getDetailChangeHis(params: {
  supplierGoodsDetailId: string
  startTime: string
  endTime: string
}) {
  return request.get({
    url: '/api/supplier/goods/getDetailChangeHis',
    params
  })
}

/**获取供应商货品采购价格趋势 */
export function getPurchasePriceHis(params: {
  supplierGoodsDetailId: string
  startTime: string
  endTime: string
}) {
  return request.get({
    url: '/api/supplier/goods/getPurchasePriceHis',
    params
  })
}

/** 分页查询 供应商货品价格变更日志 */
export function getDetailChangeHisLogApi(params: {
  page: number
  size: number
  supplierGoodsId: string
}) {
  return request.get({
    url: '/api/supplier/goods/getDetailChangeHisLog',
    params
  })
}

/**分页查询 供应商货品价格变更SKU明细日志 */
export function getDetailChangeHisSkuLogApi(params: {
  page: number
  size: number
  supplierGoodsDetailId: string
  sku: string
}) {
  return request.get({
    url: '/api/supplier/goods/getDetailChangeHisSkuLog',
    params
  })
}

/** 导出供应商货品 */
export function supplierGoodsExportApi(data: any) {
  return request.downloadPost({
    url: '/api/supplier/goods/export',
    data
  })
}
