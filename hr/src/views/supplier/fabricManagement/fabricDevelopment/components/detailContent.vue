<template>
  <div class="center-detail">
    <layout>
      <template #basicInfo>
        <el-descriptions label-width="174px" :column="2" border>
          <el-descriptions-item label="品类">{{ detail?.completeCategoryName || '-' }}</el-descriptions-item>
          <el-descriptions-item label="企划时间">{{ formatTime(detail.planTime, 'yyyy-MM-dd HH:mm') || '-'
          }}</el-descriptions-item>
          <el-descriptions-item label="企划季度">{{
            detail.planQuarter || '-'
          }}</el-descriptions-item>
        </el-descriptions>
      </template>

      <template #fabricInfo>
        <el-descriptions label-width="174px" :column="2" border>
          <el-descriptions-item label="面料分类">{{
            render(detail.fabricClassification) || '-'
          }}</el-descriptions-item>
          <el-descriptions-item label="面料名称">{{ detail.fabricName || '-' }}</el-descriptions-item>
          <el-descriptions-item label="面料支数">{{
            detail.fabricThreadCount || '-'
          }}</el-descriptions-item>
          <el-descriptions-item label="面料克重">{{
            detail.fabricGramWeight || '-'
          }}</el-descriptions-item>
           <el-descriptions-item label="面料价格(净重含税)">{{
            detail.fabricPriceNetWeight || '-'
          }}</el-descriptions-item>
          <el-descriptions-item label="面料手感呈现">{{
            detail.fabricTexture || '-'
          }}</el-descriptions-item>
          <el-descriptions-item :span="2" label="面料含量">{{
            compositionText()
          }}</el-descriptions-item>
          <el-descriptions-item :span="2" label="适用类型">{{
            detail.applicableType || '-'
          }}</el-descriptions-item>
          <el-descriptions-item :span="2" label="是否含运费">{{
            detail.includeFreight === 1 ? '是' : (detail.includeFreight === 0 ? '否' : '-')
          }}</el-descriptions-item>
           <el-descriptions-item :span="2" label="备注">{{
            detail.includeFreightRemark || '-'
          }}</el-descriptions-item>
          <el-descriptions-item :span="2" label="是否含第三方检测报告">{{
            detail.includeThirdPartyReport === 1 ? '是' : (detail.includeThirdPartyReport === 0 ? '否' : '-')
          }}</el-descriptions-item>
           <el-descriptions-item :span="2" label="备注">{{
            detail.includeThirdPartyReportRemark || '-'
          }}</el-descriptions-item>
        </el-descriptions>
      </template>

      <template #otherInfo>
        <el-descriptions label-width="174px" :column="1" border>
          <el-descriptions-item label="报告">{{ detail.report || '-' }}</el-descriptions-item>
          <el-descriptions-item label="主打方向">{{
            detail.mainFocus || '-'
          }}</el-descriptions-item>
        </el-descriptions>
      </template>
    </layout>
  </div>
</template>

<script lang="ts" setup>
import { reactive, computed, onMounted } from 'vue'
import { DICT_TYPE, getDictLabel, getIntDictOptions } from '@/utils/dict'
import Layout from './layout.vue'
import { formatTime } from "@/utils";
import type { IDrawerService } from '../service/IDrawerService'
import { useFabricClassification } from '../hooks/useFabricClassification'



const [initOptions, render] = useFabricClassification()

const props = defineProps<{ detailData: object }>()

const detail = reactive<any>({})

const categoryLabel = computed(
  () => getDictLabel(DICT_TYPE.FABRIC_CATEGORY, detail?.category) || '-'
)

const getFabricLabelByKey = (key: any): string => {
  const k = String(key ?? '').trim()
  if (!k) return ''
  const options = getIntDictOptions(DICT_TYPE.FABRIC, true)
  const found = options.find(
    (opt: any) =>
      String(opt?.value ?? '') === k ||
      String(opt?.code ?? '') === k ||
      String(opt?.shortName ?? '') === k ||
      String(opt?.label ?? '') === k
  )
  return found?.label ?? k
}

const compositionText = () => {
  if (!detail.fabricContent) return
  const list = JSON.parse(detail.fabricContent)
  return list.map((i: any) => `${getFabricLabelByKey(i?.key)}${i?.value ?? ''}%`).join(' ') || '-'
}



const submit = (successCallback, handleLoading) => {
  successCallback ? successCallback() : null

}

const beforCancel = () => {
  return true
}
defineExpose<IDrawerService>({ submit, beforCancel })



onMounted(async () => {
  initOptions()
  // if (!props.id) return
  // const data: any = await getFabricCenterDetail(String(props.id)).catch(() => ({}))
  Object.assign(detail, props.detailData || {})
  console.log("detail", detail)
})
</script>

<style scoped lang="scss">
.center-detail {
  padding: 0 20px 20px 20px;
}

:deep(.el-descriptions) {
  .el-descriptions__label {
    background-color: #f4f6fa;
    color: #666666 !important;
    font-size: 14px;
    font-weight: normal;
    vertical-align: middle;
  }

  .el-descriptions__cell {
    border-color: #e5e5e5 !important;
    color: #333333;
    font-size: 14px;
    font-weight: normal;
  }

  .el-descriptions__content {
    min-width: 253.5px;
    word-break: break-all;
  }
}
</style>
