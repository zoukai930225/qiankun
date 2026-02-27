/*
 * @Date: 2024-06-07 14:17:38
 */
import request from '@/config/axios'

export interface PermissionVO {
  id: string | number
  name: string
  channel: string
  channelName: string
  createTime: number | string | Date
  updateTime: number | string | Date
}

// 查询权限列表
export const getPermissionPage = async (params: PageParamNew) => {
  return await request.get({ url: '/api/permission/list', params })
}

// 查询权限（精简)列表
export const getSimplePermissionList = async (): Promise<PermissionVO[]> => {
  return await request.get({ url: '/api/permission/simple-list' })
}

// 查询权限详情
export const getPermission = async (id: string) => {
  return await request.get({ url: `/api/permission/get/${id}` })
}

// 新增、修改权限
export const createOrUpdatePermisson = async (data: PermissionVO) => {
  return await request.post({ url: '/api/permission/save', data })
}

// 用户-权限保存
export const permissonSaveUser = async (data: object) => {
  return await request.post({ url: '/api/permission/saveUser', data })
}

// 菜单-权限保存
export const permissonSaveMenu = async (data: object) => {
  return await request.post({ url: '/api/permission/saveMenu', data })
}
//分配权限-部门(新)
export const saveDepartmentPermission = async (data: object) => {
  return await request.post({ url: '/api/permission/department-permission', data })
}

// 删除权限
export const deletePermisson = async (id: string) => {
  return await request.get({ url: `/api/permission/delete/${id}` })
}

// 根据权限ID获取用户列表
export const permissonUsers = async (id: string) => {
  return await request.get({ url: `/api/permission/user/${id}` })
}

// 根据权限ID获取菜单列表
export const permissonMenus = async (id: string,menuEnv:string) => {
  return await request.get({ url: `/api/permission/menu/${id}/${menuEnv}` })
}

// 获取用户权限分配列表
export const getUserListBypermissionId = async (params) => {
  return await request.get({ url: `/api/user/userList`, params })
}

// 分配权限-用户
export const permissionUserSave = async (data: object) => {
  return await request.post({ url: '/api/user/permissionUserSave', data })
}

// 取消授权-用户

export const permissionUserRemove = async (data: object) => {
  return await request.post({ url: '/api/user/permission/remove', data })
}

// 获取用户权限分配列表未分配该权限
export const getUserListNotChoice = async (params) => {
  return await request.get({ url: `/api/user/userListNotChoice`, params })
}

// 获取用户权限分配列表已分配该权限
export const getUserListChoice = async (params) => {
  return await request.get({ url: `/api/user/userListChoice`, params })
}
