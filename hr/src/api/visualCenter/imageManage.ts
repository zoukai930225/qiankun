import request from '@/config/axios'

// /api/pictureGallery/promotionGallery  获取周会车图图库列表
export const getPromotionGallery = (params: any) => {
  return request.get({ url: '/api/pictureGallery/promotionGallery', params })
}

// /api/pictureGallery/exportPromotionGallery 导出周会车图图库列表
export const exportPromotionGallery = (params: any) => {
  return request.getOriginal({
    url: '/api/pictureGallery/exportPromotionGallery',
    params,
    responseType: 'blob', // 设置响应类型为blob以处理文件流
    showLoading: true
  })
}
