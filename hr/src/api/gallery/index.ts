/*
 * @Date: 2025-05-22 18:08:40
 */
import request from '@/config/axios'

// 商品主图信息列表
export const getList = (params) => {
  return request.get({ url: '/api/pictureGallery/getGoodsMasterImageList', params })
}

// 新增商品主图信息

export const addGoodsMasterImage = (data) => {
  return request.post({ url: '/api/pictureGallery/addGoodsMasterImage', data })
}

// 修改商品主图信息

export const updateGoodsMasterImage = (data) => {
  return request.post({ url: '/api/pictureGallery/updateGoodsMasterImage', data })
}

// 详情页
export const getDetailPage = (params) => {
  return request.get({ url: '/api/pictureGallery/getDetailPage', params, showLoading: true })
}

// 获取推广图信息

export const getGoodsPromotionImage = (params) => {
  return request.get({ url: '/api/pictureGallery/getGoodsPromotionImage', params })
}

export const getGoodsPromotionImageList = (params) => {
  return request.get({ url: '/api/pictureGallery/getGoodsPromotionImageList', params })
}

// 新增推广图信息

export const addGoodsPromotionImage = (data) => {
  return request.post({ url: '/api/pictureGallery/addGoodsPromotionImage', data })
}

// 批量新增推广图信息
export const addGoodsPromotionImages = (data: any[]) => {
  return request.post({ url: '/api/pictureGallery/addGoodsPromotionImages', data })
}

// 获取推广图版本号
export const getPromotionVersion = (params: any) => {
  return request.get({ url: '/api/pictureGallery/getPromotionVersion', params })
}

// 修改推广图信息

export const updateGoodsPromotionImage = (data) => {
  return request.post({ url: '/api/pictureGallery/updateGoodsPromotionImage', data })
}

// 推广图首页

export const getHomePage = (data: any) => {
  return request.post({ url: '/api/pictureGallery/getHomePage', data })
}

// 当前快速选择商品是否存在

export const goodsIsExist = (params) => {
  return request.get({ url: '/api/pictureGallery/goodsIsExist', params })
}

// 根据商品id 查询指定时间段的访客数曲线数据

export const getVisitorCurve = (params) => {
  return request.get({ url: '/api/pictureGallery/getVisitorCurve', params })
}

// 更新数据为 优质车图库、待提升车图库
export const updateQualityAndImprove = (data) => {
  return request.post({ url: '/api/pictureGallery/updateQualityAndImprove', data })
}

//获取 优质车图库、待提升车图库
export const getQualityAndImprove = (params) => {
  return request.get({ url: '/api/pictureGallery/getQualityAndImprove', params })
}

// 图库-推广图-按版本删除
export const deletePromotionImageVersion = (data) => {
  return request.post({ url: '/api/pictureGallery/deletePromotionImageVersion', data })
}

// http://192.168.88.113:7081/api/pictureGallery/mainImageLikeOrStep 主图点赞/点踩
export const mainImageLikeOrStep = (data) => {
  return request.post({ url: '/api/pictureGallery/mainImageLikeOrStep', data })
}
// http://192.168.88.113:7081/api/pictureGallery/getMainImageLikeOrStepPage 主图待提升图库记录/优质图库记录分页查询
export const getMainImageLikeOrStepPage = (params) => {
  return request.get({ url: '/api/pictureGallery/getMainImageLikeOrStepPage', params })
}

// http://192.168.88.113:7081/api/pictureGallery/getCarImageLikeOrStepPage 车图待提升图库记录/优质图库记录
export const getCarImageLikeOrStepPage = (params) => {
  return request.get({ url: '/api/pictureGallery/getCarImageLikeOrStepPage', params })
}

// /api/pictureCollect/grAddOrCancel 个人添加或取消收藏
export const personalAddOrCancel = (data) => {
  return request.post({ url: '/api/pictureCollect/grAddOrCancel', data })
}

// /api/pictureCollect/commonAddOrCancel 公共添加或取消收藏
export const commonAddOrCancel = (data) => {
  return request.post({ url: '/api/pictureCollect/commonAddOrCancel', data })
}

// /api/pictureCollect/deleteDate 删除日期收藏
export const deleteDate = (data) => {
  return request.post({ url: '/api/pictureCollect/deleteDate', data, showLoading: true })
}

// /api/pictureCollect/getPictureCollectDate 获取收藏日期
export const getPictureCollectDate = (params) => {
  return request.get({ url: '/api/pictureCollect/getPictureCollectDate', params })
}

// /api/pictureGallery/syncData

export const syncData = (data: any) => {
  return request.get({ url: '/api/pictureGallery/syncData', data, showLoading: true })
}

// /api/pictureGallery/syncPictureGallery 同步图库
export const syncPictureGallery = (data: { goodsIds: string[] }) => {
  return request.post({ url: '/api/pictureGallery/syncPictureGallery', data, showLoading: true })
}

// 新增收藏夹 /api/pictureCollect/addFavorites
export const addFavorites = (data: any) => {
  return request.post({ url: '/api/pictureCollect/addFavorites', data, showLoading: true })
}

// 删除收藏夹 /api/pictureCollect/delFavorites
export const delFavorites = (data: any) => {
  return request.post({ url: '/api/pictureCollect/delFavorites', data, showLoading: true })
}

// /api/pictureCollect/editFavorites 编辑收藏夹
export const editFavorites = (data: any) => {
  return request.post({ url: '/api/pictureCollect/editFavorites', data, showLoading: true })
}

// /api/pictureCollect/getFavoritesInfo 获取收藏夹信息
export const getFavoritesInfo = (params: any) => {
  return request.get({ url: '/api/pictureCollect/getFavoritesInfo', params })
}

// /api/pictureCollect/addCollect 新增收藏
export const addCollect = (data: any) => {
  return request.post({ url: '/api/pictureCollect/addCollect', data, showLoading: true })
}

// /api/pictureCollect/cancelCollect 删除收藏
export const cancelCollect = (data: any) => {
  return request.post({ url: '/api/pictureCollect/cancelCollect', data })
}

// /api/pictureCollect/addRemarkInfo 添加备注
export const addRemarkInfo = (data: any) => {
  return request.post({ url: '/api/pictureCollect/addRemarkInfo', data, showLoading: true })
}

// 查看备注 /api/pictureCollect/getRemarkInfo
export const getRemarkInfo = (data: any) => {
  return request.post({ url: '/api/pictureCollect/getRemarkInfo', data })
}
