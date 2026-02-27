<script setup lang="ts">
import type {  InputNumberProps  } from 'element-plus'
import type { ExtractPublicPropTypes } from 'vue'
import { ElInputNumber, ElMessage, ElFormItem } from 'element-plus'
import { computed, getCurrentInstance, h } from 'vue'
import {swFormItemProps,computedRulesFn} from '../formItem/formItemService'

// 类型定义
type InputProps = ExtractPublicPropTypes<InputNumberProps>


// 自定义属性类型
type CustomProps ={
  formItem?:boolean
}

type inputPropsOmit = Omit<InputProps, 'prop' |'label'|'placeholder'>

// 合并属性类型
interface PropsType extends swFormItemProps,inputPropsOmit,CustomProps{

}

const props = withDefaults(defineProps<Partial<PropsType>>(), {
  min: -Infinity,
  max: +Infinity,
  controls: false,
  disabledScientific: true,
  required: false,
  placeholder: '请输入',
  validateTrigger: () => ['blur', 'change'],
  customRules: () => [],
  formItem:false
})

const computedRules = computed(() => computedRulesFn(props))

const vm = getCurrentInstance()

// 暴露实例给父组件
const changeRef = (inputInstance: any) => {
   if(vm){
    vm.exposed  = inputInstance
    vm.exposeProxy = inputInstance
   }
}

const handlePaste = (e: ClipboardEvent) => {
  const pastedText = e.clipboardData?.getData('text').trim() || ''
  
  // 验证粘贴内容
  if (!/^-?\d+(\.\d+)?$/.test(pastedText)) {
    ElMessage.warning('粘贴的内容不是有效的数字')
    emit('error', '粘贴的内容不是有效的数字')
    e.preventDefault()
    return
  }
  
  if (/[eE]/.test(pastedText)) {
    ElMessage.warning('禁止粘贴科学计数法数字')
    emit('error', '禁止粘贴科学计数法数字')
    e.preventDefault()
    return 
  }
}
const attrs = useAttrs()
const slots = useSlots()

const createInputNumber = () => {
  return h(
    ElInputNumber,
    {
      ...props,
      ...attrs,
      ref: changeRef,
      modelValue: props.modelValue,
      'onUpdate:modelValue': handleInput,
      onPaste: handlePaste
    },
    slots
  )
}
// 处理输入事件，确保触发校验
const handleInput = (value: number) => {
  emit('update:modelValue', value)
}
const emit = defineEmits<{
  'update:modelValue': [value: number]
  change: [value: number]
  error: [message: string]
}>()

type slotType = {
   prefix:() =>{},
   suffix:() =>{}
}

defineSlots<slotType>()
type exposed ={
    focus:() => {},
    bulr:() => {},
}
defineExpose<exposed>()

</script>

<template>
  <ElFormItem 
     v-if="formItem"
    :label="label" 
    :prop="prop" 
    :rules="computedRules">
      <component :is="createInputNumber()" />
  </ElFormItem>
      <component v-else :is="createInputNumber()" />
</template>