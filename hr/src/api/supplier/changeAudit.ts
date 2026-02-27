import request from '@/config/axios'

interface GetRes<T = any> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
}

/**审核列表分页查询 */
export function scPoChangeRequestPaginQueryApi(data: Supplier.ChangeAudit.GetListParams) {
  return request.post<GetRes<Supplier.ChangeAudit.ListItem>>({
    url: '/api/scPoChangeRequest/paginQuery',
    data
  })
}

/**通过ID查询单条数据 带明细 */
export function scPoChangeRequestDetailApi(id: string) {
  return request.get({
    url: `/api/scPoChangeRequest/${id}`
  })
}

/**审批 */
export function scPoChangeRequestAuditApi(data: Supplier.ChangeAudit.AuditParams) {
  return request.postOriginal({
    url: '/api/scPoChangeRequest/audit',
    data
  })
}

/**通过申请单ID查询数据 */
export function scPoChangeRequestLogApi(changeId: string) {
  return request.get({
    url: `/api/scPoChangeRequestLog/queryByChangeId/${changeId}`
  })
}

/**废弃 */
export function scPoChangeRequestWithdraw(params: { scPoChangeRequestId: string }) {
  return request.postOriginal({
    url: '/api/scPoChangeRequest/withdraw',
    params
  })
}
