<template>
  <div class="OTRPdf">
    <div class="mainContainer" v-if="pdfDetail">
      <ElScrollbar id="OTRPdf">
        <page1 class="pdfPage" :data="pdfDetail" />
        <page2 class="pdfPage" :data="pdfDetail" />
        <page3 class="pdfPage" :data="pdfDetail" :onlyShowMyself="onlyShowMyself" />
        <page4 class="pdfPage" :data="pdfDetail" :onlyShowMyself="onlyShowMyself" />
        <page6
          class="pdfPage6"
          :style="{ height: `${page6Height}px` }"
          :data="pdfDetail"
          :onlyShowMyself="onlyShowMyself"
          @updatePage6Height="updatePage6Height"
        />
      </ElScrollbar>
    </div>
  </div>

  <div class="ShowOTRPdf" v-if="pdfBlobUrl">
    <PdfPreview
      page-scale="page-fit"
      width="'100%'"
      height="100%"
      :src="pdfBlobUrl"
      @loaded="pdfOnLoaded"
    />
  </div>
</template>

<script lang="ts" setup>
import { htmlToPdf } from '@/utils/htmlToPdf.js'

import PdfPreview from './components/PdfPreview.vue'

import page1 from './components/page1.vue'
import page2 from './components/page2.vue'
import page3 from './components/page3.vue'
import page4 from './components/page4.vue'
import page6 from './components/page6.vue'

import * as InventoryCalibrationApi from '@/api/otr/InventoryCalibration'

defineOptions({ name: 'OTRPdf' })

const route = useRoute()
const inventoryId = route.query.inventoryId || ''
const appraiseeId = route.query.appraiseeId || ''
const onlyShowMyself = route.query.onlyShowMyself || false

const page6Height = ref(842)
const updatePage6Height = (height: number) => {
  if (height < 842) {
    page6Height.value = 842
  } else {
    if (height % 842 === 0) {
      page6Height.value = height
    } else {
      page6Height.value = Math.ceil(height / 842.0) * 842
    }
  }
}

onMounted(() => {
  getPdfDetail()
})
const loadingInstance = ref()

const pdfDetail = ref()
const getPdfDetail = async () => {
  loadingInstance.value = ElLoading.service({ fullscreen: true, text: '数据加载中' })
  const data = await InventoryCalibrationApi.otrQueryPdfInfo({ inventoryId, appraiseeId })
  if (data) {
    pdfDetail.value = data || {}
    setTimeout(() => {
      exportToPdf()
    }, 100)
  }
}

const pdfBlobUrl = ref()
const exportToPdf = async () => {
  //OTR 上传pdf文件的 bussinessCode
  const data = await htmlToPdf('人才盘点报表', '#OTRPdf', false).catch((err) => {
    if (loadingInstance.value) {
      loadingInstance.value.close()
    }
  })
  if (data) {
    pdfBlobUrl.value = data
  } else {
    loadingInstance.value.close()
  }
}

// pdf加载完成
const pdfOnLoaded = () => {
  if (loadingInstance.value) {
    loadingInstance.value.close()
  }
}
</script>

<style lang="scss" scoped>
.OTRPdf {
  position: fixed;
  top: 20000px;
  // top: 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #e9f2fb;

  .mainContainer {
    width: 595px;
    height: 100vh;
    overflow: auto;
    background: #e9f2fb;

    .pdfPage {
      width: calc(100%);
      height: 842px;
    }

    .pdfPage6 {
      width: calc(100%);
      min-height: 842px;
      background: #e9f2fb;
    }
  }
}

.ShowOTRPdf {
  width: 100%;
  height: 100%;
  background: #e9f2fb;
}
</style>
