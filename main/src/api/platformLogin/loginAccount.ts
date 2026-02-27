import request from '@/config/axios'

// 查询列表
export const getLoginAccountList = (params) => {
  return request.get({ url: '/api/platformInfo/list', params })
}

// 删除
export const deleteLoginAccount = (id: string) => {
  return request.post({ url: `/api/platformInfo/delete/${id}` })
}
// 获取详情
export const getLoginAccountDetail = (id) => {
  return request.get({ url: `/api/platformInfo/get/${id}` })
}
// 新增
export const saveLoginAccount = (data) => {
  return request.post({ url: '/api/platformInfo/create', data: data })
}

// 编辑
export const updateLoginAccount = (data) => {
  return request.post({ url: '/api/platformInfo/update', data: data })
}

// 获取email列表
export const loginAccountGetEmail = (params) => {
  return request.get({ url: '/api/platformInfo/getEmail', params: params })
}
