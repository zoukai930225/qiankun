import request from '@/config/axios'

interface GetRes<T = any> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
}

/** 获取列表 */
export function getWhInspectionSalary(params: StorageSalary.Examien.GetListParams) {
  return request.get<GetRes<StorageSalary.Examien.ListItem>>({
    url: '/api/whSalary/page',
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/whSalary/page',
    params
  })
}

/** 通过id查询数据详情 */
export function getWhInspectionSalaryById(params: { id: string; rolesMask: string }) {
  return request.get<StorageSalary.Examien.Detail>({
    url: `/api/whSalary/get`,
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/whSalary/get',
    params
  })
}

/** 查询产品明细 */
export function getInfoDetail(params: StorageSalary.Examien.GetInfoDetailParams) {
  return request.get<GetRes<StorageSalary.Examien.InforDetailItem>>({
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/whSalary/pageDetail',
    url: '/api/whSalary/pageDetail',
    params
  })
}

/** 保存 */
export function updateWhInspectionSalary(data: StorageSalary.Examien.UpdateParams[]) {
  return request.postOriginal({
    url: '/api/whSalary/updateAccountingMethod',
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/whSalary/updateAccountingMethod',
    data
  })
}

/** 同步数据 */
export function syncWhInspectionSalary(data: { dataDate: string; rolesMask: string }) {
  return request.postOriginal({
    url: '/api/whSalary/syncData',
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/whSalary/syncData',
    data
  })
}

/** 品控--数据导入 */
export function importData(data: FormData, params?: { rolesMask: string }) {
  return request.formPostOriginal({
    url: '/api/whSalary/import',
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/whSalary/import',
    data,
    params
  })
}

/** 获取当日薪资 */
export function getDailySalary(params: { id: string }) {
  return request.get<StorageSalary.Examien.ListItem>({
    url: '/api/whSalary/detailDailySalary',
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/whSalary/detailDailySalary',
    params
  })
}

/** 查询分配人员 */
export function getPersonal(params: { rolesMask: string; dataDate: string; userName: string }) {
  return request.get({
    url: '/api/whSalary/listAllocationPerson',
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/whSalary/listAllocationPerson',
    params
  })
}

/** 拦截件分配 */
export function updateAllocationIntercept(data: {
  dataDate: string
  userId: string
  quantity: number
}) {
  return request.postOriginal({
    url: '/api/whSalary/allocationIntercept',
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/whSalary/allocationIntercept',
    data
  })
}

/** 获取拦截件详情 */
export function getAllocationInterceptDetail(params: { dataDate: string }) {
  return request.get<{ quantity: number }>({
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/whSalary/detailAllocationIntercept',
    url: '/api/whSalary/detailAllocationIntercept',
    params
  })
}
