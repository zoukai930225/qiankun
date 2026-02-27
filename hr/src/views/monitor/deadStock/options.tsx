/** 品类 */
export const categoryOps = [
  { value: 0, label: '女裤' },
  { value: 1, label: '男裤' },
  { value: 2, label: '袜子' },
  { value: 3, label: '内衣' },
  { value: 4, label: '季节品' },
  // { value: 5, label: '配饰/女装' },
  // { value: 6, label: '胸垫' },
  { value: -1, label: '其他' }
]

/** 类别 */
export const typeOps = [
  { value: 0, label: '滞销' },
  { value: 1, label: '滞卖' }
]

/** 季节品 */
export const seasonCategoryOps = [
  { value: 0, label: '春夏' },
  { value: 1, label: '秋冬' },
  { value: 2, label: '四季品' }
]

/** 滞销滞卖日报表格 */
export const deadStockTable: Monitor.TableOption = [
  { label: '日期', prop: 'dataDate' },
  { label: '品类', prop: 'category', transform: transformCategory },
  { label: '季节分类', prop: 'seasonCategory', transform: transformSeasonType },
  // { label: '类别', prop: 'type', transform: transformType },
  { label: '剩余库存（件）', prop: 'inventory' },
  { label: '剩余成本', prop: 'totalCargoValue', width: 160 },
  { label: '销量', prop: 'yesterdaySales' },
  { label: '已卖货值（元）', prop: 'yesterdayCargoValue', width: 160 },
  { label: '七天销量', prop: 'salesSevenDays' },
  { label: '周转天数', prop: 'turnaroundDays' }
]

/** 库存排名表格 */
export const Top10Table: TableOption = [
  { label: '序号', type: 'index', width: 60 },
  { label: '日期', prop: 'dataDate' },
  { label: '图片', prop: 'image', width: 100, showOverFlowTooltip: false },
  { label: '编码', prop: 'productNumber' },
  { label: '品类', prop: 'category', transform: transformCategory },
  { label: '昨日销量', prop: 'yesterdaySales' },
  { label: '库存（件）', prop: 'inventory' },
  { label: '剩余总货值', prop: 'yesterdayCargoValue' },
  { label: '周转天数', prop: 'turnaroundDays' }
]

/** 滞销滞卖日报统计 */
export const deadStockStatistics = reactive([
  {
    label: '剩余库存总计（件）',
    prop: 'inventory',
    tendency: 'inventoryPercent',
    transform: transformStatistic
  },
  {
    label: '剩余成本总计（元）',
    prop: 'totalCargoValue',
    tendency: 'totalCargoValuePercent',
    transform: transformStatistic
  },
  {
    label: '销量总计（件）',
    prop: 'yesterdaySales',
    tendency: 'yesterdayCargoValuePercent'
  },
  {
    label: '已卖货值总计（元）',
    prop: 'yesterdayCargoValue',
    tendency: 'yesterdaySalesPercent'
  },
  { label: '七天销量总计（件）', prop: 'salesSevenDays', tendency: 'salesSevenDaysPercent' },
  {
    label: '七天货值总计',
    prop: 'cargoValueSevenDays',
    tendency: 'cargoValueSevenDaysPercent',
    transform: transformStatistic
  },
  {
    label: '上月货值总计',
    prop: 'lastMonthCargoValue',
    tendency: 'astMonthCargoValuePercent',
    transform: transformStatistic
  },
  { label: '总周转天数', prop: 'turnaroundDays', tendency: '' }
])

function transformCategory(val: string | number) {
  return categoryOps.find((ele) => ele.value === val)?.label
}

function transformType(val: string | number) {
  return typeOps.find((ele) => ele.value === val)?.label
}

function transformSeasonType(val: string | number) {
  return seasonCategoryOps.find((ele) => ele.value === val)?.label
}

function retain4(num: string | number) {
  const numInWan = +num
  const roundedNum = Math.round(numInWan * 10000) / 10000
  return roundedNum
}

/**数据展示区数值转化方法
 * 数值过万以万展示，数值不过万展示数值，保留两位有效小数
 */
function transformStatistic(value: string) {
  const val = Number(value || 0)
  if (val > 10000) {
    return `${Math.round(val / 100) / 100} 万`
  } else {
    return value
  }
}
