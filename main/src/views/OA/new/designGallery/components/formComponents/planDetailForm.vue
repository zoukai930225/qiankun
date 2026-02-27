<!--
 * @Date: 2025-02-11 18:11:15
-->
<template>
  <div class="plan-detail" :style="{ paddingBottom: planInfoIsExpand ? '20px' : '0px' }">
    <FormTitle title="企划信息" :is-show-expand="true" :is-expand="planInfoIsExpand"
      @expand-click="planInfoIsExpand = !planInfoIsExpand" />
    <div v-show="planInfoIsExpand">
      <el-form :inline="true" ref="formRef" style="width: calc(100% + 30px)">
        <div class="flex-row form-wapper" style="flex-wrap: wrap; width: 100%; display: flex; flex: 1">
          <div v-for="(field, index) in newFields()" :key="index">
            <div v-if="isShowField(field)" :style="{ width: `${itemWidth}px` }">
              <el-form-item :label="field.name ? `${field.name}` : ''" label-width="78px" :prop="field.code"
                :style="{ width: `${itemWidth}px` }">
                <!-- 店铺 -->
                <StoreRangePlus v-if="field.type === 9" :style="{ width: `${inputWidth}px` }"
                  v-model="formInline[field.code]" :showAllChannels="true" :placeholder="field.placeholder"
                  :width="inputWidth" :disabled="isAduit" />

                <!-- 企划时间 -->
                <div v-if="field.code === 'planningTime'" :style="{ width: `${inputWidth}px` }"
                  class="planningTimeDatePicker">
                  <!-- <el-date-picker :style="{ width: `${inputWidth - 10}px` }" v-model="formInline[field.code]"
                    type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                    :disabled="isAduit" /> -->
                  <el-tooltip effect="dark" :content="formInline[field.code]" placement="top">
                    <el-input v-model="formInline[field.code]" disabled :style="{ width: `${inputWidth}px` }" />
                  </el-tooltip>
                </div>

                <!-- 运营负责人 -->
                <div v-if="field.code === 'operateManageId'">
                  <SWSelectPeople :placeholder="'请选择运营负责人'" :style="{ width: `${inputWidth}px` }"
                    :isEdit="!isAduit" :multiple="true" v-model:modelValue="formInline.operateManageId" />
                </div>

                <!-- 计划上架月份-->
                <!-- <el-date-picker v-if="field.code === 'planListDate'" v-model="formInline[field.code]" type="date"
                  :style="{ width: `${inputWidth}px` }" :value-format="'YYYY-MM-DD'" placeholder="请选择计划上架日期"
                  :disabled="isAduit" /> -->
                <el-input v-if="field.code === 'planListDate'" prefix-icon="Calendar"
                  v-model="(formInline as any).planListDate" placeholder="请选择计划上架日期" disabled
                  :style="{ width: `${inputWidth}px` }" />

                <s-text-area v-if="field.code === 'remark'" v-model="formInline[field.code]"
                  :placeholder="field.placeholder" style="width: 740px" :autosize="{ minRows: 3, maxRows: 3 }"
                  :disabled="isAduit" />
                <div :style="{ width: `${inputWidth}px` }" v-if="field.code === 'oldGoodsNo'">
                  <el-select v-model="formInline[field.code]" :placeholder="field.placeholder"
                    :style="{ width: `${inputWidth}px` }" filterable :disabled="isAduit">
                    <el-option v-for="(dict, index) in [
                      { label: formInline.oldGoodsNo, value: formInline.oldGoodsNo }
                    ]" :key="index" :label="dict.label" :value="dict.value" />
                  </el-select>
                </div>

                <el-radio-group v-if="field.code === 'isCreateGoodsNo'" v-model="formInline.isCreateGoodsNo"
                  :disabled="isAduit">
                  <el-radio :value="1">是</el-radio>
                  <el-radio :value="0">否</el-radio>
                </el-radio-group>

                <div v-if="field.code === 'empytLayout'" :style="{ width: `${inputWidth}px` }"></div>
                <component v-if="
                  ![
                    'remark',
                    'planListDate',
                    'empytLayout',
                    'oldGoodsNo',
                    'isCreateGoodsNo',
                    'operateManageId'
                  ].includes(field.code)
                " :style="{ width: `${inputWidth}px` }" :is="componentMap[field.type]" v-model="formInline[field.code]"
                  :placeholder="componentPlaceholder(field)" :type="componentTypeMap[field.type]"
                  :multiple="field.type === 3" :value-format="field.type === 5 ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'"
                  clearable :options="field.options" :disabled="isAduit">
                  <template v-if="field.code === 'competitionLink'" #append>
                    <div style="color: #0064ff; cursor: pointer;op"
                      :style="{ opacity: formInline[field.code] ? 1 : 0.5 }"
                      @click="handleCompetitionLinkClick(formInline[field.code])">跳转</div>
                  </template>
                  <!-- select -->
                  <template v-if="field.type === 2 || field.type === 3">
                    <template v-if="!field.dictCode">
                      <el-option v-for="option in field.options" :key="option.id" :label="option.value"
                        :value="option.code" />
                    </template>
                    <template v-else>
                      <el-option v-for="option in getDicList(field.dictCode)" :key="option.code"
                        :label="option.shortName" :value="option.code" />
                    </template>
                  </template>
                </component>
              </el-form-item>
            </div>
          </div>
        </div>
        <!-- 风险点 -->

        <el-form-item prop="productRisk" label="风险点" label-width="78px">
          <s-text-area v-model="formInline.productRisk" placeholder="请输入风险点" style="width: 770px"
            :autosize="{ minRows: 3, maxRows: 3 }" :disabled="isAduit" />
        </el-form-item>
        <!--产品需求 -->
        <el-form-item prop="remark" label="产品需求" label-width="78px">
          <s-text-area v-model="formInline.remark" placeholder="请输入产品需求" style="width: 770px"
            :autosize="{ minRows: 3, maxRows: 3 }" :disabled="isAduit" />
        </el-form-item>
        <div style="display: flex; flex-wrap: wrap; width: calc(100% + 30px)">
          <!-- 销售目标拆解 -->
          <!-- <el-form-item
            label="销售目标拆解"
            label-width="78px"
            prop="salesTargetDismantling"
            :style="{ width: `${itemWidth}px` }"
          >
            <uploadFile
              :style="{ width: inputWidth }"
              ref="salesTargetDismantlingUploadFileRef"
              v-model:modelValue="formInline.salesTargetDismantling"
              :width="inputWidth"
              :disabled="isAduit"
            />
          </el-form-item> -->
          <!-- 产品图参考 -->
          <el-form-item label="产品图参考" label-width="78px" prop="productDiagramReference"
            :style="{ width: `${itemWidth}px` }">
            <uploadFile :style="{ width: inputWidth }" ref="productDiagramReferenceUploadFileRef"
              v-model:modelValue="formInline.productDiagramReference" :width="inputWidth" :disabled="isAduit" />
          </el-form-item>
          <!-- 产品定价 -->
          <el-form-item label="产品定价" label-width="78px" prop="productPrice" :style="{ width: `${itemWidth}px` }">
            <uploadFile :style="{ width: inputWidth }" ref="productPriceUploadFileRef"
              v-model:modelValue="formInline.productPrice" :width="inputWidth" :disabled="isAduit" />
          </el-form-item>
          <!-- 市场分析 -->
          <el-form-item label="市场分析" label-width="78px" prop="marketAnalysis"
            :style="{ width: `${itemWidth}px`, height: 'auto' }">
            <uploadFile :style="{ width: inputWidth }" ref="marketAnalysisUploadFileRef"
              v-model:modelValue="formInline.marketAnalysis" :width="inputWidth" :disabled="isAduit" />
          </el-form-item>
          <!-- 需求分析 -->
          <el-form-item label="需求分析" label-width="78px" prop="marketAnalysis"
            :style="{ width: `${itemWidth}px`, height: 'auto' }">
            <uploadFile :style="{ width: inputWidth }" ref="demandAnalysisUploadFileRef"
              v-model:modelValue="formInline.demandAnalysis" :width="inputWidth" :disabled="isAduit" />
          </el-form-item>
        </div>
      </el-form>

      <el-form v-if="false" :model="reviewDetail" label-width="auto" :inline="true"
        style="margin-left: 10px; width: calc(100% + 20px)">
        <el-form-item label="企划名称" style="width: 400px">
          <div class="disableValue">{{ reviewDetail.planName }}</div>
        </el-form-item>
        <el-form-item label="企划类型" style="width: 400px">
          <div class="disableValue">{{
            getDictLabel(DICT_TYPE.NP_ENTERPRISE_PLANTYPE, Number(reviewDetail.planType || ''))
          }}</div>
        </el-form-item>
        <el-form-item label="店铺" style="width: 400px">
          <div class="disableValue">{{ reviewDetail.storeName || '--' }}</div>
        </el-form-item>
        <el-form-item label="企划时间" style="width: 400px">
          <div class="disableValue">{{ reviewDetail.planningTime || '--' }}</div>
        </el-form-item>
        <el-form-item label="品类" style="width: 400px">
          <div class="disableValue">{{ formatCategory(reviewDetail.category) || '--' }}</div>
        </el-form-item>
        <el-form-item label="系列" style="width: 400px">
          <div class="disableValue">{{ reviewDetail.classCode || '--' }}</div>
        </el-form-item>
        <el-form-item label="卖点">
          <div class="disableValueTextarea" v-html="reviewDetail?.salePoint"></div>
        </el-form-item>
        <el-form-item label="市场分析" style="width: 400px">
          <div v-if="marketAnalysis().length === 0" class="disableValue">--</div>
          <UploadFile style="margin-bottom: 10px" v-else :uoload-file-list="marketAnalysis()" :enableEdit="false"
            :only-show="true" />
        </el-form-item>
        <el-form-item label="需求分析" style="width: 400px">
          <div v-if="demandAnalysis().length === 0" class="disableValue">--</div>
          <UploadFile style="margin-bottom: 10px" v-else :uoload-file-list="demandAnalysis()" :enableEdit="false"
            :only-show="true" />
        </el-form-item>
        <el-form-item label="备注" style="margin-top: -15px">
          <div class="disableValueTextarea">{{ reviewDetail.enterpriseRemark || '--' }}</div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { defineProps } from 'vue'
