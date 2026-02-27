/*
 * @Date: 2024-11-11 17:13:43
 */
import request from '@/config/axios'

// 被评价人列表

export const getAppraiseeList = (params) => {
  return request.get({ url: '/api/otr/evaluation/record/appraiseeList', params })
}

// 评价人列表

export const getEvaluatorList = (params) => {
  return request.get({ url: '/api/otr/evaluation/record/evaluatorList', params })
}

// 新增评价关系
export const addEvaluationData = (data) => {
  return request.post({ url: '/api/otr/evaluation/record/save', data })
}

// 编辑评价关系
export const updateEvaluationData = (data) => {
  return request.post({ url: '/api/otr/evaluation/record/update', data })
}
// 删除
export const deleteData = (appraiseeId, evaluatorId, questionnaireId) => {
  return request.get({
    url: `/api/otr/evaluation/record/delete?appraiseeId=${appraiseeId}&evaluatorId=${evaluatorId}&questionnaireId=${questionnaireId}`
  })
}
// 根据id查询
export const getDataById = (id, questionnaireId) => {
  return request.get({
    url: `/api/otr/evaluation/record/getById?id=${id}&questionnaireId=${questionnaireId}`
  })
}

// 根据用户ID自动生成 上级-同级-下级数据
export const personRosterAutoCreateReleation = (id) => {
  return request.get({
    url: `/api/personRoster/autoCreate/${id}`
  })
}

// 获取问卷列表
export const getSurveyList = (id) => {
  return request.get({ url: `/api/otr/survey/get/${id}` })
}

// 根据问卷id查询评价关系
export const getBySurveyId = (id) => {
  return request.get({ url: `/api/otr/evaluation/record/getBySurveyId?surveyId=${id}` })
}

// 查询活动状态
export const getActStatusById = (id) => {
  return request.get({ url: `/api/otr/survey/actStatus/${id}` })
}

// 盘点校准前的校验
export const calibrationHeadList = (id) => {
  return request.get({ url: `/api/otr/calibration/headList?inventoryId=${id}` })
}
