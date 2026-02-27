<!--
 * @Date: 2025-07-12 10:59:18
 package
-->
<template>
  <div>
    <SWDrawer v-if="visible" v-model="visible" :title="title" @close="handleClose">
      <div>
        <div class="dialog-content">
          <div class="dialog-content-top">
            <div class="common-title">
              <div class="title-left flex-row">
                <span class="desc"></span>
                <span class="title">{{ currentDetail?.planName }}</span>
              </div>
              <div class="title-right flex-row">
                <img src="@/assets/imgs/oa/time-icon.png" alt="" class="time-icon" />
                <span class="time"> {{ currentDetail?.planningTime }}</span>
              </div>
            </div>
            <div class="top-content flex-row">
              <!-- 左侧内容 -->
              <div class="left-column">
                <div class="flex-row">
                  <div class="form-item pinlei">
                    <span class="label item-title">系列</span>
                    <span class="value half-value">{{ currentDetail?.series }}</span>
                  </div>
                </div>
                <div class="form-item" style="margin-top: 10px">
                  <span class="label item-title">系列备注</span>
                  <span class="value text-area">
                    <el-popover
                      placement="bottom"
                      :width="200"
                      trigger="hover"
                      :disabled="getIsSalePointOverflow(currentDetail?.seriesRemark)"
                    >
                      <div>
                        <ElScrollbar max-height="300px">
                          <div v-html="currentDetail?.seriesRemark"></div>
                        </ElScrollbar>
                      </div>
                      <template #reference>
                        <div class="detail-content-row-item-value" style="max-width: 88%">{{
                          getDisplaySalePoint(currentDetail?.seriesRemark)
                        }}</div>
                      </template>
                    </el-popover>
                  </span>
                </div>
              </div>
              <!-- 右侧图片 -->
              <div class="right-column">
                <el-image
                  :src="formatOnePic(currentDetail?.productPictureUrl) || defaultPicture"
                  class="preview-image"
                  :zoom-rate="1.2"
                  :max-scale="7"
                  :min-scale="0.2"
                  :preview-src-list="[
                    formatOnePic(currentDetail?.productPictureUrl) || defaultPicture
                  ]"
                  show-progress
                  :initial-index="4"
                  fit="cover"
                />
              </div>
            </div>
          </div>
          <!-- 内容 -->
          <div class="dialog-content-top dialog-content-detail">
            <div class="common-title">
              <div class="title-left flex-row">
                <span class="desc"></span>
                <span class="title">进度详情</span>
                <div class="desc-item flex-row">
                  <img src="@/assets/imgs/oa/error-icon.png" class="error-img" alt="" />
                  <span class="error-desc"
                    >关于打样结果(通过，不通过)请通过下方按钮操作来推动新品流程!</span
                  >
                </div>
              </div>
              <div class="title-right flex-row">
                <el-select
                  v-model="stateType"
                  placeholder="请选择状态"
                  style="width: 168px; height: 32px"
                  clearable
                  @clear="selectClear"
                  @change="selectChange"
                >
                  <el-option
                    v-for="item in selectOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
            </div>
            <!--  -->
            <ElScrollbar>
              <div class="flex-row supplier-steps">
                <div v-for="(item, index) in supplierList" :key="item.id">
                  <SupplierStep
                    :title="item.supplierName"
                    showClose
                    :item="item"
                    :pictureId="currentDetail.id"
                    @success="handleSuccess"
                    :index="index"
                    :total="supplierList.length"
                  >
                    <template #footer>
                      <div
                        v-if="
                          item.displayEliminationBtn ||
                          item.displayTrialResultBtn ||
                          item.displayQuotePriceBtn ||
                          item.displayColorSampleBtn
                        "
                        style="
                          padding: 10px;
                          box-sizing: border-box;
                          display: flex;
                          justify-content: space-between;
                          border-top: 1px dashed #cdcdcd;
                          width: calc(100%);
                        "
                      >
                        <el-button
                          :icon="Refresh"
                          @click="disuse(item)"
                          v-if="item.displayEliminationBtn"
                          >淘汰供应商</el-button
                        >
                        <el-button
                          @click="confirmResult(item)"
                          :icon="CircleCheck"
                          type="primary"
                          v-if="item.displayTrialResultBtn"
                          >打样结果确认</el-button
                        >
                        <el-button
                          @click="baojia(item)"
                          :icon="Tickets"
                          type="primary"
                          v-if="item.displayQuotePriceBtn"
                          >报价核价</el-button
                        >
                        <el-button
                          @click="uploadColors(item)"
                          :icon="Upload"
                          type="primary"
                          v-if="item.displayColorSampleBtn"
                          >齐色样上传</el-button
                        >
                      </div>
                    </template>
                  </SupplierStep>
                </div>

                <div class="flex-column empty" v-if="supplierList?.length === 0">
                  <img class="empty-table" src="@/assets/imgs/promotion/empty.png" alt="" />
                  <span>暂无数据</span>
                </div>
              </div>
            </ElScrollbar>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="handleClose">关闭</el-button>
        <div style="width: 20px"></div>
      </template>
    </SWDrawer>
    <!-- 打样结果确认 -->
    <TryItOnResult ref="tryItOnResultRef" @success="handleSuccess" />
    <!-- 报价核价 -->
    <QuotationVerification ref="quotationVerificationRef" @success="handleSuccess" />
    <!-- 齐色样上传 -->
    <UploadColorSamples
      ref="uploadColorSamplesRef"
      :supplierList="selectSupplierList"
      @success="handleSuccess"
    />
    <!-- 淘汰供应商 -->
    <DisuseSupplier ref="disuseSupplierRef" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" setup>
