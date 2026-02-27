/**
 * 抖音店铺类型定义
 */
export interface Store {
  id: string | number
  name: string
  code: string | number
  nickName: string
}

/**
 * 商品信息类型定义
 */
export interface Goods {
  id: string
  goodsName: string
  goodsId: string
  store?: string
}
