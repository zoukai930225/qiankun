// composeComponents.js
import { h, ref, getCurrentInstance, onMounted } from 'vue'

export default function composeComponents(OuterComponent, InnerComponent) {
  return {
    name: `Composed${OuterComponent.name || 'Outer'}_${InnerComponent.name || 'Inner'}`,
    setup(props, { attrs, slots, expose }) {
      const innerRef = ref(null)
      const vm = getCurrentInstance()
      
      // 暴露内部组件实例给父组件
      onMounted(() => {
        if (innerRef.value) {
          console.log("inner", innerRef.value)
          
          // 关键：将内部组件实例暴露给父组件
          if (vm) {
            // 方法1：直接暴露整个内部组件实例
            vm.exposed = innerRef.value
          }
        }
      })
      
      // 定义要暴露给父组件的内容
      const exposed = {}
      if (innerRef.value) {
        Object.assign(exposed, innerRef.value)
      }
      
      // 使用 expose 函数明确暴露内容
      expose(exposed)
      
      return () => h(
        OuterComponent, 
        { ...attrs, ...props },
        {
          default: () => h(InnerComponent, { 
            ...attrs, 
            ...props,
            ref: innerRef
          }, slots)
        }
      )
    }
  }
}