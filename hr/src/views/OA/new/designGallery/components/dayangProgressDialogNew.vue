<!--
 * @Date: 2025-07-12 10:59:18
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
                <div class="desc-item">
                  <span class="item">{{
                    currentDetail?.productType == 0
                      ? '买手款'
                      : currentDetail?.productType == 1
                        ? '定制款'
                        : ''
                  }}</span>
                </div>
              </div>
              <div class="title-right flex-row">
                <img src="@/assets/imgs/oa/time-icon.png" alt="" class="time-icon" />
                <span class="time"> {{ currentDetail?.planningTime }}</span>
                <!-- 收起 展开 -->
                <div class="more">
                  <div class="more-text-wapper" @click="showMore = !showMore">
                    <span class="more-text"> {{ showMore ? '收起' : '展开' }} </span>
                    <img src="@/assets/imgs/oa/showClose.png" class="icon" v-if="showMore" />
                    <img src="@/assets/imgs/oa/showMore.png" class="icon" v-else />
                  </div>
                </div>
              </div>
            </div>
            <div class="top-content flex-row" v-show="showMore">
              <!-- 左侧内容 -->
              <div class="left-column">
                <div class="flex-row">
                  <div class="form-item pinlei">
                    <span class="label item-title">品类</span>
                    <span class="value half-value">{{
                      (currentDetail?.category &&
                        getNameByCode &&
                        getNameByCode[currentDetail?.category]) ||
                      ''
                    }}</span>
                  </div>
                  <div class="form-item pinlei">
                    <span class="label item-title">系列</span>
                    <span class="value half-value">{{ currentDetail?.classCode }}</span>
                  </div>
                </div>
                <div class="form-item" style="margin-top: 10px">
                  <span class="label item-title">品类卖点</span>
                  <span class="value text-area">
                    <el-popover placement="bottom" :width="200" trigger="hover"
                      :disabled="getIsSalePointOverflow(currentDetail?.salePoint)">
                      <div>
                        <ElScrollbar max-height="300px">
                          <div v-html="currentDetail?.salePoint"></div>
                        </ElScrollbar>
                      </div>
                      <template #reference>
                        <div class="detail-content-row-item-value" style="max-width: 88%">{{
                          getDisplaySalePoint(currentDetail?.salePoint)
                          }}</div>
                      </template>
                    </el-popover>
                  </span>
                </div>
              </div>
              <!-- 右侧图片 -->
              <div class="right-column">
                <el-image :src="formatOnePic(currentDetail?.productPicture) ||
                  'https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/newProduct/default_design.png'
                  " class="preview-image" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2" :preview-src-list="[
                    formatOnePic(currentDetail?.productPicture) ||
                    'https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/newProduct/default_design.png'
                  ]" show-progress :initial-index="4" fit="cover" />
              </div>
            </div>
          </div>
          <!-- 内容 -->
          <div class="dialog-content-top dialog-content-detail" :class="{ 'dialog-content-detail-hidden': !showMore }">
            <div class="common-title">
              <div class="title-left flex-row">
                <span class="desc"></span>
                <span class="title">进度详情</span>
                <div class="desc-item flex-row">
                  <img src="@/assets/imgs/oa/error-icon.png" class="error-img" alt="" />
                  <span class="error-desc">关于试穿结果(通过，不通过)请通过下方按钮操作来推动新品流程!</span>
                </div>
              </div>
              <div class="title-right flex-row">
                <el-select v-model="stateType" placeholder="请选择状态" style="width: 168px; height: 32px" clearable
                  @clear="selectClear" @change="selectChange">
                  <el-option v-for="item in selectOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </div>
            </div>
            <!--  -->
            <ElScrollbar>
              <div class="flex-row supplier-steps">
                <div v-for="(item, index) in supplierList" :key="item.id">
                  <SupplierStep :title="item.supplierName" showClose @close="handleSupplierAClose" :item="item"
                    :pictureId="currentDetail.id" :index="index" :showMore="showMore" :stateType="stateType"
                    :total="supplierList.length" :productType="currentDetail?.productType" @success="handleSuccess">
                    <template #footer>
                      <div v-if="
                        item.displayEliminationBtn ||
                        item.displayTrialResultBtn ||
                        item.displayQuotePriceBtn ||
                        item.displayColorSampleBtn ||
                        item.displayQaExamineBtn ||
                        item.displayReUploadBtn
                      " style="
                          padding: 10px;
                          box-sizing: border-box;
                          display: flex;
                          justify-content: space-between;
                          border-top: 1px dashed #cdcdcd;
                          width: calc(100%);
                        ">
                        <el-button :icon="Refresh" @click="disuse(item)"
                          v-if="item.displayEliminationBtn">淘汰供应商</el-button>
                        <el-button @click="confirmResult(item)" :icon="CircleCheck" type="primary"
                          v-if="item.displayTrialResultBtn">试穿样审核</el-button>
                        <el-button @click="baojia(item)" type="primary" v-if="item.displayQuotePriceBtn">
                          <i class="baojia-icon"></i> 报价核价</el-button>
                        <el-button @click="uploadColors(item)" :icon="Upload" type="primary"
                          v-if="item.displayColorSampleBtn">齐色样审核</el-button>
                        <el-button @click="audtiAction(item)" type="primary"
                          v-if="item.displayQaExamineBtn">QA审核</el-button>
                        <el-button @click="reUploadAction(item)" type="primary"
                          v-if="item.displayReUploadBtn">重新上传</el-button>
                      </div>
                      <div v-else style="height: 12px"></div>
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
    <!-- 试穿结果确认 -->
    <TryItOnResult ref="tryItOnResultRef" @success="handleSuccess" />
    <!-- 报价核价 -->
    <QuotationVerification ref="quotationVerificationRef" @success="handleSuccess" />
    <!-- 齐色样上传 -->
    <UploadColorSamples ref="uploadColorSamplesRef" :supplierList="selectSupplierList" @success="handleSuccess" />
    <!-- 审核 -->
    <AuditDialog ref="auditRef" :productType="currentDetail?.productType" @success="handleSuccess" />
    <!-- 重新上传 -->
    <ReUploadDialog ref="reUploadRef" @success="handleSuccess" />
    <!-- 淘汰供应商 -->
    <DisuseSupplier ref="disuseSupplierRef" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" setup>
