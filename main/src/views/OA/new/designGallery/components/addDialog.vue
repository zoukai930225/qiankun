<!--
 * @Date: 2024-12-05 13:54:45
-->
<template>
  <div>
    <SWDrawer v-if="isVisible" v-model="isVisible" :width="936" :title="dialogTitle" @close="reset"
      :close-on-click-modal="openType === 'view' ? true : false">
      <div class="drawer-wapper" style="height: 100%; overflow-x: hidden" v-loading="currentUploadStatus"
        element-loading-text="设计图上传中，请稍候...">
        <div class="content-wapper" v-loading="saveLoading" element-loading-text="正在保存,请稍候...">
          <div>
            <!-- 企划信息 -->
            <PlanDetailForm v-if="planDetailInfo && planDetailInfo.id" :reviewDetail="planDetailInfo"
              :fields="planConfigList" />
            <!-- 品类信息 -->
            <PlanCategoryInfo :list="(planDetailInfo && planDetailInfo.details) || []" />
            <!-- 设计图 -->
            <DesignDetailForm ref="designDetailFormRef" v-model="designForm" :reviewDetail="reviewDetail"
              :openType="openType" @upload-status="getUploadStatus" />
            <!-- 报价核价 -->
            <!-- <QuotationFormData ref="quotationRef" :isEdit="openType !== 'view'" v-if="reviewDetail && Number(reviewDetail.productType) === 0" :params="quotationData"/> -->
          </div>
        </div>
      </div>

      <template #footer>
        <div class="btn-wapper">
          <el-button @click="reset">取消</el-button>
          <el-button type="primary" @click="save" :disabled="currentUploadStatus" :loading="currentUploadStatus"
            v-if="openType !== 'view' && !(designInformationForm?.examineStatus == '2')">保存</el-button>
          <div style="margin-right: 20px"></div>
        </div>
      </template>
    </SWDrawer>
  </div>
</template>

<script lang="ts" setup>
import {
  getDesignBasicInfo,
  getDesignDetailById,
  saveDesign,
  updateDesign,
  queryNpQuoteVerification
} from '@/api/oa/new/designGallery/index'
import { getBasicAttribute, getNpDetail } from '@/api/oa/new/plan/index'
import { formatDate } from '@/utils/formatTime'
import { handleJSONParse } from '@/views/OA/new/product/utils.js'
import { debounce } from 'lodash-es'
import DesignDetailForm from './formComponents/designDetailForm.vue'
import PlanCategoryInfo from './formComponents/planCategoryInfo.vue'
import PlanDetailForm from './formComponents/planDetailForm.vue'
import QuotationFormData from './formComponents/quotationFormData.vue'

const message = useMessage() // 消息弹窗
const isVisible = ref(false)

// 产品编码
const productCodeForm = ref({
  productCode: ''
})

// 设计图
const designForm = ref()
const designDetailFormRef = ref()
// 设计信息
const designInformationForm = ref()

// 定义类型
interface Field { }
const props = defineProps({
  fields: {
    type: Array as PropType<Field[]>,
    default: () => []
  }
})

/** 买手款 新增匹配供应商与报价核价相关 */
const quotationData = ref({
  supplierId: '', 
  matchReason: '',
  physicalQuotePrice: undefined,
  lifeCycle: undefined,
  singleColorOrderQuantity: undefined,
  productCostExcludingTax: undefined,
  productCostIncludingTax: undefined,
  productCost: undefined,
  finishedProductPrice: undefined,
  packagingManpowerNew: 0,
  packagingCostNew: 0,
  quotePriceRemark: undefined,
  attachmentUrl: []
})
const resetQuotationData = ()=>{
  quotationData.value = {
  supplierId: '', 
  matchReason: '',
  physicalQuotePrice: undefined,
  lifeCycle: undefined,
  singleColorOrderQuantity: undefined,
  productCostExcludingTax: undefined,
  productCostIncludingTax: undefined,
  productCost: undefined,
  finishedProductPrice: undefined,
  packagingManpowerNew: 0,
  packagingCostNew: 0,
  quotePriceRemark: undefined,
  attachmentUrl: []
} 
}
const quotationRef = ref()
const handleQuotationData = async ()=>{
  await quotationRef.value?.quotationValidate()
    // return console.log(quotationData.value)
    return {
      ...quotationData.value,
      attachmentUrl:quotationData.value.attachmentUrl.map((file: any) => file.url).join(',')
    }
}
const getQuotationData = async ()=>{
  if(reviewDetail && Number(reviewDetail.value.productType) !== 0)return
  queryNpQuoteVerification({npDesignPictureId:currentId.value}).then((data:any)=>{
    console.log(data)
    if(data&&data.length){
      quotationData.value = {
      ...data[0],
      attachmentUrl:data[0].attachmentUrl? data[0].attachmentUrl.split(',').map((url:any)=>({url})) : [],
      quotePriceRemark:data[0].remark
    }
    }
    
  })
}

