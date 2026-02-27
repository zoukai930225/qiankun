<!--
 * @Author: wangxifeng-ZJ3bu
 * @Date: 2025-12-18 10:30:00
 * @LastEditors: wangxifeng-ZJ3bu
 * @LastEditTime: 2025-12-22 14:27:58
-->
<template>
  <div class="main-container">
    <el-table :data="data" border :max-height="maxHeight" class="summary-rank-table">
      <el-table-column label="排名" width="70" align="center">
        <template #default="{ $index }">
          <span class="rank-badge">
            <img src="@/assets/imgs/newMedia/rank1.svg" alt="rank" v-if="$index === 0" />
            <img src="@/assets/imgs/newMedia/rank2.svg" alt="rank" v-else-if="$index === 1" />
            <img src="@/assets/imgs/newMedia/rank3.svg" alt="rank" v-else-if="$index === 2" />
            <span class="rank-badge-text" v-else>{{ $index + 1 }}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="groupName" label="分组" min-width="100" />
      <el-table-column label="姓名" min-width="120">
        <template #default="{ row }">
          <line-avatar :user="{ name: row.userName, avatarOrigin: row.userAvatar }" :size="24" />
        </template>
      </el-table-column>
      <el-table-column label="总奖金" width="120">
        <template #default="{ row, $index }">
          <span :class="[$index < 3 ? 'amount-text-primary' : '']"> ¥{{ row.bonus }} </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="tsx" setup>
import LineAvatar from '@/components/template/table/components/lineAvatar.vue'

interface SummaryItem {
  rank: number
  group: string
  userName: string
  userAvatar: string
  bonus: number
}

defineProps<{
  data: SummaryItem[]
  maxHeight?: number | string
}>()
</script>

<style lang="scss" scoped>
@use '../style.scss';
.summary-rank-table {
  .rank-badge {
    img {
      width: 14px;
    }
  }

  .rank-badge-text {
    font-size: 14px;
    color: #6b7280;
    padding: 2px 8px;
    background-color: #f3f4f6;
    border-radius: 50%;
  }

  .amount-text-primary {
    color: #0064ff;
    font-weight: 500;
  }
}
</style>
