<template>
  <!-- 列表 -->
  <div class="mainContainer">
    <div
      class="mainContainer-dateFilterHeader"
      style="padding-top: 15px; padding-bottom: 0px"
      :model="queryParams"
    >
      <el-form ref="queryFormRef" :inline="true" label-width="68px">
        <el-form-item label="时间" prop="date">
          <el-date-picker
            style="width: 200px"
            v-model="queryParams.date"
            value-format="YYYY-MM-DD"
            type="date"
            placeholder="选择日期"
            :disabled-date="disabledDate"
            :clearable="false"
            @change="getList()"
          />
        </el-form-item>
      </el-form>

      <el-button
        class="commonSearchBtn"
        style="margin-right: 5px; margin-top: -15px"
        @click="getList()"
      >
        <Icon icon="ep:search" class="mr-5px" /> 搜索
      </el-button>
      <el-button
        style="margin-right: 20px; margin-top: -15px"
        :loading="imgExporting"
        type="primary"
        @click="exportImg"
        >导出图片</el-button
      >
    </div>

    <div class="mainContainer-content">
      <div class="mainContainer-content-left">
        <CategoryItem ref="svcRef" type="search" :list="svcList" :store="'Tmall'" />
        <div style="margin-top: 20px">
          <CategoryItem ref="allChargeRef" type="total" :list="allChargeList" :store="'Tmall'" />
        </div>
        <div style="margin-top: 20px">
          <CategoryItem ref="paymentRef" type="sale" :list="paymentList" :store="'Tmall'" />
        </div>
        <div style="margin-top: 20px">
          <CategoryItem ref="refundRef" type="refund" :list="refundList" :store="'Tmall'" />
        </div>
        <div style="margin-top: 20px">
          <CategoryItem
            ref="refundRatioRef"
            type="refundRatio"
            :list="refundRatioList"
            :store="'Tmall'"
          />
        </div>
        <div style="margin-top: 20px">
          <CategoryItem
            ref="refundRateRef"
            type="refundRate"
            :list="refundRateList"
            :store="'Tmall'"
          />
        </div>
      </div>
      <!-- <div class="mainContainer-content-right"> </div> -->
      <ElScrollbar class="mainContainer-content-right">
        <CategoryRemark ref="categoryRemarkRef" @edit-click="editClick" store="swTmall" />
      </ElScrollbar>
    </div>

    <EditDrawer ref="editDrawerRef" @success="getRemarkList" />
  </div>
  <div
    class="exportableBg"
    ref="imgExportRef"
    id="imgExportRef"
    :style="{ width: `1658px`, height: `${imgExportHeight}px` }"
  >
    <div ref="exportImgMainRef" class="exportMainContainer">
      <div class="exportMainContainer-content">
        <div class="exportMainContainer-content-left">
          <CategoryItem ref="exportSvcRef" type="search" :list="svcList" :store="'Tmall'" />
          <div style="margin-top: 20px">
            <CategoryItem
              ref="exportAllChargeRef"
              type="total"
              :list="allChargeList"
              :store="'Tmall'"
            />
          </div>
          <div style="margin-top: 20px">
            <CategoryItem ref="exportPaymentRef" type="sale" :list="paymentList" :store="'Tmall'" />
          </div>
          <div style="margin-top: 20px">
            <CategoryItem ref="exportRefundRef" type="refund" :list="refundList" :store="'Tmall'" />
          </div>
          <div style="margin-top: 20px">
            <CategoryItem
              ref="exportRefundRatioRef"
              type="refundRatio"
              :list="refundRatioList"
              :store="'Tmall'"
            />
          </div>
          <div style="margin-top: 20px">
            <CategoryItem
              ref="exportRefundRateRef"
              type="refundRate"
              :list="refundRateList"
              :store="'Tmall'"
            />
          </div>
        </div>
        <div class="exportMainContainer-content-right">
          <CategoryRemark ref="exportCategoryRemarkRef" store="swTmall" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
// import * as DateUtil from '@/utils/formatTime'
import html2canvas from 'html2canvas-plus'

import CategoryItem from './component/categoryItem.vue'
import CategoryRemark from './component/categoryRemark.vue'
import EditDrawer from './component/editDrawer.vue'

import * as ChannelDataApi from '@/api/channelData'

const message = useMessage() // 消息弹窗

defineOptions({ name: 'TmallData' })

interface ValueItem {
  refundRatio: string
  refundRate: string
  category: string
  refund: string //退款
  percentage: string //占总几百分比
  paymentAmount: string
  qoq: string //环比
}

interface ListItem {
  date: string
  value: ValueItem[]
}

const disabledDate = (time) => {
  return time.getTime() > Date.now()
}

const props = defineProps({
  store: propTypes.string.def('') // 店铺
})
const loading = ref(true) // 列表的加载中
const imgExporting = ref(false)
const svcList = ref<ListItem[]>([]) // 搜索流量
const allChargeList = ref<ListItem[]>([]) // 付费总和
const paymentList = ref<ListItem[]>([]) // 销售额
const refundRatioList = ref<ListItem[]>([]) // 去退费比
const refundRateList = ref<ListItem[]>([]) // 退款率
const refundList = ref<ListItem[]>([]) // 退款

const svcRef = ref()
const allChargeRef = ref()
const paymentRef = ref()
const refundRatioRef = ref()
const refundRateRef = ref()
const refundRef = ref()

