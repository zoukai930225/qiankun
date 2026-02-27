/*
 * @Date: 2024-06-07 14:17:38
 */
import request from '@/config/axios'

export type SupplementOrderVO = {
  id: number | undefined
  orderNumber: string // 订单编号
  amount: number //金额
  commission: string // 佣金
  brushTime: string // 刷单时间
  category: string // 品类
  shopId: string // 店铺ID
  storeId: string // 店铺ID
  use: boolean // 是否使用
  warehoustId: string // 仓库ID
  extensionField1: string // 补充字段1
  extensionField2: string // 补充字段2
  extensionField3: string // 补充字段3
  extensionField4: string // 补充字段4
  extensionField5: string // 补充字段5
  extensionField6: string // 补充字段6
  extensionField7: string // 补充字段7
  extensionField8: string // 补充字段8
  extensionField9: string // 补充字段9
  extensionField10: string // 补充字段10
}

export type SupplementOrderTotalVO = {
  amountSum: number
  commissionSum: number
}

// 查询补单数据列表
export const getSupplementOrdersPage = (params: PageParamNew) => {
  return request.get({ url: '/api/makeup/orders/list', params })
}

// 查询补单数据汇总
export const getSupplementOrdersTotal = (params: object) => {
  return request.get({ url: '/api/makeup/orders/total', params })
}

// 补单数据导入
export const supplementOrdersImport = (data) => {
  return request.post({ url: '/api/makeup/orders/import', data })
}

// 补单数据模版下载
export const supplementOrdersTemplateExport = () => {
  return request.download({ url: '/api/makeup/orders/excel/export' })
}

//订单对账列表
export const getOrderReconciliationList = (params) => {
  return request.get({ url: '/api/orderReconciliation/list', params })
}

//获取店铺
export const getStore = () => {
  return request.get({ url: '/api/orderReconciliation/getStore' })
}

//订单对账获取账单订单详情
export const getBillDetail = (params) => {
  return request.get({ url: '/api/orderReconciliation/getBillDetail', params })
}
// 获取订单对账汇总列表
export const getSumList = (params) => {
  return request.get({ url: '/api/orderReconciliation/sumList', params })
}

// 获取参数列表
export const getStoreName = (code) => {
  return request.get({ url: `/api/orderReconciliation/getStoreName?store=${code}` })
}
//订单对账导出
export const exportOrderReconciliation = (data) => {
  return request.downloadPost({ url: '/api/orderReconciliation/export', data })
}
