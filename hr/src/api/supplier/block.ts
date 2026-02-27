import request from '@/config/axios'

//设置拉黑状态
export function setBlockSupplier(params) {
  return request.post({
    url: '/api/supplier-basic-info/setBlock',
    params
  })
}

// 获取拉黑原因
export function getBlockReason(supplierId) {
  return request.get({
    url: `/api/supplier-basic-info/getBlockReason/${supplierId}`,
  })
}

// 取消拉黑
export function cancelBlockSupplier(params) {
  return request.post({
    url: '/api/supplier-basic-info/cancelBlock',
    params
  })
}

// 拉黑记录
export function queryAllBlockData(params) {
  return request.get({
    url: '/api/supplier-basic-info/queryAllBlockData',
    params
  })
}
