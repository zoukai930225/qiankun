import request from '@/config/axios'

interface GetRes<T = any> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
}

export function getTable(params: ProductManage.DeadStock.GetListParams) {
  return request.get<GetRes<ProductManage.DeadStock.ListItem>>({
    url: '/api/opUnsalableGoods/list',
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/opUnsalableGoods/list',
    params
  })
}

/** 查询所有货品编码 */
export function getListGoodsNo(params: { goodsNo: string; hasD36XD?: 1 }) {
  return request.get<{ goodsNo: string }[]>({
    url: '/api/wdtGoods/listGoodsNo',
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/wdtGoods/listGoodsNo',
    params: { ...params, hasD36XD: 1 }
  })
}

/** 查询所有商家编码 */
export function getListSpecNo(params: { specNo: string }) {
  return request.get<{ code: string; name: string }[]>({
    url: '/api/wdtSpec/listSpecNo',
    params
  })
}

/** 新增或修改数据 */
export function updateData(data: ProductManage.DeadStock.ListItem) {
  return request.postOriginal({
    url: '/api/opUnsalableGoods/save',
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/opUnsalableGoods/save',
    data
  })
}

/** 删除数据 */
export function deleteData(id: string) {
  return request.postOriginal({
    url: '/api/opUnsalableGoods/deleteById',
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/opUnsalableGoods/deleteById',
    data: { id }
  })
}

/** 获取详情 */
export function getRowDetail(params: {
  productNumber?: string
  dataDate?: string
  codeType?: number
}) {
  return request.get({
    url: `/api/opUnsalableGoods/get`,
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/opUnsalableGoods/get/1',
    params
  })
}

/** 导出 */
export function exportData(params) {
  return request.download({
    url: '/api/opUnsalableGoods/export',
    params
  })
}
