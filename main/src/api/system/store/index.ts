import request from '@/config/axios'

export type StoreVO = {
  id: string | number | undefined
  name: string
  code: string
  channel: string
}

export interface channelDirectorManagerSaveParams {
  channel: string
  channelName: string
  directorId: string
  directorName: string
  id: string
}

// 查询店铺列表
export const getStorePage = (params: PageParamNew) => {
  return request.get({ url: '/api/store/list', params })
}

// 查询店铺详情
export const getStoreDetail = (id: string) => {
  return request.get({ url: `/api/store/get/${id}` })
}

// 新增、修改店铺
export const createOrUpdateStore = (data: StoreVO) => {
  return request.post({ url: '/api/store/save', data })
}

// 删除店铺
export const deleteStore = (id: string) => {
  return request.get({ url: `/api/store/delete/${id}` })
}

// 新增和修改渠道负责人
export function channelDirectorManagerSave(data: channelDirectorManagerSaveParams) {
  return request.postOriginal({ url: '/api/channelDirectorManager/save', data })
}

// 设置店铺负责人
export function storeDirecormaintenaction(data: channelDirectorManagerSaveParams) {
  return request.postOriginal({ url: '/api/store/storedirectermaintenance', data })
}

// 通过渠道code查询
export function getChannelByCode(code: string) {
  return request.get({ url: `/api/channelDirectorManager/getchannel/${code}` })
}
