import request from '@/config/axios'

// 商品名称关键字与发票类目映射维护 分页查询并模糊匹配
export const list = (params) => {
  return request.get({ url: '/api/financeProductCategory/list', params })
}

// 商品名称关键字与发票类目映射维护 更新数据
export const update = (data) => {
  return request.post({ url: '/api/financeProductCategory/update', data })
}

// 商品名称关键字与发票类目映射维护 新增数据
export const save = (data) => {
  return request.post({ url: '/api/financeProductCategory/save', data })
}

// 商品名称关键字与发票类目映射维护 通过主键删除数据
export const deleteId = (id) => {
  return request.get({ url: `/api/financeProductCategory/delete/${id}` })
}

// 待开票状态业务表 分页查询
export const financeInvoiceRecordsStatus = (params) => {
  return request.get({ url: '/api/financeInvoiceRecordsStatus', params })
}

// 根据时间戳和订单编号，查询原始数据
export const getResourceOrderInfo = (params) => {
  return request.get({ url: '/api/financeInvoiceRecordsStatus/getResourceOrderInfo', params })
}

// 重新开票
export const reInvoicing = (data) => {
  return request.post({ url: '/api/financeInvoiceRecordsStatus/reInvoicing', data })
}

// 修改人工处理状态为已人工开票
export const manualInvoicing = (data) => {
  return request.post({ url: '/api/financeInvoiceRecordsStatus/manualInvoicing', data })
}
