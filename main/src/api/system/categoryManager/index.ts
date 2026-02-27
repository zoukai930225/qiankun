import request from '@/config/axios'

// 查询一二三级类目树
export const queryCategoryTree = () => {
  return request.get({ url: '/api/sysCategory/queryCategoryTree', })
}

//通过ID查询单条数据
export const getSysCategoryManagerById = (id:string) => {
  return request.get({ url: `/api/sysCategoryManager/get/${id}`, })
}

// 分页查询
export const getSysCategoryManagerList = (params:any) => {
  return request.get({ url: `/api/sysCategoryManager/list`, params})
}

// 新增数据
export const saveSysCategoryManager = (data:any) => {
  return request.post({ url: `/api/sysCategoryManager/save`, data})
}

// 更新数据
export const updateSysCategoryManager = (data:any) => {
  return request.post({ url: `/api/sysCategoryManager/update`, data})
}

// 通过主键删除数据
export const deleteSysCategoryManager = (data:any) => {
  return request.post({ url: `/api/sysCategoryManager/delete`, data})
}