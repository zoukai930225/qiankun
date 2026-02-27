<template>
  <div>
    <!-- 列表 -->
    <ContentWrap>
      <div>
        <div class="commonTopFilterWrap">
          <div class="commonTopFilterWrap-filter">
            <el-form
              :model="queryParams"
              ref="queryFormRef"
              :inline="true"
              label-width="70px"
              @submit.prevent
            >
              <el-form-item label="商品" prop="goodsKey">
                <el-input
                  :prefix-icon="Search"
                  class="dialogFormItemWidth"
                  style="width: 200px"
                  v-model="queryParams.goodsKey"
                  placeholder="请输入商品ID/名称"
                  clearable
                  @clear="handleQuery"
                  @keyup.enter="handleQuery"
                />
              </el-form-item>
              <el-form-item label="店铺" prop="storeCode">
                <StoreRangePlus
                  v-model="queryParams.storeCode"
                  placeholder="请选择店铺"
                  multiple
                  @change="getList"
                />
              </el-form-item>
              <el-form-item label="上架时间" prop="shelfTime">
                <el-date-picker
                  class="!w-187px"
                  v-model="queryParams.shelfTime"
                  value-format="YYYY-MM-DD"
                  placeholder="请选择上架时间"
                  type="daterange"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  @change="getList"
                />
              </el-form-item>
              <el-form-item label="统计时间" prop="statisticalTime">
                <el-date-picker
                  v-model="queryParams.statisticalTime"
                  value-format="YYYY-MM-DD"
                  type="date"
                  placeholder="选择日期"
                  class="!w-200px"
                  :clearable="false"
                  :disabled-date="disabledDate"
                  @change="handleQuery"
                />
              </el-form-item>
              <el-form-item v-if="isExpand" label="产品编码" prop="goodsCode">
                <el-input
                  :prefix-icon="Search"
                  class="dialogFormItemWidth"
                  style="width: 200px"
                  v-model="queryParams.goodsCode"
                  placeholder="请输入产品编码"
                  clearable
                  @clear="handleQuery"
                  @keyup.enter="handleQuery"
                />
              </el-form-item>
            </el-form>
          </div>
          <div class="commonTopFilterWrap-search">
            <div class="commonTopFilterWrap-search-container">
              <!-- type="primary" -->

              <el-button
                @click="sendGoodImgs(1)"
                class="commonSearchBtn"
                :loading="imgIsSending()"
                v-hasPermi="['shop:dyCompassSend']"
              >
                发送(管理)
              </el-button>

              <el-button
                @click="sendGoodImgs(2)"
                class="commonSearchBtn"
                :loading="imgIsSending()"
                v-hasPermi="['shop:dyCompassSend']"
              >
                发送(运营)
              </el-button>
              <el-button @click="handleQuery" class="commonSearchBtn">
                <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
                搜索
              </el-button>
              <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0px">
                重置
              </el-button>
            </div>
          </div>
        </div>
        <SWFilterExpandAll
          :isExpand="isExpand"
          @expand-click="isExpand = !isExpand"
          style="margin-bottom: 20px"
        />
      </div>
      <el-table
        :header-cell-style="appStore.headerCellStyle"
        v-loading="loading"
        :data="list"
        :stripe="true"
        @sort-change="handleSortChange"
        class="SWCommonTable fixedHeaderTable"
        v-horizontal-scroll="'always'"
      >
        <el-table-column prop="name" width="247" :show-overflow-tooltip="false" label="商品" fixed>
          <template #default="scope">
            <div class="row-center">
              <el-popover
                placement="right"
                :width="348"
                trigger="hover"
                :show-arrow="false"
                :offset="20"
              >
                <template #reference>
                  <div class="goodImg">
                    <img
                      style="width: 60px; height: 60px; border-radius: 4px"
                      :src="getImgUrlById(scope.row.goodsId || scope.row.goods_id)"
                    />
                  </div>
                </template>
                <GoodCard
                  :good="{
                    materialName: scope.row.goodsName || scope.row.goods_name,
                    materialId: scope.row.goodsId || scope.row.goods_id,
                    channel: scope.row.channel || ''
                  }"
                />
              </el-popover>
              <div class="goodName">{{ scope.row.goodsName || scope.row.goods_name }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="channel" width="156" label="店铺" fixed>
          <template #default="scope">
            <div class="row-center">
              <img
                v-if="getImageUrl(scope.row.channel)"
                style="width: 18px; height: 18px; margin-right: 8px"
                :src="getImageUrl(scope.row.channel)"
              />
              <div
                :style="{
                  width: getImageUrl(scope.row.channel) ? '110px' : '146px',
                  paddingRight: '6px'
                }"
                >{{ scope.row.storeName || scope.row.store_name }}</div
              >
            </div>
          </template>
        </el-table-column>
        <!-- 类目 -->
        <el-table-column prop="categoryName " width="136" label="类目">
          <template #default="scope">
            <div class="row-center">
              <div>{{ scope.row.categoryName }}</div>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="goodsCode" width="150" label="产品编码" />
        <el-table-column prop="goodsId" width="200" label="商品ID" />
        <el-table-column prop="groundingTime" width="180" label="上架时间" sortable="custom" />
        <el-table-column min-width="600" label="折线图(转换率+点击率)" align="center">
          <template #header>
            <div style="color: #333"> 折线图({{ queryParams.statisticalTime }}) </div>
            成交金额<div class="zhuanhuan_icon icon"></div> 发货前退款率<div
              class="dianji_icon icon"
            ></div>
            退款率<div class="dianji_icon icon" style="background: #7e46de"></div> 发货后退款率<div
              class="dianji_icon icon"
              style="background: #39d29f"
            ></div>
          </template>
          <template #default="scope">
            <div
              v-if="
                (scope.row.transactionAmounts && scope.row.transactionAmounts.length > 0) ||
                (scope.row.preShipmentRefundRates && scope.row.preShipmentRefundRates.length > 0) ||
                (scope.row.refundRates && scope.row.refundRates.length > 0) ||
                (scope.row.postShipmentRefundRates && scope.row.postShipmentRefundRates.length > 0)
              "
              @click="seeChartDetail(scope.row)"
            >
              <DyCompassChart
                :udid="clickChartUdid"
                :list="scope.row.transactionAmounts"
                :list1="scope.row.preShipmentRefundRates"
                :list2="scope.row.refundRates"
                :list3="scope.row.postShipmentRefundRates"
              />
            </div>

            <div v-else class="empty-img">
              <img src="@/assets/imgs/common/chart_empty.png" alt="" />
              <div style="font-size: 12px; color: #999999">暂无数据</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="100">
          <template #default="scope">
            <el-button link type="primary" @click="seeOtherChart(scope.row)"> 查看其他 </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <Pagination
        :total="total"
        v-model:page="queryParams.page"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
      <OtherChartDialog ref="otherChartDialogRef" />
      <ChartDetailDiaolog ref="chartDetailDiaologRef" />
      <div class="sendGoodImg" v-if="sendGoodList.length > 0">
        <GoodSaveImg
          ref="goodSaveImgRef"
          :list="sendGoodList"
          @complete-send-img="completeSendImg"
        />
      </div>
    </ContentWrap>
  </div>
