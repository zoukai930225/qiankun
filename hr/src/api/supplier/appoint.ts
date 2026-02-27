import request from '@/config/axios'

interface GetRes<T = any> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
  extras?: any
}

/** 采购生产订单分页 */
export function getOrderPageBySupplierApi(data: Supplier.Product.GetPageParams) {
  return request.post<GetRes<Supplier.Product.PageItem>>({
    url: '/api/scPurchaseOrder/getOrderPageBySupplier',
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/scPurchaseOrder/getOrderPageBySupplier',
    data
  })
}

/** 采购生产订单产看详情 */
export function queryBySupplierIdAndIdApi(data: Supplier.Product.GetDetailParams) {
  return request.post({
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/scPurchaseOrder/queryBySupplierIdAndId',
    url: '/api/scPurchaseOrder/queryBySupplierIdAndId',
    data
  })
}

/** 获取仓库列表 */
export function getScWarehouseApi() {
  return request.get({
    url: '/api/scWarehouse/listAll'
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/scWarehouse/listAll'
  })
}

/** 根据选中仓库获取信息 */
export function getScWarehousePageApi(params: { id: string }) {
  return request.get({
    url: '/api/scWarehouse/get',
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/scWarehouse/page',
    params
  })
}

/** 预约发货 （新增，编辑，查看，预约发货） */
export function scAdvancedShippingRequestOrderGetPoDetailApi(data: {
  /** 预约发货单Id */
  advancedShippingRequestOrderId?: string
  /** 采购生产单ID */
  scPurchaseOrderId?: string
  /** 供应商Id */
  supplierId: string
  /** 导入id */
  importRecordId?: string
  /**预约发货方式 */
  appointmentType?: string
}) {
  return request.post<Supplier.Product.UpdateParams>({
    url: '/api/scAdvancedShippingRequestOrder/getPoDetail',
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/scAdvancedShippingRequestOrder/getPoDetail',
    data
  })
}

/** 保存/更新数据 （有明细，明细也会新增/更新） */
export function saveOrUpdateApi(data: Supplier.Product.UpdateParams) {
  return request.postOriginal({
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/scAdvancedShippingRequestOrder/saveOrUpdate',
    url: '/api/scAdvancedShippingRequestOrder/saveOrUpdate',
    data
  })
}

/**提交预约发货单 */
export function submitScAdvancedShippingRequestOrderApi(id: string) {
  return request.postOriginal({
    // url: `http://127.0.0.1:4523/m1/4344737-3988140-default/api/scAdvancedShippingRequestOrder/submit/1`
    url: `/api/scAdvancedShippingRequestOrder/submit/${id}`
  })
}

/** 预约发货单 */
export function getScAdvancedShippingRequestOrderApi(params: Supplier.Appoint.GetPageParams) {
  return request.get<GetRes<Supplier.Appoint.PageItem>>({
    url: '/api/scAdvancedShippingRequestOrder/paginQuery',
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/scAdvancedShippingRequestOrder/paginQuery',
    params
  })
}

/** 查询装箱单 */
export function getScPackingListApi(params: { advancedShippingRequestOrderId: string }) {
  return request.get({
    url: '/api/scPackingList/list',
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/scPackingList/list',
    params
  })
}

/** 新增或修改装箱单 */
export function saveOrUpdateScPackingListApi(data: Supplier.Appoint.UpdatePickingBox) {
  return request.postOriginal({
    url: '/api/scPackingList/saveOrUpdate',
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/scPackingList/saveOrUpdate',
    data
  })
}

/** 获取打印信息 */
export function getScPackingListPrintApi(id: string) {
  return request.get({
    // url: `http://127.0.0.1:4523/m1/4344737-3988140-default/api/scPackingList/packingListPrint/1`
    url: `/api/scPackingList/packingListPrint/${id}`
  })
}

/** 确认订单 */
export function confirmScPurchaseOrderApi(id: string) {
  return request.postOriginal({
    url: `/api/scPurchaseOrder/confirm/${id}`
  })
}

