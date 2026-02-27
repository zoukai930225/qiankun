import request from '@/config/axios'


// 退货退款列表
export const list = (params) => {
  return request.get({ url: '/api/returnRefund/pageList', params })
}

// 退货退款详情
export const getInfo = (params) => {
  return request.get({ url: '/api/returnRefund/getInfo', params })
}

// 退货退款列表导出
export const exportList = (params) => {
  return request.get({ url: '/api/returnRefund/exportList', params })
}