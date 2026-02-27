import request from '@/config/axios'

// 查询货品列表
export const getWdtGoodsList = (params) => {
  return request.get({ url: '/api/wdtGoods/list', params })
}

// 多行货品编码
export const getWdtGoodsByWdtGoodsNo = (data) => {
  return request.post({ url: '/api/wdtGoods/queryByWdtGoodsNo', data })
}

// 查询渠道
export const getQueryChannels = () => {
  return request.get({ url: '/api/wdtGoods/queryChannels' })
}

// 货品编号查SKUID
export const getQuerySameGoods = (params) => {
  return request.get({ url: '/api/wdtGoods/querySameGoods', params })
}

// 所属商品id分组
export const getQueryGoodsIdDetailed = (params) => {
  return request.get({ url: '/api/wdtGoods/queryGoodsIdDetailed', params })
}

// 查询负责人
export const getQueryUserList = (params) => {
  return request.get({ url: '/api/personRoster/getAll', params })
}

// 批量添加负责人
export const addBatchAddUser = (data) => {
  return request.post({ url: '/api/wdtGoods/createGoodsCurator', data })
}
// 导出
export const exportWdtGoods = (params) => {
  return request.download({ url: '/api/wdtGoods/export', params })
}

// 货品管理补货周期
export const getWdtGoodsCycle = (data) => {
  return request.post({ url: '/api/wdtGoods/createReplenishmentCycle', data })
}

// 添加ERP价格变动
export const getAddErpPrice = (data) => {
  return request.post({ url: '/api/wdtPriceChanges/create', data })
}

// 查询历史记录
export const getHistoryList = (params) => {
  return request.get({ url: '/api/wdtPriceChanges/list', params })
}

// 移除ERP价格变动
export const getRemoveErpPrice = (id) => {
  return request.post({ url: `/api/wdtPriceChanges/delete/${id}` })
}

// 更新ERP价格变动
export const getUpdateErpPrice = (data) => {
  return request.post({ url: '/api/wdtPriceChanges/update', data })
}

// 交期管理 分页查询
export const whProductProductionCycle = (params) => {
  return request.get({ url: '/api/whProductProductionCycle', params })
}

// 交期管理 通过主键删除数据
export const deleteWhProductProductionCycle = (params) => {
  return request.delete({ url: `/api/whProductProductionCycle`, params })
}

// 交期管理 更新数据
export const PutWhProductProductionCycle = (data) => {
  return request.put({ url: '/api/whProductProductionCycle', data })
}

// 交期管理 获取货品编号列表
export const productCodeList = (params) => {
  return request.get({ url: '/api/wdtGoods/listGoodsNo', params })
}

// 交期管理 新增数据
export const postWhProductProductionCycle = (data) => {
  return request.post({ url: '/api/whProductProductionCycle', data })
}
