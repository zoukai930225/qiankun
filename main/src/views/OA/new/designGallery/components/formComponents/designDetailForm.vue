<!--
 * @Date: 2025-02-11 18:11:15
-->
<template>
  <div class="plan-detail" @click.stop.prevent="bgClick">
    <div v-if="!openType">
      <FormTitle title="设计图/现货图" :is-show-expand="true" :is-expand="designIsExpand"
        @expand-click="designIsExpand = !designIsExpand" />
      <div v-show="designIsExpand">
        <div v-for="(item, index) in localForm.designList" :key="index" class="designWrapper">
          <div v-if="index > 0" @click="deleteClick(index)" @mouseover="item.mouseHover = true"
            @mouseout="item.mouseHover = false"
            style="position: absolute; right: 20px; margin-top: -6px; cursor: pointer;z-index:99">
            <img v-if="item.mouseHover" style="width: 14px; height: 14px"
              src="@/assets/imgs/otr/schemeSet/delete_icon_red.png" alt="" />

            <img v-else style="width: 14px; height: 14px" src="@/assets/imgs/otr/schemeSet/delete_icon.png" alt="" />
          </div>
          <div class="picListAdd">
            <el-form :ref="getFormRef" :model="item" label-width="90" :rules="rules">
              <div style="display: flex; flex-wrap: wrap;justify-content: space-between;">
                <el-form-item v-if="reviewDetail && Number(reviewDetail.productType || '') === 0" label="现货图"
                  prop="productPicture" style="width: 400px" :required="true"
                  :rules="[{ required: true, message: '请上传现货图', trigger: 'blur' }]">
                  <SWUploadFile style="width: 280px" :ref="(el) => getItemRef(el, index, 0)"
                    v-model:modelValue="item.productPicture" :width="280" :hideFileSizeMsg="true"
                    :only-upload-img="true" :hideResultSpace="true" @uploadBgClick="uploadBgClick(index, 0)" />
                </el-form-item>
                <el-form-item v-if="reviewDetail && Number(reviewDetail.productType || '') === 1" label="设计图稿"
                  prop="productPicture" style="width: 400px" :required="true"
                  :rules="[{ required: true, message: '请上传设计图稿', trigger: 'blur' }]">
                  <SWUploadFile style="width: 280px" :ref="(el) => getItemRef(el, index, 0)"
                    v-model:modelValue="item.productPicture" :width="280" :hideFileSizeMsg="true"
                    :only-upload-img="true" :hideResultSpace="true" @uploadBgClick="uploadBgClick(index, 0)" />
                </el-form-item>
                <!-- <el-form-item v-if="reviewDetail && Number(reviewDetail.productType || '') === 1" label="工艺文件"
                  prop="techniqueUrl" style="width: 400px">
                  <SWUploadFile style="width: 280px" :ref="(el) => getItemRef(el, index, 1)"
                    v-model:modelValue="item.techniqueUrl" :width="280" :hideFileSizeMsg="true" :hideResultSpace="true"
                    @uploadBgClick="uploadBgClick(index, 1)" />
                </el-form-item> -->
              </div>
              <el-form-item label="图稿编号" prop="artworkNumber">
                <el-input v-model="item.artworkNumber"></el-input>
                <div class="row-center">
                  <img src="@/assets/imgs/common/warning_icon.png" alt="" style="width: 14px;height: 14px">
                  <div style="font-size: 14px;color: #E26A00;margin-left: 5px;">
                    增加图稿编号，在还没有产生大货编号之前可以由设计师/买手自由编辑，方便快速定位，不可重复</div>
                </div>
              </el-form-item>
            </el-form>
          </div>

          <el-form :model="item" label-width="90px" :inline="true">
            <el-form-item label="备注" style="width: 100%;">
              <s-text-area v-model="item.remark"  :rows="3" />
            </el-form-item>
          </el-form>
        </div>
        <div class="clickAddDesignPhoto" @click="addDesignPhoto"
          v-if="reviewDetail && Number(reviewDetail.productType || '') === 1">
          <img src="@/assets/imgs/oa/design_add.png" alt="" />
          <div class="clickAddDesignPhoto-text">点击添加设计图</div>
        </div>
      </div>
    </div>
    <div v-if="openType">
      <FormTitle title="设计图/现货图" />
      <div class="picList">
        <el-form label-width="80px" :ref="getFormRef" :model="localForm" :rules="rules">
          <div style="display: flex; flex-wrap: wrap">
            <el-form-item v-if="reviewDetail && Number(reviewDetail.productType || '') === 0" label="现货图"
              prop="productPicture" style="width: 400px">
              <SWUploadFile style="width: 280px" v-model:modelValue="localForm.productPicture" :width="280"
                :hideFileSizeMsg="true" :only-upload-img="true" :only-show="openType === 'view'" />
            </el-form-item>
            <el-form-item v-if="reviewDetail && Number(reviewDetail.productType || '') === 1" label="设计图稿"
              prop="productPicture" style="width: 400px">
              <SWUploadFile style="width: 280px" v-model:modelValue="localForm.productPicture" :width="280"
                :hideFileSizeMsg="true" :only-upload-img="true" :only-show="openType === 'view'" />
            </el-form-item>
            <el-form-item v-if="reviewDetail && Number(reviewDetail.productType || '') === 1 && openType === 'view'"
              label="工艺文件" prop="techniqueUrl" style="width: 400px">
              <SWUploadFile style="width: 280px" v-model:modelValue="localForm.techniqueUrl" :width="280"
                :hideFileSizeMsg="true" :only-show="openType === 'view'" />
            </el-form-item>
          </div>
          <el-form-item label="图稿编号" prop="artworkNumber">
            <el-input v-model="localForm.artworkNumber" :disabled="openType === 'view'"></el-input>
            <div class="row-center">
              <img src="@/assets/imgs/common/warning_icon.png" alt="" style="width: 14px;height: 14px">
              <div style="font-size: 14px;color: #E26A00;margin-left: 5px;">
                增加图稿编号，在还没有产生大货编号之前可以由设计师/买手自由编辑，方便快速定位，不可重复</div>
            </div>
          </el-form-item>
        </el-form>

        <!-- <SWuploadImg v-model:modelValue="localForm.productPicture" :uploadDisabled="openType === 'view'"
          @upload-status="getUploadStatus" /> -->
      </div>
      <el-form :model="localForm" label-width="80px" :inline="true">
        <el-form-item label="备注">
          <s-text-area v-model="localForm.remark"  :disabled="openType === 'view'"
            style="width: 500px" />
        </el-form-item>
      </el-form>
    </div>

    <!--审核详情  -->
    <FormTitle v-if="openType" title="审核详情" :is-show-expand="true" :is-expand="auditIsExpand"
      @expand-click="auditIsExpand = !auditIsExpand" />

    <div v-show="auditIsExpand" class="shenhe-detail" v-for="(item, index) in localForm?.examineInfos" :key="index">
      <el-form :model="localForm" label-width="auto" :inline="true">
        <el-form-item label="审核人" style="width: 330px">
          <div class="disableValue1">{{ item?.examinePerson }}</div>
        </el-form-item>
        <el-form-item label="审核时间" style="width: 330px">
          <div class="disableValue1">{{ item?.examineTime }}</div>
        </el-form-item>
        <el-form-item label="审核结果" style="width: 330px">
          <div class="disableValue1">{{
            item?.examineStatus == 2 ? '通过' : item?.examineStatus == 1 ? '不通过' : ''
          }}</div>
        </el-form-item>
        <el-form-item label="审核备注" style="width: 330px">
          <div class="disableValue1 textWrap">{{ item?.examineRemark }}</div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { defineProps } from 'vue'
