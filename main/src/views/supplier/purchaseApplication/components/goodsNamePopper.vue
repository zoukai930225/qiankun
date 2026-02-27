<template>
  <el-popover :show-after="200" :popper-style="{ width: 'max-content' }">
    <template #reference>
      <span class="cursor-default ellipsis">{{ row.goodsName }}</span>
    </template>

    <div class="popper-title">
      {{ row.goodsName }}
    </div>
    <div class="flex">
      <el-descriptions border>
        <el-descriptions-item
          :label="item.label"
          v-for="item in COLUMN_1"
          :key="item.label"
          align="right"
          >{{ row[item?.prop || ''] }}</el-descriptions-item
        >
      </el-descriptions>
    </div>
  </el-popover>
</template>
<script lang="ts" setup>
import { COLUMN_1 } from '../options'

defineProps<{ row: any }>()
</script>
<style lang="less" scoped>
@import url(../../index.scss);
:deep(.el-descriptions__body .el-descriptions__table.is-bordered .el-descriptions__cell) {
  min-width: 80px;
}

.popper-title {
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 10px;
}
</style>
