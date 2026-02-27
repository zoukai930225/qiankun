import request from '@/config/axios'

interface GetRes<T = any> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
  extras?: any
}

/** 获取采购需求订单列表 */
export function getPurchaseList(params: Supplier.Purchase.GetListParams) {
  return request.get<GetRes<Supplier.Purchase.ListItem>>({
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/scPurchaseRequestOrder/paginQuery',
    url: '/api/scPurchaseRequestOrder/paginQuery',
    params
  })
}

/** 获取我的订单列表 */
export function getPurchasePruductOrderList(params: Supplier.Purchase.GetListParams) {
  return request.get<GetRes<Supplier.Purchase.ListItem>>({
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/scPurchaseRequestOrder/paginQuery',
    url: '/api/scPurchaseRequestOrder/paginQueryByProduction',
    params
  })
}

/** 点击生产订单获取列表信息 */
export function getPrOrderDetailApi(data: {
  scPurchaseRequestOrderId: string
  scPurchaseOrderId?: string
}) {
  return request.post({
    url: '/api/scPurchaseOrder/getPrOrderDetail',
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/scPurchaseOrder/getPrOrderDetail',
    data
  })
}

/** 采购生产订单分页 */
export function getScPurchaseOrderApi(params: Supplier.Purchase.GetListParams) {
  return request.get({
    url: '/api/scPurchaseOrder/paginQuery',
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/scPurchaseOrder/paginQuery',
    params
  })
}
/** 全部采购生产订单分页 */
export function getAllScPurchaseOrderApi(params: Supplier.Purchase.GetListParams) {
  return request.get({
    url: '/api/scPurchaseOrder/paginQueryAll',
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/scPurchaseOrder/paginQueryAll',
    params
  })
}

/** 获取数据看板 */
export function getDataBoardApi() {
  return request.get({
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/scPurchaseRequestOrder/dataBoard'
    url: '/api/scPurchaseRequestOrder/dataBoard'
  })
}

/** 获取供应链中心人员列表 */
export function getScPersonsApi(signal?: any) {
  return request.get({
    url: '/api/sc/goods/getScPersons',
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/sc/goods/getScPersons'，
    signal
  })
}

/** 获取供应商下拉列表接口 */
export function getSupplierListApi(params: { goodsNo: string }) {
  return request.get({
    url: '/api/sc/goods/getSuppliersByGoodsNo',
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/sc/goods/getSuppliersByGoodsNo',
    params
  })
}

/** 获取商家编码列表 */
export function getSkuList(params?: { specNo: string }) {
  return request.get({
    url: '/api/wdtSpec/listSpecNo',
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/wdtSpec/listSpecNo',
    params
  })
}

/** 通过商家编码获取对应数据 */
export function getInfoBySku(data: {
  sku: string
  pageSize: number
  pageNum: number
  userId?: string
  supplierId?: string
  [key: string]: any
}) {
  return request.post<GetRes<Supplier.Purchase.ScGoodsInfoVO>>({
    url: '/api/sc/goods/page',
    data
  })
}
/** 通过商家编码获取对应数据 */
export function getInfoBySku2(params: {
  sku: string
  page: number
  size: number
  [key: string]: any
}) {
  return request.get<GetRes<Supplier.Purchase.ScGoodsInfoVO>>({
    url: '/api/sc/goods/getSkus',
    params
  })
}
/** 货品编码查询 */
export function getInfoByGoodsCode(params: { goodsCode: string; page: number; size: number }) {
  return request.get<GetRes<Supplier.Purchase.ScGoodsInfoVO>>({
    url: '/api/sc/goods/getGoodsCodes',
    params
  })
}
/**  */

/** 保存 */
export function savePurchase(data: Supplier.Purchase.FormData) {
  return request.postOriginal({
    url: '/api/scPurchaseRequestOrder/saveOrUpdate',
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/scPurchaseRequestOrder/saveOrUpdate',
    data
  })
}

