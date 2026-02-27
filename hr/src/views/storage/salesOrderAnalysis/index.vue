<template>
  <div>
    <div class="commonTopFilterWrap salesOrderAnalysisWrap">
      <div class="commonTopFilterWrap-filter">
        <el-form ref="queryFormRef" inline :model="queryParams">
          <el-form-item label="付款时间:">
            <el-date-picker v-model="dateRange.payTime" range-separator="-" value-format="YYYY-MM-DD" type="daterange"
              start-placeholder="开始日期" end-placeholder="结束日期" style="width: 230px" @clear="handleClear('payTime')" />
          </el-form-item>
          <el-form-item label="审核时间:">
            <el-date-picker v-model="dateRange.createTime" type="daterange" value-format="YYYY-MM-DD"
              range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 230px"
              :clearable="false" />
          </el-form-item>
          <el-form-item label="" prop="filterTxt">
            <el-dropdown placement="bottom" trigger="click" @command="handleCommand">
              <div class="dropdown-button">{{ selectedFilterLabel }}
                <el-icon class="compare-icon">
                  <arrow-down />
                </el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item :command="item.value" v-for="item in filterFieldOptions" :key="item.value">{{
                    item.label }}</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-input v-model="queryParams.filterTxt" placeholder="请输入" clearable style="width: 220px" />
          </el-form-item>
          <el-form-item label="审核用时:" prop="auditDuration" v-if="isExpand">
            <div class="duration-filter-container">
              <el-dropdown placement="bottom" trigger="click" @command="handleCompareCommand">
                <div class="dropdown-button">{{ selectedAuditDurationOption }}
                  <el-icon class="compare-icon">
                    <arrow-down />
                  </el-icon>
                </div>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item :command="item.value" v-for="item in durationOption" :key="item.value">
                      {{ item.label }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>

              <el-input v-model="queryParams.auditDuration" placeholder="请输入" clearable type="number"
                style="width: 182px" class="duration-input" />
            </div>
          </el-form-item>
          <el-form-item label="发货用时:" prop="deliveryDuration" v-if="isExpand">
            <div class="duration-filter-container">
              <el-dropdown placement="bottom" trigger="click" @command="handleShippingDurationCommand">
                <div class="dropdown-button">{{ selectedShippingDurationOption }}
                  <el-icon class="compare-icon">
                    <arrow-down />
                  </el-icon>
                </div>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item :command="item.value" v-for="item in durationOption" :key="item.value">
                      {{ item.label }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>

              <el-input v-model="queryParams.deliveryDuration" placeholder="请输入" clearable style="width: 185px"
                class="duration-input" type="number" />
            </div>
          </el-form-item>

          <el-form-item v-if="isExpand" label="订单来源:" prop="orderSource">
            <el-select v-model="queryParams.orderSource" clearable @change="handleQuery">
              <el-option v-for="item in orderSourceOps" :key="item.value" :value="item.value" :label="item.label" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="commonTopFilterWrap-search">
        <div class="commonTopFilterWrap-search-container">
          <el-button @click="handleQuery" class="commonSearchBtn">
            <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
            搜索
          </el-button>
          <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0">
            重置
          </el-button>
          <el-button @click="handleExport" :loading="exportLoading" type="primary"> 导出 </el-button>
          <SWFilterExpandAllNew :isExpand="isExpand" @expand-click="isExpand = !isExpand" />
        </div>
      </div>
    </div>
    <div class="table-wrapper">
      <list-table :list="list" :total="total" :loading="loading" :orderSourceOps="orderSourceOps" @sort="handleSort" />
      <div class="pagination">
        <Pagination v-model:limit="queryParams.size" v-model:page="queryParams.page" :total="total"
          @pagination="getList" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import SWFilterExpandAllNew from '@/components/SWBaseComponent/SWFilterExpandAllNew/index.vue'
import * as salesOrderAnalysisApi from '@/api/storage/salesOrderAnalysis'
import listTable from './components/listTable.vue'
import download from '@/utils/download'
const message = useMessage() // 消息弹窗

const isExpand = ref(false) // 展开/收起全部筛选条件

// 创建时间和付款时间
// 设置初始日期范围
const getDefaultDateRange = (): [any, any] => {
  return [dayjs().subtract(3, 'day').startOf('day').format('YYYY-MM-DD'), dayjs().endOf('day').format('YYYY-MM-DD')]
}



const dateRange = ref<any>({
  createTime: getDefaultDateRange(),
  payTime: []
})

console.log(dateRange.value);

//筛选条件 -订单号/出库单号/店铺
const filterFieldOptions = [
  { label: '订单号', value: 'orderNumber' },
  { label: '出库单号', value: 'outboundOrderNumber' },
  { label: '店铺', value: 'storeName' }
]

// 回显值 -根据当前选中的 value 找到对应的 label
const selectedFilterLabel = computed(() => {
  const option = filterFieldOptions.find((item) => item.value === queryParams.value.filterField)
  return option ? option.label : '请选择'
})

// 切换筛选条件-订单号/出库单号/店铺
const handleCommand = (command) => {
  queryParams.value.filterField = command
  queryParams.value.filterTxt = '' // 重置筛选字段值
}

// 审核用时/发货用时 -大于小于等于
const durationOption = [
  { label: '大于', value: 1 },
  { label: '小于', value: 2 },
  { label: '等于', value: 3 }
]

const orderSourceOps = getIntDictOptions(DICT_TYPE.SALES_OUTBOUND_ORDER_ORDER_SOURCE, true)

// 审核用时: 1-大于、2-小于、3-等于
const selectedAuditDurationOption = computed(() => {
  const option = durationOption.find(
    (item) => item.value === queryParams.value.auditDurationCompare
  )
  return option ? option.label : '请选择'
})

// 审核用时 -切换
const handleCompareCommand = (command) => {
  queryParams.value.auditDurationCompare = command
  queryParams.value.auditDuration = '' // 重置审核用时值
}

// 发货用时 -回显
const selectedShippingDurationOption = computed(() => {
  const option = durationOption.find(
    (item) => item.value === queryParams.value.deliveryDurationCompare
  )
  return option ? option.label : '请选择'
})
// 发货用时 -切换
const handleShippingDurationCommand = (command) => {
  queryParams.value.deliveryDurationCompare = command
  queryParams.value.deliveryDuration = '' // 重置发货用时值
}

// 查询参数
const queryFormRef = ref()
const queryParams = ref<any>({
  size: 10,
  page: 1,
  filterField: 'orderNumber', // 筛选字段  orderNumber-订单号; outboundOrderNumber-出库单号; storeName-店铺
  filterTxt: '', // 筛选字段值
  createTimeStart: '', // 创建时间开始
  createTimeEnd: '', // 创建时间结束
  paymentTimeStart: '', // 付款时间开始
  paymentTimeEnd: '', // 付款时间结束
  auditDurationCompare: 1, //审核用时: 1-大于、2-小于、3-等于
  auditDuration: '', //审核用时
  deliveryDurationCompare: 1, //发货用时: 1-大于、2-小于、3-等于
  deliveryDuration: '', //发货用时
  sortReqVos: []
})

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.page = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  //  重置时间范围
  dateRange.value.createTime = getDefaultDateRange()
  dateRange.value.payTime = []

  queryFormRef.value?.resetFields()

  // 手动重置未绑定到表单控件的字段
  queryParams.value.filterField = 'orderNumber'
  queryParams.value.auditDurationCompare = 1
  queryParams.value.deliveryDurationCompare = 1

  queryParams.value.sortReqVos = []
  console.log('--', queryParams.value)
  handleQuery()
}

// 在提交数据的时候处理日期范围 给查询参数赋值
const handleDateRange = (range, startKey, endKey) => {
  if (Array.isArray(range) && range.length === 2) {
    queryParams.value[startKey] = dayjs(range[0]).format('YYYY-MM-DD')
    queryParams.value[endKey] = dayjs(range[1]).format('YYYY-MM-DD')
  } else {
    queryParams.value[startKey] = ''
    queryParams.value[endKey] = ''
  }
}
// 列表数据
const loading = ref(false) // 加载状态
const total = ref(0)
const list = ref<any>([])
const getList = async () => {
  try {
    loading.value = true
    // 处理创建时间和付款时间
    handleDateRange(dateRange.value.createTime, 'createTimeStart', 'createTimeEnd')
    handleDateRange(dateRange.value.payTime, 'paymentTimeStart', 'paymentTimeEnd')
    console.log('查询条件', queryParams.value)
    const params = { ...queryParams.value }

    const res = await salesOrderAnalysisApi.getSalesOrderAnalysisList(params)
    list.value = res.records || []
    total.value = res.total || 0
  } finally {
    loading.value = false
  }
}

// 清空时间查询条件
const handleClear = (key) => {
  dateRange.value[key] = []
}

//排序
const handleSort = ({ prop, order }) => {
  const sortArray: { field: string; isAsc: boolean }[] = []

  // 如果有排序方式（ascending / descending），则设置新排序
  if (order) {
    sortArray.push({
      field: prop,
      isAsc: order === 'ascending'
    })
  }

  // 更新查询参数
  queryParams.value.sortReqVos = sortArray

  console.log('请求参数 sortReqVos:', queryParams.value.sortReqVos)

  // 请求数据
  getList()
}

//导出
const exportLoading = ref(false) // 导出状态
const handleExport = async () => {
  try {
    exportLoading.value = true
    const params = { ...queryParams.value }
    const res = await salesOrderAnalysisApi.exportSalesOrderAnalysis(params)
    if (res) {
      download.excel(res, `销售订单分析.xls`)
      message.success('导出成功')
    }
  } catch {
    message.error('导出失败')
  } finally {
    exportLoading.value = false
  }
}

onMounted(() => {
  getList()
})
</script>

<style lang="less" scoped>
* {
  --el-select-width: 232px;
}

// 查询条件
.salesOrderAnalysisWrap {
  background-color: #fff;
  padding: 20px 20px 0 20px;
  border-radius: 12px 12px 0 0;
  min-width: 1000px;

  .dropdown-button {
    height: 32px;
    line-height: 32px;
    border: 1px solid #dcdfe6;
    border-right: none;
    padding: 0 10px;
    border-radius: 4px 0 0 4px;

    .compare-icon {
      cursor: pointer;
      vertical-align: middle;
    }
  }
}

:deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
}

:deep(.longlabel .el-form-item--default .el-form-item__label) {
  // line-height: 1.5;
}

:deep(.el-form--inline .el-form-item) {
  // margin-right: 16px;
}

// 表格样式
.table-wrapper {
  background: #fff;
  padding: 20px;
  box-sizing: border-box;
  border-radius: 0 0 12px 12px;
}

// 分页
.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
