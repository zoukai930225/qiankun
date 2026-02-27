<template>
  <ContentWrap>
    <div class="rule-form">
      <div class="commonTopFilterWrap">
        <div class="commonTopFilterWrap-filter">
          <el-form ref="queryFormRef" :inline="true" :model="queryParams" label-width="66px">
            <el-form-item label="渠道" prop="bizChannel" class="each-form">
              <el-select class="width-220" v-model="queryParams.bizChannel" placeholder="请选择" clearable
                @change="handleQuery">
                <template #label="{ label, value }">
                  <div class="row-center">
                    <img class="channel-icon" :src="getChannelIcon(value)" object-fit="contain" />
                    <span>{{ label }}</span>
                  </div>
                </template>
                <el-option v-for="dict in channelList" :key="dict.value" :label="dict.label" :value="dict.value">
                  <div class="row-center">
                    <img class="channel-icon" :src="dict.icon" object-fit="contain" />
                    <div>{{ dict.label }}</div>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="取号时间" class="each-form upload-time">
              <el-date-picker v-model="times" type="daterange" range-separator="-" start-placeholder="开始日期"
                format="YYYY-MM-DD" value-format="YYYY-MM-DD" end-placeholder="结束日期" @change="dateChange"
                :clearable="false">
                <template #range-separator><span style="color: #000;">至</span></template>
              </el-date-picker>
            </el-form-item>
          </el-form>
        </div>
        <div class="commonTopFilterWrap-search">
          <div class="commonTopFilterWrap-search-container">
            <el-button class="commonResetBtn" @click="resetQuery" style="width: 60px;">
              重置
            </el-button>
            <el-button type="primary" @click="handleStartMatch">
              发起匹配
            </el-button>
            <el-button type="primary" @click="exportData" :loading="exportLoading">
              导出
            </el-button>
            <el-button type="primary" @click="openDownloadDrawer">
              结果下载
            </el-button>
          </div>
        </div>
      </div>

    </div>
    <!-- 列表 -->
    <el-table :header-cell-style="appStore.headerCellStyle" v-loading="loading" :data="list"
      :show-overflow-tooltip="true" row-class-name="commonTableRow" class="SWCommonTable" v-horizontal-scroll="'always'"
      :tooltip-options="{ popperClass: 'refund-tips' }">
      <el-table-column label="运单号(共)" prop="trackingNumber" width="150" fixed="left"
        :formatter="(row: any) => formatterValue(row, 'trackingNumber', '-')" />
      <el-table-column label="渠道" prop="bizChannel" width="150" :show-overflow-tooltip="false">
        <template v-slot="{ row }">
          <div class="row-center">
            <img class="channel-icon" :src="getChannelIcon(row.bizChannel)" object-fit="contain" />
            <div>{{ getLabelByValue(channelList, row.bizChannel) }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="订单号(共)" prop="orderNo" width="150"
        :formatter="(row: any) => formatterValue(row, 'orderNo', '-')" />
      <el-table-column label="单号状态" prop="orderStatus" width="150"
        :formatter="(row: any) => formatterValue(row, 'orderStatus', '-')" />
      <el-table-column label="物流商(共)" prop="logisticsProvider" width="150"
        :formatter="(row: any) => formatterValue(row, 'logisticsProvider', '-')" />
      <el-table-column label="网点名称(PDD,千牛)" prop="branchName" min-width="150"
        :formatter="(row: any) => formatterValue(row, 'branchName', '-')" />
      <el-table-column label="网点编码" prop="branchCode" width="120"
        :formatter="(row: any) => formatterValue(row, 'branchCode', '-')" />
      <el-table-column label="取号时间(共)" prop="takeNoTime" width="180"
        :formatter="(row: any) => formatTime(row.takeNoTime, 'yyyy-MM-dd HH:mm:ss') || '-'" />
      <el-table-column label="使用者(抖音 千牛)" prop="consumer" min-width="180"
        :formatter="(row: any) => formatterValue(row, 'consumer', '-')" />
      <el-table-column label="运输状态(PDD)" prop="transportStatus" min-width="150"
        :formatter="(row: any) => formatterValue(row, 'transportStatus', '-')" />
      <el-table-column label="申请人(抖音)" prop="applicant" min-width="150"
        :formatter="(row: any) => formatterValue(row, 'applicant', '-')" />
      <el-table-column label="是否共享(抖音)" prop="isShared" min-width="150"
        :formatter="(row: any) => formatterValue(row, 'isShared', '-')" />
      <el-table-column label="号段类型(千牛)" prop="numberType" min-width="150"
        :formatter="(row: any) => formatterValue(row, 'numberType', '-')" />
      <el-table-column label="收货地址(PDD)" prop="receivingAddress" min-width="150"
        :formatter="(row: any) => formatterValue(row, 'receivingAddress', '-')" />
      <el-table-column label="面单回收方式(千牛)" prop="orderRecycleWay" min-width="200"
        :formatter="(row: any) => formatterValue(row, 'orderRecycleWay', '-')" />
      <el-table-column label="面单回收时间(千牛)" prop="orderRecycleTime" min-width="200"
        :formatter="(row: any) => formatTime(row.orderRecycleTime, 'yyyy-MM-dd HH:mm:ss') || '-'" />
      <el-table-column label="是否匹配中通" prop="isMatchZto" min-width="180"
        :formatter="(row: any) => formatterValue(row, 'isMatchZto', '-')" />
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
    <matchDrawer ref="matchDrawerRef" />
    <downloadDrawer ref="downloadDrawerRef" :bizType="3" />
  </ContentWrap>

</template>
<script lang="ts" setup>
import dayjs from 'dayjs'
import { cloneDeep } from 'lodash-es'
import { channelList, getChannelIcon, getLabelByValue } from './common'
import { formatterValue, formatTime } from "@/utils";
import * as ztoEleDataApi from '@/api/finance/billMatch'
import { useAppStore } from '@/store/modules/app'
const appStore = useAppStore()
import matchDrawer from './components/matchDrawer.vue';
import downloadDrawer from '@/views/finance/refund/list/components/downloadDrawer.vue';
const message = useMessage() // 消息弹窗

const loading = ref(false) // 列表的加载中
const list = ref<any[]>([]) // 列表的数据
//获取上月时间
const getLastMonthTimes = () => {
  return [dayjs().startOf('month').subtract(1, 'day').startOf('month').format('YYYY-MM-DD'), dayjs().startOf('month').subtract(1, 'day').endOf('month').format('YYYY-MM-DD')]
}
const times = ref<any[]>(getLastMonthTimes()) // 时间范围
const queryParams = ref({
  bizChannel: '', // 渠道
  page: 1,
  size: 10,
  billMatchType: 'ZTO'
})

const total = ref(0) // 列表的总页数
const queryFormRef = ref() // 搜索的表单

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.page = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  times.value = getLastMonthTimes()
  handleQuery()
}

