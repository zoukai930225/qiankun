<template>
  <div class="container">
    <div class="editWrapper">
      <img src="@/assets/imgs/common/confirm.svg" @click="submitEdit(data)" alt="提交" />
      <div class="line"> | </div>
      <img src="@/assets/imgs/common/cancel.svg" @click="concelEdit(data)" alt="取消" />
    </div>
  </div>
</template>
<script setup lang="ts">
const emits = defineEmits(['submit', 'cancel'])
const props = defineProps({
  data: {
    type: [String, Object],
    required: true
  }
})

// 确认修改
const submitEdit = async (data) => {
  emits('submit', data)
}

// 取消修改
const concelEdit = (data) => {
  emits('cancel', data)
}
</script>
<style lang="scss" scoped>
.container {
  width: 90px;
}
.editWrapper {
  display: flex;
  align-items: center;
  margin-left: 10px;
  cursor: pointer;
  .line {
    color: #b3bac9;
    margin: 0 15px;
  }
}
</style>
