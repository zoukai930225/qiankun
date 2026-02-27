<template>
  <ContentWrap>
    <div class="commonTopFilterWrap">
      <div class="commonTopFilterWrap-filter rule-form">
        <el-form ref="queryFormRef" :inline="true" :model="queryParams" label-width="66px">
          <el-form-item label="日期段" class="each-form upload-time">
            <el-date-picker v-model="times" type="daterange" start-placeholder="开始日期" format="YYYY-MM-DD"
              value-format="YYYY-MM-DD" end-placeholder="结束日期" @change="handleDateChange" :clearable="false">
              <template #range-separator><span style="color: #000;">至</span></template>
            </el-date-picker>
          </el-form-item>
          <el-form-item label="店铺" prop="store" class="each-form">
            <store-cascader v-model="queryParams.store" :cascaderProps="{
              multiple: true,
            }" @change="handleQuery" use-premission />
          </el-form-item>
          <el-form-item label="发货时间段" class="each-form upload-time times-select">
            <el-time-picker v-model="payTimes" is-range start-placeholder="开始时间" end-placeholder="结束时间"
              format="HH:mm:ss" value-format="HH:mm:ss" @change="handleQuery" range-separator="至" :clearable="false" />
          </el-form-item>
          <el-form-item label="订单类型" prop="isValid" class="each-form">
            <el-select v-model="queryParams.isValid" placeholder="请选择订单类型" clearable class="width-220"
              @change="handleQuery">
              <el-option :label="value.label" :value="value.value" v-for="value in vaildList" :key="value.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="关键词" prop="key" class="each-form">
            <key-select v-model.trim="queryParams.key" class="width-220" @change="handleQuery" />
            <info class="ml20px" />
          </el-form-item>
        </el-form>
      </div>
      <div class="commonTopFilterWrap-search">
        <div class="commonTopFilterWrap-search-container">
          <el-button @click="handleQuery" class="commonSearchBtn">
            <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
            搜索
          </el-button>
          <el-button class="commonResetBtn" style="margin-left: 0px" @click="resetQuery">
            重置
          </el-button>
          <el-button type="primary" :loading="exportLoading" @click="exportData">
            导出
          </el-button>
          <el-button type="primary" @click="() => downloadDrawerRef?.open()">
            结果下载
          </el-button>
        </div>
      </div>
    </div>
    <!-- 列表 -->
    <el-table :header-cell-style="appStore.headerCellStyle" v-loading="loading" :data="list"
      :show-overflow-tooltip="true" row-class-name="commonTableRow" class="SWCommonTable" v-horizontal-scroll="'always'"
      ref="tableRef" highlight-current-row border :tooltip-options="{ popperClass: 'refund-tips' }">
      <el-table-column label="渠道" prop="channelName" min-width="100"
        :formatter="(row: any) => formatterValue(row, 'channelName', '-')" fixed="left" />
      <el-table-column label="店铺" prop="storeName" min-width="180" fixed="left"
        :formatter="(row: any) => formatterValue(row, 'storeName', '-')" />
      <el-table-column label="发生日期" prop="dataDate" min-width="120"
        :formatter="(row: any) => formatTime(row.dataDate, 'yyyy-MM-dd') || '-'" />
      <el-table-column label="订单号" prop="orderNo" min-width="220"
        :formatter="(row: any) => formatterValue(row, 'orderNo', '-')" />
      <el-table-column label="子订单号" prop="subOrderNo" min-width="220"
        :formatter="(row: any) => formatterValue(row, 'subOrderNo', '-')" />
      <el-table-column label="商品ID" prop="goodsId" min-width="180"
        :formatter="(row: any) => formatterValue(row, 'goodsId', '-')" />
      <el-table-column label="仓库" prop="wareHouse" min-width="180"
        :formatter="(row: any) => formatterValue(row, 'wareHouse', '-')" />
      <el-table-column label="付款时间" prop="payTime" min-width="180"
        :formatter="(row: any) => formatTime(row.payTime, 'yyyy-MM-dd HH:mm:ss') || '-'" />
      <el-table-column label="快递公司" prop="expressCompany" min-width="180"
        :formatter="(row: any) => formatterValue(row, 'expressCompany', '-')" />
      <el-table-column label="该订单与订单占比" prop="orderOrderRatio" min-width="140" align="right"
        :formatter="(row: any) => formatValue(row, 'orderOrderRatio')" />
      <el-table-column label="快递费用" prop="expressFee" min-width="120" align="right"
        :formatter="(row: any) => formatValue(row, 'expressFee')" />
      <el-table-column label="义乌仓库人工" prop="ywWarehouseManual" min-width="120" align="right"
        :formatter="(row: any) => formatValue(row, 'ywWarehouseManual')" />
      <el-table-column label="包装人工" prop="packageManual" min-width="120" align="right"
        :formatter="(row: any) => formatValue(row, 'packageManual')" />
      <el-table-column label="发货时间" prop="deliveryTime" min-width="180"
        :formatter="(row: any) => formatTime(row.deliveryTime, 'yyyy-MM-dd HH:mm:ss') || '-'" />
      <el-table-column label="平台标准一级类目" prop="platformCategoryName" min-width="150"
        :formatter="(row: any) => formatterValue(row, 'platformCategoryName', '-')" />
      <el-table-column label="平台标准二级类目" prop="platformSubCategoryName" min-width="150"
        :formatter="(row: any) => formatterValue(row, 'platformSubCategoryName', '-')" />
      <el-table-column label="内包装" prop="innerPackage" min-width="120" align="right"
        :formatter="(row: any) => formatValue(row, 'innerPackage')" />
      <el-table-column label="外包装" prop="outPackage" min-width="120" align="right"
        :formatter="(row: any) => formatValue(row, 'outPackage')" />
      <el-table-column label="出库明细数量" prop="outboundQuantity" min-width="120" align="right"
        :formatter="(row: any) => formatValue(row, 'outboundQuantity')" />
      <el-table-column label="成本" prop="cost" min-width="120" align="right"
        :formatter="(row: any) => formatValue(row, 'cost')" />
      <el-table-column label="是否有效单" prop="isValidTxt" min-width="100"
        :formatter="(row: any) => formatterValue(row, 'isValidTxt', '-')" />
      <el-table-column label="出库单编号" prop="outboundOrderCode" min-width="180"
        :formatter="(row: any) => formatterValue(row, 'outboundOrderCode', '-')" />
      <el-table-column label="物流单编号" prop="logisticsCode" min-width="180"
        :formatter="(row: any) => formatterValue(row, 'logisticsCode', '-')" />
      <el-table-column label="商品编码" prop="productCode" min-width="180"
        :formatter="(row: any) => formatterValue(row, 'productCode', '-')" />
      <el-table-column label="收货省" prop="province" min-width="150"
        :formatter="(row: any) => formatterValue(row, 'province', '-')" />
      <el-table-column label="收货市" prop="city" min-width="150"
        :formatter="(row: any) => formatterValue(row, 'city', '-')" />
      <el-table-column label="操作" width="90" fixed="right">
        <template v-slot="{ row }">
          <el-button link type="primary" @click="toDetail(row)">详情</el-button>
        </template>
      </el-table-column>
      <template #empty>
        <div class="flex-column" style="align-items: center;">
          <img class="empty-table" src="@/assets/imgs/promotion/empty.png" alt="" object-fit="contain" />
          <span>暂无数据</span>
        </div>
      </template>
    </el-table>
    <!-- 分页 -->
    <div class="pagination-wrapper">
      <Pagination :total="total" v-model:page="queryParams.page" v-model:limit="queryParams.size"
        @pagination="getList" />
    </div>
    <download-drawer biz-type="replenishment_order" ref="downloadDrawerRef" />
  </ContentWrap>
