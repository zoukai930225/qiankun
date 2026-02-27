import request from '@/config/axios'

export const multipleUploadUrl = '/api/oss/upload/batch'

export const multipleUpload = (data: any, config: any = {}) => {
  return request.formPost({ url: multipleUploadUrl, data, ...config })
}

export const deleteOss = (data: any) => {
  return request.post({ url: '/api/oss/delete', data })
}

// /api/oss/delete/batch
export const deleteOssBatch = (data: any) => {
  return request.post({ url: '/api/oss/delete/batch', data })
}

export const commonUpload = (data: any) => {
  return request.upload({ url: '/api/ossInfo/upload', data })
}
