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
      <el-form-item label="企划类型" style="width: 400px">
        <div class="disableValue">
          {{ getDictLabel(DICT_TYPE.NP_ENTERPRISE_PLANTYPE, Number(reviewDetail.planType || '')) }}
        </div>
      </el-form-item>
      <el-form-item label="店铺" style="width: 400px">
        <div class="disableValue">{{ reviewDetail.store }}</div>
      </el-form-item>
      <el-form-item label="企划时间" style="width: 400px">
        <div class="disableValue">{{ reviewDetail.planningTime }}</div>
      </el-form-item>
      <el-form-item label="品类" style="width: 400px">
        <div class="disableValue">{{ formatCategory(reviewDetail.category) }}</div>
      </el-form-item>
      <el-form-item label="系列" style="width: 400px">
        <div class="disableValue">{{ reviewDetail.classCode }}</div>
      </el-form-item>
      <el-form-item label="卖点">
        <div class="disableValueTextarea" v-html="reviewDetail?.salePoint"></div>
      </el-form-item>
      <el-form-item label="市场分析" style="width: 400px">
        <div v-if="marketAnalysis().length === 0" class="disableValue">--</div>
        <UploadFile v-else :uoload-file-list="marketAnalysis()" :enableEdit="false" />
      </el-form-item>
      <el-form-item label="需求分析" style="width: 400px">
        <div v-if="demandAnalysis().length === 0" class="disableValue">--</div>
        <UploadFile v-else :uoload-file-list="demandAnalysis()" :enableEdit="false" />
      </el-form-item>
      <el-form-item label="备注">
        <div class="disableValueTextarea">{{ reviewDetail.remark || '--' }}</div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import UploadFile from '@/components/SWUoloadFile/index.vue'
import { DICT_TYPE, getDictLabel } from '@/utils/dict'
import { defineProps } from 'vue'
import { useCategoryList } from '../../hooks'
import FormTitle from './formTitle.vue'
const { categoryList, initSelectData } = useCategoryList()

const props = defineProps({
  reviewDetail: {
    type: Object,
    default: () => ({})
  }
})

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
const formatCategory = (category) => {
  if (!category) return ''
  const result = categoryList.value.find((item) => item.code == category)
  return result ? result.name : ''
}

onMounted(() => {
  initSelectData()
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

:deep(.el-form-item__content) {
  /* min-width: 350px; */
}

:deep(.el-form--inline .el-form-item) {
  margin-right: 20px;
}
</style>