import SWUploadFile from '@/components/SWUoloadFile/index.vue'
import HeaderLine from "@/components/template/table/components/headerLine.vue";

import SWuploadImg from '../SWuploadImg.vue'
import FormTitle from './formTitle.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  reviewDetail: {
    type: Object,
    required: true
  },
  openType: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['update:modelValue', 'uploadStatus'])

const localForm = ref({ ...props.modelValue })
if (!props.openType) {
  localForm.value.designList = [
    {
      productPicture: [],
      techniqueUrl: [],
      remark: ''
    }
  ]
}
const rules = reactive({
  techniqueUrl: [{ required: true, message: '请上传工艺文件', trigger: 'blur' }],
  artworkNumber:[{ required: true, message: '请填写图稿编号', trigger: 'blur' }]
})
let isInternalUpdate = false

let itemRefList = ref<HTMLElement[]>([])
const getItemRef = (el: any, index, subIndex) => {
  if (el) {
    itemRefList.value[`${index}-${subIndex}`] = el
  }
}

let formRefList = ref<HTMLElement[]>([])

const getFormRef = (el: any) => {
  if (el) {
    formRefList.value.push(el)
  }
}

//
const uploadBgClick = (index, subIndex) => {
  if (localForm.value.designList && localForm.value.designList.length > 0) {
    for (let i = 0; i < localForm.value.designList.length; i++) {
      if (index !== i) {
        itemRefList.value[`${i}-0`]?.cancelUploadSelect()
        itemRefList.value[`${i}-1`]?.cancelUploadSelect()
      } else {
        if (subIndex === 0) {
          itemRefList.value[`${index}-1`]?.cancelUploadSelect()
        } else if (subIndex === 1) {
          itemRefList.value[`${index}-0`]?.cancelUploadSelect()
        }
      }
    }
  }
}

