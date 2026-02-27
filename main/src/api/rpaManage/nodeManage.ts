import request from '@/config/axios'

// 查询列表
export const getNodeManageList = (params) => {
  return request.get({ url: '/api/third/yingDaoRobot/pageList', params })
}

// 删除
export const deleteNodeManage = (id: string) => {
  return request.post({
    url: `/api/third/yingDaoRobot/delete/${id}`
  })
}
// 获取详情
export const getNodeManageDetail = (id) => {
  return request.post({ url: `/api/third/yingDaoRobot/get/${id}` })
}
// 新增
export const saveNodeManage = (data) => {
  return request.post({ url: '/api/third/yingDaoRobot/save', data: data })
}

// 编辑
export const updateNodeManage = (data) => {
  return request.post({ url: '/api/third/yingDaoRobot/update', data: data })
}

// 同步企业节点
export const refreshNodeManage = () => {
  return request.post({ url: '/api/third/yingDaoRobot/refreshApi' })
}
