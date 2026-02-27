import request from '@/config/axios'

export interface BigScreenPageOrigional {
  code: number
  message: string | undefined
  data: BigScreenPage
  totalData: BigScreenPageData
}
export interface BigScreenPage {
  total: number
  size: number
  current: number
  pages: number
  header: BigScreenHeaderData[]
  records: BigScreenPageData[]
}
export interface BigScreenHeaderData {
  title: string
  items: BigScreenHeaderItemData[]
}
export interface BigScreenHeaderItemData {
  title: string
  field: string
  background: string
  color: string
}

export interface BigScreenPageData {
  statDate: string //
  grossReceipts: string // 后台支付金额
  payClientNum: string // 单量
  refundAmount: string // 退款金额
  noDeliverRefundAmount: string // 未发货仅退款
  refundRate: string // 退款率
  onSitePromotionCost: string // 站内推广费
  newGiftCost: string // 新客礼金
  noDeliverRefundRate: string // 仅退款率
  replenishmentAmount: string // 补单金额
  replenishmentCost: string // 补单佣金
  realIncomeAmount: string // 实际收款金额
  costRate: string // 成本率
  goodsCost: string // 货品成本
  grossProfit: string // 毛利
  grossProfitRate: string // 毛利率
  actualOffSiteCost: string // 站外推广费
  promotionTotal: string // 推广费合计
  promotionRate: string // 推广费占比
  otherOverhead: string // 其他日常费用
  rentAndUtilities: string // 房租物业水电
  freightInsurance: string // 运费险
  cashBack: string // 售后返现
  // consultCost: string // 咨询91w
  hangzhouLaborCost: string // 杭州人工
  fixedChargeTotal: string // 固定费用合计
  fixedChargeRate: string // 固定费用占比
  scOrderNum: string // 四川发货
  crOrderNum: string // 婵润发货
  ywExpressFee: string // 义乌快递费
  crExpressFee: string // 婵润快递费
  expressFeeRate: string // 快递费占比
  packingCharge: string // 包装费
  packingChargeRate: string // 包装费占比
  ywLaborCost: string // 义乌人工
  scLaborCost: string // 四川人工
  laborCostTotal: string // 人工成本合
  laborCostRate: string // 人工成本占比
  totalCost: string // 费用合计
  expectedProfit: string // 预计利润
  profitRate: string // 利润率
  productSell: string // 品销宝
}

export interface OnSitePromotionCostOrigional {
  code: number
  message: string | undefined
  data: OnSitePromotionCostData[]
  totalData: OnSitePromotionCostData
}

export interface OnSitePromotionCostData {
  store: string //店铺
  keywordPromotion: string // 关键词推广
  preciseAudience: string //精准人群推广
  intelligentScene: string //智能场景
  contentMarketing: string //内容营销
  allSite: string // 全站推广
  totalCost: string //合计消耗
}

export interface StoreBigScreenData {
  title: string //标题
  gmv: string // GMV目标
  actualGmv: string //已完成GMV
  gmvRate: string //GMV目标完成率
  currentMonth: string //当前月份
}

export interface XhsGmvReportData {
  storeName: string[] // 店铺名称
  likedCount: number[] // 点赞数量
  gmv: number[] // GMV
}

export interface BiResponsibilityAuthorityData {
  dataDate: string // 数据日期
  dataMonth: string //数据月份
  name: string //姓名
  dept: string //部门
  post: string //岗位
  goodsCount: string //责权商品数
  storeCount: string //责权店铺数
  salesAmount: string //销售额
  cleanSalesAmount: string //净销售额
  refundAmount: string //退款金额
  completionRate: string //完成率
  targetAmount: string //目标金额
  excessNetProfit: string // 目标净利超额
}

// 查询店铺日报信息
export const getTaobaoStoreDailyData = async () => {
  return await request.get({
    url: '/api/v1/bigScreen/taobaoStoreDaily',
    headers: {
      isToken: false
    }
  })
}

