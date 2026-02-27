import request from '@/config/axios'

interface GetRes<T = any> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
  extras?: any
}

/**获取供应商订单数据总览 */
export function getSupplierProductDataBoardApi() {
  return request.get({
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/sc/supplierProductDataBoard/getSupplierProductDataBoard'
    url: '/api/sc/supplierProductDataBoard/getSupplierProductDataBoard'
  })
}

/** 获取货品top10统计面板数据 */
export function getProductTop10Api(params: { type: string }) {
  return request.get({
    url: '/api/sc/supplierProductDataBoard/getProductTop10',
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/sc/supplierProductDataBoard/getProductTop10',
    params
  })
}

/** 获取生产过的货品数top10明细 */
export function producedProductTop10DetailApi(data: {
  goodsNos: string[]
  pageNum: number
  pageSize: number
}) {
  return request.post<GetRes>({
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/sc/supplierProductDataBoard/producedProduct/Top10/detail',
    url: '/api/sc/supplierProductDataBoard/producedProduct/Top10/detail',
    data
  })
}

/** 获取月销量top10明细 */
export function monthSalesTop10DetailApi(data: {
  goodsNos: string[]
  pageNum: number
  pageSize: number
}) {
  return request.post<GetRes>({
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/sc/supplierProductDataBoard/monthSales/Top10/detail',
    url: '/api/sc/supplierProductDataBoard/monthSales/Top10/detail',
    data
  })
}

/** 获取货品搜索top10明细 */
export function goodsSearchTop10DetailApi(data: {
  goodsNos: string[]
  pageNum: number
  pageSize: number
}) {
  return request.post<GetRes>({
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/sc/supplierProductDataBoard/goodsSearch/Top10/detail',
    url: '/api/sc/supplierProductDataBoard/goodsSearch/Top10/detail',
    data
  })
}

/** 获取货品新上架top10明细 */
export function goodsNewTop10DetailApi(data: {
  goodsNos: string[]
  pageNum: number
  pageSize: number
}) {
  return request.post<GetRes>({
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/sc/supplierProductDataBoard/goodsNew/Top10/detail',
    url: '/api/sc/supplierProductDataBoard/goodsNew/Top10/detail',
    data
  })
}

/** 获取货品销售趋势 */
export function getGoodsSalesTrendApi(data: {
  startTime?: string
  endTime?: string
  goodsNos: string[]
}) {
  return request.post({
    url: '/api/sc/supplierProductDataBoard/goodsSalesTrend',
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/sc/supplierProductDataBoard/goodsSalesTrend',
    data
  })
}

/** 获取日发货量趋势 */
export function getDeliverNumTrendApi(data: { startTime?: string; endTime?: string }) {
  return request.post<any[]>({
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/sc/supplierProductDataBoard/deliverNumTrend',
    url: '/api/sc/supplierProductDataBoard/deliverNumTrend',
    data
  })
}

/** 获取top10货品 */
export function getTop10GoodsApi() {
  return request.get({
    url: '/api/sc/supplierProductDataBoard/getTop10Goods',
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/sc/supplierProductDataBoard/getTop10Goods'
  })
}

/** 获取发货数量趋势明细 */
export function getDeliverNumTrendDetailApi(data: {
  startTime: string
  endTime: string
  pageNum: number
  pageSize: number
}) {
  return request.post({
    url: '/api/sc/supplierProductDataBoard/deliverNumTrend/detail',
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/sc/supplierProductDataBoard/deliverNumTrend/detail',
    data
  })
}
