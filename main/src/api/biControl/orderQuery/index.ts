import request from '@/config/axios'

//支付订单列表
export const getPayOrderList = (params) => {
  return request.get({ url: `/api/payOrder/list`, params })
}
//支付订单导出
export const payOrderExport = (params) => {
  return request.get({ url: `/api/payOrder/export`, params })
}

//补发订单列表
export const getReplenishmentList = (params) => {
  return request.get({ url: `/api/replenishment/list`, params })
}
//补发订单导出
export const replenishmentExport = (params) => {
  return request.get({ url: `/api/replenishment/export`, params })
}

//发货订单列表
export const getDeliveryList = (params) => {
  return request.get({ url: `/api/delivery/list`, params })
}
//发货订单导出
export const deliveryExport = (params) => {
  return request.get({ url: `/api/delivery/export`, params })
}

//发货订单列表
export const getRefundList = (params) => {
  return request.get({ url: `/api/refund/list`, params })
}
//发货订单导出
export const refundExport = (params) => {
  return request.get({ url: `/api/refund/export`, params })
}

//获取导出列表
export const getSysExportDownloadList = (params) => {
  return request.get({ url: `/api/sysExportRecord/page`, params })
}

