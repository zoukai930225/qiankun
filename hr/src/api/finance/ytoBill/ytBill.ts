import request from '@/config/axios'
//圆通账单上传
export const uploadExcel = (data, config?: any) => {
  return request.formPostOriginal({ url: '/api/ytBill/excelUpload', data, ...config, timeout: 0 })
}
//圆通账单数据匹配
export const dataMatch = (params) => {
  return request.get({ url: '/api/ytBill/dataMatch', params })
}
//圆通账单记录删除
export const deletById = (id) => {
  return request.delete({ url: `/api/ytoImportRecord/delete/${id}` })
}

//圆通上传记录列表
export const recordPageList = (params) => {
  return request.get({ url: '/api/ytoImportRecord/pageList', params })
}

//圆通账单数据查询
export const pageList = (params) => {
  return request.get({ url: '/api/ytBill/pageList', params })
}

//圆通账单数据导出
export const exportList = (params) => {
  return request.get({ url: '/api/ytBill/exportList', params })
}

//圆通分组查询
export const groupTypeAllList = (params = {}) => {
  return request.get({ url: '/api/ytBill/groupTypeAllList', params })
}

//圆通目的地省查询 
export const targetProvinceAllList = (params = {}) => {
  return request.get({ url: '/api/ytBill/targetProvinceAllList', params })
}

//账单匹配记录
export const listMatchRecord = (params = {}) => {
  return request.get({ url: '/api/ytBill/listMatchRecord', params })
}

//汇算查询
export const settlementPageList = (params = {}) => {
  return request.get({ url: '/api/ytBill/settlementPageList', params })
}

//汇算结果导出
export const exportSettlementList = (params = {}) => {
  return request.download({ url: '/api/ytBill/exportSettlementList', params })
}

//店铺查询
export const storeAllList = (params = {}) => {
  return request.get({ url: '/api/ytBill/storeAllList', params })
}