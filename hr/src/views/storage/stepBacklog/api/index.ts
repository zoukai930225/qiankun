/**
 * 环节挤压统计模块API
 */
import request from '@/config/axios'
import type { FilterParams, StepBacklogResponse } from '../types'

/**
 * 获取综合指标数据
 */
export const getMetricsData = (params: FilterParams) => {
  return request.post<StepBacklogResponse>({
    url: '/api/stepBacklog/metrics',
    data: params
  })
}

/**
 * 获取环节积压列表数据
 */
export const getBacklogListData = (params: FilterParams & { metric: string }) => {
  return request.post<StepBacklogResponse>({
    url: '/api/stepBacklog/list',
    data: params
  })
}

/**
 * 获取时效统计数据
 */
export const getTimelinessData = (params: FilterParams) => {
  return request.post<StepBacklogResponse>({
    url: '/api/stepBacklog/timeliness',
    data: params
  })
}

/**
 * 导出数据
 */
export const exportData = (params: any) => {
  return request.post({
    url: '/api/stepBacklog/export',
    data: params,
    responseType: 'blob'
  })
}

