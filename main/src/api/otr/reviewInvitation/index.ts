/*
 * @Date: 2024-10-23 10:29:45
 */
import request from '@/config/axios'

// 分页查询
export const getInvitationList = (params) => {
  return request.get({ url: '/api/otr/evaluation/invitation/list', params })
}
//评价邀请详情列表
export const getQuerySurveyList = (params) => {
  return request.get({ url: '/api/otr/evaluation/invitation/querySurveyList', params })
}

//评价邀请详情列表
export const getQuerySurveyByAppraiseeList = (params) => {
  return request.get({ url: '/api/otr/evaluation/invitation/querySurveyListByAppraisee', params })
}

//一键邀请
export const invitationInviteAll = (id) => {
  return request.get({ url: `/api/otr/evaluation/invitation/inviteAll/${id}` })
}

//发送邀请
export const invitationInvite = (id, userId) => {
  return request.get({ url: `/api/otr/evaluation/invitation/invite/${id}/${userId}` })
}

// 关闭问卷
export const closeSurvey = (data) => {
  return request.post({ url: `/api/otr/calibration/close`, data })
}

// 根据活动id查询问卷锁定状态
export const checkLockState = (inventoryId) => {
  return request.get({ url: `/api/otr/evaluation/invitation/checkLockState/${inventoryId}` })
}
