/*
 * @Date: 2024-07-09 08:46:02
 */
import request from '@/config/axios'

// 查询表中字段
export const getColumnName = (params) => {
  return request.get({ url: `/api/sys-expression/getColumnName`, params })
}

// 公式查询
export const sysExpressionList = (params) => {
  return request.get({ url: `/api/sys-expression/list`, params: params })
}

// 公式根据id删除
export const sysExpressionDelete = (id) => {
  return request.post({ url: `/api/sys-expression/delete/${id}` })
}

// 新增公式
export const sysExpressionCreate = (data) => {
  return request.post({ url: `/api/sys-expression/create`, data })
}

// 公式更新
export const sysExpressionUpdate = (data) => {
  return request.post({ url: `/api/sys-expression/update`, data })
}

// 根据id查询
export const getDetailById = (id) => {
  return request.get({ url: `/api/sys-expression/${id}` })
}