/** 提交&结单 */
export function submitPurchase(params: { id: string; type: string }) {
  return request.postOriginal({
    url: `/api/scPurchaseRequestOrder/submitOrFinish`,
    params
  })
}

/** 取消结单——需求单单 */
export function cancelPROverApi(params: { id: string }) {
  return request.getOriginal({
    url: '/api/scPurchaseRequestOrder/cancelFinished',
    params
  })
}

/** 导出 */
export function exportInfo(data: Supplier.Purchase.ExportRequest) {
  return request.downloadPost({
    url: '/api/scPurchaseRequestOrder/export',
    data
  })
}

/** 删除供应商数据 */
export function deleteInfo(params: { id: string }) {
  return request.deleteOriginal({
    url: '/api/scPurchaseRequestOrder',
    params
  })
}

/** 编辑获取详情 */
export function getEditInfo(params: { id: string }) {
  return request.get({
    url: `/api/scPurchaseRequestOrder/${params.id}`
  })
}

/** 页面审批 通过ID查询单条数据 可以根据sku进行筛选 */
export function queryApprovalById(params: { id: string; skuQuery: string }) {
  return request.get({
    url: '/api/scPurchaseRequestOrder/queryApprovalById',
    params
  })
}

/** 查看获取详情 */
export function getCheckInfo(params: { scPurchaseRequestOrderId: string; sku?: string }) {
  return request.get<Supplier.Purchase.ListItem[]>({
    url: '/api/scPurchaseRequestOrderDetail/list',
    params
  })
}

/** 导入-采购订单 */
export function uploadPurchaseFiles(data: FormData) {
  return request.formPostOriginalDownload({ url: '/api/scPurchaseRequestOrderDetail/import', data })
}

/** 主表导入采购需求单 */
export function uploadPrFile(data: FormData) {
  return request.formPostOriginalDownload({ url: '/api/scPurchaseRequestOrder/import', data })
}

/** 导入-生产订单 */
export function uploadPurchaseOrderFiles(data: FormData, prId: string) {
  return request.formPostOriginalDownload({ url: `/api/scPurchaseOrder/import/${prId}`, data })
}

/** 编辑删除 */
export function deleteDetailItem(params: { id: string }) {
  return request.delete({
    url: '/api/scPurchaseRequestOrderDetail',
    params
  })
}

/** 新增编辑生产订单 */
export function saveOrUpdateScPurchaseOrderApi(data: Supplier.Purchase.FormData) {
  return request.postOriginal({
    url: '/api/scPurchaseOrder/saveOrUpdate',
    data
  })
}

/** 添加协办人员 */
export function setCooperateApi(params: { orderHandlerId: string; orderId: string }) {
  return request.postOriginal({
    url: '/api/scPrOrderUserRelation/cooperate',
    params
  })
}

/** 查看生产单详情 */
export function getScPurchaseDetailApi(params: { scPurchaseOrderId: string; sku?: string }) {
  return request.get({
    url: `/api/scPurchaseOrderDetail/list`,
    params
  })
}

/** 采购生产审核查询明细快照 */
export function scPurchaseOrderQuerySnapshotByIdApi(params: { id: string; skuQuery: string }) {
  return request.get({
    url: '/api/scPurchaseOrder/querySnapshotById',
    params
  })
}

/** 提交生产订单 */
export function submitProductOrderApi(id: string) {
  return request.postOriginal({
    url: `/api/scPurchaseOrder/submit/${id}`
  })
}

/** 生产订单结单 */
export function finishProductOrderApi(id: string) {
  return request.postOriginal({
    url: `/api/scPurchaseOrder/finish/${id}`
  })
}

/** 取消结单——生产单 */
export function cancelPOOverApi(params: { id: string }) {
  return request.getOriginal({
    url: '/api/scPurchaseOrder/cancelFinished',
    params
  })
}

/** 删除生产订单 */
export function deleteProductOrderApi(params: { id: string }) {
  return request.deleteOriginal({
    url: '/api/scPurchaseOrder',
    params
  })
}

