import request from '@/config/axios'

// 列表分页查询
export const getList = (params) => {
  return request.get({ url: '/api/csProblemFeedback/page', params })
}

// 通过ID查询单条数据
export const getDetailsById = (params) => {
  return request.get({ url: '/api/csProblemFeedback/get', params })
}

// 新增或修改数据
export const saveOrUpdate = (data) => {
  return request.post({ url: '/api/csProblemFeedback/saveOrUpdate', data })
}

// 处理
export const handleProblem = (data) => {
  return request.post({ url: '/api/csProblemFeedback/handle', data })
}

// 删除
export const deleteById = (params) => {
  return request.delete({ url: '/api/csProblemFeedback/deleteById', params })
}

// 根据部门查询对应关系下面的品类
export const selectCategoryByDept = (id) => {
  return request.get({ url: `/api/csProblemContactPersonConfig/selectCategoryByDept/${id}`, })
}

// 根据部门/品类查询对应关系下面的反馈类型
export const selectTypeList = (data) => {
  return request.post({ url: '/api/csProblemContactPersonConfig/selectTypeList', data })
}

// 根据部门/品类/反馈类型查询对应关系下面的问题对接负责人
export const selectDirectorList = (data) => {
  return request.post({ url: '/api/csProblemContactPersonConfig/selectDirectorList', data })
}

// 导出 列表
export const exportData = (params) => {
  return request.download({ url: '/api/csProblemFeedback/export', params })
}

// 数据看板-查询 问题处理部门占比
export const getListHandleDeptRate = (params) => {
  return request.get({ url: '/api/csProblemFeedback/dataBoard/listHandleDept', params })
}

// 数据看板-导出 问题处理部门占比
export const exportHandleDeptRate = (params) => {
  return request.download({ url: '/api/csProblemFeedback/dataBoard/exportHandleDept', params })
}

// 数据看板-查询 品类占比
export const getListCategoryRate = (params) => {
  return request.get({ url: '/api/csProblemFeedback/dataBoard/listCategory', params })
}

// 数据看板-导出 品类占比
export const exportCategoryRate = (params) => {
  return request.download({ url: '/api/csProblemFeedback/dataBoard/exportCategory', params })
}
// 数据看板-查询 反馈类型占比
export const getListTypeRate = (params) => {
  return request.get({ url: '/api/csProblemFeedback/dataBoard/listType', params })
}

// 数据看板-导出 反馈类型占比
export const exportTypeRate = (params) => {
  return request.download({ url: '/api/csProblemFeedback/dataBoard/exportType', params })
}

// 修改对接人
export const updateHandleUser = (data:any) => {
  return request.post({ url: '/api/csProblemFeedback/updateHandleUser', data })
}
