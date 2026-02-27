/*
 * @Date: 2025-03-06 16:25:01
 */
import request from '@/config/axios'

// 查询人力资源列表
export const getPersonRosterList = (params) => {
  return request.get({ url: '/api/personRoster/list', params })
}

export const getPersonRosterAvatarOriginList = (params) => {
  return request.get({ url: '/api/personRoster/allPersonRosterAvatarOrigin', params })
}

// 获取人力资源详情
export const getPersonRosterDetail = (id: string) => {
  return request.get({ url: `/api/personRoster/info/${id}` })
}
// 人力资源 导出
export const exportPersonRosterList = (params) => {
  return request.download({ url: `/api/personRoster/list/export`, params })
}

// 数据统计维度
export const humanResourcesStatisticsIncumbency = (data) => {
  return request.get({ url: `/api/humanResources/statisticsIncumbency?date=${data}` })
}

// 总入职总离职数量
export const humanResourcesQueryOnboardResignate = (params) => {
  const { beginDate, endDate, company } = params
  return request.get({
    url: `/api/humanResources/queryOnboardResignate?beginDate=${beginDate}&endDate=${endDate}&company=${company}`
  })
}

// 饼状图
export const humanResourcesShape = (params) => {
  const { beginDate, endDate, company } = params
  return request.get({
    url: `/api/humanResources/shape?beginDate=${beginDate}&endDate=${endDate}&company=${company}`
  })
}

// 各部门在职人数
export const humanResourcesQueryIncumbencyByDept = (params) => {
  const { date, company } = params
  return request.get({
    url: `/api/humanResources/queryIncumbencyByDept?date=${date}&company=${company}`
  })
}

// 各部门入离职情况
export const humanResourcesQueryIntoResignation = (params) => {
  const { beginDate, endDate, company } = params
  return request.get({
    url: `/api/humanResources/queryIntoResignation?beginDate=${beginDate}&endDate=${endDate}&company=${company}`
  })
}

//各公司在职人员数据

export const humanResourcesQueryPersonByCompany = (params) => {
  return request.get({ url: `/api/humanResources/queryPersonByCompany`, params })
}

//饼状图人员数据

export const humanResourcesQueryPersonByShape = (params) => {
  return request.get({ url: `/api/humanResources/queryPersonByShape`, params })
}

//ssc在职入职离职

export const humanResourcesQueryDeptByShape = (params) => {
  return request.get({ url: `/api/humanResources/queryDeptByShape`, params })
}

// 部门树

export const getDeptTree = (params: any) => {
  return request.get({ url: `/api/department/getDeptTree`, params })
}

// 各公司在职人员数据 导出
export const exportPersonRoster = (params) => {
  return request.download({ url: `/api/humanResources/queryPersonByCompany/export`, params })
}
// 饼状图人员数据 导出
export const exportPersonRosterByShape = (params) => {
  return request.download({ url: `/api/humanResources/queryPersonByShape/export`, params })
}
// ssc在职入职离职 导出
export const exportDeptByShape = (params) => {
  return request.download({ url: `/api/humanResources/queryDeptByShape/export`, params })
}