</template>
<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'
import { generateUUID } from '@/utils'
import * as DateUtil from '@/utils/formatTime'
import { getImageUrl, getImgUrlById } from '@/utils/index'
import { Search } from '@element-plus/icons-vue'

import SWFilterExpandAll from '@/components/SWBaseComponent/SWFilterExpandAll/index.vue' // 展开组件
import GoodCard from '@/components/common/goods/goodCard.vue'
import DyCompassChart from './components/dyCompassChart.vue'

import ChartDetailDiaolog from './components/chartDetailDiaolog.vue'
import GoodSaveImg from './components/goodSaveImg.vue'
import OtherChartDialog from './components/otherChartDialog.vue'

import * as GoodDyCompassApi from '@/api/shop/dyCompass'

const appStore = useAppStore()

defineOptions({ name: 'GoodDyCompass' })

const queryParams = reactive({
  page: 1,
  pageSize: 10,
  goodsKey: '',
  storeCode: '',
  shelfTime: '',
  statisticalTime: '',
  listStartTime: '',
  listEndTime: '',
  goodsCode: ''
})
const searchStoreName = ref('')
const total = ref(0) // 列表的总页数
const loading = ref(false)
const list = ref([]) // 列表的数据
const clickChartUdid = ref('')
const endDate = ref('')
const isExpand = ref(false)
onMounted(() => {
  getMaxEndDate()
})

