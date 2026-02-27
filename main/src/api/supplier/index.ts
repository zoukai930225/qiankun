import request from '@/config/axios'

// 评估项
export const getQueryCurrentVersion = () => request.get({ url: `/api/supplierEvalCategory/queryCurrentVersion` });

// 保存评估
export const saveEvalCategory = (data: any) => request.postOriginal({ url: `/api/supplierEvalCategory/saveCurrent`, data });

// 生成记录id
export const getInspectionId = (id: any) => request.get({ url: `/api/supplierInspectionRecord/getInspRecId/${id}` });

// 查询记录
export const getInspectionDetails = (id: any) => request.get({ url: `/api/supplierInspectionRecord/queryRecordById/${id}` });

// 新增记录
export function addInspectionDetails(data) {
  return request.postOriginal({
    url: '/api/supplierInspectionRecord',
    data
  })
}

// 删除图片
export const delImgs = (id: any) => request.delete({ url: `/api/supplierInspectionImg?id=${id}` });

// 新增图片
export const addImgs = (data: any) => request.postOriginal({ url: '/api/supplierInspectionImg', data });

// 验厂记录
export const getInspectionRecord = (id: any) => request.get({ url: `/api/supplierInspectionRecord/queryBySupplierId/${id}` });

// 重置
export const resetPassWord = (id: any) => request.post({ url: `/api/supplier-basic-info/resetPassword/${id}` });

// 查询任务卡片列表
export const getSupplierAllInfo = (params: any) => {
  return request.get({
    url: `/api/supplier-basic-info/getAllInfo`,
    params
  })
}
// 删除
export function deleteSupplierInfo(id: string) {
  return request.getOriginal({
    url: `/api/supplier-basic-info/delete/${id}`
  })
}
// 根据id获取供应商基本信息
export const getSupplierById = (id: string) => {
  return request.get({ url: `/api/supplier-basic-info/${id}` })
}
// 更新供应商信息
export const updateSupplier = (data: any) => {
  return request.postOriginal({ url: '/api/supplier-basic-info/updateById', data })
}
// 新增供应商信息
export function addSupplier(data) {
  return request.postOriginal({
    url: '/api/supplier-basic-info/create',
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/supplier-basic-info/create',
    data
  })
}
// 根据供应商id查询主要合作客户
export const getPartnerById = (id: string) => {
  return request.get({
    url: `/api/supplier-main-partner/getBySupplierId/${id}`
  })
}
// 新增供应商合作客户
export const addSupplierCo = (data: any) => {
  return request.post({
    url: `/api/supplier-main-partner/create`,
    data
  })
}

// 根据id删除主要合作客户
export const delPartner = (id: string) => {
  return request.post({
    url: `/api/supplier-main-partner/delete/${id}`
  })
}

// 根据供应商id查询工厂情况
export const getFactoryById = (id: string) => {
  return request.get({
    url: `/api/supplier-factory-condition/getBySupplierId/${id}`
  })
}
// 添加工厂情况
export const addFactory = (data: any) => {
  return request.post({
    url: `/api/supplier-factory-condition/create`,
    data
  })
}
// 根据id删除工厂情况
export const delFactory = (id: string) => {
  return request.post({
    url: `/api/supplier-factory-condition/delete/${id}`
  })
}

// 根据供应商id查询生产相关设备及生产能力
export const getProductDeviceById = (id: string) => {
  return request.get({
    url: `/api/supplier-equipment-production/getBySupplierId/${id}`
  })
}

// 添加生产相关设备及生产能力
export const createProductDevice = (data: any) => {
  return request.post({
    url: `/api/supplier-equipment-production/create`,
    data
  })
}
// 更新其他
export const updateOther = (data: any) => {
  return request.postOriginal({
    url: `/api/supplier-equipment-production/updateSupplierOther`,
    data
  })
}
// 新增其他
export const addOther = (data: any) => {
  return request.postOriginal({
    url: `/api/supplier-equipment-production/updateSupplierOther`,
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/supplier-equipment-production/create',
    data
  })
}

// 更新其他1
export const updateSupplierOther = (data: any) => {
  return request.post({
    url: `/api/supplier-equipment-production/updateSupplierOther`,
    data
  })
}
// 根据id删除生产相关设备及生产能力
export const delProductDevice = (id: string) => {
  return request.post({
    url: `/api/supplier-equipment-production/delete/${id}`
  })
}

// 获取所有评估分数
export const getAssessById = (params: any) => {
  return request.get({
    url: `/api/supplier/assess/result/getAllBySupplierId`,
    params
  })
}

// 获取验厂供应商信息
export const getSupplierInfobyId = (params: any) => {
  return request.get({
    url: `/api/supplier/inspect/get/${params.id}`,
    params
  })
}

// 获取评估分数
export const getAssessBySupplierId = (params: any) => {
  return request.get({
    url: `/api/supplier/assess/getBySupplierId`,
    params
  })
}

// 更新审核信息功能
export const updateAudit = (data: any) => {
  return request.post({
    url: `/api/supplier-basic-info/update`,
    data
  })
}

// 查询未绑定审核人员
export const getUnboundPerson = (params: any) => {
  return request.get({
    url: `/api/supplier-basic-info/unboundPerson`,
    params
  })
}

// 查询已绑定审核人员
export const getBoundPerson = (params: any) => {
  return request.get({
    url: `/api/supplier-basic-info/queryBandPerson`,
    params
  })
}

// 保存供应商审核人员信息
export const saveBandPerson = (data: any) => {
  return request.post({
    url: `/api/supplier-basic-info/bandPerson`,
    data
  })
}

// 移除供应商审核人
export const removePerson = (data: any) => {
  return request.post({
    url: `/api/supplier-basic-info/removePerson`,
    data
  })
}

/** 验厂图片上传 新增分组备注 --20251011 */
// 新增分组
export const createGroup = (data: any) => {
  return request.post({
    url: `/api/supplierInspectionImg/createGroup`,
    data
  });
};
// 删除分组以及分组下的所有图片
export const deleteGroup = (params: any) => {
  return request.post({
    url: `/api/supplierInspectionImg/deleteGroup`,
    params
  });
};
// 删除分组下的单个照片
export const deleteGroupImg = (params: any) => {
  return request.post({
    url: `/api/supplierInspectionImg/deleteGroupImg`,
    params
  });
};
// 分组下新增一个照片
export const addGroupImg = (data: any) => {
  return request.post({
    url: `/api/supplierInspectionImg/addGroupImg`,
    data
  });
};
// 修改分组下的照片的备注
export const updateGroupComment = (data: any) => {
  return request.post({
    url: `/api/supplierInspectionImg/updateGroupComment`,
    data
  });
};

/** 验厂图片上传 新增分组备注 --20251011 */

/** 供应商增加合作模式变更（审核 审核记录查看），合作品类变更 --20251120 */

// 查看审核记录
export const querySupplierAuditRecords = (supplierId: any) => {
  return request.get({
    url: `/api/supplierInspectionRecord/querySupplierAuditRecords/${supplierId}`,
  });
};
// 品类变更 
export const updateCollabCategory = (data: any) => {
  return request.post({
    url: `/api/supplier-basic-info/updateCollabCategory`,
    data
  });
};
// 合作模式 
export const updateCollabMode = (data: any) => {
  return request.post({
    url: `/api/supplier-basic-info/updateCollabMode`,
    data
  });
};

/** 供应商增加合作模式变更（审核 审核记录查看），合作品类变更 --20251120 */
