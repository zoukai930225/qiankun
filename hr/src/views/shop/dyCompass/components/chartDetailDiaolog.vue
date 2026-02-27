<template>
  <div>
    <Dialog class="trendDialog" :width="1195" :border-radius="8" v-model="dialogVisible" title="">
      <template #title> </template>
      <div class="mainContainer">
        <div class="basicInfo">
          <div class="basicInfo-item" style="width: 280px">
            <div class="basicInfo-item-title">店铺名称</div>
            <div class="basicInfo-item-content">{{ rowData.storeName }}</div>
          </div>
          <div class="basicInfo-line"></div>
          <div class="basicInfo-item" style="width: 402px">
            <div class="basicInfo-item-title">商品名称</div>
            <div class="basicInfo-item-content">{{ rowData.goodsName }}</div>
          </div>
          <div class="basicInfo-line"></div>
          <div class="basicInfo-item" style="width: 239px">
            <div class="basicInfo-item-title">商品ID</div>
            <div class="basicInfo-item-content">{{ rowData.goodsId }}</div>
          </div>
          <div class="basicInfo-line"></div>
          <div class="basicInfo-item" style="width: 239px">
            <div class="basicInfo-item-title">产品编码</div>
            <div class="basicInfo-item-content">{{ rowData.goodsCode }}</div>
          </div>
        </div>
        <div class="row-center" style="margin-top: 16px; margin-bottom: 26px">
          <div class="dateSearch row-center">
            <div style="color: #666666; font-size: 14px">时间：</div>
            <div style="width: 300px">
              <el-date-picker
                class="!w-300px"
                v-model="dateRagne"
                value-format="YYYY-MM-DD"
                placeholder="请选择时间"
                type="daterange"
                :clearable="false"
                :disabled-date="disabledDateFun"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                @change="dateChange"
              />
            </div>
          </div>
          <SWLayoutChartChange
            style="margin-left: auto"
            :layoutMode="layoutMode"
            @layout-mode-change="layoutModeChange"
          />
          <el-button
            style="margin-left: 16px; margin-right: 4px"
            type="primary"
            :loading="exporting"
            @click="exportClick"
          >
            导出
          </el-button>
        </div>

        <div class="data" :class="{ data1: layoutMode === 1 }">
          <div
            v-if="layoutMode === 0"
            style="
              width: calc(1195px - 40px);
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            "
          >
            <div class="row-center" style="color: #333; margin-bottom: 20px">
              <div class="zhuanhuan_icon icon" style="background: #3270ff"></div>成交金额
              <div style="width: 30px"></div>
              <div class="dianji_icon icon" style="background: #ff7d08"></div>发货前退款率
              <div style="width: 30px"></div>
              <div class="dianji_icon icon" style="background: #349b34"></div>退款率
              <div style="width: 30px"></div>
              <div class="dianji_icon icon" style="background: #7e46de"></div> 发货后退款率
            </div>
            <DyCompassChart
              style="margin-bottom: 10px; height: 52vh; width: calc(1195px - 40px)"
              height="52vh"
              :showAxis="true"
              :udid="clickChartUdid"
              :list="rowData.transactionAmounts"
              :list1="rowData.preShipmentRefundRates"
              :list2="rowData.refundRates"
              :list3="rowData.postShipmentRefundRates"
            />
          </div>
          <div
            v-if="layoutMode === 1"
            style="
              width: calc(1195px - 40px);
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            "
          >
            <ChartDetailTable
              :loading="loading"
              :list="list"
              style="margin-top: 0px; width: calc(1195px - 40px)"
            />
            <!-- 分页 -->
            <Pagination
              :total="total"
              v-model:page="queryParams.page"
              v-model:limit="queryParams.pageSize"
              @pagination="getList"
            />
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>
<script lang="ts" setup>
import SWLayoutChartChange from '@/components/SWLayoutChange/src/SWLayoutChartChange.vue'
import ChartDetailTable from './chartDetailTable.vue'
import DyCompassChart from './dyCompassChart.vue'

import { generateUUID } from '@/utils'
import download from '@/utils/download'
const message = useMessage() // 消息弹窗

import * as GoodDyCompassApi from '@/api/shop/dyCompass'

const dateRagne = ref([])

const dialogVisible = ref(false) // 弹窗的是否展示

const clickChartUdid = ref('')
const rowData = ref()
/** 打开弹窗 */
const open = async (data: string, statisticalDate: any) => {
  rowData.value = data
  layoutMode.value = 0
  list.value = []
  queryParams.page = 1
  queryParams.pageSize = 10
  dateRagne.value = statisticalDate
  clickChartUdid.value = generateUUID()
  dialogVisible.value = true
}

const queryParams = reactive({
  page: 1,
  pageSize: 10
})

