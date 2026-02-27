import request from '@/config/axios'

// 查询奖池列表
export const getLotteryPage = () => {
  return request.get({ url: '/api/am/lottery/getList' })
}

// 查询奖池详情
export const getLotteryDetail = (id: string) => {
  return request.get({ url: `/api/am/lottery/getById?id=${id}` })
}

// 新增、修改奖池
export const createOrUpdateLottery = (data: any) => {
  return request.post({ url: '/api/am/lottery/saveOrUpdate', data })
}

// 删除奖池
export const deleteLottery = (id: string) => {
  return request.get({ url: `/api/am/lottery/deletedById?id=${id}` })
}

// 设置默认奖池
export const setDefaultStatus = (data: any) => {
  return request.post({ url: `/api/am/lottery/status`, data })
}

// 获取批次列表
export const getBatchList = () => {
  return request.get({ url: `/api/am/lottery/getBatchList` })
}

// 导出数据
export const exportLotteryData = (params: Object) => {
  return request.download({ url: '/api/am/lottery/export', params })
}
