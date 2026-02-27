<!--
 * @Description: 统计表格组件
-->
<template>
  <div class="statistics-table">
    <el-table :data="tableData" border>
      <el-table-column
        v-for="column in columns"
        :key="column.prop"
        :prop="column.prop"
        :label="column.label"
        :min-width="column.minWidth"
        :align="column.align || 'center'"
      >
        <template #default="{ row }">
          <!-- 进度条列 -->
          <div v-if="column.type === 'progress'" class="progress-cell">
            <div class="progress-wrapper">
              <el-progress
                :percentage="parseFloat(row[column.prop]) || 0"
                :stroke-width="8"
                :show-text="false"
              />
              <span class="progress-text">{{ row[column.prop] }}%</span>
            </div>
          </div>

          <!-- 普通列 -->
          <span v-else>{{ row[column.prop] || '-' }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="tsx" setup>
export interface TableColumn {
  prop: string
  label: string
  minWidth?: number
  align?: string
  type?: 'progress' | 'default'
}

defineProps<{
  tableData: any[]
  columns: TableColumn[]
}>()
</script>

<style lang="scss" scoped>
@use '../style.scss';
</style>
