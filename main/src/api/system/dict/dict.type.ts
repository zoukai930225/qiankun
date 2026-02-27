import request from '@/config/axios'

export type DictTypeVO = {
  id: string | number | undefined
  name: string
  shortName: string
  type: number
  code: string
  pCode: string
  value: string
  createdAt: Date
  status: number
  remark: string
  createTime: Date
}

// 查询字典列表
export const getDictTypePage = (params: PageParamNew) => {
  return request.get({ url: '/api/dict/list', params })
}

// 查询字典详情
export const getDictType = (id: string) => {
  return request.get({ url: `/api/dict/get/${id}` })
}

// 新增字典
export const createDictType = (data: DictTypeVO) => {
  return request.post({ url: '/api/dict/add', data })
}

// 修改字典
export const updateDictType = (data: DictTypeVO) => {
  return request.post({ url: '/api/dict/update', data })
}

// 删除字典
export const deleteDictType = (id: string) => {
  return request.get({ url: `/api/dict/delete/${id}` })
}
