<script setup lang="ts">
// --- 类型定义 ---

// 单个选项的接口
export interface FilterOption {
  label: string
  value: string | number
}

// 每一行（筛选组）的配置接口
export interface FilterGroup {
  key: string // 对应 v-model 中的字段名 (e.g., 'category')
  label: string // 显示的标题 (e.g., '类目')
  multiple?: boolean // 是否支持多选
  options: FilterOption[] // 选项列表
}

// --- Props & Emits ---

interface Props {
  // 筛选组配置列表
  groups: FilterGroup[]
  // 绑定的数据对象 (v-model)
  modelValue: Record<string, any>
  labelWidth?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Record<string, any>): void
  (e: 'change', key: string, value: any): void // 抛出变更事件，便于外部监听特定字段
}>()

// --- 逻辑处理 ---

/**
 * 判断某个选项是否被选中
 */
const isActive = (groupKey: string, optionValue: string | number) => {
  const currentValue = props.modelValue[groupKey]

  // 如果当前没有任何值
  if (currentValue === undefined || currentValue === null) return false

  // 如果是数组（多选情况）
  if (Array.isArray(currentValue)) {
    return currentValue.includes(optionValue)
  }

  // 单选情况
  return currentValue === optionValue
}

/**
 * 处理点击事件
 */
const handleSelect = (group: FilterGroup, optionValue: string | number) => {
  const { key, multiple } = group
  // 浅拷贝当前 modelValue，避免直接修改 props
  const nextModel = { ...props.modelValue }
  let nextValue

  if (multiple) {
    // --- 多选逻辑 ---
    const currentList = Array.isArray(nextModel[key]) ? [...nextModel[key]] : []
    const index = currentList.indexOf(optionValue)

    if (index > -1) {
      // 已存在，则移除 (反选)
      currentList.splice(index, 1)
    } else {
      // 不存在，则添加
      currentList.push(optionValue)
    }
    nextValue = currentList
  } else {
    // --- 单选逻辑 ---
    // 如果点击的是当前已选中的，通常保持不变，或者根据需求可以取消选中
    // 这里实现：点击即选中，再次点击不取消（常见电商逻辑）
    nextValue = optionValue
  }

  // 更新 v-model
  nextModel[key] = nextValue
  emit('update:modelValue', nextModel)
  emit('change', key, nextValue)
}
</script>

<template>
  <div class="common-filter">
    <div v-for="group in groups" :key="group.key" class="filter-row">
      <div class="filter-label">
        {{ group.label }}
      </div>

      <div class="filter-options">
        <span
          v-for="option in group.options"
          :key="option.value"
          class="filter-item"
          :class="{ 'is-active': isActive(group.key, option.value) }"
          @click="handleSelect(group, option.value)"
        >
          {{ option.label }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.common-filter {
  width: 100%;
  font-size: 14px;
  color: #333;
}

.filter-row {
  display: flex;
  align-items: flex-start; // 对齐顶部，防止多行选项时标题错位
  margin-bottom: 12px;
  line-height: 24px;

  &:last-child {
    margin-bottom: 0;
  }
}

.filter-label {
  flex-shrink: 0;
  width: v-bind(labelWidth); // 根据实际需求调整宽度
  color: #666666; // 灰色标题
  margin-right: 16px;
  text-align: right;
}

.filter-options {
  flex: 1;
  display: flex;
  flex-wrap: wrap; // 选项过多自动换行
  gap: 24px; // 选项之间的间距
}

.filter-item {
  cursor: pointer;
  transition: all 0.2s;
  color: #333;

  // &:hover {
  //   color: var(--el-color-primary); // 悬停颜色
  // }

  &.is-active {
    color: var(--el-color-primary); // 选中颜色（参考图中的蓝色）
    font-weight: 500; // 选中稍微加粗
    // 如果需要背景块样式，可以在这里添加 background-color 等
  }
}
</style>
