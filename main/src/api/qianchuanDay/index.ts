import request from '@/config/axios'

const QIAN_CHUAN_API = '/api/qcStoreDailyConfigCustomize'

// 分页查询
export const getList = (params) => {
  return request.get({ url: `${QIAN_CHUAN_API}/list`, params })
}

// 新增数据
export const save = (data) => {
  return request.post({ url: `${QIAN_CHUAN_API}/save`, data })
}

// 修改数据
export const update = (data) => {
  return request.post({ url: `${QIAN_CHUAN_API}/update`, data })
}

// 查询详情
export const getById = (id) => {
  return request.get({ url: `${QIAN_CHUAN_API}/get/${id}` })
}

// 删除
export const deleteById = (id) => {
  return request.get({ url: `${QIAN_CHUAN_API}/delete/${id}` })
}

///过期
export const setExpiry = (params) => {
  return request.get({ url: `${QIAN_CHUAN_API}/setExpiry`, params })
}
