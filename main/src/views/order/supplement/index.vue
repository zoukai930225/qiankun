<template>
  <!-- 列表 -->
  <ContentWrap>
    <!-- 搜索工作栏 -->

    <div class="commonTopFilterWrap">
      <div class="commonTopFilterWrap-filter">
        <el-form
          class="-mb-15px"
          :model="queryParams"
          ref="queryFormRef"
          :inline="true"
          label-width="78px"
        >
          <el-form-item label="订单号:" prop="orderNumber">
            <el-input
              v-model="queryParams.orderNumber"
              placeholder="请输入订单号"
              clearable
              @clear="handleQuery"
              @keyup.enter="handleQuery"
              :prefix-icon="Search"
              class="searchFormItemWidth"
            />
          </el-form-item>
          <el-form-item label="刷单时间:" prop="brushTime">
            <el-date-picker
              v-model="queryParams.brushTime"
              value-format="YYYY-MM-DD"
              type="date"
              placeholder="请选择刷单时间"
              class="!w-200px"
              @change="handleQuery"
              @clear="handleQuery"
            />
          </el-form-item>
          <el-form-item label="店铺:" prop="storeId">
            <StoreRangePlus
              v-model="queryParams.storeId"
              placeholder="请选择店铺"
              @change="handleQuery"
            />
          </el-form-item>
          <el-form-item label="品类:" prop="categoryId">
            <el-select
              class="searchFormItemWidth"
              v-model="queryParams.categoryId"
              placeholder="请选择品类"
              @change="handleQuery"
              @clear="handleQuery"
              clearable
            >
              <el-option
                v-for="item in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_CATEGORY)"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
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
          <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0px">
            重置
          </el-button>
          <SWFilterAdd
            class="commonAddBtn"
            :list="addList"
            :current-code="currentAddCode"
            :loading="exporting"
            @add-btn-click="addBtnClick"
          />
        </div>
      </div>
    </div>
    <div style="height: 20px"></div>
    <div class="topStatics row-center">
      <div class="topStatics-title">刷单金额</div>
      <div class="topStatics-value"
        >￥{{ orderTotalInfo.amountSum ? orderTotalInfo.amountSum : '-' }}</div
      >
      <div class="topStatics-space"></div>
      <div class="topStatics-title">刷单佣金</div>
      <div class="topStatics-value"
        >￥{{ orderTotalInfo.commissionSum ? orderTotalInfo.commissionSum : '-' }}</div
      >
    </div>
    <el-table
      :border="true"
      :header-cell-style="appStore.headerCellStyle"
      v-loading="loading"
      :data="list"
      :stripe="true"
      :show-overflow-tooltip="true"
      class="SWCommonTable"
      v-horizontal-scroll="'always'"
    >
      <el-table-column label="订单号" prop="orderNumber" min-width="220" show-overflow-tooltip />
      <el-table-column label="刷单金额" prop="amount" min-width="150" show-overflow-tooltip />
      <el-table-column label="刷单佣金" prop="commission" min-width="150" show-overflow-tooltip />
      <el-table-column label="店铺" prop="storeName" min-width="160" show-overflow-tooltip>
        <template #default="scope">
          {{ scope.row.storeName || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="品类" prop="storeName" min-width="160" show-overflow-tooltip>
        <template #default="scope">
          {{ scope.row.categoryName || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="刷单时间" prop="brushTime" width="160" show-overflow-tooltip />
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.page"
      v-model:limit="queryParams.size"
      @pagination="getList"
    />
  </ContentWrap>
  <!-- 表单弹窗：添加/修改 -->
  <ImportDataDialog ref="formRef" @success="getList" />
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { Search } from '@element-plus/icons-vue'

import * as OrderApi from '@/api/order'
import ImportDataDialog from './components/importDataDialog.vue'
const appStore = useAppStore()

import download from '@/utils/download'

defineOptions({ name: 'OrderSupplement' })

const loading = ref(true) // 列表的加载中
const list = ref<any[]>([]) // 列表的数据
const orderTotalInfo = ref<OrderApi.SupplementOrderTotalVO>({
  amountSum: 0,
  commissionSum: 0
}) // 订单统汇总信息
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  page: 1,
  size: 10,
  orderNumber: '',
  brushTime: '',
  storeId: '',
  categoryId: ''
})
const queryFormRef = ref() // 搜索的表单

const addList = ref([
  {
    label: '导入补单数据',
    code: 'import'
  },
  {
    label: '模版下载',
    code: 'template'
  }
])
// 当前新增按钮code码
const currentAddCode = ref('import')
// 新增按钮点击
const addBtnClick = (value) => {
  if (value) {
    currentAddCode.value = value.code
    if (currentAddCode.value === 'import') {
      importData()
    } else if (currentAddCode.value === 'template') {
      templateFileDownload()
    }
  }
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await OrderApi.getSupplementOrdersPage(queryParams)
    list.value = data.data || []
    total.value = data.total
    getOrderTotal()
  } finally {
    loading.value = false
  }
}

/**
 * 获取订单汇总
 */
const getOrderTotal = async () => {
  const data = await OrderApi.getSupplementOrdersTotal(queryParams)
  orderTotalInfo.value = data || {}
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.page = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 导入操作 */
const formRef = ref()
const importData = () => {
  formRef.value.open()
}

/** 补单数据模版下载 */
const exporting = ref(false)
const templateFileDownload = async () => {
  exporting.value = true
  const data = await OrderApi.supplementOrdersTemplateExport().catch(() => {
    exporting.value = false
  })
  exporting.value = false
  if (data) {
    download.excel(data, '补单数据导入模板.xls')
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
.topStatics {
  padding-left: 16px;
  height: 48px;
  margin-bottom: 16px;
  background: #ecf5ff;
  &-title {
    font-size: 14px;
    color: #333;
    padding-right: 16px;
  }
  &-value {
    font-size: 16px;
    font-weight: 600;
    pointer-events: none;
    color: #126efe;
  }
  &-space {
    width: 44px;
  }
}
</style>
