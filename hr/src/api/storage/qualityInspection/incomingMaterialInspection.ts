import request from '@/config/axios'

export interface WhIncomingInspectionPageQuery {
  /** 采购单号 */
  purchaseNo?: string
  /** 货品编号 */
  goodsNo?: string
  /** 检验时间开始时间 */
  inspectionTimeBegin?: string
  /** 检验时间结束时间 */
  inspectionTimeEnd?: string
  /** (质检状态0:未检查；1：合格；2.部分合格；3.不合格) */
  status?: string | number
  /** 验货QC */
  inspectionQc?: string
  /** 质检员 */
  inspectionUser?: string
  /** 页数 */
  page: number
  /** 每页多少条 */
  size: number
}

export interface PageRes<T = any> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
}

// 后端返回字段较多，这里只定义列表页会用到的常见字段，并允许透传更多字段
export type WhIncomingInspectionRecord = {
  id?: string
  purchaseNo?: string
  /** 跟单员 */
  purchaserName?: string
  /** 采购量 */
  num2?: number
  /** 货品分类；0：半成品；1：成品 */
  productClass?: number
  /** 质检状态0:未检查；1：合格；2.部分合格；3.不合格 */
  inspectionStatus?: number
  /** 来货日期 */
  checkTime?: string
  /** 检验日期 */
  operatorTime?: string
  goodsNo?: string
  inspectionQc?: string
  inspectionUser?: string
  /** 备注 */
  inspectionRemark?: string
  [key: string]: any
}

// /api/whIncomingInspectionInfo/submit 来料检验质检提交
export const submitIncomingInspection = (data: any) => {
  return request.post({ url: '/api/whIncomingInspectionInfo/submit', data })
}

// /api/whIncomingInspectionInfo/{id} 仓储来料检验详情
export const getIncomingInspectionDetail = (id: string) => {
  return request.get({ url: `/api/whIncomingInspectionInfo/${id}` })
}

// /api/whIncomingInspectionInfo/page PC端仓储基层员工问题分页列表
export const getIncomingInspectionPage = (
  data: WhIncomingInspectionPageQuery
): Promise<PageRes<WhIncomingInspectionRecord>> => {
  return request.post({ url: '/api/whIncomingInspectionInfo/page', data })
}

// /api/whIncomingInspectionInfo/export 来料检验导出
export const exportIncomingInspection = (data: any) => {
  return request.downloadPost({ url: '/api/whIncomingInspectionInfo/export', data })
}
