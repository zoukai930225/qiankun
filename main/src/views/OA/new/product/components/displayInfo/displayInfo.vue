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
              <NodeLeftInfo :data="designDetail"
                :isShowConfirmProductDataExamineDownload="isShowConfirmProductDataExamineDownload()"
                :reviewDetail="reviewDetail" :otherFiles="otherFiles" />
            </div>
            <div style="width: 1px; height: auto; background: #eceaea"></div>
            <div class="rightInfo">
              <!-- 负责人信息 -->
              <formTitle title="负责人信息" mtStyle="0px">
                <template #default>
                  <PersonInChargeInformation :data="designDetail" :reviewDetail="reviewDetail" />
                </template>
              </formTitle>
              <!-- 企划信息 -->
              <formTitle title="企划信息" :showcollapse="true">
                <template #default>
                  <PlanningInformation :data="designDetail" :reviewDetail="reviewDetail" />
                </template>
              </formTitle>
              <!-- 品类信息 -->
              <formTitle title="品类信息" :showcollapse="true">
                <template #default>
                  <CategoryInformation :data="designDetail" :reviewDetail="reviewDetail" />
                </template>
              </formTitle>
              <!-- 打样进度 -->
              <formTitle title="打样进度" :showcollapse="true">
                <template #default>
                  <ProofingProgress :data="designDetail" :reviewDetail="reviewDetail" />
                </template>
                <template #btn>
                  <el-button type="primary" @click="handleProofingProgress">打样进度详情</el-button>
                </template>
              </formTitle>
              <!-- 报价核价 -->
              <formTitle title="报价核价" :showcollapse="true">
                <template #default>
                  <QuotationVerification :data="designDetail" :reviewDetail="reviewDetail" />
                </template>
              </formTitle>
              <!-- 基本资料信息 -->
              <formTitle title="基本资料信息" :showcollapse="true">
                <template #default>
                  <BasicInformation :data="designDetail" :reviewDetail="reviewDetail" />
                </template>
              </formTitle>
              <!-- 资质资料信息 -->
              <formTitle title="资质资料信息" :showcollapse="true">
                <template #default>
                  <QualificationInformation :data="designDetail" :reviewDetail="reviewDetail" />
                </template>
              </formTitle>
              <!-- 运营信息填写 -->
              <formTitle title="运营信息填写" :showcollapse="true">
                <template #default>
                  <InfoTable :data="designDetail" :reviewDetail="planlOperaionDetal" />
                </template>
              </formTitle>
              <!-- 下单明细 -->
               <formTitle title="下单明细" :showcollapse="true">
                <template #default>
                  <NpPrenatalSampleInfoList :data="designDetail" :reviewDetail="planlOperaionDetal" />
                </template>
                 <template #btn>
                  <el-button type="primary" @click.stop="exportSkuInfoList">导出下单明细</el-button>
                </template>
              </formTitle>
              <!-- 采购信息填写 -->
              <formTitle title="采购信息填写" :showcollapse="true">
                <template #default>
                  <FillInPurchasingInformation :data="designDetail" :reviewDetail="reviewDetail" />
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
import InfoTable from './InfoTable.vue'
import PersonInChargeInformation from './personInChargeInformation.vue'
import PlanningInformation from './planningInformation.vue'
import ProofingProgress from './proofingProgress.vue'
import QualificationInformation from './qualificationInformation.vue'
import QuotationVerification from './quotationVerification.vue'
// import DayangProgressDialogNew from './dayangProgressDialogNew.vue'
import DayangProgressDialogNew from '../../../designGallery/components/dayangProgressDialogNew.vue'
import NpPrenatalSampleInfoList from './npPrenatalSampleInfoList.vue'

