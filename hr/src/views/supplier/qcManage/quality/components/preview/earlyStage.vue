<template>
  <div class="report-wrapper">
    <table class="report-table">
      <thead class="report-header">
        <tr>
          <th :rowspan="2" :colspan="fullColumnSpan - 4" class="title-cell">
            <div class="title-content">
              <div class="company">杭州顶秀电子商务有限公司</div>
              <div class="title">品质检验报告</div>
            </div>
          </th>
          <th :colspan="4" class="subtitle-cell">
            <div class="subtitle-content">
              <span v-for="(option, index) in stageOptions" :key="option" class="stage-checkbox stage-checkbox--export"
                :class="{ 'is-checked': option === resolvedStageLabel }"
                :style="{ marginLeft: index > 0 ? '50px' : '0' }">
                <span class="stage-checkbox__box"></span>
                <span class="stage-checkbox__label">{{ option }}</span>
              </span>
            </div>
          </th>
        </tr>
        <tr class="base-info">
          <!-- <th :colspan="4" class="subtitle-cell subtitle-round-cell">
            <span class="round-label"></span>
            <span class="round-value">第{{ safeValue(checksNumber) }}次抽检</span>
              
          </th> -->
          <td class="label-cell" colspan="2">检验日期：</td>
          <td class="value-cell" colspan="2">{{
            safeValue(submissionDate)
          }}</td>
        </tr>
      </thead>

      <tbody class="base-info">
        <tr>
          <td class="label-cell" colspan="2">检验结果：</td>
          <td class="value-cell" :colspan="baseInfoValueColspan">{{
            safeValue(testResultText)
          }}</td>
          <!-- <td class="label-cell" colspan="2">日期：</td>
          <td class="value-cell" :colspan="baseInfoValueColspan">{{
            safeValue(submissionDate)
          }}</td> -->
          <td class="label-cell" colspan="2">款号：</td>
          <td class="value-cell" :colspan="baseInfoValueColspan">{{
            safeValue(itemNumberDisplay)
          }}</td>
        </tr>
        <tr>
          <td class="label-cell" colspan="2">供应商：</td>
          <td class="value-cell" :colspan="baseInfoValueColspan">{{
            safeValue(supplierDisplay)
          }}</td>
          <td class="label-cell" colspan="2">订单号：</td>
          <td class="value-cell" :colspan="baseInfoValueColspan">{{
            safeValue(scPurchaseOrderNo)
          }}</td>
        </tr>
        <tr>
          <!-- <td class="label-cell" colspan="2">面辅料测试：</td>
          <td class="value-cell" :colspan="baseInfoValueColspan">
            {{ safeValue(materialsAccessoriesTestText) }}
          </td> -->
          <td class="label-cell" colspan="2">款式描述：</td>
          <td class="value-cell" colspan="10">{{
            safeValue(styleDescription)
          }}</td>
        </tr>
        <!-- <tr>
          <td class="label-cell" colspan="2">巡检记录：</td>
          <td class="value-cell" :colspan="baseInfoValueColspan">{{
            safeValue(inspectionRecordText)
          }}</td>
          <td class="label-cell" colspan="2">成品抽检记录：</td>
          <td class="value-cell" :colspan="baseInfoValueColspan">
            {{ safeValue(finishProductCheckRecordText) }}
          </td>
        </tr> -->
      </tbody>

      <!-- <thead class="size-section-head">
        <tr class="section-title">
          <th :colspan="fullColumnSpan">尺寸度量</th>
        </tr>
        <tr class="size-header">
          <th rowspan="2">序号</th>
          <th rowspan="2" colspan="2" class="part-name-col">部位名称</th>
          <th rowspan="2" class="tolerance-col">公差/cm</th>
          <template v-for="size in sizeColumns" :key="size.key">
            <th :colspan="subHeadings.length">{{ size.label }}</th>
          </template>
        </tr>
        <tr class="size-sub-header">
          <template v-for="size in sizeColumns" :key="`${size.key}-sub`">
            <th v-for="sub in subHeadings" :key="`${size.key}-${sub.key}`">{{ sub.label }}</th>
          </template>
        </tr>
      </thead> -->

      <!-- <tbody class="size-section-body">
        <tr v-if="!measurementRows.length" class="empty-row">
          <td :colspan="fullColumnSpan">暂无尺寸数据</td>
        </tr>
        <tr v-for="(row, idx) in measurementRows" :key="row.index ?? idx">
          <td>{{ row.index ?? idx + 1 }}</td>
          <td class="part-name-col" :colspan="2">{{ safeValue(row.partName) }}</td>
          <td class="tolerance-col">{{ safeValue(row.tolerance) }}</td>
          <template v-for="size in sizeColumns" :key="`${size.key}-row-${idx}`">
            <td v-for="sub in subHeadings" :key="`${size.key}-${sub.key}-row-${idx}`">
              {{ formatMeasurement(row, size.key, sub.key) }}
            </td>
          </template>
        </tr>
      </tbody> -->
       <tbody class="base-info">
        <tr>
          <td class="base-title" :colspan="6">一、面辅料测试</td>
          <td class="base-title" :colspan="6">三、供应商检验记录核对</td>
        </tr>
        <tr>
          <td class="label-cell" colspan="2">测试项目：</td>
          <td class="value-cell" colspan="3">色牢度、缩率、扭曲度、纬斜、克重、手感、拉开度、布面效果</td>
          <td class="value-cell" colspan="1">{{ safeValue(matAccTestQualifiedText) }}</td>
          <td class="label-cell" colspan="2">验布记录：</td>
          <td class="value-cell" colspan="4">{{ safeValue(checkRecordIsQualifiedText) }}</td>
        </tr>
        <tr>
          <td :colspan="6" class="base-title">二、资料核对</td>
          <td class="label-cell" colspan="2">巡检记录:</td>
          <td class="value-cell" colspan="4">{{ safeValue(inspectionRecordIsQualifiedText) }}</td>
        </tr>
        <tr>
          <td class="label-cell" colspan="2">产前样、工艺单核对项目：</td>
          <td class="value-cell" colspan="3">颜色、针距、工艺、烫标洗唛、底面线、针数、粘合牢度、合格证信息</td>
          <td class="value-cell" colspan="1">{{ safeValue(dataCheckIsQualifiedText) }}</td>
          <td class="label-cell" colspan="2">成品抽查记录：</td>
          <td class="value-cell" colspan="4">{{ safeValue(finishProductQualifiedText) }}</td>
        </tr>
       </tbody>

      <tbody class="base-info">
        <tr class="section-title">
          <td :colspan="fullColumnSpan" class="base-title">问题描述</td>
        </tr>
        <tr v-for="(issue, idx) in issueList" :key="idx">
          <td class="issue-index">{{ issue.number ?? idx + 1 }}</td>
          <td class="issue-content" :colspan="fullColumnSpan - 1">
            <template v-if="issue.defectValue">{{ `${safeValue(issue.defectValue)}` }}</template>
            <template v-if="issue.defectNum">{{ `(${safeValue(issue.defectNum)})` }}</template>
            <template v-if="issue.defectValue">{{ `:` }}</template>
            {{ ` ${safeValue(issue.description)}` }}
          </td>
        </tr>
      </tbody>
      <tbody class="base-info">
        <tr>
          <td :colspan="fullColumnSpan" class="base-title">主要疵点图片</td>
        </tr>
        <tr >
          <td class="imgList" :colspan="fullColumnSpan">
            <img :src="img" alt=""  v-for="(img, idx) in mainDefectImage" :key="idx"/>
            </td>
        </tr>
        <tr >
          <td rowspan="2" :colspan="2" class="label-cell">评语：</td>
          <td rowspan="2" :colspan="fullColumnSpan - 2" class="value-cell textArea">{{ safeValue(comment) }}</td>
        </tr>
        <tr></tr>
      </tbody>

      <tbody class="base-info footer-info">
        <tr>
          <td class="label-cell" colspan="2">验货QC：</td>
          <td class="value-cell" :colspan="baseInfoValueColspan">{{ safeValue(createName) }}</td>
          <td class="label-cell" colspan="2">供应商：</td>
          <td class="value-cell" :colspan="baseInfoValueColspan"></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import {
  DEFAULT_SIZE_COLUMNS,
  type InspectionStage,
  type IssueItem,
  type MeasurementCell,
  type MeasurementRow,
  type QualityInspectionReportInfo,
  type SizeColumnItem,
  type SizeDetail,
  type SizeDetailKey
} from './types'