const total = ref(0)
const list = ref([])
// 最多选择60天区间以内
const disabledDateFun = (time: Record<string, any>): boolean => {
  console.log(time) // time 为new Date()类型
  const secondNum = 60 * 60 * 24 * 60 * 1000 //上下波动60天
  if (time.getTime() > new Date().getTime()) {
    return time.getTime() >= new Date().getTime() //时间范围必须大于今天
  } else {
    return time.getTime() < Date.now() - secondNum
  }
}

const layoutMode = ref(0) // 0 折线图模式  1 表格
const layoutModeChange = (mode: any) => {
  layoutMode.value = mode
  if (layoutMode.value === 0) {
    list.value = []
    getChartList()
  } else if (layoutMode.value === 1) {
    getList()
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const dateChange = () => {
  if (layoutMode.value === 0) {
    getChartList()
  } else if (layoutMode.value === 1) {
    queryParams.page = 1
    getList()
  }
}
// 获取指标统计
const getChartList = async () => {
  const data = await GoodDyCompassApi.dyCommerceCompassLineChartData({
    goodsId: rowData.value.goodsId,
    startDate: dateRagne.value[0],
    endDate: dateRagne.value[1]
  })
  if (data) {
    rowData.value.transactionAmounts = data.transactionAmounts || []
    rowData.value.preShipmentRefundRates = data.preShipmentRefundRates || []
    rowData.value.refundRates = data.refundRates || []
    rowData.value.postShipmentRefundRates = data.postShipmentRefundRates || []
    clickChartUdid.value = generateUUID()
  }
}

const loading = ref(false)
// 获取表格列表数据
const getList = async () => {
  loading.value = true
  const data = await GoodDyCompassApi.dyCommerceCompassTablePageData({
    page: queryParams.page,
    pageSize: queryParams.pageSize,
    goodsId: rowData.value.goodsId,
    startDate: dateRagne.value[0],
    endDate: dateRagne.value[1]
  }).catch(() => {
    loading.value = false
  })
  loading.value = false
  if (data) {
    list.value = data.records || []
    total.value = data.total
  }
}

const exporting = ref(false)
// 导出按钮点击事件
const exportClick = async () => {
  try {
    if (dateRagne.value.length < 2) {
      message.success('请选择统计日期')
      return
    }
    exporting.value = true
    const data = await GoodDyCompassApi.dyCommerceCompassLineExport({
      type: 0,
      goodsId: rowData.value.goodsId,
      startDate: dateRagne.value[0],
      endDate: dateRagne.value[1]
    })
    if (data) {
      download.excel(
        data,
        `${rowData.value.goodsId}_${dateRagne.value[0]}_${dateRagne.value[1]}指标数据统计.xls`
      )
      message.success('导出成功')
    } else {
      message.error('导出失败')
    }
  } catch (error) {
    message.error('导出失败')
  } finally {
    exporting.value = false
  }
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
</script>

<style lang="scss" scoped>
:deep(.el-dialog) {
  padding: 0px;
}
:deep(.el-dialog__header) {
  border-bottom: 1px solid #f0f0f0;
  font-weight: 500;
  font-size: 16px;
  color: #333333;
  line-height: 22px;
}
:deep(.el-dialog__header) {
  // height: 0px !important;
}
.mainContainer {
  margin-top: -13px;
  margin-left: 5px;
  .basicInfo {
    width: calc(1195px - 40px);
    height: 101px;
    background: #f2f6fc;
    display: flex;
    flex-direction: row;
    &-item {
      padding-left: 16px;
      padding-right: 16px;
      &-title {
        padding-top: 16px;
        font-size: 14px;
        color: #666666;
      }
      &-content {
        padding-top: 10px;
        font-size: 14px;
        color: #333333;
        font-weight: 500;
        line-height: 20px;
      }
    }
    &-line {
      margin-top: 16px;
      width: 1px;
      background: #e2eaf6;
      height: 69px;
    }
  }
  .item {
    margin-bottom: 4px;
  }
  .detailValue {
    padding-left: 6px;
    color: #666666;
  }
  .dateSearch {
  }
  .commonMoreData {
    &-export {
      margin-left: 15px;
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 32px;
      background: #f3f4f7;
      border-radius: 4px;
      cursor: pointer;
      &-icon {
        // margin-left: 12px;
        width: 12px;
        height: 12px;
        margin-right: 10px;
      }

      &-name {
        font-size: 14px;
        color: #666666;
        line-height: 20px;
        // padding-right: 12px;
      }
    }
  }
  .data {
    margin-top: 0px;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 60vh;
    height: 60vh;
    .icon {
      width: 16px;
      height: 6px;
      margin-right: 10px;
    }
  }
}
</style>

<style scoped>
:deep(.com-dialog .el-dialog__body) {
  max-height: 90vh;
}
</style>
