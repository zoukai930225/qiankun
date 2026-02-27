import request from '@/config/axios'

export interface BiBilityAuthorityListParam {
  page?: number
  size?: number
  name?: string
  dept?: string
}

// BI个人责权列表查询接口
export const getBiResponsibilityAuthorityList = (params: BiBilityAuthorityListParam) => {
  return request.get({ url: '/api/biResponsibilityAuthority/list', params })
}

// BI个人责权查看接口
export const biResponsibilityAuthorityInfo = (id: string) => {
  return request.get({ url: `/api/biResponsibilityAuthority/get/${id}` })
}

// BI个人责权复制目标金额接口
export const biResponsibilityAuthorityCopy = () => {
  return request.post({ url: '/api/biResponsibilityAuthority/copy' })
}

// BI个人责权保存接口
export const biResponsibilityAuthoritySave = (data: Object) => {
  return request.post({ url: '/api/biResponsibilityAuthority/save', data: data })
}

// BI个人责权个人目标查询

export const biResponsibilityGetPersonalGoals = (name: string) => {
  return request.get({ url: `/api/biResponsibilityAuthority/getPersonalGoals?name=${name}` })
}

// BI个人责权个人目标查询保存
export const biResponsibilitySavePersonalGoals = (data: Object) => {
  return request.post({ url: '/api/biResponsibilityAuthority/savePersonalGoals', data: data })
}
