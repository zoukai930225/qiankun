import request from '@/config/axios'

interface GetRes<T = any> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
}

/** 货品分类分页 */
export function getGoodsClassficationList(params: StorageSystem.GoodsClassfication.GetListParams) {
  return request.get<GetRes<StorageSystem.GoodsClassfication.ListItem>>({
    url: '/api/goods/classification/pageQuery',
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/goods/classification/pageQuery',
    params
  })
}

/** 获取详情 */
export function getGoodsClassficationDetail(id: string) {
  return request.get<StorageSystem.GoodsClassfication.ListItem>({
    url: `/api/goods/classification/detail/${id}`
    // url: `http://127.0.0.1:4523/m1/4344737-3988140-default/api/goods/classification/detail/${id}`
  })
}

/** 获取关联配置表格数据 */
export function getRelations(params: StorageSystem.GoodsClassfication.GetRelatedParams) {
  return request.get<StorageSystem.GoodsClassfication.SpecClassificationRelationVo[]>({
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/goods/classification/relationGoods',
    url: '/api/goods/classification/relationGoods',
    params
  })
}

/** 获取商家编码关联表格数据 */
export function getGoodsList(params: StorageSystem.GoodsClassfication.GetGoodsInfoParams) {
  return request.get<GetRes<StorageSystem.GoodsClassfication.SpecClassificationRelationVo>>({
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/goods/classification/goodsInfo',
    url: '/api/goods/classification/goodsInfo',
    params
  })
}

/** 保存分类及关联配置信息 */
export function SaveOrUpdate(data: StorageSystem.GoodsClassfication.SaveParams) {
  return request.postOriginal({
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/goods/classification/saveOrUpdate',
    url: '/api/goods/classification/saveOrUpdate',
    data
  })
}

/** 货品分类关联商家编码 */
export function classificationRelateCode(id: string, data: { specId?: string }[]) {
  return request.postOriginal({ url: `/api/goods/classification/relation/${id}`, data })
}

/** 移除分类下的商家编码 */
export function removeRelation(id: string, data: { specId: string }[]) {
  return request.postOriginal({ url: `/api/goods/classification/removeRelation/${id}`, data })
}

/** 删除分类 */
export function deleteClassification(id: string) {
  return request.deleteOriginal({ url: `/api/goods/classification/delete/${id}` })
}

/** 获取当前工种下的货品分类 */
export function getGoodsClassificationByRolesMask(params: { roleMask: string }) {
  return request.get({
    url: '/api/goods/classification/listByRoleMask',
    params
  })
}