type SubHeading = { label: string; key: 'standard' | 'sample' }

const SUB_HEADINGS: SubHeading[] = [
  { label: '标准', key: 'standard' },
  { label: '样品', key: 'sample' }
]

const stageOptions = ['初期', '中期']

const props = defineProps<{
  report?: QualityInspectionReportInfo
  stageType?: InspectionStage
  stageLabel?: string
}>()

const reportValue = computed<QualityInspectionReportInfo>(() => props.report ?? {})

const resolvedStageLabel = computed(() => {
  if (props.stageLabel && props.stageLabel.trim()) {
    return props.stageLabel
  }
  const cycle = reportValue.value.qualityInspectionCycle
  const cycleKey = cycle === undefined || cycle === null ? '' : String(cycle)
  if (cycleKey === '2') return '中期'
  if (cycleKey === '1') return '初期'
  return props.stageType === 'early' ? '初期' : ''
})

const checksNumber = computed(() => reportValue.value.checksNumber ?? '-')

const testResultText = computed(() => mapTestResult(reportValue.value.testResults))

const submissionDate = computed(() => reportValue.value.submissionDate ?? '-')

const supplierDisplay = computed(
  () => reportValue.value.abbreviationCompany ?? reportValue.value.supplierName ?? ''
)

const itemNumberDisplay = computed(
  () => reportValue.value.itemNumberNames ?? '-'
)

