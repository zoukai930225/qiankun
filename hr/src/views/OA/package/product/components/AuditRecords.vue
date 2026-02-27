<!--
 * @Date: 2025-09-09 10:24:03
-->
<template>
  <div>
    <div v-for="(record, index) in records" :key="index" class="record-item">
      <!-- 状态图标（拒绝/通过） -->
      <div class="status-icon" :class="{ isLast: index == records.length - 1 }">
        <img
          v-if="record.auditStatus == 2"
          src="@/assets/imgs/common/reject.png"
          class="icon"
          alt=""
        />
        <img
          v-else-if="record.auditStatus == 1"
          src="@/assets/imgs/common/pass.png"
          class="icon"
          alt=""
        />
      </div>

      <!-- 头像 + 信息区域 -->
      <div class="info">
        <!-- 头像 -->
        <div class="flex-row">
          <img :src="record.auditAvatar" alt="avatar" class="avatar" />
          <span class="username">{{ record.auditUserName }}</span>
          <span class="status-text" :class="record.status">{{
            getStatusText(record.auditStatus)
          }}</span>
        </div>
        <div class="time">{{ record.auditTime }}</div>
        <!-- 备注 -->
        <div class="remark">{{ record.auditRemark }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 接收外部传入的审核记录列表
defineProps({
  records: {
    type: Array,
    default: () => []
  }
})

// 根据状态返回文字（拒绝/通过）
const getStatusText = (status) => {
  return status == '1' ? '审核通过' : '审核拒绝'
}
</script>

<style scoped>
.record-item {
  display: flex;
  flex-direction: row;
  padding-left: 20px;
  box-sizing: border-box;
  .status-icon {
    margin-right: 8px;
    border-left: 1px solid #d8dce5;
    .icon {
      width: 16px;
      height: 16px;
      margin-left: -8px;
    }
  }
  .isLast {
    border-left: 1px solid transparent;
  }

  .info {
    padding-bottom: 20px;
    box-sizing: border-box;
    .avatar {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      margin-right: 8px;
    }
    .username {
      color: #333333;
      font-size: 14px;
      margin-right: 10px;
    }
    .status-text {
      font-size: 14px;
    }
    .pass {
      color: #5db300;
    }
    .reject {
      color: #e43636;
    }
    .time {
      color: #999999;
      font-size: 12px;
      margin-top: 4px;
      margin-bottom: 6px;
    }
    .remark {
      color: #333333;
      font-size: 14px;
    }
  }
}
.flex-row {
  display: flex;
  flex-direction: row;
}
</style>
