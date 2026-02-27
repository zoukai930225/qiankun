import request from '@/config/axios'

export type DictDataVO = {
  id: string | number | undefined
  company: string
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

// 查询字典数据（精简)列表
export const getSimpleDictDataList = () => {
  return request.get({ url: '/api/dict/list?type=2&page=1&size=9999999' })
}

// 查询所有字典数据列表
export const getAllDictDataList = (filterCodes: string) => {
  return request.get({ url: `/api/dict/dataList?filterCodes=${filterCodes}` })
}

// 查询字典数据列表项
export const getDictDataItemList = (pcode) => {
  return request.get({ url: `/api/dict/getItem/${pcode}` })
}

// 查询字典数据列表
export const getDictDataPage = (params: PageParamNew) => {
  return request.get({ url: '/api/dict/list', params })
}

// 查询字典数据详情
export const getDictData = (id: string) => {
  return request.get({ url: `/api/dict/get/${id}` })
}

// 新增字典数据
export const createDictData = (data: DictDataVO) => {
  return request.post({ url: '/api/dict/addItem', data })
}

// 修改字典数据
export const updateDictData = (data: DictDataVO) => {
  return request.post({ url: '/api/dict/update', data })
}

// 删除字典数据
export const deleteDictData = (id: string) => {
  return request.get({ url: `/api/dict/delete/${id}` })
}
