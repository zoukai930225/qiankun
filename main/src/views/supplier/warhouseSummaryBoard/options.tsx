import * as echarts from 'echarts'
import { copyBtn, imgUrl } from '../components/twoFourSix'
import {
  categoryProportionApi,
  cloudCategoryProportionApi,
  purchaseInboundGoodsApi,
  purchaseReturnGoodApi,
  salesOutboundGoodsApi,
  stockProportionApi
} from '@/api/supplier/warhouseSummaryBoard'

const icons = import.meta.glob('@/assets/svgs/supplier/warhouseSummaryBoard/*.svg', { eager: true })

export const iconsSrc = Object.fromEntries(
  Object.entries(icons).map(([key, value]) => {
    const fileName = key.replace(/^.*\/([^/.]+)\.svg$/, '$1')
    const svgUrl = (value as any).default || (value as any).url
    return [fileName, <img src={svgUrl} alt={fileName} />]
  })
)

export const commonDeatailTable: TableOption = [
  { label: '图片', width: 60, formatter: imgUrl, prop: 'imgUrl' },
  { label: '货品编码', prop: 'goodsCode', formatter: copyBtn, showOverFlowTooltip: false },
  { label: '货品名称', prop: 'goodsName' },
  { label: '数量', prop: 'qty' }
]

export enum TOP_10_TYPE {
  /** 销售出库 */ SALES_OUTBOUND = '1',
  /** 退货出库 */ RETURN_GOODS = '2',
  /** 采购入库 */ INBOUND_GOODS = '3'
}

export const chartsBars = [
  {
    label: '销售出库货品',
    type: TOP_10_TYPE.SALES_OUTBOUND,
    barColor: new echarts.graphic.LinearGradient(1, 1, 0, 0, [
      { offset: 0, color: '#77B5FF' },
      { offset: 1, color: '#287CFD' }
    ]),
    api: salesOutboundGoodsApi,
    detailTableOptions: commonDeatailTable,
    detailApi: salesOutboundGoodsApi
  },
  {
    label: '采购退货出库货品',
    type: TOP_10_TYPE.RETURN_GOODS,
    barColor: new echarts.graphic.LinearGradient(1, 1, 0, 0, [
      { offset: 0, color: '#FFCF5F' },
      { offset: 1, color: '#FFAF20' }
    ]),
    detailTableOptions: commonDeatailTable,
    detailApi: purchaseReturnGoodApi,
    api: purchaseReturnGoodApi
  },
  {
    label: '采购入库货品',
    type: TOP_10_TYPE.INBOUND_GOODS,
    barColor: new echarts.graphic.LinearGradient(1, 1, 0, 0, [
      { offset: 0, color: '#49D1FF' },
      { offset: 1, color: '#49BFFF' }
    ]),
    detailTableOptions: commonDeatailTable,
    detailApi: purchaseInboundGoodsApi,
    api: purchaseInboundGoodsApi
  }
]

export enum PIE_TYPE {
  /** 总仓/云仓库存总量占比 */ STOCK_PROPORTION,
  /** 总仓商品品类库存分布 */ CATEGORY_PROPORTION,
  /** 云仓商品品类库存分布 */ CLOUD_STOCK_PROPORTION
}

export const chartsPies = [
  {
    label: '总仓/云仓库存总量占比',
    type: PIE_TYPE.STOCK_PROPORTION,
    api: stockProportionApi,
    color: ['#3290ff', '#49bfff']
  },
  {
    label: '总仓商品品类库存分布',
    type: PIE_TYPE.CATEGORY_PROPORTION,
    api: categoryProportionApi
  },
  {
    label: '云仓商品品类库存分布',
    type: PIE_TYPE.CLOUD_STOCK_PROPORTION,
    api: cloudCategoryProportionApi
  }
]
