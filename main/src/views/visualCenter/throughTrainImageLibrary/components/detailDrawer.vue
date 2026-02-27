<!--
 * @Date: 2025年5月14日16:37:15
-->
<template>
  <div class="detail-drawer">
    <el-drawer v-model="visible" title="图片详情" size="860px" :close-on-click-modal="true">
      <template #header>
        <div class="drawer-header">
          <span>图片详情</span>
        </div>
      </template>
      <Detail :show-edit="false" :detail-data="detailData" :current-is-auto="false" @edit="handleEdit" @close="close" />
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Detail from './detail.vue'

// Props接口定义（暂未使用但保留接口）
interface Props {
  detailData?: any
  currentIsAuto?: boolean
}

defineProps<Props>()

// Emits
const emit = defineEmits(['edit', 'close'])

// 响应式数据
const visible = ref(false)

// 方法
const open = (data?: any) => {
  if (data) {
    // 如果传入了数据，处理数据格式
    if (data.dataImages) {
      data.dataImages2 = data.dataImages.split(',').map((v) => {
        const [url, nameParam] = v.split('?')
        const name = nameParam ? nameParam.replace('name=', '') : ''
        return { url, name }
      })
    }
  }
  visible.value = true
}

const close = () => {
  visible.value = false
  emit('close')
}

const handleEdit = (data) => {
  emit('edit', data)
}

// 暴露方法
defineExpose({
  open,
  close
})
</script>

<style lang="scss" scoped>
.detail-drawer {
  .drawer-header {
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }

  :deep(.el-drawer__body) {
    padding: 0;
    overflow-y: auto;
  }

  :deep(.el-drawer__header) {
    padding: 20px 24px;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 0;
  }
}
</style>
