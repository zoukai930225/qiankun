import request from '@/config/axios'

// 分页查询
export const getList = (data:any) => {
  return request.post({ url: `/api/csWarehouseDocking/page`, data })
}

// 通过ID查询单条数据
export const getDetailsById = (id:string) => {
  return request.get({ url: `/api/csWarehouseDocking/${id}`})
}

// 新增数据
export const createData = (data:any) => {
  return request.post({ url: `/api/csWarehouseDocking`,data})
}

// 更新数据
export const updateData = (data:any) => {
  return request.put({ url: `/api/csWarehouseDocking`,data})
}

// 导出 列表
export const exportData = (data:any) => {
  return request.downloadPost({ url: `/api/csWarehouseDocking/export`, data })
}

// 通过主键删除数据
export const deleteById = (params:any) => {
  return request.delete({ url: `/api/csWarehouseDocking`,params})
}

// 通过仓库查找处理人 
export const getHandlerByWarehouse = (warehouse:string) => {
  return request.get({ url: `/api/csWarehouseDocking/getHandler/${warehouse}`})
}