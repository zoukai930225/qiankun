
import { numberFormateShow } from '@/utils/formatter'
export const dealNumber = (num: number) => {
  if (num) {
    if (Number(num) === 0) return '0'
    const numAttr = num.toString().split('.')
    if (numAttr.length > 1 && Number(numAttr[1]) > 0) {
      return numberFormateShow(`${numAttr[0]}.${numAttr[1].slice(0, 2)}`)
    }
    return numberFormateShow(num)
  }
  return '-'
}