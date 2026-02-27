import request from '@/config/axios'

//查询工厂二开货品编码信息
export const getProductCodeList = () => {
  return request.get({
    url: `/workflow-api/api/workflow/business/factorySecondary/devTask/productCode/list`,
  })
}

// 新增工厂二开任务
export const addDevTask = (data) => {
  return request.post({
    url: `/workflow-api/api/workflow/business/factorySecondary/devTask/add`,
    data
  })
}

// 更新工厂二开任务
export const updateDevTask = (data) => {
  return request.post({
    url: `/workflow-api/api/workflow/business/factorySecondary/devTask/update`,
    data
  })
}

// 删除工厂二开任务
export const deleteDevTask = (id) => {
  return request.get({
    url: `/workflow-api/api/workflow/business/factorySecondary/devTask/delete/${id}`,
  })
}

// 分页查询工厂二开开发任务的列表
export const getDevTaskList = (params) => {
  return request.get({
    url: `/workflow-api/api/workflow/business/factorySecondary/devTask/list`,
    params
  })
}

/** 匹配供应商相关接口 */

// 查询任务保存的供应商信息
export const getSupplierMappingList = (fsTaskId) => {
  return request.get({
    url: `/workflow-api/api/workflow/business/factorySecondary/supplierMapping/list/${fsTaskId}`,
  })
}

//匹配供应商，如果存在则更新，不存在则新增
export const saveOrSubmitSupplier = (data) => {
  return request.post({
    url: `/workflow-api/api/workflow/business/factorySecondary/supplierMapping/saveOrSubmit`,
    data
  })
}

// 查询供应商信息 下拉列表
export const queryAdoptSupplier = (fsTaskId: string) => {
  return request.get({
    url: `/workflow-api/api/workflow/business/factorySecondary/supplierMapping/queryAdoptSupplier/${fsTaskId}`,
  })
}

// 查询当前任务所有的匹配供应商记录列表，附加报价核价记录
export const getSupplierFlowList = (fsTaskId) => {
  return request.get({
    url: `/workflow-api/api/workflow/business/factorySecondary/supplierFlow/list/${fsTaskId}`,
  })
}

/** 匹配供应商相关接口 */

/** 报价核价接口 */

// 报价核价信息保存
export const saveQuoteVerification = (data) => {
  return request.post({
    url: `/workflow-api/api/workflow/business/factorySecondary/supplierFlow/quoteVerification/save`,
    data
  })
}

/** 报价核价接口 */