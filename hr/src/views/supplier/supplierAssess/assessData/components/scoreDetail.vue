<script setup lang="ts">
import { queryAssessmentDataScoreApi } from '@/api/supplier/assess'
import assessmentProgressDrawer from '../../assess/component/assessmentProgressDrawer.vue'
import type { Props, Emit } from '../../assess/component/assessmentProgressDrawer.vue'

const props = withDefaults(defineProps<Props>(), {
  api: queryAssessmentDataScoreApi
})

const emit = defineEmits<Emit>()
</script>

<template>
  <assessment-progress-drawer
    v-bind="{ ...props, title: '分数明细' }"
    @update:model-value="(value) => emit('update:model-value', value)"
  />
</template>

<style lang="less" scoped></style>
