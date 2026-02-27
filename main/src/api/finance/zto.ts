import request from '@/config/axios'

// api/zto/uploadExcel
export const uploadExcel = (data: any, config?: any) => {
  return request.formPostOriginal({ url: '/api/zto/excelUpload', data, ...config, timeout: 0 })
}

// /api/ztoImportRecord/pageList
export const getZtoImportRecordList = (params: any) => {
  return request.get({ url: '/api/ztoImportRecord/pageList', params })
}

// /api/zto/matchAgain
export const dataMatch = (data: any) => {
  return request.post({ url: '/api/zto/matchAgain', data, showLoading: true })
}

// /api/zto/pageList
export const getZtoPageList = (params: any) => {
  return request.get({ url: '/api/zto/pageList', params })
}

// /targetProvinceAllList
export const getTargetProvinceAllList = () => {
  return request.get({ url: '/api/zto/targetProvinceAllList' })
}

// /groupTypeAllList
export const getGroupTypeAllList = () => {
  return request.get({ url: '/api/zto/groupTypeAllList' })
}

// exportList
export const exportList = (params: any) => {
  return request.download({ url: '/api/zto/exportList', params, showLoading: true })
}

// /api/ztoExport/pageList
export const getZtoExportPageList = (params: any) => {
  return request.get({ url: '/api/ztoExport/pageList', params })
}

// 添加配置
export const addZtoPriceConfig = (data: any) => {
  return request.post({ url: '/api/ztoPriceConfig/add', data, showLoading: true })
}

// 修改配置
export const updateZtoPriceConfig = (data: any) => {
  return request.post({ url: '/api/ztoPriceConfig/update', data, showLoading: true })
}

// 分页查询配置
export const getZtoPriceConfigPageList = (params: any) => {
  return request.get({ url: '/api/ztoPriceConfig/pageList', params })
}

// 批量删除配置
export const batchDelZtoPriceConfig = (data: any) => {
  return request.post({ url: '/api/ztoPriceConfig/batchDel', data, showLoading: true })
}

// 匹配
export const matchZtoPriceConfig = (params: any) => {
  return request.get({ url: '/api/ztoPriceConfig/match', params, showLoading: true })
}

// 分组列表
export const getGroupTypeList = () => {
  return request.get({ url: '/api/zto/groupTypeAllList' })
}

// 店铺列表
export const getStoreAllList = () => {
  return request.get({ url: '/api/zto/storeAllList' })
}

// 网点下拉
export const getWaybillAllList = () => {
  return request.get({ url: '/api/zto/waybillAllList' })
}

// /ztoPriceStat/list
export const getZtoPriceStatList = (params: any) => {
  return request.get({ url: '/api/ztoPriceStat/list', params })
}

//
export const getZtoPriceMatchRecordList = (params: any) => {
  return request.get({ url: '/api/ztoPriceMatchRecord/pageList', params })
}

// /api/ztoPriceStat/exportList
export const exportZtoPriceStatList = (params: any) => {
  return request.download({ url: '/api/ztoPriceStat/exportList', params, showLoading: true })
}
