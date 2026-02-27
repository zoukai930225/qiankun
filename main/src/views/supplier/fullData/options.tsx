import { copyBtn, imgUrl } from '../components/twoFourSix'
import chartsInRow from './components/chartsInRow.vue'

export const commonColumn: TableOption = [
  {
    label: '在厂',
    prop: 'inFactory',
    minWidth: 120,
    headertip: '已下单未发货数量，采购数量 - 实际入库总数 - 在途数'
  },
  {
    label: '在途',
    prop: 'inTransit',
    minWidth: 120,
    headertip: '供应商已发货，实际未入库的数量（已预约未入库数量），预约总数 - 入库总数'
  },
  { label: '在仓', prop: 'inventory', minWidth: 120 },
  {
    label: '待分配',
    prop: 'unScheduled',
    minWidth: 120,
    headertip: '已计划未下单，计划补单量 - 已下单数量'
  },
  {
    label: '总库存',
    prop: 'totalInventory',
    minWidth: 120,
    headertip: '在途+在厂+在仓'
  },
  {
    label: '30天销量趋势',
    prop: 'salesTrend30Days',
    minWidth: 180,
    formatter: (_, __, columnValue, index) => {
      return index ? h(chartsInRow, { data: columnValue }) : ''
    },
    showOverFlowTooltip: false
  },
  { label: '昨日销量', prop: 'salesNumYesterday', minWidth: 120 },
  { label: '昨日销量周转', prop: 'yesterdayTurnover', minWidth: 130 },
  { label: '7天销量', prop: 'salesNumSeven', minWidth: 120 },
  {
    label: '7天销量周转',
    prop: 'sevenTurnover',
    minWidth: 140,
    headertip: '总库存 / 7天销量 * 7'
  },
  { label: '14天销量', prop: 'salesNumFourteen', minWidth: 120 },
  {
    label: '14天销量周转',
    prop: 'fourteenTurnover',
    minWidth: 145,
    headertip: '总库存 / 14天销量 * 14'
  },
  { label: '30天销量', prop: 'salesNumThirty', minWidth: 120 },
  {
    label: '30天销量周转',
    prop: 'thirtyTurnover',
    minWidth: 145,
    headertip: '总库存 / 30天销量 * 30'
  },
  // { label: '45天销量', prop: 'salesNumFortyFive', minWidth: 120 },
  // {
  //   label: '45天销量周转',
  //   prop: 'salesNumFortyFive',
  //   minWidth: 145,
  //   headertip: '总库存 / 45天销量 * 45'
  // },
  { label: '60天销量', prop: 'salesNumSixty', minWidth: 120 },
  {
    label: '60天销量周转',
    prop: 'sixtyTurnover',
    minWidth: 145,
    headertip: '总库存 / 60天销量 * 60'
  }
]

export const sortColumns = Object.fromEntries(
  commonColumn
    .filter((ele) => ele.prop !== 'salesTrend30Days')
    .map((ele) => [ele.prop, { sort: null }])
)

export const sortKeys = Object.keys(sortColumns)

export const SKUTable: TableOption = [
  {
    type: 'index',
    width: 60,
    label: '序号',
    fixed: 'left',
    indexMethod: (index) => index || '合计'
  },
  { label: '货品品类', prop: 'category', minWidth: 130 },
  {
    label: '货品编码',
    prop: 'goodsNo',
    minWidth: 130,
    formatter: (row, column, value, index) => (index ? copyBtn(row, column, value) : '')
  },
  { label: '货品名称', prop: 'goodsName', minWidth: 130 },
  {
    label: '图片',
    prop: 'imgUrl',
    minWidth: 60,
    formatter: (row, column, value, index) => (index ? imgUrl(row, column, value) : '')
  },
  {
    label: 'SKU编码',
    prop: 'sku',
    minWidth: 130,
    formatter: (row, column, value, index) => (index ? copyBtn(row, column, value) : '')
  },
  { label: '规格名称', prop: 'specName', minWidth: 120 },
  { label: '规格码', prop: 'specCode', minWidth: 100 },
  ...commonColumn
]

export const goodsTable: TableOption = [
  {
    type: 'index',
    width: 60,
    label: '序号',
    fixed: 'left',
    indexMethod: (index) => index || '合计'
  },
  { label: '货品品类', prop: 'category', minWidth: 130 },
  {
    label: '货品编码',
    prop: 'goodsNo',
    minWidth: 130,
    formatter: (row, column, value, index) => (index ? copyBtn(row, column, value) : '')
  },
  { label: '货品名称', prop: 'goodsName', minWidth: 130 },
  ...commonColumn
]

export const categoryTable: TableOption = [
  {
    type: 'index',
    width: 60,
    label: '序号',
    fixed: 'left',
    indexMethod: (index) => index || '合计'
  },
  { label: '货品品类', prop: 'category', minWidth: 130 },
  ...commonColumn
]
