import request from '@/config/axios'

// 列表分页查询
export const pageList = (params) => {
  return request.get({ url: '/api/vcModelLib/list', params })
}
export const save = (data) => {
  return request.post({ url: '/api/vcModelLib/save', data })
}
export const getDetailsById = (id) => {
  return request.get({ url: `/api/vcModelLib/get/${id}` })
}
export const edit = (data) => {
  return request.post({ url: '/api/vcModelLib/update', data })
}
export const deleteById = (data) => {
  return request.post({ url: '/api/vcModelLib/delete', data })
}