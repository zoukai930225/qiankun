import request from '@/config/axios'

/**查询阶段进度列表 */
export function queryPhaseProgressListApi(data: any) {
  return request.post({
    url: '/api/np/plan/queryPhaseProgressList',
    data
  })
}

/**查询品类进度 */
export function queryCategoryProgressApi(params: any) {
  return request.get({
    url: '/api/np/plan/queryCategoryProgress',
    params
  })
}
