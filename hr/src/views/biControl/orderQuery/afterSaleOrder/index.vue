<template>
  <ContentWrap>
    <div class="commonTopFilterWrap">
      <div class="commonTopFilterWrap-filter rule-form">
        <el-form ref="queryFormRef" :inline="true" :model="queryParams" label-width="66px">
          <el-form-item label="日期段" class="each-form upload-time">
            <el-date-picker v-model="times" type="daterange" start-placeholder="开始日期" format="YYYY-MM-DD"
              value-format="YYYY-MM-DD" end-placeholder="结束日期" @change="handleDateChange">
              <template #range-separator><span style="color: #000;">至</span></template>
            </el-date-picker>
          </el-form-item>
          <el-form-item label="售后时间段" class="each-form upload-time times-select">
            <el-time-picker v-model="payTimes" is-range start-placeholder="开始时间" end-placeholder="结束时间"
              :clearable="false" format="HH:mm:ss" value-format="HH:mm:ss" @change="handleQuery" range-separator="至" />
          </el-form-item>
          <el-form-item label="店铺" prop="store" class="each-form">
            <store-cascader v-model="queryParams.store" :cascaderProps="{
              multiple: true,
            }" use-premission @change="handleQuery" />
          </el-form-item>
          <el-form-item label="售后类型" prop="refundStatus" class="each-form">
            <el-select v-model="queryParams.refundStatus" placeholder="请选择售后类型" clearable class="width-220"
              @change="handleQuery">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.BI_REFUND_STATUS, true)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="销退入库" prop="returnWarehouse" class="each-form">
            <el-select v-model="queryParams.returnWarehouse" placeholder="请选择" clearable class="width-220"
              @change="handleQuery">
              <el-option :label="value.label" :value="value.value" v-for="value in returnWarehouseList"
                :key="value.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="关键词" prop="key" class="each-form">
            <key-select v-model.trim="queryParams.key" class="width-220" @change="handleQuery" />
          </el-form-item>
          <el-form-item prop="smallAmountReceipt" class="each-form">
            <template #label>
              <span>
                是否小额
                <el-tooltip effect="dark" content="此选项仅淘系有" placement="bottom">
                  <span>
                    <el-icon :size="14" color="#999" style="cursor: pointer;pointer-events: visible;"
                      @click="(e) => e.preventDefault()">
                      <QuestionFilled />
                    </el-icon>
                  </span>
                </el-tooltip>
              </span>
            </template>
            <el-select v-model="queryParams.smallAmountReceipt" placeholder="请选择" clearable class="width-220"
              @change="handleQuery">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.BI_SMALL_AMOUNT_RECEIPT, true)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
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
      <el-table-column label="退款编号" prop="refundNumber" min-width="180"
        :formatter="(row: any) => formatterValue(row, 'refundNumber', '-')" />
      <el-table-column label="售后类型" prop="refundStatus" min-width="180"
        :formatter="(row: any) => formatterValue(row, 'refundStatus', '-')" />
      <el-table-column label="订单号" prop="orderNo" min-width="220"
        :formatter="(row: any) => formatterValue(row, 'orderNo', '-')" />
      <el-table-column label="子订单号" prop="subOrderNo" min-width="320"
        :formatter="(row: any) => formatterValue(row, 'subOrderNo', '-')" />
      <el-table-column label="商品ID" prop="goodsId" min-width="180"
        :formatter="(row: any) => formatterValue(row, 'goodsId', '-')" />
      <el-table-column label="退款金额" prop="refundAmount" min-width="150" align="right"
        :formatter="(row: any) => formatValue(row, 'refundAmount')" />
      <el-table-column label="退款时间" prop="refundTime" min-width="180"
        :formatter="(row: any) => formatTime(row.refundTime, 'yyyy-MM-dd HH:mm:ss') || '-'" />
      <el-table-column label="退款数量" prop="refundQuantity" min-width="120" align="right"
        :formatter="(row: any) => formatValue(row, 'refundQuantity')" />
      <el-table-column label="成本" prop="cost" min-width="150" align="right"
        :formatter="(row: any) => formatValue(row, 'cost')" />
      <el-table-column label="申请时间" prop="applyTime" min-width="180"
        :formatter="(row: any) => formatTime(row.applyTime, 'yyyy-MM-dd HH:mm:ss') || '-'" />
      <el-table-column label="订单订单占比" prop="orderOrderRatio" min-width="150" align="right"
        :formatter="(row: any) => formatValue(row, 'orderOrderRatio')" />
      <el-table-column label="无效单佣金" prop="wxdCommission" min-width="150" align="right"
        :formatter="(row: any) => formatValue(row, 'wxdCommission')" />
      <el-table-column label="退款原因" prop="buyerRefundReason" min-width="150"
        :formatter="(row: any) => formatterValue(row, 'buyerRefundReason', '-')" />
      <el-table-column label="退款状态" prop="refundState" min-width="150"
        :formatter="(row: any) => formatterValue(row, 'refundState', '-')" />
      <el-table-column label="退款说明" prop="buyerRefundDescription" min-width="150"
        :formatter="(row: any) => formatterValue(row, 'buyerRefundDescription', '-')" />
      <el-table-column label="是否小额收款" prop="smallAmountReceipt" min-width="150"
        :formatter="(row: any) => formatterValue(row, 'smallAmountReceipt', '-')" />
      <el-table-column label="退货物流信息" prop="returnLogisticsInfo" min-width="150"
        :formatter="(row: any) => formatterValue(row, 'returnLogisticsInfo', '-')" />
      <el-table-column label="退货物流单号" prop="returnLogisticsNumber" min-width="150"
        :formatter="(row: any) => formatterValue(row, 'returnLogisticsNumber', '-')" />
      <el-table-column label="退货物流公司" prop="returnLogisticsCompany" min-width="150"
        :formatter="(row: any) => formatterValue(row, 'returnLogisticsCompany', '-')" />
      <el-table-column label="买家实付金额" prop="buyerPaymentAmount" min-width="150" align="right"
        :formatter="(row: any) => formatValue(row, 'buyerPaymentAmount')" />
      <el-table-column label="退款类型" prop="partialOrFullRefund" min-width="150" align="right"
        :formatter="(row: any) => formatterValue(row, 'partialOrFullRefund', '-')" />
      <el-table-column label="商家备注" prop="merchantRemark" min-width="150"
        :formatter="(row: any) => formatterValue(row, 'merchantRemark', '-')" />
      <el-table-column label="退货时间" prop="buyerReturnTime" min-width="180"
        :formatter="(row: any) => formatTime(row.buyerReturnTime, 'yyyy-MM-dd HH:mm:ss') || '-'" />
      <el-table-column label="千牛价保赔付" prop="qnInsurancePayout" min-width="150" align="right"
        :formatter="(row: any) => formatterValue(row, 'qnInsurancePayout', '-')" />
      <el-table-column label="商品编码" prop="productCode" min-width="150"
        :formatter="(row: any) => formatterValue(row, 'productCode', '-')" />
      <el-table-column label="是否有效单" prop="isValidTxt" min-width="120"
        :formatter="(row: any) => formatterValue(row, 'isValidTxt', '-')" />
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
    <download-drawer biz-type="refund_order" ref="downloadDrawerRef" />
  </ContentWrap>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import KeySelect from "../../components/keySelect.vue";
