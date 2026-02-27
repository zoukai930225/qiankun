import request from '@/config/axios'

interface GetRes<T = any> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
}

/** 渠道分页 */
export function getChannelList(params: RightsManage.GetChannelsParams) {
  return request.get<GetRes<RightsManage.ChannelListItem>>({
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/opDutyAuthorityManage/channel/list',
    url: '/api/opDutyAuthorityManage/channel/list',
    params
  })
}

/** 新增或修改数据 */
export function updateAuthority(data: RightsManage.UpdateParams) {
  return request.postOriginal({
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/opDutyAuthorityManage/saveOrUpdate',
    url: '/api/opDutyAuthorityManage/saveOrUpdate',
    data
  })
}

/** 获取详情 */
export function getAuthorityDetail(params: RightsManage.GetDetailParams) {
  return request.get<RightsManage.DetailRes>({
    url: '/api/opDutyAuthorityManage/list',
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/opDutyAuthorityManage/list',
    params
  })
}

/** 获取类目列表 */
export function getCategoryList(params: RightsManage.GetCategoryParams) {
  return request.get({
    url: '/api/opDutyAuthorityManage/category/list',
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/opDutyAuthorityManage/category/list',
    params
  })
}

/** 获取类目下拉菜单 */
export function getCategorys(params: { category?: string; channel?: string }) {
  return request.get({
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/categoryBasicInfo/list',
    url: '/api/categoryBasicInfo/list',
    params
  })
}

/** 获取商品列表 */
export function getGoodsList(params: RightsManage.GetGoodsListParams) {
  return request.get({
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/opDutyAuthorityManage/goods/list',
    url: '/api/opDutyAuthorityManage/goods/list',
    params
  })
}

/** 获取店铺列表 */
export function getStoreList(params: RightsManage.GetGoodsListParams) {
  return request.get({
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/opDutyAuthorityManage/goods/list',
    url: '/api/opDutyAuthorityManage/store/list',
    params
  })
}
