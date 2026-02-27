import request from '@/config/axios'

/** 订单评论查询 */
export function commentListApi(params: { orderId: string }) {
  return request.get({
    url: '/api/supplier/order/comment/queryList',
    params
  })
}

/** 新增或修改评论 */
export function updateCommentApi(data: {
  id?: string
  orderId: string
  comment: string
  file: string
}) {
  return request.postOriginal({
    url: '/api/supplier/order/comment/addOrUpdate',
    data
  })
}

/** 删除评论 */
export function delCommentApi(id: string) {
  return request.getOriginal({
    url: `/api/supplier/order/comment/del/${id}`
  })
}
