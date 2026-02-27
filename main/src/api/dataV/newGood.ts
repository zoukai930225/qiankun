/*
 * @Date: 2025-08-20 08:46:38
 */
import request from '@/config/axios'

// 新品进度看板

export const bigScreenNewGoodProgressBoard = (params) => {
  return request.get({ url: `/api/np/plan/queryProgressBoardData`, params })
}
// 新品包装进度看板
export const bigScreenNewPackageProgressBoard = (params) => {
  return request.get({ url: `/workflow-api/api/workflow/business/pack/productPlan/queryProgressBoardData`, params })
}

// 工厂二开 进度看板
export const bigScreenFactorySecondaryProgressBoard = (params) => {
  return request.get({ url: `/workflow-api/api/workflow/business/factorySecondary/supplierFlow/queryProgressBoardData`, params })
}
