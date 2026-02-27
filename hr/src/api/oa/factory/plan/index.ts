import request from '@/config/axios'

/** 节点审核 */
/**
 * 
 * @param data {
    fsTaskId 开发任务id
    supplierId 供应商id
    taskDefinitionKey 审核节点code
    auditComment 审核意见
    auditStatus 审核状态 0 拒绝 1 通过
    auditFile 审核附件地址
  }
 * 
 */
export const auditSupplierFlow = (data) => {
  return request.post({ 
    url: `/workflow-api/api/workflow/business/factorySecondary/supplierFlow/audit`,
    data
  })
}

/** 节点审核 */

//  产品计划列表
export const getProductPlanList = (params) => {
  return request.get({ 
    url: `/workflow-api/api/workflow/business/factorySecondary/supplierFlow/productPlan/pageList`,
    params
  })
}

// 采购主管分配
export const assignPurchaseDirector = (data) => {
  return request.post({ 
    url: `/workflow-api/api/workflow/business/factorySecondary/supplierFlow/purchaseDirector/assign`,
    data
  })
}

// 下单人员分配
export const assignOrderPersonnel = (data) => {
  return request.post({ 
    url: `/workflow-api/api/workflow/business/factorySecondary/supplierFlow/orderPersonnel/assign`,
    data
  })
}

// 采购信息填写
export const fillPurchaseInfo = (data) => {
  return request.post({ 
    url: `/workflow-api/api/workflow/business/factorySecondary/supplierFlow/purchaseInfo/fill`,
    data
  })
}

// 采购信息详情
export const getPurchaseInfo = (params) => {
  return request.get({ 
    url: `/workflow-api/api/workflow/business/factorySecondary/supplierFlow/purchasingInfo/detail`,
    params
  })
}

// 产品计划进度看板 节点
export const getProgressDashboard = (params) => {
  return request.get({ 
    url: `/workflow-api/api/workflow/business/factorySecondary/supplierFlow/productPlan/progressDashboard`,
    params
  })
}

// 查询当前供应商任务下的详细数据
export const querySupplierTaskDetail = (fsTaskId,supplierId) => {
  return request.get({ 
    url: `/workflow-api/api/workflow/business/factorySecondary/supplierMapping/querySupplierTaskDetail/${fsTaskId}/${supplierId}`,
  })
}

// 查询节点信息
export const queryNodeDetail = (params) => {
  return request.get({ 
    url: `/workflow-api/api/workflow/business/factorySecondary/supplierMapping/queryNodeDetail`,
    params
  })
}

// 查询详情
export const queryDetail = (fsTaskId,supplierId) => {
  return request.get({ 
    url: `/workflow-api/api/workflow/business/factorySecondary/supplierMapping/queryDetail/${fsTaskId}/${supplierId}`,
  })
}

/** 产前样相关接口 */

//产前样信息查询, 查询新品的产前样颜色尺码
export const queryPrenatalSampleList = (params) => {
  return request.get({ 
    url: `/workflow-api/api/workflow/business/factorySecondary/supplierFlow/prenatalSample/list`,
    params
  })
}

//工厂二开产前样操作记录查询
export const getOperateList = (data) => {
  return request.post({ 
    url: `/workflow-api/api/workflow/business/factorySecondary/supplierFlow/prenatalSample/getOperateList`,
    data
  })
}

// 查询齐色错码进度
export const queryPrenatalSampleProgress = (params) => {
  return request.get({ 
    url: `/workflow-api/api/workflow/business/factorySecondary/supplierFlow/prenatalSample/queryProgress`,
    params
  })
}

// 产前样提交
export const submitPrenatalSample = (data) => {
  return request.post({ 
    url: `/workflow-api/api/workflow/business/factorySecondary/supplierFlow/prenatalSample/submit`,
    data
  })
}

// QA 资质审核
export const qualificationAudit = (data) => {
  return request.post({ 
    url: `/workflow-api/api/workflow/business/factorySecondary/supplierFlow/prenatalSample/examine`,
    data
  })
}

/** 产前样相关接口 */
