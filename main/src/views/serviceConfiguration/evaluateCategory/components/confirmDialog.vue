<template>
  <div class="confirm-dialog">
    <el-dialog v-model="dialogVisible" :width="488">
      <template #header>
        <div class="header">
          <img src="@/assets/imgs/common/warning_icon.png" alt="" class="header-icon" />
          <span class="header-title">{{ title }}</span>
        </div>
      </template>
      <div class="content"> {{ content }} </div>
      <template #footer>
        <el-button @click="dialogVisible = false">{{ cancelText }}</el-button>
        <el-button type="primary" @click="handleConfirm">{{ confirmText }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
defineOptions({ name: 'ConfirmDialog' })
const dialogVisible = ref(false) // 弹窗的是否展示
const emit = defineEmits(['confirm', 'cancel'])
const props = defineProps({
  title: {
    type: String,
    default: '提示'
  },
  content: {
    type: String,
    default: ''
  },
  cancelText: {
    type: String,
    default: '取消'
  },
  confirmText: {
    type: String,
    default: '确定'
  }
})
const itemData = ref([])

// 点击确认按钮
const handleConfirm = () => {
  dialogVisible.value = false
  emit('confirm', itemData.value)
}

/** 打开弹窗 */
const open = async (data?: any) => {
  dialogVisible.value = true
  itemData.value = data
  console.log('open', data)
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>

<style lang="scss">
.confirm-dialog {
  .header-icon {
    width: 14px;
    vertical-align: middle;
    margin-right: 5px;
  }
  .header-title {
    font-size: 14px;
    color: #333333;
    line-height: 22px;
    font-weight: bold;
  }
  .content {
    font-size: 14px;
    color: #666666;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
    margin-bottom: 10px;
  }
}
</style>
