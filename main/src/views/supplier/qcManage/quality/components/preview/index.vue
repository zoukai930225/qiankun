<template>
  <div class="preview-container">
    <preview-header />
    <preview-early-stage
      v-if="resolvedStageType === 'early'"
      :report="reportValue"
      :stage-type="resolvedStageType"
      :stage-label="stageLabel"
    />
    <late-stage v-else :report="reportValue" :stage-label="stageLabel" />
  </div>
</template>

<script lang="ts" setup>
import { computed, defineProps } from 'vue'

import PreviewEarlyStage from './earlyStage.vue'
import LateStage from './lateStage.vue'
import PreviewHeader from './header.vue'
import { STAGE_LABEL_MAP, type InspectionStage, type QualityInspectionReportInfo } from './types'

const props = defineProps<{
  report?: QualityInspectionReportInfo
}>()

const reportValue = computed<QualityInspectionReportInfo>(() => props.report ?? {})

const resolvedStageType = computed<InspectionStage>(() => {
  const cycle = reportValue.value.qualityInspectionCycle
  const cycleText = cycle === undefined || cycle === null ? '' : String(cycle)
  return cycleText === '3' ? 'late' : 'early'
})

const stageLabel = computed(() => {
  const cycle = reportValue.value.qualityInspectionCycle
  const cycleKey = cycle === undefined || cycle === null ? '' : String(cycle)
  return STAGE_LABEL_MAP[cycleKey as '1' | '2' | '3'] ?? ''
})
</script>

<style scoped lang="scss">
.preview-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 1240px;
  min-height: 1754px;
  // margin: 0 auto;
  padding: 0 16px;
  background-color: #ffffff;
  box-sizing: border-box;
}
</style>
