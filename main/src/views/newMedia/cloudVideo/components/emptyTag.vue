<template>
  <div class="empty-tag">
    {{ text }}
  </div>
</template>
<script lang="ts" setup>
defineProps({
  text: {
    type: String,
    default: '未认领'
  }
})
</script>

<style lang="scss" scoped>
.empty-tag {
  display: flex;
  height: 28px;
  border-radius: 100px;
  /* 自动布局 */
  padding: 0 16px;
  background: #E8E8E8;
  font-size: 14px;
  color: #333333;
  justify-content: center;
  align-items: center;
}
</style>