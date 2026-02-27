declare namespace RightsManage {
  type TableOption = {
    label?: string
    prop?: string
    slotName?: string
    width?: number | string
    align?: 'center' | 'left' | 'right'
    fixed?: false | 'left' | 'right'
    type?: 'default' | 'selection' | 'index' | 'expand'
    showOverFlowTooltip?: boolean | any
    transform?: (params: any) => any
  }[]

  type CascaderOption = {
    value: string
    label: string
    children?: CascaderOption[]
  }

  interface GetPage {
    page: number
    size: number
  }

  /** 责权人 */
  interface DirectorVos {
    directorId: string
    directorName: string
    directorAvatar: string
    startTime: string
    endTime: string
  }

  /** 获取渠道列表Params */
  interface GetChannelsParams extends GetPage {
    validFlag: 0 | 1
  }

  /** 渠道列表Res */
  interface ChannelListItem {
    channelCode: string
    directorVos: DirectorVos[]
  }

  /** 新增或修改参数 */
  interface UpdateParams {
    id?: string
    /** 业务类型 */
    bizType?: 0 | 1 | 2 | 3
    bizId?: string
    directorId?: string
    directorName?: string
    directorAvatar?: string
    startTime?: string
    endTime?: string
    validFlag?: 0 | 1
    directorIds?: string[]
    role?: number
    store?: string
  }

  /** 获取详情参数 */
  type GetDetailParams = Pick<UpdateParams, 'bizId' | 'bizType' | 'validFlag'> & { role?: number }

  type DetailItem = UpdateParams & {
    isEdit?: boolean
    isAdd?: boolean
  }
  /** 详情 */
  type DetailRes = DetailItem[]

  /** 获取类目列表参数 */
  interface GetCategoryParams {
    /**
     * 类目名称
     */
    categoryName?: string
    /**
     * 店铺code
     */
    store?: string
    /**
     * 结束时间 yyyy/MM/dd
     */
    endTime?: string
    /**
     * 是否有负责人: 0-无, 1-有
     */
    hasDirector?: 0 | 1
    page: number
    size: number
    /**
     * 开始时间 yyyy/MM/dd
     */
    startTime?: string
    /**
     * 生效标记;0-失效, 1-生效
     */
    validFlag?: 0 | 1
  }

  /** 获取商品列表参数 */
  interface GetGoodsListParams {
    /**
     * 类目名称
     */
    categoryName?: string
    /**
     * 结束时间 yyyy/MM/dd
     */
    endTime?: string
    /**
     * 是否有负责人: 0-无, 1-有
     */
    hasDirector?: number
    /**
     * 混合查找，商品ID/名称/货品编码/负责人名称
     */
    mixSearch?: string
    page: number
    size: number
    /**
     * 开始时间 yyyy/MM/dd
     */
    startTime?: string
    /**
     * 销售状态 1-售卖中  2-已下架
     */
    status?: number
    /**
     * store code
     */
    store?: string
    /**
     * 生效标记;0-失效, 1-生效
     */
    validFlag?: number
  }

  /** 获取店铺列表参数 */
  interface GetStoreListParams {
    /**
     * 是否有负责人: 0-无, 1-有
     */
    hasDirector?: 0 | 1
    /**
     * 开始
     */
    page: number
    /**
     * 分页大小
     */
    size: number
    /**
     * 店铺code
     */
    storeCode?: string
    /**
     * 生效标记: 1-生效
     */
    validFlag?: 0 | 1
  }

  /** 店铺列表 */
  interface StoreListItem {
    /**
     * 渠道编码
     */
    channelCode?: string
    /**
     * 责权人
     */
    directorVos?: DirectorVos[]
    /**
     * 店铺code
     */
    storeCode?: string
    /**
     * 店铺名称
     */
    storeName?: string
  }
}
