import request from '@/config/axios'

interface pageByWarehouse {
  dateStart: string
  dateEnd: string
  page: number
  size: number
}
// 分页查询-仓库维度
export const getWarehouseShippingDailyReport = (params: pageByWarehouse) => {
  return request.get({
    url: `/api/warehouseDeliveryDaily/pageByWarehouse`,
    params
  })
}

interface pageByProductCode {
  date: string
  warehouse: string //仓库
  page: number
  size: number
}

// 分页查询-货品编码维度
export const getProductCodeShippingDailyReport = (params: pageByProductCode) => {
  return request.get({
    url: `/api/warehouseDeliveryDaily/pageByProductCode`,
    params
  })
}

interface pageByMerchantCode {
  date: string // 日期
  warehouse: string // 仓库
  productCode: string // 货品编码
  page: number
  size: number
}

// 分页查询-商家编码维度
export const getMerchantCodeShippingDailyReport = (params: pageByMerchantCode) => {
  return request.get({
    url: `/api/warehouseDeliveryDaily/pageByMerchantCode`,
    params
  })
}

// 导出
export const warehouseDeliveryDailyExport = (params) => {
  return request.download({
    url: '/api/warehouseDeliveryDaily/export',
    params
  })
}
