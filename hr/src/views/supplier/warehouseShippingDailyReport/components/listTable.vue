<template>
  <div>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" @cell-click="handleCellClick">
      <el-table-column
        v-if="shouldRenderTable"
        prop="date"
        label="日期"
        width="150"
        align="center"
      />

      <!-- 动态生成仓库列 -->
      <el-table-column
        v-for="(warehouse, index) in warehouseHeaders"
        :key="index"
        :label="warehouse.label"
        align="center"
      >
        <el-table-column :prop="`${warehouse.key}.orderNum`" label="订单数" align="center">
          <template #default="{ row }">
            <span
              :class="
                warehouse.label === '合计' ||
                warehouse.label === '云仓' ||
                warehouse.label === '总仓'
                  ? ''
                  : 'custom-cell'
              "
              >{{ row[warehouse.key]?.orderNum || 0 }}</span
            >
          </template>
        </el-table-column>

        <el-table-column
          v-if="warehouse.label === '云仓' || warehouse.label === '总仓'"
          :prop="`${warehouse.key}.goodsQuantity`"
          label="占比"
          align="center"
        >
          <template #default="{ row }">
            <span>{{ row[warehouse.key]?.percent || 0 }}</span>
          </template>
        </el-table-column>

        <el-table-column
          v-else
          :prop="`${warehouse.key}.goodsQuantity`"
          label="货品数"
          align="center"
        >
          <template #default="{ row }">
            <span :class="warehouse.label === '合计' ? '' : 'custom-cell'">{{
              row[warehouse.key]?.goodsQuantity || 0
            }}</span>
          </template>
        </el-table-column>
      </el-table-column>

      <template #empty>
        <div class="empty">
          <img src="@/assets/imgs/common/empty_list.png" alt="" />
          <div>暂无数据</div>
        </div>
      </template>
    </el-table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  list: {
    type: Array,
    default: () => []
  },
  total: {
    type: Number,
    default: 0
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// 是否渲染 el-table 组件（当有数据时才渲染）
const shouldRenderTable = computed(() => props.list.length > 0)

// 计算仓库表头
const warehouseHeaders = computed(() => {
  if (!shouldRenderTable.value) return []
  const firstItem = props.list[0].warehouseMap
  return Object.keys(firstItem).map((warehouse) => ({
    label: warehouse,
    key: warehouse
  }))
})

// 处理表格数据
const tableData = computed(() => {
  if (!shouldRenderTable.value) return []

  return props.list.map((item) => ({
    date: item.orderTime,
    ...item.warehouseMap
  }))
})

// 点击订单数或者货品数时的处理函数
const handleCellClick = (row, column, cell, event) => {
  const field = column.property
  console.log('点击的字段', field)

  if (!field) return
  // 获取仓库名
  const [warehouseKey, type] = field.split('.')

  if (warehouseKey === '合计') return
  // 拿到当前仓库下的数据
  const warehouseData = row[warehouseKey] || {}

  console.log('仓库数据', warehouseData)
  emits('cell-click', warehouseData)
}

const emits = defineEmits(['cell-click'])
</script>

<style scoped lang="scss">
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}
.custom-cell {
  color: #0064ff;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}
</style>
