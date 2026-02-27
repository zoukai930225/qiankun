import request from '@/config/axios'

// 获取销售订单分析列表
export const getSalesOrderAnalysisList = (params) => {
  return request.get({ url: `/api/whSalesOutboundOrderAnalyse/page`, params })
}

// 导出
export const exportSalesOrderAnalysis = (params) => {
  return request.download({ url: `/api/whSalesOutboundOrderAnalyse/export`, params })
}
