import request from '@/config/axios'

// 查询任务卡片列表
export const getDataBoardList = (params) => {
  return request.get({ url: '/api/dataBoard/board/list', params })
}

// 查询任务 表格列表
export const getTaskTableList = (params) => {
  return request.get({ url: `/api/dataBoard/board/executelist`, params })
}

// 根据程序执行记录id获取程序处理记录

export const getProgramHandleRecord = (params) => {
  return request.get({ url: `/api/dataBoard/getByExecute`, params })
}

// 根据任务code获取程序执行记录
export const getProgramExecuteRecord = (params) => {
  return request.get({ url: `/api/dataBoard/getByGroup`, params })
}
// 程序处理记录保存
export const saveProgramExecuteRecord = (data) => {
  return request.post({ url: `/api/dataBoard/handleRecord/save`, data })
}

//流程图 -根据任务code获取程序
export const getProgramByGroup = (params) => {
  return request.get({ url: `/api/dataBoard/queryProgramByGroup`, params })
}

// 获取图形数据
export const getChartData = (params) => {
  return request.get({ url: `/api/dataBoard/board/queryGraphInfo`, params })
}

// 桑基图数据
export const getSanKeyData = () => {
  return request.get({ url: `/api/data/direction/list` })
}

// 执行记录-列表
export const getExecuteRecordList = (params) => {
  return request.get({ url: `/api/data/trigger/list`, params })
}

// 执行记录-详情
export const getExecuteRecordDetail = (params) => {
  return request.get({ url: `/api/data/trigger/getInfo`, params })
}

// RPA每日运行看板任务数查询
export const getDaySum = (params) => {
  return request.get({ url: `/api/data/trigger/getDaySum`, params })
}

// RPA每日运行看板任务详情查询
export const getDaySumRecords = (params) => {
  return request.get({ url: `/api/data/trigger/getDaySumRecords`, params })
}

// /api/dataBoard/board/executelistOnlyNew
export const getExecuteRecordListOnlyNew = (params: any) => {
  return request.get({ url: `/api/dataBoard/board/executelistOnlyNew`, params })
}
