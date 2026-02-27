import * as emoji from 'node-emoji'

export const cellValue = (value: any) => {
  if (value === null || value === undefined || value === '') {
    return '-'
  }

  if (typeof value === 'string') {
    return emoji.emojify(value)
  }

  return value
}
