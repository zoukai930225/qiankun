import request from '@/config/axios'

// 分页查询
export const getDataList = (params) => {
  return request.get({ url: '/api/otr/act/otr-act-inventory/getList', params })
}

// 新增
export const addData = (data) => {
  return request.post({ url: '/api/otr/act/otr-act-inventory/save', data })
}

// 修改
export const updateData = (data) => {
  return request.post({ url: '/api/otr/act/otr-act-inventory/update', data })
}
// 删除
export const deleteData = (id) => {
  return request.post({ url: `/api/otr/act/otr-act-inventory/delete/${id}` })
}
// 根据id查询
export const getDataById = (id) => {
  return request.get({ url: '/api/otr/act/otr-act-inventory/getById', params: { id } })
}

// 查询管理员列表
export const getManagerList = () => {
  return request.get({ url: '/api/personRoster/getAll' })
}

// 查询方案列表
export const getSchemeList = () => {
  return request.get({ url: '/api/otr/plan/getAll' })
}

// 查询九宫格列表
export const getNineGridList = () => {
  return request.get({ url: '/api/otr/nine-grid/list' })
}
// 提交九宫格设置
export const submitNineGrid = (activityId, nineGridId) => {
  return request.post({
    url: `/api/otr/act/saveNineGrid?id=${activityId}&nineGridId=${nineGridId}`
  })
}

// 回显九宫格设置
export const getNineGridInfo = (inventoryId) => {
  return request.get({ url: `/api/otr/nine-grid/getByAct/${inventoryId}` })
}
