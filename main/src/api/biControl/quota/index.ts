import request from '@/config/axios'
//---------------------------- 指标管理 -----------------------------------
// 通过ID查询单条数据
export const getSysMetricManagementById = (id) => {
  return request.get({ url: `/api/sysMetricManagement/get/${id}` })
}
//分页查询
export const getSysMetricManagementList = (params) => {
  return request.get({ url: `/api/sysMetricManagement/list`,params })
}
//新增/修改数据
export const saveAndUpdateSysMetricManagement = (data) => {
  return request.post({ url: `/api/sysMetricManagement/savedata`,data })
}
//通过主键删除数据
export const delSysMetricManagement = (id) => {
  return request.get({ url: `/api/sysMetricManagement/delete/${id}` })
}

//---------------------------- 指标分组 -----------------------------------

// 通过ID查询单条数据
export const getSysMetricGroupById = (id) => {
  return request.get({ url: `/api/sysMetricGroup/get/${id}` })
}
//分页查询
export const getSysMetricGroupList = (params) => {
  return request.get({ url: `/api/sysMetricGroup/list`,params })
}
//新增/修改数据
export const saveAndUpdateSysMetricGroup = (data) => {
  return request.post({ url: `/api/sysMetricGroup/saveupdate`,data })
}
//通过主键删除数据
export const delSysMetricGroup = (id) => {
  return request.get({ url: `/api/sysMetricGroup/delete/${id}` })
}
//分组查询所有指标
export const getAll = () => {
  return request.get({ url: `/api/sysMetricManagement/getAll` })
}