/** 通过主键删除数据 明细和关联表一并删除 */
export function deleteScAdvancedShippingRequestOrderApi(params: { id: string }) {
  return request.deleteOriginal({
    url: '/api/scAdvancedShippingRequestOrder',
    params
  })
}

/** 装箱单商家编码列表 */
export function getScAdvancedShippingRequestOrderDetailListApi(data: {
  advancedShippingRequestOrderId: string
  sku?: string
}) {
  return request.post({
    url: '/api/scAdvancedShippingRequestOrderDetail/list',
    data
  })
}

/** 预约发货单撤回 */
export function scAdvancedShippingRequestOrderCancelApi(data: {
  asrId: string
  comment: string
  attachmentUrls: string[]
}) {
  return request.postOriginal({
    url: '/api/scAdvancedShippingRequestOrder/cancel',
    data
  })
}

/** 导入装箱单 */
export function uploadPackingListApi(params: { poId: string }, data: FormData) {
  return request.formPost({
    url: '/api/scAdvancedShippingRequestOrder/importPackingList',
    params,
    data
  })
}

/** 新增物流单信息 */
export function scAsrLogisticsRecordApi(data) {
  return request.postOriginal({
    url: '/api/scAsrLogisticsRecord',
    data
  })
}

/** 通过预约发货单id查询物流记录 */
export function scAsrLogisticsRecordQueryByAsrIdApi(asrId: string) {
  return request.get({
    url: `/api/scAsrLogisticsRecord/queryByAsrId/${asrId}`
  })
}

/** 更新物流信息 */
export function updateScAsrLogisticsRecordApi(data) {
  return request.putOriginal({
    url: '/api/scAsrLogisticsRecord',
    data
  })
}

/** 校验价格 */
export function scAdvancedShippingRequestOrderCheckPriceApi(data: {
  receivingWarehouse: string
  scPurchaseOrderId: string
}) {
  return request.postOriginal({
    url: '/api/scAdvancedShippingRequestOrder/checkPrice',
    data
  })
}

/**获取当前用户可以选择的供应商列表 */
export function getSupplierListByUserApi() {
  return request.get({
    url: '/api/scAdvancedShippingRequestOrder/getSupplierList'
  })
}

/** 获取当前供应商可以选择的生产单*/
export function getPurchaseOrderListApi(supplierId: string) {
  return request.get({
    url: `/api/scAdvancedShippingRequestOrder/getPurchaseOrderList/${supplierId}`
  })
}

/** 导出指定的预约发货单明细 */
export function exportAsrDetailApi(data: Supplier.Appoint.GetPageParams) {
  return request.downloadPost({
    url: '/api/scAdvancedShippingRequestOrder/exportAsrDetail',
    data
  })
}

/**导出所有预约发货单明细 */
export function exportAllAsrDetailApi() {
  return request.download({
    url: '/api/scAdvancedShippingRequestOrder/exportAllAsrDetail'
  })
}

/**导出装箱单 */
export function exportPackingListApi(asrId: string) {
  return request.download({
    url: `/api/scPackingList/exportPackingList/${asrId}`
  })
}

/** 手动结单 */
export function scAdvancedShippingRequestOrderFinishApi(data: {
  asrId: string
  comment: string
  attachmentUrls: string[]
}) {
  return request.postOriginal({
    url: '/api/scAdvancedShippingRequestOrder/finish',
    data
  })
}

/** 获取待发货量 */
export function getWaitingDeliveryQuantity(asrId: string) {
  return request.get({
    url: `/api/scAdvancedShippingRequestOrder/getWaitingDeliveryQuantity/${asrId}`
  })
}

/**查询供应商po单明细 按照sku和价格分组 */
export function pageSupplierPoDetailSummaryApi(data: any) {
  return request.post<GetRes<Supplier.Appoint.SupplierPoDetailSummaryDTO>>({
    url: '/api/scAdvancedShippingRequestOrder/pageSupplierPoDetailSummary',
    data
  })
}

/**根据po明细ids查询明细数据 */
export function querySupplierPoDetailByIds(params: { poDetailIds: string }) {
  return request.post({
    url: '/api/scAdvancedShippingRequestOrder/querySupplierPoDetailByIds',
    params
  })
}
