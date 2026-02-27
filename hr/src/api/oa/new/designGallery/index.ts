/*
 * @Date: 2025-01-03 17:03:50
 */
import request from '@/config/axios'

// 设计图列表
export const getDesignPictureList = (data) => {
  return request.post({ url: `/api/np/design/picture/list`, data })

  // const { page, size, data } = params
  // return request.formPost({
  //   url: `/api/np/design/picture/list?page=${page}&size=${size}`,
  //   data
  // })
}

// 列表数据
export const getNpList = (params) => {
  const { page, size, data } = params
  return request.formPost({
    url: `/api/np/list?page=${page}&size=${size}`,
    data
  })
}

// 查询柱状图信息
export const getDesignPictureColumn = (params) => {
  const { page, size, data } = params
  return request.formPost({
    url: `/api/np/design/picture/getColumn?page=${page}&size=${size}`,
    data
  })
}

// 设计图 审核
export const designExamine = (data) => {
  return request.post({ url: `/api/np/design/picture/examine`, data })
}

//设计图库新增获取基本信息
export const getDesignBasicInfo = (params?) => {
  return request.get({ url: `/api/np/developmentPlan/getDesignBasicInfo`, params })
}

// 开发计划,列表
export const getDevelopmentPlanList = (data) => {
  return request.post({ url: '/api/np/developmentPlan/pageList', data })

  // const { page, size, data } = params
  // return request.formPost({
  //   url: `/api/np/developmentPlan/pageList?page=${page}&pageSize=${size}`,
  //   data
  // })
}

//设计图 保存
export const saveDesign = (data) => {
  return request.post({ url: `/api/np/design/picture/save`, data })
}

// 回显 设计图
export const getDesignDetailById = (id) => {
  return request.get({ url: `/api/np/design/picture/get/${id}` })
}

//设计图 保存 编辑
export const updateDesign = (data) => {
  return request.post({ url: `/api/np/design/picture/update`, data })
}
//设计图 删除
export const deleteDesignPicture = (id) => {
  return request.get({ url: `/api/np/design/picture/delete/${id}` })
}

//设计图 更新进度
export const updateDesignProgress = (data) => {
  return request.post({ url: `/api/np/design/picture/updateProgress`, data })
}

// 设计图 上架维护
export const onShelfDesign = (data: {}) => {
  return request.post({ url: `/api/np/design/picture/onShelf`, data })
}

// 设计图 选中
export const choosePicture = (data) => {
  return request.post({ url: `/api/np/design/picture/choose`, data })
}

//设计图数量统计
export const getConDesign = (data) => {
  return request.post({ url: `/api/np/design/picture/getCon`, data })

  // const { data } = params
  // return request.formPost({ url: `/api/np/design/picture/getCon`, data })
}

//设计图 样衣上传
export const uploadSample = (data) => {
  return request.post({ url: `/api/np/design/picture/sample`, data })
}

//供应商终审查询名单
export const getSupplierList = () => {
  return request.get({ url: `/api/np/plan/queryAdoptSupplier` })
}

//设计图颜色查询
export const queryDesignProductColor = () => {
  return request.get({ url: `/api/np/design/picture/queryColor?pCode=np_design_product_color` })
}

//打样进度列表
export const sampleProgressList = (data) => {
  return request.post({ url: `/api/np/design/picture/sampleProgressList`, data })
}

//打样进度新增

export const sampleProgressSave = (data) => {
  return request.post({ url: `/api/np/design/picture/sampleProgressSave`, data })
}

//打样进度编辑

export const sampleProgressUpdate = (data) => {
  return request.post({ url: `/api/np/design/picture/sampleProgressUpdate`, data })
}

//打样进度删除

export const sampleProgressDelete = (data) => {
  return request.post({ url: `/api/np/design/picture/sampleProgressDelete`, data })
}

//保存运营主管分配信息
export const updateOperateManageInfo = (data) => {
  return request.post({ url: `/api/np/design/picture/distributeOperateManager`, data })
}

// 保存采购主管分配信息
export const updateDistributeProcurementManager = (data) => {
  return request.post({ url: `/api/np/design/picture/distributeProcurementManager`, data })
}

//保存设计报告
export const updateSaveReport = (data) => {
  return request.post({ url: `/api/np/design/picture/saveReport`, data })
}