const defaultPicture =
  'https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/newProduct/default_design.png'
import { getSampleProgressDetail } from '@/api/oa/package/designGallery/index'
import { CircleCheck, Refresh, Tickets, Upload } from '@element-plus/icons-vue'
import { defineProps } from 'vue'
import DisuseSupplier from './progressDialogComponents/disuseSupplier.vue'
import QuotationVerification from './progressDialogComponents/quotationVerification.vue'
import TryItOnResult from './progressDialogComponents/tryItOnResult.vue'
import UploadColorSamples from './progressDialogComponents/uploadColorSamples.vue'
import SupplierStep from './SupplierStep.vue'

defineProps({
  title: {
    type: String,
    default: '打样进度'
  }
})

//确认打样结果逻辑
const tryItOnResultRef = ref()
const confirmResult = (item) => {
  tryItOnResultRef.value.open(item)
}
// 报价核价
const quotationVerificationRef = ref()
const baojia = (item) => {
  // 报价核价逻辑
  quotationVerificationRef.value.open(item)
}

// 齐色样上传
const uploadColorSamplesRef = ref()
const uploadColors = (item) => {
  // 齐色样上传逻辑
  uploadColorSamplesRef.value.open({
    ...item,
    npPictureId: currentDetail.value.id
  })
}
//淘汰供应商
const disuseSupplierRef = ref()
const disuse = (item) => {
  disuseSupplierRef.value.open(item)
}

const selectClear = () => {
  // @ts-ignore
  stateType.value = undefined
  initDetail()
}

const selectChange = (value: string) => {
  stateType.value = value
  initDetail()
}

const stateType = ref('1') // 选中状态
const selectOptions = ref([
  { label: '流程中', value: '1' },
  { label: '已淘汰', value: '0' }
])

const emit = defineEmits(['confirm', 'close'])
const visible = ref(false)

const currentDetail = ref() //当前操作对象
const supplierList = ref<any>([]) // 供应商列表
const selectSupplierList = ref([]) // 选中的供应商列表
// 打开
const open = async (item: any) => {
  visible.value = true
  currentDetail.value = item

  initDetail()
}

const handleSuccess = () => {
  initDetail()
}

const initDetail = async () => {
  const params = {
    designGalleryId: currentDetail.value.fromProgress || currentDetail.value.designGalleryId,
    inProgress: stateType.value == '1'
  }
  const res = await getSampleProgressDetail(params)
  supplierList.value = res || []
  selectSupplierList.value = res.filter((item) => item.supplierId !== '999' && item.flowStatus < 5) // 过滤掉供应商ID为999的项
}

defineExpose({ open })

onMounted(() => {})

