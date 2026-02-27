import request from '@/config/axios'

// 仓库列表
export const getWarehouseList = (params) => {
  return request.get({
    url: `/api/scWarehouse/page`,
    params
  })
}

// 根据id查询单条仓库信息
export const getWarehouseById = (params) => {
  return request.get({
    url: `/api/scWarehouse/get`,
    params
  })
}

// 新增或者编辑仓库信息
export const saveOrUpdateWarehouse = (data) => {
  return request.post({
    url: `/api/scWarehouse/saveOrUpdate`,
    data
  })
}

// 修改状态
export const updateStatusWarehouse = (data) => {
  return request.post({
    url: `/api/scWarehouse/updateStatus`,
    data
  })
}

// 查询所有仓库 ERP仓库 旺店通同步的数据
export const getwdtWarehouseList = () => {
  return request.get({
    url: `/api/wdtWarehouseDetail/listAll`
  })
}

// 查询所有仓库 ERP仓库 旺店通同步的数据 - 有参数
export const getwdtWarehouseListByParams = (params) => {
  return request.get({
    url: `/api/wdtWarehouseDetail/getWarehouse`,
    params
  })
}


