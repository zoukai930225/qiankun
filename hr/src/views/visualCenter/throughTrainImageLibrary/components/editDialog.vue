<!--
 * @Date: 2025年5月14日16:37:15
-->
<template>
  <div class="edit-dialog">
    <el-dialog v-model="visible" title="编辑" @close="handleDialogClose">
      <Edit ref="editRef" :edit-data="editData" :current-is-auto="currentIsAuto" @close="handleEditClose"
        @submit="handleSubmit" />

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleEditClose">关闭</el-button>
          <el-button type="primary" :loading="loading" @click="handleFormSubmit">提交</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick } from 'vue'
import Edit from './edit.vue'

// Props
interface Props {
  editData?: any
  currentIsAuto?: boolean
}

withDefaults(defineProps<Props>(), {
  editData: () => ({}),
  currentIsAuto: false
})

// Emits
const emit = defineEmits(['close', 'submit'])

// 响应式数据
const visible = ref(false)
const editRef = ref()
const loading = ref(false)
const internalEditData = ref({})

// 方法
const open = async (data?: any) => {
  // // 初始化表单数据
  // if (editRef.value && data) {
  //   editRef.value.initFormData(data)
  // }

  console.log('EditDrawer open called with data:', data)

  // 设置内部编辑数据
  internalEditData.value = data || {}

  visible.value = true
  // 等待组件挂载完成后再初始化表单数据
  await nextTick()
  if (editRef.value && data) {
    console.log('Calling initFormData with data:', data)
    editRef.value.initFormData(data)
  } else {
    console.warn('editRef.value is null or data is empty:', { editRef: editRef.value, data })
  }
}

// 处理弹框本身的关闭事件（点击遮罩层、ESC键、右上角X等）
const handleDialogClose = () => {
  if (!visible.value) return // 防止重复关闭

  visible.value = false

  // 重置子组件的表单数据
  if (editRef.value) {
    editRef.value.handleClose()
  }

  emit('close')
}

// 处理子组件Edit的关闭事件（点击关闭按钮）
const handleEditClose = () => {
  if (!visible.value) return // 防止重复关闭

  visible.value = false
  emit('close')
}

// 处理表单提交（由页脚按钮触发）
const handleFormSubmit = async () => {
  if (!editRef.value || loading.value) return

  try {
    loading.value = true
    await editRef.value.handleSubmit()
  } catch (error) {
    console.error('表单提交失败:', error)
  } finally {
    loading.value = false
  }
}

// 处理来自Edit组件的提交事件
const handleSubmit = (params) => {
  if (!visible.value) return // 防止重复关闭

  loading.value = false // 重置loading状态
  visible.value = false

  console.log('编辑提交成功，参数:', params)
  emit('submit', params)
}

// 保持向后兼容
const handleClose = handleDialogClose

// 暴露方法
defineExpose({
  open,
  close: handleClose
})
</script>

<style lang="scss" scoped>
.edit-dialog {
  :deep(.el-dialog) {
    width: 800px;
    border-radius: 8px;
  }

  :deep(.el-dialog__header) {
    padding: 20px 20px 0;

    .dialog-header {
      position: relative;
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }
  }

  :deep(.el-dialog__body) {
    padding: 0;
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 16px 0 0 0;
  }
}
</style>