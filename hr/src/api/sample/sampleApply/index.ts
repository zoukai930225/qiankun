import request from '@/config/axios'

// 获取样品申请记录列表
export const getApplyRecordsList = (params) => {
  return request.get({ url: `/api/sampleManagementInventoryApplyRecord/deliveryApplicationPageList`, params })
}

// 根据ID 查详情
export const getApplyRecordDetailsById = (id) => {
  return request.get({ url: `/api/sampleManagementInventoryApplyRecord/detail/${id}` })
}

// 数据导出
export const exportData = (params) => {
  return request.download({ url: `/api/sampleManagementInventoryApplyRecord/export`, params })
}