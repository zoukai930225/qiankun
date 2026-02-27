import request from '@/config/axios'

// 获取最大日期
export const getMaxDate = () => {
  return request.get({ url: `/api/offset/maxDate` })
}

// 获取列表
export const getPageList = (params) => {
  return request.get({ url: `/api/offset/list`, params })
}