/** 撤回生产订单 */
export function recallOrderApi(data) {
  return request.postOriginal({
    url: `/api/scPurchaseOrder/revoke`,
    data
  })
}

/** 撤回记录查询 */
export function getPurchaseRevokeLog(params) {
  return request.get({
    url: `/api/scPurchaseRevokeLog/list`,
    params
  })
}

/** 导出明细 */
export function exportDetail(id: string) {
  return request.download({
    url: `/api/scPurchaseRequestOrder/exportDetail/${id}`
  })
}

/**根据需求单id分页查询生产单列表 */
export function getScPoPage(data: { prId: string; pageNum: number; size: number; poId?: string }) {
  return request.post<GetRes>({
    url: '/api/sc/po/page',
    data
  })
}
/**根据生产单id分页查询生产单详情列表 */
export function getScPoPageDetail(data: {
  poId?: string
  pageNum: number
  size: number
  prId?: string
}) {
  return request.post<GetRes>({
    url: '/api/sc/po/detail/page',
    data
  })
}
/**根据需求单id分页查询生产单列表 */
export function getScStockInPage(data: {
  prId: string
  pageNum: number
  size: number
  poId?: string
}) {
  return request.post<GetRes>({
    url: '/api/sc/stockIn/page',
    data
  })
}
/**根据需求单id分页查询生产单列表 */
export function getScStockInPageDetail(data: {
  prId: string
  pageNum: number
  size: number
  id: string
  type: 1 | 2
  poId?: string
}) {
  return request.post<GetRes>({
    url: '/api/sc/stockin/detail/page',
    data
  })
}
/**根据需求单id分页查询预约单列表 */
export function getScASRPage(data: { prId: string; pageNum: number; size: number; poId?: string }) {
  return request.post<GetRes>({
    url: '/api/sc/asr/page',
    data
  })
}

/**根据预约发货单id分页查询预约单详情列表 */
export function getScASRPageDetail(data: {
  asrId: string
  pageNum: number
  size: number
  poId?: string
}) {
  return request.post<GetRes>({
    url: '/api/sc/asr/detail/page',
    data
  })
}

/**暂停发货 | 重启发货 */
export function stopDelivery(data: { poDetailId: string; type: '0' | '10' }) {
  return request.postOriginal({
    url: `/api/scPurchaseOrder/stopDelivery`,
    data
  })
}

/**新增变更单 */
export function scPoChangeRequestApi(data) {
  return request.postOriginal({
    url: '/api/scPoChangeRequest',
    data
  })
}

/**生产单导出 */
export function scPurchaseOrderExportApi(data: Supplier.Product.GetPageParams) {
  return request.downloadPost({
    url: '/api/scPurchaseOrder/export',
    data
  })
}

/** 需求单撤回 */
export function scPurchaseRequestOrderRevokeApi(id: string) {
  return request.postOriginal({
    url: `/api/scPurchaseRequestOrder/revoke/${id}`
  })
}

/** 更新跟单员 */
export function scPurchaseOrderUpdateOrderHandlerApi(data: { poId: string; userId: string }) {
  return request.postOriginal({
    url: '/api/scPurchaseOrder/updateOrderHandler',
    data
  })
}

// ----------------------------------------- 采购需求池
/** 分页 */
export function scPurchaseRequestPoolApi(data: Supplier.Purchase.PurchaseRequestPoolPageQuery) {
  return request.post<GetRes<Supplier.Purchase.ScPurchaseRequestPool>>({
    url: '/api/scPurchaseRequestPool/paginQuery',
    data
  })
}

/**分配需求 */
export function allocatedScPurchaseRequestPool(data: { ids: string }) {
  return request.postOriginal({
    url: '/api/scPurchaseRequestPool/allocatedRequest',
    data
  })
}

/**通过ID查询单条数据 */
export function scPurchaseRequestPoolByIdApi(id: string) {
  return request.get<Supplier.Purchase.ScPurchaseRequestPool>({
    url: `/api/scPurchaseRequestPool/${id}`
  })
}

