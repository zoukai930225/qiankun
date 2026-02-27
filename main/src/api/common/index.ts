/*
 * @Date: 2024-06-07 14:17:38
 */
import request from '@/config/axios'

// 地区列表查询
export const getAreaListTree = () => {
  return request.get({ url: '/api/area/listTree' })
}

// 获取品类编码（商品）
export const getCategoryNameList = () => {
  return request.get({ url: '/api/h5/getCategoryNameList' })
}

// 获取NP品类编码（商品）
export const getNPCategoryNameList = () => {
  return request.get({ url: '/api/h5/getCategoryNameList?type=NP' })
}

// 查询部门 name isPermission 1-是 根据逻辑过滤数据 比如 人才盘点  2-否 显示所有人员数据 比如 固定资产  默认传2
export const getDepartmentList = (params) => {
  return request.get({ url: '/api/department/getList/new', params })
}

// 根据部门查询人员 departId部门id  name
export const getPersonByDeIdAndName = (params) => {
  return request.get({ url: '/api/personRoster/getPersonByDeIdAndName', params })
}
// 渠道店铺接口
export const getQueryChannels = (params) => {
  return request.get({ url: '/api/store/query', params })
}

// 根据部门查询人员 OpenId
export const getPersonByOpenId = (openId) => {
  return request.get({ url: `/api/personRoster/getPersonByOpenId?openIds=${openId}` })
}

// 批量新增字典子项
export const addDictItemBatch = (params) => {
  return request.get({ url: '/api/dict/save', params })
}

//根据权限查询店铺并生成树结构
export const queryStoreTree = (params) => {
  return request.get({ url: '/api/store/queryStoreTree', params })
}

//根据权限类型查询权限
export const queryPermissionListByType = (type) => {
  return request.get({ url: `/api/permission/listByType?type=${type}` })
}
