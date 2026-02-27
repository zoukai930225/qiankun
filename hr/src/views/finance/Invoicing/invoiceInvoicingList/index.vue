<!-- 发票开票列表 -->
<template>
  <div>
    <ContentWrap>
      <!-- 筛选框 -->
      <div class="commonTopFilterWrap">
        <div class="commonTopFilterWrap-filter">
          <el-form :inline="true" :model="queryParams" ref="queryFormRef" :label-width="100">
            <el-form-item label="订单编号：" prop="orderId">
              <el-input
                style="width: 200px"
                v-model.trim="queryParams.orderId"
                placeholder="请输入订单编号"
                clearable
                @keyup.enter="getList"
                @clear="getList"
              />
            </el-form-item>
            <el-form-item label="开票状态：" prop="invoiceStatus">
              <el-select
                style="width: 200px"
                v-model="queryParams.invoiceStatus"
                :empty-values="[null, undefined]"
                placeholder="请选择开票状态"
                clearable
                @change="getList"
                @clear="getList"
              >
                <el-option
                  v-for="item in invoiceStatusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="店铺：" prop="store">
              <StoreRangePlus
                ref="storeRangeRef"
                :showAllChannels="false"
                placeholder="请选择店铺"
                v-model="queryParams.store"
                style="width: 200px"
                @change="getList"
              />
            </el-form-item>
            <el-form-item label="入库时间：" prop="dataDate">
              <el-date-picker
                v-model="dataDateRange"
                type="daterange"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                style="width: 240px"
                @change="handleDateChange"
                @clear="handleDateChange"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
            <el-form-item label="发票抬头：" prop="invoiceTitle" v-show="isExpand">
              <el-input
                style="width: 200px"
                v-model.trim="queryParams.invoiceTitle"
                placeholder="请输入发票抬头"
                clearable
                @keyup.enter="getList"
                @clear="getList"
              />
            </el-form-item>
            <el-form-item label="数电票号码：" prop="invoiceNumber" v-show="isExpand">
              <el-input
                style="width: 200px"
                v-model.trim="queryParams.invoiceNumber"
                placeholder="请输入数电票号码"
                clearable
                @keyup.enter="getList"
                @clear="getList"
              />
            </el-form-item>

            <SWFilterExpandAll :isExpand="isExpand" @expand-click="isExpand = !isExpand" />
          </el-form>
        </div>
        <div class="commonTopFilterWrap-search">
          <div class="commonTopFilterWrap-search-container">
            <el-button @click="getList" class="commonSearchBtn">
              <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
              搜索
            </el-button>
            <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0">
              重置
            </el-button>
          </div>
        </div>
      </div>
      <!-- list列表 -->
      <div style="margin-top: 20px">
        <el-table
          :border="true"
          :header-cell-style="appStore.headerCellStyle"
          v-loading="loading"
          :data="list"
          :stripe="true"
          class="SWCommonTable"
          v-horizontal-scroll="'always'"
          show-overflow-tooltip
        >
          <el-table-column prop="storeName" label="店铺" />
          <el-table-column prop="dataDate" label="入库时间" />
          <el-table-column prop="orderId" label="订单编号" />
          <el-table-column prop="invoiceAmount" label="发票金额" />
          <el-table-column prop="invoiceTitle" label="发票抬头" />
          <el-table-column prop="invoiceStatus" label="开票状态">
            <template #default="{ row }">
              <div style="display: flex">
                {{ invoiceStatusMap[row.invoiceStatus] }}
                <div
                  v-if="
                    row.invoiceStatus === '-1' ||
                    row.invoiceStatus === '4' ||
                    row.invoiceStatus === '11'
                  "
                >
                  <el-tooltip
                    class="box-item"
                    effect="dark"
                    :content="row.exceptionReason"
                    placement="top"
                  >
                    <el-icon style="vertical-align: middle; color: #ff0200ad">
                      <QuestionFilled />
                    </el-icon>
                  </el-tooltip>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="invoiceNumber" label="数电票号码" />
          <el-table-column prop="" label="操作" align="center">
            <template #default="{ row }">
              <el-button link type="primary" @click="openDialog(row)">查看订单明细</el-button>
              <el-button
                v-if="row.invoiceStatus === '11'"
                link
                type="primary"
                @click="reInvoicing(row)"
                >重新开票</el-button
              >
              <el-button
                v-if="row.invoiceStatus === '4'"
                link
                type="primary"
                @click="handleInvoicing(row)"
                >处理</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <Pagination
          v-model:limit="queryParams.size"
          v-model:page="queryParams.page"
          :total="total"
          @pagination="getList"
        />
      </div>
    </ContentWrap>
    <!-- 抽屉 -->
    <div class="drawer-wrapper"> </div>
    <el-drawer
      v-model="drawer"
      direction="rtl"
      :with-header="false"
      :before-close="handleClose"
      size="40%"
    >
      <div>
        <div class="drawerTitle">
          <div>查看订单详情</div>
          <div @click="handleClose"
            ><el-icon> <CloseBold /> </el-icon
          ></div>
        </div>
      </div>
      <div class="drawerContent">
        <div style="display: flex; margin: 20px; padding-top: 20px">
          <div class="section-row-line"></div>
          <div class="item-title">订单数据</div>
        </div>
        <el-table
          :border="true"
          :header-cell-style="appStore.headerCellStyle"
          :data="tableData"
          style="width: 100%"
        >
          <el-table-column prop="productName" label="商品名称" />
          <el-table-column prop="quantity" label="数量" />
          <el-table-column prop="productAmount" label="金额" />
          <el-table-column prop="invoiceName" label="开票类目">
            <template #header>
              <div style="display: flex">
                <div>开票类目</div>
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="开票类目由系统根据“发票类目设置”中配置的关键字自动匹配，部分商品可能会因为关键字配置不合理，导致无法匹配到开票类目"
                  placement="top"
                >
                  <el-icon style="vertical-align: middle; color: #ff0200ad; margin-top: 4px">
                    <QuestionFilled />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="drawerContent">
        <div>
          <div style="display: flex; margin: 20px; padding-top: 20px; background-color: #fff">
            <div class="section-row-line"></div>
            <div class="item-title">原始数据</div>
          </div>
          <el-table
            :border="true"
            :header-cell-style="appStore.headerCellStyle"
            :data="oldTableData"
            style="width: 100%"
          >
            <el-table-column prop="applySerialNo" label="申请流水号" />
            <el-table-column prop="productName" label="商品名称" />
            <el-table-column prop="quantity" label="数量" />
            <el-table-column prop="productAmount" label="金额" />
          </el-table>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script setup lang="ts">
