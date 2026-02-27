/*
 * @Date: 2024-06-11 09:37:31
 */
import request from '@/config/axios'

// 商品列表查询
export const getSkuGoodsList = (params: any) => {
  const data = {
    ...params
  }
  return request.get({ url: '/api/skuGoods/list', params: data })
}
// 删除商品
export const deleteSkuGoodsById = (id: string) => {
  return request.get({ url: `/api/skuGoods/delete/${id}` })
}

// 新增商品
export const createSkuGoods = (data: any) => {
  return request.post({ url: '/api/skuGoods/create', data })
}
// 编辑商品
export const updateSkuGoods = (data: any) => {
  return request.post({ url: '/api/skuGoods/update', data })
}

// 库存信息列表
export const getSkuGoodsInventoryList = (params: any) => {
  return request.get({ url: `/api/skuGoods/inventory/list`, params })
}

// 商品信息导出
export const skuGoodsInventoryExport = (params: any) => {
  return request.download({ url: `/api/skuGoods/inventory/export`, params })
}

// 点击率折线图
export const goodsClickRateLineChart = (params: any) => {
  return request.get({ url: `/api/clickRateLineChart/getChart`, params })
}

// 根据id获取更多指标
export const goodsClickRateGetMoreByGoodsId = (params: any) => {
  return request.get({ url: `/api/clickRateLineChart/getMoreByGoodsId`, params })
}

// 商品折线图获取结束时间
export const goodsClickRateGetMaxDate = () => {
  return request.get({ url: `/api/clickRateLineChart/getMaxDate` })
}

// 查询商品信息(个人全责)
export const goodsPersonResponsibilityList = (params: any) => {
  return request.get({ url: `/api/goods-person-responsibility/list`, params })
}

//查询运营人员花名册

export const personRosterGetPerson = (userName: string) => {
  return request.get({ url: `/api/personRoster/getPerson?userName=${userName}` })
}

//设置运营负责人

export const goodsPersonInfoCreate = (data: any) => {
  return request.post({ url: '/api/goods-person-info/create', data })
}

// 签查询

export const goodsPersonalQueryTag = (params: any) => {
  return request.get({ url: `/api/tag/queryTag`, params })
}

// 商品标签保存

export const saveGoodsTag = (data: any) => {
  return request.post({ url: `/api/goods-person-responsibility/saveGoodsTag`, data })
}

//根据商品id查询责权历史数据
export const goodsPersonInfoList = (params: any) => {
  return request.get({ url: `/api/goods-person-info/list`, params })
}

//责权历史数据删除

export const goodsPersonInfoDelete = (id: string) => {
  return request.post({ url: `/api/goods-person-info/delete/${id}` })
}

// 竞品销售监控列表
export const goodsSaleMonitorList = (params: any) => {
  return request.get({ url: `/api/competitive-product-monitor/list`, params })
}

// 竞品销售监控趋势
export const goodsSaleMonitorTrendList = (params: any) => {
  return request.get({ url: `/api/competitive-data-change/queryByGoodsId`, params })
}

// 导出Excel
export const goodsSaleMonitorExport = (params: any) => {
  return request.get({ url: `/api/clickRateLineChart/createFsExcel`, params })
}

// 付费申请
export const alipayNewProductPayApplySave = (data: any) => {
  return request.postOriginal({ url: `/api/alipayNewProductPayApply/save`, data })
}
// 取消申请
export const alipayNewProductPayApplyDel = (id: string) => {
  return request.getOriginal({ url: `/api/alipayNewProductPayApply/delete/${id}` })
}

// 付费申请列表
export const alipayNewProductPayApplyList = (params: any) => {
  return request.get({ url: `/api/alipayNewProductPayApply/list`, params })
}
