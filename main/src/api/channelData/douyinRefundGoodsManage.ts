import request from '@/config/axios'

const prefix = '/api/douyinRefundGoodsManage'

// 商品列表
export const getGoodsList = (params) => {
  return request.get({ url: `${prefix}/list`, params })
}

// 商品编辑
export const updateGoods = (data) => {
  return request.post({ url: `${prefix}/update`, data })
}

// 商品新增
export const saveGoods = (data) => {
  return request.post({ url: `${prefix}/save`, data })
}

//商品删除
export const deleteGoodsById = (id) => {
  return request.get({ url: `${prefix}/delete/${id}` })
}

//商品统计-主列表
export const queryGoodsStaticList = (params) => {
  return request.get({ url: `/api/dwsDyLpGoodsRefundStat/list`, params })
}
//
export const getGoodsStaticList = (params) => {
  return request.get({ url: `/api/dwsDyLpGoodsRefundStat/list`, params })
}
//获取最新日期
export const getLastDate = () => {
  return request.get({ url: `/api/dwsDyLpGoodsRefundStat/getLastDate` })
}

// 编辑新增中获取商品列表
export const searchGoodsList = (params) => {
  return request.get({ url: `${prefix}/goodsList`, params })
}