/** 买手款 新增匹配供应商与报价核价相关 */

const openType = ref('') // 打开类型 -edit 编辑 -view 查看
const dialogTitle = ref('')
const currentId = ref() // 当前编辑的 id
const currentItem = ref() // 当前编辑的 item
const open = async (item?, type?) => {
  // designForm.value = {}
  reviewDetail.value = {}
  planDetailInfo.value = {}
  isVisible.value = true
  openType.value = type
  currentItem.value = item
  resetQuotationData()
  if (type === 'view') {
    dialogTitle.value = '详情'
  } else if (type === 'edit') {
    dialogTitle.value = '编辑'
  } else {
    dialogTitle.value = '新增'
    currentItem.value.id = ''
  }
  productCodeForm.value = {
    productCode: ''
  }
  currentId.value = ''
  getConfig() //配置文件
  getPlanConfig() //配置文件
  getPlanDetailInfo(item.enterprisePlanId)
  getReviewDetail(item.devPlanId) //review 详情
  
  // 编辑
  if (item.id) {
    currentId.value = item.id
    const res = await getDesignDetailById(item.id) //回显详情
    // console.log('resqq', res)
     getQuotationData()

    designInformationForm.value = {
      ...res,
      color: res.color ? res.color : [], //颜色
      size: res.size ? JSON.parse(res.size) : {}, //尺寸
      washLabel: res.washLabel
        ? res.washLabel.split(',').map((item) => {
          let array = item.split('?name=')
          return {
            name: array.length > 1 ? array[1] : '',
            url: array[0]
          }
        })
        : [], //水洗标识
      tmPicture: res.tmPicture
        ? res.tmPicture.split(',').map((item) => {
          let array = item.split('?name=')
          return {
            name: array.length > 1 ? array[1] : '',
            url: array[0]
          }
        })
        : [] //烫唛照片
    } //设计信息
    productCodeForm.value = {
      //产品编码
      productCode: res.productCode
    }
    // 设计图片
    const design = {
      ...res,
      techniqueUrl: res.techniqueUrl
        ? res.techniqueUrl.split(',').map((item) => {
          let array = item.split('?name=')
          return {
            name: array.length > 1 ? array[1] : '',
            url: array[0]
          }
        })
        : [], //产品图片
      productPicture: res.productPicture
        ? res.productPicture.split(',').map((item) => {
          let array = item.split('?name=')
          return {
            name: array.length > 1 ? array[1] : '',
            url: array[0]
          }
        })
        : []
    }

    if (res && res.examineInfos && typeof res.examineInfos === 'string') {
      design.examineInfos = handleJSONParse(res.examineInfos) || []
    }
    designForm.value = design
  } else {
    designForm.value = {}
    designInformationForm.value = {}
  }
}

const configList = ref([]) // 配置列表
// 获取配置
const getConfig = async () => {
  const params = {
    code: 'DesignGallery'
  }
  const res = await getBasicAttribute(params)
  configList.value = res || []
}

const planConfigList = ref([]) // 配置列表
// 获取配置
const getPlanConfig = async () => {
  const params = {
    code: 'Plan'
  }
  const res = await getBasicAttribute(params)
  planConfigList.value = (res || []).filter((item) => item.state === 1)
}

const reviewDetail = ref() //预览信息
const getReviewDetail = async (id) => {
  const params = {
    devPlanId: id
  }
  const res = await getDesignBasicInfo(params)
  reviewDetail.value = res || {}
  if (res.details && res.details.length > 0) {
    planDetailInfo.value.details = res.details || []
  }
}

