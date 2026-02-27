import request from '@/config/axios'

// 列表分页查询
export const pageList = (data) => {
  return request.post({ url: '/api/csQualityInspection/page', data })
}

export const add = (data) => {
  return request.post({ url: '/api/csQualityInspection/add', data })
}

export const editForCreate = (data) => {
  return request.post({ url: '/api/csQualityInspection/editForCreate', data })
}
export const editForHandle = (data) => {
  return request.post({ url: '/api/csQualityInspection/editForHandle', data })
}
// 通过ID查询单条数据
export const getDetailsById = (id) => {
 return request.get({ url: `/api/csQualityInspection/${id}` })
}
export const deleteById = (params:{id:string}) => {
  return request.delete({ url: '/api/csQualityInspection/deleteById', params })
}
export const exportList = (data) => {
  return request.downloadPost({ url: '/api/csQualityInspection/export', data })
}