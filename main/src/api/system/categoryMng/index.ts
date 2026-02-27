import request from '@/config/axios'

// 获取类目树结构
export const getTree = (params: any) => {
  return request.get({ url: '/api/categoryComparison/getTree', params })
}

//更新类目对照关系
export const updatePlatformCategory = (data: any) => {
  return request.post({ url: '/api/categoryComparison/updatePlatformCategory', data })
}

// 刷新
export const refreshGoodsCategory = (params: any) => {
  return request.post({
    url: '/api/categoryComparison/refreshGoodsCategory',
    params,
    showLoading: true
  })
}

// 获取单品类目关系列表
export const getGoodsList = (params: any) => {
  return request.get({ url: '/api/categoryComparison/getGoodsList', params })
}

// 获取单品类目关系详情
export const getGoodsDetail = (id: string) => {
  return request.get({ url: `/api/categoryComparison/getGoodsDetail/${id}` })
}

// 新增/修改单品类目关系
export const addOrUpdateGoodsComparison = (data: any) => {
  return request.post({
    url: `/api/categoryComparison/addOrUpdateGoodsComparison`,
    data,
    showLoading: true
  })
}

// 失效单品类目关系
export const invalidatedGoodsComparison = (id: string) => {
  return request.post({ url: `/api/categoryComparison/invalidated/${id}` })
}

// 刷新特殊单品类目关系
export const refreshSpecialGoodsCategory = (params?: any) => {
  return request.post({
    url: `/api/categoryComparison/refreshSpecialGoodsCategory`,
    params,
    showLoading: true
  })
}
