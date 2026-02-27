import request from '@/config/axios'

// 获取店铺列表
export const getShopList = () => {
  return request.get({ url: `/api/store/getAllValue` })
}

// 列表 -分页查询
export const getPageList = (params) => {
  return request.get({ url: `/api/goodsThreshold/pageList`, params })
}

// 根据id删除
export const deleteById = (params) => {
  return request.get({ url: `/api/goodsThreshold/deletedById`, params })
}

//执行 启用/禁用
export const enableOrDisable = (params) => {
  return request.get({ url: `/api/goodsThreshold/status`, params })
}

// 新增监控
export const addMonitor = (data) => {
  return request.post({ url: `/api/goodsThreshold/save`, data })
}

// 更新监控
export const updateMonitor = (data) => {
  return request.post({ url: `/api/goodsThreshold/update`, data })
}

// 根据id查询监控详情
export const getMonitorDetail = (params) => {
  return request.get({ url: `/api/goodsThreshold/getById`, params })
}
