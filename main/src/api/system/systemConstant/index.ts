import request from '@/config/axios'

// 查询列表
export const getSystemConstantConfigPage = (params: PageParamNew) => {
  return request.get({ url: '/api/config/list', params })
}

// 查询详情
export const getSystemConstantConfigbyId = (id: string) => {
  return request.get({ url: `/api/config/get/${id}` })
}

// 获取文字接口（第二行）
export const getSystemConstantConfigbyCode = (code: string) => {
  return request.get({ url: `/api/config/getCode/${code}` })
}

// 新增、修改
export const saveSystemConstantConfig = (data: any) => {
  return request.post({ url: '/api/config/save', data })
}

// 删除
export const deleteSystemConstantConfig = (id: string) => {
  return request.get({ url: `/api/config/delete/${id}` })
}

// 刷新缓存
export const refreshSystemConstantConfig = () => {
  return request.get({ url: '/api/xxljob/refresh/redis' })
}
