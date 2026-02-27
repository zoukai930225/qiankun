/*
 * @Author: wangxifeng-ZJ3bu
 * @Date: 2025-12-29 13:12:19
 * @LastEditors: wangxifeng-ZJ3bu
 * @LastEditTime: 2025-12-29 18:29:50
 */
/**
 * 环节挤压统计模块类型定义
 */

// 指标类型
export type MetricType =
  | 'incomingOrderCount' // 流入订单数
  | 'incomingProductCount' // 流入货品数量
  | 'pendingReviewOrderCount' // 待审核数量
  | 'pendingBacklogQuantity' // 待补货数量
  | 'pendingPackingQuantity' // 待拣货数量
  | 'pendingInspectionQuantity' // 待验货数量
  | 'pendingPickingQuantity' // 待打包数量
  | 'packedQuantity' // 已打包数量
  | 'unshippedQuantity' // 未发货数量
  | 'shippedQuantity' // 已发货数量

// 视图模式
export type ViewMode = 'table' | 'line' | 'bar'

// 时间类型
export type TimeType = '日期' | '开始时间 - 结束时间'

// 指标数据项
export interface MetricItem {
  key: MetricType | string
  label: string
  value: string | number
  unit: string
  color?: string
  todayCountList?: number[]
  yesterdayCountList?: number[]
}

// 表格行数据
export interface TableRowData {
  step: string
  total: number
  [key: string]: any // 动态时间段字段
}

// 图表数据
export interface ChartData {
  xAxisData: string[]
  seriesData: number[]
  compareData?: number[]
}

// 时效数据项
export interface TimelinessItem {
  timeRange: string // 时间范围
  lt2h: number // <2小时
  gt2h: number // >=2小时
  lt4h: number // <4小时
  gt8h: number // >=8小时
  gt12h: number // >12小时
}

// 筛选条件
export interface FilterParams {
  warehouse?: string
  timeType: TimeType
  date?: string
  dateRange?: [string, string]
}

// API响应数据
export interface StepBacklogResponse {
  code: number
  message: string
  data: any
}