</template>
<script lang="ts" setup>
import KeySelect from "../../components/keySelect.vue";
import { formatterValue, formatTime } from "@/utils";
import { cloneDeep, debounce } from "lodash-es";
import { vaildList, formatValue } from '@/views/biControl/orderQuery/common'
import { useAppStore } from '@/store/modules/app';
const appStore = useAppStore();
const message = useMessage();
import dayjs from "dayjs";
import { useExportParams } from "@/store/modules/BI"
import DownloadDrawer from "../../components/downloadDrawer.vue";
import info from "../../components/info.vue";
defineOptions({ name: 'BiResendOrder' })
const ExportParams = useExportParams()
import { useRouteInfo } from "@/hooks/common/useRouteInfo";
const { getRouteInfo } = useRouteInfo();
import * as orderApi from "@/api/biControl/orderQuery/index";
const queryParams = ref<any>({
  page: 1,
  size: 10,
  month: undefined,//月份
  isValid: undefined,//订单类型
  store: undefined,//店铺
  key: undefined,//关键词
})
//当前选择的店铺节点名称-用于下载显示第一个名称
const maxDate = ref<string>('');
const times = ref<any[]>([])
const payTimes = ref<any[]>(['00:00:00', '23:59:59'])
const total = ref(0);
const list = ref<any[]>([])
const loading = ref(false)
/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.page = 1
  getList()
}
const queryFormRef = ref<any>(null)
const resetQuery = () => {
  queryFormRef.value.resetFields()
  getDateDefault()
  payTimes.value = ['00:00:00', '23:59:59']
  handleQuery()
}

