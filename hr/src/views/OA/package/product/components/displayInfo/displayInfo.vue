<template>
  <div ref="displayInfoRef" style="
      background: #ffffff;
      margin-right: 0px;
      padding-right: 10px;
      overflow: auto;
      overflow-x: hidden;
    ">
    <div class="display-info">
      <div>
        <div class="display-info-wrap" ref="scrollableDiv"
          style="overflow-x: hidden; overflow-y: hidden; padding-right: 10px">
          <div style="display: flex; flex-direction: row">
            <div class="leftInfo" style="width: 229px">
              <formTitle title="文档资料" mtStyle="0px" />
              <NodeLeftInfo :data="designDetail?.leftAreaFilesVo" />
            </div>
            <div style="width: 1px; height: auto; background: #eceaea"></div>
            <div class="rightInfo">
              <!-- 负责人信息 -->
              <formTitle title="负责人信息" mtStyle="0px">
                <template #default>
                  <PersonInChargeInformation :reviewDetail="designDetail?.pcManagerVo"
                    :productCode="designDetail?.packageInfoVo?.productCode"
                    :fullCompany="designDetail?.pcSupplierVo?.fullCompany" />
                </template>
              </formTitle>
              <!-- 企划信息 -->
              <formTitle title="企划信息" :showcollapse="true">
                <template #default>
                  <PlanningInformation :reviewDetail="designDetail?.productPlanEnterprisePlanVo" />
                </template>
              </formTitle>
              <!-- 品类信息 -->
              <formTitle title="品类信息" :showcollapse="true">
                <template #default>
                  <CategoryInformation :reviewDetail="designDetail?.categoryInformationVo" />
                </template>
              </formTitle>
              <!-- 打样进度 -->
              <formTitle title="打样进度" :showcollapse="true">
                <template #default>
                  <ProofingProgress :reviewDetail="designDetail?.designGalleryVo" />
                </template>
                <template #btn>
                  <el-button type="primary" @click="handleProofingProgress">打样进度详情</el-button>
                </template>
              </formTitle>
              <!-- 报价核价 -->
              <formTitle title="报价核价" :showcollapse="true">
                <template #default>
                  <QuotationVerification :reviewDetail="designDetail?.pcSupplierVo" />
                </template>
              </formTitle>
              <!-- 基本资料信息 -->
              <formTitle title="基本资料信息" :showcollapse="true">
                <template #default>
                  <BasicInformation :reviewDetail="designDetail?.packageInfoVo" />
                </template>
              </formTitle>

              <!-- 采购信息填写 -->
              <formTitle title="采购计划信息" :showcollapse="true">
                <template #default>
                  <FillInPurchasingInformation :data="designDetail?.procurementDetailVo" />
                </template>
              </formTitle>
            </div>
          </div>
        </div>
        <div style="height: 20px"></div>
      </div>
    </div>
    <DayangProgressDialogNew ref="dayangProgresDialogNewVisible" @confirm="handleConfirm" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import formTitle from './formTitle.vue'

import NodeLeftInfo from './nodeLeftInfo.vue'

import BasicInformation from './basicInformation.vue'
import CategoryInformation from './categoryInformation.vue'
import FillInPurchasingInformation from './fillInPurchasingInformation.vue'
import PersonInChargeInformation from './personInChargeInformation.vue'
import PlanningInformation from './planningInformation.vue'
import ProofingProgress from './proofingProgress.vue'
import QuotationVerification from './quotationVerification.vue'
// import DayangProgressDialogNew from './dayangProgressDialogNew.vue'
import DayangProgressDialogNew from '../../../designGallery/components/dayangProgressDialogNew.vue'

import {
  // getDesignBasicInfo,
  // getSupplierList
  getProductDetailById
} from '@/api/oa/package/designGallery/index'

import { useDicList } from '@/views/OA/new/designGallery/hooks.js'

const currentRowData = ref({})

const { dicList } = useDicList()
const listDic = ref([])
watch(dicList, (newVal) => {
  // @ts-ignore
  listDic.value = newVal || []
})

const dayangProgresDialogNewVisible = ref()
const handleProofingProgress = () => {
  // 打开打样进度详情弹窗
  console.log('打开打样进度详情弹窗', currentRowData.value)
  dayangProgresDialogNewVisible.value.open({
    ...currentRowData.value,
    series: reviewDetail.value?.series,
    seriesRemark: reviewDetail.value?.seriesRemark,
    planName: reviewDetail.value?.planName,
    category: reviewDetail.value?.category,
    classCode: reviewDetail.value?.classCode,
    productPictureUrl: reviewDetail.value?.productPicture,
    salePoint: reviewDetail.value?.salePoint,
    productType: reviewDetail.value?.productType,
    planningTime: reviewDetail.value?.planningTime
  })
}

// 滚动
const scrollableDiv = ref()

const handleConfirm = () => {
  refreshData()
}

const props = defineProps({
  rowData: {
    type: Object,
    default: () => { }
  },
  progressContentHeight: {
    type: Number,
    default: 0
  },
  nodeList: {
    type: Array,
    default: () => []
  },
  otherFiles: {
    type: Array,
    default: () => []
  }
})

// 监听props变化
watch(
  () => props.rowData,
  (newVal) => {
    currentRowData.value = newVal
    if (currentRowData.value) {
    }
  },
  {
    immediate: true
  }
)

// 企划信息
const reviewDetail = ref() //预览信息

// 设计图信息
const designDetail = ref() //设计图详情
const editGoodInfoRef = ref()
const getDesignDetail = async (id) => {
  const res = await getProductDetailById(id) //回显详情
  console.log('设计图详情', res)
  designDetail.value = res
  if (designDetail.value) {
    reviewDetail.value = {
      ...currentRowData.value,
      series: res.categoryInformationVo?.series,
      seriesRemark: res?.categoryInformationVo.seriesRemark,
      planName: res.productPlanEnterprisePlanVo?.planName,
      category: designDetail.value?.category,
      classCode: reviewDetail.value?.classCode,
      productPicture: res.designGalleryVo?.productPictureUrl,
      salePoint: reviewDetail.value?.salePoint,
      productType: reviewDetail.value?.productType,
      planningTime: `${res?.productPlanEnterprisePlanVo?.planStartTime || ''} ~ ${res?.productPlanEnterprisePlanVo?.planEndTime || ''}`,
      productCode: res?.packageInfoVo?.productCode
    }
    setTimeout(() => {
      editGoodInfoRef.value?.open(reviewDetail.value)
    }, 100)
  }
}

const displayInfoRef = ref()
const displayInfoWidth = ref(1200.0)
const resizeHandler = () => {
  displayInfoWidth.value = displayInfoRef?.value?.clientWidth || 1200.0
  if (displayInfoWidth.value < 1200) {
    displayInfoWidth.value = 1200
  }
}

onMounted(async () => {
  await getDesignDetail(currentRowData.value.productPlanId)

  window.addEventListener('resize', resizeHandler)
  resizeHandler()
})
const refreshData = async () => {
  await getDesignDetail(currentRowData.value.productPlanId)
}

// 获取设计信息
const getDesignInfo = () => {
  return reviewDetail.value || {}
}

defineExpose({
  refreshData,
  getDesignInfo
})
</script>

<style lang="scss" scoped>
.display-info-wrap {
  width: calc(100%);
}

.leftInfo {
  width: 249px;
  margin-top: -14px;
}

.rightInfo {
  width: calc(100% - 249px);
  margin-left: 20px;
  margin-top: -16px;
}

.display-info {
  position: relative;
}
</style>