import { getSampleProgressDetail } from '@/api/oa/new/designGallery/index'
import { useCategoryConfig } from '@/views/OA/new/designGallery/hooks'
import { CircleCheck, Refresh, Tickets, Upload } from '@element-plus/icons-vue'
import { defineProps } from 'vue'
import DisuseSupplier from './progressDialogComponents/disuseSupplier.vue'
import QuotationVerification from './progressDialogComponents/quotationVerification.vue'
import TryItOnResult from './progressDialogComponents/tryItOnResult.vue'
import UploadColorSamples from './progressDialogComponents/uploadColorSamples.vue'
import AuditDialog from './progressDialogComponents/auditDialog.vue'
import ReUploadDialog from './progressDialogComponents/reUploadDialog.vue'
import SupplierStep from './SupplierStep.vue'
const { getNameByCode } = useCategoryConfig()

const props = defineProps({
  title: {
    type: String,
    default: '打样进度'
  }
})

const showMore = ref(false)

//确认试穿结果逻辑
const tryItOnResultRef = ref()
const confirmResult = (item) => {
  console.log('确认试穿结果', item)
  tryItOnResultRef.value.open({ ...item, category: currentDetail.value.category })
}
// 报价核价
const quotationVerificationRef = ref()
const baojia = (item) => {
  // 报价核价逻辑
  console.log('报价核价')
  quotationVerificationRef.value.open(item)
}

// 齐色样上传
const uploadColorSamplesRef = ref()
const uploadColors = (item) => {
  // 齐色样上传逻辑
  console.log('齐色样上传')
  uploadColorSamplesRef.value.open({
    ...item,
    npPictureId: currentDetail.value.id
  })
}
//淘汰供应商
const disuseSupplierRef = ref()
const disuse = (item) => {
  console.log('淘汰供应商', item)
  disuseSupplierRef.value.open(item)
}

//审核
const auditRef = ref()
const audtiAction = (item) => {
  auditRef.value.open(item)
}

//重新上传
const reUploadRef = ref()
const reUploadAction = (item) => {
  reUploadRef.value.open(item)
}

const handleSupplierAClose = () => {
  console.log('供应商A关闭')
}

const handleSupplierBClose = () => {
  console.log('供应商B关闭')
}

const selectClear = () => {
  stateType.value = undefined
  initDetail()
}

const selectChange = (value: string) => {
  stateType.value = value
  initDetail()
}

const stateType = ref('6') // 选中状态
const selectOptions = ref([
  { label: '流程中', value: '6' },
  { label: '已淘汰', value: '5' }
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
  console.log('操作成功，重新获取详情')
  initDetail()
}

const initDetail = async () => {
  const params = {
    pictureId: currentDetail.value.fromProgress || currentDetail.value.id,
    flowStatus: stateType.value
  }
  const res = await getSampleProgressDetail(params)
  supplierList.value = res || []
  //TODO 测试数据
  // supplierList.value.forEach((item) => {
  //   item.displayReUploadBtn = true
  //   item.npSupplierAuditRecordList.forEach((item1, index) => {
  //     if (index === 0) {
  //       item1.flowStatus = 2
  //       item1.operateStatus = 4

  //     }
  //   })
  // })
  selectSupplierList.value = res.filter((item) => item.supplierId !== '999' && item.flowStatus < 5) // 过滤掉供应商ID为999的项
}

defineExpose({ open })

onMounted(() => { })

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
  // overflow-y: hidden;
  background: #f8f8f9;

  .dialog-content-top {
    background: white;
    // margin-top: 10px;

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
          font-family: PingFang SC;
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
          font-family: PingFang SC;
          font-size: 14px;
          font-variation-settings: 'opsz' auto;
          /* 文字/一级 */
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
            box-sizing: border-box;
            /* 应用/边框 */
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
          /* 文字/一级 */
          color: #333333;
          margin-right: 8px;
        }

        .text-area {
          flex-direction: column;
          padding: 8px 10px 8px 12px;
          gap: 10px;
          background: #f8f8f9;
          box-sizing: border-box;
          /* 应用/边框 */
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

  .dialog-content-detail-hidden {
    max-height: calc(100vh - 348px + 150px);
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

.more {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 20px;

  .mid {
    flex: 1;
    height: 1px;
    background: #ebeef5;
  }

  .more-text-wapper {
    display: flex;
    align-items: center;

    .more-text {
      cursor: pointer;
      font-weight: 400;
      font-size: 14px;
      color: #0064ff;
      margin-right: 6px;
    }

    .icon {
      width: 8px;
      height: 6px;
      cursor: pointer;
    }
  }
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

.baojia-icon {
  display: inline-block;
  width: 14px;
  height: 14px;
  background: url('@/assets/imgs/oa/oa_dayang_progress_price.svg') center no-repeat;
  background-size: contain;
  margin-right: 4px;
  align-items: center;
  vertical-align: middle;
}
</style>
