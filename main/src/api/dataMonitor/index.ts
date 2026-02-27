import request from '@/config/axios'
//数据监控看板相关接口

//数据监控看板url
const dataCheckResultApi = '/api/dataCheckResult'

// 获取数据监控看板列表
export const getList = (params) => {
  return request.get({ url: `${dataCheckResultApi}/list`, params })
}

// 人工确认
export const updateCheckStatus = (data) => {
  return request.post({ url: `${dataCheckResultApi}/update`, data })
}

// 人工确认（带图片和备注）
export const updateCheckStatusWithImageAndRemark = (data) => {
  return request.post({ url: `${dataCheckResultApi}/updateWithImageAndRemark`, data })
}

// 通过ID查询单条数据
export const getDetail = (id) => {
  return request.get({ url: `${dataCheckResultApi}/get/${id}` })
}
