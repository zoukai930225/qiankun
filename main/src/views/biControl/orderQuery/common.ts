export const vaildList = [
  { id: 1, label: '有效 ', value: '0' },
  { id: 2, label: '无效 ', value: '1' },
]

export const returnWarehouseList = [
  { id: 1, label: '否 ', value: '0' },
  { id: 2, label: '是 ', value: '1' },
]


export const getLabelByValue = (list, value) => {
  return list.find(item => item.value == value)?.label;
}
import { numberFormateShow } from '@/utils/formatter'
export const formatValue = (value: any, key: string) => {
  if (value[key] === null || value[key] === undefined || value[key] === "") {
    return "-"
  }
  return numberFormateShow(value[key]) || value[key]
}