// import { CircleCheck } from '@element-plus/icons-vue'
import * as financeApi from '@/api/finance/index'
import { useAppStore } from '@/store/modules/app'
import { cloneDeep } from 'lodash-es'
import SWFilterExpandAll from '@/components/SWBaseComponent/SWFilterExpandAll/index.vue' // 展开组件
const appStore = useAppStore()
const message = useMessage() // 消息弹窗

const invoiceStatusList = [
  {
    label: '全部',
    value: ''
  },
  {
    label: '开票异常',
    value: '-1'
  },
  {
    label: '待开票',
    value: '0'
  },
  {
    label: '开票中',
    value: '1'
  },
  {
    label: '税务开票异常',
    value: '11'
  },
  {
    label: '已开电子发票',
    value: '12'
  },
  {
    label: '待上传',
    value: '2'
  },
  {
    label: '已完成',
    value: '3'
  },
  {
    label: '人工处理',
    value: '4'
  },
  {
    label: '已人工开票',
    value: '5'
  }
]

const invoiceStatusMap = ref({})
invoiceStatusList.forEach((status) => {
  invoiceStatusMap.value[status.value] = status.label
})
const queryParams = ref({
  page: 1,
  size: 10,
  store: '',
  orderId: '',
  invoiceTitle: '',
  invoiceStatus: '',
  invoiceNumber: '',
  dataDateStart: '' as any,
  dataDateEnd: '' as any
})
const dataDateRange = ref([])
// 时间选择
const handleDateChange = (dateRange: any) => {
  if (dateRange) {
    queryParams.value.dataDateStart = dateRange[0]
    queryParams.value.dataDateEnd = dateRange[1]
  } else {
    queryParams.value.dataDateStart = ''
    queryParams.value.dataDateEnd = ''
  }
  getList()
}
const isExpand = ref(false) // 是否展开
const list = ref([])
// 重置
const queryFormRef = ref()
const resetQuery = () => {
  queryFormRef.value.resetFields()
  dataDateRange.value = []
  queryParams.value.dataDateStart = ''
  queryParams.value.dataDateEnd = ''
  getList()
}
const drawer = ref(false)
// 店铺选择--打开弹窗
const storeRangeRef = ref()
const tableData = ref([])
const oldTableData = ref([])
const total = ref(0)
const loading = ref(false)

const getList = () => {
  loading.value = true
  financeApi
    .financeInvoiceRecordsStatus(queryParams.value)
    .then((res) => {
      loading.value = false
      total.value = res.total
      list.value = res.records
    })
    .catch(() => {
      loading.value = false
    })
}

const handleClose = () => {
  drawer.value = false
  tableData.value = []
}
const openDialog = async (row) => {
  const params = {
    dataDateTimeStr: formattedDateTime(row.dataDateTime),
    orderId: row.orderId
  }
  const res = await financeApi.getResourceOrderInfo(params)
  tableData.value = cloneDeep(row.categoryMappings)
  oldTableData.value = res
  console.log(res)
  drawer.value = true
}

const formattedDateTime = (dateTimeStr) => {
  const date = new Date(dateTimeStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

const reInvoicing = async (row) => {
  const params = {
    id: row.id
  }
  await message.confirm(`确认重新开票吗？重新开票后系统将在一段时间后重新运行该订单的开票操作`)
  await financeApi.reInvoicing(params)
  message.success('确认重新开票成功')
  getList()
}

// 人工开票状态的处理
const handleInvoicing = async (row) => {
  await message.confirm(`您确认已人工处理完成了吗？`)
  await financeApi.manualInvoicing({ id: row.id })
  message.success('操作成功')
  getList()
}

onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
:deep(.el-drawer) {
  border-top-left-radius: 16px !important;
  border-bottom-left-radius: 16px !important;
  overflow: hidden !important;
}

// 背景颜色
:deep(.el-drawer__body) {
  background-image: url('@/assets/imgs/drawer_bg.png') !important;
  background-size: cover !important;
}

.drawer-wrapper {
  overflow: hidden;
  border-radius: 16px;
}

.drawerTitle {
  font-size: 14px;
  display: flex;
  color: #333333;
  font-weight: 600;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin: 0 0 18px 0;
}

.drawerContent {
  width: 100%;
  padding: 0px 0px 0px 0;
  background-color: #fff;
  border-radius: 8px;
  box-sizing: border-box;
  margin-bottom: 12px;
}

.drawerFooter {
  display: flex;
  justify-content: flex-end;
  margin: 20px 0;
}

.section-row-line {
  margin-top: 5px;
  width: 3px;
  height: 10px;
  background: #0064ff;
  margin-right: 6px;
}

.item-title {
  width: 56px;
  height: 20px;
  font-family: AlibabaPuHuiTi_2_75_SemiBold;
  font-size: 14px;
  color: #333333;
  line-height: 20px;
  text-align: left;
  font-style: normal;
}
</style>
