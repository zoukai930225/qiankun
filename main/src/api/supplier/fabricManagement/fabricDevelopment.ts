import request from '@/config/axios'

// 列表分页查询
export const pageList = (params) => {
   return request.get({ url: '/workflow-api/api/workflow/business/fabric/develop/list',params })
}

export const addFabric = (data) => {
   return request.post({ url: '/workflow-api/api/workflow/business/fabric/develop/add',data })
}

export const updateFabric = (data) => {
   return request.post({ url: '/workflow-api/api/workflow/business/fabric/develop/update',data })
}
export const deleteFabric = (id) => {
   return request.get({ url: `/workflow-api/api/workflow/business/fabric/develop/delete/${id}` })
}
export const fabricDetail = (id) => {
   return request.post({ url: `/workflow-api/api/workflow/business/fabric/develop/detail` })
}
export const assignPersion = (data) => {
   return request.post({ url: '/workflow-api/api/workflow/business/fabric/develop/distribute',data })
}
export const termination = (id) => {
   return request.post({ url: `/workflow-api/api/workflow/business/fabric/develop/termination/${id}` })
}
export const progressList = (params) => {
   return request.get({ url: `/workflow-api/api/workflow/business/fabric/develop/supplier/progressList`,params })
}

export const saveOrSubmitSupplier = (data) => {
   return request.post({ url: `/workflow-api/api/workflow/business/fabric/develop/supplier/saveOrSubmit`,data })
}

export const getSupplierMappingList = (id) => {
   return request.get({ url: `/workflow-api/api/workflow/business/fabric/develop/supplier/list/${id}` })
}
export const uploadData = (data) => {
   return request.post({ url: `/workflow-api/api/workflow/business/fabric/develop/supplier/uploadData`,data})
}
export const eliminateSupplier = (data) => {
   return request.post({ url: `/workflow-api/api/workflow/business/fabric/develop/supplier/eliminate`,data })
}
export const trialResultTest = (data) => {
   return request.post({ url: `/workflow-api/api/workflow/business/fabric/develop/supplier/confirmTrialResult`,data })
}

export const bfConfirmResult = (data) => {
   return request.post({ url: `/workflow-api/api/workflow/business/fabric/develop/supplier/bfConfirmResult`,data })
}
export const stopProgress = (data) => {
   return request.post({ url: `/workflow-api/api/workflow/business/fabric/develop/termination`,data })
}



