<template>
  <div class="exportBg" ref="imgExportRef" id="imgExportRef">
    <div class="exportBgMain">
      <div :style="{ height: 'auto' }">
        <div ref="exportImgMainRef">
          <div style="height: 15px"></div>
          <div v-for="(value, index) in list" :key="index">
            <div class="basicInfo">
              <div class="basicInfo-item" style="width: 280px">
                <div class="basicInfo-item-title">店铺名称</div>
                <div class="basicInfo-item-content">{{ value.storeName }}</div>
              </div>
              <div class="basicInfo-line"></div>
              <div class="basicInfo-item" style="width: 402px">
                <div class="basicInfo-item-title">商品名称</div>
                <div class="basicInfo-item-content">{{ value.goodsName }}</div>
              </div>
              <div class="basicInfo-line"></div>
              <div class="basicInfo-item" style="width: 239px">
                <div class="basicInfo-item-title">商品ID</div>
                <div class="basicInfo-item-content">{{ value.goodsId }}</div>
              </div>
              <div class="basicInfo-line"></div>
              <div class="basicInfo-item" style="width: 239px">
                <div class="basicInfo-item-title">产品编码</div>
                <div class="basicInfo-item-content">{{ value.goodsCode }}</div>
              </div>
            </div>
            <div class="chartDetailTable">
              <el-table
                :header-cell-style="appStore.headerCellStyle"
                :data="value.tableDataVos"
                class="SWCommonTable fixedHeaderTable"
                v-horizontal-scroll="'always'"
                row-class-name="house-hover-row"
              >
                <el-table-column prop="dataDate" label="数据日期" />
                <el-table-column prop="transactionAmount" label="成交金额" />
                <el-table-column prop="preShipmentRefundRate" label="发货前退款率" />
                <el-table-column prop="refundRate" label="退款率" />
                <el-table-column prop="postShipmentRefundRate" label="发货后退款率" />
              </el-table>
            </div>
          </div>
          <div style="height: 15px"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'
import { propTypes } from '@/utils/propTypes'
import html2canvas from 'html2canvas'

const appStore = useAppStore()

const imgExportRef = ref()
const imgExporting = ref(false)

import * as GoodDyCompassApi from '@/api/shop/dyCompass'
const props = defineProps({
  list: propTypes.array.def([])
})

const exportImgClick = async (type) => {
  imgExporting.value = true
  // 使用 html2canvas 将 DOM 转换为图片
  const canvas = await html2canvas(imgExportRef.value, {
    useCORS: true, // 允许跨域加载图片
    backgroundColor: null, // 保持透明背景
    scale: 2, // 放大2倍
    dpi: 30 // 设置DPI为30
  })

  // 将 canvas 转换为 Blob
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((blob) => resolve(blob), 'image/png', 0.9)
  )
  console.log('倒计时付了款', blob)
  if (blob) {
    // 上传到 OSS
    const formData = new FormData()
    formData.append('file', blob, 'target-image.png') // 文件名为 target-image.png
    formData.append('bussinessCode', 'BILLION') // 添加业务参数
    formData.append('type', type) // 添加业务参数

    const response = await GoodDyCompassApi.uploadAndSendDouyinCompass(formData).catch(() => {
      imgExporting.value = false
      emit('completeSendImg')
    }) // 调用上传接口
    console.log('上传成功:', response)
    imgExporting.value = false
    emit('completeSendImg')
  } else {
    imgExporting.value = false
    emit('completeSendImg')
  }
}

const getImgExporting = () => {
  return imgExporting.value
}

const emit = defineEmits(['completeSendImg'])

defineExpose({ exportImgClick, getImgExporting })
</script>

<style lang="scss" scoped>
.exportBg {
  width: calc(1195px);
  background: #ffffff;

  .exportBgMain {
    padding-left: 15px;
    width: calc(1195px - 30px);

    .basicInfo {
      width: calc(1195px - 30px);
      height: 101px;
      background: #f2f6fc;
      display: flex;
      flex-direction: row;

      &-item {
        padding-left: 16px;
        padding-right: 16px;

        &-title {
          padding-top: 16px;
          font-size: 14px;
          color: #666666;
        }

        &-content {
          padding-top: 10px;
          font-size: 14px;
          color: #333333;
          font-weight: 500;
          line-height: 20px;
        }
      }

      &-line {
        margin-top: 16px;
        width: 1px;
        background: #e2eaf6;
        height: 69px;
      }
    }
  }
}

:deep(.el-table__cell) {
  border-left: none !important;
}

:deep(.el-table td.el-table__cell, .el-table th.el-table__cell.is-leaf) {
  border-left: none !important;
}

:deep(.el-table__body tr.house-hover-row:hover > td) {
  background-color: #e6e6e6 !important;
  --el-fill-color-light: ##e6e6e6 !important;
  --el-fill-color-lighter: ##e6e6e6 !important;
}
</style>
