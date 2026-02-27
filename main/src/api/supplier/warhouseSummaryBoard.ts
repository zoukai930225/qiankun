import request from '@/config/axios'

interface GetRes<T = any> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
  extras?: any
}

/** 获取出入口动态汇总看板 */
export function getWarehouseSummaryBoardSummaryApi(params: { startDate: string; endDate: string }) {
  return request.get({
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/warehouseSummaryBoard/summary',
    url: '/api/warehouseSummaryBoard/summary',
    params
  })
}

/** 获取销售出库货品统计分页 */
export function salesOutboundGoodsApi(data: any) {
  return request.post<GetRes>({
    url: '/api/warehouseSummaryBoard/salesOutboundGoods',
    data
  })
}

/** 获取采购退货出库货品统计分页 */
export function purchaseReturnGoodApi(data: any) {
  return request.post<GetRes>({
    url: '/api/warehouseSummaryBoard/purchaseReturnGood',
    data
  })
}

/** 获取采购入库货品统计分页 */
export function purchaseInboundGoodsApi(data: any) {
  return request.post<GetRes>({
    url: '/api/warehouseSummaryBoard/purchaseInboundGoods',
    data
  })
}

/** 总仓、云仓库存占比 */
export function stockProportionApi(params: any) {
  return request.get({
    url: '/api/warehouseSummaryBoard/stockProportion',
    params
  })
}

/** 总仓品类占比 */
export function categoryProportionApi(params: any) {
  return request.get({
    url: '/api/warehouseSummaryBoard/categoryProportion',
    params
  })
}
/** 云仓品类占比 */
export function cloudCategoryProportionApi(params: any) {
  return request.get({
    url: '/api/warehouseSummaryBoard/cloudCategoryProportion',
    params
  })
}
