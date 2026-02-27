/*
 * @Date: 2025-01-03 18:26:34
 */

import { format } from 'date-fns'

// 0 文本 1 数字 2 单选 3 多选 4 日期 5 日期时间 6 开关
export const componentMap = {
  0: 'el-input',
  1: 'el-input-number',
  2: 'el-select',
  3: 'el-select',
  4: 'el-date-picker',
  5: 'el-date-picker',
  6: 'el-switch'
}

export const componentTypeMap = {
  0: 'text',
  1: 'undefined',
  2: 'single',
  3: 'undefined',
  4: 'date',
  5: 'datetime',
  6: 'undefined'
}

/**
 * @description: 时间格式化函数
 * @param {*} dateString 时间字符串
 * @param {*} formatString 格式化字符串
 * @return {*}
 */
export const formatCustomDate = (dateString, formatString = 'yyyy-MM-dd') => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return format(date, formatString)
}

export const formattedDates = (dates) => {
  return dates.map((dateStr) => {
    const date = new Date(dateStr)
    const formatter = new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: 'long' })
    return formatter.format(date)
  })
}
