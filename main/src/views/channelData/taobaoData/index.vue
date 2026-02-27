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
      <ChannelHeader :date="dynamicTitle" />

      <SWLayoutChange :layoutMode="layoutMode" @layout-mode-change="layoutModeChange" />

      <CommonTable :list="list" :loading="loading" :border="layoutMode == 0 ? false : true" />
    </div>
    <el-button
      class="exportImg"
      :loading="imgExporting"
      type="primary"
      @click="exportImg('SW淘宝店付费前十')"
    >
      导出图片
    </el-button>
  </div>

  <div class="exportableBg" ref="imgExportRef" id="imgExportRef">
    <div :style="{ height: `${imgExportHeight}px` }">
      <div ref="exportImgMainRef">
        <ChannelHeader :date="dynamicTitle" />
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

defineOptions({ name: 'TaobaoData' })

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
  store: props.store || 'swTaobao'
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

// const imgExportRef = ref()
// const imgExportHeight = ref(0)
// const exportImgMainRef = ref()
// const imgExporting = ref(false)

// // 导出图片
// const exportImg = async () => {
//   imgExporting.value = true
//   imgExportHeight.value = exportImgMainRef.value.clientHeight
//   nextTick(async () => {
//     try {
//       const canvas = await html2canvas(imgExportRef.value)
//       const img = canvas.toDataURL('image/png')
//       // 创建一个a标签模拟点击进行下载
//       const downloadLink = document.createElement('a')
//       downloadLink.id = 'imgDownload'
//       downloadLink.style.display = 'none'
//       downloadLink.href = img
//       downloadLink.download = '付费前十'
//       document.body.appendChild(downloadLink)
//       downloadLink.click()
//       imgExporting.value = false
//     } catch (error) {
//       imgExporting.value = false
//       message.warning('导出图片失败')
//     }
//   })
// }

// const imgBase64Dict = ref({})
// // 获取图片的base64
// const imageToBase64 = async (url: string) => {
//   if (imgBase64Dict[`${url}`]) {
//     return
//   }
//   imgToBase64(url)
//     .then((base64) => {
//       imgBase64Dict.value[`${url}`] = base64
//     })
//     .catch((error) => {
//       console.error(error) // 处理错误
//     })
// }
</script>

<style lang="scss" scoped>
@use '../style/index.scss';
</style>