const planDetailInfo = ref() // 企划信息
const getPlanDetailInfo = async (id) => {
  const res = await getNpDetail(id)
  planDetailInfo.value = res || {}

  // 处理店铺回显
  if (planDetailInfo.value.store == 'ALL') {
    planDetailInfo.value.store = ''
  }
  // 处理回显
  if (planDetailInfo.value.marketAnalysis) {
    planDetailInfo.value.marketAnalysis = planDetailInfo.value.marketAnalysis
      .split(',')
      .map((item) => {
        let array = item.split('?name=')
        console.log('aaa', array)
        return {
          name: array[1],
          url: array[0]
        }
      })
  }
  if (planDetailInfo.value.demandAnalysis) {
    planDetailInfo.value.demandAnalysis = planDetailInfo.value.demandAnalysis
      .split(',')
      .map((item) => {
        let array = item.split('?name=')
        return {
          name: array[1],
          url: array[0]
        }
      })
  }
  if (planDetailInfo.value.salesTargetDismantling) {
    planDetailInfo.value.salesTargetDismantling = planDetailInfo.value.salesTargetDismantling
      .split(',')
      .map((item) => {
        let array = item.split('?name=')
        return {
          name: array[1],
          url: array[0]
        }
      })
  }
  if (planDetailInfo.value.productDiagramReference) {
    planDetailInfo.value.productDiagramReference = planDetailInfo.value.productDiagramReference
      .split(',')
      .map((item) => {
        let array = item.split('?name=')
        return {
          name: array[1],
          url: array[0]
        }
      })
  }

  if (planDetailInfo.value.productPicture) {
    planDetailInfo.value.productPicture = planDetailInfo.value.productPicture
      .split(',')
      .map((item) => {
        let array = item.split('?name=')
        return {
          name: array[1],
          url: array[0]
        }
      })
  }

  if (planDetailInfo.value.techniqueUrl) {
    planDetailInfo.value.techniqueUrl = planDetailInfo.value.techniqueUrl.split(',').map((item) => {
      let array = item.split('?name=')
      return {
        name: array[1],
        url: array[0]
      }
    })
  }
}

const getCurrentTimeFormatted = () => {
  const now = new Date()
  return formatDate(now.toISOString())
}

const saveLoading = ref(false) // 保存 loading

const currentUploadStatus = ref(false) // 当前上传状态 true表示当前设计图在上传中
const getUploadStatus = (status) => {
  currentUploadStatus.value = status
}

const save = debounce(async () => {
  if (!currentItem.value.id) {
    saveDesignPhoto()
    return
  }
  try {
    // console.log('点保存', designInformationForm.value)
    // if (!designInformationForm.value.component) {
    //   return message.error('请选择面料成分')
    // }
    if (!(await designDetailFormRef.value.formInvalid())) {
      return
    }
    // 买手款匹配供应商 报价核价 校验 直接通过没有编辑
    // const quotationData = await handleQuotationData()
    // console.log(quotationData)

    // 放重复提交
    if(saveLoading.value) return
    saveLoading.value = true

    let washLabel = undefined
    // @ts-ignore
    if (designInformationForm.value?.washLabel) {
      // @ts-ignore
      washLabel = designInformationForm.value.washLabel
        // @ts-ignore
        .map((item) => {
          return item?.response?.data?.ossPath || item.url
        })
        .join(',')
    }

    let tmPicture = undefined
    // @ts-ignore
    if (designInformationForm.value?.tmPicture) {
      // @ts-ignore
      tmPicture = designInformationForm.value.tmPicture
        // @ts-ignore
        .map((item) => {
          return item?.response?.data?.ossPath || item.url
        })
        .join(',')
    }

    // let productPicture = undefined
    // // @ts-ignore
    // if (designForm.value?.productPicture) {
    //   // @ts-ignore
    //   productPicture = designForm.value?.productPicture
    //     // @ts-ignore
    //     .map((item) => {
    //       return (item?.response?.data?.ossPath || item.url) + '?name=' + item.name
    //     })
    //     .join(',')
    // }

    let productPicture = undefined
    if (
      designForm.value &&
      designForm.value.productPicture &&
      designForm.value.productPicture.length > 0
    ) {
      productPicture = designForm.value.productPicture
        .map((item) => {
          return item.name ? (item.url && item.url + '?name=' + item.name) : item.url
        })
        .join(',')
    }

    let techniqueUrl = undefined
    if (
      designForm.value &&
      designForm.value.techniqueUrl &&
      designForm.value.techniqueUrl.length > 0
    ) {
      techniqueUrl = designForm.value.techniqueUrl
        .map((item) => {
          return item.name ? (item.url && item.url + '?name=' + item.name) : item.url
        })
        .join(',')
    }

    // 当前时间
    
    const data = {
      developmentPlanId: currentItem.value.devPlanId, //开发任务id
      enterprisePlanId: reviewDetail.value.npBusinessEnterprisePlanId, //企划id
      planCode: reviewDetail.value.planCode, //任务编号
      ...designInformationForm.value, //设计信息
      ...designForm.value, //设计图
      ...productCodeForm.value, //编码
      washLabel: washLabel, //水洗标识
      tmPicture: tmPicture, //烫唛照片
      productPictureTime: currentId.value
        ? designForm.value?.productPictureTime
        : getCurrentTimeFormatted(), //提交的当前时间
      productPicture: productPicture, //
      techniqueUrl: techniqueUrl
    }

    data.productCode = productCodeForm.value?.productCode
    data.remark = designForm.value?.remark //不知道为啥值会赋丢所以在这里重新赋值一下
    configList.value.forEach((item:any) => {
      // @ts-ignore
      if (item.type === 8) {
        // 人员选择
        const userIds =
          (data[`${item.code}List`] && data[`${item.code}List`].map((item1) => item1.userId)) || []
        data[`${item.code}`] = userIds.join(',')
      }
    })
    if (currentItem.value.id) {
      await updateDesign(data)
      message.success('操作成功')
      emit('success')
      reset()
    } else {
      await saveDesign(data)
      message.success('操作成功')
      emit('success')
      reset()
    }
  } catch (error) {
    console.log('error', error)
  } finally {
    saveLoading.value = false
  }
}, 300)

