/*
 * @Date: 2025-04-28 10:47:50
 */
import request from '@/config/axios'

// 获取我的排班
export const getMyScheduling = (params) => {
  return request.get({ url: '/api/customer/scheduling/getMy', params })
}

// 提交我的要求
export const saveSchedulingRemark = (data: any) => {
  return request.post({ url: `/api/customer/scheduling/saveRemark`, data })
}

// 排班
export const autoScheduling = (params) => {
  return request.get({ url: '/api/customer/scheduling/auto', params })
}

//获取全部客服排班数据
export const getAllScheduling = (params) => {
  return request.get({ url: '/api/customer/scheduling/getAll', params })
}
//更改某人的某天的排班
export const updateScheduling = (data: any) => {
  return request.post({ url: `/api/customer/scheduling/sechedule`, data })
}
