<template>
  <div class="center-detail">
    <Layout>
      <template #basicInfo>
        <el-descriptions label-width="174px" :column="2" border>
          <!-- <el-descriptions-item label="品类">{{ categoryLabel }}</el-descriptions-item> -->
          <el-descriptions-item label="品类">{{ detail?.completeCategoryName || '-' }}</el-descriptions-item>
          <el-descriptions-item label="企划时间">{{ detail.planTime || '-' }}</el-descriptions-item>
          <el-descriptions-item label="企划季度">{{
            detail.planQuarter || '-'
          }}</el-descriptions-item>
        </el-descriptions>
      </template>

      <template #fabricInfo>
        <el-descriptions label-width="174px" :column="2" border>
          <el-descriptions-item label="面料分类">{{
            detail.classNames || '-'
          }}</el-descriptions-item>
          <el-descriptions-item label="面料名称">{{ detail.name || '-' }}</el-descriptions-item>
          <el-descriptions-item label="面料支数">{{
            detail.weavingNumber || '-'
          }}</el-descriptions-item>
          <el-descriptions-item label="面料克重">{{
            detail.gramWeight || '-'
          }}</el-descriptions-item>
          <!-- <el-descriptions-item label="单条价格(成本价)">{{
            detail.costPrice || '-'
          }}</el-descriptions-item>
          <el-descriptions-item label="多条价格(售卖价)">{{
            detail.sellingPrice || '-'
          }}</el-descriptions-item>
          <el-descriptions-item :span="2" label="面料手感呈现">{{
            detail.feel || '-'
          }}</el-descriptions-item>
          <el-descriptions-item :span="2" label="面料含量">{{
            compositionText
          }}</el-descriptions-item> -->
           <el-descriptions-item label="面料价格(净重含税)">{{
            detail.fabricPriceNetWeight || '-'
          }}</el-descriptions-item>
          <el-descriptions-item label="面料手感呈现">{{
            detail.feel || '-'
          }}</el-descriptions-item>
          <el-descriptions-item :span="2" label="面料含量">{{
            compositionText
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
            detail.mainDirection || '-'
          }}</el-descriptions-item>
        </el-descriptions>
      </template>
    </Layout>
  </div>
</template>

<script lang="ts" setup>
import { reactive, computed, onMounted } from 'vue'
import Layout from './layout.vue'
import { DICT_TYPE, getDictLabel, getIntDictOptions } from '@/utils/dict'
import { getFabricCenterDetail } from '@/api/supplier/fabricManagement/center'

const props = defineProps<{ id?: string | number }>()

const detail = reactive<any>({})

const categoryLabel = computed(
  () => getDictLabel(DICT_TYPE.FABRIC_CATEGORY, detail?.category) || '-'
)

// const displayYarnCount = computed(() => {
//   const v =
//   if (!v) return '-'
//   const text = String(v)
//   return text.includes('支') ? text : `${text}支`
// })

// const displayWeight = computed(() => {
//   const v = detail?.gramWeight
//   if (!v) return '-'
//   const text = String(v)
//   return text.includes('g') ? text : `${text}g`
// })

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

const compositionText = computed(() => {
  // Prefer array from contentList
  const list = detail?.contentList
  if (Array.isArray(list) && list.length > 0) {
    return list.map((i: any) => `${getFabricLabelByKey(i?.key)}${i?.value ?? ''}%`).join(' ')
  }
  // Fallback: parse JSON string from content
  const content = detail?.content
  if (typeof content === 'string') {
    try {
      const parsed = JSON.parse(content)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((i: any) => `${getFabricLabelByKey(i?.key)}${i?.value ?? ''}%`).join(' ')
      }
    } catch {}
  } else if (Array.isArray(content) && content.length > 0) {
    return content.map((i: any) => `${getFabricLabelByKey(i?.key)}${i?.value ?? ''}%`).join(' ')
  }
  return '-'
})

onMounted(async () => {
  if (!props.id) return
  const data: any = await getFabricCenterDetail(String(props.id)).catch(() => ({}))
  Object.assign(detail, data || {})
})
</script>

<style scoped lang="scss">
.center-detail {
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
  }
}
</style>
