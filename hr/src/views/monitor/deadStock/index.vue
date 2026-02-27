<template>
  <el-card class="statistic" shadow="never">
    <div class="header">
      <div class="title">滞销滞卖日报</div>
      <div class="options">
        <date-filter v-model="reportDate" layout="7天,30天,日,自定义" @change="handleChangeDate" />
        <el-button
          type="primary"
          class="ml16px"
          :loading="exportLoading"
          :disabled="exportLoading"
          @click="exportData"
          >导出</el-button
        >
        <el-button class="ml16px" @click="sendImg" :loading="sendLoading" :disabled="sendLoading">
          发送
        </el-button>
      </div>
    </div>
    <div class="content">
      <el-row :gutter="16">
        <el-col :span="6" v-for="item in deadStockStatistic" :key="item.prop">
          <div class="content-item">
            <div class="label">{{ item.label }}</div>
            <div v-if="statisticData[item.prop]" class="value">
              <span class="prop mr12px">{{
                item.transform ? item.transform(statisticData[item.prop]) : statisticData[item.prop]
              }}</span>
              <div
                v-if="
                  item.tendency &&
                  ((item.prop === 'yesterdaySales' && !/\,/.test(reportDate)) ||
                    (item.prop === 'yesterdayCargoValue' && !/\,/.test(reportDate)) ||
                    (item.prop !== 'yesterdayCargoValue' && item.prop !== 'yesterdaySales'))
                "
              >
                <span class="text mr4px">{{
                  item.prop === 'lastMonthCargoValue'
                    ? `较${statisticData.beforeLastMonth}月`
                    : '较昨日'
                }}</span>
                <span class="tendency mr4px">{{
                  Number(statisticData[item.tendency]?.replace(/^\-/, '') || 0) + '%'
                }}</span>
                <img :src="/^\-/.test(statisticData[item.tendency]) ? DownIcon : UpIcon" alt="" />
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-card>

  <el-card
    class="list"
    shadow="never"
    :style="{ height: ['table', 'table_2'].includes(activeName) ? 'auto' : '580px' }"
  >
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="日报明细" name="table" />
      <el-tab-pane label="货值统计图" name="chart" />
      <el-tab-pane label="销量统计图" name="chart_3" />
      <el-tab-pane label="销量货值分析" name="chart_2" />
      <el-tab-pane label="库存排名" name="table_2" />
    </el-tabs>

    <el-row
      :gutter="20"
      class="list-content"
      :class="{
        'show-table': activeName === 'table',
        'show-chart': activeName === 'chart',
        'show-chart_2': activeName === 'chart_2',
        'show-chart_3': activeName === 'chart_3',
        'show-table_2': activeName === 'table_2'
      }"
    >
      <el-col :span="3">
        <main-table
          :data="tableData"
          :options="deadStockTable"
          :span-method="spanMethod"
          :download-file-name="`${reportDate} 滞销滞卖日报`"
          :loading="tableLoading"
          border
          ref="tableRef"
        >
          <template #totalCargoValue="{ row }">
            <div
              class="up"
              :style="{ width: `${Number(row.totalCargoValuePercent) * (160 - 8)}px` }"
              >{{ row.totalCargoValue }}</div
            >
          </template>
          <template #yesterdayCargoValue="{ row }">
            <div
              class="up"
              :style="{ width: `${Number(row.yesterdayCargoValuePercent) * (160 - 8)}px` }"
              >{{ row.yesterdayCargoValue }}</div
            >
          </template>
        </main-table>
      </el-col>
      <el-col :span="3">
        <chart ref="chartRef" :date="reportDate" :file-name="chartName" :title="chartTitle" />
      </el-col>
      <el-col :span="3">
        <chart_3 ref="chartRef_3" :date="reportDate" :file-name="chartName" :title="chartTitle" />
      </el-col>
      <el-col :span="3">
        <chart_2 ref="chartRef_2" :date="reportDate" :file-name="chartName" :title="chartTitle" />
      </el-col>
      <el-col :span="3">
        <main-table
          :data="tableData_2"
          :options="Top10Table"
          :download-file-name="`${reportDate} 库存排名`"
          :loading="tableLoading"
          border
          ref="tableRef_2"
          :cell-style="{ height: '80px', lineHeight: '64px' }"
          :cell-class-name="() => 'top10-cell'"
        >
          <template #image="{ col }">
            <el-image
              :src="col"
              alt=""
              fit="contain"
              :preview-src-list="[col]"
              preview-teleported
              :max-scale="5"
              class="w64px h64px"
            />
          </template>
        </main-table>
      </el-col>
    </el-row>
  </el-card>
