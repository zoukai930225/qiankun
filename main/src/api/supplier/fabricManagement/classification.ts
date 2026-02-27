import request from '@/config/axios'

// http://192.168.88.113:7081/api/scFabricClass/add 面料库分类新增
export function addFabricClassification(data: { name: string }) {
  return request.post({
    url: '/api/scFabricClass/add',
    data,
    showLoading: true
  })
}

// http://192.168.88.113:7081/api/scFabricClass/page 面料库分类分页查询
export function getFabricClassificationPage(data: { page: number; pageSize: number }) {
  return request.post({
    url: '/api/scFabricClass/page',
    data
  })
}

// http://192.168.88.113:7081/api/scFabricClass/{id} 面料库分类单条查询
export function getFabricClassificationDetail(id: string) {
  return request.get({
    url: `/api/scFabricClass/${id}`
  })
}

// http://192.168.88.113:7081/api/scFabricClass/edit 面料库分类编辑
export function editFabricClassification(data: { id: string; name: string }) {
  return request.post({
    url: '/api/scFabricClass/edit',
    data,
    showLoading: true
  })
}

// http://192.168.88.113:7081/api/scFabricClass/deleteById 面料库分类删除
export function deleteFabricClassification(id: string) {
  return request.delete({
    url: `/api/scFabricClass/deleteById?id=${id}`
  })
}

// http://192.168.88.113:7081/api/scFabricClass/importScFabricClass 面料库分类导入
export function importFabricClassification(data: FormData, config: any = {}) {
  return request.formPostOriginal({
    url: '/api/scFabricClass/importScFabricClass',
    data,
    ...config
  })
}