const exportSvcRef = ref()
const exportAllChargeRef = ref()
const exportPaymentRef = ref()
const exportRefundRatioRef = ref()
const exportRefundRateRef = ref()
const exportRefundRef = ref()

// 获取默认日期
const getDefaultDate = () => {
  // const lastDay = DateUtil.getLastDay()[0] || ''
  // const arr = lastDay.split(' ')
  // return arr.length > 0 ? arr[0] : ''
  var date = new Date()
  var year = date.getFullYear() // 年份
  var month = date.getMonth() + 1 // 月份，返回值为0-11，所以需要加1
  var day = date.getDate() // 日期

  // 对月份和日期进行补零
  month = month < 10 ? '0' + month : month.toString()
  day = day < 10 ? '0' + day : day.toString()

  var currentDate = `${year}-${month}-${day}`
  return currentDate
}

const queryParams = reactive({
  date: getDefaultDate(),
  store: 'swTmall'
})

const formatTime = (length) => {
  var date = new Date(`${queryParams.date} 00:00:00`)
  const dateTimestamp = date.getTime()
  const startTimeStamp = dateTimestamp - 3600 * 24 * length * 1000
  var preDate = new Date(startTimeStamp)
  var year = preDate.getFullYear()
  var month = preDate.getMonth() + 1
  var day = preDate.getDate()
  let startDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`
  return startDate
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const params = {
      store: queryParams.store,
      startDate: formatTime(7),
      endDate: formatTime(1)
    }
    const data = await ChannelDataApi.getCategoryComparisonAndAnalysisList(params)
    if (data) {
      svcList.value = data.svc || []
      allChargeList.value = data.allCharge || []
      paymentList.value = data.payment || []
      refundRatioList.value = data.refundRatio || []
      refundRateList.value = data.refundRate || []
      refundList.value = data.refund || []
    }
    nextTick(() => {
      svcRef.value?.handleData(svcList.value)
      allChargeRef.value?.handleData(allChargeList.value)
      paymentRef.value?.handleData(paymentList.value)
      refundRatioRef?.value?.handleData(refundRatioList.value)
      refundRateRef?.value?.handleData(refundRateList.value)
      refundRef?.value?.handleData(refundList.value)

      exportSvcRef.value?.handleData(svcList.value)
      exportAllChargeRef.value?.handleData(allChargeList.value)
      exportPaymentRef.value?.handleData(paymentList.value)
      exportRefundRatioRef?.value?.handleData(refundRatioList.value)
      exportRefundRateRef?.value?.handleData(refundRateList.value)
      exportRefundRef?.value?.handleData(refundList.value)
    })
    loading.value = false
  } finally {
    loading.value = false
    nextTick(() => {
      categoryRemarkRef.value?.getList(queryParams.date)
      exportCategoryRemarkRef.value?.getList(queryParams.date)
    })
  }
}

const getRemarkList = async () => {
  categoryRemarkRef.value?.getList(queryParams.date)
  exportCategoryRemarkRef.value?.getList(queryParams.date)
}
const categoryRemarkRef = ref()
const exportCategoryRemarkRef = ref()
const editDrawerRef = ref()
const editClick = (value, currentDate) => {
  if (editDrawerRef.value) {
    editDrawerRef.value.open(
      value.id,
      currentDate,
      value.code,
      value.yesterdayReview,
      value.todayOperation,
      value.category,
      'swTmall'
    )
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})

const imgExportRef = ref()
const imgExportHeight = ref(0)
const exportImgMainRef = ref()

// 导出图片
const exportImg = async () => {
  imgExporting.value = true
  imgExportHeight.value = exportImgMainRef.value.clientHeight
  nextTick(async () => {
    try {
      const canvas = await html2canvas(imgExportRef.value)
      const img = canvas.toDataURL('image/png')
      // 创建一个a标签模拟点击进行下载
      const downloadLink = document.createElement('a')
      downloadLink.id = 'imgDownload'
      downloadLink.style.display = 'none'
      downloadLink.href = img
      downloadLink.download = 'SW天猫店品类对比'
      document.body.appendChild(downloadLink)
      downloadLink.click()
      imgExporting.value = false
    } catch (error) {
      imgExporting.value = false
      message.warning('导出图片失败')
    }
  })
}
</script>

<style lang="scss" scoped>
.mainContainer {
  position: relative;
  min-width: 1658px;
  background: #fff;
  border-radius: 8px;

  &-dateFilterHeader {
    width: calc(100%);
    background: #fff;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  &-content {
    display: flex;
    flex-direction: row;
    min-width: 1658px;

    &-left {
      margin-left: 20px;
      width: calc(100% - 643px);
    }
    &-right {
      margin-left: 22px;
      width: 602px;
      height: 1240px;
    }
  }
  .exportImg {
    position: absolute;
    left: calc(100% - 643px - 90px);
    top: 80px;
  }
}

.exportableBg {
  position: absolute;
  bottom: 99999px;
}
.exportMainContainer {
  &-content {
    display: flex;
    flex-direction: row;
    min-width: 1658px;

    &-left {
      margin-left: 20px;
      width: calc(100% - 643px);
    }
    &-right {
      margin-left: 22px;
      width: 602px;
    }
  }
}
</style>