import { useCategoryList } from '../../../product/hooks'
import FormTitle from './formTitle.vue'
import { getDictLabel, DICT_TYPE } from '@/utils/dict'
import { componentMap, componentTypeMap } from '@/views/OA/new/planOld/utils.js'
import { isUrl } from '@/utils/is'
import { useDicList } from '@/views/OA/new/designGallery/hooks.js'
import { getDictOptions } from '@/utils/dict'
const { dicList } = useDicList()

import SWSelectPeople from '@/views/OA/factory/components/selectPeople.vue'
import UploadFile from '@/components/SWUoloadFile/index.vue'

const { categoryList, initSelectData } = useCategoryList()

const props = defineProps({
  fields: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  reviewDetail: {
    type: Object,
    default: () => ({})
  }
})

const formInline = ref(props.reviewDetail)

if (formInline.value.isCreateGoodsNo) {
  formInline.value.isCreateGoodsNo = Number(formInline.value.isCreateGoodsNo || '')
}

// 处理人员回显
if (formInline.value.operateManages && formInline.value.operateManages.length) {
  formInline.value.operateManageId = formInline.value.operateManages.map((user: any) => ({
    userId: user.userId,
    name: user.name,
    avatarOrigin: user.avatarOrigin
  }))
} else {
  formInline.value.operateManageId = null
}

