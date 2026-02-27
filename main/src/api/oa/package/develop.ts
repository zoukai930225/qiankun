import request from '@/config/axios'

// 列表数据 package
export const getDevelopList = (params) => {
  return request.get({
    url: `/workflow-api/api/workflow/business/pack/developmentPlanTask/pageQuery`,
    params
  })
}

//  分配设计师 package
export const updateDistributionDesigner = (data) => {
  return request.post({ url: '/workflow-api/api/workflow/business/pack/developmentPlanTask/distributionDesigner', data })
}
// 供应链主管分配选供专员
export const updateDistributeChosenSupplier = (data) => {
  return request.post({ url: '/workflow-api/api/workflow/business/pack/developmentPlanTask/distributeChosenSupplier', data })
}

// 更新企划管理进度标识 package
export const updateDevelopManageProgress = (enterprisePlanId) => {
  return request.get({ url: `/workflow-api/api/workflow/business/pack/businessEnterprisePlan/updateProgress/${enterprisePlanId}` })
}

// 更新企划管理进度标识 package new
export const updateDevelopManageProgressNew = (taskId) => {
  return request.get({ url: `/workflow-api//api/workflow/business/pack/developmentPlanTask/updateProgress/${taskId}` })
}

// 企划进度 package
export const queryProgressBoardByEnterprise = (params) => {
  return request.get({ url: `/workflow-api/api/workflow/business/pack/developmentPlanTask/progressDashboard`, params })
}

//企划信息 package
export const developmentPlanNewPlanInfo = (devPlanId) => {
  return request.get({ url: `/workflow-api/api/workflow/business/pack/developmentPlanTask/detail/${devPlanId}` })
}

// 保存或暂存供应商 package status 状态：0 暂存，1 提交
export const npSupplierSaveOrSubmit = (data) => {
  return request.post({ url: `/workflow-api/api/workflow/business/pack/supplier/saveOrSubmit`, data })
}

// 查询任务保存的供应商信息
export const getNpSupplierMappingList = (params) => {
  return request.get({ url: `/workflow-api/api/workflow/business/pack/supplier/list`, params })
}

// 产品计划列表 新 package
export const getProductPlanList = (params) => {
  return request.get({
    url: `/workflow-api/api/workflow/business/pack/productPlan/pageQuery`,
    params
  })
}

// 使用设计图id查询绑定各节点 package
export const getPlanNodeByDesignId = (params) => {
  return request.get({ url: `/workflow-api/api/workflow/business/pack/productPlan/progressDashboard`, params })
}

// 节点提交package
export const submitUpdate = (data) => {
  return request.post({ url: `/workflow-api/api/workflow/business/pack/productPlan/audit`, data })
}




// 回显 开发任务

export const getDevelopPlanDetail = (id) => {
  return request.get({
    url: `/api/np/developmentPlan/get/${id}`
  })
}

// 更新开发计划
export const updateDevelop = (data) => {
  return request.post({ url: '/api/np/developmentPlan/update', data })
}



// 更新开发计划进度标识
export const updateDevelopProgress = (data) => {
  return request.post({ url: '/api/np/developmentPlan/updateProgress', data })
}

// 竞品列表
export const getCompetorsList = (params) => {
  return request.get({ url: '/api/np/developmentPlan/getCompetitiveList', params })
}

// 竞品 - 新增
export const addCompetor = (data) => {
  return request.post({ url: '/api/np/developmentPlan/saveCompetitiveInformation', data })
}
// 竞品 - 更新
export const updateCompetitive = (data) => {
  return request.post({ url: '/api/np/developmentPlan/updateCompetitive', data })
}

// 竞品 - 删除
export const delCompetor = (data) => {
  return request.post({ url: `/api/np/developmentPlan/deleted?id=${data.id}` })
}



// 全部进度模板
export const getProgressList = () => {
  const data = { page: 1, size: 99999 }
  return request.post({ url: `/api/np/progress/list`, data })
}
// 开发计划对应进度模版
export const getProgressTemplate = (id) => {
  return request.get({ url: `/api/np/developmentPlan/getProgressTemplate?id=${id}` })
}
// 更新进度模版
export const updateTemplate = (data) => {
  return request.post({ url: `/api/np/developmentPlan/updateTemplate`, data })
}

// 根据模板查询节点
export const getNodeByTemplate = (params: any) => {
  const { data } = params
  return request.formPost({
    url: `/api/np/progress/node/list?`,
    data
  })
}

// 产品计划列表数据
export const getProductPageList = (params) => {
  const { page, size, data } = params
  return request.formPost({
    url: `/api/np/developmentPlan/getProductPageList?page=${page}&pageSize=${size}`,
    data
  })
}

// 获取节点信息
export const getProductPlanNodeList = (id) => {
  return request.get({ url: `/api/np/developmentPlan/productPlanNodeList?devPlanId=${id}` })
}
// 更新节点
export const updatePlanNode = (data) => {
  return request.post({ url: `/api/np/developmentPlan/updatePlanNode`, data })
}



// 更改产品计划状态 新
export const updateProductPlanStatus = (params) => {
  const { status, data } = params
  return request.post({ url: `/api/np/plan/editStatus?status=${status}`, data })
}

// 开发计划对应进度模版 新 根据模版id获取节点
export const getProductPlanNodeByTemplate = (params) => {
  return request.get({ url: `/api/np/developmentPlan/getProgressTemplate`, params })
}

// 保存模版名称以及模版id 新
export const saveTemplateName = (data) => {
  return request.post({ url: `/api/np/plan/saveTemplateIdAndName`, data })
}

// 更新计划对应模板 新
export const updatePlanTemplate = (data) => {
  return request.post({ url: `/api/np/plan/saveNode`, data })
}


// 更新节点数据
export const updatePlanNodeData = (data) => {
  return request.post({ url: `/api/np/plan/update`, data })
}

// 节点发送飞书信息 新
export const sendFeiShuMessage = (data) => {
  return request.post({ url: `/api/np/plan/sendNPCard`, data })
}

// 开发任务 新 流程指派发送飞书信息
export const sendFeiShuMessageForTask = (params) => {
  return request.get({ url: `/api/np/developmentPlan/sendNPCard`, params })
}

// 节点拒绝更新
export const refuseUpdate = (data) => {
  return request.post({ url: `/api/np/plan/refuseUpdate`, data })
}


// 产研信息修改审核发送飞书
export const sendFeiShuMessageForProduct = (data) => {
  return request.post({ url: `/api/np/examine/sendNpCard`, data })
}

// 开发任务进度
export const queryProgressBoardByDevPlan = (id) => {
  return request.get({ url: `/api/np/plan/queryProgressBoardByDevPlan?developPlanId=${id}` })
}
