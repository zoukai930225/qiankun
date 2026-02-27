<template>
  <SWDrawer v-model="drawerVisible" :title="drawerTitle">
    <el-card shadow="never" class="dashboard" >
      <el-tabs v-loading="drawerLoading" v-model="drawerType" @tab-change="handleTabChange">
        <el-tab-pane v-for="tab in tabList" :key="tab.name" :label="tab.label" :name="tab.name">
          <div class="flex justify-between">
            <el-form ref="formRef" :model="form" label-width="auto" inline>
              <el-form-item label="反馈日期" prop="type">
                <el-date-picker
                  style="width: 300px"
                  v-model="dateRange"
                  type="daterange"
                  value-format="YYYY-MM-DD"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="handleDateChange"
                  :clearable="false"
                />
              </el-form-item>
            </el-form>
            <div>
              <el-button @click="resetQuery" class="commonResetBtn"> 重置 </el-button>
              <el-button
                @click="exportData"
                :loading="exportLoading"
                style="width: 80px"
                type="primary"
              >
                <img :src="downloadSvg" class="mr6px">
                导出
              </el-button>
            </div>
          </div>
          <el-table
            class="SWCommonTable"
            :header-cell-style="{
              backgroundColor: '#F2F6FC',
              fontWeight: '500',
              height: '52px'
            }"
            :data="displayedList"
            width="100%"
            :show-overflow-tooltip="false"
            v-loading="loading"
            v-horizontal-scroll="'always'"
            :row-class-name="tableRowClassName"
            :row-style="{
              height: '64px'
            }"
          >
            <el-table-column :label="dateRangeDisplay" align="center">
              <el-table-column prop="title" :label="getCurrentTitle(drawerType)" align="center" />
              <el-table-column prop="num" label="数量" align="center">
                <template #default="{ row }">
                  <div :class="row.title === '合计' ? 'summary-count' : ''">
                    {{ row.num || 0 }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="percent" label="占比" align="center">
                <template #default="{ row }">
                  <div class="percentage">
                    <div
                      class="percentage-progress-label"
                      :style="{ width: progressLabelWidth(formatPercent(row.percent)) }"
                    ></div>
                    <span class="percentage-text">
                      {{ formatPercent(row.percent, true) }}
                    </span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="已完成量" prop="completedNum" align="center"></el-table-column>
              <el-table-column label="24小时完成数" prop="completedDayNum" align="center"></el-table-column>
              <el-table-column label="24小时完成率" prop="completedDayRate" align="center">
                <template #default="{ row }">
                  <div class="percentage">
                    <div
                      class="percentage-progress-label"
                      :style="{ width: progressLabelWidth(formatPercent(row.completedDayRate)) }"
                    ></div>
                    <span class="percentage-text">
                      {{ formatPercent(row.completedDayRate, true) }}
                    </span>
                  </div>
                </template>
              </el-table-column>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    
    <template #footer>
      <el-button @click="reset" class="mr20px">关闭</el-button>
    </template>
  </SWDrawer>
</template>
<script lang="ts" setup>
import { getDictLabel, DICT_TYPE } from '@/utils/dict'
import dayjs from 'dayjs'
import download from '@/utils/download'
import * as problemFeedbackApi from '@/api/customerService/problemFeedback'
import {ref,computed } from 'vue'
import { ElLoading } from 'element-plus'
const drawerVisible = ref(false)
const drawerTitle = ref('')
const drawerLoading = ref(false)
const drawerType = ref('type')
import downloadSvg from '@/assets/svgs/common/download.svg'
const open = async () => {
  drawerVisible.value = true
  drawerTitle.value = '数据看板'
  getDateRangeDisplay(dateRange.value)
  getList()
}

// 获取当前标题
const getCurrentTitle = (type: string) => {
  const titleMap = {
    type: '问题反馈类型',
    category: '品类',
    dept: '问题处理部门'
  }
  return titleMap[type] || ''
}

const tabList = ref([
  {
    name:'type',
    label:'问题反馈类型'
  },
  {
    name:'category',
    label:'品类'
  },
  {
    name:'dept',
    label:'问题处理部门'
  },
])
//
const handleTabChange = (pane:any) => {
  console.log(pane)
  getList()
}
const dateRangeDisplay = ref('')
// 重置查询条件
const resetQuery = () => {
  dateRange.value = [firstDayOfMonth, today]
  handleDateChange(null)
}

const form = ref({
  feedbackDateStart: '',
  feedbackDateEnd: ''
})
// 处理默认日期
const firstDayOfMonth = dayjs().startOf('month').format('YYYY-MM-DD')
const today = dayjs().format('YYYY-MM-DD')
const dateRange = ref([firstDayOfMonth, today])
const handleDateChange = (vals) => {
  if (vals && vals.length) {
    form.value.feedbackDateStart = vals[0]
    form.value.feedbackDateEnd = vals[1]
  } else {
    form.value.feedbackDateStart = ''
    form.value.feedbackDateEnd = ''
  }
  getDateRangeDisplay(vals)
  getList()
}
const getDateRangeDisplay = (dateRange) => {
  if (dateRange?.length) {
    const start = dateRange[0]
    const end = dateRange[1]
    dateRangeDisplay.value = `${start} ~ ${end}`
  } else {
    dateRangeDisplay.value = ''
  }
}

// 总数行
const summaryRow = ref({})

// 在列表前面插入总数行
const displayedList = computed(() => {
  return [summaryRow.value, ...list.value]
  // return [...list.value]
})

const tableRowClassName = ({ row }) => {
  // console.log('a', row)
  return row.title === '合计' ? 'summary-row' : ''
}
const list = ref<any[]>([])
const loading = ref(false) // 列表的加载中
const getList = async () => {
  loading.value = true
  try {
    if (dateRange.value?.length) {
      form.value.feedbackDateStart = dateRange.value[0]
      form.value.feedbackDateEnd = dateRange.value[1]
    } else {
      form.value.feedbackDateStart = ''
      form.value.feedbackDateEnd = ''
    }
    if (drawerType.value === 'type') {
      // 问题反馈类型
      const data = await problemFeedbackApi.getListTypeRate(form.value)
      if (data) {
        list.value = data.map((item) => ({
          ...item,
          title: getDictLabel(DICT_TYPE.CS_PROBLEM_FEEDBACK_TYPE, item.type) || item.typeTxt
        }))
      }
    }
    if (drawerType.value === 'category') {
      //品类
      const data = await problemFeedbackApi.getListCategoryRate(form.value)
      if (data) {
        list.value = data.map((item) => ({
          ...item,
          title:
            getDictLabel(DICT_TYPE.CS_PROBLEM_FEEDBACK_CATEGORY, item.category) || item.categoryTxt
        }))
      }
    }
    if (drawerType.value === 'dept') {
      //问题处理部门
      const data = await problemFeedbackApi.getListHandleDeptRate(form.value)
      if (data) {
        list.value = data.map((item) => ({
          ...item,
          title:
            getDictLabel(DICT_TYPE.CS_PROBLEM_FEEDBACK_HANDLE_DEPT, item.handleDept) ||
            item.handleDeptTxt
        }))
      }
    }

    const sumRowIndex = list.value.findIndex((item) => item.title === '合计')
    summaryRow.value = list.value[sumRowIndex]
    list.value.splice(sumRowIndex, 1)
  } finally {
    loading.value = false
  }
}
const exportLoading = ref(false)
const exportData = async () => {
  const loadingInstance = ElLoading.service({
    lock: true
  })
  try {
    if (dateRange.value?.length) {
      form.value.feedbackDateStart = dateRange.value[0]
      form.value.feedbackDateEnd = dateRange.value[1]
    } else {
      form.value.feedbackDateStart = ''
      form.value.feedbackDateEnd = ''
    }
    if (drawerType.value === 'type') {
      // 问题反馈类型
      const data = await problemFeedbackApi.exportTypeRate(form.value)
      if (data) {
        download.excel(data, '问题反馈类型占比统计表.xlsx')
      }
    }
    if (drawerType.value === 'category') {
      //品类
      const data = await problemFeedbackApi.exportCategoryRate(form.value)
      if (data) {
        download.excel(data, '品类占比统计表.xlsx')
      }
    }
    if (drawerType.value === 'dept') {
      //问题处理部门
      const data = await problemFeedbackApi.exportHandleDeptRate(form.value)
      if (data) {
        download.excel(data, '问题处理部门占比统计表.xlsx')
      }
    }
  } finally {
    loadingInstance.close()
  }
}
// 保留两位小数并可选加%
function formatPercent(percent: string, withSymbol = false) {
  if (!percent) return withSymbol ? '0.00%' : '0.00'
  const num = parseFloat(percent.replace('%', ''))
  const fixed = isNaN(num) ? '0.00' : num.toFixed(2)
  return withSymbol ? `${fixed}%` : fixed
}

// 进度条宽度
function progressLabelWidth(percent: string) {
  // 这里 percent 已经是去掉%的数字字符串
  return `${percent}%`
}
const reset = () => {
  drawerVisible.value = false
}
defineExpose({ open })
</script>

<style lang="less" scoped>
:deep(.el-card__body){
  padding: 0!important;
}
.dashboard {
  background-color: #fff;
  width: 100%;
  min-height: calc(100% - 10px);
  border-radius: 10px;
  border: none;
  padding: 10px;
  .percentage {
    position: relative;
    width: 100%;
    height: 32px;
    line-height: 32px;
    text-align: center;
    color: #0064ff;
    border-radius: 3px;
    background: #d3e4ff51;
    box-sizing: border-box;
    overflow: hidden;
    /* 让内容不超出 */
  }

  .percentage-progress-label {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    background: #d3e4ff;
    z-index: 0;
    border-radius: 3px;
    transition: width 0.3s;
  }

  .percentage-text {
    position: relative;
    z-index: 1;
    /* 保证文字在进度条上方 */
  }
}
</style>
