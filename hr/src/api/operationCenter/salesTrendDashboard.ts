import request from '@/config/axios'

// /api/data/productTrend/getLastDate
export const getLastDate = () => {
  return request.get({
    url: '/api/data/productTrend/getLastDate'
  })
}

// /api/data/productTrend/getProductPageList
export const getProductPageList = (params: any) => {
  return request.get({
    url: '/api/data/productTrend/getProductPageList',
    params
  })
}

// getInfoBy
export const getInfoBy = (params: any) => {
  return request.get({
    url: '/api/data/productTrend/getInfoBy',
    params
  })
}
