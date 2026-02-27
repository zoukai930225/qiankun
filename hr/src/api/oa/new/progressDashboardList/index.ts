/*
 * @Date: 2025-08-18 14:15:43
 */

import request from '@/config/axios'

// 进度列表
export const queryProgressList = (data) => {
  return request.post({ url: '/api/np/plan/queryProgressList', data })
}

// 建档资料
// /api/np/plan/queryArchivalMaterials
export const queryArchivalMaterials = (data: any) => {
  return request.post({ url: '/api/np/plan/queryArchivalMaterials', data })
}

// /api/np/developmentPlan/getCompetitiveList
export const getCompetitiveList = (params: any) => {
  return request.get({ url: '/api/np/developmentPlan/getCompetitiveList', params })
}