</template>
<script lang="ts" setup>
import MainTable from './components/table.vue'
import { formatDate } from '@/utils/formatTime'
import { deadStockStatistics, deadStockTable, Top10Table } from './options'
import {
  getDeadStockReportList,
  getDeadStockReportStastics,
  opUnsalableGoodsDailyTop10Api,
  sendFeishu,
  statisticsTimeInterval
} from '@/api/monitor/deadStock'
import Chart from './components/chart.vue'
import UpIcon from '@/assets/svgs/monitor/up.svg'
import DownIcon from '@/assets/svgs/monitor/down.svg'
import DateFilter from '../components/dateFilter.vue'
const Chart_2 = defineAsyncComponent(() => import('./components/chart_2.vue'))
const Chart_3 = defineAsyncComponent(() => import('./components/chart_3.vue'))

defineOptions({ name: 'MonitorDeadStock' })

const message = useMessage()

const reportDate = ref('')
const tableData = ref<Monitor.DeadStock.ListItem[]>([])
const tableData_2 = ref<any[]>([])
const statisticData = ref<Monitor.DeadStock.Statistics>({})
const tableRef = ref()
const tableRef_2 = ref()
const chartRef = ref()
const chartRef_2 = ref()
const chartRef_3 = ref()
const activeName = ref('table')
const exportLoading = ref(false)
const tableLoading = ref(true)
const chartName = ref('')
const chartName_3 = ref('')
const sendLoading = ref(false)
const timeType = ref('')

const categorySpanArr = computed(() => {
  let spanArr: number[] = []
  let pos = 0
  tableData.value.forEach((item, index) => {
    if (index === 0) {
      spanArr.push(1)
      pos = 0
    } else {
      // 判断当前行的值是否与上一行的值相同
      if (item.category === tableData.value[index - 1].category) {
        spanArr[pos]++
        spanArr.push(0)
      } else {
        spanArr.push(1)
        pos = index
      }
    }
  })
  return spanArr
})

const seasonCategorySpanArr = computed(() => {
  let spanArr: number[] = []
  let pos = 0
  tableData.value.forEach((item, index) => {
    if (index === 0) {
      spanArr.push(1)
      pos = 0
    } else {
      // 判断当前行的值是否与上一行的值相同
      if (
        item.seasonCategory === tableData.value[index - 1].seasonCategory &&
        item.category === tableData.value[index - 1].category
      ) {
        spanArr[pos]++
        spanArr.push(0)
      } else {
        spanArr.push(1)
        pos = index
      }
    }
  })
  return spanArr
})

const chartTitle = computed(() => {
  const targetDate = new Date(reportDate.value)
  return `${formatDate(targetDate, 'YYYY-MM-DD')}`
})

const deadStockStatistic = computed(() => {
  if (timeType.value === '7天') {
    deadStockStatistics[2].label = '近七日销量总计（件）'
    deadStockStatistics[3].label = '近七日已卖货值总计（元）'
    return deadStockStatistics
  } else if (timeType.value === '30天') {
    deadStockStatistics[2].label = '近三十日销量总计（件）'
    deadStockStatistics[3].label = '近三十日已卖货值总计（元）'
    return deadStockStatistics
  } else {
    deadStockStatistics[2].label = '销量总计（件）'
    deadStockStatistics[3].label = '已卖货值总计（元）'
    return deadStockStatistics
  }
})

// 获取表格
async function getList() {
  tableLoading.value = true
  try {
    const [res, res_2] = await Promise.all([
      getDeadStockReportList(reportDate.value),
      opUnsalableGoodsDailyTop10Api({ dataDate: reportDate.value })
    ])
    tableData.value = res
    tableData_2.value = res_2
  } catch (error) {
  } finally {
    tableLoading.value = false
  }
}

// 获取统计
async function getStatistic() {
  try {
    const res = await getDeadStockReportStastics(reportDate.value)
    statisticData.value = res
  } catch (error) {}
}

function spanMethod({ column, rowIndex }): [number, number] {
  if (column.rawColumnKey === 'category') {
    const _row = categorySpanArr.value[rowIndex]
    const _col = _row > 0 ? 1 : 0
    return [_row, _col]
  } else if (column.rawColumnKey === 'seasonCategory') {
    const _row = seasonCategorySpanArr.value[rowIndex]
    const _col = _row > 0 ? 1 : 0
    return [_row, _col]
  } else if (column.rawColumnKey === 'dataDate') {
    return rowIndex === 0 ? [tableData.value.length, 1] : [0, 0]
  } else {
    return [1, 1]
  }
}

async function exportData() {
  if (tableData.value.length) {
    exportLoading.value = true
    chartName.value = `${reportDate.value} 滞销滞卖日报货值统计图`
    chartName_3.value = `${reportDate.value} 滞销滞卖日报销量统计图`
    await nextTick()
    await Promise.all([
      tableRef.value.exportable(),
      chartRef.value.exportChart(),
      chartRef_2.value.exportChart(),
      chartRef_3.value.exportChart(),
      tableRef_2.value.exportable()
    ])
    message.success('导出成功')
    exportLoading.value = false
  } else {
    message.error('当前没有数据可以导出')
  }
}

