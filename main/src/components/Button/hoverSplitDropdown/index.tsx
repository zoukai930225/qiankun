import { defineComponent, PropType, ref, computed, onMounted, nextTick, onBeforeUnmount } from 'vue'
import { ElButton, ElButtonGroup, ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus'
import { Icon } from '@/components/Icon'
import { checkPermi } from '@/utils/permission'
import './index.css'

export type HoverSplitItem = {
  label: string
  value?: string | number | Record<string, any>
  disabled?: boolean
  divided?: boolean
  icon?: string
  permission?: string | string[]
  active?: boolean
}

export default defineComponent({
  name: 'HoverSplitDropdown',
  props: {
    // 左侧主按钮文本
    mainText: { type: String, default: '新建' },
    // element plus 按钮类型
    mainType: {
      type: String as PropType<'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default'>,
      default: 'primary'
    },
    // 下拉菜单项
    items: { type: Array as PropType<HoverSplitItem[]>, default: () => [] },
    // 是否点击菜单后自动关闭
    hideOnClick: { type: Boolean, default: true },
    // 下拉触发方式，默认 hover
    trigger: { type: String as PropType<'hover' | 'click' | 'contextmenu'>, default: 'hover' },
    // 下拉弹层定位
    placement: {
      type: String as PropType<
        'bottom' | 'bottom-start' | 'bottom-end' | 'top' | 'top-start' | 'top-end'
      >,
      default: 'bottom'
    },
    // 是否显示向下箭头按钮的图标
    arrowIcon: { type: String, default: 'ep:arrow-down' },
    // 激活项在菜单中的指示图标
    activeIcon: { type: String, default: 'ep:check' }
  },
  emits: ['click', 'select', 'command'],
  setup(props, { slots, emit }) {
    const wrapperRef = ref<HTMLElement | null>(null)
    const rightBtnRef = ref<any>(null)
    const popperOptions = ref<Record<string, any>>()

    const updatePopperSkidding = () => {
      const wrapperEl = wrapperRef.value
      const rightBtnEl = rightBtnRef.value?.$el || rightBtnRef.value
      if (!wrapperEl || !rightBtnEl) return
      const groupWidth = (wrapperEl as HTMLElement).offsetWidth || 0
      const rightWidth = (rightBtnEl as HTMLElement).offsetWidth || 0
      const skidding = -Math.max(0, (groupWidth - rightWidth) / 2)
      popperOptions.value = {
        modifiers: [
          {
            name: 'offset',
            options: { offset: [skidding, 5] }
          }
        ]
      }
    }

    const onResize = () => updatePopperSkidding()

    onMounted(async () => {
      await nextTick()
      updatePopperSkidding()
      window.addEventListener('resize', onResize)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', onResize)
    })

    const onMainClick = () => {
      let cmd: unknown | undefined
      const currentExists =
        activeValue.value !== undefined &&
        visibleItems.value.some((i) => (i.value ?? i.label) === activeValue.value)
      if (activeValue.value !== undefined && currentExists) {
        cmd = activeValue.value
      } else {
        const fallback = visibleItems.value.find((i) => !i.disabled)
        if (fallback) {
          cmd = fallback.value ?? fallback.label
        }
      }
      if (cmd !== undefined) {
        onCommand(cmd)
      } else {
        emit('click')
      }
    }

    const onCommand = (cmd: unknown) => {
      activeValue.value = cmd
      emit('select', cmd)
      emit('command', cmd)
      nextTick(() => updatePopperSkidding())
    }

    const visibleItems = computed(() => {
      return props.items.filter((item) => {
        if (!item?.permission) return true
        const permArray = Array.isArray(item.permission) ? item.permission : [item.permission]
        console.log(permArray, 'permArray', checkPermi(permArray))
        return checkPermi(permArray)
      })
    })

    const initialActive = visibleItems.value.find((i) => i?.active)
    const activeValue = ref<unknown>(
      initialActive ? (initialActive.value ?? initialActive.label) : undefined
    )

    const activeItem = computed(() => {
      if (activeValue.value !== undefined) {
        return visibleItems.value.find((i) => (i.value ?? i.label) === activeValue.value)
      }
      return visibleItems.value.find((i) => i?.active)
    })

    const getActiveItem = () => activeItem.value

    const renderMenu = () => {
      if (slots.menu) return slots.menu()
      return (
        <ElDropdownMenu>
          {visibleItems.value.map((item) => {
            const itemCommand = item.value ?? item.label
            const isActive =
              activeValue.value !== undefined ? activeValue.value === itemCommand : !!item.active
            return (
              <ElDropdownItem
                command={itemCommand}
                disabled={item.disabled}
                divided={item.divided}
                class={isActive ? 'is-active' : undefined}
                style={isActive ? { color: 'var(--el-color-primary)' } : undefined}
              >
                {{
                  default: () => (
                    <span style="display: inline-flex; align-items: center; gap: 6px;">
                      {item.icon ? <Icon icon={item.icon} size={14} /> : null}
                      <span>{item.label}</span>
                    </span>
                  )
                }}
              </ElDropdownItem>
            )
          })}
        </ElDropdownMenu>
      )
    }

    // 允许自定义左侧按钮内容
    const renderMain = () => {
      if (slots.default) return slots.default()
      const activeItem = getActiveItem()
      if (activeItem?.label) return <span>{activeItem.label}</span>
      // 如果没有激活项，默认取 items 中的第一个
      if (visibleItems.value?.length && visibleItems.value[0]?.label) {
        return <span>{visibleItems.value[0].label}</span>
      }
      return <span>{props.mainText}</span>
    }

    return () => (
      <div class="hover-split-dropdown inline-flex items-center" ref={wrapperRef}>
        <ElButtonGroup>
          <ElButton type={props.mainType} onClick={onMainClick}>
            {renderMain()}
          </ElButton>
          <ElDropdown
            trigger={props.trigger}
            hideOnClick={props.hideOnClick}
            placement={props.placement}
            onCommand={onCommand}
            popperClass="hover-split-dropdown-popper"
            popperOptions={popperOptions.value as any}
          >
            {{
              default: () => (
                <ElButton type={props.mainType} class="hsd-right-btn" ref={rightBtnRef}>
                  <span class="hsd-divider" />
                  <Icon icon={props.arrowIcon} size={12} />
                </ElButton>
              ),
              dropdown: () => renderMenu()
            }}
          </ElDropdown>
        </ElButtonGroup>
      </div>
    )
  }
})