// 查询店铺组信息
export const getBigScreenGroupDailyData = async () => {
  return await request.get({
    url: '/api/v1/bigScreen/groupDaily',
    headers: {
      isToken: false
    }
  })
}

// 淘宝大屏信息

export const getTaobaoBigScreenData = async () => {
  return await request.get({
    url: '/api/v1/bigScreen/taobao',
    headers: {
      isToken: false
    }
  })
}

// 天猫与抖音大屏信息

export const getTmallAndDouyinBigScreenData = async () => {
  return await request.get({
    url: '/api/v1/bigScreen/tmallAndDouyin',
    headers: {
      isToken: false
    }
  })
}

// 拼多多系大屏信息
export const getPddBigScreenData = async () => {
  return await request.get({
    url: '/api/v1/bigScreen/pdd',
    headers: {
      isToken: false
    }
  })
}

// 京东与抖音大屏信息
export const getDouyinAndJdBigScreenData = async () => {
  return await request.get({
    url: '/api/v1/bigScreen/douyinAndJd',
    headers: {
      isToken: false
    }
  })
}

// 查询统计日报数据
export const getBigScreenPageData = async (params: Object): Promise<BigScreenPageOrigional> => {
  return await request.getOriginal({
    url: `/api/v1/bigScreen/page`,
    headers: {
      isToken: false
    },
    params
  })
}

// 日报导出
export const bigScreenPageDataExport = (params: Object) => {
  return request.download({ url: '/api/v1/bigScreen/export', params })
}

// 查询站内运营消耗数据
export const queryOnSitePromotionCostData = async (
  params: Object
): Promise<OnSitePromotionCostOrigional> => {
  return await request.getOriginal({
    url: `/api/v1/bigScreen/queryOnSitePromotionCost`,
    headers: {
      isToken: false
    },
    params
  })
}

// 小红书店铺大屏信息
export const getXhsGmvReportBigScreenData = async (): Promise<XhsGmvReportData> => {
  return await request.get({
    url: `/api/v1/bigScreen/getXhsGmvReport`,
    headers: {
      isToken: false
    }
  })
}

// BI个人责权大屏数据统计展示
export const getBiResponsibilityAuthorityBigScreenData = async (): Promise<
  BiResponsibilityAuthorityData[]
> => {
  return await request.get({
    url: `/api/v1/bigScreen/getBiResponsibilityAuthority`,
    headers: {
      isToken: false
    }
  })
}

// BI个人责权目标净利超额
export const getBiResponsibilityAuthorityTargetProfitBigScreenData = async (): Promise<
  BiResponsibilityAuthorityData[]
> => {
  return await request.get({
    url: `/api/v1/bigScreen/queryExcessNetProfit`,
    headers: {
      isToken: false
    }
  })
}

// 商品新品数据指标
export const customerServiceDataNewProduct = (store: string) => {
  return request.get({
    url: `/api/CustomerServiceData/newProduct?page=1&size=999999&store=${store}`
  })
}

// 商品新品滚动时间
export const bigScreenSildingTimeTimeNewProduct = () => {
  return request.get({ url: `/api/config/getCode/BIGSCREEN_SILDING_TIME_NEWPRODUCT` })
}

// BI 数据看板
export const bigScreenBIcleanRecord = () => {
  return request.get({
    url: `/api/v1/bigScreen/bi/cleanRecord`,
    headers: {
      isToken: false
    }
  })
}

// 仓储大屏发货统计
export const getbigScreenDelivery = () => {
  return request.get({
    url: `/api/v1/bigScreen/delivery`
  })
}

// 日报图片发送飞书群
export const uploadAndSend = (data: any) => {
  return request.upload({ url: '/api/v1/bigScreen/uploadAndSend', data })
}

//店铺累计经营利润
export const getFindProfitData = (params) => {
  return request.getOriginal({ url: `/api/v1/bigScreen/findProfit`, params })
}

// 10亿解锁
export const getBillionObtainVarianceComment = () => {
  return request.get({ url: `/api/otr/obtain/variance/comment` })
}
