import request from '@/config/axios'

const API_PREFIX = '/api/bpBusinessEnterprisePlan'

/**
 * 分页查询企划管理列表
 */
export const getBuyerPlanPage = (data: any) => request.post({ url: `${API_PREFIX}/list`, data })

export const addBuyerPlan = (data: any) =>
  request.post({ url: `${API_PREFIX}/add`, data, showLoading: true })

export const updateBuyerPlan = (data: any) =>
  request.post({ url: `${API_PREFIX}/update`, data, showLoading: true })

export const deleteBuyerPlan = (id: string | number) =>
  request.get({ url: `${API_PREFIX}/delete/${id}`, showLoading: true })

export const getBuyerPlanDetail = (id: string | number) =>
  request.get({ url: `${API_PREFIX}/detail/${id}` })
