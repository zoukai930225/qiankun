/*
 * @Date: 2024-06-11 09:37:31
 */
import request from '@/config/axios'

// 人员看板
export const getDashboardSource = (data: any) => {
  return request.post({ url: '/api/humanResources/selectGroupBy', data })
}

// 获取人员看板分组字段
export const getDashboardGroupField = () => {
  return request.post({ url: '/api/humanResources/getGroupField' })
}

// 人员表单查询
export const getTableSource = (data: any) => {
  return request.post({ url: '/api/humanResources/selectByTable', data })
}

// 获取一级部门下拉
export const getDepartment = () => {
  return request.post({ url: '/api/humanResources/getDepartment' })
}

// 批量离职
export const updateTable = (data: any) => {
  return request.post({ url: '/api/humanResources/updateTable', data })
}

// 删除人员
export const selectByJobFlag = (data: any) => {
  return request.post({ url: '/api/humanResources/deleteById', data })
}

//根据员工id查询员工
export const getInfo = (data: any) => {
  return request.post({ url: '/api/humanResources/selectOneById', data })
}

// 新增员工
export const addUserInfo = (data: any) => {
  return request.post({ url: '/api/humanResources/addTable', data })
}
// 编辑个人信息
export const updateUserInfo = (data: any) => {
  return request.post({ url: '/api/humanResources/update', data })
}

// 导出花名册
export const exportExcel = (params: any) => {
  return request.download({ url: `/api/humanResources/creatExcel`, params })
}
