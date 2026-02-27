<template>
  <div class="commonTopFilterWrap productInfoTopFilter">
    <div class="commonTopFilterWrap-filter">
      <el-form
        ref="queryFormRef"
        :inline="true"
        :model="queryParams"
        :label-width="70"
        @submit.prevent="handleQuery"
      >
        <el-form-item label="日期:" prop="timeRange">
          <el-date-picker
            v-model="timeRange"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            clearable
            @change="handleQuery"
          />
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
        <component :is="easyBtnGroup(btns)" />
      </div>
    </div>
  </div>

  <div class="table-wrapper">
    <list-table :list="list" :total="total" :loading="loading" @cell-click="handleCellClick" />
    <div class="pagination">
      <!-- 分页 -->
      <Pagination
        v-model:limit="queryParams.size"
        v-model:page="queryParams.page"
        :total="total"
        @pagination="getList"
      />
    </div>
  </div>
  <ProductCodeDialog ref="productCodeRef" @product-click="handleProductCodeClick" />
  <MerchantCodeDialog ref="merchantCodeRef" />
</template>

<script lang="tsx" setup>
import * as DailyReportApi from '@/api/supplier/warehouseShippingDailyReport'
import ProductCodeDialog from './components/productCodeDialog.vue'
import MerchantCodeDialog from './components/merchantCodeDialog.vue'
import listTable from './components/listTable.vue'
import download from '@/utils/download'
import dayjs from 'dayjs'
import { Icon } from '@/components/Icon'
import { easyBtnGroup } from '../components/twoFourSix'

const message = useMessage() // 消息弹窗

// 查询参数
const queryFormRef = ref()
const queryParams = ref({
  dateStart: '',
  dateEnd: '',
  page: 1,
  size: 10
})

const timeRange = ref([]) // 时间范围

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.page = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  timeRange.value = []
  queryFormRef.value?.resetFields()
  handleQuery()
}

// 操作按钮
const btns = computed(() => [
  {
    label: '导出',
    type: 'primary',
    icon: <Icon icon="ep:download" />,
    permission: 'WarehouseShippingDailyReport:Export',
    onClick: exportData
  }
])

// 列表数据
const loading = ref(false) // 加载状态
const total = ref(0)
const list = ref<any>([])
const getList = async () => {
  try {
    loading.value = true
    if (timeRange.value && timeRange.value.length > 0) {
      queryParams.value.dateStart = timeRange.value[0]
      queryParams.value.dateEnd = timeRange.value[1]
    } else {
      queryParams.value.dateStart = ''
      queryParams.value.dateEnd = ''
    }

    const params = { ...queryParams.value }

    const res = await DailyReportApi.getWarehouseShippingDailyReport(params)
    list.value = res.records || []
    total.value = res.total || 0
  } finally {
    loading.value = false
  }
}

// 点击单元格事件
const productCodeRef = ref() // 货品编码弹窗
const handleCellClick = (warehouseData) => {
  console.log('仓库数据', warehouseData)
  productCodeRef.value?.open(warehouseData)
}

const merchantCodeRef = ref() // 商户编码弹窗
const handleProductCodeClick = (productCodeData) => {
  console.log('货品编码数据', productCodeData)
  merchantCodeRef.value?.open(productCodeData)
}

// 数据导出
const exportData = async () => {
  if (timeRange.value && timeRange.value.length > 0) {
    const loadingInstance = ElLoading.service({ fullscreen: false, text: '数据导出中......' })
    queryParams.value.dateStart = timeRange.value[0]
    queryParams.value.dateEnd = timeRange.value[1]
    const { dateStart, dateEnd } = queryParams.value
    try {
      const res = await DailyReportApi.warehouseDeliveryDailyExport({ dateStart, dateEnd })
      if (res) {
        const time = dayjs().format('YYYYMMDDHHmmss')
        download.excel(res, `仓库发货日报${time}.xlsx`)
        message.success('导出成功')
      }
    } finally {
      loadingInstance.close()
    }
  } else {
    queryParams.value.dateStart = ''
    queryParams.value.dateEnd = ''
    return message.confirm('请先选择日期')
  }
}

onMounted(async () => {
  getList()
})
</script>

<style lang="scss" scoped>
//@use './index.scss';

// 查询条件
.productInfoTopFilter {
  background-color: #fff;
  padding: 20px 20px 0 20px;
  border-radius: 12px 12px 0 0;
  min-width: 1000px;
}

:deep(.el-button-group) {
  display: flex;
  margin-left: 12px;
}

:deep(.longlabel .el-form-item--default .el-form-item__label) {
  line-height: 1.5;
}

:deep(.el-form--inline .el-form-item) {
  margin-right: 16px;
}

// 表格样式
.table-wrapper {
  background: #fff;
  padding: 20px;
  box-sizing: border-box;
  border-radius: 0 0 12px 12px;

  .tab-wrapper {
    .tabs-label {
      display: flex;
      align-items: center;
    }

    .tab-icon {
      width: 16px;
      margin-right: 8px;
    }

    :deep(.el-tabs__item.is-active),
    :deep(.el-tabs__item:hover) {
      color: #0064ff;
    }

    :deep(.el-tabs__active-bar) {
      background-color: #0064ff;
    }
  }
}

// 分页
.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
