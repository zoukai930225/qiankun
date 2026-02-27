import request from '@/config/axios'

// /api/dataIndicatorsConfiguration/list 分页查询
export const getPage = (params: any) => {
  return request.get({ url: '/api/dataIndicatorsConfiguration/list', params })
}
// /api/dataIndicatorsConfiguration/get/{id}
export const getDetail = (id: string) => {
  return request.get({ url: `/api/dataIndicatorsConfiguration/get/${id}` })
}
// /api/dataIndicatorsConfiguration/delete/{id}
export const del = (id: string) => {
  return request.get({ url: `/api/dataIndicatorsConfiguration/delete/${id}` })
}
// /api/dataIndicatorsConfiguration/save
export const save = (data: any) => {
  return request.post({ url: '/api/dataIndicatorsConfiguration/save', data, showLoading: true })
}

// /api/dataIndicatorsConfiguration/getsql
export const getSql = (data: any) => {
  return request.post({ url: `/api/dataIndicatorsConfiguration/getsql`, data })
}

// /api/dataIndicatorsConfiguration/getSeven/{id}
export const getSeven = (id: string) => {
  return request.get({ url: `/api/dataIndicatorsConfiguration/getSeven/${id}` })
}
