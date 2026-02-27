<!--
 * @Date: 2025-02-11 18:11:15
-->
<template>
  <div class="plan-detail">
    <FormTitle title="设计图" />
    <div class="picList" style="display: flex; flex-wrap: wrap">
      <!-- <SWuploadImg v-model:modelValue="localForm.productPicture" /> -->
      <div v-for="item in localForm.productPicture" :key="item" style="margin-right: 10px">
        <el-image style="width: 100px; height: 100px" :src="item" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2"
          :preview-src-list="localForm.productPicture" show-progress :initial-index="4" fit="cover" />
      </div>
    </div>

    <el-form :model="localForm" label-width="auto" :inline="true">
      <el-form-item label="备注">
        <s-text-area readonly v-model="localForm.remark" style="width: 500px" />
      </el-form-item>
    </el-form>
    <!--审核详情  -->
    <FormTitle title="审核详情" :is-show-expand="true" :is-expand="auditIsExpand"
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
        <el-form-item label="审核备注">
          <div class="disableValue1">{{ item?.examineRemark }}</div>
        </el-form-item>
      </el-form>
    </div>
    <FormTitle title="样衣" />
    <div>
      <el-form-item label="样衣图片">
        <div v-for="item in formatTimg(localForm.samplePicture)" :key="item" style="margin-right: 10px">
          <el-image style="width: 100px; height: 100px" :src="item" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2"
            :preview-src-list="formatTimg(localForm.samplePicture)" show-progress :initial-index="4" fit="cover" />
        </div>
      </el-form-item>

      <el-form-item label="备注">
        <s-text-area v-model="localForm.sampleRemark" style="width: 500px" />
      </el-form-item>
    </div>
  </div>
</template>

<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { defineProps } from 'vue'
import SWuploadImg from '../SWuploadImg.vue'
import FormTitle from './formTitle.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
})
const emit = defineEmits(['update:modelValue'])

const localForm = ref({ ...props.modelValue })

let isInternalUpdate = false

// 审核详情是否展开
const auditIsExpand = ref(false)

const formatTimg = (img: string) => {
  if (!img) return []
  return img.split(',')
}

watch(
  () => props.modelValue,
  (newForm) => {
    if (!isInternalUpdate) {
      localForm.value = { ...newForm }
    }
    isInternalUpdate = false
  },
  { deep: true, immediate: true }
)

watch(
  localForm,
  (newLocalForm) => {
    isInternalUpdate = true
    emit('update:modelValue', newLocalForm)
  },
  { deep: true }
)
</script>

<style scoped>
.plan-detail {
  width: 100%;
  min-height: 100px;
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
  height: 32px;
  background: url('@/assets/imgs/oa/disbaleBg1.png') no-repeat;
  background-size: 100% 100%;
  line-height: 32px;
  padding: 0 16px;
  box-sizing: border-box;
}

:deep(.el-upload--picture-card) {
  width: 110px;
  height: 110px;
  border: none;
}

.picList {
  margin-bottom: 16px;
  margin-left: 40px;
}
</style>
