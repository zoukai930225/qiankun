<template>
  <div class="confirm-dialog">
    <el-dialog
      v-model="dialogVisible"
      :width="488"
      :append-to-body="true"
      style="border-radius: 10px"
      :show-close="false"
    >
      <template #header>
        <div class="header row-center">
          <img
            src="@/assets/imgs/common/warning_icon.png"
            alt=""
            class="header-icon"
            style="margin-left: auto"
          />
          <div class="header-title" style="margin-right: auto; line-height: 20px">{{ title }}</div>
        </div>
      </template>
      <div
        style="
          height: 1px;
          background: #f0f0f0;
          margin-left: -15px;
          width: calc(100% + 30px);
          margin-bottom: 15px;
        "
      ></div>
      <div class="content"> {{ content }} </div>
      <template #footer>
        <div class="row-center">
          <el-button style="margin-left: auto" @click="dialogVisible = false">{{
            cancelText
          }}</el-button>
          <el-button style="margin-right: auto" type="primary" @click="handleConfirm">{{
            confirmText
          }}</el-button>
        </div>
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
const itemData = ref([]) // 被评价人的那一条信息

// 点击确认按钮
const handleConfirm = () => {
  dialogVisible.value = false
  emit('confirm', itemData.value)
}

/** 打开弹窗 */
const open = async (data) => {
  dialogVisible.value = true
  itemData.value = data
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>

<style lang="scss" scoped>
.confirm-dialog {
}
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
  line-height: 20px;
}
</style>
