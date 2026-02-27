<!--
 * @Date: 2025-02-11 18:11:15
-->
<template>
  <div class="plan-detail">
    <FormTitle title="企划信息" />
    <el-form
      :model="reviewDetail"
      label-width="auto"
      :inline="true"
      style="margin-left: 10px; width: calc(100% + 20px)"
    >
      <el-form-item label="企划名称" style="width: 400px">
        <div class="disableValue">{{ reviewDetail.planName }}</div>
      </el-form-item>
      <el-form-item label="店铺" style="width: 400px">
        <div class="disableValue">{{ reviewDetail.storeName }}</div>
      </el-form-item>

      <el-form-item label="计划上架月份" style="width: 400px">
        <div class="disableValue">{{ reviewDetail.planListDate }}</div>
      </el-form-item>

      <el-form-item label="企划时间" style="width: 400px">
        <div class="disableValue"
          >{{ reviewDetail.planStartTime }}-{{ reviewDetail.planEndTime }}</div
        >
      </el-form-item>
      <el-form-item label="计划下单日期" style="width: 400px">
        <div class="disableValue">{{ reviewDetail.planOrderDate }}</div>
      </el-form-item>
      <el-form-item label="包装范围" style="width: 400px">
        <div class="disableValue">{{
          reviewDetail.packagingScope == 0 ? '通用' : reviewDetail.packagingScope == 1 ? '特定' : ''
        }}</div>
      </el-form-item>
      <el-form-item label="备注" style="margin-top: -15px">
        <div class="disableValueTextarea">{{ reviewDetail.remark || '--' }}</div>
      </el-form-item>
      <el-form-item label="系列" style="margin-top: -15px; width: 90%">
        <div class="disableValue">{{ reviewDetail.series || '--' }}</div>
      </el-form-item>
      <el-form-item label="系列备注" style="margin-top: -15px">
        <div class="disableValueTextarea">{{ reviewDetail.seriesRemark || '--' }}</div>
      </el-form-item>
      <el-form-item label="参考图/其他">
        <uploadImg v-model:modelValue="reviewDetail.imageList" :disabled="true" :onlyShow="true" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import uploadImg from '@/components/SWUoloadFile/index.vue'
import { defineProps } from 'vue'
import FormTitle from './formTitle.vue'

const props = defineProps({
  reviewDetail: {
    type: Object,
    default: () => ({})
  }
})
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

:deep(.el-form--inline .el-form-item) {
  margin-right: 20px;
}
</style>
