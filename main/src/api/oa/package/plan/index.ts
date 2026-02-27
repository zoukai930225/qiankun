/*
 * @Date: 2025-01-03 17:03:50
 */
import request from '@/config/axios'

// 列表数据 package
export const getNpList = (params) => {
  return request.get({
    url: `/workflow-api/api/workflow/business/pack/businessEnterprisePlan/pageQuery`,
    params
  })
}

// 商企规划 保存 package
export const saveNp = (data) => {
  return request.post({ url: '/workflow-api/api/workflow/business/pack/businessEnterprisePlan/addBusinessEnterprisePlan', data })
}


// 删除 商企规划 package
export const deleteNpById = (id) => {
  return request.delete({ url: `/workflow-api/api/workflow/business/pack/businessEnterprisePlan/delete/${id}` })
}

// 回显 商企规划 package
export const getNpDetail = (id) => {
  return request.get({ url: `/workflow-api/api/workflow/business/pack/businessEnterprisePlan/detail/${id}` })
}

// 企划进度 package
export const queryProgressBoardByEnterprise = (params) => {
  return request.get({ url: `/workflow-api/api/workflow/business/pack/developmentPlanTask/progressDashboard`, params })
}




// 保存 商企规划 明细
export const saveNpDetail = (data) => {
  return request.post({ url: '/api/np/saveDetail', data })
}



// 属性分页查询
export const getBasicAttribute = (params) => {
  return request.get({ url: `/basicAttribute/queryByCode`, params })
}





// 企划审核
export const enterpriseExamine = (data) => {
  return request.post({ url: `/api/np/enterpriseExamine`, data })
}

