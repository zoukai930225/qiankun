import request from '@/config/axios'

const prefix = '/api/message/notice'

// 查询消息列表
export const getMessageList = (data = {}) => {
  return request.post({ url: `${prefix}/getMessageList`, data })
}

// 查询待处理数量
export const getToDoMessageCount = (params = {}) => {
  return request.get({ url: `${prefix}/getToDoMessageCount`, params })
}

// 查询消息详情
export const getMessageDetail = (id) => {
  return request.get({ url: `${prefix}/get/${id}` })
}

// 修改消息
export const updateMessage = (data) => {
  return request.post({ url: `${prefix}/update`, data })
}

// 清除未读
export const clearUnread = () => {
  return request.get({ url: `${prefix}/clearUnread` })
}