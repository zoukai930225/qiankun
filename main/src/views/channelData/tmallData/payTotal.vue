<template>
  <!-- 列表 -->
  <div class="mainContainer">
    <div class="mainContainer-dateFilterHeader">
      <BITopDateFilter
        v-if="selectDate.length > 0"
        class="mainContainer-dateFilterHeader-dateFilter"
        :defaultDateByQuery="selectDate[0]"
        @send-date-select="sendDateSelect"
      />
    </div>
    <ChannelHeader :date="dynamicTitle" tab-type="total" :store="'Tmall'" />
    <!-- <SWLayoutChange :layoutMode="layoutMode" @layoutModeChange="layoutModeChange" /> -->
    <div style="height: 16px"></div>
    <PayTotal ref="payTotalRef" v-if="layoutMode === 0" />
    <PayTotalTable ref="payTotalRef" v-if="layoutMode === 1" v-loading="loading" />
    <el-button
      class="exportImg"
      :loading="imgExporting"
      type="primary"
      @click="exportImg('SW天猫店品类付费总和')"
    >
      导出图片
    </el-button>
  </div>
  <div
    class="exportableBg"
    ref="imgExportRef"
    id="imgExportRef"
    :style="{ width: '100%', height: `${imgExportHeight}px` }"
  >
    <div ref="exportImgMainRef">
      <ChannelHeader :date="dynamicTitle" tab-type="total" :store="'Tmall'" />
      <PayTotal ref="exportPayTotalRef" v-if="layoutMode === 0" />
      <PayTotalTable ref="exportPayTotalRef" v-if="layoutMode === 1" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
import BITopDateFilter from '@/components/common/TopDateFilter/index.vue'
import ChannelHeader from '../components/header.vue'
import PayTotal from '../components/payTotal.vue'
import PayTotalTable from '../components/payTotalTable.vue'
import * as ChannelDataApi from '@/api/channelData'
import {
  imgExportRef,
  imgExportHeight,
  exportImgMainRef,
  imgExporting,
  exportImg,
  handleDynamicTitle
} from '../hooks/usePayTopTen'

defineOptions({ name: 'TmallPayTotal' })

const props = defineProps({
  store: propTypes.string.def('') // 店铺
})

const layoutMode = ref(1) // 0 列表模式  1 表格
// const layoutModeChange = (mode: any) => {
//   layoutMode.value = mode
//   getList()
// }

const loading = ref(true) // 列表的加载中
const totalList = ref<any[]>([]) // 列表的数据

const queryParams = reactive({
  startDate: '',
  endDate: '',
  store: props.store || 'swTmall'
})
// 获取默认日期
const getDefaultDate = async () => {
  const data = await ChannelDataApi.getDefaultDate({ ...queryParams, type: '2' }).catch(() => {})
  return data ? [data, data] : []
}

// 动态标题
const dynamicTitle = computed(() => {
  return handleDynamicTitle(selectDate.value)
})

const selectDate = ref<any>([])
// 选择日期
const sendDateSelect = (dateRange: Array<string>) => {
  selectDate.value = dateRange
  getList()
}

const payTotalRef = ref()
const exportPayTotalRef = ref()

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    if (selectDate.value && selectDate.value.length >= 2) {
      queryParams.startDate = selectDate.value[0] || ''
      queryParams.endDate = selectDate.value[1] || ''
    }

    const data = await ChannelDataApi.getCategoryPayList(queryParams).catch(
      () => (loading.value = false)
    )
    loading.value = false
    totalList.value = data || []
    payTotalRef.value?.initTotalData(totalList.value)
    exportPayTotalRef.value?.initTotalData(totalList.value)
  } finally {
    loading.value = false
  }
}

/** 初始化 **/
onMounted(async () => {
  layoutMode.value = 1
  selectDate.value = await getDefaultDate()
})
</script>

<style lang="scss" scoped>
@use '../style/index.scss';
</style>
