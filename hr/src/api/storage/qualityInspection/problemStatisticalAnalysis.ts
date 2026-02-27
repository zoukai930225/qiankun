import request from '@/config/axios'

export interface ProblemStatisticalAnalysisQuery {
  /** 检验时间开始时间 */
  inspectionTimeBegin?: string
  /** 检验时间结束时间 */
  inspectionTimeEnd?: string
}

// api/whIncomingInspectionInfo/statistics/defect/allData 仓储来料检验获取疵点所有数据统计 post
export const getProblemStatisticalAnalysis = (data: ProblemStatisticalAnalysisQuery) => {
  return request.post({
    url: '/api/whIncomingInspectionInfo/statistics/defect/allData',
    data
  })
}

// /api/whIncomingInspectionInfo/statistics/defect/export 仓储来料检验获取疵点统计导出 post
export const exportProblemStatisticalAnalysis = (data: ProblemStatisticalAnalysisQuery) => {
  return request.downloadPost({
    url: '/api/whIncomingInspectionInfo/statistics/defect/export',
    data
  })
}

// /api/whIncomingInspectionInfo/statistics/defect/top10 仓储来料检验获取疵点TOP10统计 post
export const getProblemStatisticalAnalysisTop10 = (data: ProblemStatisticalAnalysisQuery) => {
  return request.post({
    url: '/api/whIncomingInspectionInfo/statistics/defect/top10',
    data
  })
}