const isAduit = ref(true)
const itemWidth = ref(286)
const inputWidth = ref(198)

const isShowField = (field) => {
  if (field.edit) {
    if (
      formInline.value &&
      formInline.value.planType &&
      (formInline.value.planType == 2 || formInline.value.planType == 3)
    ) {
      if (
        ![
          'productRisk',
          'productDemand',
          'marketAnalysis',
          'demandAnalysis',
          'salesTargetDismantling',
          'productDiagramReference',
          'productPrice',
          'remark'
        ].includes(field.code)
      ) {
        return true
      } else {
        return false
      }
    } else {
      if (
        ![
          'productRisk',
          'productDemand',
          'marketAnalysis',
          'demandAnalysis',
          'salesTargetDismantling',
          'productDiagramReference',
          'productPrice',
          'remark',
          'oldGoodsNo',
          'isCreateGoodsNo'
        ].includes(field.code)
      ) {
        return true
      } else {
        return false
      }
    }
  }
  return false
}

console.log('点击发送李逵负荆l', props.fields)

//企划信息是否展开
const planInfoIsExpand = ref(false)
const marketAnalysis = () => {
  if (props.reviewDetail.marketAnalysis) {
    return (
      props.reviewDetail.marketAnalysis.split(',').map((item) => {
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

const componentPlaceholder = (field) => {
  if (field.placeholder) {
    return field.placeholder
  }
  return `请输入${field.name}`
}
// 新生成的字段列表
const newFields = () => {
  if (preUploadFileCount() % 2 !== 0) {
    let tempFileds = []
    props.fields.forEach((item) => {
      if (item.code === 'marketAnalysis' && item.edit) {
        tempFileds.push({ code: 'empytLayout', edit: true, name: '', type: -1 })
      }
      tempFileds.push(item)
    })
    return tempFileds || []
  } else {
    return props.fields || []
  }
}

// 上传文件前面字段的数量
const preUploadFileCount = () => {
  let count = 0
  let flag = false
  props.fields.forEach((item) => {
    if (item.code === 'marketAnalysis' && item.edit) {
      flag = true
    }
    if (!flag && item.edit) {
      count++
    }
  })
  return count
}

const handleCompetitionLinkClick = (value) => {
  if (value) {
    if (isUrl(value)) {
      window.open(value, '_blank')
    } else {
      ElMessage.warning('非链接无法跳转')
    }
  }
}

const listDic = ref([])

watch(dicList, (newVal) => {
  // @ts-ignore
  listDic.value = newVal || []
})
const getDicList = (dictCode) => {
  // @ts-ignore
  const item = listDic.value.filter((item) => item?.id == dictCode)
  //@ts-ignore
  const dictList = getDictOptions(item?.[0]?.code).filter((item) => item?.code != 'ALL')
  return dictList
}

const demandAnalysis = () => {
  if (props.reviewDetail.demandAnalysis) {
    return (
      props.reviewDetail.demandAnalysis.split(',').map((item) => {
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

console.log('地方金石可镂j', props.reviewDetail, demandAnalysis.value)

const formatCategory = (category) => {
  if (!category) return ''
  const result = categoryList.value.find((item) => item.code == category)
  return result ? result.name : ''
}

onMounted(() => {
  initSelectData()
})
</script>

<style lang="scss" scoped>
.plan-detail {
  width: 100%;
  min-height: 60px;
  background: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-sizing: border-box;
  margin-bottom: 20px;

  .form-wapper {
    width: calc(100%);

    .header-wapper {
      margin-bottom: 16px;
      align-items: center;
      font-weight: 600;
      font-size: 14px;
      color: #333333;
      margin-left: -20px;
      border-bottom: 1px solid #f0f0f0;
      width: calc(100% + 40px);
      padding-bottom: 16px;

      .icon {
        margin-left: 20px;
        width: 3px;
        height: 10px;
        background: #0064ff;
        margin-right: 5px;
      }
    }
  }
}

.disableValue {
  width: 100%;
  height: 32px;
  background: url('@/assets/imgs/oa/disbaleBg.png') no-repeat;
  background-size: 100% 100%;
  padding: 0 16px;
  box-sizing: border-box;
  line-height: 32px;
  font-size: 14px;
  color: #333333;
  text-align: left;
  font-style: normal;
}

.disableValueTextarea {
  width: 755px;
  min-height: 100px;
  background: url('@/assets/imgs/oa/disbaleBg.png') no-repeat;
  background-size: 100% 100%;
  max-height: 800px;
  overflow-y: scroll;
  padding-left: 10px;
}

:deep(.el-form-item__content) {
  /* min-width: 350px; */
}

:deep(.el-form--inline .el-form-item) {
  margin-right: 20px;
}
</style>
<style scoped>
:deep(.el-form--inline .el-form-item) {
  margin-right: 15px !important;
}

:deep(.el-form-item__content) {
  display: flex;
  align-items: flex-start;
  /* 将内容对齐方式设置为顶部对齐 */
}

:deep(.el-input-group__append) {
  padding: 0 10px !important;
}
</style>
<style lang="scss">
.planningTimeDatePicker {
  .el-date-editor .el-input__icon {
    display: none;
  }

  .el-date-editor .el-range-separator {
    width: 10px;
    display: flex;
    flex: 0;
    padding-left: 8px;
    padding-right: 8px;
  }

  .el-input__wrapper {
    padding-left: 5px;
    padding-right: 5px;
  }
}
</style>

<style scoped>
:deep(p) {
  margin: 0px !important;
  padding: 0px !important;
}

:deep(.el-form-item__content) {
  min-width: 290px;
}

:deep(.el-form--inline .el-form-item) {
  margin-right: 20px;
}

:deep(.el-form-item.is-required:not(.is-no-asterisk).asterisk-left > .el-form-item__label:before) {
  margin-right: 0px;
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
  color: #666666;
}
</style>
