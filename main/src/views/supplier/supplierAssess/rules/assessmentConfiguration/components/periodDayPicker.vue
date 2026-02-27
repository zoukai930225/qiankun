<template>
  <div class="period-day-picker">
    <!-- 月度模式 -->
    <div v-if="mode === 'month'" class="picker-row">
      <day-picker
        v-model="dayValue"
        :min-day="effectiveMinDay"
        placeholder="请选择"
        :disabled="disabled"
      >
        <template #prepend>
          <el-select v-model="periodValue" placeholder="请选择" :disabled="disabled">
            <el-option label="次月" :value="1" />
            <el-option label="当月" :value="0" />
          </el-select>
        </template>
      </day-picker>
    </div>

    <!-- 季度模式 -->
    <div v-if="mode === 'quarter'" class="picker-row">
      <el-select
        v-model="periodValue"
        placeholder="当季度"
        style="width: 90px; flex-shrink: 0"
        :disabled="disabled"
      >
        <el-option label="当季度" :value="0" />
        <el-option label="次季度" :value="1" />
      </el-select>

      <DayPicker
        v-model="dayValue"
        :min-day="effectiveMinDay"
        placeholder="请选择"
        :disabled="disabled"
      >
        <template #prepend>
          <el-select v-model="monthValue" placeholder="第一个月" :disabled="disabled">
            <el-option label="第一个月" :value="1" />
            <el-option label="第二个月" :value="2" />
            <el-option label="第三个月" :value="3" />
          </el-select>
        </template>
      </DayPicker>
    </div>

    <!-- 年度模式 -->
    <div v-if="mode === 'year'" class="picker-row">
      <el-select
        v-model="periodValue"
        placeholder="当年"
        style="width: 90px; flex-shrink: 0"
        :disabled="disabled"
      >
        <el-option label="当年" :value="0" />
        <el-option label="次年" :value="1" />
      </el-select>

      <DayPicker
        v-model="dayValue"
        :min-day="effectiveMinDay"
        placeholder="请选择"
        :disabled="disabled"
      >
        <template #prepend>
          <el-select v-model="monthValue" placeholder="1月" :disabled="disabled">
            <el-option v-for="m in allMonths" :key="m" :label="`${m}月`" :value="m" />
          </el-select>
        </template>
      </DayPicker>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import DayPicker from './dayPicker.vue'

const props = defineProps({
  mode: {
    type: String,
    default: 'month', // 'month' | 'quarter' | 'year'
    validator: (value) => ['month', 'quarter', 'year'].includes(value)
  },
  modelValue: {
    type: Object,
    default: () => ({})
    // 格式: { period: 0, month: 1, day: 1 }
    // period: 0=当期, 1=次期
    // month: 季度模式(1-3), 年度模式(1-12)
    // day: 1-31
  },
  // 当期(当月/当年)最小可选日期：用于限制“不可早于重复规则日”
  minDayForCurrentPeriod: {
    type: Number,
    default: undefined
  },
  // 年度模式下，当年可选的月份集合（如仅允许与重复频率相同的月份）
  allowedMonthsForCurrentYear: {
    type: Array,
    default: undefined
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

// 内部状态
const periodValue = ref(props.modelValue.period || 0)
const monthValue = ref(props.modelValue.month || 1)
const dayValue = ref(props.modelValue.day || null)

// 监听内部变化，更新父组件
watch(
  [periodValue, monthValue, dayValue],
  () => {
    const value = {
      period: periodValue.value,
      month: monthValue.value,
      day: dayValue.value
    }
    emit('update:modelValue', value)
    emit('change', value)
  },
  { deep: true }
)

// 监听外部变化，更新内部状态
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal.period !== undefined) periodValue.value = newVal.period
    if (newVal.month !== undefined) monthValue.value = newVal.month
    if ('day' in newVal) dayValue.value = newVal.day ?? null
  },
  { deep: true }
)

// 约束：当期的最小日期
// - 月度：当月受限
// - 季度：仅当期的第一个月受限
// - 年度：仅当年且所选月份等于重复频率月份时受限
const effectiveMinDay = computed(() => {
  if (periodValue.value !== 0) return undefined
  if (props.minDayForCurrentPeriod == null) return undefined
  const n = Number(props.minDayForCurrentPeriod)
  if (!Number.isFinite(n)) return undefined

  if (props.mode === 'month') return n
  if (props.mode === 'quarter') {
    // 当季度-仅首月限制
    return monthValue.value === 1 ? n : undefined
  }
  if (props.mode === 'year') {
    // 当年-仅重复频率所选月份限制
    if (
      Array.isArray(props.allowedMonthsForCurrentYear) &&
      props.allowedMonthsForCurrentYear.length
    ) {
      return props.allowedMonthsForCurrentYear.includes(monthValue.value) ? n : undefined
    }
    return undefined
  }
  return undefined
})

// 约束：年度-月份列表（年度月份不做限制）
const allMonths = Array.from({ length: 12 }, (_, i) => i + 1)

// 当前限制变化时，自动纠正越界的选择（最小日限制）
watch([effectiveMinDay, () => periodValue.value, () => monthValue.value], () => {
  if (effectiveMinDay.value == null) return
  if (dayValue.value == null) return
  const current = Number(dayValue.value)
  const min = Number(effectiveMinDay.value)
  if (!Number.isFinite(current) || !Number.isFinite(min)) return
  if (current <= min) {
    // 当天也不给选：若等于最小天，自动跳到下一天
    const next = min + 1
    dayValue.value = next > 31 ? 31 : next
  }
})

// 规则：若选择31日且目标月份没有31日，则自动回落到该月的最后一天
function getQuarterStartMonth(nowMonth) {
  const qIndex = Math.floor((nowMonth - 1) / 3) // 0..3
  return qIndex * 3 + 1 // 1,4,7,10
}

function getActualYearMonthForSelection() {
  const now = new Date()
  let year = now.getFullYear()
  if (props.mode === 'year') {
    year = year + (periodValue.value === 1 ? 1 : 0)
    return { year, month: monthValue.value }
  }
  if (props.mode === 'quarter') {
    let startMonth = getQuarterStartMonth(now.getMonth() + 1)
    // 次季度：基础月份+3，可能跨年
    let yearOffset = periodValue.value === 1 ? 1 : 0
    if (periodValue.value === 1) {
      startMonth += 3
      if (startMonth > 12) {
        startMonth -= 12
        year += 1
      }
    }
    let month = startMonth + (monthValue.value - 1)
    if (month > 12) {
      month -= 12
      year += 1
    }
    return { year, month }
  }
  return null
}

function getLastDayOfMonth(year, month1) {
  if (!year || !month1) return 31
  // 传入1-12的month，取当月最后一天
  return new Date(year, month1, 0).getDate()
}

watch(
  [() => props.mode, () => periodValue.value, () => monthValue.value, () => dayValue.value],
  () => {
    if (dayValue.value == null) return
    const ymd = getActualYearMonthForSelection()
    if (!ymd) return
    const last = getLastDayOfMonth(ymd.year, ymd.month)
    if (dayValue.value > last) {
      dayValue.value = last
    }
  }
)
</script>

<style lang="scss" scoped>
.period-day-picker {
  width: 100%;
}

.picker-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.label {
  font-size: 14px;
  color: #606266;
  margin-right: 12px;
  white-space: nowrap;
  line-height: 1.4;
}
</style>
