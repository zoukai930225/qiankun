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
    <div>
      <ChannelHeader :date="dynamicTitle" :store="'Tmall'" />

      <SWLayoutChange :layoutMode="layoutMode" @layout-mode-change="layoutModeChange" />

      <CommonTable :list="list" :loading="loading" :border="layoutMode == 0 ? false : true" />
    </div>
    <el-button
      class="exportImg"
      :loading="imgExporting"
      type="primary"
      @click="exportImg('SW天猫店付费前十')"
      >导出图片</el-button
    >
  </div>

  <div class="exportableBg" ref="imgExportRef" id="imgExportRef">
    <div :style="{ height: `${imgExportHeight}px` }">
      <div ref="exportImgMainRef">
        <ChannelHeader :date="dynamicTitle" :store="'Tmall'" />
        <CommonTable
          :list="list"
          :border="layoutMode == 0 ? false : true"
          :loading="loading"
          :exportImg="true"
          :imgBase64Dict="imgBase64Dict"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'

import BITopDateFilter from '@/components/common/TopDateFilter/index.vue'
import CommonTable from '../components/commonTable.vue'

import ChannelHeader from '../components/header.vue'

import * as ChannelDataApi from '@/api/channelData'

import {
  imgExportRef,
  imgExportHeight,
  exportImgMainRef,
  imgExporting,
  exportImg,
  imgBase64Dict,
  imageToBase64,
  handleDynamicTitle
} from '../hooks/usePayTopTen'

defineOptions({ name: 'TmallData' })

const props = defineProps({
  store: propTypes.string.def('') // 店铺
})
const loading = ref(true) // 列表的加载中
const list = ref<any[]>([]) // 列表的数据

const layoutMode = ref(1) // 0 列表模式  1 表格
const layoutModeChange = (mode: any) => {
  layoutMode.value = mode
  getList()
}

const queryParams = reactive({
  startDate: '',
  endDate: '',
  store: props.store || 'swTmall'
})

// 获取默认日期
const getDefaultDate = async () => {
  const data = await ChannelDataApi.getDefaultDate({ ...queryParams, type: '1' }).catch(() => {})
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

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    if (selectDate.value && selectDate.value.length >= 2) {
      queryParams.startDate = selectDate.value[0] || ''
      queryParams.endDate = selectDate.value[1] || ''
    }
    const data = await ChannelDataApi.getPlatformList(queryParams)
    list.value = data || []
    list.value.forEach((item: any, index) => {
      item.rankNo = index + 1
    })
    handleImgToBase64()
    loading.value = false
  } finally {
    loading.value = false
  }
}

const handleImgToBase64 = () => {
  list.value.forEach((item) => {
    if (item.goodsImage) {
      imageToBase64(item.goodsImage)
    }
  })
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
