<!--
 * @Date: 2025-02-11 18:11:15
-->
<template>
  <div class="plan-detail">
    <FormTitle title="其他信息" />
    <el-form
      :model="reviewDetail"
      label-width="100px"
      :inline="true"
      style="margin-left: 10px; width: calc(100% + 20px)"
    >
      <el-form-item label="任务编号" style="width: 410px">
        <div class="disableValue">{{ reviewDetail.planCode }}</div>
      </el-form-item>
      <el-form-item label="类型" style="width: 410px">
        <div class="disableValue">
          {{
            reviewDetail.productType == '0'
              ? '买手款'
              : reviewDetail.productType == '1'
                ? '定制款'
                : ''
          }}</div
        >
      </el-form-item>
      <!-- <el-form-item label="运营负责人" style="width: 410px">
        <div class="disableValue single-line">{{
          reviewDetail.operationManagerList &&
          reviewDetail.operationManagerList.map((item) => item.name).join(',')
        }}</div>
      </el-form-item> -->
      <el-form-item label="设计师/买手" style="width: 410px">
        <div class="disableValue single-line">{{
          reviewDetail.designerList && reviewDetail.designerList.map((item) => item.name).join(',')
        }}</div>
      </el-form-item>

      <el-form-item label="上架时间" style="width: 410px">
        <div class="disableValue">{{ formatDate(reviewDetail.listingTime, 'YYYY-MM-DD') }}</div>
      </el-form-item>
      <el-form-item label="包装方式" style="width: 410px">
        <div class="disableValue">{{ reviewDetail.packageMethod }}</div>
      </el-form-item>
      <el-form-item label="产品等级" style="width: 410px">
        <div class="disableValue">{{ reviewDetail.productGrade }}</div>
      </el-form-item>
      <el-form-item label="营销策略-预估月销量" style="width: 410px">
        <div class="disableValue">{{ reviewDetail.monthCount }}</div>
      </el-form-item>
      <!-- <el-form-item label="首批下单时间" style="width: 330px">
        <div class="disableValue">{{ reviewDetail.firstOrderTime }}</div>
      </el-form-item> -->
      <!-- <el-form-item label="首批下单量" style="width: 330px">
        <div class="disableValue">{{ reviewDetail.firstOrderCount }}</div>
      </el-form-item> -->

      <!-- <el-form-item label="拍摄时间" style="width: 330px">
        <div class="disableValue">{{ reviewDetail.shootingTime }}</div>
      </el-form-item> -->
      <!-- <el-form-item label="链接完成时间" style="width: 330px">
        <div class="disableValue">{{ reviewDetail.linkCompletionTime }}</div>
      </el-form-item> -->
      <el-form-item label="是否已上架" style="width: 410px">
        <div class="disableValue">{{
          reviewDetail.isOnshelf == '1' ? '是' : reviewDetail.isOnshelf == '0' ? '否' : ''
        }}</div>
      </el-form-item>
      <!-- <el-form-item label="未上架原因" style="width: 330px">
        <div class="disableValue">{{ reviewDetail.unShelfReason }}</div>
      </el-form-item> -->
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import { usePeopleList } from '../../hooks'
import { formatDate } from '@/utils/formatTime'
import FormTitle from './formTitle.vue'
import { format } from 'path'
const { peopleList, initPeople, getName } = usePeopleList()

const props = defineProps({
  reviewDetail: {
    type: Object,
    default: () => ({})
  }
})
onMounted(() => {
  initPeople()
})
</script>

<style scoped lang="scss">
:deep(.el-form--inline .el-form-item) {
  margin-right: 0 !important;
}
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
  background-size: cover;
  line-height: 32px;
  padding: 0 16px;
  box-sizing: border-box;
}
.disableValueTextarea {
  width: 500px;
  min-height: 100px;
  background: url('@/assets/imgs/oa/disbaleBg.png') no-repeat;
  background-size: 100% 100%;
  max-height: 800px;
  overflow-y: scroll;
}

:deep(.el-form-item__label) {
  height: 20px;
  font-size: 14px;
  color: #666666;
  line-height: 20px;
  text-align: right;
}
</style>