import { formatterValue, formatTime } from "@/utils";
import { formatValue, returnWarehouseList } from '@/views/biControl/orderQuery/common'
import { cloneDeep, debounce } from "lodash-es";
import * as orderApi from "@/api/biControl/orderQuery/index";
import { useExportParams } from "@/store/modules/BI"
import DownloadDrawer from "../../components/downloadDrawer.vue";
import info from "../../components/info.vue";
import { useAppStore } from '@/store/modules/app';
import dayjs from 'dayjs';
const ExportParams = useExportParams()
const appStore = useAppStore();
const message = useMessage();
defineOptions({ name: 'BiAfterSaleOrder' })
import { useRouteInfo } from "@/hooks/common/useRouteInfo";
const { getRouteInfo } = useRouteInfo();
const queryParams = ref<any>({
  page: 1,
  size: 10,
  refundStatus: undefined,//退款状态
  returnWarehouse: undefined,//消退入库: 0-否, 1-是
  store: undefined,//店铺
  key: undefined,//关键词
  smallAmountReceipt: undefined,//小额收款
})
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
  payTimes.value = ['00:00:00', '23:59:59']
  getDateDefault()
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
    const data = await orderApi.getRefundList(dealParams(true))
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
    await orderApi.refundExport(dealParams())
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

* {
  --el-table-current-row-bg-color: rgb(236, 245, 255)
}
</style>