import request from '@/config/axios'

// ------账号管理Start------
// 分页查询
export const getQcAccountList = (params) => {
  return request.get({ url: '/api/qcAccountManage/list', params })
}

// 新增修改数据
export const addQcAccount = (data) => {
  return request.post({ url: '/api/qcAccountManage/save', data })
}

// 删除数据
export const deleteQcAccount = (id) => {
  return request.get({ url: `/api/qcAccountManage/delete/${id}` })
}

// 通过ID查询单条数据
export const getQcAccountById = (id) => {
  return request.get({ url: `/api/qcAccountManage/get/${id}` })
}

// 根据渠道查询店铺列表数据
export const getQcAccountStoreByChannel = (params) => {
  return request.get({ url: '/api/store/queryStoreByChannel', params })
}

// ------账号管理End------

// -----账号分配Start----
// 分页查询
export const getQcAccountAssignList = (params) => {
  return request.get({ url: '/api/qcAccountCostAllocation/list', params })
}

// 新增数据
export const addQcAccountAssign = (data) => {
  return request.post({ url: '/api/qcAccountCostAllocation/save', data })
}

// 更新数据
export const updateQcAccountAssign = (data) => {
  return request.post({ url: '/api/qcAccountCostAllocation/update', data })
}

// 删除数据
export const deleteQcAccountAssign = (id) => {
  return request.get({ url: `/api/qcAccountCostAllocation/delete/${id}` })
}

// 设置到期
export const setExpireQcAccountAssign = (id) => {
  return request.get({ url: `/api/qcAccountCostAllocation/setExpiry`, params: { id } })
}

// 通过ID查询单条数据
export const getQcAccountAssignById = (id) => {
  return request.get({ url: `/api/qcAccountCostAllocation/get/${id}` })
}
// 根据渠道查询账单店铺和账单账号
export const getQcAccountByChannel = (params) => {
  return request.get({ url: '/api/qcAccountCostAllocation/getBillStoreAndAccount', params })
}

// 通过渠道，账单店铺，账单账号直播间和财务流水的数据
export const getQcAccountByChannelBillStoreAndAccount = (params) => {
  return request.get({ url: '/api/qcAccountCostAllocation/getLiveAndFinancialStatements', params })
}

// -----账号分配End----

// -----账号明细 Start----
// 分页查询
export const getQcAccountDetailList = (data) => {
  return request.post({ url: '/api/qcAccountDetail/pageQuery', data })
}

// 导出
export const exportQcAccountDetail = (data) => {
  return request.downloadPost({ url: '/api/qcAccountDetail/export', data })
}

// 查询财务流水明细
export const getQcAccountFinancialDetail = (id) => {
  return request.get({ url: `/api/qcAccountDetail/getFinancialDetail/${id}` })
}

// -----账号明细 End----
