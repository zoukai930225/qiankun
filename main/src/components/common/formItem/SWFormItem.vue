<script setup lang="ts">
import { ElFormItem } from 'element-plus'
import { computed } from 'vue'
import { computedRulesFn, type swFormItemProps } from './formItemService'



const props = withDefaults(defineProps<Partial<swFormItemProps>>(), {
  required: true,
  validateTrigger: () => ['blur', 'change'],
  pattern: '',
  patternMessage: '',
  errorText: '',
  customRules: () => [],
})
const computedRules = computed(() => computedRulesFn(props))
</script>

<template>
  <ElFormItem 
    v-bind="$attrs"
    :rules="computedRules"
    :label="label"
    :prop="prop"
    :required="required"
    :validate-trigger="validateTrigger"
  >
    <slot></slot>
  </ElFormItem>
</template>