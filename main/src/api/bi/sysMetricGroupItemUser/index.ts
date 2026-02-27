//BI页面指标查询
import request from '@/config/axios'

const prefix = '/api/sysMetricGroupItemUser'

//查询用户指标
export const getUserselect = (params) => {
  return request.get({ url: `${prefix}/getuserselect`, params })
}
//可选择的所有指标
export const getConfigurationuseritem = (params) => {
  return request.get({ url: `${prefix}/configurationuseritem`, params })
}
//保存用户选择的指标
export const saveselectitem = (data) => {
  return request.post({ url: `${prefix}/saveselectitem`, data })
}

//获得默认前端配置
export const getRestoreDefault = (data) => {
  return request.post({ url: `/api/sysMetricGroup/getrestoreDefault`, data })
}