import { defineComponent, PropType, useSlots, VNodeChild } from 'vue'
import Title from '@/components/Title/SectionTitleHeader.vue'
import './index.scss'
import { ElCollapseTransition } from 'element-plus'

type LayoutItem = {
  label: string
  key: string
  right?: () => VNodeChild
  show?: boolean
}

export default defineComponent({
  name: 'FormContentLayout',
  props: {
    layouts: {
      type: Array as PropType<LayoutItem[]>,
      required: true
    }
  },
  setup(props) {
    const slots = useSlots()

    return () => (
      <ul class="sw-form-content-layout">
        {props.layouts.map((layout) => (
          <li class="layout-item" key={layout.key}>
            <div class="layout-title">
              <Title
                title={layout.label}
                v-slots={{
                  default: () => layout.label,
                  right: () => layout.right?.()
                }}
              />
            </div>
            <ElCollapseTransition>
              <div v-show={layout.show ?? true} class="layout-content">
                {slots[layout.key]?.()}
              </div>
            </ElCollapseTransition>
          </li>
        ))}
      </ul>
    )
  }
})
