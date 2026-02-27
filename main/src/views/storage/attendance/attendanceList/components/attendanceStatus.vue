<template>
  <div class="attendance-status tag" :class="{ clickable: clickable }">
    <el-icon size="12px" class="status-icon">
      <CircleCloseFilled v-if="attendanceStatusName === '异常'" color="#EB3737" />
      <CircleCheckFilled v-else color="#349B34" />
    </el-icon>
    <span class="status-text">{{ attendanceStatusName }}</span>
  </div>
</template>
<script lang="ts" setup>
defineProps<{
  attendanceStatusName: '正常' | '异常'
  clickable?: boolean
}>()
</script>
<style lang="less" scoped>
.attendance-status {
  display: flex;
  align-items: center;

  .dot {
    content: '';
    display: block;
    width: 6px;
    height: 6px;
    margin-right: 10px;
    border-radius: 50%;
  }

  .status-icon {
    margin-right: 8px;
  }

  &.success::before {
    .dot();
    background: #349b34;
  }

  &.error::before {
    .dot();
    background: #eb3737;
  }

  &.tag {
    width: 59px;
    height: 20px;
    justify-content: center;
    border-radius: 10px;
    background: #f7f7f7;
    color: #333;
  }
}
.clickable {
  cursor: pointer;
}
</style>