const goodSaveImgRef = ref()
const sending = ref(false)
const sendGoodList = ref([])
// 一键发送图片
const sendGoodImgs = async (type) => {
  sending.value = true
  const data = await GoodDyCompassApi.dyCommerceSendGoodsImgData(type).catch(() => {
    sending.value = false
  })
  sendGoodList.value = data || []
  if (sendGoodList.value && sendGoodList.value.length > 0) {
    setTimeout(() => {
      goodSaveImgRef.value?.exportImgClick(type)
      sending.value = false
    }, 300)
  } else {
    sending.value = false
    ElMessage.warning('发送失败')
  }
}

const imgIsSending = () => {
  if (sending.value) {
    return true
  }
  return goodSaveImgRef.value?.getImgExporting()
}

const completeSendImg = () => {
  sending.value = false
  // sendGoodList.value = []
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.page = 1
  getList()
}
const queryFormRef = ref()
/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  queryParams.statisticalTime = endDate.value
  searchStoreName.value = ''
  handleQuery()
}

const disabledDate = (time: Date) => {
  if (endDate.value) {
    var timeString = `${endDate.value} 23:59:59`
    var timestamp = new Date(timeString).getTime()
    return time.getTime() > timestamp
  } else {
    return time.getTime() > Date.now()
  }
}

/**
 * 获取结束日期最大时间
 */
const getMaxEndDate = async () => {
  const validDate = await GoodDyCompassApi.dyCommerceCompassHasDataDate().catch(() => {
    getLastDayData()
  })
  if (validDate) {
    endDate.value = validDate
    queryParams.statisticalTime = endDate.value
    getList()
  } else {
    getLastDayData()
  }
}
const getLastDayData = () => {
  const lastDay = DateUtil.getLastDay()[0] || ''
  const arr = lastDay.split(' ')
  endDate.value = arr.length > 0 ? arr[0] : ''
  queryParams.statisticalTime = endDate.value
  getList()
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const param = {
      page: queryParams.page,
      pageSize: queryParams.pageSize,
      goodsKey: queryParams.goodsKey || '',
      goodsCode: queryParams.goodsCode || '',
      storeCode: queryParams.storeCode || '',
      statisticalTime: queryParams.statisticalTime || '',
      listStartTime:
        queryParams.shelfTime && queryParams.shelfTime.length > 0 ? queryParams.shelfTime[0] : '',
      listEndTime:
        queryParams.shelfTime && queryParams.shelfTime.length > 0 ? queryParams.shelfTime[1] : ''
    }
    const data = await GoodDyCompassApi.dyCommerceCompassGoodsPageQuery(param).catch(() => {})
    if (data) {
      list.value = data.records || []
      total.value = data.total
      clickChartUdid.value = generateUUID()
    }
  } finally {
    loading.value = false
  }
}

const otherChartDialogRef = ref()
// 查看其他
const seeOtherChart = (row: any) => {
  let staticsBeginDate = ''
  if (row.transactionAmounts && row.transactionAmounts.length > 0) {
    staticsBeginDate = row.transactionAmounts[0].date || ''
  }
  otherChartDialogRef.value.open(row.goodsId, [staticsBeginDate, queryParams.statisticalTime])
}

const chartDetailDiaologRef = ref()

// 查看统计详情
const seeChartDetail = (row: any) => {
  let staticsBeginDate = ''
  if (row.transactionAmounts && row.transactionAmounts.length > 0) {
    staticsBeginDate = row.transactionAmounts[0].date || ''
  }
  chartDetailDiaologRef.value.open(row, [staticsBeginDate, queryParams.statisticalTime])
}

/** 排序操作 */
const handleSortChange = () => {}
</script>

<style lang="scss" scoped>
.goodImg {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  margin-right: 8px;
}

.goodName {
  width: calc(100% - 70px);
  font-size: 14px;
  color: #0064ff;
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  // white-space: nowrap;
  word-break: break-all;
}

:deep(.el-range-editor.el-input__wrapper) {
  padding-right: 4px;
}

:deep(.el-date-editor .el-range-separator) {
  padding-left: 0px;
  padding-right: 0px;
}

.empty-img {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.icon {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  margin-left: 3px;
  margin-right: 6px;
}

.zhuanhuan_icon {
  background-color: #3270ff;
}

.dianji_icon {
  background-color: #ff7d08;
}

.fixedHeaderTable {
  border: 1px solid #ebeef5;
  border-left: none;
  height: calc(100vh - 300px);
}

:deep(.el-table__cell) {
  border-left: 1px solid #ebeef5;
}

.sendGoodImg {
  position: fixed;
  top: 99999px;
  z-index: -1;
  width: 100vw;
}
</style>