const dealParams = (needPage: boolean = false) => {
  const params: any = cloneDeep(queryParams.value)
  Object.keys(params).forEach(key => {
    if (params[key] === '' || params[key] === null) {
      delete params[key]
    }
  })
  if (times.value?.length === 2 && times.value[0] && times.value[1]) {
    params.takeNoTimeStart = dayjs(times.value[0]).format('YYYY-MM-DD')
    params.takeNoTimeEnd = dayjs(times.value[1]).format('YYYY-MM-DD')

  }

  if (!needPage) {
    delete params.page
    delete params.size
  }
  return params
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ztoEleDataApi.list(dealParams(true))
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

const dateChange = (val: any) => {
  if (val?.length === 2 && val[0] && val[1]) {
    if (dayjs(val[1]).subtract(61, 'day').isAfter(dayjs(val[0]))) {
      message.error('时间范围不能超过62天！')
      times.value = getLastMonthTimes()
    }
  }
  handleQuery()
}
const matchDrawerRef = ref()
const handleStartMatch = () => {
  matchDrawerRef.value.open()
}
const exportLoading = ref(false)
const downloadDrawerRef = ref()
const exportData = async () => {
  try {
    exportLoading.value = true
    await ztoEleDataApi.exportList(dealParams(false))
    message.success('添加导出数据成功')
    downloadDrawerRef.value?.open()
  } catch (e) { } finally {
    exportLoading.value = false
  }

}

const openDownloadDrawer = () => {
  downloadDrawerRef.value?.open()
}

onMounted(() => {
  handleQuery()
})
</script>
<style lang="scss" scoped>
.channel-icon {
  width: 16px;
  margin-right: 4px
}

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
    line-height: 17px;
    align-items: center;
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