import request from '@/config/axios'

// 客服聊天记录
export const getCustomerServiceChatHistory = (data: any) => {
  return request.post({ url: '/api/pdd/chat/chatData', data })
}