import {
  getDesignBasicInfo,
  getDesignDetailById,
  getSupplierList,
  exportSkuInfo
} from '@/api/oa/new/designGallery/index'
import { getBasicAttribute } from '@/api/oa/new/plan/index'
import { useCategoryList } from '@/views/OA/new/product/hooks'
import { getNewPlanlOperaionDetail } from '@/api/oa/new/develop'
import { useDicList } from '@/views/OA/new/designGallery/hooks.js'
import { getErpInfo } from '@/api/oa/new/designGallery/index'
import download from '@/utils/download'

const currentRowData = ref({})
const emit = defineEmits(['finishedErpNode'])
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
    planName: reviewDetail.value?.planName,
    category: designDetail.value?.category,
    classCode: reviewDetail.value?.classCode,
    productPicture: designDetail.value?.productPicture,
    salePoint: reviewDetail.value?.salePoint,
    productType: reviewDetail.value?.productType
  })
}

// 滚动
const isScrollingToTop = ref(false) // 初始状态为滚动到底部
const scrollableDiv = ref()
const scrollToTarget = () => {
  if (scrollableDiv.value) {
    const scrollContainer = scrollableDiv.value.wrapRef
    if (scrollContainer) {
      const scrollPosition = isScrollingToTop.value ? 0 : scrollContainer.scrollHeight
      scrollContainer.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
      })
      isScrollingToTop.value = !isScrollingToTop.value // 切换滚动方向状态
    }
  }
}

const handleConfirm = () => {
  refreshData()
}

