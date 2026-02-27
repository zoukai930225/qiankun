// headerImageVideo 模块通用类型定义

// 选择器选项接口
export interface SelectOption {
  label: string
  prop: string
}

// 搜索参数接口
export interface SearchParams {
  storeCode: string
  content: string
  beginDate: string
  endDate: string
  dateType: number
  beginContentPublishTime?: string
  endContentPublishTime?: string
}

// 视频行数据接口
export interface VideoRow {
  contentTitle: string
  contentId: string
  [key: string]: any
}

// 趋势数据项接口
export interface TrendDataItem {
  datadate: string
  [key: string]: any
}

// 图表数据项接口
export interface ChartDataItem {
  date: string
  views: number
  ratio: number
}
