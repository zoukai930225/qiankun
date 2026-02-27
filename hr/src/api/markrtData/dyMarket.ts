/*
 * @Author: zw
 * @Date: 2025-08-18 14:24:12
 * @LastEditTime: 2025-08-18 16:38:56
 * @LastEditors: zw
 * @Description:
 * @FilePath: \platform-front\src\api\markrtData\dyMarket.ts
 */
import request from '@/config/axios'

export const getDyMarketList = (data: any) => {
  return request.formPost({ url: '/api/dyGoodsMarketRank/list', data })
}

// /api/dyGoodsMarketRank/getNewestDay
export const getNewestDay = () => {
  return request.get({ url: '/api/dyGoodsMarketRank/getNewestDay' })
}

export const getAllCategory = () => {
  return request.get({ url: '/api/dyGoodsMarketRank/getAllCategory' })
}
