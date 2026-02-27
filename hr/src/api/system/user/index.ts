import request from '@/config/axios'

export interface UserVO {
  id: string | number | undefined
  userName: string // 账号
  username: string // 账号
  realName: string
  password: string
  nickname: string
  phone: string
  email: string
  sex: number // 1-男 2-女
  post: string // 岗位
  departmentId: string // 部门
  isLeader: number //是否负责人
  isAdmin: number //是否管理员
  createTime: number | string
}

// 查询用户管理列表
export const getUserPage = (params: PageParamNew) => {
  return request.get({ url: '/api/user/list', params })
}

// 获取未授权用户列表
export const getUserPermissionPage = (params: PageParamNew) => {
  return request.get({ url: '/api/user/permission/list', params })
}

// 查询用户详情
export const getUser = (id: string) => {
  return request.get({ url: `/api/user/get/${id}` })
}

// 新增、修改用户
export const createOrUpdateUser = (data: UserVO) => {
  return request.post({ url: '/api/user/save', data })
}

// 删除用户
export const deleteUser = (id: string) => {
  return request.get({ url: `/api/user/delete/${id}` })
}

// 限取消授权
export const userPermissionRemove = (userId: string, permissionId: string) => {
  return request.get({ url: `/api/user/permission/remove/${userId}/${permissionId}` })
}

// 分配权限
export const userPermissionSave = (data: Object) => {
  return request.post({ url: '/api/user/permission/save', data })
}

// 导出用户
export const exportUser = (params) => {
  return request.download({ url: '/system/user/export', params })
}

// 下载用户导入模板
export const importUserTemplate = () => {
  return request.download({ url: '/system/user/get-import-template' })
}

// 用户密码重置
export const resetUserPwd = (id: string, password: string) => {
  const data = {
    id,
    password
  }
  return request.put({ url: '/system/user/update-password', data: data })
}

/** 用户管理功能重构 2025-06-25 */
// 用户列表
export const getUserList = (params) => {
  return request.get({ url: '/api/user/userBasicInfo', params })
}
// 飞书账户 详情 基本信息
export const getFeishuUserInfo = (id) => {
  return request.get({ url: `/api/personRoster/info/${id}` })
}
// 系统账户 详情 基本信息
export const getSystemUserInfo = (id) => {
  return request.get({ url: `/api/user/get/${id}` })
}
// 获取当前用户的固定资产
export const getFixedAsset = (id) => {
  return request.get({ url: `/api/fixedAsset/getByUserId/${id}` })
}
// 获取当前用户的 权限店铺
export const getStoreByUserId = (id) => {
  return request.get({ url: `/api/user/storeByUserId/${id}` })
}
// 获取当前用户的权限角色列表
export const getRolePermissionByUserId = (id) => {
  return request.get({ url: `/api/user/permissionByUserId/${id}` })
}
// 获取所有权限角色列表
export const getPermissionModule = () => {
  return request.get({ url: `/api/permission/getPermissionModule` })
}
// 更新当前用户权限店铺
export const updateUserStore = (data: Object) => {
  return request.post({ url: '/api/user/saveUserStore', data })
}
// 更新当前用户权限角色
export const updateUserRole = (data: Object) => {
  return request.post({ url: '/api/permission/savePermissionModule', data })
}
// 查询用户登录日志列表
export const getSysLogRecord = (params: any) => {
  return request.get({ url: '/api/sysLogRecord/pageList', params })
}
/** 用户管理功能重构 2025-06-25 */
