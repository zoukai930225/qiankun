import request from '@/config/axios'

//新增
export const addData = (data) => {
  return request.post({ url: '/api/quartz/save', data })
}

// 根据id回显
export const queryById = (id) => {
  return request.get({ url: `/api/quartz/getOne/${id}` })
}

// 修改
export const updateData = (data) => {
  return request.post({ url: '/api/quartz/edit', data })
}

// 删除
export const deleteData = (id) => {
  return request.post({ url: `/api/quartz/delete/${id}` })
}

// 查询列表
export const queryList = (params) => {
  return request.get({ url: '/api/quartz/list', params })
}

// 立即发送
export const sendData = (data) => {
  return request.post({ url: `/api/quartz/send`, data })
}
