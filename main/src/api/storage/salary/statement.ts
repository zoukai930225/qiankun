import request from '@/config/axios'

interface GetRes<T = any> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
}

export function getWhSalaryReport(params: StorageSalary.Statement.GetListParams) {
  return request.get<GetRes<StorageSalary.Statement.ListItem>>({
    url: '/api/whSalaryReport/page',
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/whSalaryReport/page',
    params
  })
}

export function exportData(params: StorageSalary.Statement.GetListParams) {
  return request.download({
    url: '/api/whSalaryReport/export',
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/whSalaryReport/export',
    params
  })
}
