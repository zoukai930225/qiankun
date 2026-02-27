<template>
  <div v-if="list.length > 0">
    <div v-for="(item, index) in list" :key="index" class="table-wrapper">
      <el-table
        border
        class="SWCommonTable mb20px"
        :header-cell-style="{
          backgroundColor: '#fff',
          color:'#333',
          height: '45px'
        }"
        :max-height="480"
        :data="getLisplayedList(index, item.secondaryList)"
        width="100%"
        :show-overflow-tooltip="false"
        v-loading="loading"
        v-horizontal-scroll="'always'"
        :row-class-name="tableRowClassName"
        :row-style="{
          height: '52px'
        }"
      >
        <el-table-column prop="goodsCode" align="left" header-align="left">
          <template #default="{ row }">
            {{ row.secondaryClassification }}
          </template>
          <template #header>
            {{ item.goodsCode }}
          </template>
        </el-table-column>
        <el-table-column prop="count" label="计数" align="left" header-align="left">
          <template #default="{ row }">
            <div :class="row.secondaryClassification === '合计' ? 'summary-count' : ''">
              {{ row.count || 0 }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="percentage"
          label="占比"
          align="left"
          header-align="left"
          class-name="tight-padding"
        >
          <template #default="{ row }">
            <div :class="['percentage',Number(row.percentage) < 0 ? 'red' : '']">
              <div
                v-if="row.secondaryClassification !== '合计'"
                class="percentage-progress-label"
                :style="{ width: progressLabelWidth(formatPercent(row.percentage,false,true)) }"
              ></div>
              <div class="percentage-text"> {{ formatPercent(row.percentage,true,true) }} </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <div v-else class="empty-wapper flex-col"> 
      <img class="mt50px" src="@/assets/imgs/empty/empty1.png" alt="" />
      <div class="mb24px">暂无相关内容</div>
   </div>
</template>
<script lang="ts" setup>
defineOptions({ name: 'DrawerSecondCategory' })
import dayjs from 'dayjs'
import * as negativeReviewDashboardApi from '@/api/negativeReviewDashboard'

const props = defineProps({
  form: {
    type: Object as any,
    default: () => ({})
  },
  list: {
    type: Array as any,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})


// 合计行
const summaryRow = ref<any>([])

const displayedList = ref<any[]>([])
const getLisplayedList = (index, item) => {
  return [summaryRow.value[index], ...item]
}

const tableRowClassName = ({ row }) => {
  return row.secondaryClassification === '合计' ? 'summary-row' : ''
}

watch(() => props.list, async (newVal) => {
  if (newVal) {
    console.log('newVal', newVal)
     newVal.forEach((item, index) => {
        if (item.secondaryList && item.secondaryList.length > 0) {
          summaryRow.value[index] = {
            secondaryClassification: '合计',
            count: item.count || 0,
            percentage: item.percentage || 0
          }
        }
      })
    
  }
})


// const progressLabelWidth = (percentage: number) => {
//   let width = 0
//   width = (percentage / 1) * 90
//   return `${width}px`
// }

// const formatPercentFromRatio = (ratio: unknown): string => {
//   const n = Number(ratio)
//   if (!Number.isFinite(n)) return '0.00'
//   return (n * 100).toFixed(2)
// }

// 保留两位小数并可选加%
function formatPercent(percent: string, withSymbol = false,needPlus = false) {
  if (!percent) return withSymbol ? '0.00%' : '0.00'
  const num = !needPlus? parseFloat(percent.replace('%', '')) : parseFloat(percent.replace('%', '')) * 100
  const fixed = isNaN(num) ? '0.00' : num.toFixed(2)
  return withSymbol ? `${fixed}%` : fixed
}

// 进度条宽度
function progressLabelWidth(percent: string) {
  // 这里 percent 已经是去掉%的数字字符串

  return `${Math.abs(Number(percent))}%`
}

const emit = defineEmits(['close']) // 定义 close 事件

defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>

<style lang="scss" scoped>
@use './style.scss';

// el-table scoped styles to match DrawerFirstType
:deep(.el-table) {
  --el-table-border: 1px solid #e5e5e5;
  .el-table__row {
    // height: 45px !important; // 允许高度被内容撑开
  }
  .el-table__row:not(.summary-row) .el-table__cell.tight-padding {
    padding: 4px 0 !important;
    .cell {
      padding: 0 4px;
    }
  }
  .summary-row .percentage {
    background: transparent !important;
    text-align: left !important;
    color: #333 !important;
    padding: 0;
  }
  .summary-row .percentage-progress-label {
    display: none;
  }
}

.empty-wapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  font-size: 14px;
  color: #999;
}
</style>
