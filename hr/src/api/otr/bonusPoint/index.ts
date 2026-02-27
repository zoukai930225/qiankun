import request from '@/config/axios'

// 弹窗 -获取人员列表
export const getDesignerList = (name) => {
  return request.get({ url: `/api/goods/inspect/getDesigners?name=${name}&phone=&employeeNo=` })
}

// 加分项列表
export const getBonusPointList = (params) => {
  return request.get({ url: `/api/otr/pluses/list`, params })
}

// 新增加分项
export const addBonusPoint = (data) => {
  return request.post({ url: `/api/otr/pluses/save`, data })
}

// 编辑加分项
export const editBonusPoint = (data) => {
  return request.post({ url: `/api/otr/pluses/update`, data })
}

// 删除加分项
export const deleteBonusPoint = (params) => {
  return request.get({ url: `/api/otr/pluses/delete`, params })
}
