import request from '@/config/axios'

// 查询人力资源列表
export const getPersonRosterList = (params) => {
  return request.get({ url: '/api/personRoster/list', params })
}

export const getPersonRosterAvatarOriginList = (params) => {
  return request.get({ url: '/api/personRoster/allPersonRosterAvatarOrigin', params })
}

// 查询拍摄衣库
export const getClothesLibraryList = (params) => {
  return request.get({ url: '/api/shooting-clothing-warehouse/list', params })
}

// 查询拍摄衣库详情
export const getClothesLibraryDetail = (id) => {
  return request.get({ url: `/api/shooting-clothing-warehouse/${id}` })
}

// 新增更新拍摄衣库
export const addOrUpdateClothesLibrary = (data) => {
  return request.post({ url: '/api/shooting-clothing-warehouse/saveOrUpdate', data })
}

// 删除拍摄衣库
export const deleteClothesLibrary = (data) => {
  return request.post({ url: `/api/shooting-clothing-warehouse/delete`, data })
}
