import { floatToFixed2 } from '@/utils'

// 格式化金额【分转元】
// @ts-ignore
export const fenToYuanFormat = (_, __, cellValue: any, ___) => {
  return `￥${floatToFixed2(cellValue)}`
}

// 金额格式化增加,
export const priceShowFormat = (value) => {
  return `￥${value}`.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
}

// 数字格式化展示自动拼接,
export const numberFormateShow = (key) => {
  if (!key) {
    return ''
  }
  key += ''
  const x = key.split('.')
  let x1 = x[0]
  const x2 = x.length > 1 ? '.' + x[1] : ''
  const reg = /(\d+)(\d{3})/
  while (reg.test(x1)) {
    x1 = x1.replace(reg, '$1' + ',' + '$2')
  }
  return x1 + x2
}

interface NumberFormatterOptions extends Intl.NumberFormatOptions {
  locale?: string
}
/**
 * 
 * // 1. 数字格式化
const numberFormatter = new Intl.NumberFormat('zh-CN');
numberFormatter.format(123456.78); // "123,456.78"

// 2. 日期时间格式化
const dateFormatter = new Intl.DateTimeFormat('zh-CN');
dateFormatter.format(new Date()); // "2025/10/29"

// 3. 相对时间格式化
const relativeTime = new Intl.RelativeTimeFormat('zh-CN');
relativeTime.format(-1, 'day'); // "1天前"

// 4. 列表格式化
const listFormatter = new Intl.ListFormat('zh-CN');
listFormatter.format(['苹果', '香蕉', '橙子']); // "苹果、香蕉和橙子"

// 5. 货币格式化
const currencyFormatter = new Intl.NumberFormat('zh-CN', {
  style: 'currency',
  currency: 'CNY'
});
currencyFormatter.format(1234.56); // "¥1,234.56"
 */

/**
 * 数字格式化工具方法
 *
 * @param value 需要被格式化的数字（支持字符串或数字）
 * @param options 支持传入 locale 以及标准 Intl.NumberFormatOptions
 * @returns 本地化后的字符串；若 value 不是有效数字，则返回原始值字符串
 */
export const numberFormatter = (value: number | string, options: NumberFormatterOptions = {}) => {
  const num = Number(value)
  if (!Number.isFinite(num)) return String(value ?? '')

  const { locale = 'zh-CN', ...formatOptions } = options

  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...formatOptions
  })

  return formatter.format(num)
}

/**
 * 尝试解析 JSON 字符串并格式化显示
 * @param value 需要处理的值（通常是后端返回的字符串）
 * @param formatter 针对数组中每一项的格式化函数
 * @param separator 数组连接符，默认为空格
 * @returns 格式化后的字符串
 */
export const tryParseJsonString = (
  value: unknown,
  formatter: (item: any) => string,
  separator: string = ' '
): string => {
  // 1. 空值处理
  if (value === null || value === undefined) {
    return ''
  }

  // 2. 如果是字符串且看似 JSON (以 [ 或 { 开头)
  if (typeof value === 'string' && (value.trim().startsWith('[') || value.trim().startsWith('{'))) {
    try {
      const parsed = JSON.parse(value)

      // 3. 仅当解析结果为数组时，使用 formatter 进行处理
      if (Array.isArray(parsed)) {
        return parsed.map(formatter).join(separator)
      }

      // 如果解析出来是对象，目前保持原样返回
    } catch (e) {
      // 解析失败，忽略错误，走下方默认返回
      console.warn('JSON Parse Warning:', e)
    }
  }

  // 4. 默认返回字符串形式
  return String(value)
}
