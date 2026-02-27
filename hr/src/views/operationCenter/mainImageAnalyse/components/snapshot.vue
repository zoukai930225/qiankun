<template>
  <div class="snapshot-wrapper" ref="snapshotWrapper">
    <el-form class="dialogForm" label-width="120px" label-position="right" :model="localFormData" disabled>
      <el-card shadow="never" class="drawerContent">
        <template #header>
          <div class="drawerContent-title">
            <span class="line"></span>
            <span>主图</span>
          </div>
        </template>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="store" label="店铺" required>
              <StoreRangePlus v-model="localFormData.store" width="300px" :showAllChannels="false" placeholder="请选择店铺"
                disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="货品编码" prop="productCode">
              <el-select-v2 filterable multiple clearable v-model="localFormData.productCode" :options="WdtGoodsList" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="运营人员" prop="operatorList">
          <SWSelectPeople v-if="localFormData.operator" disabled :tags="6" v-model="localFormData.operatorList"
            placeholder="请选择运营人员" :roleId="roles?.getRole ? roles.getRole('主图运营') : ''" :showDisabledBg="true" />
        </el-form-item>
        <el-form-item label="链接主打方向" prop="mainDirection">
          <s-text-area disabled :autosize="{ minRows: 2, maxRows: 4 }" placeholder="请输入"
            v-model="localFormData.mainDirection" />
        </el-form-item>
        <el-form-item label="主推色" prop="mainColor">
          <s-text-area disabled :autosize="{ minRows: 2, maxRows: 4 }" placeholder="请输入"
            v-model="localFormData.mainColor" />
        </el-form-item>
        <el-form-item label="产品款式图(准确)" prop="mainImageInfo">
          <UploadImg v-model:modelValue="localMainImageList" :limit="1" uploadDisabled />
        </el-form-item>
      </el-card>
      <el-card shadow="never" class="drawerContent">
        <template #header>
          <div class="drawerContent-title">
            <span class="line"></span>
            <span>目标人群(实际使用人群)</span>
          </div>
        </template>
        <el-form-item :label="index === 0 ? '人群特点' : ''" class="btns" v-for="(item, index) in localTargetFeatures"
          :key="`targetFeatures-${index}`">
          <el-input placeholder="请输入" v-model="item.value" disabled />
        </el-form-item>
        <div class="gray"></div>
        <el-form-item :label="index === 0 ? '他们关心什么' : ''" prop="targetCares" class="btns"
          v-for="(item, index) in localTargetCares" :key="`targetCares-${index}`">
          <el-input placeholder="请输入" v-model="item.value" disabled />
        </el-form-item>
      </el-card>
      <el-card shadow="never" class="drawerContent">
        <template #header>
          <div class="drawerContent-title">
            <span class="line"></span>
            <span>运营备注</span>
          </div>
        </template>
        <el-form-item label="运营备注" prop="remark">
          <s-text-area :autosize="{ minRows: 3, maxRows: 4 }" v-model="localFormData.remark" disabled />
        </el-form-item>
      </el-card>
    </el-form>
    <div class="snapshot-step2">
      <el-form class="dialogForm" label-width="120px" label-position="right" :model="localFormListData">
        <el-card shadow="never" class="drawerContent" :header-class="localFeatureCardList.length === 0 ? 'noLine' : ''"
          :body-class="localFeatureCardList.length === 0 ? 'noContent' : ''">
          <template #header>
            <div class="drawerContent-title">
              <span class="line"></span>
              <span>本产品特点(按重要程度填写,1为最核心)</span>
            </div>
          </template>
          <el-form-item label-width="0" prop="features" class="drawerContent-content">
            <GenericDescription :forms="card" :index="index" v-for="(card, index) in localFeatureCardList"
              :key="card.id || index" :isEdit="false" :data-fields="featureFields" card-type="features" />
          </el-form-item>
        </el-card>

        <el-card shadow="never" class="drawerContent"
          :header-class="localCompetitorCardList.length === 0 ? 'noLine' : ''"
          :body-class="localCompetitorCardList.length === 0 ? 'noContent' : ''">
          <template #header>
            <div class="drawerContent-title">
              <span class="line"></span>
              <span>竞品分析</span>
            </div>
          </template>
          <el-form-item label-width="0" prop="competitor" class="drawerContent-content">
            <GenericDescription :forms="card" :index="index" v-for="(card, index) in localCompetitorCardList"
              :key="card.id || index" :isEdit="false" :data-fields="competitorFields" card-type="competitor" />
          </el-form-item>
        </el-card>

        <el-card shadow="never" class="drawerContent"
          :header-class="localSellingPointCardList.length === 0 ? 'noLine' : ''"
          :body-class="localSellingPointCardList.length === 0 ? 'noContent' : ''">
          <template #header>
            <div class="drawerContent-title">
              <span class="line"></span>
              <span>本品主图卖点方向和透出顺序</span>
            </div>
          </template>
          <el-form-item label-width="0" prop="sellingPoint" class="drawerContent-content">
            <GenericDescription :forms="card" :index="index" v-for="(card, index) in localSellingPointCardList"
              :key="card.id || index" :isEdit="false" :data-fields="sellingPointFields" card-type="sellingPoint" />
          </el-form-item>
        </el-card>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { cloneDeep } from 'lodash-es'
import { inject, PropType, ref, watch, watchEffect } from 'vue'

import SWSelectPeople from '@/components/template/table/components/lineStaffs.vue'

