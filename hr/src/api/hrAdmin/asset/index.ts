import request from '@/config/axios'

// 查询部门列表
export const getDeptPage = () => {
  return request.get({ url: '/api/department/list' })
}
// 固定资产分页查询
export const getAssetPage = (data: any) => {
  return request.post({ url: '/api/fixedAsset/pageList', data })
}
// 根据id删除资产
export const deleteAsset = (data) => {
  return request.post({ url: '/api/fixedAsset/deleteByIds', data })
}
// 根据id查看资产信息
export const getAssetDetailById = (id) => {
  return request.get({ url: `/api/fixedAsset/getById/${id}` })
}
// 修改固定资产信息
export const updateAsset = (data) => {
  return request.post({ url: '/api/fixedAsset/update', data })
}
// 新增资产
export const addAsset = (data) => {
  return request.post({ url: '/api/fixedAsset/save', data })
}
// 导出
export const exportAsset = () => {
  return request.download({ url: '/api/fixedAsset/export' })
}

// 更换人员-查询人员信息
export const getUserList = (data) => {
  return request.post({ url: `/api/humanResources/getInfo`, data })
}
// 根据固定资产id查询固定资产历史使用人
export const getAssetHistoryUser = (fixedAssetId) => {
  return request.get({ url: '/api/fixedAsset/historicalPerson', params: { fixedAssetId } })
}

// 固定资产编号校验
export const checkAssetCode = (id, number) => {
  const data = id ? { id, number } : { number }
  return request.post({ url: '/api/fixedAsset/numberCheck', data })
}

// 导入模版下载
export const importTemplateExport = () => {
  return request.download({ url: '/api/fixedAsset/exportMuBan' })
}

// 资产添加关联
export const fixedAssetBind = (data) => {
  return request.post({ url: '/api/fixedAsset/bind', data })
}

// 资产取消关联
export const fixedAssetCancelBind = (data) => {
  return request.post({ url: '/api/fixedAsset/cancelBind', data })
}

// 资产id查询已绑定
export const fixedAssetQueryBind = (params) => {
  return request.get({ url: '/api/fixedAsset/queryBind', params })
}

// 资产id查询未绑定
export const fixedAssetQueryUnBind = (params) => {
  return request.get({ url: '/api/fixedAsset/queryUnBind', params })
}

// /api/assetArea/list 固定资产区域列表
export const getAssetAreaList = (params: any) => {
  return request.get({ url: '/api/assetArea/list', params })
}

// /api/assetArea/save 保存和修改，区域名称不能重复
export const saveAssetArea = (data: any) => {
  return request.post({ url: '/api/assetArea/save', data, showLoading: true })
}

// /api/assetArea/deleteByIds 批量删除或根据id删除
export const deleteAssetArea = (data: any) => {
  return request.post({ url: '/api/assetArea/deleteByIds', data, showLoading: true })
}

// /api/assetArea/getAll 查询区域,作为下拉查询条件使用
export const getAssetAreaAll = () => {
  return request.get({ url: '/api/assetArea/getAll' })
}

// 批量设置
export const batchSet = (data: any) => {
  return request.post({ url: '/api/fixedAsset/batchSet', data })
}

// 批量关联组织
export const relationOrgan = (data: any) => {
  return request.post({ url: '/api/assetArea/relationOrgan', data })
}
