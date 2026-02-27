import request from '@/config/axios'

// 查询列表
export const getTimeDagrmaList = (params) => {
  return request.get({ url: '/api/dataBoard/queryStaticTimingDiagram', params })
}

// 获取详情
export const getTimeDagrmaDetail = (id) => {
  return request.get({ url: `/api/platform/get/${id}` })
}

// 查询运行时列表
export const getRuntimeTimeDagrmaList = (params) => {
  return request.get({ url: '/api/dataBoard/queryStTimingDiagram', params })
}

// 获取详情
export const getRuntimeTimeDagrmaDetail = (id) => {
  return request.get({
    url: `/api/dataBoard/queryExecuteRecord/${id}`
  })
}