const handleClose = () => {
  visible.value = false
  emit('confirm')
}

// 是否展示品类卖点
const getPlainText = (html) => {
  if (!html) return '【--】'
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html
  return (tempDiv.textContent || tempDiv.innerText || '').trim()
}
// 截断显示的方法
const getDisplaySalePoint = (salePoint) => {
  const plainText = getPlainText(salePoint)
  const maxLength = 40
  return plainText.length <= maxLength ? plainText : plainText.slice(0, maxLength) + '...'
}

// 是否溢出的方法
const getIsSalePointOverflow = (salePoint) => {
  const plainText = getPlainText(salePoint)
  const maxLength = 40
  return plainText.length < maxLength
}

const formatOnePic = (url) => {
  if (url) {
    return `${url.split(',')[0]}?x-oss-process=image/quality,q_50`
  }
  return ''
}
</script>

<style lang="scss" scoped>
.dialog-content {
  border-radius: 8px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  background: #f8f8f9;

  .dialog-content-top {
    background: white;

    .common-title {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 16px 20px;
      box-sizing: border-box;
      /* 应用/分割线 */
      border-width: 0px 0px 1px 0px;
      border-style: solid;
      border-color: #f0f0f0;

      .title-left {
        flex: 1;

        .desc {
          width: 3px;
          height: 10px;
          background: #0064ff;
          margin-right: 6px;
        }

        .title {
          font-size: 14px;
          font-weight: 600;
          line-height: 20px;
          font-variation-settings: 'opsz' auto;
          color: #333333;
          margin-right: 20px;
        }

        .desc-item {
          .item {
            height: 25px;
            border-radius: 2.12px;
            line-height: 25px;
            background: rgba(253, 230, 176, 0.5108);
            padding: 4px 10px;
            box-sizing: border-box;
            color: #c68b00;
            font-size: 12px;
            margin-right: 16px;
          }

          .error-img {
            width: 20px;
            height: 20px;
            margin-right: 16px;
            margin-right: 12px;
          }

          .error-desc {
            font-size: 14px;
            color: #eb3737;
          }
        }
      }

      .title-right {
        .time-icon {
          width: 14px;
          height: 14px;
        }

        .time {
          font-size: 14px;
          font-variation-settings: 'opsz' auto;
          color: #333333;
          margin-left: 10px;
        }
      }
    }

    .top-content {
      .left-column {
        flex: 1;
        margin-top: 10px;

        .form-item {
          display: flex;
          flex-direction: row;
          margin-bottom: 10px;

          .label {
            font-size: 14px;
            font-weight: bold;
            color: #333333;
            margin-right: 10px;
          }

          .value {
            font-size: 14px;
            color: #666666;
            flex: 1;
          }

          .half-value {
            width: 100%;
            height: 36px;
            line-height: 36px;
            background: #f8f8f9;
            border: 1px solid #e5e5e5;
            border-radius: 4px;
            padding: 0 12px;
            box-sizing: border-box;
          }
        }

        .pinlei {
          width: 50%;
          align-items: center;
        }

        .item-title {
          width: 70px;
          font-size: 14px;
          text-align: right;
          font-variation-settings: 'opsz' auto;
          color: #333333;
          margin-right: 8px;
        }

        .text-area {
          flex-direction: column;
          padding: 8px 10px 8px 12px;
          gap: 10px;
          background: #f8f8f9;
          box-sizing: border-box;
          border: 1px solid #e5e5e5;
          height: 72px;
          font-size: 14px;
          color: #666666;
          width: 100%;
        }
      }

      .right-column {
        width: 130px;
        height: 130px;
        margin-left: 20px;
        margin-right: 20px;

        .preview-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 4px;
        }
      }
    }
  }

  .dialog-content-detail {
    max-height: calc(100vh - 348px);
  }
}

.flex-row {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.supplier-steps {
  padding: 14px 20px;
  box-sizing: border-box;
  // align-items: center;
  align-items: flex-start;
  justify-content: space-between;
  // overflow-x: auto; // 改为 auto
}

:deep(.step-footer .el-button) {
  padding: 8px 7px;
}

.flex-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  margin: 60px 0;
}
</style>
