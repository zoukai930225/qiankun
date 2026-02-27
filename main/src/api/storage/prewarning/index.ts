import request from '@/config/axios'

interface GetRes<T = any> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
}

//=============

/**
 * 成品库存预警获取列表
 */
export function getGoodsInventoryNotifyList(
  params: StoragePrewarningType.GetGoodsInventoryNotifyListParams
): Promise<GetRes<StoragePrewarningType.GoodsInventoryNotifyListItem>> {
  return request.get({ url: '/api/whGoodsAreaInventoryNotify', params })
}

/**
 * 成品库存预警导出列表
 */
export function exportCPInventoryNotifyList(
  params: StoragePrewarningType.ExportCPInventoryNotifyListParams
) {
  return request.download({ url: '/api/whGoodsAreaInventoryNotify/export', params })
}

/**
 * 添加/更改配置
 */
export function setPrewarningOptions(data: StoragePrewarningType.SetPreWarningOptionsParams) {
  return request.postOriginal({ url: '/api/whGoodsAreaInventoryNotify/sysConfig', data })
}

/**
 * 获取当前配置
 */
export function getPrewarningOptions() {
  return request.get({ url: '/api/whGoodsAreaInventoryNotify/sysConfig' })
}

//===============

/**
 * 库存积压预警
 */
export function getInventoryBacklogNotifyList(
  params: StoragePrewarningType.GetOverStockListParams
): Promise<GetRes<StoragePrewarningType.OverStockListItem>> {
  return request.get({ url: '/api/whInventoryBacklogAlarm/pageQuery', params })
}

/**
 * 库存积压预警导出列表
 */
export function exportInventoryBacklogNotifyList(
  params: StoragePrewarningType.GetOverStockListParams
) {
  return request.download({ url: '/api/whInventoryBacklogAlarm/export', params })
}
