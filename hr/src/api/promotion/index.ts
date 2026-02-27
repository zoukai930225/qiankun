/*
 * @Date: 2024-07-24 14:01:39
 */
import request from '@/config/axios'

export type PromotionMateriaVO = {
  materialId: string //商品ID
  materialName: string //商品名称
  targetedAudienceCharge: string //精准人群推广花费
  keyWordCharge: string // 关键词推广花费
  allWebCharge: string //全站推广花费
  smartScenesCharge: string // 智能场景推广花费
  totalRoi: string // 总Roi
  allCharge: string ///总推广费用
  isExpand: boolean //是否展开
}

// 获取指定业务下的所有字段
export const getAllField = (params) => {
  return request.get({ url: '/api/third/business/field/allField', params })
}

// 恢复默认字段
export const revertDefault = () => {
  return request.get({ url: '/api/third/business/field/revertDefault' })
}

// 保存配置
export const saveCheck = (data) => {
  return request.upload({ url: '/api/third/business/field/saveCheck', data: data })
}

// 计划数据列表接口
export const getPlanList = (data) => {
  return request.post({ url: '/api/promotion/planList', data })
}
// 计划详情
export const getPlanDetailsData = (params) => {
  return request.get({ url: '/api/promotion/planDetailsData', params })
}
//计划列表数据(14天)
export const getPlanListFourteen = (params) => {
  return request.get({ url: '/api/promotion/planListFourteen', params })
}
//人群分析
export const promotionRenQun = (params) => {
  return request.get({ url: '/api/promotion/renQun', params })
}

//创意分析
export const queryCreativeList = (params) => {
  return request.get({ url: '/api/promotion/queryCreativeList', params })
}

//关键词分析列表
export const keywordAnalysisList = (params) => {
  return request.get({ url: '/api/promotion/keywordAnalysisList', params })
}

// 查询宝贝列表

export const queryMaterialList = (params) => {
  return request.get({ url: '/api/promotion/queryMaterialList', params })
}