/**查询明细列表 */
export function scPurchaseRequestPoolQueryDetailsApi(id: string) {
  return request.get({
    url: `/api/scPurchaseRequestPool/queryDetails/${id}`
  })
}

/** 获取待排产的数量 */
export function getWaitAllocateCountApi() {
  return request.get({
    url: '/api/scPurchaseRequestPool/getWaitAllocateCount'
  })
}

/** 分页查询 根据当前用户采购需求单待审核/已审核列表 */
export function approvalPageQueryByUserApi(data: Supplier.Purchase.ScPrApprovalPageQuery) {
  return request.post<GetRes<Supplier.Purchase.ScPrApprovalVO>>({
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/scPurchaseRequestOrder/approvalPageQueryByUser',
    url: '/api/scPurchaseRequestOrder/approvalPageQueryByUser',
    data
  })
}

/** 获取全部采购需求单审核列表 */
export function getAllApprovalPageQuery(data: Supplier.Purchase.ScPrApprovalPageQuery) {
  return request.post({
    url: '/api/scPurchaseRequestOrder/approvalPageQuery',
    data
  })
}

/** 催办 */
export function remindPurchaseRequestOrderApi(id?: string) {
  return request.postOriginal({
    url: `/api/scPurchaseRequestOrder/remind/${id}`
  })
}

/**审批 工作流 */
export function scPurchaseRequestOrderReviewApi(data: {
  scPurchaseRequestId: string
  isApprove: boolean
  reviewOpinion: string
}) {
  return request.postOriginal({
    url: '/api/scPurchaseRequestOrder/review',
    data
  })
}

/**查询审批日志 */
export function queryReviewLogApi(id: string) {
  return request.get({
    url: `/api/scPurchaseRequestOrder/queryReviewLog/${id}`
  })
}

/**采购生产审核分页查询 */
export function scPurchaseOrderPaginQueryAudit(params: any) {
  return request.get<GetRes<any>>({
    url: '/api/scPurchaseOrder/paginQueryAudit',
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/scPurchaseOrder/paginQueryAudit',
    params
  })
}

/** 分页查询 全部审核流程中的采购生产单 */
export function scPurchaseOrderPaginQueryAllAuditApi(params: any) {
  return request.get({
    url: '/api/scPurchaseOrder/paginQueryAllAudit',
    params
  })
}

/**查看审核日志 */
export function scPurchaseOrderAuditLogApi(poId: string) {
  return request.post({
    url: '/api/scPurchaseOrder/audit/log',
    params: { poId }
  })
}

/**通过ID查询单条数据（包含明细） 可以根据sku进行筛选 */
export function scPurchaseRequestOrderQueryOneByIdApi(params: { id: string; skuQuery: string }) {
  return request.get({
    url: '/api/scPurchaseRequestOrder/queryOneById',
    params
  })
}

/** 采购需求审核查询明细快照 */
export function scPurchaseRequestOrderQuerySnapshotByIdApi(params: {
  id: string
  skuQuery: string
}) {
  return request.get({
    url: '/api/scPurchaseRequestOrder/querySnapshotById',
    params
  })
}

/**获取单个sku的相关库存数据 库存等 */
export function getInventoryDataBySku(params: { sku: string }) {
  return request.get({ url: `/api/dataDashboard/getInventoryDataBySku/${params.sku}` })
}

/**采购生产审核 */
export function scPurchaseOrderAuditApi(data: { poId: string; status: 0 | 1; remark: string }) {
  return request.postOriginal({
    url: '/api/scPurchaseOrder/audit',
    data
  })
}

/**根据poId查询产前样列表 */
export function scProduceBeforeQueryByPoId(poId: string) {
  return request.get({
    url: `/api/scProduceBefore/queryByPoId/${poId}`
  })
}

/**产前样重新上传 */
export function scProduceBeforeReUpload(params: { poId: string; sku: string }) {
  return request.postOriginal({
    url: '/api/scProduceBefore/reUpload',
    params
  })
}

