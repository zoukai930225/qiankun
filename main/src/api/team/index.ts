/*
 * @Date: 2024-06-11 09:37:31
 */
import request from '@/config/axios'

// 任务新增接口
// export const createVisualApproval = (data: any) => {
//   return request.post({ url: '/api/visualApproval/create', data })
// }

// 任务分页查询接口
export const getVisualApprovalList = (params: any) => {
  return request.get({ url: `/api/visualApproval/list`, params })
}

//任务信息查询接口
// export const getVisualApprovalById = (id) => {
//   return request.get({ url: `/api/visualApproval/${id}` })
// }

//操作记录新增
export const createRecordVisualApproval = (data: any) => {
  return request.post({ url: '/api/visualApproval/createRecord', data })
}
//操作记录查询（区分节点）
export const getSingleRecord = (id, node) => {
  return request.get({ url: `/api/visualApproval/${id}/${node}/records` })
}
// 人员信息下拉查询
export const getVisualPersonRoster = () => {
  return request.get({ url: `/api/visualApproval/getVisualPersonRoster` })
}

// 2.0版本
//操作人员信息下拉查询
export const getOperatorRoster = (params) => {
  return request.get({ url: `/api/visualApproval/getOperatorRoster`, params })
}
export const getOperatorRosterNew = (params) => {
  return request.get({ url: `/api/visualApproval/getCalendarOperatorRoster`, params })
}
//审核人员信息下拉查询
export const getAuditorRoster = (params) => {
  return request.get({
    url: `/api/visualApproval/getAuditorRoster`,
    params
  })
}

// 任务新增接口
export const createVisualApproval = (data: any) => {
  return request.post({ url: '/api/visualApproval/create', data })
}

//任务编辑接口
export const updateVisualApproval = (data: any) => {
  return request.post({ url: '/api/visualApproval/update', data })
}

// 任务分页查询
export const getVisualApproval = (params) => {
  return request.get({ url: `/api/visualApproval/list`, params })
}
// 任务查询接口
export const getVisualApprovalById = (id) => {
  return request.get({ url: `/api/visualApproval/${id}` })
}

// 操作记录新增
export const createRecord = (data: any) => {
  return request.post({ url: '/api/visualApproval/createRecord', data })
}

// 批量视觉审核
export const batchVisualAudit = (data: any) => {
  return request.post({ url: '/api/visualApproval/batchVisualAudit', data })
}

//更新视觉部门信息
export const updateVisualInfo = (data: any) => {
  return request.post({ url: '/api/visualApproval/updateVisualInfo', data })
}
// 运营审核
export const storeManagerAudit = (data: any) => {
  return request.post({ url: '/api/visualApproval/storeManagerAudit', data })
}

//批量操作
export const batchOperate = (data: any) => {
  return request.post({ url: '/api/visualApproval/batchOperate', data })
}
// 上架周期
export const getListingCycle = () => {
  return request.get({ url: `api/visualApproval/getListingCycle` })
}

//获取子节点未指派需求
export const getUnassignedTasks = (params) => {
  return request.get({ url: `/api/visualApproval/getUnassignedTasks`, params })
}

//获取子节点已指派需求
export const getAssignedTasks = (params) => {
  return request.get({ url: `/api/visualApproval/getAssignedTasks`, params })
}

//检测任务时间合法性
export const checkDateValidity = (data) => {
  return request.postOriginal({ url: `/api/visualApproval/checkDateValidity`, data })
}

// 竞品分析 分页查询
export const opCompetitorCampaign = (params) => {
  return request.get({ url: `/api/opCompetitorCampaign`, params })
}

// 竞品分析 店铺查询
export const storeList = () => {
  return request.get({ url: `/api/opCompetitorCampaign/storeList` })
}

// 竞品分析 更新数据
export const opCompetitorCampaignPost = (data: any) => {
  return request.post({ url: '/api/opCompetitorCampaign', data })
}

// 竞品分析 导出
export const opCompetitorExport = (params) => {
  return request.download({ url: '/api/opCompetitorCampaign/export', params })
}

//新增保存备注
export const saveCalendarRemark = (data: any) => {
  return request.post({ url: '/api/visualApproval/saveCalendarRemark', data })
}
//获取备注
export const getCalendarRemarks = (params) => {
  return request.get({ url: `/api/visualApproval/getCalendarRemarks`, params })
}

// 获取指派人员 /api/visualApproval/getLeaderRoster
export const getLeaderRoster = (params: any) => {
  return request.get({ url: `/api/visualApproval/getLeaderRoster`, params })
}
// 更新备注
export const updateCalendarRemark = (data: any) => {
  return request.post({ url: '/api/visualApproval/updateRemark', data })
}

// 操作记录新增 (最新)
export const createRecordNew = (data: any) => {
  return request.post({ url: '/api/visualApproval/createCalendarRecord', data })
}

// 获取流程节点
export const getProcessNodes = () => {
  return request.get({ url: '/api/visualApproval/getProcessNodes' })
}

// 发送飞书卡片
export const sendCalendarAssignedMessage = (data?: any) => {
  return request.post({ url: '/api/visualApproval/sendCalendarAssignedMessage', data })
}