const dealParams = (needPage: boolean = false) => {
  const params: any = cloneDeep(queryParams.value)
  Object.keys(params).forEach(key => {
    if (params[key] === '' || params[key] === null) {
      delete params[key]
    }

    if (params.store?.length > 0) {
      params.store = queryParams.value.store.map(item => item?.length > 1 ? item[1] : '')
      params.store = params.store.join(',')
    } else {
      params.store = undefined
    }
    if (times.value?.length > 0 && times.value[0] && times.value[1]) {
      params.dataDateStart = times.value[0]
      params.dataDateEnd = times.value[1]
    }
    if (payTimes.value?.length > 0 && payTimes.value[0] && payTimes.value[1]) {
      params.dataTimeStart = payTimes.value[0]
      params.dataTimeEnd = payTimes.value[1]
    }
    if (params.key) {
      params.keywordType = params.key.id
      params.keyword = params.key.query
    }
    delete params.key
  })

  if (!needPage) {
    delete params.page
    delete params.size
  }
  return params
}
const getList = async () => {
  loading.value = true
  try {
    const data = await orderApi.getReplenishmentList(dealParams(true))
    if (data?.records?.length) {
      list.value = data.records
      total.value = data.total
    } else {
      list.value = []
      total.value = 0
    }
  } finally {
    loading.value = false
  }
}

const getDateDefault = () => {
  if (maxDate.value) {
    times.value = [maxDate.value, maxDate.value]
  } else {
    times.value = [dayjs().subtract(61, 'day').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]
  }
}

const queryMaxData = async () => {
  try {
    loading.value = true
    await ExportParams.getGoodsOverviewMaxDate()
    maxDate.value = dayjs(ExportParams.getMaxDate).isValid() ? dayjs(ExportParams.getMaxDate).format('YYYY-MM-DD') : ''
    getDateDefault()
    handleQuery()
  } catch (error) {
    console.log(error)
    getDateDefault()
    handleQuery()
  } finally {

  }
}

//- 日期最多可选择62天
function handleDateChange() {
  if (!Array.isArray(times.value) || times.value.length !== 2) return
  const start = dayjs(times.value[0])
  const end = dayjs(times.value[1])
  const diff = Math.abs(end.diff(start, 'day')) + 1 //包含终止日

  if (diff > 62) {
    message.error('选择时间段不能超过62天')
    getDateDefault()
  }
  handleQuery()
}

const downloadDrawerRef = ref<any>(null)
const exportLoading = ref(false)
const exportData = debounce(async () => {
  exportLoading.value = true
  try {
    await orderApi.replenishmentExport(dealParams())
    message.success('添加导出数据成功')
    downloadDrawerRef.value?.open()
  } catch (error) {
  } finally {
    exportLoading.value = false
  }
}, 500)
const tableRef = ref<any>()
const router = useRouter()
const toDetail = (row: any) => {
  tableRef.value!.setCurrentRow(row)
  router.push({
    path: getRouteInfo('FinanceRefundDetail'),
    query: {
      orderNum: row.orderNo,
    }
  })
}
onMounted(() => {
  queryMaxData()
})

</script>
<style lang="scss" scoped>
.upload-time {
  :deep(.el-range-editor.el-input__wrapper) {
    padding: 0;
  }

  :deep(.el-date-editor) {
    width: 220px;
  }
}

.times-select {
  :deep(.el-range__icon) {
    margin-left: 5px;
  }

  :deep(.el-range-separator) {
    padding: 0;
  }

  :deep(.el-range__close-icon) {
    margin-right: 5px;
  }
}

.rule-form {
  & {
    --el-input-inner-height: 30px;
  }

  :deep(.el-form-item__label) {
    padding: 0 10px 0 0;
    height: auto;
    line-height: 17px;
    display: flex;
    align-items: center;
  }

  .each-form {
    margin-right: 20px;
    margin-bottom: 20px;
  }

  :deep(.el-input) {

    width: 220px !important;
  }


  :deep(.el-input__wrapper) {
    height: 30px;
    padding: 0 11px;
    box-shadow: none;
    border: 1px solid #e5e5e5;

    &:hover {
      box-shadow: none;
      border-color: #0064ff;
    }

    .is-focus {
      box-shadow: none;
      border-color: #0064ff;
    }
  }

  :deep(.el-input__inner) {
    height: 30px;
    line-height: 30px;
  }
}

.right-20 {
  margin-right: 20px !important;
}

.width-220 {
  width: 220px !important;
}

:deep(.refund-tips) {
  max-width: 335px;
  word-break: break-all;
}

* {
  --el-table-current-row-bg-color: rgb(236, 245, 255)
}
</style>