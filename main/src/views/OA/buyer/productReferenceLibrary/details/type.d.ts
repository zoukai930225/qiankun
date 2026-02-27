declare interface ProductBasicInfo {
  /**
   * 品类名称
   */
  categoryName?: string
  /**
   * 关联企划名称
   */
  planName?: string
  /**
   * 产品名称
   */
  productName?: string
  /**
   * 实拍图片
   */
  realPhotos?: string
  /**
   * 核心卖点
   */
  salePoint?: string
  /**
   * 单价
   */
  unitPrice?: string
  /**
   * 上传人姓名
   */
  uploadUserName?: string
  [property: string]: any
}

declare type FormModel = {
  /**
   * 参选产品信息id
   */
  bpCandidateProductInfoId?: string
  /**
   * 选中状态（1:选中，2:淘汰）
   */
  chooseStatus?: number
  /**
   * 选中状态名称
   */
  chooseStatusName?: string
  /**
   * 选供专员列表
   */
  chosenSupplierStaffs?: any[]
  /**
   * 创建时间（选品时间）
   */
  createdAt?: string
  /**
   * 创建人ID（选品人）
   */
  createdId?: string
  /**
   * 创建人姓名（选品人）
   */
  createdName?: string
  /**
   * ID
   */
  id?: string
  /**
   * 运营人员列表
   */
  operations?: any[]
  /**
   * 版师列表
   */
  patternMakers?: any[]
  /**
   * 参选产品基本信息
   */
  productBasicInfo?: ProductBasicInfo
  /**
   * 操作理由
   */
  reason?: string
  [property: string]: any
}
