<!--
 * @Description: 统计表格组件
-->
<template>
  <div class="statistics-table">
    <div class="table-title" v-if="tableTitle">
      {{ tableTitle }}
    </div>
    <el-table :data="tableData" border max-height="380px">
      <el-table-column
        v-for="column in columns"
        :key="column.prop"
        :prop="column.prop"
        :label="column.label"
        :min-width="column.minWidth"
        :align="column.align || 'left'"
      >
        <template #default="{ row }">
          <!-- 进度条列 -->
          <div v-if="column.type === 'progress'" class="progress-cell">
            <div class="progress-wrapper">
              <el-progress
                :percentage="parseInt(row[column.prop])"
                :stroke-width="8"
                :show-text="false"
              />
              <span class="progress-text">{{ parseInt(row[column.prop]) }}%</span>
            </div>
          </div>
          <div
            v-else-if="['name', 'registrar'].includes(column.prop)"
            class="user-cell"
            @click="handleCellClick(row, column)"
          >
            <div class="user-avatar">
              <el-avatar
                :src="column.prop === 'name' ? row.avatarOrigin : row.avatarOrigin"
                :size="20"
                class="ava"
              />
            </div>
            <span class="user-name">{{ column.prop === 'name' ? row.name : row.name }}</span>
          </div>
          <div v-else-if="['aswcl'].includes(column.prop)">
            <span>{{ row[column.prop] }}%</span>
          </div>
          <!-- 可点击数字列 -->
          <el-button
            v-else-if="column.clickable"
            link
            type="primary"
            class="clickable-value"
            @click="handleCellClick(row, column)"
          >
            {{ row[column.prop] }}
          </el-button>

          <!-- 普通列 -->
          <span v-else>{{ row[column.prop] }}</span>
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
  clickable?: boolean
}

const props = defineProps<{
  tableData: any[]
  tableTitle?: string
  columns: TableColumn[]
}>()

const emit = defineEmits<{
  cellClick: [row: any, column: TableColumn]
}>()

const handleCellClick = (row: any, column: TableColumn) => {
  emit('cellClick', row, column)
}
</script>

<style lang="scss" scoped>
.statistics-table {
  .table-title {
    font-size: 16px;
    font-weight: 500;
    color: #333333;
    padding-bottom: 20px;
    line-height: 22px;
  }
  :deep(.el-table) {
    .progress-cell {
      padding: 4px 0;

      .progress-bar-wrapper {
        width: 100%;
        height: 24px;
        background: #f0f2f5;
        border-radius: 12px;
        overflow: hidden;
        position: relative;

        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #409eff 0%, #79bbff 100%);
          border-radius: 12px;
          transition: width 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding-right: 8px;
          min-width: 40px;

          .progress-text {
            color: #ffffff;
            font-size: 12px;
            font-weight: 500;
            white-space: nowrap;
          }
        }
      }
    }

    .clickable-value {
      font-size: 14px;
      padding: 0;
      font-weight: 400;

      &:hover {
        text-decoration: underline;
      }
    }
    .user-cell {
      display: flex;
      align-items: center;
      cursor: pointer;
      .user-avatar {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 4px;
      }
      .user-name {
        font-size: 14px;
        color: #0064ff;
        font-weight: 400;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
</style>