// 导出下单明细
const exportSkuInfoList = ()=>{
  if(reviewDetail.value?.npDesignPictureGodownId){
    const loadingInstance = ElLoading.service({ lock:true,text:"数据导出中，请稍等..." })
    const npDesignPictureGodownId = reviewDetail.value?.npDesignPictureGodownId
    exportSkuInfo({npDesignPictureGodownId}).then((res:any)=>{
      download.excel(res, '下单明细汇总表.xlsx')
      loadingInstance.close()
    }).catch(()=>{
      loadingInstance.close()
    })
  }
  
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
// 根据节点状态判断当前模块是否展示 status 1 表示已结束
const isShow = (nodeCode) => {
  const { nodeList } = props
  const result = nodeList.find((item) => item.nodeCode === nodeCode)
  return result ? result.status === '1' : false
}

const isShowConfirmProductDataExamineDownload = () => {
  let isShow = false
  props.nodeList.forEach((item) => {
    if (item.nodeCode === 'ConfirmProductDataExamine') {
      // 定品资料审核
      if (Number(item.status) === 1) {
        isShow = true
      }
    }
  })
  return isShow
}

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

const tooltipVisible = ref({}) //控制每个tooltip的显示状态

// 企划信息
const reviewDetail = ref() //预览信息
const getReviewDetail = async (id) => {
  const params = {
    devPlanId: id
  }
  const res = await getDesignBasicInfo(params)
  if (res) {
    reviewDetail.value = res || {}

    // 处理回显
    if (reviewDetail.value.marketAnalysis) {
      marketAnalysis.value = reviewDetail.value.marketAnalysis.split(',').map((item) => {
        let array = item.split('?name=')
        return {
          name: array[1],
          url: array[0]
        }
      })
    }

    if (reviewDetail.value?.demandAnalysis) {
      demandAnalysis.value = reviewDetail.value.demandAnalysis.split(',').map((item) => {
        let array = item.split('?name=')
        return {
          name: array[1],
          url: array[0]
        }
      })
    }
  }
  console.log('reviewDetail', reviewDetail.value)
}

const planlOperaionDetal = ref()
const getNewPlanlOperaionDetailReq = async (id) => {
  const res = await getNewPlanlOperaionDetail(id)
  if (res) {
    planlOperaionDetal.value = res || {}
  }
  const res1 = await getErpInfo(id)
  if (res1) {
    if (!planlOperaionDetal.value) {
      planlOperaionDetal.value = { npPrenatalSampleInfoList: [] }
    }
  }
  planlOperaionDetal.value.npPrenatalSampleInfoList = res1.npPrenatalSampleInfoList || []
}

const getErpDetailInfo = async (id) => {
  const res = await getErpInfo(id)
  if (res) {
    planlOperaionDetal.value = res || {}
  }
}

const marketAnalysis = () => {
  if (reviewDetail.value && reviewDetail.value.marketAnalysis) {
    return (
      reviewDetail.value.marketAnalysis.split(',').map((item) => {
        let array = item.split('?name=')
        return {
          name: array[1],
          url: array[0]
        }
      }) || []
    )
  }
  return []
}

const demandAnalysis = () => {
  if (reviewDetail.value && reviewDetail.value.demandAnalysis) {
    return (
      reviewDetail.value.demandAnalysis.split(',').map((item) => {
        let array = item.split('?name=')
        return {
          name: array[1],
          url: array[0]
        }
      }) || []
    )
  }
  return []
}

// 品类
const { categoryList } = useCategoryList()

// 获取供应商名称下拉列表
const supplierOptions = ref([])
const getSupplierOptions = async () => {
  const data = await getSupplierList().catch(() => { })
  supplierOptions.value = data || []
}

// 设计图信息
const designDetail = ref() //设计图详情
const editGoodInfoRef = ref()
const getDesignDetail = async (id) => {
  const res = await getDesignDetailById(id) //回显详情
  designDetail.value = res
  if (designDetail.value) {
    reviewDetail.value.npDesignPictureGodownId = id
    emit('finishedErpNode', designDetail.value.finishedErpNode || false)
    setTimeout(() => {
      editGoodInfoRef.value?.open(reviewDetail.value)
    }, 100)
  }
}
const productPictureList = computed(() => {
  if (!designDetail.value?.productPicture) return []
  return designDetail.value?.productPicture?.split(',') || []
})

const samplePictureList = computed(() => {
  if (!designDetail.value?.samplePicture) return []
  return designDetail.value?.samplePicture?.split(',') || []
})

const sampleProgressList = computed(() => {
  if (!designDetail.value?.sampleProgressList) return []
  return JSON.parse(designDetail.value?.sampleProgressList) || []
})

const fields = ref([]) // 配置列表

// 获取配置
const getConfig = async () => {
  const params = {
    code: 'DesignGallery'
  }
  const res = await getBasicAttribute(params)
  console.log('第三方接口KJL', res)
  if (res && res.length > 0) {
    let extraList = []
    fields.value = [...extraList, ...res] || []
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

const planInfoItemWidth = () => {
  return 76 + planInfoInputWidth()
}
const planInfoInputWidth = () => {
  return (displayInfoWidth.value - 223 - 320 - planInfoReamrkWidth()) / 3.0
}

const planInfoReamrkWidth = () => {
  return displayInfoWidth.value * 0.135
}

const planInfoDesignWidth = () => {
  return (displayInfoWidth.value - 290) / 2.0
}

const yunyingInfoInputWidth = () => {
  return (displayInfoWidth.value - 223 - 400) / 3.0
}

const yunyingInfoRemarkWidth = () => {
  return displayInfoWidth.value - 385
}
const jingpinItemWidth = () => {
  return (displayInfoWidth.value - 290) / 2.0
}
onMounted(async () => {
  await getConfig()
  await getSupplierOptions()
  await getReviewDetail(currentRowData.value.developmentPlanId)
  await getNewPlanlOperaionDetailReq(currentRowData.value.id)
  await getDesignDetail(currentRowData.value.id)

  window.addEventListener('resize', resizeHandler)
  resizeHandler()
})
const refreshData = async () => {
  await getReviewDetail(currentRowData.value.developmentPlanId)
  await getDesignDetail(currentRowData.value.id)
  await getNewPlanlOperaionDetailReq(currentRowData.value.id)
}
//获取产品类型
const getPlanType = () => {
  if (reviewDetail.value) {
    return reviewDetail.value.planType
  }
  return ''
}

// 获取原产品编码
const getOldGoodsNo = () => {
  if (reviewDetail.value) {
    return reviewDetail.value.oldGoodsNo
  }
  return ''
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
