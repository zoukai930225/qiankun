/*
 * @Date: 2024-12-13 16:32:19
 */
import request from '@/config/axios'

// 属性分页查询
export const getBasicAttribute = (params) => {
  return request.get({ url: `/basicAttribute/list`, params })
}

// 新增/修改属性
export const createBasicAttribute = (data) => {
  return request.post({ url: '/basicAttribute/save', data })
}

// 查询属性数据
export const getBasicAttributeById = (id) => {
  return request.get({ url: `/basicAttribute/${id}` })
}

// 删除属性
export const delBasicAttribute = (data) => {
  return request.post({ url: '/basicAttribute/delete', data })
}

// 启用属性
export const basicAttributeEnableAttr = (data) => {
  return request.post({ url: '/basicAttribute/enableAttr', data })
}

// 禁用属性
export const disableAttrBasicAttribute = (data) => {
  return request.post({ url: '/basicAttribute/disableAttr', data })
}

// 更新开关字段（主页
export const updateSwitchColumn = (data) => {
  return request.post({
    url: `/basicAttribute/updateSwitchColumn?column=${data.column}&id=${data.id}&value=${data.value}`
  })
}

// 属性拖动排序
export const sortAttr = (data) => {
  const { arr, page, size } = data
  return request.post({
    url: `/basicAttribute/sortAttr?page=${page}&size=${size}`,
    data: arr
  })
}

// 模块下拉接口
export const getMenuList = (name) => {
  return request.get({ url: `/basicAttribute/getMenuList`, params: { name } })
}

// 复制属性
export const copyAttr = (data) => {
  const { moduleIds, arr } = data
  return request.post({ url: `/basicAttribute/copyAttr?moduleIds=${moduleIds}`, data: arr })
}
