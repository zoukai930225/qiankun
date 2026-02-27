declare namespace StoragePrewarningType {
  /**
   * 查询成品仓库预警列表-参数
   */
  interface GetGoodsInventoryNotifyListParams {
    /**
     * 查询时间
     */
    dataDate?: string
    /**
     * 页码
     */
    pageNo: number
    pageSize: number
    /**
     * 商品名称
     */
    productName?: string
    /**
     * 商家编码
     */
    skuCode?: string
    [property: string]: any
  }

  /**
   * 成品仓库预警列表-单项
   */
  interface GoodsInventoryNotifyListItem {
    /**
     * 分类
     */
    category?: string
    /**
     * 企业(字典code)
     */
    company?: string
    /**
     * 企业名称
     */
    companyName?: string
    /**
     * 成品区库存
     */
    cpqInventory?: number
    /**
     * 创建时间
     */
    createdAt?: string
    /**
     * 创建人
     */
    createdId?: string
    /**
     * 数据入库时间
     */
    dataDate?: string
    /**
     * 失败原因
     */
    failReason?: string
    id?: string
    /**
     * 是否删除 1-是 0-否
     */
    isDeleted?: number
    /**
     * 货品名称
     */
    productName?: string
    /**
     * 货品编号
     */
    productNumber?: string
    /**
     * 七天销量
     */
    salesSevenDays?: number
    /**
     * 三天销量
     */
    salesThreeDays?: number
    /**
     * 查询时间
     */
    searchDate?: string
    /**
     * 发送结果 0-失败 1-成功
     */
    sendResult?: number
    /**
     * 商品编码
     */
    skuCode?: string
    /**
     * 规格码
     */
    specificationCode?: string
    /**
     * 规格名称
     */
    specificationName?: string
    /**
     * 库存数量
     */
    stock?: number
    /**
     * 拣货区库存
     */
    swjInventory?: number
    /**
     * 待补货
     */
    toBeReplenished?: number
    /**
     * 修改时间
     */
    updatedAt?: string
    /**
     * 修改人
     */
    updatedId?: string
    /**
     * 仓库
     */
    warehouse?: string
    /**
     * 半成品
     */
    bcpInventory?: number
    [property: string]: any
  }

  interface ExportCPInventoryNotifyListParams {
    /**
     * 查询时间
     */
    dataDate?: string
    /**
     * 货品名称
     */
    productName?: string
    /**
     * 商品编码
     */
    skuCode?: string
    [property: string]: any
  }

  interface SetPreWarningOptionsParams {
    /**
     * 系统参数编码
     */
    code?: string
    /**
     * 企业(字典code)
     */
    company?: string
    /**
     * 企业名称
     */
    companyName?: string
    /**
     * 创建时间
     */
    createdAt?: string
    /**
     * 创建人
     */
    createdId?: string
    id?: string
    /**
     * 是否删除 1-是 0-否
     */
    isDeleted?: number
    /**
     * 系统参数名称
     */
    name?: string
    /**
     * 系统参数分类（字典）
     */
    type?: string
    /**
     * 修改时间
     */
    updatedAt?: string
    /**
     * 修改人
     */
    updatedId?: string
    /**
     * 系统参数值
     */
    value?: string
  }

  /**
   * 获取库存积压预警列表参数
   */
  interface GetOverStockListParams {
    /**
     * 告警日期
     */
    alarmTime?: string
    /**
     * 商家编码
     */
    merchantCode?: string
    /**
     * 当前页
     */
    page?: number
    /**
     * 当前页数
     */
    pageSize?: number
    /**
     * 商品名称
     */
    productName?: string
  }

  /**
   * 库存积压预警列表
   */
  interface OverStockListItem {
    /**
     * 告警日期
     */
    alarmTime?: string
    /**
     * 主键Id
     */
    id?: string
    /**
     * 库存
     */
    inventory?: string
    /**
     * 商家编码
     */
    merchantCode?: string
    /**
     * 商品名称
     */
    productName?: string
    /**
     * 30天销量
     */
    salesThirtyDays?: string
    /**
     * 规格
     */
    specifications?: string
  }
}
