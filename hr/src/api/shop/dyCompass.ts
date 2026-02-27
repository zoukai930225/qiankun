/*
 * @Date: 2025-06-09 15:35:32
 */
import request from '@/config/axios'

// 分页查询
export const dyCommerceCompassGoodsPageQuery = (params: any) => {
  return request.get({ url: `/api/goods/compass/dyCommerceCompassGoods/pageQuery`, params })
}

// 查看其他

export const dyCommerceCompassViewOther = (params: any) => {
  return request.get({ url: `/api/goods/compass/dyCommerceCompassGoods/viewOther`, params })
}

// 获取查看其他指标字段信息

export const dyCommerceCompassFields = () => {
  return request.get({ url: `/api/goods/compass/dyCommerceCompassGoods/fields` })
}

// 获取有数据的日期

export const dyCommerceCompassHasDataDate = () => {
  return request.get({ url: `/api/goods/compass/dyCommerceCompassGoods/hasDataDate` })
}

// 获取弹窗折线图数据

export const dyCommerceCompassLineChartData = (params: any) => {
  return request.get({ url: `/api/goods/compass/dyCommerceCompassGoods/lineChartData`, params })
}

// 获取弹窗表格数据

export const dyCommerceCompassTablePageData = (params: any) => {
  return request.get({ url: `/api/goods/compass/dyCommerceCompassGoods/tablePageData`, params })
}

// 导出excel数据

export const dyCommerceCompassLineExport = (params: any) => {
  return request.download({ url: `/api/goods/compass/dyCommerceCompassGoods/export`, params })
}

// 一键发送弹窗表格数据

export const dyCommerceSendGoodsImgData = (type) => {
  return request.get({ url: `/api/goods/compass/dyCommerceCompassGoods/sendTableData/${type}` })
}

// 上传文件
export const uploadAndSendDouyinCompass = (data: any) => {
  return request.upload({ url: '/api/billion/uploadAndSendDouyinCompass', data })
}
