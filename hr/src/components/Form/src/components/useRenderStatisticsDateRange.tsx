import { defineComponent, computed, ref, watch } from 'vue'
import type { PropType } from 'vue'
import { ElDatePicker } from 'element-plus'
import dayjs from 'dayjs'

export interface StatisticsDateRangeProps {
  // 日期格式（用于展示）
  format?: string
  // 前缀文本
  prefix?: string
  // 是否显示括号
  showBrackets?: boolean
  // 自定义样式
  style?: Record<string, any>
  // 自定义类名
  className?: string
  // 标签文本
  label?: string
  // 是否显示日期选择器
  showDatePicker?: boolean
  // 日期选择器类型
  pickerType?:
    | 'date'
    | 'dates'
    | 'datetime'
    | 'datetimerange'
    | 'daterange'
    | 'week'
    | 'month'
    | 'year'
  // 日期选择器占位符
  placeholder?: string | string[]
  // 是否禁用
  disabled?: boolean
  // 日期范围快捷选项
  shortcuts?: Array<{ text: string; value: () => [Date, Date] }>
  // 禁用日期函数
  disabledDate?: (time: Date) => boolean
  // 是否显示清除按钮
  clearable?: boolean
  // 初始默认值
  initValue?: any
}

/**
 * 统计日期范围组件
 * 用于显示统计时间范围，支持单日期和日期范围
 */