const scPurchaseOrderNo = computed(() => reportValue.value.scPurchaseOrderNo ?? '-')

const materialsAccessoriesTestText = computed(() =>
  mapBinary(reportValue.value.materialsAccessoriesTest, '已做', '未做')
)
const inspectionRecordText = computed(() =>
  mapBinary(reportValue.value.inspectionRecord, '已做', '未做')
)
const finishProductCheckRecordText = computed(() =>
  mapBinary(reportValue.value.finishProductCheckRecord, '已做', '未做')
)
const matAccTestQualifiedText = computed(() =>
  mapBinary(reportValue.value.matAccTestQualified, '合格', '不合格')
)
const dataCheckIsQualifiedText = computed(() =>
  mapBinary(reportValue.value.dataCheckIsQualified, '已核对', '未核对')
)

const checkRecordIsQualifiedText = computed(() =>
  mapBinary(reportValue.value.checkRecordIsQualified, '已核对', '未核对')
)
const inspectionRecordIsQualifiedText = computed(() =>
  mapBinary(reportValue.value.inspectionRecordIsQualified, '已核对', '未核对')
)
const finishProductQualifiedText = computed(() =>
  mapBinary(reportValue.value.finishProductQualified, '已核对', '未核对')
)

// 主要疵点图片
const mainDefectImage = computed(() =>
  reportValue.value.fileIds ? reportValue.value.fileIds.split(',') : '-'
)

const comment = computed(() => reportValue.value.comment ?? '-')

const styleDescription = computed(() => reportValue.value.styleDescription ?? '-')

const inspectionQcText = computed(() => reportValue.value.inspectionQc ?? '-')
const supplierInfoText = computed(
  () => reportValue.value.supplier ?? reportValue.value.supplierName ?? '-'
)
// 登记人(验货QC)
const createName = computed(() => reportValue.value.createName)

