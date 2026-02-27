import request from '@/config/axios'

// 查询实时质检问题登记列表
export const getQIList = (data: {}) => {
  return request.post({ url: '/api/csRealTimeQualityInspection/page', data })
}

// 新增操作
export const saveQI = (data: any) => {
  return request.post({ url: `/api/csRealTimeQualityInspection/add`, data })
}

// 更新操作
export const updateQI = (data: any) => {
  return request.post({ url: `/api/csRealTimeQualityInspection/editForCreate`, data })
}

// 查询详情
export const queryDetailsQI = (id: string) => {
  return request.get({ url: `/api/csRealTimeQualityInspection/${id}` })
}

// 删除操作
export const deleteQI = (params: any) => {
  return request.delete({ url: `/api/csRealTimeQualityInspection/deleteById`, params })
}

// 导出操作
export const exportQI = (data: any) => {
  return request.downloadPost({ url: `/api/csRealTimeQualityInspection/export`, data })
}

// 处理操作
export const handleQI = (data: any) => {  
  return request.post({ url: `/api/csRealTimeQualityInspection/editForHandle`, data })
}