const bgClick = (event: Event) => {
  console.log(event);
  if (localForm.value.designList && localForm.value.designList.length > 0) {
    for (let i = 0; i < localForm.value.designList.length; i++) {
      itemRefList.value[`${i}-0`]?.cancelUploadSelect()
      itemRefList.value[`${i}-1`]?.cancelUploadSelect()
    }
  }
}

//设计图是否展开
const designIsExpand = ref(true)

// 审核详情是否展开
const auditIsExpand = ref(true)

watch(
  () => props.modelValue,
  (newForm) => {
    if (!isInternalUpdate) {
      if (props.openType) {
        localForm.value = { ...newForm }
      } else {
        if (!localForm.value.designList) {
          localForm.value.designList = [
            {
              productPicture: [],
              techniqueUrl: [],
              remark: ''
            }
          ]
        } else {
          localForm.value.designList = [
            {
              productPicture: newForm.productPicture,
              techniqueUrl: newForm.techniqueUrl,
              remark: ''
            }
          ]
        }
      }
    }
    isInternalUpdate = false
  },
  { deep: true }
)

watch(
  localForm,
  (newLocalForm) => {
    isInternalUpdate = true
    emit('update:modelValue', newLocalForm)
  },
  { deep: true }
)

// 添加设计图库
const addDesignPhoto = () => {
  localForm.value.designList.push({
    productPicture: [],
    techniqueUrl: [],
    remark: ''
  })
}

// 删除按钮点击
const deleteClick = (index) => {
  if (index < localForm.value.designList.length) {
    localForm.value.designList.splice(index, 1)
  }
}

const getUploadStatus = (status) => {
  emit('uploadStatus', status)
}
const formInvalid = async () => {
  let valid = true
  for (let i = 0; i < formRefList.value.length; i++) {
    let formValid = await (formRefList.value[i] as any).validate()
    if (!formValid) {
      valid = false
    }
  }
  return valid
}
defineExpose({ formInvalid })
</script>

<style lang="scss" scoped>
.header-line-wrapper {
  pointer-events: auto;
}

:deep(.el-form-item__label) {
  pointer-events: none;
}

:deep(.el-form-item__content) {
  align-items: start;
}

.plan-detail {
  width: 100%;
  // min-height: 100px;
  background: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-sizing: border-box;
  margin-bottom: 20px;
}

.shenhe-detail {
  width: 100%;
  border-radius: 4px;
  background: rgba(240, 246, 253, 0.8);
  padding: 15px 10px;
  box-sizing: border-box;
  margin-bottom: 16px;

  .el-form--inline .el-form-item {
    vertical-align: top;
  }
}

.disableValue {
  width: 100%;
  height: 32px;
  background: url('@/assets/imgs/oa/disbaleBg.png') no-repeat;
  background-size: 100% 100%;
  line-height: 32px;
  padding: 0 16px;
  box-sizing: border-box;
}

.disableValue1 {
  width: 100%;
  min-height: 32px;
  background: url('@/assets/imgs/oa/disbaleBg1.png') no-repeat;
  background-size: 100% 100%;
  line-height: 32px;
  padding: 0 16px;
  box-sizing: border-box;
}

:deep(.el-upload--picture-card) {
  width: 146px;
  height: 146px;
  border: none;
}

.designWrapper {
  background: #f0f6fd;
  border-radius: 4px;
  margin-bottom: 10px;
  position: relative;
  padding: 20px;
}

.picList {
  margin-bottom: 16px;
  // margin-left: 40px;
}

.picListAdd {
  margin-bottom: 16px;
  // padding-top: 34px;
  // margin-left: 40px;
}

.clickAddDesignPhoto {
  margin-left: auto;
  margin-right: auto;
  cursor: pointer;
  margin-top: 14px;
  width: 157px;
  height: 36px;
  border-radius: 4px;
  border: 1px solid #0064ff;
  display: flex;
  flex-direction: row;
  align-items: center;

  img {
    margin-left: 20px;
    margin-right: 10px;
    width: 10px;
    height: 10px;
  }

  &-text {
    font-size: 14px;
    color: #0064ff;
    line-height: 20px;
  }
}
</style>
