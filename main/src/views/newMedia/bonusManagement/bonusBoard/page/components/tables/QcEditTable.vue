<!--
 * @Author: wangxifeng-ZJ3bu
 * @Date: 2025-12-18 10:30:00
 * @LastEditors: wangxifeng-ZJ3bu
 * @LastEditTime: 2025-12-22 14:28:56
-->
<template>
  <div class="main-container">
    <el-table :data="data" border :max-height="maxHeight" class="qc-edit-table">
      <el-table-column label="姓名" min-width="160">
        <template #default="{ row }">
          <line-avatar :user="{ name: row.userName, avatarOrigin: row.userAvatar }" :size="24" />
        </template>
      </el-table-column>
      <el-table-column prop="score" label="积分" width="80" align="center" />
      <el-table-column label="占比（%）" min-width="180">
        <template #default="{ row }">
          <div class="progress-wrapper">
            <el-progress
              :percentage="parseInt(row.proportion)"
              :stroke-width="8"
              :show-text="false"
            />
            <span class="progress-text">{{ row.proportion }}%</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="奖金" width="100">
        <template #default="{ row, $index }">
          <span :class="[$index < 3 ? 'bonus-amount' : '']">¥{{ row.bonus }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="tsx" setup>
import LineAvatar from '@/components/template/table/components/lineAvatar.vue'

interface QcEditItem {
  userName: string
  userAvatar: string
  score: number
  proportion: string
  bonus: number
}

defineProps<{
  data: QcEditItem[]
  maxHeight?: number | string
}>()
</script>

<style lang="scss" scoped>
@use '../style.scss';
.qc-edit-table {
  .progress-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 8px;

    :deep(.el-progress) {
      flex: 1;

      .el-progress-bar__outer {
        background-color: #ddeaff;
      }

      .el-progress-bar__inner {
        background: #0064ff;
      }
    }

    .progress-text {
      font-size: 14px;
      color: #333333;
      min-width: 42px;
      text-align: right;
    }
  }

  .bonus-amount {
    color: #0064ff;
    font-size: 14px;
    font-weight: 500;
  }
}
</style>
