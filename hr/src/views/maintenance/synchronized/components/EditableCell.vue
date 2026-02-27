<template>
  <div class="editable-cell" @click="handleClick">
    <!-- 显示模式 -->
    <div v-if="!isEditing" class="cell-content">
      <span class="cell-text" v-if="displayText">{{ displayText }}</span>
      <span class="cell-text-placeholder" v-else>{{ placeholder }}</span>
      <el-icon class="edit-icon"><Edit /></el-icon>
    </div>

    <!-- 编辑模式 -->
    <div v-else class="cell-editor" @click.stop>
      <!-- 数字输入框 -->
      <el-input-number
        v-if="type === 'number'"
        ref="editorRef"
        v-model="editValue"
        :controls="false"
        :precision="precision"
        style="width: 100%"
        @blur="handleSave"
        @keyup.enter="handleSave"
      />

      <!-- 下拉选择 -->
      <el-select-v2
        v-else-if="type === 'select'"
        ref="editorRef"
        v-model="editValue"
        :options="options"
        :multiple="false"
        style="width: 100%"
        @blur="handleSave"
        @change="handleSave"
      />

      <!-- 用户选择（特殊处理） -->
      <UserScreen
        v-else-if="type === 'user'"
        ref="editorRef"
        :name="userName"
        :id="userId"
        :item="item"
        @blur="handleSave"
      />
    </div>
  </div>
</template>

<script lang="tsx" setup>
import { ref, computed, nextTick } from 'vue'
import { Edit } from '@element-plus/icons-vue'
import UserScreen from '@/components/common/user/userScreen.vue'

interface Props {
  modelValue: any
  type: 'number' | 'select' | 'user'
  options?: any[]
  precision?: number
  item?: any
  userName?: string
  userId?: string
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  precision: 2,
  options: () => [],
  placeholder: ''
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
  (e: 'change', value: any): void
}>()

const isEditing = ref(false)
const editValue = ref(props.modelValue)
const editorRef = ref()

// 显示文本
const displayText = computed(() => {
  if (props.type === 'number') {
    return props.modelValue || props.modelValue === 0 ? props.modelValue : ''
  }
  if (props.type === 'select') {
    const option = props.options?.find((op) => op.value === props.modelValue)
    return option?.label || ''
  }
  if (props.type === 'user') {
    return props.item?.[props.userName!] || ''
  }
  return ''
})

// 点击单元格
const handleClick = () => {
  isEditing.value = true
  editValue.value = props.modelValue

  // 聚焦到编辑器
  nextTick(() => {
    if (editorRef.value) {
      if (editorRef.value.focus) {
        editorRef.value.focus()
      } else if (editorRef.value.$el) {
        editorRef.value.$el.querySelector('input')?.focus()
      }
    }
  })
}

// 保存修改
const handleSave = () => {
  isEditing.value = false

  if (editValue.value !== props.modelValue) {
    emit('update:modelValue', editValue.value)
    emit('change', editValue.value)
  }
}

// 暴露方法给父组件
defineExpose({
  isEditing
})
</script>

<style lang="scss" scoped>
.editable-cell {
  width: 100%;
  min-height: 32px;
  cursor: pointer;
  position: relative;

  .cell-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px 8px;
    border-radius: 4px;
    transition: all 0.2s;

    &:hover {
      background-color: var(--el-fill-color-light);

      .edit-icon {
        opacity: 1;
      }
    }

    .cell-text {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .cell-text-placeholder {
      flex: 1;
      color: #bbb;
    }

    .edit-icon {
      margin-left: 8px;
      font-size: 14px;
      color: var(--el-color-primary);
      opacity: 0;
      transition: opacity 0.2s;
    }
  }

  .cell-editor {
    padding: 0;
  }
}
</style>
