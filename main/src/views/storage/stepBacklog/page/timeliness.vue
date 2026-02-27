<!--
 * 环节积压时效页面
-->
<template>
  <div class="timeliness-container" v-loading="loading">
    <!-- 刷新时间 -->
    <div class="update-time-cnt">
      <div class="update-time">
        刷新时间：<span class="update-time-text">{{ updateTime }}</span>
        <el-icon class="refresh-icon" @click="handleRefresh">
          <Refresh />
        </el-icon>
      </div>
    </div>

    <!-- 筛选条件 -->
    <div class="filter-bar">
      <div class="filter-left">
        <div class="filter-item">
          <label>仓库</label>
          <el-select v-model="selectedWarehouse" placeholder="请选择仓库" @change="getData">
            <el-option
              v-for="item in warehouseList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="filter-item">
          <label>日期</label>
          <el-date-picker
            v-model="selectedDate"
            type="date"
            placeholder="选择日期"
            value-format="YYYY-MM-DD"
            :clearable="false"
            @change="getData"
          />
        </div>
      </div>

      <div class="filter-right">
        <el-button @click="handleReset"> 重置 </el-button>
      </div>
    </div>

    <!-- 环节积压时效列表标题 -->
    <div class="list-header">
      <div class="list-header-left">
        <span class="list-title">环节积压时效列表</span>
        <span class="list-title-time"
          ><el-icon><Clock /></el-icon> {{ selectedDate }}</span
        >
      </div>
      <div class="list-header-right">
        <el-button type="primary" @click="handleExport" :loading="exportLoading"> 导出 </el-button>
      </div>
    </div>

    <!-- 时效数据表格 -->
    <div class="timeliness-table">
      <el-table :data="timelinessData" border>
        <el-table-column prop="timeSegment" label="时间" width="200" fixed />
        <el-table-column prop="lessThan2H" label="<2" align="center" />
        <el-table-column prop="greaterThanOrEqual2H" label=">=2H" align="center" />
        <el-table-column prop="lessThan4H" label="<4H" align="center" />
        <el-table-column prop="greaterThan8H" label=">8H" align="center" />
        <el-table-column prop="greaterThan12H" label=">12H" align="center" />
      </el-table>
    </div>
  </div>
</template>

<script lang="tsx" setup>
import { Refresh, Upload, Clock } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import request from '@/config/axios'
import download from '@/utils/download'
// 筛选条件
const warehouseList = inject('warehouseList') as Ref<any[]>
const selectedWarehouse = ref<string>('SW-龙回仓（WMS）')
const selectedDate = ref<string>(dayjs().format('YYYY-MM-DD'))
const updateTime = ref<string>(dayjs().format('YYYY-MM-DD HH:mm:ss'))
const exportLoading = ref<boolean>(false)
// 时效数据
const timelinessData = ref<any[]>([])
const loading = ref<boolean>(false)
// 刷新
const handleRefresh = () => {
  getData()
}
// 重置
const handleReset = () => {
  selectedDate.value = dayjs().format('YYYY-MM-DD')
  selectedWarehouse.value = 'SW-龙回仓（WMS）'
  handleRefresh()
}

// 导出
const handleExport = async () => {
  exportLoading.value = true
  const data = {
    warehouse: selectedWarehouse.value,
    queryDate: selectedDate.value
  }
  const res = await request.downloadPost({
    url: `/api/stageBacklog/exportNodeBacklogDuration`,
    data: data
  })
  if (res) {
    download.excel(res, `环节积压时效_${selectedDate.value}.xlsx`)
  }
  exportLoading.value = false
}
const getData = async () => {
  loading.value = true
  const res = await request.post({
    url: '/api/stageBacklog/queryNodeBacklogDuration',
    data: {
      warehouse: selectedWarehouse.value,
      queryDate: selectedDate.value
    }
  })
  timelinessData.value = res
  updateTime.value = dayjs().format('YYYY-MM-DD HH:mm:ss')
  loading.value = false
}
onMounted(() => {
  getData()
})
</script>

<style lang="scss" scoped>
.timeliness-container {
  height: 100%;
  display: flex;
  flex-direction: column;

  // 刷新时间区域
  .update-time-cnt {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 0 20px;
    line-height: 20px;

    .update-time {
      display: flex;
      align-items: center;
      font-size: 14px;
      color: #666;

      .refresh-icon {
        cursor: pointer;
        margin-left: 8px;
        &:hover {
          color: #0064ff;
        }
      }
      .update-time-text {
        color: #333;
      }
    }
  }

  // 筛选条件
  .filter-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 20px;
    border-bottom: 1px solid #f0f0f0;
    .filter-left {
      display: flex;
      gap: 20px;
    }
    .filter-item {
      display: flex;
      gap: 12px;
      align-items: center;
      :deep(.el-input),
      :deep(.el-select) {
        width: 220px;
      }
      label {
        font-size: 14px;
        color: #333;
        white-space: nowrap;
      }
    }
  }

  // 列表标题
  .list-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 0;
    line-height: 20px;
    color: #333;
    .list-header-left {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .list-title {
      font-size: 16px;
      font-weight: 500;
    }
    .list-title-time {
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
  }

  // 表格
  .timeliness-table {
    :deep(.el-table) {
      font-size: 14px;
      .el-table__header th {
        background-color: #f2f6fc;
      }
      .el-table__body td {
        color: #666;
      }
      .el-table__body-wrapper {
        .el-table__cell {
          padding: 14px 0;
        }
      }

      .el-table__row td:first-child {
        color: #333;
        font-weight: 500;
      }
      .total-value {
        color: #409eff;
      }
    }
  }
}
</style>
