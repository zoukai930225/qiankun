<!--
 * @Author: wangxifeng-ZJ3bu
 * @Date: 2025-12-18 10:30:00
 * @LastEditors: wangxifeng-ZJ3bu
 * @LastEditTime: 2025-12-22 14:29:02
-->
<template>
  <div class="main-container">
    <el-table :data="data" border :max-height="maxHeight" class="qc-contribution-table">
      <el-table-column label="排名" width="70" align="center">
        <template #default="{ row, $index }">
          <span class="qc-rank" :class="getRankClass($index + 1)">{{ $index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" min-width="140">
        <template #default="{ row }">
          <line-avatar :user="{ name: row.userName, avatarOrigin: row.userAvatar }" :size="24" />
        </template>
      </el-table-column>
      <el-table-column prop="score" label="积分" width="80" align="center" />
      <el-table-column label="排名系数（%）" min-width="180">
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

interface QcContributionItem {
  rank: number
  userName: string
  userAvatar: string
  score: number
  proportion: string
  bonus: number
}

defineProps<{
  data: QcContributionItem[]
  maxHeight?: number | string
}>()

const getRankClass = (rank: number) => {
  if (rank === 1) return 'rank-gold'
  if (rank === 2) return 'rank-silver'
  if (rank === 3) return 'rank-bronze'
  return ''
}
</script>

<style lang="scss" scoped>
@use '../style.scss';
.qc-contribution-table {
  .qc-rank {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    font-size: 14px;
    color: #6b7280;
    background: #f3f4f6;
    &.rank-gold {
      background: #fef9c3;
      color: #e89205;
    }

    &.rank-silver {
      background: #f1f5fe;
      color: #7c88c8;
    }

    &.rank-bronze {
      background: #ffeada;
      color: #b07544;
    }
  }

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
