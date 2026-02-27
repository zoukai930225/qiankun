<template>
  <ContentWrap>
    <div class="rule-form">
      <div class="commonTopFilterWrap">
        <div class="commonTopFilterWrap-filter" style="width: calc(100% - 70px);">
          <el-form ref="queryFormRef" :inline="true" :model="queryParams" class="mb-5px" label-width="66px">
            <el-form-item label="订单号" class="each-form" prop="orderNumLike">
              <el-input class="width-220" v-model.trim="queryParams.orderNumLike" placeholder="请输入订单号" clearable
                @keyup.enter="handleQuery" @clear="handleQuery" />
            </el-form-item>
            <el-form-item label="商品主键" class="each-form" prop="keyword">
              <el-input class="width-220" v-model.trim="queryParams.keyword" placeholder="商品ID/名称/编码/货品编码" clearable
                @keyup.enter="handleQuery" @clear="handleQuery" />
            </el-form-item>
            <el-form-item label="店铺" class="each-form" prop="store">
              <StoreRangePlus v-model="queryParams.store" :multiple="false" @change="handleQuery" :clearable="true" @clear="handleQuery" />
            </el-form-item>
            <el-form-item label="支付时间" class="each-form upload-time">
              <el-date-picker v-model="payTimes" type="daterange" range-separator="-" start-placeholder="开始日期"
                format="YYYY-MM-DD" value-format="YYYY-MM-DD" end-placeholder="结束日期" @change="handleQuery">
                <template #range-separator><span style="color: #000;">至</span></template>
              </el-date-picker>
            </el-form-item>
            <el-form-item label="出库仓库" class="each-form" prop="warehouse">
              <el-select v-model="queryParams.warehouse" placeholder="请选择" filterable clearable class="width-220"
                @change="handleQuery">
                <el-option v-for="dict in warehouseList" :key="dict.code" :label="dict.name" :value="dict.name" />
              </el-select>
            </el-form-item>
            <template v-if="isExpand">
              <el-form-item label="出库单号" class="right-20" prop="outboundOrderCodeLike">
                <el-input class="width-220" v-model.trim="queryParams.outboundOrderCodeLike" placeholder="请输入" clearable
                  @keyup.enter="handleQuery" @clear="handleQuery" />
              </el-form-item>
              <el-form-item label="出库时间" class="upload-time right-20">
                <el-date-picker v-model="outboundTimes" type="daterange" range-separator="-" start-placeholder="开始日期"
                  format="YYYY-MM-DD" value-format="YYYY-MM-DD" end-placeholder="结束日期" @change="handleQuery">
                  <template #range-separator><span style="color: #000;">至</span></template>
                </el-date-picker>
              </el-form-item>
            </template>
          </el-form>
        </div>
        <div class="row-center" style="width: 70px;align-items: flex-start;">
          <el-button class="commonResetBtn" @click="resetQuery" style="width: 60px;">
            重置
          </el-button>
        </div>
      </div>
      <SWFilterExpandAll :isExpand="isExpand" @expand-click="isExpand = !isExpand">
        <template #expandDown>
          <el-icon style="margin-right: auto;">
            <ArrowDown :size="12" color="#666666" />
          </el-icon>
        </template>
        <template #expandUp>
          <el-icon style="margin-right: auto;">
            <ArrowUp :size="12" color="#666666" />
          </el-icon>
        </template>
      </SWFilterExpandAll>
      <div class="row-center table-top">
        <div></div>
        <div class="row-center">
          <el-button type="primary" @click="exportData" :loading="exportLoading">
            导出
          </el-button>
          <el-button type="primary" @click="openDownloadDrawer">
            结果下载
          </el-button>
        </div>
      </div>
    </div>
    <!-- 列表 -->
    <el-table :header-cell-style="appStore.headerCellStyle" v-loading="loading" :data="list"
      :show-overflow-tooltip="true" row-class-name="commonTableRow" class="SWCommonTable" v-horizontal-scroll="'always'"
      :tooltip-options="{ popperClass: 'refund-tips' }">
      <el-table-column label="订单号" prop="orderNum" min-width="200"
        :formatter="(row: any) => formatterValue(row, 'orderNum', '-')" fixed="left" />
      <el-table-column label="子订单号" prop="subOrderNo" min-width="200"
        :formatter="(row: any) => formatterValue(row, 'subOrderNo', '-')" />
      <el-table-column label="商品价格(元)" prop="productPrice" min-width="150" align="right"
        :formatter="(row: any) => dealNumber(row.productPrice)" />
      <el-table-column label="购买数量" prop="salesQuantity" min-width="120" align="right"
        :formatter="(row: any) => dealNumber(row.salesQuantity)" />
      <el-table-column label="支付金额(元)" prop="paymentAmount" min-width="150" align="right"
        :formatter="(row: any) => dealNumber(row.paymentAmount)" />
      <el-table-column label="商品" prop="goodsName" width="225">
        <template v-slot="{ row }">
          <FinanceRefundGoodCell :row="row" />
        </template>
      </el-table-column>
      <el-table-column label="商品编码" prop="goodsCode" min-width="120"
        :formatter="(row: any) => formatterValue(row, 'goodsCode', '-')" />
      <el-table-column label="店铺" prop="store" min-width="120">
        <template v-slot="{ row }">
          <storeCell :row="row" v-if="row.storeName && row.store" />
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="支付时间" prop="payTime" width="180"
        :formatter="(row: any) => formatTime(row.payTime, 'yyyy-MM-dd HH:mm:ss')" />
      <el-table-column label="出库数量" prop="outNum" min-width="120" align="right"
        :formatter="(row: any) => dealNumber(row.outNum)" />
      <el-table-column label="售后次数" prop="afterSaleCount" min-width="120" align="right"
        :formatter="(row: any) => dealNumber(row.afterSaleCount)" />
      <el-table-column label="退款金额(元)" prop="refundAmountTotal" min-width="120" align="right"
        :formatter="(row: any) => dealNumber(row.refundAmountTotal)" />
      <el-table-column label="操作" width="120" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleDetail(row)">详情</el-button>
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
    <downloadDrawer ref="downloadDrawerRef" />
  </ContentWrap>
