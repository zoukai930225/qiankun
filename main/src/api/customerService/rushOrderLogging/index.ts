import request from '@/config/axios'

// 列表分页查询
export const pageList = (params) => {
  return request.get({ url: '/api/wdtUrgentOrderRecord/list', params })
}
export const delteById = (id) => {
  return request.get({ url: `/api/wdtUrgentOrderRecord/delete/${id}`})
}
export const updateOrder = (data) => {
  return request.post({ url: `/api/wdtUrgentOrderRecord/update`,data})
}

export const addOrder = (data) => {
  return request.post({ url: `/api/wdtUrgentOrderRecord/save`,data})
}
// 处理订单
export const handleOrder = (data) => {
  return request.post({ url: `/api/wdtUrgentOrderRecord/process`,data})
}