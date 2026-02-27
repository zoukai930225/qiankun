/*
 * @Date: 2024-06-11 09:37:31
 */
import request from '@/config/axios'

// 库存告急页面分页查询
export const getGoodsInventoryAlarmList = (params: any) => {
  return request.get({ url: '/api/GoodsInventoryAlarm/pageList', params })
}

// 删除
export const deletedGoodsInventoryAlarm = (data: any) => {
  return request.post({ url: '/api/GoodsInventoryAlarm/deleted', data })
}
//新增
export const saveGoodsInventoryAlarm = (data: any) => {
  return request.post({ url: '/api/GoodsInventoryAlarm/save', data })
}

//更新
export const updateGoodsInventoryAlarm = (data: any) => {
  return request.post({ url: '/api/GoodsInventoryAlarm/update', data })
}

// 根据id回显
export const getDetailById = (id) => {
  const params = {
    id
  }
  return request.get({ url: '/api/GoodsInventoryAlarm/getById', params })
}

//30天数据统计图
export const getThirtySumData = (params: any) => {
  return request.get({ url: '/api/GoodsInventoryAlarm/getThirtySumData', params })
}

// 获取品类编码（商品）
export const getCategoryNameList = (params?) => {
  return request.get({ url: '/api/h5/getCategoryNameList', params })
}
// 供应商
export const getSupplier = () => {
  return request.get({ url: '/api/GoodsInventoryAlarm/getSupplier' })
}

// sku明细查询
export const getSkuPageList = (params: {
  isSafe?: string
  goodsCode?: string
  page?: number
  pgeSize?: number
  supplier?: string
  productNumber?: number | string
}) => {
  return request.get({ url: '/api/GoodsInventoryAlarm/SKU/pageList', params })
}
export const getById = () => {
  return request.get({ url: '/api/GoodsInventoryAlarm/getById' })
}
// sku更新
export const updateSku = (data: any) => {
  return request.post({ url: '/api/GoodsInventoryAlarm/SKU/update', data })
}
export const saveSku = (data: any) => {
  return request.post({ url: '/api/GoodsInventoryAlarm/SKU/save', data })
}
// sku39天销量趋势图
export const getSkuThirtyData = (params: any) => {
  return request.get({ url: '/api/GoodsInventoryAlarm/SKU/getThirtyData', params })
}
