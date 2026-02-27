import request from '@/config/axios'

const API_PREFIX = '/api/spotCheckConfiguration'

// 列表分页
export const getRandomInspectionPlanPage = (data: any) => {
  return request.post({ url: `${API_PREFIX}/page`, data })
}

// 下拉选项
export const getRandomInspectionPlanOptions = (params: any = {}) => {
  return request.get({ url: `${API_PREFIX}/list`, params })
}

// 删除
export const deleteRandomInspectionPlan = (params: any) => {
  return request.delete({ url: `${API_PREFIX}/deleteById`, params, showLoading: true })
}

// 详情
export const getRandomInspectionPlanDetail = (id: string | number) => {
  return request.get({ url: `${API_PREFIX}/${id}` })
}

// 新增
export const createRandomInspectionPlan = (data: any) => {
  return request.post({ url: `${API_PREFIX}/add`, data, showLoading: true })
}

// 编辑
export const updateRandomInspectionPlan = (data: any) => {
  return request.post({ url: `${API_PREFIX}/edit`, data, showLoading: true })
}

// QC质检报告单条查询（前中尾期）
export const getQualityInspectionReportInfo = (id: string) => {
  return request.get({ url: `/api/qcQualityInspectionReportInfo/${id}` })
}

/** 获取选品详情（用于回显） */
export function getBpSelectionInfo(candidateProductId: string) {
  console.log(candidateProductId)

  return request.get({
    url: `/api/bpSelectionProductInfo/detail/${candidateProductId}`
    // url: `http://127.0.0.1:4523/m1/4344737-3988140-default/api/bpSelectionProductInfo/detail/1`
  })
}

/** 保存选品信息 */
export function saveBpSelection(data) {
  return request.postOriginal({
    url: '/api/bpSelectionProductInfo/saveSelection',
    data
  })
}

/** 获取确认结果选项（根据审核情况判断是否隐藏"直接下单"） */
export function confirmResultOptions(candidateProductId: string) {
  return request.get({
    // url: `http://127.0.0.1:4523/m1/4344737-3988140-default/api/bpCandidateProduct/confirmResultOptions/1`
    url: `/api/bpCandidateProduct/confirmResultOptions/${candidateProductId}`
  })
}

/** 获取企划确认详情 */
export function planningConfirmDetail(candidateProductId: string) {
  return request.get({
    url: `/api/bpCandidateProduct/planningConfirmDetail/${candidateProductId}`
  })
}

/** 保存企划确认信息 */
export function savePlanningConfirm(data: any) {
  return request.postOriginal({
    url: '/api/bpCandidateProduct/savePlanningConfirm',
    data
  })
}
