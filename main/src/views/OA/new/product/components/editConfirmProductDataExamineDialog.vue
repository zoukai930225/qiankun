<template>
  <div>
    <SWDrawer
      v-if="visible"
      v-model="visible"
      :title="title"
      :showBottom="false"
      @close="handleClose"
    >
      <div style="overflow: auto; height: calc(100% - 20px)">
        <div class="dialog-content">
          <div class="operation">
            <FormTitle
              title="运营信息"
              :is-show-expand="true"
              :is-expand="operationIsExpand"
              @expand-click="operationIsExpand = !operationIsExpand"
            />
            <div v-show="operationIsExpand">
              <OperationForm :is-edit="false" :data="operationData" :erpInfo="erpInfo" />
            </div>
            <div v-show="!operationIsExpand">
              <el-form
                label-width="100px"
                ref="formDetailRef"
                :model="localForm"
                style="display: flex; flex-wrap: wrap; padding-top: 15px"
              >
                <el-form-item label="下单明细" prop="npPrenatalSampleInfoList" style="width: 100%">
                  <el-descriptions :column="2" border v-if="
                      erpInfo?.npPrenatalSampleInfoList &&
                      erpInfo?.npPrenatalSampleInfoList.length > 0
                    ">
                    <el-descriptions-item v-for="(value, index) in erpInfo.npPrenatalSampleInfoList"
                      :key="index"
                      :label="`${value.skuName}(${value.skuCode})`"
                      label-align="center"
                      align="left"
                      label-class-name="item-title"
                      class-name="item-value"
                      label-width="234px"
                      :width="(erpInfo.npPrenatalSampleInfoList.length % 2 === 1 && index === erpInfo.npPrenatalSampleInfoList.length -1) ? '534px' : '150px'"
                      :span="(erpInfo.npPrenatalSampleInfoList.length % 2 === 1 && index === erpInfo.npPrenatalSampleInfoList.length -1) ? 2 : 1"
                    >
                      {{  value.orderQuantity }}
                    </el-descriptions-item>
                    <el-descriptions-item
                      label="合计"
                      label-align="center"
                      align="left"
                      label-class-name="item-title"
                      class-name="item-value"
                      label-width="234px"
                      width="534px"
                      :span="2"
                    >
                      {{  erpInfo?.totalOrderQuantity || 0 }}
                    </el-descriptions-item>
                  </el-descriptions>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <FormTitle title="定品资料" />
          <el-form
            ref="formRef"
            :model="localForm"
            style="display: flex; flex-wrap: wrap; padding-top: 15px"
          >
            <el-form-item
              label="设计图"
              prop="productPicture"
              :style="{ width: oneFormItemWidth, marginRight: '0px' }"
              label-width="100px"
            >
              <div v-if="localForm.productPicture" style="display: flex; flex-wrap: wrap">
                <div v-for="(item, index) in localForm.productPicture.split(',')" :key="index">
                  <el-image
                    class="showImage"
                    :src="item"
                    :preview-src-list="[item]"
                    :preview-teleported="true"
                  />
                </div>
              </div>
              <div v-else style="color: #666666">暂无图片</div>
            </el-form-item>
            <el-form-item
              label="样衣图"
              prop="samplePicture"
              :style="{ width: oneFormItemWidth, marginRight: '0px' }"
              label-width="100px"
            >
              <div v-if="localForm.samplePicture" style="display: flex; flex-wrap: wrap">
                <div v-for="(item, index) in localForm.samplePicture.split(',')" :key="index">
                  <el-image
                    class="showImage"
                    :src="item"
                    :preview-src-list="[item]"
                    :preview-teleported="true"
                  />
                </div>
              </div>
              <div v-else style="color: #666666">暂无图片</div>
            </el-form-item>
            <el-form-item
              label="选品理由"
              prop="chooseReason"
              :style="{ width: '870px', marginRight: '0px' }"
              label-width="100px"
            >
              <div class="valueBg text1" :style="{ width: '760px' }">{{
                localForm.chooseReason
              }}</div>
            </el-form-item>
            <el-form-item
              label="金额"
              prop="amount"
              :style="{ width: oneFormItemWidth, marginRight: '0px' }"
              label-width="100px"
            >
              <div class="row-center" :style="{ width: '748px' }">
                <div class="valueBg text1" :style="{ width: '312px' }">{{ localForm.amount }}</div>
                <el-tooltip effect="dark" content="首单数量*（裸货成本+包装人工费）">
                  <img
                    src="@/assets/imgs/title_tips.svg"
                    style="width: 13px; height: 13px; margin-left: 4px"
                  />
                </el-tooltip>
              </div>
            </el-form-item>
            <el-form-item
              label="裸货价"
              prop="productCostExcludingTax"
              :style="{ width: oneFormItemWidth, marginRight: '0px' }"
              label-width="100px"
            >
              <div class="valueBg text1" :style="{ width: oneValueItemWidth }">{{
                localForm.productCostExcludingTax
              }}</div>
            </el-form-item>
            <el-form-item
              label="包装人工费"
              prop="packagingManpowerNew"
              :style="{ width: oneFormItemWidth, marginRight: '0px' }"
              label-width="100px"
            >
              <div class="valueBg text1" :style="{ width: oneValueItemWidth }">{{
                localForm.packagingManpowerNew
              }}</div>
            </el-form-item>
            <el-form-item
              label="首单数量"
              prop="firstOrderQuantity"
              :style="{ width: oneFormItemWidth, marginRight: '0px' }"
              label-width="100px"
            >
              <div class="valueBg text1" :style="{ width: oneValueItemWidth }">{{
                localForm.firstOrderQuantity
              }}</div>
            </el-form-item>
            <el-form-item
              label="产品品类"
              prop="category"
              :style="{ width: oneFormItemWidth, marginRight: '0px' }"
              label-width="100px"
            >
              <div class="valueBg text1" :style="{ width: oneValueItemWidth }">{{
                formatCategory(localForm.category)
              }}</div>
            </el-form-item>
            <el-form-item
              label="预估月销量"
              prop="monthCount"
              :style="{ width: oneFormItemWidth, marginRight: '0px' }"
              label-width="100px"
            >
              <div class="valueBg text1" :style="{ width: oneValueItemWidth }">{{
                localForm.monthCount
              }}</div>
            </el-form-item>
            <el-form-item
              label="预估季度销量"
              prop="seasonCount"
              :style="{ width: oneFormItemWidth, marginRight: '0px' }"
              style="margin-left: 20px"
              label-width="80px"
            >
              <div class="valueBg text1" :style="{ width: '330px' }">{{
                localForm.seasonCount
              }}</div>
            </el-form-item>
            <el-form-item
              label="包装图片"
              prop="packagePicture"
              :style="{ width: oneFormItemWidth, marginRight: '10px' }"
              label-width="100px"
            >
              <div v-if="localForm.packagePicture" style="display: flex; flex-wrap: wrap">
                <div v-for="(item, index) in localForm.packagePicture.split(',')" :key="index">
                  <el-image
                    class="showImage"
                    :src="item"
                    :preview-src-list="[item]"
                    :preview-teleported="true"
                  />
                </div>
              </div>
              <div v-else style="color: #666666">暂无图片</div>
            </el-form-item>
            <el-form-item
              label="包装流程图片"
              prop="packageProgressPicture"
              :style="{ width: oneFormItemWidth, marginRight: '0px' }"
              style="margin-left: -8px"
              label-width="100px"
            >
              <div v-if="localForm.packageProgressPicture" style="display: flex; flex-wrap: wrap">
                <div
                  v-for="(item, index) in localForm.packageProgressPicture.split(',')"
                  :key="index"
                >
                  <el-image
                    class="showImage"
                    :src="item"
                    :preview-src-list="[item]"
                    :preview-teleported="true"
                  />
                </div>
              </div>
              <div v-else style="color: #666666">暂无图片</div>
            </el-form-item>
            <el-form-item
              label="定品资料下载"
              :style="{ width: oneFormItemWidth, marginRight: '0px' }"
              style="margin-left: 20px"
              label-width="80px"
            >
              <el-button
                :loading="downloadIng"
                style="
                  height: 32px;
                  width: 100px;
                  border-radius: 4px;
                  background: #0064ff;
                  border: none;
                  font-size: 14px;
                  font-weight: normal;
                  line-height: 18px;
                  letter-spacing: 0px;
                  color: #ffffff;
                "
                @click="confirmDialog"
              >
                <div class="row-center" style="margin-left: -12px">
                  <img
                    style="width: 14px; height: 14px; margin-right: 6px; margin-left: 12px"
                    src="@/assets/imgs/fileDownload.svg"
                  />
                  定品资料
                </div>
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </SWDrawer>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import { DICT_TYPE, getDictLabel } from '@/utils/dict'
import { planProductInfoExport } from '@/api/oa/new/plan/index'
import { useCategoryList } from '@/views/OA/new/product/hooks'

