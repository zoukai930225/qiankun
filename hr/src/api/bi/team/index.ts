import request from '@/config/axios'

// 获取团队总览 链接列表
export const getTeamOverviewList = (params) => {
  return request.get({ url: '/api/bi/team/teamOverviewLink', params })
}

// 获取团队--责权人列表
export const getTeamList = (params) => {
  return request.get({ url: '/api/bi/team/teamList', params })
}

// 获取团队--个人PK列表
export const getPersonalPKList = (params) => {
  return request.get({ url: '/api/bi/team/personalPK', params })
}
