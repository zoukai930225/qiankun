<script lang="tsx">
import {
  computed,
  defineComponent,
  onMounted,
  PropType,
  ref,
  unref,
  watch,
  getCurrentInstance,
  provide
} from 'vue'
import { ElCol, ElForm, ElFormItem, ElRow, ElTooltip } from 'element-plus'
import { componentMap, customComponentMap } from './componentMap'
import { propTypes } from '@/utils/propTypes'
import { getSlot } from '@/utils/tsxHelper'
import {
  initSearchFormModel,
  setComponentProps,
  setFormItemSlots,
  setGridProp,
  setItemComponentSlots,
  setTextPlaceholder
} from './helper'
import { useRenderSelect } from './components/useRenderSelect'
import { useRenderRadio } from './components/useRenderRadio'
import { useRenderCheckbox } from './components/useRenderCheckbox'
import { useDesign } from '@/hooks/web/useDesign'
import { findIndex } from '@/utils'
import { set, debounce } from 'lodash-es'
import { FormProps } from './types'
import { Icon } from '@/components/Icon'
import { FormSchema, FormSetPropsType } from '@/types/form'
import { nextFrameTick } from '@/utils/util'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('form')

/**
 * 通用搜索表单组件
 *
 * 新增功能：
 * 1. expandThreshold: 控制展开按钮显示的阈值，默认4个表单项
 * 2. expandText/collapseText: 自定义展开收起按钮文字
 * 3. schema中的customRender: 每个表单项可配置自定义渲染函数
 * 4. expandButton: 插槽，可自定义展开收起按钮的完整渲染
 * 5. autoSearchOnChange: 是否在表单项变化时自动触发搜索（使用组件事件）
 *    - Input/InputNumber组件：按下Enter键时触发搜索
 *    - Select/SelectV2组件：选择变化时触发搜索
 *    - DatePicker组件：日期选择变化时触发搜索
 *    - Radio/Checkbox组件：选择变化时触发搜索
 *    - 搜索按钮：也会使用防抖机制
 *    - 完全兼容componentProps中的原有事件处理函数
 * 6. autoSearchDelay: 自动搜索的防抖延迟时间，默认100ms（使用 lodash debounce）
 *
 * 使用示例：
 * const schema = [
 *   {
 *     field: 'name',
 *     label: '姓名',
 *     component: 'Input',
 *     customRender: (item, model) => <MyCustomComponent v-model={model[item.field]} />
 *   },
 *   {
 *     field: 'status',
 *     label: '状态',
 *     component: 'Select',
 *     // 不设置customRender则使用默认渲染
 *   }
 * ]
 *
 * <SWSearchForm
 *   :expand-threshold="5"
 *   expand-text="更多筛选"
 *   collapse-text="简化筛选"
 *   :auto-search-on-change="true"
 *   :auto-search-delay="150"
 *   :schema="schema"
 * >
 *   <template #expandButton="{ isExpand, handleExpandClick, expandText, collapseText }">
 *     <el-button @click="handleExpandClick">
 *       {{ isExpand ? collapseText : expandText }}
 *     </el-button>
 *   </template>
 * </SWSearchForm>
 */
