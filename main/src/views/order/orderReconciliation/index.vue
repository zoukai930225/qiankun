<template>
  <!-- 列表 -->
  <ContentWrap>
    <div class="commonTopFilterWrap">
      <div class="commonTopFilterWrap-filter">
        <el-form class="-mb-15px" :model="topParams" ref="queryFormRef" :inline="true">
          <el-form-item label="" prop="time">
            <el-date-picker
              v-model="topParams.time"
              type="monthrange"
              range-separator="-"
              value-format="YYYY-MM"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              @change="handleTimeChange"
              @clear="getOrderList"
              :clearable="false"
            />
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 店铺 -->
    <div class="store-wapper">
      <div class="btn btn-left" @click="prevItem" v-if="visibleItems?.length > 2">
        <img src="@/assets/imgs/order/left-activity.png" class="btn-item" />
        <img src="@/assets/imgs/order/left-normal.png" class="btn-item" />
      </div>

      <div class="store-item store-item-empty" v-if="visibleItems?.length == 0">
        <div class="empty">
          <img src="@/assets/imgs/empty-box.png" class="empty-img" alt="" />
          <span class="desc">暂无数据</span>
        </div></div
      >
      <div class="store-item store-item-empty" v-if="visibleItems?.length == 0">
        <div class="empty">
          <img src="@/assets/imgs/empty-box.png" class="empty-img" alt="" />
          <span class="desc">暂无数据</span>
        </div>
      </div>
      <div class="store-item" v-for="item in visibleItems" :key="item.id">
        <!-- 店铺详情 -->
        <StoreItem :store-item="item" @item-click="itemClick" :selectedStore="selectedStore" />
      </div>

      <div class="btn btn-right" @click="nextItem" v-if="visibleItems?.length > 2">
        <img src="@/assets/imgs/order/right-activity.png" class="btn-item" />
        <img src="@/assets/imgs/order/right-normal.png" class="btn-item" />
      </div>
    </div>

    <!-- tabs -->
    <div class="flex-row tabs-wapper">
      <div class="flex-row">
        <div class="title">店铺</div>
        <div class="store-buttons">
          <div
            v-for="store in storeBtnList"
            :key="store.storeName"
            :class="[
              'store-button',
              { 'store-button-active': selectedStore.includes(store.storeCode) }
            ]"
            @click="selectStore(store)"
          >
            {{ store?.storeName || '' }}
          </div>
        </div>
      </div>
      <div class="flex-row">
        <el-form class="-mb-15px" :model="bottomParams" ref="queryFormRef" :inline="true">
          <el-form-item label="订单号" prop="orderNumber">
            <el-input placeholder="请输入订单号" clearable v-model="bottomParams.orderNumber" />
          </el-form-item>
        </el-form>
        <el-button @click="getOrderList" class="commonSearchBtn" style="margin-left: 16px">
          <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
          搜索
        </el-button>
        <!-- <el-button type="primary" style="margin-left: 16px" @click="getOrderList">搜索</el-button> -->
        <el-button
          type="primary"
          style="margin-left: 0"
          :loading="exportLoading"
          @click="exportOrderList"
          >导出</el-button
        >
      </div>
    </div>
    <!-- order -->
    <div class="order-wapper">
      <div class="empty" v-if="orderList?.length == 0">
        <img src="@/assets/imgs/empty-box.png" class="empty-img" alt="" />
        <span class="desc">暂无数据</span>
      </div>
      <div class="order-item" v-for="item in orderList" :key="item.id">
        <OrderItem :item="item" />
      </div>
    </div>

    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="bottomParams.page"
      v-model:limit="bottomParams.size"
      :page-sizes="[20, 40, 60, 80, 100]"
      @pagination="handlePagination"
    />
  </ContentWrap>
</template>

<script lang="ts" setup>
import {
  exportOrderReconciliation,
  getOrderReconciliationList,
  getStore,
  getSumList
} from '@/api/order/index'
import download from '@/utils/download'
import dayjs from 'dayjs'
import OrderItem from './components/orderItem.vue'
import StoreItem from './components/storeItem.vue'
const message = useMessage() // 消息弹窗

const total = ref(10) // 列表的总页数
defineOptions({ name: 'OrderReconciliation' })
const exportLoading = ref(false) // 导出按钮 loading

// 上面参数
const topParams = reactive({
  time: []
})

// 下面参数
const bottomParams = reactive({
  page: 1,
  size: 20,
  orderNumber: undefined // 订单号
})

interface StoreItem {
  alipayActualPayment: string
  billAmount: string
  difference: string
  month: string
  remittanceAmount: string
  store: string
  wechatActualPayment: string
  id: string
  storeName: string
  actualPaidAmount: string
}
const storeList = ref<StoreItem[]>([]) // 存储接口返回的 store-item 数据
const currentIndex = ref(0) // 当前显示的 store-item 索引
const storeBtnList = ref() // 店铺按钮列表

const selectedStore = ref<String[]>([]) // 当前选中的店铺

const orderList = ref() // 订单列表
const getList = async () => {
  console.log('获取列表')
  const storeMid = storeBtnList.value.map((item) => item.storeCode)
  const params = {
    startDate:
      topParams.time && topParams.time[0]
        ? dayjs(topParams.time[0]).startOf('month').format('YYYY-MM-DD')
        : undefined,
    endDate:
      topParams.time && topParams.time[1]
        ? dayjs(topParams.time[1]).endOf('month').format('YYYY-MM-DD')
        : undefined,
    store: storeMid?.length > 0 ? storeMid.join() : undefined
  }
  const res = await getSumList(params)
  console.log(res, '获取订单对账汇总列表11111')
  // 模拟接口返回数据
  storeList.value = res
}

