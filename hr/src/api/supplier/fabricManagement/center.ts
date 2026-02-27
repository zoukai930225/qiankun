import request from '@/config/axios'

// http://192.168.88.113:7081/api/scFabricCenter/add 面料中心新增
export function addFabricCenter(data: any) {
  return request.post({
    url: '/api/scFabricCenter/add',
    data,
    showLoading: true
  })
}

// http://192.168.88.113:7081/api/scFabricCenter/deleteById 面料中心删除
export function deleteFabricCenter(id: string) {
  return request.delete({
    url: `/api/scFabricCenter/deleteById?id=${id}`
  })
}

// http://192.168.88.113:7081/api/scFabricCenter/edit 面料中心编辑
export function editFabricCenter(data: any) {
  return request.post({
    url: '/api/scFabricCenter/edit',
    data,
    showLoading: true
  })
}

// http://192.168.88.113:7081/api/scFabricCenter/{id} 面料中心单条查询
export function getFabricCenterDetail(id: string) {
  return request.get({
    url: `/api/scFabricCenter/${id}`,
    showLoading: true
  })
}

// http://192.168.88.113:7081/api/scFabricCenter/page 面料中心分页
export function getFabricCenterPage(data: any) {
  return request.post({
    url: '/api/scFabricCenter/page',
    data
  })
}

// http://192.168.88.113:7081/api/scFabricClass/selectlist 面料中心添加时分类下拉款
export function getFabricClassSelectlist(data: any) {
  return request.post({
    url: '/api/scFabricClass/selectlist',
    data
  })
}
