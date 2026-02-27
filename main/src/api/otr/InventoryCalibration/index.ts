import request from '@/config/axios'

// 获取盘点校准表头列表
export const getCalibrationHeadList = (params) => {
  return request.get({ url: '/api/otr/calibration/headList', params })
}

// 获取列表数据
export const getCalibrationList = (params) => {
  return request.get({ url: '/api/otr/calibration/list', params })
}

// 编辑盘点校准
export const updateCalibrationList = (data) => {
  return request.post({ url: '/api/otr/calibration/update', data })
}

// 根据id回显校准意见
export const getCalibrationDetail = (params) => {
  return request.get({ url: `/api/otr/calibration/view/getById`, params })
}

// 编辑校准意见
export const updateCalibration = (data) => {
  return request.post({ url: '/api/otr/calibration/view/update', data })
}

// 九宫格占比
export const getNineGridScore = (params) => {
  return request.get({ url: '/api/otr/calibration/queryNineGrid', params })
}

// 校准完成
export const calibrationComplete = (data) => {
  return request.post({ url: '/api/otr/calibration/complete', data })
}

export const getManagerList = () => {
  return request.get({ url: '/api/personRoster/getAll' })
}

// 获取盘点结果列表数据
export const getCalibrationResultList = (params) => {
  return request.get({ url: '/api/otr/calibration/result/list', params })
}

// 个人报告数据接口
export const otrQueryPdfInfo = (params) => {
  return request.get({ url: '/api/otr/calibration/result/queryPdfInfo', params })
}

// 个人报告发送接口
export const otrPdfFeiShuSend = (params) => {
  return request.get({ url: '/api/otr/calibration/result/sendFs', params })
}

// 盘点结果导出
export const exportCalibrationResult = (params) => {
  return request.download({ url: '/api/otr/calibration/result/export', params })
}

// 还原校准
export const resetCalibration = (data) => {
  return request.post({ url: '/api/otr/calibration/restore', data })
}

// 作废当前评价人的分数
export const cancelEvaluation = (data) => {
  return request.post({ url: '/api/otr/calibration/cancelEvaluation', data })
}
