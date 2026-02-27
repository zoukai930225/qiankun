import {
  goodsNewTop10DetailApi,
  goodsSearchTop10DetailApi,
  monthSalesTop10DetailApi,
  producedProductTop10DetailApi
} from '@/api/supplier/supplierBoard'
import { copyBtn, imgUrl } from '../components/twoFourSix'
import * as echarts from 'echarts'
import { formatDate } from '@/utils/formatTime'

const icons = import.meta.glob('@/assets/svgs/supplier/supplierBoard/*.svg', { eager: true })

export const iconsSrc = Object.fromEntries(
  Object.entries(icons).map(([key, value]) => {
    const fileName = key.replace(/^.*\/([^/.]+)\.svg$/, '$1')
    const svgUrl = (value as any).default || (value as any).url
    return [fileName, <img src={svgUrl} alt={fileName} />]
  })
)

export const defaultDate = [
  (function () {
    const day = new Date()
    day.setDate(day.getDate() - 6)
    return formatDate(day, 'YYYY-MM-DD')
  })(),
  formatDate(new Date(), 'YYYY-MM-DD')
]

export const cardsOptions = [
  { label: '在途货品SPU数', field: 'onWayGoodsKinds' },
  { label: '生产过的SPU数', field: 'producedGoodsKinds' },
  { label: '未完成订单数', field: 'unfinishedOrderNum' },
  { label: '在途货品总数', field: 'onWayGoodsNum' },
  { label: '生产过的SKU数', field: 'producedSkuNum' },
  { label: '待发货SPU数', field: 'waitDeliveryGoodsNum' }
].map((ele, index) => ({ ...ele, icon: iconsSrc[`supplier-icon_${index}`] }))

export const commonDeatailTable: TableOption = [
  { label: '图片', width: 60, formatter: imgUrl, prop: 'imgUrl' },
  { label: '排名', width: 60, prop: 'rank' },
  { label: '货品编码', prop: 'goodsNo', formatter: copyBtn, showOverFlowTooltip: false },
  { label: '货品名称', prop: 'goodsName' },
  { label: '发货数量', prop: 'deliverNum' },
  { label: '月销量', prop: 'monthSalesNum' },
  { label: '7天搜索量', prop: 'searchNum' },
  { label: '上架时间', prop: 'date' },
  { label: '发货日期', prop: 'deliveryDate' },
  { label: '发货数', prop: 'deliveryNum' }
]

export const deliverNumTable = (function () {
  const commonMap = new Map(commonDeatailTable.map((ele) => [ele.label, ele]))
  return ['图片', '货品编码', '货品名称', '发货数量'].map((label) => commonMap.get(label)!)
})()
export const monthSalesNumTable = (function () {
  const commonMap = new Map(commonDeatailTable.map((ele) => [ele.label, ele]))
  return ['图片', '货品编码', '货品名称', '月销量'].map((label) => commonMap.get(label)!)
})()
export const searchNumTable = (function () {
  const commonMap = new Map(commonDeatailTable.map((ele) => [ele.label, ele]))
  return ['图片', '货品编码', '货品名称', '7天搜索量'].map((label) => commonMap.get(label)!)
})()
export const timeTable = (function () {
  const commonMap = new Map(commonDeatailTable.map((ele) => [ele.label, ele]))
  return ['排名', '货品编码', '货品名称', '上架时间'].map((label) => commonMap.get(label)!)
})()
export const deliveryTrendTable = (function () {
  const commonMap = new Map(commonDeatailTable.map((ele) => [ele.label, ele]))
  return ['图片', '货品编码', '货品名称', '发货日期', '发货数'].map(
    (label) => commonMap.get(label)!
  )
})()

export enum TOP_10_TYPE {
  /** 生产过的 */ PRODUCTED = '1',
  /** 月销量 */ MONTH_SALES = '2',
  /** 搜索量 */ GOODS_SEARCHED = '3',
  /** 新上架 */ GOODS_NEW = '4'
}

export const chartsBars = [
  {
    label: '生产过货品数',
    type: TOP_10_TYPE.PRODUCTED,
    barColor: new echarts.graphic.LinearGradient(1, 1, 0, 0, [
      { offset: 0, color: '#77B5FF' },
      { offset: 1, color: '#287CFD' }
    ]),
    detailTableOptions: deliverNumTable,
    detailApi: producedProductTop10DetailApi
  },
  {
    label: '货品月销量',
    type: TOP_10_TYPE.MONTH_SALES,
    barColor: new echarts.graphic.LinearGradient(1, 1, 0, 0, [
      { offset: 0, color: '#FFCF5F' },
      { offset: 1, color: '#FFAF20' }
    ]),
    detailTableOptions: monthSalesNumTable,
    detailApi: monthSalesTop10DetailApi
  },
  {
    label: '货品搜索量',
    type: TOP_10_TYPE.GOODS_SEARCHED,
    barColor: new echarts.graphic.LinearGradient(1, 1, 0, 0, [
      { offset: 0, color: '#49D1FF' },
      { offset: 1, color: '#49BFFF' }
    ]),
    detailTableOptions: searchNumTable,
    detailApi: goodsSearchTop10DetailApi
  },
  {
    label: '货品新上架',
    type: TOP_10_TYPE.GOODS_NEW,
    detailTableOptions: timeTable,
    detailApi: goodsNewTop10DetailApi
  }
]

export const tableConfig: TableOption = [
  { type: 'index', label: '序号', width: 60 },
  { label: '货品编码', prop: 'goodsNo', formatter: copyBtn },
  { label: '上架日期', prop: 'date' }
]

export const trendConfigs = [{ label: '货品销售趋势' }, { label: '日发货趋势' }]

export const timeSwiftOptions = [
  {
    label: '7天',
    tips: '最近7天数据',
    isComponents: false,
    timeOffset: { type: 'day', mode: 'subtract', offset: 6 },
    params: { preset: 'last7Days' }
  },
  {
    label: '14天',
    tips: '最近14天数据',
    isComponents: false,
    timeOffset: { type: 'day', mode: 'subtract', offset: 13 },
    params: { preset: 'last14Days' }
  },
  {
    label: '30天',
    tips: '最近30天数据',
    isComponents: false,
    timeOffset: { type: 'day', mode: 'subtract', offset: 29 },
    params: { preset: 'last30Days' }
  }
]
