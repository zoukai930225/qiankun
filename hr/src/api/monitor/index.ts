import request from '@/config/axios'

export interface qualityInspectionParams {
  goodsName?: string
  goodsId?: string
  sendResult?: string
  handleStatus?: 0 | 1 // 0-未处理,1-已处理
  channel?: string
  store?: string
  operationsPersonnelId?: string
  page?: number
  pageSize?: number
}
export interface qualityInspectionScoreAlarmReminderHandleParams {
  alarmId?: string
  processDescription?: string
  fileKey?: string
}

export interface wdtInventoryListParams {
  pageNo?: number
  pageSize?: number
  skuCode?: string
  productName?: string
  sendResult?: 0 | 1
  processStatus?: 0 | 1
  alarmTimeStr?: string
}

export interface wdtInventoryDealsSaveInBatchParams {
  attachmentUrl?: string
  ids?: string[]
  remarks?: string
}

export interface wdtInventoryDealsSaveInBatchRes {
  alarmTime?: string
  alarmTypeDesc?: string
  attachmentUrl?: string
  category?: string
  failReason?: string
  id?: string
  processCompletionTime?: string
  processorName?: string
  processStatus?: string
  productName?: string
  remarks?: string
  responsibilityPersonName?: string
  sendResult?: string
  skuCode?: string
  specificationCode?: string
  specificationName?: string
  stock?: number
}

export interface newProductPayNotifyListParams {
  directorId?: string
  directorName?: string
  goodsId?: string
  goodsName?: string
  operationState?: string
  page: number
  planId?: string
  planName?: string
  sendResult?: string
  size: number
  storeName?: string
  updatedId?: string
  operateName?: string
}

export interface newProductPayNotifyUpdateParams {
  attachmentUrl: string
  id: string
  operationRemark: string
}

// 查询质量分告警列表
export function qualityInspectionScoreAlarmReminderPageQuery(params: qualityInspectionParams) {
  return request.get({ url: '/api/notify/qualityInspectionScoreAlarmReminder/pageQuery', params })
}

// 质量分重发
export function qualityInspectionScoreAlarmReminderResend(id: string) {
  return request.getOriginal({
    url: `/api/notify/qualityInspectionScoreAlarmReminder/resend/${id}`
  })
}

// 质量分处理
export function qualityInspectionScoreAlarmReminderHandle(
  data: qualityInspectionScoreAlarmReminderHandleParams
) {
  return request.postOriginal({
    url: '/api/notify/qualityInspectionScoreAlarmReminder/handle',
    data
  })
}

// 质量分查看详情
export function qualityInspectionScoreAlarmReminder(id: string) {
  return request.get({ url: `/api/notify/qualityInspectionScoreAlarmReminder/${id}` })
}

// 查询库存告警列表
export function wdtInventoryPageList(params: wdtInventoryListParams) {
  return request.get({ url: '/api/notify/wdtInventory/pageList', params })
}

// 库存告警重发
export function wdtInventoryResend(data: { id: string }) {
  return request.postOriginal({ url: '/api/notify/wdtInventory/resend', data })
}

// 库存告警处理
export function wdtInventoryDealsSaveInBatch(data: wdtInventoryDealsSaveInBatchParams) {
  return request.postOriginal({ url: '/api/notify/wdtInventory/deals/saveInBatch', data })
}

// 查询库存告警详情
export function wdtInventoryDetail(params: { id: string }) {
  return request.get({ url: '/api/notify/wdtInventory/queryById', params })
}

// 查询新品付费提醒列表
export function newProductPayNotifyList(params: newProductPayNotifyListParams) {
  return request.get({ url: '/api/notify/newProductPayNotify/list', params })
}

// 新品付费处理
export function newProductPayNotifyUpdate(data: newProductPayNotifyUpdateParams) {
  return request.postOriginal({ url: '/api/notify/newProductPayNotify/update', data })
}

// 新品付费提醒查看详情
export function newProductPayNotifyDetail(id: string) {
  return request.get({ url: `/api/notify/newProductPayNotify/get/${id}` })
}

// 新平付费提醒重发
export function newProductPayNotifyRetransmission(data: { id: string }) {
  return request.postOriginal({ url: '/api/notify/newProductPayNotify/retransmission', data })
}