const selectStore = (store) => {
  // 如果存在数组就删除，不存在就添加
  // if (selectedStore.value.includes(store.storeCode)) {
  //   selectedStore.value = selectedStore.value.filter((item) => item !== store.storeCode)
  // } else {
  //   selectedStore.value.push(store.storeCode)
  // }
  // getList()
  // getOrderList()
}

const itemClick = (store) => {
  if (selectedStore.value.includes(store)) {
    selectedStore.value = selectedStore.value.filter((item) => item !== store)
  } else {
    selectedStore.value.push(store)
  }
  // getList()
  getOrderList()
}

const handleTimeChange = () => {
  getList()
  getOrderList()
}

/** 初始化 **/
onMounted(async () => {
  const startOfMonth = dayjs().startOf('month').format('YYYY-MM-DD') // 本月第一天
  const endOfMonth = dayjs().endOf('month').format('YYYY-MM-DD') // 本月最后一天
  //@ts-ignore
  topParams.time = [startOfMonth, endOfMonth] // 设置默认值
  await initStore()
  getList()
  getOrderList()
})

const handlePagination = (val) => {
  bottomParams.page = val.page
  bottomParams.size = val.limit
  getOrderList()
}

const initStore = async () => {
  const res = await getStore()
  storeBtnList.value = res
  res.forEach((item) => {
    if (item) {
      selectedStore.value.push(item.storeCode)
    }
  })
  console.log(res, 'initStore')
}
// 订单导出
const exportOrderList = async () => {
  try {
    // 检查是否跨月份
    if (topParams.time && topParams.time.length === 2) {
      const startDate = dayjs(topParams.time[0])
      const endDate = dayjs(topParams.time[1])

      // 判断是否跨月份
      if (startDate.month() !== endDate.month() || startDate.year() !== endDate.year()) {
        message.warning('请选择单个月份进行导出！') // 提示用户
        return
      }
    }

    exportLoading.value = true
    const params = {
      ...bottomParams,
      startDate:
        topParams.time && topParams.time[0]
          ? dayjs(topParams.time[0]).startOf('month').format('YYYY-MM-DD')
          : undefined,
      endDate:
        topParams.time && topParams.time[1]
          ? dayjs(topParams.time[1]).endOf('month').format('YYYY-MM-DD')
          : undefined,
      store: selectedStore.value?.length > 0 ? selectedStore.value.join() : undefined
    }
    const res = await exportOrderReconciliation({ ...params, page: undefined, size: undefined })
    exportLoading.value = false
    if (res && res.data) {
      message.success(res.data)
    }
  } catch (error) {
    exportLoading.value = false
  }
}

// 获取订单对账列表
const getOrderList = async () => {
  const params = {
    ...bottomParams,
    startDate:
      topParams.time && topParams.time[0]
        ? dayjs(topParams.time[0]).startOf('month').format('YYYY-MM-DD')
        : undefined,
    endDate:
      topParams.time && topParams.time[1]
        ? dayjs(topParams.time[1]).endOf('month').format('YYYY-MM-DD')
        : undefined,
    store: selectedStore.value?.length > 0 ? selectedStore.value.join() : undefined
  }
  const res = await getOrderReconciliationList(params)
  console.log(res, '获取订单对账列表')
  orderList.value = res.records
  total.value = res.total
}

const visibleItems = computed(() => {
  return storeList.value.slice(currentIndex.value, currentIndex.value + 2)
})

const prevItem = () => {
  if (currentIndex.value > 0) {
    currentIndex.value -= 1
  }
}

const nextItem = () => {
  if (currentIndex.value < storeList.value.length - 2) {
    currentIndex.value += 1
  }
}
</script>

<style lang="scss" scoped>
.commonTopFilterWrap-filter {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: end;
}
.el-form--inline .el-form-item {
  margin-right: 0 !important;
}

.store-wapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  min-width: 1000px;
  min-height: 332px;
  width: 100%;
  position: relative;

  .btn-left {
    position: absolute;
    left: -10px;
    top: 45%;
  }
  .btn-right {
    position: absolute;
    right: -10px;
    top: 45%;
  }
  .btn-item {
    cursor: pointer;
    width: 40px;
    height: 40px;
  }
  .store-item {
    width: 50%;
    height: 332px;
    background-color: #f0f0f0;
    margin: 10px;
    display: inline-block;
  }
  .store-item-empty {
    background: white;
  }
  button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px;
    cursor: pointer;
  }
}
.title {
  font-weight: 400;
  font-size: 14px;
  color: #666666;
  line-height: 20px;
  text-align: left;
  font-style: normal;
  margin-right: 10px;
}

.store-buttons {
  display: flex;
  flex-direction: row;
  margin-right: 20px;
}
.store-button {
  cursor: pointer;
  height: 40px;
  line-height: 40px;
  background: #f8f9fa;
  border-radius: 6px;
  padding: 0 20px;
  box-sizing: border-box;
  font-weight: 400;
  font-size: 14px;
  color: #666666;
  text-align: left;
  font-style: normal;
  margin-right: 20px;
}
.store-button-active {
  background: #f3f8ff;
  border: 1px solid #5899ff;
  color: #0064ff;
}
.flex-row {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.order-wapper {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 20px;
  .order-item {
    width: 391px;
    height: 179px;
    background: #f7f8fa;
    border-radius: 10px;
    margin-right: 18px;
    margin-bottom: 18px;
    border: 1px solid transparent;
  }

  .order-item:hover {
    background: #ffffff;
    border: 1px solid #0064ff;
  }
}

.tabs-wapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  .empty-img {
    width: 390px;
    height: 220px;
  }
  .desc {
    font-weight: 400;
    font-size: 14px;
    color: #999999;
    line-height: 20px;
    text-align: left;
    font-style: normal;
    margin-top: 20px;
  }
}
</style>