import download from '@/utils/download'
import { getConfirmProductInfo, getErpInfo } from '@/api/oa/new/designGallery/index'
import { debounce } from 'lodash-es'

import FormTitle from './formComponents/formTitle.vue'
import OperationForm from './formComponents/operationForm.vue'
const operationIsExpand = ref(false)
import { getNewPlanlOperaionDetail } from '@/api/oa/new/develop'
const operationData = ref()
const getOperationData = async () => {
  getNewPlanlOperaionDetail(nodeData.value.npDesignPictureGodownId).then((res: any) => {
    if (res) {
      operationData.value = res || {}
      if (operationData.value.salesTargetDismantling) {
        operationData.value.salesTargetDismantling = operationData.value.salesTargetDismantling
          .split(',')
          .map((item) => {
            let array = item.split('?name=')
            return {
              name: array[1],
              url: array[0]
            }
          })
      }
      if (operationData.value.skuPackagePicture) {
        operationData.value.skuPackagePicture = operationData.value.skuPackagePicture
          .split(',')
          .map((item) => {
            let array = item.split('?name=')
            return {
              name: array[1],
              url: array[0]
            }
          })
      }
    }
  })
}

const erpInfo = ref({ npPrenatalSampleInfoList: [] })
// 获取ERP信息
const getErpDetailInfo = async () => {
  const res = await getErpInfo(nodeData.value.npDesignPictureGodownId) //回显详情
  if (res) {
    erpInfo.value = { ...res }
    erpInfo.value.npPrenatalSampleInfoList = erpInfo.value.npPrenatalSampleInfoList || []
  }
}