// 新增设计图
const saveDesignPhoto = async () => {
  console.log('点击舒服了看就看', designForm.value)
  if (designForm.value.designList && designForm.value.designList.length > 0) {
    if (!(await designDetailFormRef.value.formInvalid())) {
      return
    }
    // 买手款匹配供应商 报价核价 校验
    const quotationData = await handleQuotationData()

    let list = [] as any[]

    designForm.value.designList.map((item) => {
      let productPicture = undefined
      if (item.productPicture && item.productPicture.length > 0) {
        productPicture = item.productPicture
          .map((item) => {
            return item.name ? (item.url && item.url + '?name=' + item.name) : item.url
          })
          .join(',')
      }

      let techniqueUrl = undefined
      if (item.techniqueUrl && item.techniqueUrl.length > 0) {
        techniqueUrl = item.techniqueUrl
          .map((item) => {
            return item.name ? (item.url && item.url + '?name=' + item.name) : item.url
          })
          .join(',')
      }

      list.push({
        artworkNumber: item.artworkNumber,
        planCode: reviewDetail.value.planCode,
        productPicture: productPicture,
        techniqueUrl: techniqueUrl,
        remark: item.remark,
        developmentPlanId: currentItem.value.devPlanId,
        enterprisePlanId: reviewDetail.value.npBusinessEnterprisePlanId,
        productPictureTime: currentId.value
          ? designForm.value?.productPictureTime
          : getCurrentTimeFormatted() ,//提
        ...quotationData
      })
    })
    saveLoading.value = true
    try {
      await saveDesign(list)
      message.success('操作成功')
      emit('success')
      reset()
    } catch {
      saveLoading.value = false
    }
  } else {
    message.warning('请上传设计图')
    return
  }
}

const reset = () => {
  isVisible.value = false
  currentId.value = ''
  currentItem.value = {}
  reviewDetail.value = {}
  planDetailInfo.value = {}
  designInformationForm.value = {}
  emit('close')
  designForm.value = {}
}

const emit = defineEmits(['cancle', 'success', 'close'])

const close = () => {
  reset()
  isVisible.value = false
}

defineExpose({ open, close })
</script>

<style lang="scss" scoped>
.drawer-wapper {
  margin-right: -10px;
  padding-right: 10px;
}

.flex-row {
  display: flex;
  flex-direction: row;
}

.btn-wapper {
  display: flex;
  flex-direction: row;
  justify-content: end;
}
</style>
