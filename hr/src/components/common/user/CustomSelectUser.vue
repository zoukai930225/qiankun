
<template>
  <component :is="h(ElSelect, { ...$attrs, ...props, ref: changeRef as any }, $slots)"/>
</template>
<script setup lang="ts">
import type { SelectInstance as ElSelectInputInstance, SelectProps as ElSelectProps } from 'element-plus'
import type { ExtractPublicPropTypes } from 'vue'
import { ElSelect } from 'element-plus'
import { h } from 'vue'

type InputProps = ExtractPublicPropTypes<ElSelectProps> & { }
type InputSlots = InstanceType<typeof ElSelect>['$slots'] & {}
type InputInstance = ElSelectInputInstance & {}

const props = withDefaults(defineProps<InputProps>(), {
     myTest:'dddd'
})
console.log("ddd",props)



const vm = getCurrentInstance()
const changeRef = (inputInstance: InputInstance) => vm!.exposeProxy = vm!.exposed = inputInstance || {}

defineSlots<InputSlots>() // TS插槽类型提示
defineExpose<InputInstance>() //  实例类型提示（组件上的事件）
</script>