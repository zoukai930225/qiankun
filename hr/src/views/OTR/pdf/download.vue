<template>
  <div class="DownloadOTRPdf">
    <div class="mainContainer" v-if="pdfDetail">
      <ElScrollbar id="DownloadOTRPdf">
        <page1 class="pdfPage" :data="pdfDetail" />
        <page2 class="pdfPage" :data="pdfDetail" />
        <page3 class="pdfPage" :data="pdfDetail" />
        <page4 class="pdfPage" :data="pdfDetail" />
        <page6 class="pdfPage" :data="pdfDetail" />
      </ElScrollbar>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { htmlToPdf } from '@/utils/htmlToPdf.js'
import page1 from './components/page1.vue'
import page2 from './components/page2.vue'
import page3 from './components/page3.vue'
import page4 from './components/page4.vue'
import page6 from './components/page6.vue'

import * as InventoryCalibrationApi from '@/api/otr/InventoryCalibration'

const pdfDetail = ref()

const inventoryId = ref('')
const appraiseeId = ref('')
const pdfTitle = ref('')
const downloadPdf = async (param: any) => {
  inventoryId.value = param.inventoryId || ''
  appraiseeId.value = param.appraiseeId || ''
  pdfTitle.value = param.title || ''
  const data = await InventoryCalibrationApi.otrQueryPdfInfo({
    inventoryId: inventoryId.value,
    appraiseeId: appraiseeId.value
  }).catch((err) => {
    emit('downloadComplete', {
      status: 'fail',
      inventoryId: inventoryId.value,
      appraiseeId: appraiseeId.value
    })
  })
  if (data) {
    pdfDetail.value = data || {}
    setTimeout(() => {
      exportToPdf()
    })
  } else {
    emit('downloadComplete', {
      status: 'fail',
      inventoryId: inventoryId.value,
      appraiseeId: appraiseeId.value
    })
  }
}

const exportToPdf = async () => {
  //OTR 上传pdf文件的 bussinessCode
  const data = await htmlToPdf(pdfTitle.value, '#DownloadOTRPdf', true).catch((err) => {
    emit('downloadComplete', {
      status: 'fail',
      inventoryId: inventoryId.value,
      appraiseeId: appraiseeId.value
    })
  })
  if (data && data === 'downloadSuccess') {
    emit('downloadComplete', {
      status: 'success',
      inventoryId: inventoryId.value,
      appraiseeId: appraiseeId.value
    })
  } else {
    emit('downloadComplete', {
      status: 'fail',
      inventoryId: inventoryId.value,
      appraiseeId: appraiseeId.value
    })
  }
}
defineExpose({ downloadPdf })
const emit = defineEmits(['downloadComplete'])
</script>

<style lang="scss" scoped>
.DownloadOTRPdf {
  position: fixed;
  top: 20000px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .mainContainer {
    width: 595px;
    height: calc(842px * 5);
    .pdfPage {
      width: calc(100%);
      height: 842px;
    }
  }
}
</style>
