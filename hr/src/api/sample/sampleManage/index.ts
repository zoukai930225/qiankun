import request from '@/config/axios'

// 获取样品管理数据列表
export const getInventoryList = (params) => {
  return request.get({ url: `/api/sample-management-inventory/list`, params })
}

// 库存新增
export const addInventory = (data) => {
  return request.post({ url: `/api/sample-management-inventory/create`, data })
}

// 库存编辑
export const updateInventory = (data) => {
  return request.post({ url: `/api/sample-management-inventory/update`, data })
}

// 报废/出库 查询库存
export const getInventoryById = (id) => {
  return request.get({ url: `/api/sample-management-inventory/${id}` })
}

// 根据条码查询基本信息
export const queryBasicInfoByBarcode = (params) => {
  return request.get({ url: `/api/sample-management-inventory/queryBasicInfoByBarcode`, params })
}

// 报废
export const createScrapSample = (data) => {
  return request.post({ url: `/api/sample-management-correlation-location/createScrap`, data })
}

// 根据库存条码查询库存  编辑使用
export const queryByBarcode = (params) => {
  return request.get({ url: `/api/sample-management-inventory/queryByBarcode`, params })
}

// 出库
export const outWarehouse = (data) => {
  return request.post({ url: `/api/sample-management-correlation-location/outWarehouse`, data })
}

// 入库
export const inWarehouse = (data) => {
  return request.post({ url: `/api/sample-management-correlation-location/inWarehouse`, data })
}

// 导出
export const exportData = (params) => {
  return request.download({ url: `/api/sample-management-inventory/export`, params })
}
