import request from '@/config/axios'

// 获取客服记录列表
export const getList = (params) => {
  return request.get({ url: '/api/customer-service-team/list', params })
}

// 新增操作
export const addCustomerGroup = (data: any) => {
  return request.post({ url: `/api/customer-service-team/create`, data })
}

// 更新操作
export const updateCustomerGroup = (data: any) => {
  return request.post({ url: `/api/customer-service-team/update`, data })
}

// 根据组id查询数据

export const getDetailById = (id) => {
  return request.get({ url: `/api/customer-service-team/${id}` })
}

// 删除操作
export const deleteById = (id) => {
  return request.post({ url: `/api/customer-service-team/delete/${id}` })
}
