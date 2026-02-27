import request from '@/config/axios'

interface GetRes<T = any> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
}

export function uploadFiles(data: FormData) {
  return request.formPostOriginalDownload({ url: '/api/restockegoods/handmovementexport', data })
}
