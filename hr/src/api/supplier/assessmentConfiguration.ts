// 考核配置
// /api/saConfig/relation/page
import request from '@/config/axios'

// 分页查询考核配置
export const getAssessmentConfigurationPage = (data: any) => {
  return request.post({ url: '/api/saConfig/relation/page', data })
}

// /api/saConfig/relation/updateStatus 修改考核状态
export const updateAssessmentStatus = (data: any) => {
  return request.post({ url: '/api/saConfig/relation/updateStatus', data, showLoading: true })
}

// /api/saConfig/relation/update 编辑关联配置
export const updateAssessmentConfiguration = (data: any) => {
  return request.post({ url: '/api/saConfig/relation/update', data, showLoading: true })
}

// /api/saConfig/relation/clickShowItems 点击关联考核模块数弹窗
export const clickShowItems = (params: any) => {
  return request.get({ url: '/api/saConfig/relation/clickShowItems', params })
}

// /api/saConfig/relation/showUsers 新增/编辑时查询考核模块可以选择的考核人列表
export const showUsers = (params: any) => {
  return request.get({ url: '/api/saConfig/relation/showUsers', params })
}

// /api/saConfig/relation/add 新增关联
export const addAssessmentConfiguration = (data: any) => {
  return request.post({ url: '/api/saConfig/relation/add', data, showLoading: true })
}

// 新增关联时。"添加供应商"弹框数据 /api/saConfig/relation/add/showSuppliers
export const showSuppliers = (data: any) => {
  return request.post({ url: '/api/saConfig/relation/add/showSuppliers', data })
}

// /api/saConfig/rule/list 考核规则列表查询
export const getAssessmentRuleList = (data: any) => {
  return request.post({ url: '/api/saConfig/rule/list', data })
}

// /api/saConfig/rule/updateStatus 修改运行状态
export const updateAssessmentRuleStatus = (data: any) => {
  return request.post({ url: '/api/saConfig/rule/updateStatus', data, showLoading: true })
}

// /api/saConfig/rule/delete 考核规则删除
export const deleteAssessmentRule = (params: any) => {
  return request.get({ url: '/api/saConfig/rule/delete', params, showLoading: true })
}

// /api/saConfig/rule/add  考核规则新增
export const addAssessmentRule = (data: any) => {
  return request.post({ url: '/api/saConfig/rule/add', data, showLoading: true })
}

// /api/saConfig/rule/update  考核规则编辑
export const updateAssessmentRule = (data: any) => {
  return request.post({ url: '/api/saConfig/rule/update', data, showLoading: true })
}

// /api/saConfig/rule/update/show  考核规则编辑回显
export const getAssessmentRuleUpdateShow = (params: any) => {
  return request.get({ url: '/api/saConfig/rule/update/show', params })
}

// /api/saConfig/statistics 考核数据看板
export const getAssessmentStatistics = (params: any) => {
  return request.get({ url: '/api/saConfig/statistics', params })
}

// 点击考核数据看板弹窗展示供应商列表  /api/saConfig/statistics/clickShowSuppliers
export const clickShowSuppliers = (data: any) => {
  return request.post({ url: '/api/saConfig/statistics/clickShowItems', data })
}

// /api/saConfig/relation/delete  删除关联
export const deleteAssessmentConfiguration = (params: any) => {
  return request.get({ url: '/api/saConfig/relation/delete', params, showLoading: true })
}

// /api/saConfig/relation/update/show 编辑回显
export const getAssessmentUpdateShow = (params: any) => {
  return request.get({ url: '/api/saConfig/relation/update/show', params })
}

// /api/saConfig/relation/update/showTypes 编辑页“添加”时可选考核类型与模块
// 入参：array[string] 已有的考核类型（字典 supplier_assessment_type 的值字符串）
export const getAssessmentUpdateShowTypes = (data: any) => {
  return request.post({ url: '/api/saConfig/relation/update/showTypes', data })
}
