/*
 * @Author: zw
 * @Date: 2025-08-06 09:46:04
 * @LastEditTime: 2025-08-19 15:06:44
 * @LastEditors: zw
 * @Description:
 * @FilePath: \platform-front\src\api\visualCenter\headerImagevVideo.ts
 */
import request from '@/config/axios'

// 整体概览-卡片
export const getOverviewCard = (params: any) => {
  return request.get({ url: '/api/vcHeadImageVideo/overview/card', params, showLoading: true })
}

// 整体概览-趋势图
export const getOverviewTrendChart = (params: any) => {
  return request.get({
    url: '/api/vcHeadImageVideo/overview/trendChart',
    params,
    showLoading: true
  })
}

// 单条分析-分页
export const getSinglePage = (params: any) => {
  return request.get({ url: '/api/vcHeadImageVideo/single/page', params })
}

// 单条分析-趋势图
export const getSingleTrendChart = (params: any) => {
  return request.get({ url: '/api/vcHeadImageVideo/single/trendChart', params })
}

// /api/vcHeadImageVideo/getNewestDay
export const getNewestDay = (params: any) => {
  return request.get({ url: '/api/vcHeadImageVideo/getNewestDay', params })
}

// 导出 /api/vcHeadImageVideosingle/export
export const exportSingle = (params: any) => {
  return request.download({ url: '/api/vcHeadImageVideo/single/export', params, showLoading: true })
}

// /api/vcHeadImageVideo/getZtNewestDay
export const getZtNewestDay = (params: any) => {
  return request.get({ url: '/api/vcHeadImageVideo/getZtNewestDay', params })
}
