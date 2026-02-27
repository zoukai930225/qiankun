import request from '@/config/axios'

export const pageList = (params: any) => {
  return request.get({ url: '/api/shipmentInspection/paginQuery', params })
}

export const paginQueryDetail = (params: any) => {
  return request.get({ url: '/api/shipmentInspection/paginQueryDetail', params })
}

export const exportList = (data) => {
  return request.downloadPost({
    url: '/api/shipmentInspection/export',
    data
  })
}

export function shipmentInspectionRequestDetail(orderId: string) {
  return request.get({
    url: `/api/shipmentInspection/requestDetail/${orderId}`
  })
}

/** 获取质检人员列表 */
export function getQCPersonListApi() {
  return request.get({
    url: '/api/QCInspection/getQcInspectors'
  })
}

/** 配置QC质检员 */
export function setQCPersonApi(params: { inspectorId: string; poId: string }) {
  return request.getOriginal({
    url: '/api/scPurchaseOrder/configureQcQualityInspectors',
    params
  })
}

/** 获取免检审核列表 */
export function getExemptionListApi(params: { scPurchaseOrderId: string }) {
  return request.get({
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/QCInspection/list',
    url: '/api/QCInspection/list',
    params
  })
}

/** 免检审核撤回 */
export function recallExemptionAuditApi(id) {
  return request.getOriginal({
    url: `/api/QCInspection/withdraw/${id}`
  })
}

/** 免检审核详情 */
export function getExemptionDetailApi(params: { id?: string; poId?: string }) {
  return request.get({
    url: '/api/QCInspection/getOneById',
    params
  })
}

/** 提交免检申请 */
export function saveExemptionApplicationApi(data: {
  scPurchaseOrderId: string
  reason: string
  file: string
}) {
  return request.postOriginal({
    url: '/api/QCInspection/addOrSaveQcInspection',
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/QCInspection/addOrSaveQcInspection',
    data
  })
}

/** 免检审核 */
export function auditExemptionApplicationApi(data: {
  id: string
  result: '1' | '2'
  remark: string
  file: string
}) {
  return request.postOriginal({
    url: '/api/QCInspection/review',
    data
  })
}
