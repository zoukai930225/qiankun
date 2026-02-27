import request from '@/config/axios'
//达摩盘相关接口

//达摩盘类目趋势趋势url
const dharmaApi = '/api/dharmaPlateCategoryTrends'

///api/shortVideo/taoShortVideoPromotionEffectData/getList

const shortVideoApi = 'api/shortVideo/taoShortVideoPromotionEffectData'

// 获取达摩盘列表
export const getDharmaList = (params) => {
  return request.get({ url: `${dharmaApi}/queryList`, params })
}

// 导出
export const exportData = (params) => {
  return request.downloadPost({ url: `${dharmaApi}/export`, params })
}

// 获取天猫淘宝短视频日报列表
export const getShortVideoList = (params) => {
  return request.get({ url: `${shortVideoApi}/getList`, params })
}
//天猫淘宝短视频日报图片发送
export const uploadAndSend = (data) => {
  return request.upload({ url: `${shortVideoApi}/uploadAndSend`, data })
}
