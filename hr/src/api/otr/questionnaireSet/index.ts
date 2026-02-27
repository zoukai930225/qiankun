/*
 * @Date: 2024-10-23 13:57:09
 */
import request from '@/config/axios'

// 获取列表活动
export const getotrAactInventory = () => {
  return request.get({ url: '/api/otr/act/otr-act-inventory/getList' })
}
// 问卷分页
export const getSurveyList = (params) => {
  return request.get({ url: '/api/otr/survey/list', params })
}

//更新问卷锁定与暂停状态
export const updateLockAndStop = (data) => {
  return request.post({ url: '/api/otr/survey/updateLockAndStop', data })
}

//编辑问卷
export const surveySave = (data) => {
  return request.post({ url: '/api/otr/survey/save', data })
}

//快速选择
export const surveyQuickly = (params) => {
  return request.get({ url: `/api/otr/survey/quickly`, params })
}

// 恢复默认
export const resetRestore = (id) => {
  return request.get({ url: `/api/otr/survey/restore/${id}` })
}

// 根据code查询问卷结果
export const queryByCode = (params) => {
  return request.get({ url: `/api/otr/evaluation/invitation/queryByCode`, params })
}
//新增修改问卷结果明细
export const saveInvitation = (data) => {
  return request.post({ url: '/api/otr/evaluation/invitation/save', data })
}

//根据code查询问卷明细
export const getByCode = (params) => {
  return request.get({ url: `/api/otr/evaluation/invitation/getByCode`, params })
}
//获取问卷详情
export const getSurveyById = (id) => {
  return request.get({ url: `/api/otr/survey/${id}` })
}
