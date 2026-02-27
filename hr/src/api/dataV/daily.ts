/*
 * @Date: 2024-06-20 10:23:03
 */
import request from '@/config/axios'

export interface DailyConfigureVO {
  id: string
  pId: string
  title: string
  store: string
  field: string //字段名
  color: string
  background: string
}

// 查询日报表头配置列表
export const getDailyConfigurePage = async () => {
  return await request.post({ url: '/api/daily/configure/list' })
}

// 查询日报表头配置详情
export const getDailyConfigure = async (id: string) => {
  return await request.get({ url: `/api/daily/configure/get/${id}` })
}

// 新增、修改日报表头配置
export const createOrUpdateDailyConfigure = async (data: DailyConfigureVO) => {
  return await request.post({ url: '/api/daily/configure/save', data: data })
}
// 删除日报表头配置
export const deleteDailyConfigure = async (id: string) => {
  return await request.get({ url: `/api/daily/configure/delete/${id}` })
}

// 日报表头配置排序
export const dailyConfigureSort = async (data: Object) => {
  return await request.post({ url: `/api/daily/configure/sort`, data: data })
}

// 日报表头配置复制
export const dailyConfigureCopy = async (copyStore: string, store: String, title: String) => {
  return await request.post({ url: `/api/daily/configure/copy`, data: { copyStore, store, title } })
}

// 指标列表
export const getMetricsList = async (params) => {
  return await request.get({ url: `/api/metrics/list`, params })
}

// 删除指标
export const deleteMetricsById = async (id) => {
  return await request.post({ url: `/api/metrics/deleteMetrics/${id}` })
}

// 获取字段数据列表
export const getFieldList = async (params) => {
  return await request.get({ url: `/api/metrics/fieldList`, params })
}

// 根据id查询指标
export const getMetricsById = async (id) => {
  return await request.get({ url: `/api/metrics/getById/${id}` })
}

// 新增修改指标
export const createOrUpdate = async (data) => {
  return await request.post({ url: `/api/metrics/createOrUpdate`, data: data })
}

//首页店铺选择接口查询

export const queryStoreByDaily = async () => {
  return await request.get({ url: `/api/store/queryStoreByDaily` })
}

// 大屏统计指标
export const getDailyDataDetails = async (params: any) => {
  return await request.get({ url: `/api/dailyReport/h5/dailyDataDetails`, params })
}

// 复购率折线图
export const queryRepurchaseLineChart = async (params: any) => {
  return await request.get({ url: `/api/dailyReport/h5/queryRepurchaseLineChart`, params })
}

//店铺退款率折线图
export const queryRefundAmountChart = async (params: any) => {
  return await request.get({ url: `/api/dailyReport/h5/queryRefundAmountChart`, params })
}

//付费推广占比
export const queryPaidPromotionChart = async (params: any) => {
  return await request.get({ url: `/api/dailyReport/h5/queryPaidPromotionChart`, params })
}
