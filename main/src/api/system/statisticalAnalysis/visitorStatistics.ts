import request from '@/config/axios'

// /api/archive/list 查询归档数据 post
export const getArchiveList = (data: any) => {
  return request.post({ url: '/api/archive/list', data })
}

// /api/archive/total 列表统计 post
export const getArchiveTotal = (data: any) => {
  return request.post({ url: '/api/archive/total', data })
}

// /api/archive/patternAnalysisByVersion 菜单趋势分析-按版本 get
export const getPatternAnalysisByVersion = (params: any) => {
  return request.get({ url: '/api/archive/patternAnalysisByVersion', params })
}

// /api/archive/patternAnalysisByDay 菜单趋势分析-按天 get
export const getPatternAnalysisByDay = (params: any) => {
  return request.get({ url: '/api/archive/patternAnalysisByDay', params })
}

// /api/archive/listVersions 获取所有版本号 get
export const getListVersions = () => {
  return request.get({ url: '/api/archive/listVersions' })
}
