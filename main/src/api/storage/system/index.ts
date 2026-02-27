import request from '@/config/axios'

interface GetRes<T = any> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
}

//====================== 人员管理====================
/**
 * 获取人员管理列表
 */
export function getPersonalManagementList(params: StorageSystem.PersonalManagement.GetListParams) {
  return request.get<GetRes<StorageSystem.PersonalManagement.ListItem>>({
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/staff/pageQuery',
    url: '/api/staff/pageQuery',
    params
  })
}

/**
 * 获取人员详情
 */
export function getPersonDetail(id: string) {
  return request.get<StorageSystem.PersonalManagement.ListItem>({
    // url: `http://127.0.0.1:4523/m1/4344737-3988140-default/api/staff/detail/${id}`
    url: `/api/staff/detail/${id}`
  })
}

/**
 * 修改人员信息
 */
export function updatePersonInfo(data: StorageSystem.PersonalManagement.UpdateInfoParams) {
  return request.postOriginal({
    url: '/api/staff/update',
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/staff/update',
    data
  })
}

/**
 * 获取工种列表
 */
export function getRolesMasks() {
  return request.get<StorageSystem.PersonalManagement.RolesMaskItem[]>({
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/staff/rolesMasks'
    url: '/api/staff/rolesMasks'
  })
}
