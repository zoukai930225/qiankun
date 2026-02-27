/*
 * @Date: 2025-04-16 08:47:28
 */
import request from '@/config/axios'

// 获取最新十亿数据
export const getNewTenBillion = () => {
  return request.get({ url: '/api/billion/obtain/variance' })
}

// 获取抖音五亿数据
export const getTargetNumber_Douyin = () => {
  return request.get({ url: '/api/billion/obtain/douyin/variance' })
}
// 获取全部
export const getTargetNumberOther = () => {
  return request.get({ url: '/api/billion/obtain/other/variance' })
}

// 上传文件
export const updateFile = (data: any) => {
  return request.upload({ url: '/api/billion/upload', data })
}

// 上传文件
export const updateFile_Douyin = (data: any) => {
  return request.upload({ url: '/api/billion/uploadAndSendDouyin', data })
}

// 上传文件全部
export const updateFileAll = (data: any) => {
  return request.upload({ url: '/api/billion/uploadAndSendOther', data })
}
