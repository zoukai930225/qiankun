<template>
  <el-select v-model="innerValue" :placeholder="placeholder" :multiple="multiple" :collapse-tags="multiple"
    :clearable="clearable" :filterable="filterable" :disabled="disabled" @change="handleChange"
    @update:model-value="handleUpdateModelValue" @visible-change="getOptions" collapse-tags-tooltip>
    <el-option class="custom-option" v-for="(item, index) in options" :key="index" :label="(item as OptionItem).label"
      :value="(item as OptionItem).value" :style="{ '--option-color': (item as OptionItem).color }">
      <template v-if="$slots.default" #default>
        <slot v-bind="item"></slot>
      </template>
    </el-option>
  </el-select>
</template>

<script lang="ts" setup>
import { getDictDataPage } from '@/api/system/dict/dict.data'
const emits = defineEmits(['update:modelValue', 'change'])

interface OptionItem {
  label: string,
  value: string,
  disabled: boolean,
  color: string
}

const prop = defineProps({
  // 双向绑定值
  modelValue: {
    type: String,
    default: '',
  },
  // 回显Options
  echoOptions: {
    type: Array,
    default: (): OptionItem[] => []
  },
  // 字典类型
  dictType: {
    type: String,
    default: ''
  },
  // 占位符
  placeholder: {
    type: String,
    default: '请选择'
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false
  },
  // 是否可搜索
  filterable: {
    type: Boolean,
    default: false
  },
  // 是否支持多选
  multiple: {
    type: Boolean,
    default: false
  },
  // 分隔符
  separator: {
    type: String,
    default: ",",
  },
  // 是否可清除
  clearable: {
    type: Boolean,
    default: true
  }
})

const options: Ref<OptionItem[]> = ref([])

const innerValue = ref()

watch(() => prop, (val) => {
  if (!val.modelValue) {
    innerValue.value = val.multiple ? [] : ""
    return
  }
  if (val.multiple) {
    innerValue.value = val.modelValue && Array.isArray(val.modelValue) ? val.modelValue : val.modelValue.split(val.separator)
  } else {
    innerValue.value = val.modelValue
  }
}, { immediate: true, deep: true })

let hasTriggered = false
watch(() => prop.echoOptions, (val: OptionItem[]) => {
  if (hasTriggered) return
  if (val.length === 0) return
  options.value = [...val]
  hasTriggered = true
}, { immediate: true })

const getOptions = async (visible: boolean) => {
  try {
    if (!prop.dictType || JSON.stringify(prop.echoOptions) !== JSON.stringify(options.value)) return
    if (visible) {
      const query = { page: 1, size: 9999, pCode: prop.dictType }
      const res = await getDictDataPage(query)
      if (prop.echoOptions.length > 0) {
        // 合并选项属性
        options.value = res?.data.map(item => {
          const { code, name, shortName } = item
          const cur = prop.echoOptions.find((co: OptionItem) => item.label === co.label || item.value === co.value)
          if (cur) {
            const obj = { shortName, value: code, label: name, ...cur }
            return obj
          }
          return item
        })
          // 过滤需要隐藏的选项
          .filter(item => !item.disabled)
      } else {
        options.value = res?.data.map(item => {
          const { code, name, shortName } = item
          return {
            value: code, label: name, shortName
          }
        })
      }
    }
  } catch (e) { }
}

const handleUpdateModelValue = (val) => {
  if (prop.multiple) {
    emits('update:modelValue', val.join(prop.separator))
    return
  }
  emits('update:modelValue', val)
}

const handleChange = (val: any) => {
  if (prop.multiple) {
    emits('change', val.join(prop.separator))
    return
  }
  emits('change', val)
}
</script>

<style lang="scss" scoped>
.custom-option {
  color: var(--option-color, #606266);
}

.el-select-dropdown__item.is-selected {
  color: var(--el-color-primary) !important;
}
</style>
