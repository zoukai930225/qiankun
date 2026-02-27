<!--
 * @Date: 2025年5月14日16:37:15
-->
<template>
  <div class="detail-dialog">
    <el-dialog append-to-body v-model="visible" modal-class="mark" @close="close">
      <!-- <div class="dialog-close" @click="close">
        <img src="@/assets/imgs/web/close.png" alt="" />
      </div> -->
      <Detail :detail-data="detailData" :current-is-auto="currentIsAuto" @edit="handleEdit" @close="close" />
      <template #title></template>
    </el-dialog>
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
.detail-dialog {
  :deep(.el-dialog__header) {
    display: none;
  }

  :deep(.el-dialog) {
    padding: 0;
    width: 1200px;
    padding-bottom: 20px;
    box-sizing: border-box;
    background: #fff;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
    border-radius: 18px;
    margin-top: 26px;
  }

  .dialog-close {
    position: absolute;
    top: 16px;
    right: 16px;
    cursor: pointer;
    z-index: 10;

    img {
      width: 18px;
      height: 18px;
    }
  }
}
</style>
