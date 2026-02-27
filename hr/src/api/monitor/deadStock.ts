import request from '@/config/axios'

/** 日报表格 */
export function getDeadStockReportList(date: string) {
  return request.get({
    // url: `http://127.0.0.1:4523/m1/4344737-3988140-default/api/opUnsalableGoodsDaily/list/1`
    url: `/api/opUnsalableGoodsDaily/list/${date}`
  })
}

/** 日报统计 */
export function getDeadStockReportStastics(date: string) {
  return request.get({
    // url: `http://127.0.0.1:4523/m1/4344737-3988140-default/api/opUnsalableGoodsDaily/statistics/1`
    url: `/api/opUnsalableGoodsDaily/statistics/${date}`
  })
}

/** 图表数据 */
export function getChartData(date: string) {
  return request.get<{
    histogramData: Monitor.DeadStock.ChartsDataItem[]
    totalCargoValue: string
    yesterdayCargoValue: string
    yesterdaySales: string
    inventory: string
  }>({
    // url: `http://127.0.0.1:4523/m1/4344737-3988140-default/api/opUnsalableGoodsDaily/statisticsHistogram/1`
    url: `/api/opUnsalableGoodsDaily/statisticsHistogram/${date}`
  })
}

/** 发送飞书 */
export function sendFeishu(data: FormData, params: { dataDate: string }) {
  return request.formPostOriginal({
    url: '/api/opUnsalableGoodsDaily/sendFeiShu',
    data,
    params
  })
}

/** */
export function statisticsTimeInterval(params: { dataDateStart: string; dataDateEnd: string }) {
  return request.get({
    url: '/api/opUnsalableGoodsDaily/statisticsTimeInterval',
    params
  })
}

/**销量货值分析 */
export function opUnsalableGoodsDaily(params: { dataDateStart: string; dataDateEnd: string }) {
  return request.get({
    url: '/api/opUnsalableGoodsDaily/analyseSale',
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/opUnsalableGoodsDaily/analyseSale',
    params
  })
}

/** 库存top10 */
export function opUnsalableGoodsDailyTop10Api(params: { dataDate: string }) {
  return request.get({
    url: '/api/opUnsalableGoodsDaily/top10',
    params
  })
}
