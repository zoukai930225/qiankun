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
              <el-form-item label="统计时间" prop="endDate">
                <el-date-picker
                  v-model="queryParams.endDate"
                  value-format="YYYY-MM-DD"
                  type="date"
                  placeholder="选择日期"
                  :clearable="false"
                  :disabled-date="disabledDate"
                  @change="handleQuery"
                  :editable="false"
                />
              </el-form-item>
              <el-form-item label="上架时间" prop="shelfTime">
                <el-date-picker
                  range-separator="至"
                  v-model="queryParams.shelfTime"
                  value-format="YYYY-MM-DD"
                  placeholder="请选择上架时间"
                  type="daterange"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  @change="getList"
                />
              </el-form-item>
              <el-form-item label="店铺" prop="store">
                <StoreRangePlus
                  v-model="queryParams.store"
                  placeholder="请选择店铺"
                  multiple
                  @change="getList"
                />
              </el-form-item>
              <el-form-item v-if="isExpand" label="商品" prop="goods">
                <el-input
                  :prefix-icon="Search"
                  class="dialogFormItemWidth"
                  v-model="queryParams.goods"
                  placeholder="商品ID/名称/产品编码"
                  clearable
                  @clear="handleQuery"
                  @keyup.enter="handleQuery"
                />
              </el-form-item>

              <el-form-item v-if="isExpand" label="类目" prop="category">
                <el-select
                  class="searchFormItemWidth"
                  v-model="queryParams.category"
                  placeholder="请选择类目"
                  clearable
                  @change="handleQuery"
                  @clear="handleQuery"
                >
                  <el-option
                    v-for="dict in categoryList"
                    :key="dict.code"
                    :label="dict.name"
                    :value="dict.name"
                  />
                </el-select>
              </el-form-item>

              <el-form-item v-if="isExpand" label="人员搜索" prop="headerName">
                <el-input
                  class="searchFormItemWidth"
                  v-model="queryParams.headerName"
                  placeholder="请输入人员姓名"
                  clearable
                  @keyup.enter="handleQuery"
                  @clear="handleQuery"
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
              <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0px">
                重置
              </el-button>

              <SWFilterAdd
                class="commonAddBtn"
                :list="addList"
                :current-code="currentAddCode"
                @add-btn-click="addBtnClick"
              />
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
        <el-table-column
          prop="name"
          min-width="600"
          :show-overflow-tooltip="false"
          label="商品"
          fixed
        >
          <template #default="scope">
            <good-fiche
              :item="scope.row"
              :fields="[
                { name: '类目', key: 'categoryName', length: 114 },
                { name: '产品编码', key: 'goodCode', length: 114 },
                { name: '商品ID', key: 'goodsId', isCopy: true, length: 98 },
                { name: '上架时间', key: 'groundingTime', format: 'YYYY-MM-DD', length: 114 },
                { name: '发布时间', key: 'releaseTime', format: 'YYYY-MM-DD', length: 114 },
                { name: '平均停留时长（秒）', key: 'averageStayDuration', length: 114 }
              ]"
            />
            <!-- <div class="row-center">
              <el-popover placement="right" :width="348" trigger="hover" :show-arrow="false" :offset="20">
                <template #reference>
                  <div class="goodImg">
                    <img style="width: 60px; height: 60px; border-radius: 4px"
                      :src="getImgUrlById(scope.row.goodsId || scope.row.goods_id)" />
                  </div>
                </template>
<GoodCard :good="{
                  materialName: scope.row.goodsName || scope.row.goods_name,
                  materialId: scope.row.goodsId || scope.row.goods_id,
                  channel: scope.row.channel || ''
                }" />
