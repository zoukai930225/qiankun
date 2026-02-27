import request from '@/config/axios'

// 预约发货审核列表
export function getAppointApproveList(data: {}) {
  return request.post({
    url: '/api/scAdvancedShippingRequestOrder/paginQueryByApprove',
    data
  })
}

// 预约发货订单审批接口
export function updateAppointApprove(data: {}) {
  return request.post({
    url: '/api/scAdvancedShippingRequestOrder/approve',
    data
  })
}

// 采购生产单 查看明细
export function getPurchaseOrderDetailList(params: {}) {
  return request.get({
    url: '/api/scPurchaseOrderDetail/list',
    params
  })
}

// 通过id 查询单条数据
export function getAdvancedShippingRequestOrderById(id) {
  return request.get({
    url: `/api/scAdvancedShippingRequestOrder/${id}`
  })
}

// 查询仓库预约情况  预约日历组件查询
export function queryWarehouseOrderSituation(params: {}) {
  return request.get({
    url: '/api/scAdvancedShippingRequestOrder/queryWarehouseOrderSituation',
    params
  })
}

// 查看审核记录
export function getPurchaseAuditLogList(bizId: string) {
  return request.get({
    url: '/api/scPurchaseAuditLog/list',
    params: { bizId }
  })
}

// 仓库收货列表
export function getpaginQueryWareHouseApi(data: {}) {
  return request.post({
    url: '/api/scAdvancedShippingRequestOrder/paginQueryWareHouse',
    data
  })
}
