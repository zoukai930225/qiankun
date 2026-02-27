//渠道
import request from '@/config/axios'

const prefix = '/api/bi/v1/team';


// 团队总览-团队列表
export const getTeamList = (params) => {
  return request.get({ url: `${prefix}/overview/link/teamList`, params })
}

// 团队总览-链接列表   
export const getLinkList = (params) => {
  return request.get({ url: `${prefix}/overview/link/linkList`, params })
}

//团队总览-链接列表-导出   
export const linkListExport = (params) => {
  return request.downloadPost({
    url: `${prefix}/overview/link/linkList/export`,
    params
  })
}

// 团队总览-个人PK  
export const getPersonalPKList = (params) => {
  return request.get({ url: `${prefix}/overview/personalPK`, params })
}

//团队总览-个人PK-导出    
export const personalPKListExport = (params) => {
  return request.downloadPost({
    url: `${prefix}/overview/personalPK/export`,
    params
  })
}

// 团队总览-店铺管理-团队列表
export const getShopTeamList = (params) => {
  return request.get({ url: `${prefix}/overview/store/teamList`, params })
}

// 团队总览-店铺管理--链接列表
export const getShopLinkList = (params) => {
  return request.get({ url: `${prefix}/overview/store/linkList`, params })
}

//团队总览-店铺管理--链接列表-导出    
export const shopLinkListExport = (params) => {
  return request.downloadPost({
    url: `${prefix}/overview/store/linkList/export`,
    params
  })
}

// 团队详情-负责的链接
export const getManageLink = (params) => {
  return request.get({ url: `${prefix}/detail/manageLink`, params })
}

//团队详情-负责的链接-导出    
export const manageLinkExport = (params) => {
  return request.downloadPost({
    url: `${prefix}/detail/manageLink/export`,
    params
  })
}
// 团队详情-负责的店铺
export const getManageStore = (params) => {
  return request.get({ url: `${prefix}/detail/manageStore`, params })
}

//团队详情-负责的店铺-导出    
export const manageStoreExport = (params) => {
  return request.downloadPost({
    url: `${prefix}/detail/manageStore/export`,
    params
  })
}

// 团队详情-用户信息
export const getDetailUserInfo = (params) => {
  return request.get({ url: `${prefix}/detail/userInfo`, params })
}