const rawDimenMeasureList = computed(() =>
  Array.isArray(reportValue.value.dimenMeasureList) ? reportValue.value.dimenMeasureList : []
)

const hasDetailValue = (detail?: SizeDetail) => {
  if (!detail) return false
  return isMeaningfulValue(detail.standard) || isMeaningfulValue(detail.sample)
}

const sizeColumns = computed<SizeColumnItem[]>(() => {
  const list = rawDimenMeasureList.value
  const available = DEFAULT_SIZE_COLUMNS.filter((column) =>
    list.some((item) => {
      if (!column.detailKey) return false
      const detail = (item as Record<SizeDetailKey, SizeDetail | undefined>)[column.detailKey]
      return hasDetailValue(detail)
    })
  )
  return available.length > 0 ? available : DEFAULT_SIZE_COLUMNS
})

const measurementRows = computed<MeasurementRow[]>(() => {
  const list = rawDimenMeasureList.value
  return list.map((item, index) => {
    const measurements: Record<string, MeasurementCell | undefined> = {}
    sizeColumns.value.forEach((column) => {
      if (!column.detailKey) {
        measurements[column.key] = undefined
        return
      }
      const detail = (item as Record<SizeDetailKey, SizeDetail | undefined>)[column.detailKey]
      measurements[column.key] = detail
        ? {
          standard: isMeaningfulValue(detail.standard) ? detail.standard : '',
          sample: isMeaningfulValue(detail.sample) ? detail.sample : ''
        }
        : { standard: '', sample: '' }
    })
    return {
      index: index + 1,
      partName: item.partName ?? '',
      tolerance: item.tolerance ?? '',
      measurements
    }
  })
})

const issueList = computed<IssueItem[]>(() => {
  const list = Array.isArray(reportValue.value.problemDescriptionList)
    ? reportValue.value.problemDescriptionList
    : []
  const filtered = list
    .filter((item) => item && isMeaningfulValue(item.problemDescription))
    .map((item, index) => ({
      number: item.number ?? index + 1,
      defectValue:item.defectValue ?? '',
      defectNum: item.defectNum ?? '',
      description: item.problemDescription ?? ''
    }))

  // 如果不足8个，补齐到8个；超过8个正常展示
  if (filtered.length < 8) {
    const result = [...filtered]
    for (let i = filtered.length; i < 8; i++) {
      result.push({
        number: i + 1,
        defectValue:'',
        defectNum:'',
        description: ''
      })
    }
    return result
  }

  return filtered
})

const subHeadings = SUB_HEADINGS

const fullColumnSpan = computed(() => 4 + sizeColumns.value.length * subHeadings.length)

const baseInfoValueColspan = computed(() => {
  const span = (fullColumnSpan.value - 4) / 2
  return span > 0 ? span : 1
})

const safeValue = (value: unknown) => {
  if (!isMeaningfulValue(value)) {
    return '-'
  }
  return value
}

const formatMeasurement = (row: MeasurementRow, sizeKey: string, subKey: SubHeading['key']) => {
  const cell = row.measurements?.[sizeKey]
  const rawValue = cell ? cell[subKey] : undefined
  return safeValue(rawValue)
}

function isMeaningfulValue(value: unknown): boolean {
  return value !== null && value !== undefined && value !== ''
}

function mapBinary(value: unknown, trueText: string, falseText: string): string {
  if (value === '1' || value === 1) return trueText
  if (value === '0' || value === 0) return falseText
  return ''
}

function mapTestResult(value: unknown): string {
  if (value === '1' || value === 1) return '通过'
  if (value === '0' || value === 0) return '不通过'
  return ''
}
</script>

<style scoped lang="scss">
@use './reportCommon.scss';

.part-name-col,
.tolerance-col,
.issue-content {
  text-align: left !important;
}
.textArea {
  line-height: 1.6;
}
</style>