/**产前样批量新增/修改 */
export function scProduceBeforeBatchSaveOrUpdate(data: any[]) {
  return request.postOriginal({
    url: '/api/scProduceBefore/batchSaveOrUpdate',
    data
  })
}

/**查询产前样日志 */
export function scProduceBeforeQueryLog(params: { poId: string; sku: string }) {
  return request.post({
    url: '/api/scProduceBefore/queryLog',
    params
  })
}

/** 获取新品页面查询参数 */
export function getProductProgressIds(sourceBusinessId: string) {
  return request.get({
    url: `/api/scPurchaseOrder/routerInfo/${sourceBusinessId}`
  })
}

/** 添加批版报告 */
export function addPatternApprovalReportApi(data) {
  return request.postOriginal({
    url: '/api/scPurchaseOrder/addPatternApprovalReport',
    data
  })
}

/** 查询批版报告 */
export function getPatternApprovalReportApi(scPurchaseOrderNo: string) {
  return request.get({
    url: `/api/scPurchaseOrder/getPatternApprovalReport/${scPurchaseOrderNo}`
  })
}

/** 采购生产-我的采购需求-明细导出 */
export function exportScPurchaseRequestOrderDetail(params: {
  scPurchaseRequestOrderId?: string
  scPurchaseRequestOrderNo?: string
}) {
  return request.download({
    url: '/api/scPurchaseRequestOrderDetail/export',
    params
  })
}
/** 导出采购需求单审核明细 */
export function exportapprovalDetail(params: { id?: string }) {
  return request.download({
    url: '/api/scPurchaseRequestOrder/approvalDetail/export',
    params
  })
}

/** 通过业务id查询日志列表-订单日志 */
export function queryListByBusinessIdApi(businessId: string) {
  return request.get({
    url: `/api/scOrderLog/queryListByBusinessId/${businessId}`
  })
}

/** 合并货品设置列表 */
export function getMergeProductListApi(params) {
  return request.post<GetRes<any>>({
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/scGoodsMerge/getPage',
    url: '/api/scGoodsMerge/getPage',
    params
  })
}

/** 通过ID查询单条数据 带明细 */
export function getMergeDetailApi(id: string) {
  return request.get({
    url: `/api/scGoodsMerge/queryById/${id}`
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/scGoodsMerge/queryById/1'
  })
}

/** 删除合并货品 */
export function removeMergeProductApi(id: string) {
  return request.deleteOriginal({
    url: `/api/scGoodsMerge/deleteById/${id}`
  })
}

/**查询货品列表 */
export function selectGoodsPageApi(data: any) {
  return request.post({
    url: '/api/scGoodsMerge/selectGoodsPage',
    data
  })
}

/** 保存合并货品 */
export function saveMergeProduct(data: any) {
  return request.postOriginal({
    url: '/api/scGoodsMerge/saveOrUpdateGoodsMerge',
    data
  })
}

/**获取合同信息 */
export function getContractInfoApi(id: string) {
  return request.get({
    // url: `http://127.0.0.1:4523/m1/4344737-3988140-default/api/scPoContract/getPurchaseContractInfo/1`
    url: `/api/scPoContract/getPurchaseContractInfo/${id}`
  })
}

/**上传文件到签章平台 */
export function uploadFileToSign(data) {
  return request.postOriginal({
    url: '/api/scPurchaseOrder/uploadFileToSign',
    data
  })
}

/**采购价格同步-列表接口 */
export function queryPoDetailPriceChangeListApi(poId: string, signal?: any) {
  return request.get({
    url: `/api/scPurchaseOrder/queryPoDetailPriceChangeList/${poId}`,
    signal
  })
}

/**采购价格同步-价格同步 */
export function syncPoDetailPriceApi(data) {
  return request.postOriginal({
    url: '/api/scPurchaseOrder/syncPoDetailPrice',
    data
  })
}
