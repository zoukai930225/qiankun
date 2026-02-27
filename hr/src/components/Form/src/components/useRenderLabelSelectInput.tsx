import { defineComponent, ref, computed, watch, inject } from 'vue'
import type { PropType } from 'vue'
import { ElInput, ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus'
import { Icon } from '@/components/Icon'

export interface LabelSelectOption {
  label: string
  field: string
  placeholder?: string
  active?: boolean
}

export interface LabelSelectInputProps {
  options: LabelSelectOption[]
  defaultField?: string
  trigger?: 'click' | 'hover'
  style?: Record<string, any>
  className?: string
  // 当切换字段时，是否清空输入框
  clearOnSwitch?: boolean
  // 受控：当前选中的字段，由父级控制（配合 onUpdate:selectedField 使用）
  selectedField?: string
  // 新增：左侧标签（选择器）宽度
  labelWidth?: string | number
}

export const useRenderLabelSelectInput = () => {
  const LabelSelectInput = defineComponent({
    name: 'LabelSelectInput',
    props: {
      // 外部 formModel
      model: {
        type: Object as PropType<Record<string, any>>,
        default: () => ({})
      },
      // v-model 值（供表单内部占位使用，不参与查询）
      modelValue: {
        type: [String, Number] as PropType<string | number>,
        default: ''
      },
      initValue: {
        type: [String, Number] as PropType<string | number>,
        default: ''
      },
      options: {
        type: Array as PropType<LabelSelectOption[]>,
        default: () => []
      },
      defaultField: {
        type: String as PropType<string>,
        default: ''
      },
      trigger: {
        type: String as PropType<'click' | 'hover'>,
        default: 'click'
      },
      clearOnSwitch: {
        type: Boolean,
        default: false
      },
      style: {
        type: Object as PropType<Record<string, any>>,
        default: () => ({})
      },
      className: {
        type: String as PropType<string>,
        default: ''
      },
      onChange: {
        type: Function as PropType<(val: any) => void>,
        default: null
      },
      selectedField: {
        type: String as PropType<string | undefined>,
        default: undefined
      },
      labelWidth: {
        type: [String, Number] as PropType<string | number>,
        default: 'auto'
      }
    },
    emits: ['update:modelValue', 'change', 'update:selectedField'],
    setup(props, { emit, expose, attrs }) {
      // 注入搜索函数
      const triggerSearch = inject<(() => void) | undefined>('triggerSearch', undefined)

      // 非受控时使用的内部选中字段
      const internalSelectedField = ref<string>('')
      const innerValue = ref<string | number>('')

      const resolveInitialField = (): string => {
        if (props.defaultField) return props.defaultField
        const activeOpt = (props.options || []).find((opt) => opt.active)
        if (activeOpt) return activeOpt.field
        return props.options?.[0]?.field || ''
      }

      const effectiveSelectedField = computed<string>(() => {
        return (props.selectedField ?? internalSelectedField.value) || ''
      })

      // 当前选中项
      const currentOption = computed<LabelSelectOption | null>(() => {
        const list = props.options || []
        const found = list.find((i) => i.field === effectiveSelectedField.value)
        return found || list[0] || null
      })

      const currentPlaceholder = computed<string>(() => {
        return currentOption.value?.placeholder ?? ''
      })

      const updateModelForSelectedField = (val: any) => {
        const list = props.options || []
        for (const opt of list) {
          if (opt.field === effectiveSelectedField.value) {
            ;(props.model as any)[opt.field] = val
          } else {
            // 为避免多个字段同时生效，清空其它字段
            ;(props.model as any)[opt.field] = ''
          }
        }
      }

      const selectField = (field: string) => {
        if (!field || field === effectiveSelectedField.value) return
        // 受控：通知父级更新
        emit('update:selectedField', field)
        // 非受控：内部同步
        if (props.selectedField === undefined) {
          internalSelectedField.value = field
        }
        if (props.clearOnSwitch) {
          innerValue.value = ''
          emit('update:modelValue', '')
          updateModelForSelectedField('')
        } else {
          // 切换到已有字段时，回显对应值
          const val = (props.model as any)?.[field]
          innerValue.value = (val ?? '') as any
          emit('update:modelValue', innerValue.value)
        }
        // 切换字段也视为一次变化，便于自动搜索
        // emit('change', innerValue.value)
        // if (typeof (props as any).onChange === 'function') {
        //   ; (props as any).onChange(innerValue.value)
        // }
      }

      const handleInput = (val: any) => {
        innerValue.value = val
        emit('update:modelValue', val)
        updateModelForSelectedField(val)
        // emit('change', val)
        // if (typeof (props as any).onChange === 'function') {
        //   ;(props as any).onChange(val)
        // }
      }

      // 处理回车键按下事件
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
          event.preventDefault()
          // 触发搜索
          if (triggerSearch) {
            triggerSearch()
          }
        }
      }

      // 初始化内部 selectedField（仅在非受控时）
      if (props.selectedField === undefined) {
        internalSelectedField.value = resolveInitialField()
      }
      innerValue.value = ((props.model as any)?.[effectiveSelectedField.value] ??
        props.modelValue ??
        props.initValue) as any

      // 外部变更 modelValue 时，同步内部值并写回对应字段
      watch(
        () => props.modelValue,
        (v) => {
          innerValue.value = v as any
          updateModelForSelectedField(v)
        }
      )

      // 外部受控切换字段时，回显对应值
      watch(
        () => props.selectedField,
        (v) => {
          if (v === undefined) return
          const val = (props.model as any)?.[v]
          innerValue.value = (val ?? '') as any
        }
      )

      expose({
        resetField: () => {
          innerValue.value = ''
          emit('update:modelValue', '')
          updateModelForSelectedField('')
        },
        // 便于外部知晓当前字段
        getCurrentField: () => effectiveSelectedField.value,
        // 暴露手动选择字段的方法（可选）
        selectField
      })

      const getLabelContainerStyle = () => {
        const base: Record<string, any> = {
          display: 'inline-flex',
          alignItems: 'center',
          cursor: 'pointer',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          justifyContent: 'flex-end'
        }
        if (props.labelWidth !== 'auto') {
          const w =
            typeof props.labelWidth === 'number' ? `${props.labelWidth}px` : props.labelWidth
          base.width = w
        }
        return base
      }

      return () => {
        return (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
            <ElDropdown trigger={props.trigger} onCommand={selectField}>
              {{
                default: () => (
                  <span style={getLabelContainerStyle()}>
                    <span>{currentOption.value?.label}</span>
                    <Icon class="ml-4px" icon="ep:arrow-down" size={12} />
                  </span>
                ),
                dropdown: () => (
                  <ElDropdownMenu>
                    {(props.options || []).map((opt) => (
                      <ElDropdownItem
                        key={opt.field}
                        command={opt.field}
                        disabled={opt.field === effectiveSelectedField.value}
                      >
                        {opt.label}
                      </ElDropdownItem>
                    ))}
                  </ElDropdownMenu>
                )
              }}
            </ElDropdown>
            <ElInput
              class={props.className}
              style={props.style}
              modelValue={innerValue.value as any}
              {...{ 'onUpdate:modelValue': handleInput }}
              placeholder={currentPlaceholder.value}
              clearable
              {...attrs}
              onClear={(e: any) => {
                ;(attrs as any)?.onClear?.(e)
                emit('change', '')
                props.onChange?.('')
              }}
              onKeyup={(e: KeyboardEvent) => {
                ;(attrs as any)?.onKeyup?.(e)
                handleKeyDown(e)
              }}
            />
          </div>
        )
      }
    }
  })

  return { LabelSelectInput }
}
