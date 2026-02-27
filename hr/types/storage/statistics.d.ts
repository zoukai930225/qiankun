declare namespace StorageStatisticsType {
  /**
   * 获取仓库发货日报总列表参数
   */
  interface GetDeliveryReportListParams {
    page: number
    size: number
    dataDateStart: string
    dataDateEnd: string
  }

  /**
   * 仓库发货日报总列表单元
   */
  interface DeliveryReportItem {
    /**
     * 日报id
     */
    id: string
    /**
     * 创建时间
     */
    createdAt: string
    /**
     * 更新时间
     */
    updatedAt: string
    /**
     * 更新人
     */
    updateId: string
    /**
     * 日报日期
     */
    dataDate: string
    /**
     * 日报时间
     */
    dataDateTime: string
    /**
     * 北苑仓发货单量
     */
    beiyuanWarehouseOrders: number
    /**
     * 库存不足订单
     */
    insufficientStockOrders: number
    /**
     * VV/LILIU仓库发货总单量
     */
    vvLiliuWarehouseOrders: number
    /**
     * 即将超时订单
     */
    aboutToTimeoutOrders: number
    /**
     * 即将超时备注
     */
    aboutToTimeoutRemarks: string
    /**
     * 南昌云仓发货单
     */
    nanchangWarehouseOrders: number
    /**
     * 超时订单
     */
    timeoutOrders: number
    /**
     * 订单超时备注
     */
    timeoutRemarks: string
    /**
     * 单品爆款
     */
    singleProductHotSale: number
    /**
     * 小批量爆款
     */
    smallBatchHotSale: number
    /**
     * 剩余订单量
     */
    remainingOrders: number
    /**
     * 单通道订单数/波次数
     */
    singleChannelOrders: string
    /**
     * 配货人数
     */
    pickingPersonnel: string
    /**
     * 验货人数
     */
    inspectionPersonnel: string
    /**
     * 打包人数
     */
    packagingPersonnel: string
    /**
     * 特殊包装
     */
    specialPackaging: number
    /**
     * 备注
     */
    remarks: string
    /**
     * 截单时间
     */
    orderCutoffTime: string
    /**
     * 拣货最高货品数
     */
    maxPickingItems: number
    /**
     * 拣货最低货品数
     */
    minPickingItems: number
    /**
     * 打包最高订单数
     */
    maxPackagingOrders: number
    /**
     * 打包最低订单数
     */
    minPackagingOrders: number
    /**
     * 验货最高商品数
     */
    maxInspectionItems: number
    /**
     * 验货最低商品数
     */
    minInspectionItems: number
    /**
     * 每日拆分订单数
     */
    dailySplitOrders: number
    /**
     * 一通道
     */
    channelOne: number
    /**
     * 二通道
     */
    channelTwo: number
    /**
     * 三通道
     */
    channelThree: number
    /**
     * 四通道
     */
    channelFour: number
    /**
     * 五通道
     */
    channelFive: number
    /**
     * 六通道
     */
    channelSix: number
    /**
     * 七通道
     */
    channelSeven: number
    /**
     * 八通道
     */
    channelEight: number
    /**
     * 九通道
     */
    channelNine: number
    /**
     * 十通道
     */
    channelTen: number
    /**
     * 0通道
     */
    channelZero: number
    /**
     * 十一通道
     */
    channelEleven: number
    /**
     * 邮政
     */
    postal: number
    /**
     * 双通道波次
     */
    dualChannelWaves: number
    /**
     * 混合通道
     */
    mixedChannel: number
    /**
     * SW中通混通道
     */
    swZhongtongMixedChannel: number
    /**
     * 拼多多通道
     */
    pddMixedChannel: number
  }
}
