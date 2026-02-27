import request from '@/config/axios'

// 分页查询接口
export const getTagList = (params: any) => {
  return request.get({ url: `/api/tag/queryTag`, params })
}

// 新增标签接口
export const addTag = (data: any) => {
  return request.post({ url: `/api/tag/add`, data })
}

// 根据id回显
export const getTagById = (params: any) => {
  return request.get({ url: `/api/tag/queryById`, params })
}

// 修改标签接口
export const updateTag = (data: any) => {
  return request.post({ url: `/api/tag/updateTagById`, data })
}

// 删除标签接口
export const deleteTag = (id: any) => {
  return request.post({ url: `/api/tag/deleteTagById/${id}` })
}

// 渠道店铺接口
export const getQueryChannels = () => {
  return request.get({ url: '/api/wdtGoods/queryChannels' })
}
