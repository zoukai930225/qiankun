import request from '@/config/axios'

export interface QualityInspectionStatisticsParams {
  type?: number
  dataDateStart?: string
  dataDateEnd?: string
}

export interface RiskStatisticServerItem {
  problemRiskLevel?: string | number
  levelCount?: number | string
  percentage?: number | string
  color?: string
}

export interface CustomerProblemStatisticItem {
  customerName?: string
  problemCount?: number | string
}

export interface QualityInspectionStatisticsRes {
  totalCount?: number | string
  completedCount?: number | string
  uncompletedCount?: number | string
  totalCountReal?: number | string
  completedCountReal?: number | string
  uncompletedCountReal?: number | string
  mapProblemRiskLevelList?: RiskStatisticServerItem[]
  mapProblemRiskLevelRealList?: RiskStatisticServerItem[]
  mapCustomerNameList?: CustomerProblemStatisticItem[]
  mapCustomerNameRealList?: CustomerProblemStatisticItem[]
  [key: string]: unknown
}

export const getQualityInspectionStatistics = (params: QualityInspectionStatisticsParams) => {
  return request.get({
    url: '/api/csQualityInspection/statisticsData',
    params
  })
}
