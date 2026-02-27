import request from '@/config/axios'

interface GetRes<T = any> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
}

/**
 * 获取总览信息
 */
export function getReportList(
  params: StorageType.GetReportListQuery
): Promise<GetRes<StorageType.ReportListItem>> {
  return request.get({ url: '/api/whnewspaperreport/list', params })
}

/**
 * 根据每日日报id查看明细
 */
export function getDailyReport(
  params: StorageType.GetDailyReportDetailParams
): Promise<StorageType.DailyReportDetail> {
  return request.get({ url: '/api/whnewspaperreport/querydetail', params })
}

/**
 * 新增修改根据每日日报id查看明细
 * @returns
 */
export function getDailyReportForAddOrEdit(
  params: StorageType.GetDailyReportDetailParams
): Promise<StorageType.DailyReportDetail> {
  return request.get({ url: '/api/whnewspaperreport/loadData', params })
}

/**
 * 通过日期获取明细列表
 * @returns
 */
export function getDailyReportList(
  params: StorageType.GetDailyDetailListParams
): Promise<StorageType.DailyReportDetail> {
  return request.get({ url: '/api/whnewspaperreportdetail/querydetailByFilter', params })
}

/**
 * 发送日期获取当日日报id
 */
export function getReportIdByDate(data: StorageType.AddReportParams): Promise<{ id: string }> {
  return request.post({ url: '/api/whnewspaperreport/saveandupdate', data })
}

/**
 * 主页面删除日报
 */
export function delReportItem(id: string): Promise<{
  success?: boolean
  error?: boolean
  message: string
}> {
  return request.getOriginal({ url: `/api/whnewspaperreport/delete/${id}` })
}

/**
 * 新增日报明细
 */
export function getReportDetail(
  data: StorageType.AddReportDetailParams
): Promise<StorageType.ReportDetail> {
  return request.post({
    url: '/api/whnewspaperreportdetail/saveandupdate',
    data
  })
}

/**
 * 删除明细
 */
export function delReportDetail(id: string) {
  return request.getOriginal({ url: `/api/whnewspaperreportdetail/delete/${id}` })
}

/**
 * 根据类型ID查询筛选人列表
 */
export function getPersonList(params: StorageType.GetPersonListParams) {
  return request.get({ url: '/api/whnewspaperreportdetail/filterlist', params })
}

/**
 * 导出数据
 */
export function exportFile(params: { beginDate: string; endDate: string }) {
  return request.download({ url: '/api/whnewspaperreportdetail/export', params })
}
