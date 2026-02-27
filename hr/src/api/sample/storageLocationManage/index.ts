import request from '@/config/axios'

// 库位列表查询
export const getLocationList = (params) => {
  return request.get({ url: `/api/sample-management-location/list`, params })
}

// 库位新增
export const addLocation = (data) => {
  return request.post({ url: `/api/sample-management-location/create`, data })
}

// 编辑库位
export const updateLocation = (data) => {
  return request.post({ url: `/api/sample-management-location/update`, data })
}

// 根据id查询库位信息
export const getLocationById = (id) => {
  return request.get({ url: `/api/sample-management-location/${id}` })
}

// 导出库位数据
export const exportLocationList = (params) => {
  return request.download({ url: `/api/sample-management-location/export`, params })
}

//根据库位编码查询库位信息
export const queryByLocationCode = (params) => {
  return request.get({ url: `/api/sample-management-location/queryByLocationCode`, params })
}
