<template>
  <el-select
    ref="selectRef"
    v-model="localValue"
    v-bind="$attrs"
    :placeholder="placeholder"
    :clearable="clearable"
    :disabled="disabled"
    :multiple="multiple"
    :filterable="filterable"
    class="dict-select"
    @change="handleChange"
  >
    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
  </el-select>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDictStore } from '@/store/modules/dict'
import type { ElSelect } from 'element-plus'

// 禁用默认的属性透传，改为手动控制 v-bind="$attrs" 的位置默认情况下
// ，Vue 会把父组件传进来的非 Prop 属性加到根节点上。通过设置 inheritAttrs: false
// 并手动在 <el-select> 上写 v-bind="$attrs"，我们确保了所有额外的属性
// （例如 size="large", effect="dark", teleported="false", 甚至是 @visible-chang
// e 等事件监听器）都会直接作用于内部的 el-select，而不是外层的任何容器
defineOptions({
  name: 'DictSelect',
  inheritAttrs: false
})

const props = defineProps({
  modelValue: {
    type: [String, Number, Array],
    default: undefined
  },
  dictType: {
    type: String,
    required: true
  },
  placeholder: {
    type: String,
    default: '请选择'
  },
  clearable: {
    type: Boolean,
    default: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  multiple: {
    type: Boolean,
    default: false
  },
  filterable: {
    type: Boolean,
    default: true
  },
  valueSeparator: {
    type: String,
    default: ','
  },
  // 修改：默认值为 string，移除 auto
  valueType: {
    type: String,
    default: 'string',
    validator: (val: string) => ['string', 'array'].includes(val)
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const selectRef = ref<InstanceType<typeof ElSelect>>()
defineExpose({
  focus: () => selectRef.value?.focus(),
  blur: () => selectRef.value?.blur(),
  ref: selectRef
})

const dictStore = useDictStore()

const options = computed(() => {
  if (!props.dictType) return []
  return dictStore.getDictByType(props.dictType) || []
})

// 格式化输出值：根据 valueType 决定输出 字符串 还是 数组
const formatEmitValue = (val: any) => {
  if (!props.multiple) return val // 单选直接返回原值

  // 多选处理
  if (Array.isArray(val)) {
    // 如果显式配置了 array，返回数组
    if (props.valueType === 'array') {
      return val
    }
    // 默认情况 (string)，返回分隔后的字符串
    return val.join(props.valueSeparator)
  }
  return val
}

const localValue = computed({
  get: () => {
    // 多选时，el-select 必须接收数组
    if (props.multiple) {
      // 如果外部传入的是字符串 (默认行为)，则分割为数组给 el-select 显示
      if (typeof props.modelValue === 'string') {
        return props.modelValue ? props.modelValue.split(props.valueSeparator) : []
      }
      // 如果外部偶尔传入了数组 (兼容性处理)，直接使用
      if (Array.isArray(props.modelValue)) {
        return props.modelValue
      }
      return []
    }
    // 单选直接返回
    return props.modelValue
  },
  set: (val) => {
    emit('update:modelValue', formatEmitValue(val))
  }
})

const handleChange = (val: any) => {
  emit('change', formatEmitValue(val))
}
</script>

<style scoped lang="scss">
.dict-select {
  width: 100%;
}
</style>
