/** 品类 */
export const categoryOps = [
  { value: 0, label: '女裤' },
  { value: 1, label: '男裤' },
  { value: 2, label: '袜子' },
  { value: 3, label: '内衣' },
  { value: 4, label: '季节品' },
  { value: 5, label: '配饰/女装' },
  { value: 6, label: '胸垫' }
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

/** 编码类型 */
export const codeTypeOps = [
  { value: 1, label: '货品编码' },
  { value: 2, label: '商家编码' }
]

/** 表格 */
export const tableOptions: ProductManage.TableOption = [
  { type: 'selection', fixed: 'left' },
  { label: '日期', prop: 'dataDate', fixed: 'left', width: 120 },
  { label: '图片', prop: 'image', fixed: 'left', width: 100 },
  { label: '品类', prop: 'category', transform: transformCategory },
  { label: '成本', prop: 'costs', transform: retain9, width: 60 },
  { label: '类别', prop: 'type', transform: transformType, width: 60 },
  { label: '季节分类', prop: 'seasonCategory', transform: transformSeasonType },
  { label: '编码', prop: 'productNumber', width: 150 },
  { label: '货品名称', prop: 'productName', width: 250 },
  { label: '库存', prop: 'inventory' },
  { label: '总货值', prop: 'totalCargoValue', transform: formatNumberToWan },
  { label: '昨日销量', prop: 'yesterdaySales' },
  { label: '昨日货值', prop: 'yesterdayCargoValue', transform: formatNumberToWan },
  { label: '七天销量', prop: 'salesSevenDays' },
  { label: '周转天数', prop: 'turnaroundDays' },
  { label: '负责人', prop: 'directorName' },
  { label: '操作', prop: 'operator', align: 'center', width: 100, fixed: 'right' }
]

function transformCategory(val: string | number) {
  return categoryOps.find((ele) => ele.value === val)?.label
}

function transformType(val: string | number) {
  return typeOps.find((ele) => ele.value === val)?.label
}

function transformSeasonType(val: string | number) {
  return seasonCategoryOps.find((ele) => ele.value === val)?.label
}

function formatNumberToWan(num: string | number) {
  const n = num ? Number(num) : 0

  if (n > 1000) {
    const roundedNum = Math.round(n / 100) / 100
    return roundedNum + ' 万'
  } else {
    return Math.round(n * 100) / 100
  }
}

function retain9(num: string | number) {
  const numInWan = +num
  const roundedNum = Math.round(numInWan * 1000000000) / 1000000000
  return roundedNum
}
