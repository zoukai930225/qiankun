import request from '@/config/axios'
// 查询列表
export const getInspectList = (params) => {
  return request.get({ url: '/api/goods/inspect/list', params })
}

// 根据id删除产品质检信息
export const deleteInspect = (id) => {
  return request.post({ url: `/api/goods/inspect/delete/${id}` })
}

// 获取单个产品质检信息
export const getInspect = (id) => {
  return request.get({ url: `/api/goods/inspect/getById/${id}` })
}

// 弹窗 -获取产品编码列表
export const getProductCodeList = (params) => {
  return request.get({ url: '/api/goods/inspect/getProductCode', params })
}

// 弹窗 -获取设计师列表
export const getDesignerList = (name) => {
  return request.get({ url: `/api/goods/inspect/getDesigners?name=${name}&phone=&employeeNo=` })
}
// 弹窗 -上传
export const uploadImg = (data) => {
  return request.upload({ url: '/api/oss/upload', data })
}

// 弹窗 -保存
export const saveInspect = (data) => {
  return request.post({ url: '/api/goods/inspect/createOrUpdate', data })
}
