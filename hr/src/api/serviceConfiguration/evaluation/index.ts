import request from '@/config/axios'

// 获取评价分类数据列表
export const getEvaluationList = (params) => {
  return request.get({ url: `/api/reviews/list`, params })
}

// 新增数据
export const addEvaluation = (data) => {
  return request.post({ url: `/api/reviews/add`, data })
}

// 修改数据
export const updateEvaluation = (data) => {
  return request.post({ url: `/api/reviews/update`, data })
}

// 删除数据
export const deleteEvaluation = (data) => {
  return request.post({ url: `/api/reviews/deleteByIds`, data })
}
