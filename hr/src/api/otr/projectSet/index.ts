/*
 * @Date: 2024-10-10 09:01:47
 */
import request from '@/config/axios'

// 分页查询
export const getProgramList = (params) => {
  return request.get({ url: '/api/otr/program/list', params })
}

// 新增项目
export const addProgramSave = (data) => {
  return request.post({ url: '/api/otr/program/save', data })
}

// 编辑项目
export const updateProgramSave = (data) => {
  return request.post({ url: '/api/otr/program/update', data })
}

//根据id查询项目
export const getProgramById = (params) => {
  return request.get({ url: '/api/otr/program/getById', params })
}

// 删除项目
export const deleteProgramById = (params) => {
  return request.get({ url: '/api/otr/program/delete', params })
}
