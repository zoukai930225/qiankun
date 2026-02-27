import request from '@/config/axios'

interface GetRes<T = any> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
  extras?: any
}

export function opsReplenishmentRequestApi(params: Supplier.PurchaseApplication.Request) {
  return request.get<GetRes<Supplier.PurchaseApplication.Record>>({
    url: '/api/opsReplenishmentRequest/paginQuery',
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/opsReplenishmentRequest/paginQuery',
    params
  })
}

/**新增运营备货申请 */
export function addOpsReplenishmentRequestApi(data: Supplier.PurchaseApplication.AddRequest) {
  return request.postOriginal({
    url: '/api/opsReplenishmentRequest/addRequest',
    data
  })
}

/**批量货品新增查询 */
export function wdtSpecPaginQueryGoodsApi(params: { goodsNo: string; page: number; size: number }) {
  return request.post<GetRes<Supplier.Purchase.ScGoodsInfoVO>>({
    url: '/api/wdtSpec/paginQueryGoods',
    params
  })
}

/**查看运营备货申请 */
export function opsReplenishmentRequestDetailApi(params: { id: string }) {
  return request.get<Supplier.PurchaseApplication.AddRequest>({
    url: '/api/opsReplenishmentRequest/detail',
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/opsReplenishmentRequest/detail',
    params
  })
}

/** 运营备货申请快照 */
export function opsReplenishmentRequestQuerySnapshotById(params: {
  id: string
  skuQuery: string
}) {
  return request.get({
    url: '/api/opsReplenishmentRequest/querySnapshotById',
    params
  })
}

/**更新运营备货申请 */
export function updateOpsReplenishmentRequestApi(data: Supplier.PurchaseApplication.AddRequest) {
  return request.putOriginal({
    url: '/api/opsReplenishmentRequest/upd',
    data
  })
}

/** 删除运营备货申请 */
export function deleteOpsReplenishmentRequestApi(params: { id: string }) {
  return request.deleteOriginal({
    url: '/api/opsReplenishmentRequest/delete',
    params
  })
}

/** 查询申请量明细 */
export function getOpsReplenishmentRequestQuantityDetailApi(params: {
  id: string
  goodsCode: string
}) {
  return request.get({
    url: '/api/opsReplenishmentRequest/getRequestQuantityDetail',
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/opsReplenishmentRequest/getRequestQuantityDetail',
    params
  })
}

/**查看审核日志 */
export function getProcessLog(params: { id: string }) {
  return request.get({
    url: '/api/opsReplenishmentRequest/getProcessLog',
    params
  })
}

/** 新增运营备货申请明细导入 */
export function importDetailsApi(data: FormData, params: any) {
  return request.formPostOriginal({
    url: '/api/opsReplenishmentRequest/importDetails',
    data,
    params
  })
}

/**提交申请 */
export function submitOpsReplenishmentRequestApi(params: { id: string }) {
  return request.getOriginal({
    url: '/api/opsReplenishmentRequest/submit',
    params
  })
}

/**审核 */
export function reviewOpsReplenishmentRequestApi(params: {
  id: string
  isApprove: boolean
  reviewOpinion: string
}) {
  return request.getOriginal({
    url: '/api/opsReplenishmentRequest/review',
    params
  })
}

/** 撤回 */
export function withdrawOpsReplenishmentRequestApi(params: { id: string }) {
  return request.getOriginal({
    url: '/api/opsReplenishmentRequest/withdraw',
    params
  })
}

/**查看审核日志 */
export function getProcessLogOpsReplenishmentRequestApi(id: string) {
  return request.get({
    url: '/api/opsReplenishmentRequest/getProcessLog',
    params: { id }
  })
}

/**通过sku编码查询库存数据 */
export function getInventoryDataBySkuApi(params: { sku: string; id: string }) {
  return request.get({
    url: '/api/opsReplenishmentRequest/getInventoryDataBySku',
    params
  })
}
