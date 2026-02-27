import request from '@/config/axios'

// 列表数据
export const getDevelopList = (data) => {
  return request.post({ url: '/api/np/developmentPlan/pageList', data })

  // const { page, pageSize, data } = params
  // return request.formPost({
  //   url: `/api/np/developmentPlan/pageList?page=${page}&pageSize=${pageSize}`,
  //   data
  // })
}

// 回显 开发任务

export const getDevelopPlanDetail = (id) => {
  return request.get({
    url: `/api/np/developmentPlan/get/${id}`
  })
}

export const getNewPlanlOperaionDetail = (id) => {
  return request.get({
    url: `/api/np/plan/get/${id}`
  })
}

// 更新开发计划
export const updateDevelop = (data) => {
  return request.post({ url: '/api/np/developmentPlan/update', data })
}

// 更新开发计划1
export const saveOperationInfo = (data) => {
  return request.post({ url: '/api/np/plan/saveOperationInfo', data })
}

// 更新设计师买手信息
export const updateDevelopDistributeDesigner = (data) => {
  return request.post({ url: '/api/np/developmentPlan/distributeDesigner', data })
}

// 供应链主管分配选供专员
export const updateDistributeChosenSupplier = (data) => {
  return request.post({ url: '/api/np/developmentPlan/distributeChosenSupplier', data })
}
// 更新企划管理进度标识
export const updateDevelopManageProgress = (data) => {
  return request.post({ url: '/api/np/updateProgress', data })
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

//企划信息
export const developmentPlanNewPlanInfo = (devPlanId) => {
  return request.get({ url: `/api/np/developmentPlan/newPlan?devPlanId=${devPlanId}` })
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

// 产品计划列表 新
export const getProductPlanList = (data) => {
  return request.post({ url: `/api/np/plan/list`, data })

  // const { page, size, data } = params
  // return request.formPost({
  //   url: `/api/np/plan/list?page=${page}&pageSize=${size}`,
  //   data
  // })
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

// 使用设计图id查询绑定各节点
export const getPlanNodeByDesignId = (params) => {
  return request.get({ url: `/api/np/plan/queryNodeData`, params })
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
// 节点提交

export const submitUpdate = (data) => {
  return request.post({ url: `/api/np/plan/submitUpdate`, data })
}

export const auditSuccessUpdate = (data) => {
  return request.post({ url: `/api/np/plan/successUpdate`, data })
}

export const confirmProductSuccess = (data) => {
  return request.post({ url: `/api/np/plan/confirmProductSuccess`, data })
}

// 产研信息修改审核发送飞书
export const sendFeiShuMessageForProduct = (data) => {
  return request.post({ url: `/api/np/examine/sendNpCard`, data })
}

// 开发任务进度
export const queryProgressBoardByDevPlan = (id) => {
  return request.get({ url: `/api/np/plan/queryProgressBoardByDevPlan?developPlanId=${id}` })
}

// 查询任务保存的供应商信息
export const getNpSupplierMappingList = (params) => {
  return request.get({ url: `/api/npSupplierMapping/list`, params })
}

// 供应商 保存数据
export const npSupplierSaveOrSubmit = (data) => {
  return request.post({ url: `/api/npSupplierMapping/saveOrSubmit`, data })
}

// 供应商 保存数据
export const npSupplierDelete = (id) => {
  return request.post({ url: `/api/npSupplierMapping/delete/${id}` })
}
// 产前样详情查询列表
export const getSampleList = (params) => {
  return request.get({ url: `/api/np/prenatal/sample/list`, params })
}

// 产前样提交
export const submitPrenatalSample = (data) => {
  return request.post({ url: `/api/np/prenatal/sample/submit`, data })
}
//产前样操作记录查询
export const getOperateList = (data) => {
  return request.post({ url: `/api/np/prenatal/sample/operate/getOperateList`, data })
}

//进度查询
export const queryProgress = (params) => {
  return request.get({ url: `/api/np/prenatal/sample/queryProgress`, params })
}

// 产前样审核
export const prenatalSampleExamine = (data) => {
  return request.post({ url: `/api/np/prenatal/sample/examine`, data })
}

// 商企回收
export const businessRecycleSubmit = (data) => {
  return request.post({ url: `/api/np/plan/saveRecycleInfo`, data })
}

// 商企回收列表
export const getBusinessRecycleList = (data) => {
  return request.post({ url: '/api/np/plan/recyclePageList', data })
}
// 更新版师
export const updatePatternMaker = (data) => {
  return request.post({ url: '/api/np/developmentPlan/distributePatternMaker', data })
}

// 人员分配详情
export const getDistributeInfo = (id) => {
  return request.get({
    url: `/api/np/developmentPlan/getDistributeInfo/${id}`
  })
}

// 保存人员分配信息
export const saveDistributeInfo = (data) => {
  return request.post({
    url: `/api/np/developmentPlan/saveDistributeInfo`,
    data
  })
}
