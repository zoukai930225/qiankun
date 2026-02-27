<template>
  <div class="text-14px">
    <div class="flex justify-end text-14px text-color-['#333'] font-500">
      {{ percent }}
    </div>
    <div class="flex items-center justify-end mt-4px">
      <span class="text-color-[#666]">环比</span>
      <div class="flex items-center ml-4px" :class="getClassNames">
        <div class="trend-icon"></div>
        <div>{{ displayTrendPercent }}</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps({
  percent: String,
  trendPercent: String
})

// 负数百分比 是否是
const isNegative = computed(() => {
  return !!props.trendPercent && props.trendPercent.startsWith('-')
})
const isZeroOrNull = computed(() => {
  // 去除百分号转数字
  const val = props.trendPercent
  if (val == null || val === '') return true
  const num = Number(val.replace('%', ''))
  return num === 0
})

const getClassNames = computed(() => {
  if (isZeroOrNull.value) {
    return ''
  }
  return isNegative.value ? 'down' : 'up'
})

const displayPercent = computed(() => {
  const value = props.percent
  if (value == null || value === '') return '-'
  const num = Number(String(value).replace('%', ''))
  return num === 0 ? '-' : value
})
const displayTrendPercent = computed(() => {
  const value = props.trendPercent
  if (value == null || value === '') return '-'
  const num = Number(String(value).replace('%', ''))
  return num === 0 ? '-' : value
})
</script>
<style scoped lang="scss">
.trend-icon {
  width: 14px;
  height: 14px;
}

.up {
  .trend-icon {
    color: #eb3737;
    background: url('@/assets/svgs/visualCenter/up.svg') no-repeat center;
  }
}

.down {
  .trend-icon {
    color: #349b34;
    background: url('@/assets/svgs/visualCenter/down.svg') no-repeat center;
  }
}
</style>
