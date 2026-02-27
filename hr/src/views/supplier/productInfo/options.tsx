import { formatDate } from '@/utils/formatTime'
import { copyBtn, goodsNosFormatter, imgUrl, persons } from '../components/twoFourSix'

export const mainTable: TableOption = [
  { type: 'selection', minWidth: 55, showOverFlowTooltip: false, fixed: 'left' },
  { label: '类目', prop: 'category', minWidth: 200 },
  { label: '货品名称', prop: 'goodsName', minWidth: 130 },
  {
    label: '货品编码',
    prop: 'goodsNo',
    minWidth: 110,
    formatter: goodsNosFormatter,
    showOverFlowTooltip: false
  },
  { label: '迭代款', prop: 'iterateStyle', minWidth: 130, transform: (col) => col || '--' },
  { label: '下架状态', prop: 'outOfStockDisplay', minWidth: 130 },
  { label: '跟单员', prop: 'users', minWidth: 130, formatter: persons },
  { label: '商品等级', prop: 'levelDisplay', minWidth: 130, transform: (col) => col || '--' },
  {
    label: '生产周期',
    prop: 'productionCycleDisplay',
    minWidth: 100,
    transform: (col) => col || '--'
  },
  { label: '年份', prop: 'year', minWidth: 80, transform: (col) => formatDate(col, 'YYYY') },
  { label: '性别', prop: 'sexDisplay', minWidth: 80, transform: (col) => col || '--' },
  { label: '季节', prop: 'seasonDisplay', minWidth: 80, transform: (col) => col || '--' },
  { label: '创建时间', prop: 'createTime', minWidth: 180 },
  { label: '操作', type: 'options', fixed: 'right' }
]

export const skuTableOptions: TableOption = [
  { label: '类目', prop: 'category', minWidth: 150, fixed: 'left' },
  { label: '图片', prop: 'imgUrl', minWidth: 60, formatter: imgUrl, fixed: 'left' },
  { label: '货品名称', prop: 'goodsName', minWidth: 130 },
  {
    label: '货品编码',
    prop: 'goodsNo',
    minWidth: 130,
    formatter: goodsNosFormatter,
    showOverFlowTooltip: false
  },
  { label: '迭代款', prop: 'iterateStyle', minWidth: 130 },
  { label: 'SKU编码', prop: 'skuNo', minWidth: 130, formatter: copyBtn },
  { label: '主条码', prop: 'barcode', minWidth: 130, formatter: copyBtn },
  { label: '迭代码', prop: 'iterateCode', minWidth: 130, transform: (col) => col || '--' },
  { label: '规格名称', prop: 'specName', minWidth: 100, transform: (col) => col || '--' },
  {
    label: '规格码',
    prop: 'specCode',
    minWidth: 100,
    transform: (col) => col || '--'
  },
  {
    label: '号型',
    prop: 'prop3',
    minWidth: 100,
    transform: (col) => col || '--'
  },
  {
    label: '零售价',
    prop: 'retailPrice',
    minWidth: 100,
    transform: (col) => (col || col === 0 ? col : '--')
  },
  { label: '下架状态', prop: 'skuOutOfStockDisplay', minWidth: 100 },
  { label: '跟单员', prop: 'users', minWidth: 130, formatter: persons },
  { label: '供应商', prop: 'suppliersDisplay', minWidth: 130, transform: (col) => col || '--' },
  { label: '创建时间', prop: 'createTime', minWidth: 200 },
  { label: '操作', type: 'options', fixed: 'right' }
]
