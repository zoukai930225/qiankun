import request from '@/config/axios'

//分页列表
export const getGoodsWorksInfo = (params: any) => {
  return request.get({ url: '/api/goodsWorksInfo/list', params })
}
//获取统计时间
export const getGoodsDate = () => {
  return request.get({ url: '/api/goodsWorksInfo/getLastTime' })
}
//导出
export const exportList = (params) => {
  return request.download({ url: '/api/goodsWorksInfo/exportList', params })
}

//获取详情
export const getDetailById = (params) => {
  return request.get({ url: `/api/goodsWorksInfo/get`, params })
}

//获取统计
export const getDetailChartById = (params) => {
  return request.get({ url: `/api/goodsWorksInfo/getValue`, params })
}

//分配
export const contributonUser = (data) => {
  return request.post({ url: `/api/goodsWorksInfo/contributon`, data })
}

//认领
export const claimMy = (data) => {
  return request.post({ url: `/api/goodsWorksInfo/claim`, data })
}

//获取未认领数量
export const getNotClaimCount = (params: any) => {
  return request.get({ url: '/api/goodsWorksInfo/notClaimCount', params })
}

//批量认领
export const batchClaimMy = (data) => {
  return request.post({ url: `/api/goodsWorksInfo/batchClaim`, data })
}