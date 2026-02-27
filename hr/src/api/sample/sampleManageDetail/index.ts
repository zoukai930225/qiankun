import request from '@/config/axios'

// 获取样品管理明细数据列表
export const getDetailList = (params) => {
  return request.get({ url: `/api/sample-management-correlation-location/list`, params })
}

// 出库编辑操作
export const outWarehouseUpdate = (data) => {
  return request.post({
    url: `/api/sample-management-correlation-location/outWarehouseUpdate`,
    data
  })
}

// 根据id查询详情  出库,入库 ,报废
export const getDetailById = (id) => {
  return request.get({ url: `/api/sample-management-correlation-location/${id}` })
}

// 数据导出
export const exportData = (params) => {
  return request.download({ url: `/api/sample-management-correlation-location/export`, params })
}