//根据设计图id 查询打样进度详情
export const getSampleProgressDetail = (params) => {
  return request.get({ url: `/api/npSupplierAuditStatus/list`, params })
}

//备注信息新增
export const addRemark = (data) => {
  return request.post({ url: `/api/npSupplierAuditStatus/addRemark`, data })
}

//色卡信息新增
export const addColorCard = (data) => {
  return request.post({ url: `/api/npSupplierAuditStatus/addColorCard`, data })
}

//色卡信息删除
export const deleteColorCard = (id) => {
  return request.get({ url: `/api/npSupplierAuditStatus/deleteColorCard/${id}` })
}

// 试穿结果确认
export const confirmTrialResult = (data) => {
  return request.post({ url: `/api/npSupplierAuditStatus/confirmTrialResult`, data })
}
//报价核价
export const confirmQuotePrice = (data) => {
  return request.post({ url: `/api/npSupplierAuditStatus/confirmQuotePrice`, data })
}
// 报价核价回显
export const getSupplierAuditStatusInfo = (params) => {
  return request.post({ url: `/api/npSupplierAuditStatus/getSupplierAuditStatusInfo`, params })
}
// 重新报价核价
export const updateQuotePrice = (data) => {
  return request.post({ url: `/api/npSupplierAuditStatus/updateQuotePrice`, data })
}

//齐色样上传
export const confirmColorSample = (data) => {
  return request.post({ url: `/api/npSupplierAuditStatus/confirmColorSample`, data })
}
//删除备注
export const deleteRemark = (id) => {
  return request.get({ url: `/api/npSupplierAuditStatus/deleteRemark/${id}` })
}

//通过图库查询重新匹配供应商
export const queryReMatchSupplierList = (params) => {
  return request.get({ url: `/api/npSupplierAuditStatus/queryReMatchSupplierList`, params })
}
//淘汰供应商
export const eliminateSupplier = (data) => {
  return request.post({ url: `/api/npSupplierAuditStatus/eliminateSupplier`, data })
}
// 重新匹配供应商
export const reMatchSupplier = (data) => {
  return request.post({ url: `/api/npSupplierAuditStatus/reMatchSupplier`, data })
}

/** 匹配供应商 */
// 查询图库保存的供应商信息
export const queryMatchSupplier = (params) => {
  return request.get({
    url: `/api/npSupplierAuditStatus/matchSupplier/list`,
    params
  })
}

// 匹配供应商 新增/更新
export const updateMatchSupplier = (data) => {
  return request.post({
    url: `/api/npSupplierAuditStatus/matchSupplier/saveOrSubmit`,
    data
  })
}

// 定品资料查询
export const getConfirmProductInfo = (id) => {
  return request.get({ url: `/api/np/plan/getConfirmProductInfo/${id}` })
}

// QA审核
export const confirmQAAuditSample = (data) => {
  return request.post({
    url: `/api/npSupplierAuditStatus/qaExamine`,
    data
  })
}

// 重新提交
export const confirmReUpload = (data) => {
  return request.post({
    url: `/api/npSupplierAuditStatus/reUpload`,
    data
  })
}

//查询erp资料
export const getErpInfo = (id, code) => {
  return request.get({
    url: `/api/np/prenatal/sample/getErpInfo?designPictureGodownId=${id}`
  })
}
// 保存erp信息
export const saveErpInfo = (data) => {
  return request.post({
    url: `/api/np/prenatal/sample/saveErpInfo`,
    data
  })
}

// 运营信息填写
export const updateSkuInfo = (data) => {
  return request.post({
    url: `/api/np/prenatal/sample/updateSkuInfo`,
    data
  })
}

// 买手款 详情回显匹配供应商和报价核价数据
export const queryNpQuoteVerification = (params) => {
  return request.get({ url: `/api/np/design/picture/queryNpQuoteVerification`, params })
}

// 工艺单保存
export const workmanshipUpload = (data) => {
  return request.post({
    url: `/api/np/design/picture/workmanshipUpload`,
    data
  })
}

// 导出下单明细
export const exportSkuInfo = (params) => {
  return request.download({
    url: '/api/np/prenatal/sample/exportSkuInfo',
    params
  })
}
