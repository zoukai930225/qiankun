<template>
  <span :key="currentKey">{{ isFloor ? format(Math.floor(outputValue)) : format(outputValue) }}</span>
</template>

<script lang="ts" setup>
import { useTransition } from '@vueuse/core'
import { numberFormatter } from '@/utils/formatter'
const props = defineProps({
  currentKey: {
    type: String,
    default: ''
  },
  txt: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number,
    default: 1500
  },
  transition: {
    type: Boolean,
    default: true
  },
  type: {
    type: String,
    default: 'none',
    validator: (val: string) => ['none', 'number', 'amount', 'percent', 'integer'].includes(val)
  },
  // 是否取整
  isFloor: {
    type: Boolean,
    default: true
  }
})

const format = (txt: any) => {
  if (props.type === 'number') return numberFormatter(txt)
  if (props.type === 'integer')
    return numberFormatter(txt, { minimumFractionDigits: 0, maximumFractionDigits: 0 })
  if (props.type === 'amount') return numberFormatter(txt, { style: 'currency', currency: 'CNY' })
  if (props.type === 'percent') return `${numberFormatter(txt)}%`
  return txt
}

const source = ref(0)
let outputValue

watch(
  () => props.txt,
  (newVal) => {
    if (!props.transition) {
      outputValue = props.txt
      return
    }
    source.value = 0
    outputValue = useTransition(source, {
      duration: props.duration || 1500
    })
    source.value = props.txt
  },
  {
    immediate: true
  }
)
</script>
