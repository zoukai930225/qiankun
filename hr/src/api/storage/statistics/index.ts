import request from '@/config/axios'

interface GetRes<T = any> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
}

/**
 * 获取发货日报列表
 */
export function getDeliveryReportList(
  params: StorageStatisticsType.GetDeliveryReportListParams
): Promise<GetRes<StorageStatisticsType.DeliveryReportItem>> {
  return request.get({ url: '/api/whShipmentDaily/list', params })
}

/**
 * 导出发货数据
 */
export function exportDeliveryReport(data: { id: string }) {
  return request.downloadPost({ url: '/api/whShipmentDaily/export', data })
}

/**
 * 通过id查询表单信息
 */
export function getDeliveryReportDetail(
  id: string
): Promise<StorageStatisticsType.DeliveryReportItem> {
  return request.get({ url: `/api/whShipmentDaily/get/${id}` })
}

/**
 * 更新数据
 */
export function updateDeliveryReport(data: Partial<StorageStatisticsType.DeliveryReportItem>) {
  return request.postOriginal({ url: '/api/whShipmentDaily/update', data })
}
