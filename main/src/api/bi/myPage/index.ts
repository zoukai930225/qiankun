import request from '@/config/axios'

// 我的/团队详情 ： 包括责权店铺数/商品数/访客数等数据
export const getTeamDetail = (params) => {
  return request.get({ url: '/api/bi/team/getSelfInfo', params })
}