export default defineComponent({
  // eslint-disable-next-line vue/no-reserved-component-names
  name: 'Form',

  props: {
    // 生成Form的布局结构数组
    schema: {
      type: Array as PropType<FormSchema[]>,
      default: () => []
    },
    // 是否需要栅格布局
    // update by 芋艿：将 true 改成 false，因为项目更常用这种方式
    isCol: propTypes.bool.def(false),
    // 表单数据对象
    model: {
      type: Object as PropType<Recordable>,
      default: () => ({})
    },
    // 是否自动设置placeholder
    autoSetPlaceholder: propTypes.bool.def(true),
    // 是否自定义内容
    isCustom: propTypes.bool.def(false),
    // 表单label宽度
    labelWidth: propTypes.oneOfType([String, Number]).def('75'),
    // 是否 loading 数据中 add by 芋艿
    vLoading: propTypes.bool.def(false),
    // 搜索按钮对齐方式
    searchButtonAlign: propTypes.oneOf(['left', 'right']).def('right'),
    // 默认显示的表单项数量，超过这个数量的表单项会被折叠
    defaultShowItemCount: propTypes.number.def(3),
    // 是否显示展开/收起按钮
    showExpand: propTypes.bool.def(true),
    // 展开收起按钮的阈值，超过这个数量才显示展开按钮
    expandThreshold: propTypes.number.def(4),
    // 展开按钮文字自定义
    expandText: propTypes.string.def('展开'),
    // 收起按钮文字自定义
    collapseText: propTypes.string.def('收起'),
    // 是否显示搜索按钮区域
    showSearch: propTypes.bool.def(true),
    // 新增：是否显示“搜索”按钮
    showSearchButton: propTypes.bool.def(true),
    // 新增：是否显示“重置”按钮
    showResetButton: propTypes.bool.def(true),
    // 是否在表单项变化时自动触发搜索
    autoSearchOnChange: propTypes.bool.def(false),
    // 自动搜索的防抖时间（毫秒），仅在 autoSearchOnChange 为 true 时生效
    autoSearchDelay: propTypes.number.def(100),
    // 新增：是否默认展开所有搜索项
    defaultExpandAll: propTypes.bool.def(false)
  },
  emits: ['register', 'search', 'reset'],
  setup(props, { slots, expose, emit }) {
    // element form 实例
    const elFormRef = ref<ComponentRef<typeof ElForm>>()
    // 获取当前组件实例以访问 $refs
    const instance = getCurrentInstance()

    // 是否展开更多（新增：支持默认从 props 初始化，并响应外部变更）
    const isExpand = ref<boolean>(props.defaultExpandAll)

    // useForm传入的props
    const outsideProps = ref<FormProps>({})

    const mergeProps = ref<FormProps>({})

    const getProps = computed(() => {
      const propsObj = { ...props }
      Object.assign(propsObj, unref(mergeProps))
      return propsObj
    })

    // 当外部通过 setProps 或 props 改变 defaultExpandAll 时，同步内部展开状态
    watch(
      () => unref(getProps).defaultExpandAll,
      (val) => {
        isExpand.value = !!val
      },
      { immediate: false }
    )

    // 表单数据
    const formModel = ref<Recordable>({})

    onMounted(() => {
      emit('register', unref(elFormRef)?.$parent, unref(elFormRef))
    })

    // 对表单赋值
    const setValues = (data: Recordable = {}) => {
      formModel.value = Object.assign(unref(formModel), data)
    }

    const setProps = (props: FormProps = {}) => {
      mergeProps.value = Object.assign(unref(mergeProps), props)
      outsideProps.value = props
    }

    const delSchema = (field: string) => {
      const { schema } = unref(getProps)

      const index = findIndex(schema, (v: FormSchema) => v.field === field)
      if (index > -1) {
        schema.splice(index, 1)
      }
    }

    const addSchema = (formSchema: FormSchema, index?: number) => {
      const { schema } = unref(getProps)
      if (index !== void 0) {
        schema.splice(index, 0, formSchema)
        return
      }
      schema.push(formSchema)
    }

    const setSchema = (schemaProps: FormSetPropsType[]) => {
      const { schema } = unref(getProps)
      for (const v of schema) {
        for (const item of schemaProps) {
          if (v.field === item.field) {
            set(v, item.path, item.value)
          }
        }
      }
    }

    const getElFormRef = (): ComponentRef<typeof ElForm> => {
      return unref(elFormRef) as ComponentRef<typeof ElForm>
    }

    const resetFields = () => {
      getElFormRef().resetFields()
      const formList = unref(getProps).schema
      for (let i = 0; i < formList.length; i++) {
        const item = formList[i]
        if (!customComponentMap.includes(item.component || '')) {
          continue
        }
        const refTarget = (instance?.refs as any)?.[item.field] as any
        const compRef = Array.isArray(refTarget) ? refTarget[0] : refTarget

        if (compRef && typeof compRef.resetField === 'function') {
          // console.log('resetField', compRef.resetField)
          compRef.resetField()
        }
      }
      // console.log('resetFields', formModel.value)
      return unref(formModel)
    }

    // 监听表单结构化数组，重新生成formModel
    watch(
      () => unref(getProps).schema,
      (schema = []) => {
        formModel.value = initSearchFormModel(schema, unref(formModel))
      },
      {
        immediate: true,
        deep: true
      }
    )

    const onSearch = () => {
      emit('search', unref(formModel))
    }

    // 使用 lodash debounce 创建防抖搜索函数
    const debouncedSearch = computed(() => {
      const { autoSearchDelay } = unref(getProps)
      return debounce(() => {
        onSearch()
      }, autoSearchDelay)
    })

    // 提供搜索函数给子组件使用
    provide('triggerSearch', () => {
      debouncedSearch.value()
    })

    // 处理展开/收起
    const handleExpandClick = (bol: boolean = true) => {
      isExpand.value = bol ? !isExpand.value : bol
    }

    // 获取可见的schema
    const visibleSchema = computed(() => {
      const { schema = [], showExpand, expandThreshold } = unref(getProps)
      const visibleItems = schema.filter((v) => !v.hidden)

      // 如果不显示展开按钮，或已展开，或表单项数量不超过阈值，则显示全部
      if (!showExpand || isExpand.value || visibleItems.length <= expandThreshold) {
        return visibleItems
      }

      // 收起时只显示阈值数量的表单项
      return visibleItems.slice(0, expandThreshold)
    })

    // 渲染包裹标签，是否使用栅格布局
    const renderWrap = () => {
      const { isCol } = unref(getProps)
      const content = isCol ? (
        <ElRow gutter={20}>{renderFormItemWrap()}</ElRow>
      ) : (
        renderFormItemWrap()
      )
      return content
    }

    // 是否要渲染el-col
    const renderFormItemWrap = () => {
      // hidden属性表示隐藏，不做渲染
      const { isCol } = unref(getProps)
      const schema = unref(visibleSchema)

      return schema.map((item) => {
        // 如果是 Divider 组件，需要自己占用一行
        const isDivider = item.component === 'Divider'
        const Com = componentMap['Divider'] as ReturnType<typeof defineComponent>
        return isDivider ? (
          <Com {...{ contentPosition: 'left', ...item.componentProps }}>{item?.label}</Com>
        ) : isCol ? (
          // 如果需要栅格，需要包裹 ElCol
          <ElCol {...setGridProp(item.colProps)}>{renderFormItem(item)}</ElCol>
        ) : (
          renderFormItem(item)
        )
      })
    }

    // 渲染formItem
    const renderFormItem = (item: FormSchema) => {
      // 单独给只有options属性的组件做判断
      const notRenderOptions = ['SelectV2', 'Cascader', 'Transfer']
      const slotsMap: Recordable = {
        ...setItemComponentSlots(slots, item?.componentProps?.slots, item.field)
      }
      if (
        item?.component !== 'SelectV2' &&
        item?.component !== 'Cascader' &&
        item?.componentProps?.options
      ) {
        slotsMap.default = () => renderOptions(item)
      }

      const formItemSlots: Recordable = setFormItemSlots(slots, item.field)
      // 如果 schema 提供 renderLabel，则优先使用 label 插槽渲染
      if (typeof item?.renderLabel === 'function') {
        formItemSlots.label = () => item.renderLabel!(item, formModel.value)
      } else if (item?.labelMessage) {
        // 否则，如果有 labelMessage，使用带提示的 label 插槽
        formItemSlots.label = () => {
          return (
            <span class="label-with-tooltip">
              <span>{item.label}</span>
              <ElTooltip placement="right" raw-content>
                {{
                  content: () => <span v-dompurify-html={item.labelMessage}></span>,
                  default: () => (
                    <Icon
                      icon="ep:warning"
                      size={16}
                      color="var(--el-color-primary)"
                      class="relative top-1px ml-2px"
                    ></Icon>
                  )
                }}
              </ElTooltip>
            </span>
          )
        }
      }
      // 计算 schema 级 label 宽度（支持 labelWidth / labelwidth），优先于 formItemProps.labelWidth
      const schemaLabelWidth = (item as any).labelWidth ?? (item as any).labelwidth
      const resolvedLabelWidth = schemaLabelWidth ?? item.formItemProps?.labelWidth

      return (
        <ElFormItem
          {...(item.formItemProps || {})}
          class={[
            (item.label || '').length > 4 ? (item.isNoHalf ? '' : 'half-label') : '',
            (item.formItemProps as any)?.class,
            item.class
          ]}
          {...(item.field ? { prop: item.field } : {})}
          label={item.label || ''}
          {...(resolvedLabelWidth !== undefined ? { labelWidth: resolvedLabelWidth } : {})}
        >
          {{
            ...formItemSlots,
            default: () => {
              const { autoSetPlaceholder } = unref(getProps)

              // 如果有自定义插槽，优先使用插槽
              if (slots[item.field]) {
                return getSlot(slots, item.field, formModel.value)
              }

              // 如果该表单项有自定义渲染函数，使用自定义渲染
              if (item.customRender && typeof item.customRender === 'function') {
                return item.customRender(item, formModel.value)
              }

              // 默认渲染逻辑
              const Com = componentMap[item.component as string] as ReturnType<
                typeof defineComponent
              >

              const componentProps = setComponentProps(item)

              // 获取处理后的自动搜索事件，兼容 setComponentProps 处理后的事件
              const getEnhancedAutoSearchEvents = () => {
                const { autoSearchOnChange } = unref(getProps)
                if (!autoSearchOnChange) return {}

                const events: Recordable = {}

                // Input/InputNumber 组件：Enter 键触发搜索
                if (['Input', 'InputNumber'].includes(item.component as string)) {
                  const originalKeyup = componentProps.onKeyup
                  events.onKeyup = (e: KeyboardEvent) => {
                    // 先执行 setComponentProps 处理后的 keyup 事件
                    if (originalKeyup && typeof originalKeyup === 'function') {
                      originalKeyup(e)
                    }
                    // 如果是 Enter 键，触发搜索
                    if (e.key === 'Enter') {
                      {
                        /* console.log('Input Enter 键触发搜索') */
                      }
                      debouncedSearch.value()
                    }
                  }
                  // 点击清空按钮时触发搜索（同时保留原有 onClear 行为）
                  const originalClear = componentProps.onClear
                  events.onClear = (...args: any[]) => {
                    if (originalClear && typeof originalClear === 'function') {
                      originalClear(...args)
                    }
                    debouncedSearch.value()
                  }
                }

                // Select/SelectV2/Cascader 组件：change 事件触发搜索
                if (['Select', 'SelectV2', 'Cascader'].includes(item.component as string)) {
                  const originalChange = componentProps.onChange
                  events.onChange = (...args: any[]) => {
                    // 先执行 setComponentProps 处理后的 change 事件
                    if (originalChange && typeof originalChange === 'function') {
                      originalChange(...args)
                    }
                    // 触发搜索
                    {
                      /* console.log('Select change 触发搜索') */
                    }
                    debouncedSearch.value()
                  }
                }

                // DatePicker 组件：change 事件触发搜索
                if (
                  ['DatePicker', 'DateTimePicker', ...customComponentMap].includes(
                    item.component as string
                  )
                ) {
                  const originalChange = componentProps.onChange
                  events.onChange = (...args: any[]) => {
                    // 先执行 setComponentProps 处理后的 change 事件
                    if (originalChange && typeof originalChange === 'function') {
                      originalChange(...args)
                    }
                    // 触发搜索
                    {
                      /* console.log('DatePicker change 触发搜索') */
                    }
                    debouncedSearch.value()
                  }
                }

                // Radio/Checkbox 组件：change 事件触发搜索
                if (
                  ['Radio', 'RadioButton', 'Checkbox', 'CheckboxButton'].includes(
                    item.component as string
                  )
                ) {
                  const originalChange = componentProps.onChange
                  events.onChange = (...args: any[]) => {
                    // 先执行 setComponentProps 处理后的 change 事件
                    if (originalChange && typeof originalChange === 'function') {
                      originalChange(...args)
                    }
                    // 触发搜索
                    {
                      /* console.log('Radio/Checkbox change 触发搜索') */
                    }
                    debouncedSearch.value()
                  }
                }

                return events
              }

              const enhancedAutoSearchEvents = getEnhancedAutoSearchEvents()

              // 合并组件属性和增强的自动搜索事件
              const mergedProps = {
                ...componentProps,
                ...enhancedAutoSearchEvents
              }

              return (
                <Com
                  ref={item.field}
                  model={formModel.value}
                  vModel={formModel.value[item.field]}
                  initValue={item.value}
                  {...(autoSetPlaceholder && setTextPlaceholder(item))}
                  {...mergedProps}
                  style={item.componentProps?.style}
                  {...(notRenderOptions.includes(item?.component as string) &&
                  item?.componentProps?.options
                    ? { options: item?.componentProps?.options || [] }
                    : {})}
                >
                  {{ ...slotsMap }}
                </Com>
              )
            }
          }}
        </ElFormItem>
      )
    }

    // 渲染options
    const renderOptions = (item: FormSchema) => {
      switch (item.component) {
        case 'Select':
        case 'SelectV2':
          const { renderSelectOptions } = useRenderSelect(slots)
          return renderSelectOptions(item)
        case 'Radio':
        case 'RadioButton':
          const { renderRadioOptions } = useRenderRadio()
          return renderRadioOptions(item)
        case 'Checkbox':
        case 'CheckboxButton':
          const { renderCheckboxOptions } = useRenderCheckbox()
          return renderCheckboxOptions(item)
        default:
          break
      }
    }

    // 过滤传入Form组件的属性
    const getFormBindValue = () => {
      // 避免在标签上出现多余的属性
      const delKeys = [
        'schema',
        'isCol',
        'autoSetPlaceholder',
        'isCustom',
        'model',
        'defaultShowItemCount',
        'showExpand',
        'expandThreshold',
        'expandText',
        'collapseText',
        'autoSearchOnChange',
        'autoSearchDelay',
        'defaultExpandAll',
        'showSearchButton',
        'showResetButton'
      ]
      const props = { ...unref(getProps) }
      for (const key in props) {
        if (delKeys.indexOf(key) !== -1) {
          delete props[key]
        }
      }
      return props
    }

    // 防抖版本的搜索函数（用于搜索按钮）
    const onSearchWithDebounce = () => {
      debouncedSearch.value()
    }

    const onReset = async () => {
      // 取消防抖搜索
      debouncedSearch.value.cancel()
      resetFields()
      // reset 只做reset操作
      emit('reset')
      await nextFrameTick()
      emit('search', unref(formModel), true)
    }

    // 判断是否需要显示展开按钮
    const showExpandButton = computed(() => {
      const { schema = [], showExpand, expandThreshold } = unref(getProps)
      const visibleItems = schema.filter((v) => !v.hidden)
      // 根据自定义阈值决定是否显示展开按钮
      return showExpand && visibleItems.length > expandThreshold
    })

    expose({
      setValues,
      formModel,
      setProps,
      delSchema,
      addSchema,
      setSchema,
      getElFormRef,
      handleExpandClick,
      isExpand,
      resetFields,
      search: onSearch,
      reset: onReset,
      getFormModel: () => unref(formModel)
    })

    return () => (
      <div class="sw-search flex justify-between items-start">
        <div class="flex flex-wrap">
          <ElForm
            ref={elFormRef}
            {...getFormBindValue()}
            model={props.isCustom ? props.model : formModel}
            class={prefixCls}
            v-loading={props.vLoading}
            inline={true}
          >
            {{
              // 如果需要自定义，就什么都不渲染，而是提供默认插槽
              default: () => {
                const { isCustom } = unref(getProps)
                return isCustom ? getSlot(slots, 'default') : renderWrap()
              }
            }}
          </ElForm>
        </div>
        {props.showSearch && (
          <div
            class="flex items-center flex-nowrap flex-shrink-0"
            style={props.searchButtonAlign === 'left' ? 'margin-left: 16px' : ''}
          >
            <div class="commonTopFilterWrap-search-container">
              {(props.showSearchButton || props.showResetButton) && (
                <div class="search-buttons-group">
                  {props.showSearchButton && (
                    <el-button onClick={onSearchWithDebounce} class="commonSearchBtn">
                      <Icon class="commonSearchBtnIcon" size={12} icon="ep:search" />
                      搜索
                    </el-button>
                  )}
                  {props.showResetButton && (
                    <el-button onClick={onReset} class="commonResetBtn">
                      重置
                    </el-button>
                  )}
                </div>
              )}
              {slots.default && (
                <div class="custom-buttons ml-8px">
                  {/* 自定义按钮插槽 */}
                  {slots.default()}
                </div>
              )}
              {unref(showExpandButton) && (
                <div class="expand-button-wrapper">
                  {slots.expandButton ? (
                    getSlot(slots, 'expandButton', {
                      isExpand: isExpand.value,
                      handleExpandClick,
                      expandText: props.expandText,
                      collapseText: props.collapseText
                    })
                  ) : (
                    <div class="expand-button" onClick={handleExpandClick}>
                      <span class="expand-text">
                        {isExpand.value ? props.collapseText : props.expandText}
                      </span>
                      <Icon
                        class="expand-icon"
                        icon={isExpand.value ? 'ep:arrow-up' : 'ep:arrow-down'}
                        size={12}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }
})
</script>

<style lang="scss" scoped>
.#{$elNamespace}-form.#{$namespace}-form .#{$elNamespace}-row {
  margin-right: 0 !important;
  margin-left: 0 !important;
}

:deep(.el-form) {
  .el-form-item {
    // margin: 0 20px 18px 0;
    // margin-bottom: unset;
    margin-right: 16px;
    row-gap: 16px;
  }

  .el-select,
  .el-date-editor,
  .el-input {
    width: 235px;
    box-sizing: border-box;

    .el-input__wrapper {
      padding-top: unset;
      padding-bottom: unset;
    }
  }
}

.commonTopFilterWrap-search {
  align-items: flex-start;
}

.commonTopFilterWrap-search-container {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;

  .search-buttons-group {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    flex-shrink: 0;
  }

  .expand-button-wrapper {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    margin-left: 12px;
  }

  .custom-buttons {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  :deep(.el-button) {
    margin-right: unset;
    margin-left: unset;
  }

  .expand-button {
    display: flex;
    align-items: center;
    cursor: pointer;
    color: #0064ff;
    font-size: 14px;
    transition: color 0.3s;
    white-space: nowrap;

    &:hover {
      // 换个颜色
      color: #0064ff;
    }

    .expand-text {
      user-select: none;
    }

    .expand-icon {
      margin-left: 4px;
      transition: transform 0.3s ease;
    }
  }
}

.half-label {
  :deep(.el-form-item__label) {
    line-height: 16px !important;
    text-align: right;
  }
}

:deep(.el-form-item__label) {
  pointer-events: auto !important;
}
</style>
