import request from '@/config/axios'

// 获取评价分类数据列表
export const getEvaluationList = (params) => {
  return request.get({ url: `/api/reviews/list`, params })
}

// 编辑分类
export const updateEvaluationBoard = (data) => {
  return request.post({ url: `/api/evaluationBoard/update`, data })
}

// 中差评数据回显
export const getNegativeReviewData = (params) => {
  return request.get({ url: `/api/evaluationBoard/getById`, params })
}

// 中差评数量情况
export const getNegativeReviewCount = (params) => {
  return request.get({ url: `/api/evaluationBoard/numberInfo`, params })
}

// 中差评原因一级分类
export const getNegativeReviewReasonFirst = (params) => {
  return request.get({ url: `/api/evaluationBoard/primaryClassificationInfo`, params })
}

// 中差评原因二级分类
export const getNegativeReviewReasonSecond = (params) => {
  return request.get({ url: `/api/evaluationBoard/secondaryClassificationInfo`, params })
}

// 中差评店铺列表
export const getNegativeReviewShopList = () => {
  return request.get({ url: `/api/evaluationBoard/storeList` })
}

// 分页查询中差评数据列表
export const getNegativeReviewList = (params) => {
  return request.get({ url: `/api/evaluationBoard/pageList`, params })
}

// 导出中差评数据列表
export const exportNegativeReviewList = (params) => {
  return request.download({ url: `/api/evaluationBoard/listExport`, params })
}
// 中差评数量情况导出
export const exportNegativeReviewCount = (params) => {
  return request.download({ url: `/api/evaluationBoard/numberInfoExport`, params })
}

// 中差评原因一级分类导出
export const exportNegativeReviewReasonFirst = (params) => {
  return request.download({ url: `/api/evaluationBoard/primaryClassificationInfoExport`, params })
}

// 中差评原因二级分类导出
export const exportNegativeReviewReasonSecond = (params) => {
  return request.download({ url: `/api/evaluationBoard/secondaryClassificationInfoExport`, params })
}

// 查询对比时间
export const getComparisonTime = (params) => {
  return request.get({ url: `/api/evaluationBoard/queryBeforeDate`, params })
}
