import { formatDate } from '@/utils/formatTime'
import { copyBtn, goodsNosFormatter } from '../components/twoFourSix'

export const SORT_COLUMN = [
  'purchasedGoodsQuantity',
  'deliveryQuantity',
  'deliveryRate',
  'toShipQuantity',
  'deliveryDays'
]
export const PRECISIONS = {
  requestQuantity: 0,
  deliveryQuantity: 0,
  deliveryRate: 2,
  toShipQuantity: 0
}

export enum TAB_KEYS {
  /**品类 */ CATEGORY,
  /**货品 */ GOODS,
  /**供应商 */ SUPPLIER,
  /**生产单 */ PO
}

export const mainTable: TableOption = [
  { label: '供应商名称', prop: 'companyName', minWidth: 130 },
  {
    label: '采购数量',
    prop: 'requestQuantityTotal',
    slotName: 'requestQuantity',
    minWidth: 130,
    transform: (col) => Intl.NumberFormat().format(col || 0)
  },
  {
    label: '本月应发',
    prop: 'toShipQuantityTotal',
    slotName: 'toShipQuantity',
    minWidth: 130,
    
  },
  {
    label: '已发货数量',
    prop: 'deliveryQuantityTotal',
    slotName: 'deliveryQuantity',
    minWidth: 130,
    
    transform: (col) => Intl.NumberFormat().format(col || 0)
  },
  {
    label: '交付率',
    prop: 'deliveryRate',
    minWidth: 130,
    
    headertip: '统计月份内供应商所有生产订单的交付平均值',
    transform: (col) => `${col}%`
  }
]

export const detailTable: TableOption = [
  {
    label: '生产订单号',
    prop: 'scPurchaseOrderNo',
    minWidth: 130,
    formatter: copyBtn
  },
  {
    label: '货品编码',
    prop: 'goodsCode',
    minWidth: 130,
    formatter: goodsNosFormatter,
    showOverFlowTooltip: false
  },
  {
    label: '合同首批日期',
    prop: 'firstBatchTime',
    minWidth: 120,
    transform: (col) => formatDate(col, 'YYYY-MM-DD') || '--'
  },
  {
    label: '合同清单日期',
    prop: 'orderArrivalTime',
    minWidth: 120,
    transform: (col) => formatDate(col, 'YYYY-MM-DD') || '--'
  },
  {
    label: '采购数量',
    prop: 'purchasedGoodsQuantity',
    minWidth: 90,
    transform: (col) => Intl.NumberFormat().format(col || 0)
  },
  {
    label: '本月应发',
    prop: 'toShipQuantity',
    minWidth: 130,
    
    transform: (col) => Intl.NumberFormat().format(col || 0)
  },
  {
    label: '已发货数量',
    prop: 'deliveryQuantity',
    minWidth: 130,
    
    transform: (col) => Intl.NumberFormat().format(col || 0)
  },
  {
    label: '交付率',
    prop: 'deliveryRate',
    minWidth: 130,
    
    transform: (col) => `${col}%`
  },
  {
    label: '交付天数',
    prop: 'deliveryDays',
    minWidth: 110,
    transform: (col) => (col === 0 || col ? Intl.NumberFormat().format(col) : '--'),
    
  }
]