// 引入通用描述组件和类型定义
import GenericDescription, { DescriptionField } from './genericDescription.vue'
import UploadImg from './uploadImg.vue'

const WdtGoodsList = inject<any>('WdtGoodsList')
const props = defineProps({
  formData: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({})
  },
  formListData: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({})
  },
  targetFeatures: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  targetCares: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  mainImageList: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  featureCardList: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  competitorCardList: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  sellingPointCardList: {
    type: Array as PropType<any[]>,
    default: () => []
  }
})

// 1. 产品特点配置
const featureFields: DescriptionField[] = [
  { label: '属性（款式，材质，工艺，参数）', key: 'attributeType' },
  { label: '属性用处', key: 'attributeUse' },
  { label: '用处的优势', key: 'advantage' }
]

// 2. 竞品分析配置 (注意：这里 key 指向 mainImageInfo.fileUrl 以正确显示图片)
const competitorFields: DescriptionField[] = [
  { label: '图片', key: 'mainImageInfo.fileUrl', isImage: true },
  { label: '优势', key: 'competitorAdvantage' },
  { label: '可取之处', key: 'competitorLearn' },
  { label: '竞品链接', key: 'competitorUrl', isLink: true }
]

// 3. 本品主图卖点配置
const sellingPointFields: DescriptionField[] = [
  { label: '图片', key: 'mainImageInfo.fileUrl', isImage: true },
  { label: '卖点参考', key: 'sellingPointRef' },
  { label: '主图文案', key: 'mainImageCopy' },
  { label: '强调突出', key: 'highlightPoint' }
]

const roles = inject<any>('roles', {})

const localFormData = ref<Record<string, any>>({})
const localFormListData = ref<Record<string, any>>({})
const localTargetFeatures = ref<any[]>([{ value: '' }])
const localTargetCares = ref<any[]>([{ value: '' }])
const localMainImageList = ref<any[]>([])
const localFeatureCardList = ref<any[]>([])
const localCompetitorCardList = ref<any[]>([])
const localSellingPointCardList = ref<any[]>([])

watch(
  () => props.formData,
  (val) => {
    localFormData.value = cloneDeep(val || {})
  },
  { immediate: true, deep: true }
)

watch(
  () => props.formListData,
  (val) => {
    localFormListData.value = cloneDeep(val || {})
  },
  { immediate: true, deep: true }
)

watch(
  () => props.targetFeatures,
  (val) => {
    localTargetFeatures.value = val && val.length ? cloneDeep(val) : [{ value: '' }]
  },
  { immediate: true, deep: true }
)

watch(
  () => props.targetCares,
  (val) => {
    localTargetCares.value = val && val.length ? cloneDeep(val) : [{ value: '' }]
  },
  { immediate: true, deep: true }
)

watchEffect(() => {
  const list =
    (props.mainImageList && props.mainImageList.length
      ? props.mainImageList
      : props.formData?.mainImageInfo
        ? [props.formData.mainImageInfo]
        : []) || []
  localMainImageList.value = cloneDeep(list)
})

watch(
  () => props.featureCardList,
  (val) => {
    localFeatureCardList.value = cloneDeep(val || [])
  },
  { immediate: true, deep: true }
)

watch(
  () => props.competitorCardList,
  (val) => {
    localCompetitorCardList.value = cloneDeep(val || [])
    console.log(localCompetitorCardList.value, 'localCompetitorCardList')
  },
  { immediate: true, deep: true }
)

watch(
  () => props.sellingPointCardList,
  (val) => {
    localSellingPointCardList.value = cloneDeep(val || [])
  },
  { immediate: true, deep: true }
)

const snapshotWrapper = ref<HTMLElement>()

defineExpose({
  getElement: () => snapshotWrapper.value
})
</script>

<style scoped lang="less">
.snapshot-wrapper {
  width: 968px;
  padding: 16px 24px 0;
  box-sizing: border-box;
  background: #fff;
}

.snapshot-step2 {
  margin-top: 20px;
}

.drawerContent {
  border-radius: 8px;
  border: none !important;
  margin-bottom: 20px;

  :deep(.noContent) {
    display: none;
  }

  :deep(.noLine) {
    border-bottom: none;
  }

  &-title {
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: 700;

    &.center {
      margin-bottom: -20px;
    }

    .line {
      width: 3px;
      height: 10px;
      background: #0064ff;
      margin-right: 6px;
    }

    .commonAddBtn {
      margin-left: auto;
      width: 68px;
    }
  }

  &-content {
    :deep(.el-form-item__content) {
      // display: flex;
      // flex-wrap: wrap;
      // justify-content: space-between;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 20px;
    }
  }

  .gray {
    width: 875px;
    height: 1px;
    background: #eceaea;
    margin: 14px 0;
  }

  .btns {
    display: flex;
    flex-wrap: nowrap;

    .el-input {
      flex: 1;
    }

    .btn {
      width: 34px;
      height: 32px;
      background: #0064ff;
      border-radius: 4px;
      opacity: 0.07;
      margin-left: 16px;
      cursor: pointer;

      &.del {
        background: #eb3737;
      }
    }

    img {
      cursor: pointer;
      position: absolute;
      right: 10px;
    }
  }

  :deep(.el-textarea) {
    .el-textarea__inner {
      color: #333;
    }

    &.is-disabled {
      .el-textarea__inner {
        color: #666;
      }
    }
  }

  :deep(.el-input.is-disabled) {
    .el-input__inner {
      color: #666;
      -webkit-text-fill-color: inherit;
    }
  }
}
</style>
