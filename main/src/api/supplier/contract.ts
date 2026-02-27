import request from '@/config/axios'

interface GetRes<T = any> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
  extras?: any
}

/** 分页查询——采购合同管理 */
export function scPoContractPaginQueryApi(data: Supplier.Contract.GetPageReq) {
  return request.post<GetRes<Supplier.Contract.ScPoContractPageVo>>({
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/scPoContract/paginQuery',
    url: '/api/scPoContract/paginQuery',
    data
  })
}

/** 通过合同ID查询单条采购合同数据 */
export function getContractInfoByIdApi(id: string) {
  return request.get({
    // url: `http://127.0.0.1:4523/m1/4344737-3988140-default/api/scPoContract/queryById/1`
    url: `/api/scPoContract/queryById/${id}`
  })
}

/** 下载合同 */
export function downloadContractApi(id: string) {
  return request.postOriginal({
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/scPoContract/downloadContract',
    url: `/api/scPoContract/downloadContract/${id}`
  })
}

/** 保存采购合同（新增or更新） */
export function saveContractApi(data: Supplier.Contract.ScPoContractPageVo) {
  return request.postOriginal({
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/scPoContract/saveOrUpdateContract',
    url: '/api/scPoContract/saveOrUpdateContract',
    data
  })
}

/** 保存采购合同并发送到签章平台 */
export function saveAndSendContractApi(data: Supplier.Contract.ScPoContractPageVo) {
  return request.postOriginal({
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/scPoContract/saveOrUpdateContract',
    url: '/api/scPoContract/uploadFileToSign',
    data
  })
}

/** 发送到签章平台 */
export function sendToSignApi(poContractId: string) {
  return request.postOriginal({
    url: `/api/scPoContract/sendToSign/${poContractId}`
  })
}

/** 催签 */
export function remindSignApi(poContractId: string) {
  return request.postOriginal({
    url: `/api/scPoContract/urgeSign/${poContractId}`
  })
}
