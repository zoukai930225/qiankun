<template>
  <div class="dynamic-search">
    <el-select
      v-model="internalValue"
      filterable
      remote
      clearable
      :placeholder="placeholder"
      :remote-method="handleRemoteMethod"
      @change="handleSelect"
      @clear="handleClear"
      class="custom-select"
      style="width: 100%"
    >
      <template #prefix>
        <!-- <div class="icon-wrap">
          <slot name="prefix">
            <img
              src="@/assets/imgs/productMng/search.png"
              alt=""
              style="width: 14px; height: 14px"
            />
          </slot>
        </div> -->
      </template>

      <template #empty>
        <div class="empty-text">请输入搜索条件</div>
      </template>

      <el-option
        v-for="item in computedOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
        <span v-html="highlightVal(item.label, searchText)"></span>
      </el-option>
    </el-select>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

// --- Props 定义 ---
interface SearchOption {
  label: string
  value: string
}

const props = defineProps({
  // 兼容 query-scheme：schemeForm 会同时下发 v-model 和 v-model:value
  modelValue: {
    type: [Object, String] as any,
    default: undefined
  },
  value: {
    type: [Object, String] as any,
    default: undefined
  },
  // 搜索配置项，例如：[{ label: '货品名称', value: 'productName' }]
  options: {
    type: Array as () => SearchOption[],
    default: () => []
  },
  placeholder: {
    type: String,
    default: '请输入'
  }
})

// --- Emits 定义 ---
const emit = defineEmits(['search', 'clear', 'change', 'update:modelValue', 'update:value'])

// --- 内部状态 ---
const internalValue = ref('') // 选中的值 (格式: "field,keyword")
const searchText = ref('') // 当前输入的文本
const computedOptions = ref<any[]>([]) // 动态生成的下拉列表

// --- 逻辑处理 ---

const getBoundValue = () => (props.modelValue ?? props.value) as any

const syncFromOuter = () => {
  const v = getBoundValue()
  if (v === undefined || v === null || v === '') {
    internalValue.value = ''
    searchText.value = ''
    computedOptions.value = []
    return
  }
  // 支持 { field, value } 或 "field,keyword"
  if (typeof v === 'string') {
    internalValue.value = v
    const [, keyword] = v.split(',')
    handleRemoteMethod(keyword || '')
    return
  }
  if (typeof v === 'object' && v.field && v.value) {
    internalValue.value = `${v.field},${v.value}`
    handleRemoteMethod(String(v.value))
  }
}

watch(
  () => [props.modelValue, props.value],
  () => syncFromOuter(),
  { immediate: true, deep: true }
)

// 1. 远程搜索方法：根据输入生成选项
const handleRemoteMethod = (val: string) => {
  searchText.value = val.trim()
  if (val) {
    computedOptions.value = props.options.map((option) => ({
      // 显示文本：货品名称包含 xxx 的记录
      label: `${option.label}包含 ${val} 的记录`,
      // 实际值：productName,xxx (用逗号分隔字段和值)
      value: `${option.value},${val}`
    }))
  } else {
    computedOptions.value = []
  }
}

// 2. 选中事件
const handleSelect = (val: string) => {
  if (val) {
    const [field, keyword] = val.split(',')
    // 抛出结构化的数据：{ field: 'productName', value: '苹果' }
    const payload = { field, value: keyword.trim() }
    emit('update:modelValue', payload as any)
    emit('update:value', payload as any)
    emit('change', payload as any)
    emit('search', payload)
  } else {
    // 理论上 clear 会触发 handleClear，这里做个兜底
    handleClear()
  }
}

// 3. 清空事件
const handleClear = () => {
  internalValue.value = ''
  searchText.value = ''
  computedOptions.value = []
  emit('update:modelValue', undefined as any)
  emit('update:value', undefined as any)
  emit('change', undefined as any)
  emit('clear')
}

// 4. 高亮处理工具函数
const highlightVal = (label: string, val: string) => {
  if (!val) return label
  // 使用正则进行全局替换，并忽略大小写（可选）
  const reg = new RegExp(val, 'gi')
  return label.replace(
    reg,
    (match) => `<span style="color: var(--el-color-primary);">${match}</span>`
  )
}

// --- Expose 暴露给父组件的方法 ---
// 用于父组件（如路由参数）直接设置搜索状态
const setKeyword = (field: string, keyword: string) => {
  if (!field || !keyword) return

  // 1. 更新输入框显示的文本（模拟一次远程搜索，让用户看到选项）
  handleRemoteMethod(keyword)

  // 2. 设置选中的值
  internalValue.value = `${field},${keyword}`

  // 3. 触发搜索
  const payload = { field, value: keyword }
  emit('update:modelValue', payload as any)
  emit('update:value', payload as any)
  emit('change', payload as any)
  emit('search', payload)
}

defineExpose({
  setKeyword,
  handleClear
})
</script>

<style scoped lang="scss">
.dynamic-search {
  display: flex;
  align-items: center;

  .icon-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .empty-text {
    padding: 10px 0;
    text-align: center;
    color: #999;
    font-size: 12px;
  }
}
</style>