</el-popover>
<div class="goodName">{{ scope.row.goodsName || scope.row.goods_name }}</div>
</div> -->
          </template>
        </el-table-column>
        <!-- <el-table-column prop="name" width="247" :show-overflow-tooltip="false" label="商品" fixed>
          <template #default="scope">
            <div class="row-center">
              <el-popover placement="right" :width="348" trigger="hover" :show-arrow="false" :offset="20">
                <template #reference>
                  <div class="goodImg">
                    <img style="width: 60px; height: 60px; border-radius: 4px"
                      :src="getImgUrlById(scope.row.goodsId || scope.row.goods_id)" />
                  </div>
                </template>
                <GoodCard :good="{
                  materialName: scope.row.goodsName || scope.row.goods_name,
                  materialId: scope.row.goodsId || scope.row.goods_id,
                  channel: scope.row.channel || ''
                }" />
              </el-popover>
              <div class="goodName">{{ scope.row.goodsName || scope.row.goods_name }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="channel" width="136" label="店铺" fixed>
          <template #default="scope">
            <div class="row-center">
              <img v-if="getImageUrl(scope.row.channel)" style="width: 18px; height: 18px; margin-right: 8px"
                :src="getImageUrl(scope.row.channel)" />
              <div :style="{
                width: getImageUrl(scope.row.channel) ? '90px' : '126px',
                paddingRight: '6px'
              }">{{ scope.row.storeName || scope.row.store_name }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="categoryName " width="136" label="类目">
          <template #default="scope">
            <div class="row-center">
              <div>{{ scope.row.categoryName }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="goodCode" width="150" label="产品编码" />
        <el-table-column prop="goodsId" width="150" label="商品ID" />
        <el-table-column prop="groundingTime" width="150" label="上架时间" sortable="custom" />
        <el-table-column prop="releaseTime" width="150" label="发布时间" sortable="custom">
          <template #default="scope">
            <div style="color: #333">{{ scope.row.releaseTime || '--' }}</div>
          </template>
        </el-table-column> -->
        <el-table-column label="" align="center">
          <template #header>
            <el-select
              v-model="queryParams.dataTyperange"
              class="m-2"
              placeholder="Select"
              style="width: 240px"
              @change="getList"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="`${item.label}(${endDate.substring(5, 10)})`"
                :value="item.value"
              />
            </el-select>
            <el-tooltip content="按照统计时间获取的7天数据" placement="top" effect="dark">
              <img src="@/assets/imgs/shop/tip.png" alt="" />
            </el-tooltip>
          </template>
          <el-table-column
            prop="goodsSllPaidItemCount"
            width="160"
            :label="getLately30DayPaidCountLabel()"
            sortable="custom"
          >
            <template #default="scope">
              <div style="font-size: 18px; font-weight: 550; color: #0064ff">{{
                (scope.row.goodsSllPaidItemCount && scope.row.goodsSllPaidItemCount.value) || '--'
              }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="goodsSllVisitorCount"
            width="150"
            :label="getLately30DayVisitorCountLabel()"
            sortable="custom"
          >
            <template #default="scope">
              <div style="font-size: 18px; font-weight: 550; color: #0064ff">{{
                (scope.row.goodsSllVisitorCount && scope.row.goodsSllVisitorCount.value) || '--'
              }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="conversionRate"
            width="200"
            :label="getLately30DayConversionRateLabel()"
            sortable="custom"
          >
            <template #default="scope">
              <div style="font-size: 18px; font-weight: 550; color: #0064ff">{{
                scope.row.conversionRate && scope.row.conversionRate.value
                  ? scope.row.conversionRate.value
                  : '--'
              }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="clicks"
            width="180"
            :label="getLately30DayClickLabel()"
            sortable="custom"
          >
            <template #default="scope">
              <div style="font-size: 18px; font-weight: 550; color: #0064ff">{{
                scope.row.clicks && scope.row.clicks.value ? scope.row.clicks.value : '--'
              }}</div>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column
          prop="comprehensiveClickRate"
          width="170"
          label="综合点击转化率"
          sortable="custom"
        >
          <template #header>
            <span>综合点击转化率 </span>
            <el-tooltip content="30天转化率 * 30天免费点击率" placement="top" effect="dark">
              <img src="@/assets/imgs/shop/tip.png" alt="" />
            </el-tooltip>
          </template>
          <template #default="scope">
            <div style="font-size: 18px; font-weight: 550; color: #0064ff">{{
              scope.row.comprehensiveClickRate || '--'
            }}</div>
          </template>
        </el-table-column>

        <el-table-column min-width="600" label="折线图(转换率+点击率)" align="center">
          <template #header>
            <div> 折线图(1天) </div>
            点击率 <div class="dianji_icon icon"></div> 转换率
            <div class="zhuanhuan_icon icon"></div>
          </template>
          <template #default="scope">
            <ClickRateChart
              v-if="
                (scope.row.freeSearchClickRate && scope.row.freeSearchClickRate.length > 0) ||
                (scope.row.payChangeRate && scope.row.payChangeRate.length > 0)
              "
              :udid="clickChartUdid"
              :list="scope.row.freeSearchClickRate"
              :list1="scope.row.payChangeRate"
            />
            <div v-else class="empty-img">
              <img src="@/assets/imgs/common/chart_empty.png" alt="" />
              <div style="font-size: 12px; color: #999999">暂无数据</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column min-width="600" label="折线图(转换率+点击率)" align="center">
          <template #header>
            <div> 折线图(1天) </div>
            支付件数 <div class="dianji_icon icon"></div> 访客数
            <div class="zhuanhuan_icon icon"></div>
          </template>
          <template #default="scope">
            <ClickRateChart2
              v-if="
                (scope.row.goodsSllPaidItem && scope.row.goodsSllPaidItem.length > 0) ||
                (scope.row.goodsSllVisitor && scope.row.goodsSllVisitor.length > 0)
              "
              :udid="clickChartUdid"
              :list="scope.row.goodsSllPaidItem"
              :list1="scope.row.goodsSllVisitor"
            />
            <div v-else class="empty-img">
              <img src="@/assets/imgs/common/chart_empty.png" alt="" />
              <div style="font-size: 12px; color: #999999">暂无数据</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column min-width="600" label="折线图(1天)" align="center">
          <template #header>
            <div> 折线图(1天) </div>
            支付金额 <div class="dianji_icon icon"></div> 搜索引导访客数
            <div class="zhuanhuan_icon icon"></div>
          </template>
          <template #default="scope">
            <PaymentAmountChart
              v-if="
                (scope.row.paymentAmountList && scope.row.paymentAmountList.length > 0) ||
                (scope.row.searchVisitorsCountList && scope.row.searchVisitorsCountList.length > 0)
              "
              :udid="clickChartUdid"
              :list="scope.row.paymentAmountList"
              :list1="scope.row.searchVisitorsCountList"
            />
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
        v-model:limit="queryParams.size"
        @pagination="getList"
      />
      <OtherChartDialog ref="otherChartDialogRef" />
    </ContentWrap>
  </div>
</template>
<script lang="ts" setup>
import GoodFiche from '@/components/common/goods/fiche.vue'
import { useAppStore } from '@/store/modules/app'
import { getImgUrlById, getImageUrl } from '@/utils/index'
import { Search } from '@element-plus/icons-vue'
import { generateUUID } from '@/utils'
import dayjs from 'dayjs'

import GoodCard from '@/components/common/goods/goodCard.vue'
import ClickRateChart from './components/clickRateChart.vue'
import ClickRateChart2 from './components/clickRateChart2.vue'
import PaymentAmountChart from './components/paymentAmountChart.vue'

import OtherChartDialog from './components/otherChartDialog.vue'
import SWFilterExpandAll from '@/components/SWBaseComponent/SWFilterExpandAll/index.vue' // 展开组件

import * as CommonApi from '@/api/common/index'
import * as GoodsShopApi from '@/api/shop'

const appStore = useAppStore()
const message = useMessage()

defineOptions({ name: 'ShopClickRate' })

const queryParams = reactive({
  page: 1,
  size: 10,
  goods: '',
  store: '',
  category: '',
  shelfTime: [dayjs().subtract(60, 'day').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
  endDate: '',
  headerName: '',
  beginShelfTime: '',
  endShelfTime: '',
  orderType: '',
  dataTyperange: '7'
})
const searchStoreName = ref('')
const total = ref(0) // 列表的总页数
const loading = ref(false)
const list = ref<any[]>([]) // 列表的数据
const isExpand = ref(false)
const clicksDate = ref()
const conversionRateDate = ref()
const conversionPaidCount = ref()
const conversionVisitorCount = ref()
const clickChartUdid = ref('')
const endDate = ref('')
onBeforeMount(() => {
  getCategoryList()
  getMaxEndDate()
})

let options = [
  { label: `7天${endDate.value}`, value: '7' },
  { label: `30天${endDate.value}`, value: '30' }
]
const addList = ref([
  {
    label: '数据导出',
    code: 'exportData'
  },
  {
    label: '打开链接',
    code: 'openLink'
  }
])

// 当前新增按钮code码
const currentAddCode = ref('exportData')

// 新增按钮点击
const addBtnClick = async (value) => {
  if (value) {
    currentAddCode.value = value.code
    if (currentAddCode.value === 'exportData') {
      await message.confirm('数据正在导出中，请稍候前往飞书查看。点击【打开链接】进行跳转?', '提示')

      handleExport()
    } else if (currentAddCode.value === 'openLink') {
      handleOpenLink()
    }
  }
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
  // 动态重置为近60天，结束为当天
  queryParams.shelfTime = [
    dayjs().subtract(60, 'day').format('YYYY-MM-DD'),
    dayjs().format('YYYY-MM-DD')
  ]
  queryParams.endDate = endDate.value
  searchStoreName.value = ''
  queryParams.store = ''
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

const categoryList = ref<any[]>([])
const getCategoryList = async () => {
  const data = await CommonApi.getCategoryNameList().catch(() => {})
  if (data) {
    categoryList.value = data || []
  }
}

const getLately30DayClickLabel = () => {
  if (clicksDate.value) {
    return `免费点击率(${clicksDate.value})`
  } else {
    return '免费点击率'
  }
}

const getLately30DayConversionRateLabel = () => {
  if (conversionRateDate.value) {
    return `手淘搜索转换率(${conversionRateDate.value})`
  } else {
    return '手淘搜索转换率'
  }
  // return `(${endDate.value.substring(5,10)})手淘搜索转换率`
}

const getLately30DayPaidCountLabel = () => {
  if (conversionRateDate.value) {
    return `支付件数(${conversionPaidCount.value})`
  } else {
    return '支付件数'
  }
  // return `(${endDate.value.substring(5,10)})支付件数`
}

const getLately30DayVisitorCountLabel = () => {
  if (conversionRateDate.value) {
    return `访客数(${conversionVisitorCount.value})`
  } else {
    return '访客'
  }
  // return `(${endDate.value.substring(5,10)})访客数`
}

// 综合点击转化率
const zongheClickRate = (row: any) => {
  if (row.conversionRate && row.conversionRate.value && row.clicks && row.clicks.value) {
    const conversionRate = row.conversionRate.value.replace('%', '')
    const clicks = row.clicks.value.replace('%', '')
    if (Number(clicks)) {
      const rate = ((Number(conversionRate) * Number(clicks)) / 100).toFixed(2) || '0.00'
      return `${rate}%`
    }
    return ''
  }
  return ''
}

/**
 * 获取结束日期最大时间
 */
const getMaxEndDate = async () => {
  const data = await GoodsShopApi.goodsClickRateGetMaxDate().catch(() => {})
  if (data) {
    endDate.value = data || ''
    queryParams.endDate = endDate.value
    getList()
  }
}

// 数据导出
const exportLoading = ref(false)
const handleExport = async () => {
  try {
    exportLoading.value = true
    const res = await GoodsShopApi.goodsSaleMonitorExport({ ...queryParams })
    if (res) {
      message.success('导出成功')
    }
  } catch (error) {
    message.error('导出失败')
  } finally {
    exportLoading.value = false
  }
}

const handleOpenLink = () => {
  // 打开链接
  const url = 'https://qvhclsncsrc.feishu.cn/sheets/R31YsfK5wh7rcAtoHBgcOdfVnQh?sheet=a0a5b4'
  window.open(url)
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const param = {
      page: queryParams.page,
      size: queryParams.size,
      goods: queryParams.goods || '',
      store: queryParams.store || '',
      category: queryParams.category || '',
      headerName: queryParams.headerName || '',
      endDate: queryParams.endDate || '',
      dataTyperange: queryParams.dataTyperange || '',
      beginShelfTime:
        queryParams.shelfTime && queryParams.shelfTime.length > 0 ? queryParams.shelfTime[0] : '',
      endShelfTime:
        queryParams.shelfTime && queryParams.shelfTime.length > 0 ? queryParams.shelfTime[1] : '',
      orderType: queryParams.orderType || ''
    }
    const data = await GoodsShopApi.goodsClickRateLineChart(param).catch(() => {})
    if (data) {
      list.value = data.records || []
      total.value = data.total
      clickChartUdid.value = generateUUID()
    }
    if (list.value.length > 0) {
      if (list.value[0].clicks && list.value[0].clicks) {
        clicksDate.value = list.value[0].clicks.date || ''
      }
      if (list.value[0].conversionRate && list.value[0].conversionRate) {
        conversionRateDate.value = list.value[0].conversionRate.date || ''
      }
      if (list.value[0].goodsSllPaidItemCount && list.value[0].goodsSllPaidItemCount) {
        conversionPaidCount.value = list.value[0].goodsSllPaidItemCount.date || ''
      }
      if (list.value[0].goodsSllVisitorCount && list.value[0].goodsSllVisitorCount) {
        conversionVisitorCount.value = list.value[0].goodsSllVisitorCount.date || ''
      }
    }
  } finally {
    loading.value = false
  }
}

const otherChartDialogRef = ref()
// 查看其他
const seeOtherChart = (row: any) => {
  otherChartDialogRef.value.open(row.goodsId)
}

/** 排序操作 */
const handleSortChange = (column) => {
  // console.log('handleSortChange', column.prop);

  const orderTypeMap = {
    groundingTime: { ascending: 1, descending: 2 },
    comprehensiveClickRate: { ascending: 3, descending: 4 },
    conversionRate: { ascending: 5, descending: 6 },
    clicks: { ascending: 7, descending: 8 },
    releaseTime: { ascending: 9, descending: 10 },
    goodsSllPaidItemCount: { ascending: 11, descending: 12 },
    goodsSllVisitorCount: { ascending: 13, descending: 14 }
  }

  if (column.order && orderTypeMap[column.prop]) {
    queryParams.orderType = orderTypeMap[column.prop][column.order]
  } else {
    queryParams.orderType = ''
  }

  getList()
}
</script>

<style lang="scss" scoped>
.commonTopFilterWrap-filter {
  :deep(.el-form) {
    .el-form-item {
      // margin: 0 20px 18px 0;
      // margin-bottom: unset;
      margin-right: 18px;
      row-gap: 16px;
    }

    .el-select,
    .el-date-editor,
    .el-input {
      width: 240px !important;
      box-sizing: border-box;

      .el-input__wrapper {
        padding-top: unset;
        padding-bottom: unset;
      }
    }
  }
}

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

// :deep(.el-table--default .el-table__cell) {
//   padding-top: 0px;
//   padding-bottom: 0px;
// }
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
}

.zhuanhuan_icon {
  background-color: #3270ff;
}

.dianji_icon {
  background-color: #ff8400;
}

.fixedHeaderTable {
  height: calc(100vh - 300px);
}
</style>
