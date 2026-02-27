import request from '@/config/axios'

// 供应商考核-考核问卷查询
export const getQuiz = (quizId: any, params?: { showMyItem: boolean }) =>
  request.get({ url: `/api/supplierAssessment/getQuiz/${quizId}`, params })

// 供应商考核-供应商考核问卷保存
export const saveQuiz = (data: any) =>
  request.post({
    url: `/api/supplierAssessment/saveQuiz`,
    data
  })

export function getQuizListApi(params) {
  return request.get({
    url: '/api/supplierAssessment/querySupplierAssessmentList',
    params
  })
}
