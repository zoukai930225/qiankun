import request from '@/config/axios'

interface GetRes<T = any> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
  extras?: any
}

/**供应商台账列表 */
export function supplierLedgerOrderList(data: Supplier.Ledger.Request, signal: any) {
  return request.post<GetRes<Supplier.Ledger.SupplierOrderListVO>>({
    url: '/api/supplier/ledger/orderList',
    data,
    signal
  })
}

/**供应商台账列表导出 */
export function supplierLedgerExportList(data: Supplier.Ledger.Request) {
  return request.downloadPost({
    url: '/api/supplier/ledger/exportList',
    data
  })
}

/** 跟单台账列表 */
export function orderHandlerLedgerOrderList(
  data: Supplier.Ledger.OrderHandlerListRequest,
  signal: any
) {
  return request.post<
    GetRes<{ orderList: Supplier.Ledger.OrderHandlerOrderList; totalInfo: Record<string, string> }>
  >({
    url: '/api/orderHandler/ledger/orderList',
    data,
    signal
  })
}

/** 跟单台账导出 */
export function orderHandlerLedgerExportList(data: Supplier.Ledger.OrderHandlerListRequest) {
  return request.downloadPost({
    url: '/api/orderHandler/ledger/exportList',
    data
  })
}

/**跟单台账走势图 */
export function orderHandlerLedgerTrend(data: {
  orderHandlerId?: string
  goodsNo?: string
  purchaseTimeStart?: string
  purchaseTimeEnd?: string
}) {
  return request.post({
    data,
    url: '/api/orderHandler/ledger/trend'
  })
}

/** 供应商台账走势图 */
export function supplierLedgerTrend(data: {
  supplierId?: string
  goodsNo?: string
  purchaseTimeStart?: string
  purchaseTimeEnd?: string
}) {
  return request.post({
    data,
    url: '/api/supplier/ledger/trend'
  })
}

/**数据看板-查询未发货po(供应商，跟单人) */
export function selectPoStatisticByPage(data: Supplier.Ledger.Request) {
  return request.post<GetRes<Supplier.Ledger.ScPurchaseOrder>>({
    url: '/api/dataDashboard/selectPoStatisticByPage',
    data
  })
}

/**数据看板-查询未发货asr(供应商，跟单人) */
export function selectAsrStatisticByPageApi(data: Supplier.Ledger.Request) {
  return request.post<GetRes<Supplier.Ledger.ScPurchaseOrder>>({
    url: '/api/dataDashboard/selectAsrStatisticByPage',
    data
  })
}

/**分页查询-查询各个供应商前一个月所有生产单的平均交付率 */
export function deliveryRatePaginQueryApi(data: any) {
  return request.post<GetRes<any>>({
    url: '/api/supplier/deliveryRate/paginQuery',
    data
  })
}

/**分页查询-查询当前供应商前一个月所有生产单的交付情况 */
export function deliveryRateDetailApi(data: any) {
  return request.post<GetRes<any>>({
    url: '/api/supplier/deliveryRate/detail/paginQuery',
    data
  })
}

/** 交付率导出 */
export function deliveryRateExportApi(data: any) {
  return request.downloadPost({
    url: '/api/supplier/deliveryRate/export',
    data
  })
}

interface GetRateParams {
  months: string
  pageNum: number
  pageSize: number
}

/**查询供应商交付率 */
export function supplierDeliveryRateApi(data: GetRateParams) {
  return request.post<GetRes>({
    url: '/api/deliveryAnalysis/supplier/rate',
    data
  })
}

/**查询品类交付分析 */
export function categoryDeliveryRateApi(data: GetRateParams) {
  return request.post<GetRes>({
    url: '/api/deliveryAnalysis/category/rate',
    data
  })
}

/**查询货品交付分析 */
export function goodsDeliveryRateApi(data: GetRateParams) {
  return request.post<GetRes>({
    url: '/api/deliveryAnalysis/goods/rate',
    data
  })
}

/**查询生产单交付分析 */
export function poDeliveryRateApi(data: GetRateParams) {
  return request.post<GetRes>({
    url: '/api/deliveryAnalysis/po/rate',
    data
  })
}

/**品类分页下拉框 */
export function getCategorySelectorApi(params: {
  categoryName: string
  pageNum: number
  pageSize: number
}) {
  return request.get({
    url: '/api/sysCategory/categorySelector/page',
    params
  })
}

/**
 * 查询交付分析详情
 * @param code
 * @param month
 * @param type 1-供应商;2-品类;3-货品
 * @returns
 */
export function getDeliveryAnalysisDetail(data: any) {
  return request.post({
    url: `/api/deliveryAnalysis/rate/detail`,
    data
  })
}

/**导出品类交付数据 */
export function exportDeliveryAnalysisCategoryApi(data) {
  return request.downloadPost({
    url: '/api/deliveryAnalysis/category/rate/export',
    data
  })
}
/**导出货品交付数据 */
export function exportDeliveryAnalysisGoodsApi(data) {
  return request.downloadPost({
    url: '/api/deliveryAnalysis/goods/rate/export',
    data
  })
}
/**导出供应商交付数据 */
export function exportDeliveryAnalysisSupplierApi(data) {
  return request.downloadPost({
    url: '/api/deliveryAnalysis/supplier/rate/export',
    data
  })
}
/**导出生产单交付数据 */
export function exportDeliveryAnalysisPoApi(data) {
  return request.downloadPost({
    url: '/api/deliveryAnalysis/po/rate/export',
    data
  })
}
