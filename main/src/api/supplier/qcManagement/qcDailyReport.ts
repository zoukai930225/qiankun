import request from '@/config/axios'

//供应商下拉框接口
export function selectSupplierList() {
  return request.post({
    url: `/api/qcDailyReportInfo/selectSupplierList`,
  })
}

// 商品款号下拉框接口
export function selectWdtGoodsList() {
  return request.post({
    url: `/api/qcDailyReportInfo/selectWdtGoodsList`,
  })
}

// QC日报新增
export function addQCDailyReportInfo(data:any) {
  return request.post({
    url: `/api/qcDailyReportInfo/add`,
    data
  })
}

//QC日报修改
export function editQCDailyReportInfo(data:any) {
  return request.post({
    url: `/api/qcDailyReportInfo/edit`,
    data
  })
}

// QC日报单条查询
export function getQCDailyReportInfoById(id:any) {
  return request.get({
    url: `/api/qcDailyReportInfo/${id}`,
  })
}

// QC日报分页查询
export function queryQCDailyReportInfo(data:any) {
  return request.post({
    url: `/api/qcDailyReportInfo/page`,
    data
  })
}

// QC日报根据id删除
export function deleteQCDailyReportInfoById(params:any) {
  return request.delete({
    url: `/api/qcDailyReportInfo/deleteById`,
    params
  })
}

// QC日报导出
export const exportData = (data:any) => {
  return request.downloadPost({ 
    url: `/api/qcDailyReportInfo/export`, 
    data 
  })
}