/** 发送图片到飞书 */
async function sendImg() {
  if (tableData.value.length === 0) return message.error('当前没有数据可以发送')

  sendLoading.value = true
  chartName.value = `${reportDate.value} 滞销滞卖日报货值统计图`
  // chartName_3.value = `${reportDate.value} 滞销滞卖日报销量统计图`
  try {
    const files = await Promise.all([
      tableRef.value.getFile(),
      tableRef_2.value.getFile(),
      chartRef.value.getFile()
      // chartRef_3.value.getFile()
    ])

    const formData = new FormData()

    formData.append('file', files[0], `${reportDate.value} 滞销滞卖日报`)
    formData.append('file', files[1], `${reportDate.value} 库存排名`)
    formData.append('file', files[2], chartName.value)

    const res = await sendFeishu(formData, { dataDate: reportDate.value })

    if (res.success) {
      message.success('发送成功')
    }
  } catch (error) {
    console.log(error)
  } finally {
    sendLoading.value = false
  }
}

async function handleChangeDate(val: string, type: string = '日') {
  timeType.value = type
  try {
    if (/\,/.test(val)) {
      const params = {
        dataDateStart: val.split(',')[0],
        dataDateEnd: val.split(',')[1]
      }
      const res = await statisticsTimeInterval(params)
      if (res) {
        statisticData.value.yesterdayCargoValue = res.yesterdayCargoValue || 0
        statisticData.value.yesterdayCargoValuePercent = res.yesterdayCargoValuePercent || 0
        statisticData.value.yesterdaySales = res.yesterdaySales || 0
        statisticData.value.yesterdaySalesPercent = res.yesterdaySalesPercent || 0
      } else {
        statisticData.value.yesterdayCargoValue = '0'
        statisticData.value.yesterdayCargoValuePercent = '0'
        statisticData.value.yesterdaySales = '0'
        statisticData.value.yesterdaySalesPercent = '0'
      }
    } else {
      const res = await getDeadStockReportStastics(val)
      statisticData.value = res
      getList()
      chartRef.value.getData()
      chartRef_3.value.getData()
    }
  } catch (error) {}
}

onBeforeMount(() => {
  const today = new Date()
  const date = today.getDate()
  today.setDate(date - 1)
  reportDate.value = formatDate(today, 'YYYY-MM-DD')
  getList()
  getStatistic()
})
</script>
<style scoped lang="less">
* {
  --min-width: 1200px;
}

.el-card {
  border: 0;
  border-radius: 8px;
  min-width: var(--min-width);
}

.statistic {
  min-width: var(--min-width);

  .el-card__body {
    padding: 16px 20px;

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      .title {
        color: #3d3d3d;
        line-height: 1;
      }

      .options {
        display: flex;
        align-items: center;
      }
    }

    .content {
      .content-item {
        padding: 16px;
        min-height: 51px;
        height: 100%;
        box-sizing: border-box;
        background: #f8f8f9;
        border-radius: 8px;
        border: 1px solid #e5e5e5;

        &:hover {
          background: #ebf3fe;
          border: 1px solid #ebf3fe;
        }

        .label {
          font-size: 14px;
          color: #666666;
          line-height: 150%;
          white-space: nowrap;
        }

        .value {
          margin-top: 12px;

          .prop {
            font-size: 20px;
            font-weight: 500;
            line-height: 150%;
            letter-spacing: normal;
            color: #0064ff;
          }

          .equel {
            display: flex;
            align-items: center;
          }

          .text {
            font-size: 14px;
            font-weight: normal;
            line-height: 150%;
            letter-spacing: normal;
            color: #666666;
            white-space: nowrap;
          }

          .tendency {
            font-size: 14px;
            font-weight: 500;
            line-height: 150%;
            letter-spacing: normal;
            color: #333333;
          }
        }
      }
    }

    .el-col {
      &:nth-of-type(n + 5) {
        margin-top: 16px;
      }
    }
  }
}

.list {
  min-width: var(--min-width);
  margin-top: 24px;
  position: relative;
    & {
    --el-color-primary: #0064FF;
  }

  :deep(.el-card__body) {
    padding: 16px 20px;
  }

  .list-content {
    width: calc(800% + 160px);
    transition: all 0.2s;

    &.show-table {
      transform: translateX(0);
    }

    &.show-chart {
      transform: translateX(-12.5%);
    }

    &.show-chart_2 {
      transform: translateX(-37.5%);
    }

    &.show-chart_3 {
      transform: translateX(-25%);
    }
    &.show-table_2 {
      transform: translateX(-50%);
    }
  }
}

:deep(.cell) {
  position: relative;
  height: 23px;
  overflow: visible;

  .up {
    display: flex;
    align-items: center;
    text-indent: 10px;
    background: rgba(39, 123, 255, 0.2);
    height: 30px;
    width: calc(100% - 8px);
    position: absolute;
    top: -4px;
    left: 4px;
  }
}
</style>

<style lang="less">
.top10-cell {
  .cell {
    display: flex;
    align-items: center;
    // justify-content: center;
    height: 64px;
  }
}
</style>
