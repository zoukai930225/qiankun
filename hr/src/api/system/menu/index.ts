/*
 * @Date: 2024-06-07 14:17:38
 */
import request from '@/config/axios'

export interface MenuVO {
  id: string | number | undefined
  pId: string | number
  name: string
  type: number // 菜单类型 1：目录 2：菜单 3：按钮
  sort: number
  path: string //路由地址
  permission: string // 权限标识
  icon: string
  status: number
  component: string //组件地址
  componentName?: string //组件名称
  visible: boolean //显示状态 true:显示 false:隐藏
  keepAlive: boolean //缓存状态  true:缓存 false:不缓存
  alwaysShow?: boolean //总是显示 true:总是 false:不是
  createTime: Date
}

// 查询菜单（精简）列表
export const getSimpleMenusList = () => {
  return request.get({ url: '/api/menu/list' })
}

// 查询菜单列表
export const getMenuList = (params) => {
  return request.get({ url: '/api/menu/list', params })
}

// 获取菜单详情
export const getMenu = (id: string) => {
  return request.get({ url: `/api/menu/get/${id}` })
}

// 新增、更新菜单
export const createOrUpdateMenu = (data: MenuVO) => {
  return request.post({ url: '/api/menu/save', data })
}

// 删除菜单
export const deleteMenu = (id: string) => {
  return request.get({ url: `/api/menu/delete/${id}` })
}

// 查询人员菜单权限
export const queryPersonMenuId = (params) => {
  return request.get({ url: '/api/permission/queryPersonMenuId', params })
}

//根据id查询部门
export const queryDeptMenuId = (params) => {
  return request.get({ url: '/api/permission/queryDeptMenuId', params })
}

//根据id查看所属权限
export const queryPermissionMenuId = (params) => {
  return request.get({ url: '/api/permission/queryPermissionMenuId', params })
}
