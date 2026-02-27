import request from '@/config/axios'

export interface HighQualityPageParams {
  createdId?: string
  createdTimeBegin?: string
  createdTimeEnd?: string
  marketPosition?: string
  masterImageCollectionCategory?: string
  masterImageCollectionFabric?: string
  masterImageCollectionForm?: string
  planFlag?: string,
  shootFlag?: string,
  stillFlag?: string,
  retouchFlag?: string,
  page: number
  size: number
}

export interface HighQualityRecord {
  collectionDate: string
  collectionReason: string
  collectionUserAvatarOrigin: string
  collectionUserId: string
  collectionUserName: string
  company: string
  companyName: string | null
  createdAt: string
  createdId: string
  goodsCode: string
  goodsId: string
  goodsName: string | null
  groundingTime: string | null
  id: string
  imageUrl: string
  isDeleted: number
  isShow: number
  marketPosition: string
  marketPositionStr: string
  masterImageCollectionCategory: string
  masterImageCollectionCategoryStr: string
  masterImageCollectionFabric: string
  masterImageCollectionFabricStr: string
  masterImageCollectionForm: string
  masterImageCollectionFormStr: string | null
  masterImageId: string
  planDate: string
  planImageJson: string
  planImageList: any
  planUserAvatarOrigin: string | null
  planUserId: string
  planUserName: string | null
  productIntroductionDate: string
  productIntroductionUserAvatarOrigin: string | null
  productIntroductionUserId: string
  productIntroductionUserName: string | null
  productPosition: string
  recordChangeDataFlag: boolean
  retouchDate: string
  retouchImageJson: string
  retouchImageList: any
  retouchUserAvatarOrigin: string | null
  retouchUserId: string
  retouchUserName: string | null
  shootDate: string
  shootImageJson: string
  shootImageList: any
  shootUserAvatarOrigin: string | null
  shootUserId: string
  shootUserName: string | null
  store: any
  targetAudience: string
  updatedAt: string
  updatedId: string
  visualStyle: string
  [key: string]: any
}

export interface HighQualityPageResponse {
  records: HighQualityRecord[]
  total: number
  size: number
  current: number
  pages: number
}

export const fetchHighQualityCollectionPage = (data: HighQualityPageParams) => {
  return request.post<HighQualityPageResponse>({
    url: '/api/pictureHighQualityMasterImageCollection/page',
    data
  })
}

// 详情
export const getHighQualityCollectionDetail = (id: string) => {
  return request.get({
    url: `/api/pictureHighQualityMasterImageCollection/${id}`
  })
}

// selectInfoByMasterId
export const getDetailByMasterId = (id: string) => {
  return request.get({
    url: `/api/pictureHighQualityMasterImageCollection/selectInfoByMasterId/${id}`
  })
}

// 批量删除
export const deleteHighQualityCollection = (data: { idList: string[] }) => {
  return request.post({
    url: '/api/pictureHighQualityMasterImageCollection/deleteByIdList',
    data,
    showLoading: true
  })
}

// 批量分类
export const batchClassifyHighQualityCollection = (data: {
  idList: string[]
  marketPosition?: string
  masterImageCollectionCategory?: string
  masterImageCollectionFabric?: string
  masterImageCollectionForm?: string
}) => {
  return request.post({
    url: '/api/pictureHighQualityMasterImageCollection/batchClass',
    data,
    showLoading: true
  })
}

// 主图信息补充
export interface CollectionInfoSupplementRequest {
  id: string
  targetAudience: string
  productPosition: string
  visualStyle: string
  planImage: {
    imageList: any[]
    keyPointsExtractedList: any[]
  }
  shootImage: {
    imageList: any[]
    keyPointsExtractedList: any[]
  }
  stillImage: {
    imageList: any[]
    keyPointsExtractedList: any[]
  }
  retouchImage: {
    imageList: any[]
    keyPointsExtractedList: any[]
  }
}

export const saveCollectionInfoSupplement = (data: CollectionInfoSupplementRequest) => {
  return request.post({
    url: '/api/pictureHighQualityMasterImageCollection/collectionInfoSupplement',
    data,
    showLoading: true
  })
}

// /api/pictureHighQualityMasterImageCollection/collection
export const addHighQualityCollection = (data: any) => {
  return request.post({
    url: '/api/pictureHighQualityMasterImageCollection/collection',
    data,
    showLoading: true
  })
}

// /api/pictureHighQualityMasterImageCollection/promotionImageCollection
// 车图收藏
export const addPromotionImageCollection = (data: any) => {
  return request.post({
    url: '/api/pictureHighQualityMasterImageCollection/promotionImageCollection',
    data,
    showLoading: true
  })
}

// 系统优质图库收藏新增
export interface SystemImageCollectionRequest {
  goodsName: string
  goodsCode: string
  goodsId: string
  collectionReason: string
  marketPosition?: string
  masterImageCollectionCategory?: string
  masterImageCollectionFabric?: string
  masterImageCollectionForm?: string
  imageUrl: string
}

export const systemImageCollection = (data: SystemImageCollectionRequest) => {
  return request.post({
    url: '/api/pictureHighQualityMasterImageCollection/systemImageCollection',
    data,
    showLoading: true
  })
}

// 系统优质图库收藏编辑
export interface SystemImageCollectionEditRequest extends SystemImageCollectionRequest {
  id: string
}

export const systemImageCollectionEdit = (data: SystemImageCollectionEditRequest) => {
  return request.post({
    url: '/api/pictureHighQualityMasterImageCollection/systemImageCollectionEdit',
    data,
    showLoading: true
  })
}
