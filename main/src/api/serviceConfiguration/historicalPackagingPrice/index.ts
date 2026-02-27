import request from '@/config/axios'

// 列表 -分页查询
export const getPageList = (params) => {
  return request.get({ url: `/api/packageCostData/list`, params })
}

// 新增数据
export const addData = (data) => {
  return request.post({ url: `/api/packageCostData/add`, data })
}

// 根据id查询数据回显
export const getDataById = (id) => {
  return request.get({ url: `/api/packageCostData/getById/${id}` })
}

// 更新数据
export const updateData = (data) => {
  return request.post({ url: `/api/packageCostData/update`, data })
}

// 删除数据
export const deleteData = (id) => {
  return request.post({ url: `/api/packageCostData/delete/${id}` })
}

// 查询历史包装价
export const getHistoricalPackagingPrice = (id , params) => {
  return request.get({ url: `/api/packageCostData/getHistoryList/${id}`, params})
}

// 导出包装耗材费清单
export const exportPackagingCostList = () => {
  return request.download({ url: `/api/packageCostData/export` })
}
