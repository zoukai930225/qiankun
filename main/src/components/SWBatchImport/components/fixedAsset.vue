<template>
  <div class="topFilter row-center"> </div>
</template>
<script lang="ts" setup>
import { XhsNoteTypeOptions } from '@/types/enumOptions'

const message = useMessage() // 消息弹窗

const formData = ref({
  noteType: ''
})

/** 搜索按钮操作 */
const handleQuery = () => {
  emit('handleQuery', formData.value)
}

/**
 * 筛选条件校验
 */
const validorParams = () => {
  // if (!formData.value.noteType) {
  //   message.error('请选择文章类型')
  //   return false
  // }
  return true
}

const emit = defineEmits(['handleQuery']) // 定义 handleQuery 事件，用于筛选成功返回事件
defineExpose({ validorParams }) // 提供 open 方法，用于打开弹窗
</script>

<style lang="scss" scoped>
.topFilter {
  margin-bottom: 10px;
  &-title {
    font-size: 14px;
    color: #606266;
    line-height: 22px;
    padding-right: 10px;
  }
  &-select {
    width: 180px;
    margin-right: 46px;
  }
}
</style>
