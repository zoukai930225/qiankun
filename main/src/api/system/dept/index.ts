/*
 * @Date: 2024-06-20 10:23:03
 */
import request from '@/config/axios'

export interface DeptVO {
  id: string | number | undefined
  pId?: string
  name: string
  company: string
}

// 查询部门列表
// export const getDeptPage = async (params: any) => {
//   return await request.get({ url: '/api/department/getList', params })
// }
// new
export const getDeptPage = async (params: any) => {
  return await request.get({ url: '/api/otr/evaluation/invitation/listForOtr', params })
}

// 查询部门详情
export const getDept = async (id: string) => {
  return await request.get({ url: `/api/department/get/${id}` })
}

// 新增、修改部门
export const createOrUpdateDept = async (data: DeptVO) => {
  return await request.post({ url: '/api/department/save', data: data })
}
// 删除部门
export const deleteDept = async (id: string) => {
  return await request.get({ url: `/api/department/delete/${id}` })
}

// 获取全部店铺
export const getAllStoreValue = async () => {
  return await request.get({ url: `/api/store/getAllValue` })
}

// 获取所有部门树
export const getAllDeptTree = async () => {
  return await request.get({ url: `/api/department/getAllDeptTree` })
}

// 更新部门hr
export const updateHrByDeptId = async (data: any) => {
  return await request.post({ url: '/api/department/updateHrByDeptId', data: data })
}
// 获取一级部门
export const getFirstDep = async (params: any) => {
  return await request.get({ url: `/api/department/getFirstDept`, params })
}

// 根据权限id查询部门
export const getDeptByPermissionId = async (params: any) => {
  return await request.get({ url: `/api/permission/listDeptPermission`, params })
}
