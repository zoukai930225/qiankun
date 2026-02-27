<template>
  <div class="export">
    <el-button
      id="exportSaleRank"
      class="exportSaleRank"
      :loading="isLoading()"
      type="primary"
      @click="exportImg"
      >导出图片</el-button
    >
    <div
      id="beforeWeekRef"
      ref="beforeWeekRef"
      :style="{
        width: '1920px',
        marginTop: '9999px'
      }"
    >
      <BeforeWeek
        :exportImg="true"
        :title="beforeWeekTitle"
        :topList="preWeekGroupData"
        :rankList="preWeekServiceBaseData"
    /></div>
    <div
      ref="beforeMonthRef"
      id="beforeMonthRef"
      :style="{
        width: '1920px'
      }"
    >
      <BeforeMonth
        :exportImg="true"
        :title="beforeMonthTitle"
        :topList="preMonthGroupData"
        :rankList="preMonthServiceBaseData"
      />
    </div>
    <div
      ref="afterWeekRef"
      id="afterWeekRef"
      :style="{
        width: '1920px',
        marginTop: '9999px'
      }"
    >
      <AfterWeek
        :exportImg="true"
        :title="afterWeekTitle"
        :topList="afterWeekGroupData"
        :rankList="afterWeekServiceBaseData"
      />
    </div>
    <div
      ref="afterMonthRef"
      id="afterMonthRef"
      :style="{
        width: '1920px',
        marginTop: '9999px'
      }"
    >
      <AfterMonth
        :exportImg="true"
        :title="afterMonthTitle"
        :topList="afterMonthGroupData"
        :rankList="afterMonthServiceBaseData"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import html2canvas from 'html2canvas-plus'

import BeforeWeek from './components/saleRank/beforeWeek.vue'
import BeforeMonth from './components/saleRank/beforeMonth.vue'
import AfterWeek from './components/saleRank/afterWeek.vue'
import AfterMonth from './components/saleRank/afterMonth.vue'
import * as DataVSaleApi from '@/api/dataV/sale'

const beforeWeekRef = ref()
const beforeMonthRef = ref()
const afterWeekRef = ref()
const afterMonthRef = ref()

const beforeWeekTitle = ref('')
const beforeMonthTitle = ref('')
const afterWeekTitle = ref('')
const afterMonthTitle = ref('')

const preWeekGroupData = ref([])
const preWeekServiceBaseData = ref([])
const preMonthGroupData = ref([])
const preMonthServiceBaseData = ref([])

const afterWeekGroupData = ref([])
const afterWeekServiceBaseData = ref([])
const afterMonthGroupData = ref([])
const afterMonthServiceBaseData = ref([])

const beforeWeekReqeust = ref(true)
const beforeMonthReqeust = ref(true)
const afterWeekReqeust = ref(true)
const afterMonthReqeust = ref(true)

const isLoading = () => {
  if (
    beforeWeekReqeust.value &&
    beforeMonthReqeust.value &&
    afterWeekReqeust.value &&
    afterMonthReqeust.value
  ) {
    return false
  }
  return true
}

const exportImg = () => {
  if (isLoading()) {
    return
  }
  beforeWeekReqeust.value = false
  beforeMonthReqeust.value = false
  afterWeekReqeust.value = false
  afterMonthReqeust.value = false

  getPreSalesWeekData()
  getPreSalesMonthData()
  getAfterSalesWeekData()
  getAfterSalesMonthData()
}

const exportDailyToImage = async (rankRef, title) => {
  // 售前周排名数据
  // 售前月排名数据
  // 售后周排名数据
  // 售后月排名数据
  nextTick(async () => {
    try {
      const canvas = await html2canvas(rankRef)
      const img = canvas.toDataURL('image/png')
      // 创建一个a标签模拟点击进行下载
      const downloadLink = document.createElement('a')
      downloadLink.id = 'imgDownload'
      downloadLink.style.display = 'none'
      downloadLink.href = img
      downloadLink.download = title
      document.body.appendChild(downloadLink)
      downloadLink.click()
      if (title === '售前周排名数据') {
        beforeWeekReqeust.value = true
      } else if (title === '售前月排名数据') {
        beforeMonthReqeust.value = true
      } else if (title === '售后周排名数据') {
        afterWeekReqeust.value = true
      } else if (title === '售后月排名数据') {
        afterMonthReqeust.value = true
      }
    } catch (error) {
      console.error('Error exporting to image:', error, title)
      if (title === '售前周排名数据') {
        beforeWeekReqeust.value = true
      } else if (title === '售前月排名数据') {
        beforeMonthReqeust.value = true
      } else if (title === '售后周排名数据') {
        afterWeekReqeust.value = true
      } else if (title === '售后月排名数据') {
        afterMonthReqeust.value = true
      }
    }
  })
}

// 获取售前周数据
const getPreSalesWeekData = async () => {
  const data = await DataVSaleApi.customerServiceDataPreSalesWeek().catch(() => {
    beforeWeekReqeust.value = true
  })
  if (data) {
    preWeekGroupData.value = data.groupData || []
    preWeekServiceBaseData.value = data.serviceBaseData || []
    beforeWeekTitle.value = data.title || ''
    setTimeout(() => {
      exportDailyToImage(beforeWeekRef.value, '售前周排名数据')
    }, 100)
  } else {
    beforeWeekReqeust.value = true
  }
}

// 获取售前月数据
const getPreSalesMonthData = async () => {
  const data = await DataVSaleApi.customerServiceDataPreSalesMonth().catch(() => {
    beforeMonthReqeust.value = true
  })
  if (data) {
    preMonthGroupData.value = data.groupData || []
    preMonthServiceBaseData.value = data.serviceBaseData || []
    beforeMonthTitle.value = data.title || ''
    setTimeout(() => {
      exportDailyToImage(beforeMonthRef.value, '售前月排名数据')
    }, 100)
  } else {
    beforeMonthReqeust.value = true
  }
}

// 获取售后周数据
const getAfterSalesWeekData = async () => {
  const data = await DataVSaleApi.customerServiceDataAfterSalesWeek().catch(() => {
    afterWeekReqeust.value = true
  })
  if (data) {
    afterWeekGroupData.value = data.groupData || []
    afterWeekServiceBaseData.value = (data.serviceBaseData || []).filter((item) => item.id)

    afterWeekTitle.value = data.title || ''
    setTimeout(() => {
      exportDailyToImage(afterWeekRef.value, '售后周排名数据')
    }, 100)
  } else {
    afterWeekReqeust.value = true
  }
}

// 获取售后月数据
const getAfterSalesMonthData = async () => {
  const data = await DataVSaleApi.customerServiceDataAfterSalesMonth().catch(() => {
    afterMonthReqeust.value = true
  })
  if (data) {
    afterMonthGroupData.value = data.groupData || []
    afterMonthServiceBaseData.value = (data.serviceBaseData || []).filter((item) => item.id)
    afterMonthTitle.value = data.title || ''
    setTimeout(() => {
      exportDailyToImage(afterMonthRef.value, '售后月排名数据')
    }, 100)
  } else {
    afterMonthReqeust.value = true
  }
}
</script>

<style lang="scss" scoped>
.export {
  .exportSaleRank {
    margin: 40px;
  }
}
</style>