export const useRenderStatisticsDateRange = () => {
  const StatisticsDateRange = defineComponent({
    name: 'StatisticsDateRange',
    props: {
      // form表单
      model: {
        type: Object as PropType<any>,
        default: () => ({})
      },
      // v-model 绑定值（对外）
      modelValue: {
        type: [String, Array] as PropType<string | string[]>,
        default: () => []
      },
      // v-model 值格式：传递给 ElDatePicker 的 value-format，默认输出 YYYY-MM-DD 字符串
      valueFormat: {
        type: String as PropType<string>,
        default: 'YYYY-MM-DD'
      },
      diffDays: {
        type: Number,
        default: 0
      },
      diffField: {
        type: String,
        default: ''
      },
      format: {
        type: String,
        default: 'YYYY年MM月DD日'
      },
      prefix: {
        type: String,
        default: '统计时间'
      },
      showBrackets: {
        type: Boolean,
        default: true
      },
      style: {
        type: Object,
        default: () => ({})
      },
      className: {
        type: String,
        default: ''
      },
      label: {
        type: String,
        default: ''
      },
      showDatePicker: {
        type: Boolean,
        default: true
      },
      pickerType: {
        type: String as PropType<
          'date' | 'dates' | 'datetime' | 'datetimerange' | 'daterange' | 'week' | 'month' | 'year'
        >,
        default: 'date'
      },
      placeholder: {
        type: [String, Array] as PropType<string | string[]>,
        default: () => ['开始日期', '结束日期']
      },
      // 新增：初始默认值
      initValue: {
        type: [String, Array] as PropType<string | string[]>,
        default: null
      },
      disabled: {
        type: Boolean,
        default: false
      },
      shortcuts: {
        type: Array as PropType<Array<{ text: string; value: () => [Date, Date] }>>,
        default: () => []
      },
      onChange: {
        type: Function as PropType<(value: any) => void>,
        default: null
      },
      disabledDate: {
        type: Function as PropType<(time: Date) => boolean>,
        default: null
      },
      clearable: {
        type: Boolean,
        default: true
      }
    },
    emits: ['update:modelValue', 'change'],
    setup(props, { emit, expose }) {
      // 日期选择器的值（内部）
      const datePickerValue = ref<any>(null)

      // 根据类型解析实际的 valueFormat
      const resolvedValueFormat = computed<string>(() => {
        return props.pickerType === 'month' ? 'YYYY-MM' : props.valueFormat
      })

      const isRangeType = computed<boolean>(() => {
        return props.pickerType === 'daterange' || props.pickerType === 'datetimerange'
      })

      // 计算生效的天数差：优先使用 diffField 指定的 model 字段，其次使用 props.diffDays
      const effectiveDiffDays = computed<number>(() => {
        if (props.diffField) {
          const rawValue = (props.model as any)?.[props.diffField]
          const numeric = Number(rawValue)
          if (Number.isFinite(numeric)) {
            return numeric
          }
        }
        return props.diffDays
      })

      // 基于 diffDays 计算默认的起止范围（含今日）
      const defaultRange = computed(() => {
        if (effectiveDiffDays.value && effectiveDiffDays.value > 0) {
          const unit = props.pickerType === 'month' ? 'month' : 'day'
          const end = dayjs()
          const start = end.subtract(Math.max(effectiveDiffDays.value - 1, 0), unit as any)
          return { start, end }
        }
        return null
      })

      // 解析默认内部值（优先使用 props.initValue，其次使用 diffDays 推导）
      const resolveDefaultInternalValue = (): any => {
        const def = (props as any).initValue
        const hasDef = !(def === undefined || def === null || def === '')
        if (hasDef) {
          if (isRangeType.value) {
            if (Array.isArray(def)) return def
            // 单值时需要扩展为范围数组
            const unit = props.pickerType === 'month' ? 'month' : 'day'
            if (effectiveDiffDays.value && effectiveDiffDays.value > 0) {
              const end = dayjs(def)
              const start = end.subtract(Math.max(effectiveDiffDays.value - 1, 0), unit as any)
              return [
                start.format(resolvedValueFormat.value),
                end.format(resolvedValueFormat.value)
              ]
            }
            return [def, def]
          } else {
            if (Array.isArray(def)) return def[def.length - 1]
            return def
          }
        }
        if (defaultRange.value) {
          if (isRangeType.value) {
            return [
              defaultRange.value.start.format(resolvedValueFormat.value),
              defaultRange.value.end.format(resolvedValueFormat.value)
            ]
          } else {
            return defaultRange.value.end.format(resolvedValueFormat.value)
          }
        }
        return null
      }

      // 初始化日期选择器的值（当未传入 v-model 时，根据 initValue 或 diffDays 初始化）
      const initDatePickerValue = () => {
        const extVal = props.modelValue as any[]
        if (Array.isArray(extVal) && extVal.length > 0) {
          datePickerValue.value = isRangeType.value ? extVal : extVal[extVal.length - 1]
          return
        }

        datePickerValue.value = resolveDefaultInternalValue()
      }

      // 同步外部 v-model 变化到内部选择器值
      watch(
        () => props.modelValue,
        (val) => {
          if (Array.isArray(val) && val.length > 0) {
            datePickerValue.value = isRangeType.value ? val : val[val.length - 1]
          } else {
            // 当外部清空时，直接清空选择器值
            datePickerValue.value = null
          }
        }
      )

      // 监听 initValue 动态变更：当其后续变为有效值，且外部未提供有效的 modelValue 时，采用它进行初始化
      watch(
        () => props.initValue,
        (val) => {
          const hasDef = !(
            val === undefined ||
            val === null ||
            val === '' ||
            (Array.isArray(val) && val.length === 0)
          )
          if (!hasDef) return

          const externalHasValue = Array.isArray(props.modelValue) && props.modelValue.length > 0
          if (externalHasValue) return

          const newVal = resolveDefaultInternalValue()
          datePickerValue.value = newVal

          let external: any[] = []
          if (Array.isArray(newVal)) {
            external = newVal
          } else if (!(newVal === undefined || newVal === null || newVal === '')) {
            const unit = props.pickerType === 'month' ? 'month' : 'day'
            if (effectiveDiffDays.value && effectiveDiffDays.value > 0) {
              const end = dayjs(newVal)
              const start = end.subtract(Math.max(effectiveDiffDays.value - 1, 0), unit as any)
              external = [
                start.format(resolvedValueFormat.value),
                end.format(resolvedValueFormat.value)
              ]
            } else {
              external = [newVal, newVal]
            }
          }

          emit('update:modelValue', external)
          console.log('external', external)
        }
      )

      // 处理日期选择器变化
      const handleDateChange = (value: any) => {
        datePickerValue.value = value

        // 构造对外的值：
        // - 范围类型：直接透传数组
        // - 单点类型：当存在有效 diff 天数时，输出 [start, end]，否则输出 [value]
        let external: any[] = []
        const hasValue = !(value === undefined || value === null || value === '')
        if (hasValue) {
          if (Array.isArray(value)) {
            external = value
          } else {
            const unit = props.pickerType === 'month' ? 'month' : 'day'
            if (effectiveDiffDays.value && effectiveDiffDays.value > 0) {
              const end = dayjs(value)
              const start = end.subtract(Math.max(effectiveDiffDays.value - 1, 0), unit as any)
              external = [
                start.format(resolvedValueFormat.value),
                end.format(resolvedValueFormat.value)
              ]
            } else {
              external = [value, value]
            }
          }
        }

        emit('update:modelValue', external)
        emit('change', external)
      }

      // 当 pickerType 或 diff 天数变更时，如果当前已经有选择值，则按规则重新计算并对外抛出
      let hasInitialized = false
      watch(
        [() => props.pickerType, () => effectiveDiffDays.value],
        () => {
          if (!hasInitialized) {
            initDatePickerValue()
            hasInitialized = true
            return
          }
          const val = datePickerValue.value
          const hasValue = !(val === undefined || val === null || val === '')
          if (!hasValue) {
            initDatePickerValue()
          } else {
            // 依据当前内部值重新计算对外数组
            if (Array.isArray(val)) {
              emit('update:modelValue', val)
              emit('change', val)
            } else {
              const unit = props.pickerType === 'month' ? 'month' : 'day'
              if (effectiveDiffDays.value && effectiveDiffDays.value > 0) {
                const end = dayjs(val)
                const start = end.subtract(Math.max(effectiveDiffDays.value - 1, 0), unit as any)
                const external = [
                  start.format(resolvedValueFormat.value),
                  end.format(resolvedValueFormat.value)
                ]
                emit('update:modelValue', external)
                // emit('change', external)
              } else {
                emit('update:modelValue', [val, val])
                // emit('change', [val, val])
              }
            }
          }
        },
        { immediate: true }
      )

      // 格式化日期范围显示文本（基于当前值或 diffDays 推导）
      const formatDateRange = computed(() => {
        const unit = props.pickerType === 'month' ? 'month' : 'day'
        const resolvedFormat = props.pickerType === 'month' ? 'YYYY年MM月' : props.format

        // 推导当前的开始/结束
        let start: dayjs.Dayjs | null = null
        let end: dayjs.Dayjs | null = null

        const val = datePickerValue.value as any
        if (val) {
          if (Array.isArray(val) && val.length === 2) {
            start = dayjs(val[0])
            end = dayjs(val[1])
          } else {
            end = dayjs(val)
            if (effectiveDiffDays.value && effectiveDiffDays.value > 0) {
              start = end.subtract(Math.max(effectiveDiffDays.value - 1, 0), unit as any)
            } else {
              start = end
              end = null
            }
          }
        } else if (defaultRange.value) {
          start = defaultRange.value.start
          end = defaultRange.value.end
        }

        if (!start) return ''

        if (!end) {
          // 单日期/月份
          return start.format(resolvedFormat)
        }

        if (unit === 'day') {
          // 判断是否为同一天
          if (start.isSame(end, 'day')) {
            return start.format(resolvedFormat)
          }
          // 判断是否为同一年
          if (start.isSame(end, 'year')) {
            // 判断是否为同一月
            if (start.isSame(end, 'month')) {
              return `${start.format('YYYY年MM月DD日')}-${end.format('DD日')}`
            } else {
              return `${start.format('YYYY年MM月DD日')}-${end.format('MM月DD日')}`
            }
          } else {
            // 不同年份
            return `${start.format(resolvedFormat)}-${end.format(resolvedFormat)}`
          }
        } else {
          // month 粒度的范围
          if (start.isSame(end, 'month')) {
            return start.format('YYYY年MM月')
          }
          if (start.isSame(end, 'year')) {
            return `${start.format('YYYY年MM月')}-${end.format('MM月')}`
          }
          return `${start.format('YYYY年MM月')}-${end.format('YYYY年MM月')}`
        }
      })

      // 完整显示文本
      const displayText = computed(() => {
        const dateText = formatDateRange.value
        if (!dateText) return ''

        const fullText = `${props.prefix}:${dateText}`
        return props.showBrackets ? `( ${fullText} )` : fullText
      })

      // 新增：对外暴露 reset 方法，重置为默认值
      const resetField = () => {
        const val = resolveDefaultInternalValue()
        datePickerValue.value = val

        let external: any[] = []
        const hasValue = !(val === undefined || val === null || val === '')
        if (hasValue) {
          if (Array.isArray(val)) {
            external = val
          } else {
            const unit = props.pickerType === 'month' ? 'month' : 'day'
            if (effectiveDiffDays.value && effectiveDiffDays.value > 0) {
              const end = dayjs(val)
              const start = end.subtract(Math.max(effectiveDiffDays.value - 1, 0), unit as any)
              external = [
                start.format(resolvedValueFormat.value),
                end.format(resolvedValueFormat.value)
              ]
            } else {
              external = [val, val]
            }
          }
        }

        emit('update:modelValue', external)
        // emit('change', external)
      }

      expose({
        resetField
      })

      return () => (
        <div
          class="statistics-date-range-wrapper"
          style={{ display: 'flex', alignItems: 'center', gap: '18px' }}
        >
          {/* 日期选择器 */}
          {props.showDatePicker && (
            <div class="date-picker-section">
              <ElDatePicker
                modelValue={datePickerValue.value}
                {...{ 'onUpdate:modelValue': handleDateChange }}
                type={props.pickerType}
                placeholder={
                  (Array.isArray(props.placeholder)
                    ? props.placeholder[1]
                    : props.placeholder) as any
                }
                disabled={props.disabled}
                shortcuts={props.shortcuts as any}
                disabledDate={props.disabledDate}
                valueFormat={resolvedValueFormat.value}
                clearable={props.clearable}
              />
            </div>
          )}

          {/* 统计日期显示 */}
          {displayText.value && (
            <div
              class="statistics-display-section"
              style={{ display: 'flex', alignItems: 'center' }}
            >
              {props.label && (
                <span
                  class="statistics-date-range-label"
                  style={{ marginRight: '8px', color: '#606266' }}
                >
                  {props.label}:
                </span>
              )}
              <span
                class={`statistics-date-range ${props.className || ''} text-size-12px text-#313131 text-nowrap`}
              >
                {displayText.value}
              </span>
            </div>
          )}
        </div>
      )
    }
  })

  return {
    StatisticsDateRange
  }
}