const { categoryList } = useCategoryList()

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: '868px'
  },
  isAudit: {
    type: Boolean,
    required: false
  },
  forbidEdit: {
    type: Boolean,
    default: false
  }
})

const dialogWidth = ref('868px')

const oneFormItemWidth = ref('430px')
const oneValueItemWidth = ref('340px')

const emit = defineEmits(['update:modelValue', 'confirm', 'close'])
const visible = ref(false)
const nodeData = ref<any>({})

const localForm = ref<any>({})

// 打开
const open = async (data: any) => {
  visible.value = true
  operationIsExpand.value = false
  if (data) {
    nodeData.value = { ...data }
    dialogWidth.value = '936px'
    getConfirmProductDetail()
    getOperationData()
    getErpDetailInfo()
  }
}

const getConfirmProductDetail = async () => {
  const res = await getConfirmProductInfo(nodeData.value.npDesignPictureGodownId)
  localForm.value = res || {}
}

defineExpose({ open })

onMounted(() => {})

const handleClose = () => {
  visible.value = false
  emit('close')
}

const formatCategory = (category) => {
  if (!category || !categoryList.value || categoryList.value.length == 0) return ''
  const result = categoryList.value.find((item) => item.code == category)
  return result ? result.name : ''
}

const confirmDialog = debounce(async () => {
  dpFileDownload()
})

const downloadIng = ref(false)
// 定品资料下载
const dpFileDownload = async () => {
  try {
    downloadIng.value = true
    const data = await planProductInfoExport(nodeData.value.npDesignPictureGodownId).catch(
      (err: {}) => {
        console.log(err)
      }
    )
    if (data) {
      download.excel(data, '定品资料.xlsx')
    }
  } finally {
    downloadIng.value = false
  }
}
</script>

<style lang="scss" scoped>
:deep(.el-drawer__body) {
  padding: 20px !important;
}

.dialog-content {
  background: #ffffff;
  border-radius: 8px;
  min-height: calc(100% - 20px);
  padding: 10px;

  .valueBg {
    padding-left: 12px;
    padding-right: 12px;
    background: #f8f8f9;
    box-sizing: border-box;
    border: 1px solid #e5e5e5;
    height: 32px;
    border-radius: 4px;
  }

  .showImage {
    width: 110px;
    height: 110px;
    border-radius: 10px;
    margin-right: 8px;
    margin-bottom: 8px;
    vertical-align: middle;
  }
}

:deep(.el-form-item--default .el-form-item__label) {
  line-height: 20px;
  text-align: right;
  display: flex;
  align-items: center;
  padding-left: 0px;

  font-size: 14px;
  font-weight: normal;
  line-height: normal;
  text-align: right;
  letter-spacing: normal;
}
</style>

<style lang="scss" scoped>
// .orderDetailBg {
//   // width: 758px;
//   display: flex;
//   flex-wrap: wrap;
// }

// .item {
//   width: calc(50% - 1px);
//   display: flex;
//   flex-direction: row;
//   align-items: center;
// }

// .item-left {
//   width: 379px;
// }

// .item-titleBg {
//   width: 234px;
//   height: 45px;
//   padding-left: 16px;
//   padding-right: 16px;
//   background: #f4f6fa;
//   border: 1px solid #e5e5e5;
//   border-right: none;
//   border-bottom: none;
//   border-left: none;
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
// }

// .item-titleBg1 {
//   border-top: none;
// }

// .item-valueBg {
//   height: 45px;
//   width: 145px;
//   background: #ffffff;
//   border: 1px solid #e5e5e5;
//   border-right: none;
//   border-bottom: none;
//   display: flex;
//   flex-direction: row;
//   align-items: center;
// }

// .item-valueBg1 {
//   border-top: none;
// }

// .item-valueBg2 {
//   border-right: 1px solid #e5e5e5;
// }

:deep(.item-title) {
  font-size: 14px;
  font-weight: 400 !important;
  background: #f4f6fa !important;
 color: #666666 !important;
  line-height: 22px;
}

:deep(.item-value) {
  color: #333333 !important; 
  // text-align: left !important;
}
</style>
