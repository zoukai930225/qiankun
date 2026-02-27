import request from '@/config/axios'

// 列表分页查询
export const getPackInfo = (goodsNo) => {
  return request.get({ url: `/workflow-api/api/packLibrary/queryPackInfo/${goodsNo}` })
}
export const getGoodsInfo = (goodsId) => {
  return request.get({ url: `/workflow-api/api/assetLibrary/queryWdtGoods/${goodsId}` })
}
export const getGoodsInventory = (goodsId) => {
  return request.get({ url: `/workflow-api/api/assetLibrary/queryGoodsInventory/${goodsId}` })
}

export const getGoodsSuppliers = (goodsId) => {
  return request.get({ url: `/workflow-api/api/assetLibrary/queryGoodsSuppliers/${goodsId}` })
}

