import request from '@/config/axios'

// http://192.168.88.113:7081/api/csProblemFeedback/getSummaryByDateRange 客诉汇总看板
export const getCustomerComplaintSummaryDashboard = (data: any) => {
  return request.post({ url: '/api/csProblemFeedback/getSummaryByDateRange', data })
}
