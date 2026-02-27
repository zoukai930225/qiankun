import request from '@/config/axios'
import {Record,userId} from './problemContact'
 import {  BaseResponse,PaginatedResponse} from '@/types/response'

type  queryParams = {
  page: number,
  size: number,
  handleDept: string,
  category: string,
  type: string,
  directorId: string
}

// 列表分页查询
export const addConfig = (data) => {
  return request.post<BaseResponse<Record>>({ url: '/api/csProblemContactPersonConfig/add', data })
}

export const configList = (params:queryParams) => {
  return request.post<PaginatedResponse<Record>>({ url: '/api/csProblemContactPersonConfig/page', params })
}

export const getConfigById = (id) => {
  return request.get<Partial<Record>>({ url: `/api/csProblemContactPersonConfig/${id}` })
}

export const editConfig = (data) => {
  return request.post<BaseResponse<Record>>({ url: '/api/csProblemContactPersonConfig/edit', data })
}

export const deleteConfigById = (params:{id:string}) => {
  return request.delete<BaseResponse>({ url: '/api/csProblemContactPersonConfig/deleteById', params })
}