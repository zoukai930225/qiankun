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

export const isUnsalableOps = [
  { value: 1, label: '是' },
  { value: 0, label: '否' }
]

export const transformCategory = (val: string | number) => {
  return categoryOps.find((ele) => ele.value === val)?.label
}

export const transformType = (val: string | number) => {
  return typeOps.find((ele) => ele.value === val)?.label
}

export const transformSeasonType = (val: string | number) => {
  return seasonCategoryOps.find((ele) => ele.value === val)?.label
}

export const formatNumberToWan = (num: string | number) => {
  const n = num ? Number(num) : 0

  if (n > 1000) {
    const roundedNum = Math.round(n / 100) / 100
    return roundedNum + ' 万'
  } else {
    return Math.round(n * 100) / 100
  }
}

export const retain9 = (num: string | number) => {
  const numInWan = +num
  const roundedNum = Math.round(numInWan * 1000000000) / 1000000000
  return roundedNum
}
