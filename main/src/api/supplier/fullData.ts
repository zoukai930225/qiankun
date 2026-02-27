import request from '@/config/axios'

interface GetRes<T = any> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
  extras?: any
}

/** 分页查询全盘数据 */
export function orderStatisticsPageFullDataApi(data: Supplier.FullData.Request, control: any) {
  return request.post<GetRes<Supplier.FullData.FullDataVO>>({
    url: '/api/sc/orderStatistics/pageFullData',
    data,
    signal: control
  })
}

/** 导出全盘数据 */
export function orderStatisticsFullDataExportApi(data: Supplier.FullData.Request) {
  return request.downloadPost({
    url: '/api/sc/orderStatistics/fullData/export',
    data
  })
}

/** 获取最近一次同步时间 */
export function fullDataGetSyncTimeApi() {
  return request.get<string>({
    url: '/api/sc/orderStatistics/fullData/getSyncTime'
  })
}

/** 按钮触发全盘数据同步 */
export function fullDataSyncApi() {
  return request.getOriginal({
    url: '/api/sc/orderStatistics/fullData/sync'
  })
}
