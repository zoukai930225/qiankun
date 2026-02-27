import request from '@/config/axios'

// 列表查询
export const getSudokuSetList = (params) => {
  return request.get({ url: '/api/otr/nine-grid/list', params })
}
// 九宫格保存
export const saveSudokuSet = (data: any) => {
  return request.post({ url: '/api/otr/nine-grid/create', data })
}

// 九宫格详情
export const getSudokuSetDetail = (id: any) => {
  return request.get({ url: `/api/otr/nine-grid/${id}` })
}
// 九宫格更新
export const updateSudokuSet = (data: any) => {
  return request.post({ url: '/api/otr/nine-grid/update', data })
}
// 九宫格删除
export const deleteSudokuSet = (id: any) => {
  return request.post({ url: `/api/otr/nine-grid/delete/${id}` })
}
// 九宫格明细属性查询
export const getSudokuSetDetailList = (data) => {
  return request.post({ url: '/api/otr/nine-grid-detail/list', data })
}

// 九宫格明细属性更新
export const updateSudokuSetDetail = (data: any) => {
  return request.post({ url: '/api/otr/nine-grid-detail/update', data })
}
// 九宫格明细属性根据id查询
export const getSudokuSetDetailById = (id: any) => {
  return request.get({ url: `/api/otr/nine-grid-detail/${id}` })
}
