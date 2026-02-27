/*
 * @Date: 2025年2月26日17:19:11
 */

import request from '@/config/axios'

// 入职员工培训查询列表

export const newEmployeeOnboardQryList = (params) => {
  return request.get({ url: `/api/newEmployeeOnboard/list`, params })
}

// 根据id查询导师带领计划
export const newEmployeeOnboard = (params) => {
  return request.get({ url: `/api/newEmployeeOnboard/${params}` })
}

// 保存导师带领计划
export const newEmployeeOnboardSave = (data) => {
  return request.post({ url: `/api/newEmployeeOnboard/save`, data: data })
}

// 导师带领计划更新

export const newEmployeeOnboardupdate = (data) => {
  return request.post({ url: `/api/newEmployeeOnboard/update`, data: data })
}

// 根据id查询调研数据

export const newEmployeeOnboardSurvey = (params) => {
  return request.get({ url: `/api/newEmployeeOnboard/survey/${params}` })
}

//保存导师带领计划
export const saveNotes = (data) => {
  return request.post({ url: `/api/newEmployeeOnboard/save`, data })
}
