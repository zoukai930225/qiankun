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
    <ChannelHeader :date="dynamicTitle" tab-type="total" :store="'PDD'" />
    <div style="height: 16px"></div>
    <pddPayTotalTable ref="payTotalRef" :store="'PDD'" v-loading="loading" />
    <el-button
      class="exportImg"
      :loading="imgExporting"
      type="primary"
      @click="exportImg('SW拼多多店铺付费总和')"
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
      <ChannelHeader :date="dynamicTitle" tab-type="total" :store="'PDD'" />
      <pddPayTotalTable ref="exportPayTotalRef" :store="'PDD'" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
import BITopDateFilter from '@/components/common/TopDateFilter/index.vue'
import ChannelHeader from '../components/header.vue'
import pddPayTotalTable from '../components/pddPayTotalTable.vue'
import * as ChannelDataApi from '@/api/channelData'
import {
  imgExportRef,
  imgExportHeight,
  exportImgMainRef,
  imgExporting,
  exportImg,
  handleDynamicTitle
} from '../hooks/usePayTopTen'

defineOptions({ name: 'PDDPayTotal' })

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
  channel: props.store || 'Pdd'
})
// 获取默认日期
const getDefaultDate = async () => {
  const data = await ChannelDataApi.getPddDefaultDate({ ...queryParams, type: '2' }).catch(() => {})
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

    const data = await ChannelDataApi.getStorePayList(queryParams).catch(
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
