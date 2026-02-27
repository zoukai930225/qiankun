import request from '@/config/axios'

// 拖拽节点排序
// export const dragSort = (data: any) => {
//   return request.post({ url: '/oa/new/templete/dragSort',data })
// }

// 模版列表
export const templeteList = (params: any) => {
  const { page, size, data } = params
  return request.formPost({ url: `/api/np/progress/list?page=${page}&size=${size}`, data })
}

// 节点审核信息列表
export const templeteNodeDetailList = (data: any) => {
  return request.formPost({ url: `/api/np/progress/node/detailList`, data })
}

// 回显 进度模版
export const templeteDetail = (id: any) => {
  return request.get({ url: `/api/np/progress/get/${id}` })
}

// 回显 节点详情
export const getTemplateNodeDetail = (id: any) => {
  return request.get({ url: `/api/np/progress/node/get/${id}` })
}

// 保存 进度模版
export const saveTemplete = (data: any) => {
  return request.post({ url: '/api/np/progress/save', data })
}

// 更新 进度模版
export const updateTemplete = (data: any) => {
  return request.post({ url: '/api/np/progress/update', data })
}

// 删除 进度模版
export const deleteTemplete = (id: any) => {
  return request.get({ url: `/api/np/progress/delete/${id}` })
}

// 节点列表
export const nodeList = (params: any) => {
  const { data } = params
  return request.formPost({ url: `/api/np/progress/node/list?`, data })
}

// 节点列表
export const nodeAllList = (params: any) => {
  const { data } = params
  return request.formPost({ url: `/api/np/progress/node/listAll?`, data })
}

// 保存 节点
export const saveNode = (data: any) => {
  return request.post({ url: '/api/np/progress/node/save', data })
}

// 更新 节点
export const updateNode = (data: any) => {
  return request.post({ url: '/api/np/progress/node/update', data })
}

// 模板节点审核详情 更新
export const nodeSaveDetail = (data: any) => {
  return request.post({ url: '/api/np/progress/node/saveDetail', data })
}

// 删除 节点
export const deleteNode = (id: any) => {
  return request.get({ url: `/api/np/progress/node/delete/${id}` })
}

// 节点拖动排序
export const dragNodeSort = (data: any) => {
  return request.post({ url: '/api/np/progress/node/sortNode', data })
}
