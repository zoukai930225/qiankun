/*
 * @Date: 2025-01-03 17:03:50
 */
import request from '@/config/axios'

// 商企规划 保存
export const saveNp = (data) => {
  return request.post({ url: '/api/np/save', data })
}

// 列表数据
export const getNpList = (data) => {
  return request.post({ url: `/api/np/list`, data })
  // const { page, size, data } = params
  // return request.formPost({
  //   url: `/api/np/list?page=${page}&size=${size}`,
  //   data
  // })
}

// 保存 商企规划 明细
export const saveNpDetail = (data) => {
  return request.post({ url: '/api/np/saveDetail', data })
}

// 回显 商企规划
export const getNpDetail = (id) => {
  return request.get({ url: `/api/np/get/${id}` })
}

// 回显 商企规划
export const queryTempData = () => {
  return request.get({ url: `/api/np/queryTempData` })
}

// 属性分页查询
export const getBasicAttribute = (params) => {
  return request.get({ url: `/basicAttribute/queryByCode`, params })
}

// 更新 商企规划
export const updateNp = (data) => {
  return request.post({ url: '/api/np/update', data })
}

// 删除 商企规划
export const deleteNpById = (id) => {
  return request.get({ url: `/api/np/delete/${id}` })
}

// 企划审核
export const enterpriseExamine = (data) => {
  return request.post({ url: `/api/np/enterpriseExamine`, data })
}

// 企划进度
export const queryProgressBoardByEnterprise = (id) => {
  return request.get({ url: `/api/np/plan/queryProgressBoardByEnterprise?enterprisePlanId=${id}` })
}

// 企划进度
export const planProductInfoExport = (id) => {
  return request.download({ url: `/api/np/plan/productInfo/export/${id}` })
}

// 离职人员交接
export const separatedEmployeeSubmit = (data) => {
  return request.post({ url: `/api/np/plan/resignHandover`, data })
}
