import request from '@/config/axios'

//0-素人，1-达人，2-追踪(暂定)
export enum XhsNoteType {
  layman = 0,
  expert = 1,
  track = 2
}
export interface XhsListParam {
  page?: number
  size?: number
  title?: string
  link?: string
  startDate?: string
  endDate?: string
  account?: string
  noteType?: number | string
}

export interface XhsAddParam {
  noteType?: number | string
  link?: string
}

// 文章类型枚举值
export const ArticleTypeOptions = [
  { label: '素人', value: 0 },
  { label: '共创', value: 1 },
  { label: '追踪', value: 2 }
]

// 小红书列表接口
export const getXhsList = (params: XhsListParam) => {
  return request.get({ url: '/api/xhs/list', params })
}

// 小红书保存接口
export const saveXhsInfo = (data: XhsAddParam) => {
  return request.post({ url: '/api/xhs/save', data })
}

// 小红书模版下载
export const xhsTemplateExport = () => {
  return request.download({ url: '/api/xhs/excel/export' })
}

// 根据文章id查询30内点赞收藏评论
export const xhsListByXhsId = (xhsId: string) => {
  return request.get({ url: `/api/xhs/listByXhsId?xhsId=${xhsId}` })
}

// 获取小红书关键词（原类目）下拉列表
export const getXhsCategory = () => {
  return request.get({ url: '/api/xhs/getCategory' })
}
