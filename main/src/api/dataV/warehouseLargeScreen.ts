/*
 * @Date: 2025年3月14日15:38:59
 */
import request from '@/config/axios'

// 获取拣货排行榜

export const pickingRank = async (params: Object) => {
  return await request.get({ url: `/api/warehouse/screen/pickingRank`, params })
}

// 获取验货排行榜

export const inspectionRank = async (params: Object) => {
  return await request.get({ url: `/api/warehouse/screen/inspectionRank`, params })
}

// 获取打包排行榜

export const packingRank = async (params: Object) => {
  return await request.get({ url: `/api/warehouse/screen/packingRank`, params })
}

// 获取补货排行榜

export const replenishmentPersonnelRank = async (params: Object) => {
  return await request.get({ url: `/api/warehouse/screen/replenishmentPersonnelRank`, params })
}

// 获取订单状态大屏数据

export const orderStatus = async (params: Object) => {
  return await request.get({ url: `/api/warehouse/screen/orderStatus`, params })
}

// 获取采购未上架大屏数据

export const purchaseUnList = async (params: Object) => {
  return await request.get({ url: `/api/warehouse/screen/purchaseUnList`, params })
}

// 获取采购在途提醒大屏数据

export const purchaseOnWayReminde = async (params: Object) => {
  return await request.get({ url: `/api/warehouse/screen/purchaseOnWayReminde`, params })
}
