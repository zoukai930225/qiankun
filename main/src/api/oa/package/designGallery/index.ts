/*
 * @Date: 2025-01-03 17:03:50
 */
import request from '@/config/axios'

// 设计图列表 package
export const getDesignPictureList = (params) => {
  return request.get({
    url: `/workflow-api/api/workflow/business/pack/designGallery/pageQuery`,
    params
  })
}
//设计图库新增获取基本信息 package
export const getDesignBasicInfo = (id) => {
  return request.get({ url: `/workflow-api/api/workflow/business/pack/developmentPlanTask/detail/${id}` })
}

//设计图 保存 package
export const saveDesign = (data) => {
  return request.post({ url: `/workflow-api/api/workflow/business/pack/designGallery/save`, data })
}

//设计图数量统计 package
export const getConDesign = (params) => {
  return request.get({ url: `/workflow-api/api/workflow/business/pack/designGallery/quantity`, params })
}

// 设计图 审核 package
export const designExamine = (data) => {
  return request.post({ url: `/workflow-api/api/workflow/business/pack/designGallery/examine`, data })
}

//设计图 删除 package
export const deleteDesignPicture = (designGalleryId) => {
  return request.delete({ url: `/workflow-api/api/workflow/business/pack/designGallery/delete/${designGalleryId}` })
}

// 回显 设计图 package
export const getDesignDetailById = (designGalleryId) => {
  return request.get({ url: `/workflow-api/api/workflow/business/pack/designGallery/detail/${designGalleryId}` })
}

//设计图 保存 编辑 package
export const updateDesign = (data) => {
  return request.post({ url: `/workflow-api/api/workflow/business/pack/designGallery/edit`, data })
}

//供应商终审查询名单 package
export const getSupplierList = (params) => {
  return request.get({ url: `/workflow-api/api/workflow/business/pack/supplier/queryAdoptSupplier`, params })
}

//根据设计图id 查询打样进度详情package
export const getSampleProgressDetail = (params) => {
  return request.get({ url: `/workflow-api/api/workflow/business/pack/gallerySupplier/list`, params })
}

//备注信息新增package
export const addRemark = (data) => {
  return request.post({ url: `/workflow-api/api/workflow/business/pack/gallerySupplier/addRemark`, data })
}

// 试穿结果确认 package
export const confirmTrialResult = (data) => {
  return request.post({ url: `/workflow-api/api/workflow/business/pack/gallerySupplier/confirmPrintSampleResult`, data })
}

//报价核价package
export const confirmQuotePrice = (data) => {
  return request.post({ url: `/workflow-api/api/workflow/business/pack/gallerySupplier/confirmQuotePrice`, data })
}

//淘汰供应商package
export const eliminateSupplier = (data) => {
  return request.post({ url: `/workflow-api/api/workflow/business/pack/gallerySupplier/eliminateSupplier`, data })
}
//进度维护详情 package
export const getProductDetailById = (designGalleryId) => {
  return request.get({ url: `/workflow-api/api/workflow/business/pack/productPlan/detail/${designGalleryId}` })
}

//设计图 更新进度 package
export const updateDesignProgress = (productPlanId) => {
  return request.get({ url: `/workflow-api/api/workflow/business/pack/productPlan/updateProgress/${productPlanId}` })
}

//进度维护包装资料详情
export const getProductInfoById = (productPlanId) => {
  return request.get({ url: `/workflow-api/api/workflow/business/pack/productPlan/productInfo/${productPlanId}` })
}

//保存包装资料信息
export const updateSaveReport = (data) => {
  return request.post({ url: `/workflow-api/api/workflow/business/pack/productPlan/savePackageInfo`, data })
}

//保存erp资料信息
export const updateDesignErp = (data) => {
  return request.post({ url: `/workflow-api//api/workflow/business/pack/productPlan/saveErpInfo`, data })
}

//保存供需单文件
export const updateSaveReportSingle = (data) => {
  return request.post({ url: `/workflow-api/api/workflow/business/pack/productPlan/saveSupplyDemandFile`, data })
}
// 分配采购负责人
export const updateDistributeProcurementManager = (data) => {
  return request.post({ url: `/workflow-api/api/workflow/business/pack/productPlan/distributionPurchasingManager`, data })
}
// 保存采购信息
export const updateDesignSingle = (data) => {
  return request.post({ url: `/workflow-api/api/workflow/business/pack/productPlan/savePurchaseInfo`, data })
}

export const getErpInfoById = (productPlanId) => {
  return request.get({ url: `/workflow-api/api/workflow/business/pack/productPlan/erpInfo/${productPlanId}` })
}

//进度维护供需计划详情
export const getSupplyDemandById = (productPlanId) => {
  return request.get({ url: `/workflow-api/api/workflow/business/pack/productPlan/supplyDemand/${productPlanId}` })
}

// 进度维护采购主管分配详情
export const getPurchaseManagerById = (productPlanId) => {
  return request.get({ url: `/workflow-api/api/workflow/business/pack/productPlan/purchaseManager/${productPlanId}` })
}
//进度维护采购信息详情
export const getPurchasingInfoById = (productPlanId) => {
  return request.get({ url: `/workflow-api/api/workflow/business/pack/productPlan/purchasingInfo/${productPlanId}` })
}

// 删除备注信息
export const deleteRemark = (id) => {
  return request.get({ url: `/workflow-api/api/workflow/business/pack/gallerySupplier/deleteRemark/${id}` })
}

// 进度维护采购计划申请详情
export const getProcurementPlanDetail = (id) => {
  return request.get({ url: `/workflow-api/api/workflow/business/pack/productPlan/procurementPlan/${id}` })
}
//保存或修改采购计划申请信息

export const saveOrUpdateProcurementPlan = (data) => {
  return request.post({ url: `/workflow-api/api/workflow/business/pack/productPlan/saveOrUpdateProcurementPlan`, data })
}
// 保存归档信息
export const saveArchiveInfo = (data) => {
  return request.post({ url: `/workflow-api/api/workflow/business/pack/productPlan/saveArchiveInfo`, data })
}
//进度维护文件资料包详情
export const getArchiveInfoById = (productPlanId) => {
  return request.get({ url: `/workflow-api/api/workflow/business/pack/productPlan/archiveInfo/${productPlanId}` })
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

// 开发计划,列表
export const getDevelopmentPlanList = (params) => {
  const { page, size, data } = params
  return request.formPost({
    url: `/api/np/developmentPlan/pageList?page=${page}&pageSize=${size}`,
    data
  })
}



// 设计图 上架维护
export const onShelfDesign = (data: {}) => {
  return request.post({ url: `/api/np/design/picture/onShelf`, data })
}

// 设计图 选中
export const choosePicture = (data) => {
  return request.post({ url: `/api/np/design/picture/choose`, data })
}



//设计图 样衣上传
export const uploadSample = (data) => {
  return request.post({ url: `/api/np/design/picture/sample`, data })
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
