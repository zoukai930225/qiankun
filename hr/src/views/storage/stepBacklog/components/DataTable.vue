<!--
 * 数据表格组件
-->
<template>
  <div class="data-table-container">
    <div class="table-wrapper">
      <el-table :data="displayData" border style="width: 100%" height="100%">
        <el-table-column prop="step" label="环节" align="left" fixed />
        <el-table-column prop="total" label="总计" width="78" align="left">
          <template #default="{ row }">
            <span class="total-value">{{ formatNumber(row.total) }}</span>
          </template>
        </el-table-column>

        <!-- 24小时时间段列 -->
        <el-table-column
          v-for="hour in 24"
          :key="hour"
          :prop="`hour${hour - 1}`"
          :label="getHourLabel(hour - 1)"
          width="60"
          align="center"
        >
          <template #default="{ row }">
            {{ formatNumber(row[`hour${hour - 1}`]) }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang="tsx" setup>
interface TableRow {
  step: string
  total: number
  [key: string]: any
}

interface Props {
  data?: any[]
  selectedMetric?: string
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  selectedMetric: 'inOrderCount'
})

// 指标标签映射
const metricLabels = {
  inOrderCount: '流入订单数量',
  inGoodsCount: '流入货品数量',
  waitReviewCount: '待审核数量',
  waitPackCount: '待补货数量',
  waitPickCount: '待拣货数量',
  waitSortCount: '待验货数量',
  waitPrintCount: '待打包数量',
  printedCount: '已打包数量',
  notShipCount: '未发货数量',
  shippedCount: '已发货数量'
}

// 模拟数据
const generateMockData = () => {
  const data: TableRow[] = []
  const label = metricLabels[props.selectedMetric] || '流入订单数量'

  const row: TableRow = {
    step: label,
    total: 10000
  }

  // 生成24小时数据
  for (let i = 0; i < 24; i++) {
    // 前7小时每小时10，后面每小时400
    row[`hour${i}`] = i < 7 ? 10 : 400
  }

  data.push(row)

  return data
}

const displayData = computed(() => {
  return props.data.length > 0 ? props.data : generateMockData()
})

// 获取小时标签
const getHourLabel = (hour: number) => {
  return `${hour}-${hour + 1}点`
}

// 格式化数字
const formatNumber = (num: number | string) => {
  if (typeof num === 'number') {
    return num.toLocaleString()
  }
  return num
}
</script>

<style lang="scss" scoped>
.data-table-container {
  width: 100%;
  height: 100%;

  .table-wrapper {
    width: 100%;
    height: 100%;

    :deep(.el-table) {
      font-size: 14px;
      .el-table__header th {
        background-color: #f2f6fc;
        color: #666;
      }
      .el-table__header th:not(:nth-of-type(1)):not(:nth-of-type(2)) {
        .cell {
          padding: 0;
        }
      }
      .el-table__body td {
        color: #333;
      }
      .el-table__body td:not(:nth-of-type(1)):not(:nth-of-type(2)) {
        .cell {
          padding: 0;
        }
      }
      .el-table__body-wrapper .el-table__cell {
        padding: 14px 0;
      }
      .el-table__row td:first-child {
        color: #333;
        font-weight: 500;
      }
      .total-value {
        color: #0064ff;
      }
    }
  }
}
</style>