</template>
<script lang="ts" setup>
import { formatterValue, formatTime } from "@/utils";
import { cloneDeep } from "lodash-es";
import storeCell from "../components/storeCell.vue";
import dayjs from 'dayjs';
import { useAppStore } from '@/store/modules/app';
const appStore = useAppStore();
import * as returnRefundApi from "@/api/finance/returnRefund";
const isExpand = ref(false);
const list = ref<any[]>([])
const loading = ref(false)
const message = useMessage();
import * as wdtWarehouseDetailApi from '@/api/supplier/warehouseInfo'
import FinanceRefundGoodCell from '../components/goodCell.vue'
import downloadDrawer from "./components/downloadDrawer.vue";
import { dealNumber } from '@/views/finance/refund/components/common'
//支付时间
const payTimes = ref<any[]>([
  dayjs().subtract(7, 'day').format('YYYY-MM-DD'), dayjs().subtract(1, 'day').format('YYYY-MM-DD')
]);
//出库时间
const outboundTimes = ref<any[]>([]);
const queryParams = ref({
  page: 1,
  size: 10,
  orderNumLike: '',//订单号
  keyword: '',
  store: '',//店铺
  outboundOrderCodeLike: '',//出库ID
  warehouse: '',//出库仓库
})
const total = ref(0);
const queryFormRef = ref()

const resetQuery = () => {
  queryFormRef.value.resetFields()
  payTimes.value = [dayjs().subtract(7, 'day').format('YYYY-MM-DD'), dayjs().subtract(1, 'day').format('YYYY-MM-DD')];
  outboundTimes.value = [];
  handleQuery()
}
/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.page = 1
  getList()
}

const dealParams = (needPage: boolean = false) => {
  const params: any = cloneDeep(queryParams.value)
  Object.keys(params).forEach(key => {
    if (params[key] === '' || params[key] === null) {
      delete params[key]
    }
  })
  if (payTimes.value?.length === 2 && payTimes.value[0] && payTimes.value[1]) {
    params.payTimeStart = dayjs(payTimes.value[0]).format('YYYY-MM-DD')
    params.payTimeEnd = dayjs(payTimes.value[1]).format('YYYY-MM-DD')

  }
  if (outboundTimes.value?.length === 2 && outboundTimes.value[0] && outboundTimes.value[1]) {
    params.deliverTimeStart = dayjs(outboundTimes.value[0]).format('YYYY-MM-DD')
    params.deliverTimeEnd = dayjs(outboundTimes.value[1]).format('YYYY-MM-DD')

  }
  if (!needPage) {
    delete params.page
    delete params.size
  }
  return params
}


const getList = async () => {
  loading.value = true
  try {
    const data = await returnRefundApi.list(dealParams(true))
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
const warehouseList = ref<any[]>([])
function getWarehouseList() {
  wdtWarehouseDetailApi.getwdtWarehouseList().then(res => {
    warehouseList.value = res
  })
}

onMounted(() => {
  getWarehouseList()
  handleQuery()
})

const route = useRouter()
const handleDetail = (row: any) => {
  route.push({
    path: '/admin/FC/FinanceRefundDetail',
    query: {
      orderNum: row.orderNum,
    }
  })
}
const exportLoading = ref(false)
const downloadDrawerRef = ref()
const exportData = async () => {
  try {
    exportLoading.value = true
    await returnRefundApi.exportList(dealParams(false))
    message.success('添加导出数据成功')
    downloadDrawerRef.value?.open()
  } catch (e) { } finally {
    exportLoading.value = false
  }

}

const openDownloadDrawer = () => {
  downloadDrawerRef.value?.open()
}
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

.goods-image {
  width: 48px;
  height: 48px;
  border-radius: 3px;
  cursor: pointer;
}

.rule-form {
  & {
    --el-input-inner-height: 30px;
  }

  :deep(.el-form-item__label) {
    padding: 0 10px 0 0;
  }

  .each-form {
    margin-right: 20px;
    margin-bottom: 20px;
  }

  :deep(.SWFilterExpandAll-middle-text) {
    color: #666666;
  }

  :deep(.SWFilterExpandAll) {
    margin-bottom: 15px;
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

.table-top {
  justify-content: space-between;
  font-size: 16px;
  color: #333333;
  font-weight: 500;
  margin-bottom: 12px;
  width: 100%;
}

:deep(.refund-tips) {
  max-width: 335px;
}

</style>