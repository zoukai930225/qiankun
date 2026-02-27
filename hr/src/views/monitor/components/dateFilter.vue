<template>
  <div class="topDateFilter">
    <div ref="timeRef" class="topDateFilter-staticsTime">
      ( 时间：{{ props.modelValue.split(',').join(' 至 ') }} )
    </div>
    <div class="topDateFilter-bg">
      <div
        class="topDateFilter-bg-timeSelect"
        v-for="(item, index) in timeList"
        :key="index"
        ref="datePickerBtnsRef"
        :class="{ 'topDateFilter-bg-timeSelect-selected': selectIndex === item.i }"
        @click="item.option(index)"
      >
        <div class="topDateFilter-bg-timeSelect-name">{{ item.name }}</div>
      </div>
      <el-tooltip
        effect="dark"
        content="自定义支持在可选时间范围内，对任意连续最多31天的数据进行分析"
        placement="bottom"
      >
        <el-icon class="topDateFilter-bg-tips" color="#606266"><Warning /></el-icon>
      </el-tooltip>
      <el-icon
        :color="dateChangePreIconColor"
        :style="{ marginRight: '6px', marginLeft: '10px', cursor: 'pointer' }"
        @click="handleToPreDate"
      >
        <ArrowLeft />
      </el-icon>
      <el-icon
        :color="dateChangePreIconColor"
        :style="{ cursor: 'pointer' }"
        @click="handleToNextDate"
      >
        <ArrowRight />
      </el-icon>
    </div>
    <div
      class="topDateFilter-datePicker"
      ref="datePickersRef"
      :style="{ marginLeft: datePickerMarginLeft, marginRight: datePickerMarginRight }"
    >
      <el-date-picker
        v-if="selectIndex === 2"
        ref="datePicker"
        type="date"
        :style="{ width: 0 }"
        v-model="selectDate"
        value-format="YYYY-MM-DD"
        format="YYYY-MM-DD"
        :disabled-date="disabledDate"
        @change="(val: string) => emit('update:model-value', val)"
      />
      <el-date-picker
        v-if="selectIndex === 3"
        type="week"
        ref="weekPicker"
        :style="{ width: 0 }"
        v-model="selectWeek"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        @calendar-change="handleCalendarChange"
      />
      <el-date-picker
        v-if="selectIndex === 4"
        type="month"
        ref="monthPicker"
        :style="{ width: 0 }"
        v-model="selectMonth"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
      />
      <el-date-picker
        v-if="selectIndex === 5"
        type="year"
        ref="yearPicker"
        :style="{ width: 0 }"
        v-model="selectYear"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
      />
      <el-date-picker
        ref="autoPicker"
        :style="{ width: 0 }"
        v-if="selectIndex === 6"
        type="daterange"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        v-model="selectAuto"
        :disabled-date="disabledDate"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { formatDate, getLast30Days, getLast7Days } from '@/utils/formatTime'

const props = withDefaults(
  defineProps<{
    modelValue: string
    defaultDateByQuery?: string
    layout?: string
  }>(),
  {
    layout: '7天, 30天, 日, 周, 月, 年, 自定义'
  }
)
const emit = defineEmits(['update:model-value', 'change'])
const ops = [
  { name: '7天', option: handleClick7Days, i: 0 },
  { name: '30天', option: handleClick30Days, i: 1 },
  { name: '日', option: handleClickDay, i: 2 },
  { name: '周', option: handleClickWeek, i: 3 },
  { name: '月', option: handleClickMonth, i: 4 },
  { name: '年', option: handleClickYear, i: 5 },
  { name: '自定义', option: handleClickAuto, i: 6 }
]
const timeList = computed(() => ops.filter((item) => props.layout.includes(item.name)))
const selectIndex = ref(2)
const timeRef = ref()
const datePicker = ref()
const weekPicker = ref()
const monthPicker = ref()
const yearPicker = ref()
const autoPicker = ref()
const datePickerMarginLeft = ref('0px')
const datePickerMarginRight = ref('0px')
const selectDate = ref('')
const selectWeek = ref('')
const selectMonth = ref('')
const selectYear = ref('')
const selectAuto = ref<string[]>([])
const timeType = ref('日')
const datePickerBtnsRef = ref()
const datePickersRef = ref()

const dateChangePreIconColor = computed(() => {
  if (
    selectIndex.value == 2 ||
    selectIndex.value == 3 ||
    selectIndex.value == 4 ||
    selectIndex.value === 5
  ) {
    return '#8C8C8C'
  }
  return 'rgba(140,140,140,0.5)'
})

const yestDay = computed(() => {
  const today = new Date()
  const date = today.getDate()
  today.setDate(date - 1)
  return formatDate(today, 'YYYY-MM-DD')
})

watch(
  () => props.modelValue,
  (val) => emit('change', val, timeType.value)
)

watch(selectWeek, handleChangeWeek)
watch(selectMonth, handleChangeMonth)
watch(selectYear, handleChangeYear)
watch(selectAuto, handleChangeAuto)

function getLeft(index: number) {
  const left =
    timeRef.value?.offsetWidth +
    36 +
    datePickerBtnsRef.value
      .filter((_, i) => i < index)
      .reduce((arr, cur) => arr + (cur?.offsetWidth ?? 0), 0)
  datePickerMarginLeft.value = left + 'px'
}

/** 点击7天 */
function handleClick7Days() {
  selectIndex.value = 0
  timeType.value = '7天'
  const res = getLast7Days().map((date: string) => formatDate(new Date(date), 'YYYY-MM-DD'))
  res[1] = yestDay.value
  emit('update:model-value', res.join(','))
}
/** 点击30天 */
function handleClick30Days() {
  selectIndex.value = 1
  timeType.value = '30天'
  const res = getLast30Days().map((date: string) => formatDate(new Date(date), 'YYYY-MM-DD'))
  res[1] = yestDay.value
  emit('update:model-value', res.join(','))
}
/** 点击日 */
async function handleClickDay(index: number) {
  selectIndex.value = 2
  timeType.value = '日'
  selectDate.value = /\,/.test(props.modelValue) ? props.modelValue.split(',')[1] : props.modelValue
  emit('update:model-value', selectDate.value)
  await nextTick()
  getLeft(index)
  datePicker.value.handleOpen()
}
/** 点击周 */
async function handleClickWeek(index: number) {
  selectIndex.value = 3
  timeType.value = '周'
  await nextTick()
  getLeft(index)
  weekPicker.value.handleOpen()
  selectDate.value = /\,/.test(props.modelValue) ? props.modelValue.split(',')[1] : props.modelValue
}
/** 点击月 */
async function handleClickMonth(index: number) {
  selectIndex.value = 4
  timeType.value = '月'
  selectMonth.value = yestDay.value
  handleChangeMonth(selectMonth.value)
  await nextTick()
  getLeft(index)
  monthPicker.value.handleOpen()
}
/** 点击年 */
async function handleClickYear(index: number) {
  selectIndex.value = 5
  timeType.value = '年'
  selectYear.value = yestDay.value
  handleChangeYear(selectYear.value)
  await nextTick()
  getLeft(index)
  yearPicker.value.handleOpen()
}
/** 点击自定义 */
async function handleClickAuto(index: number) {
  selectIndex.value = 6
  timeType.value = '自定义'
  await nextTick()
  getLeft(index)
  autoPicker.value.handleOpen()
  selectAuto.value = /\,/.test(props.modelValue)
    ? props.modelValue.split(',')
    : [props.modelValue, props.modelValue]
}

function handleCalendarChange(val) {
  handleChangeWeek(val)
  weekPicker.value.handleClose()
}

function handleChangeWeek(val) {
  const targetDate = new Date(val)
  const dayOfWeek = targetDate.getDay()
  const daysToSunday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  const startOfWeek = new Date(targetDate)
  startOfWeek.setDate(targetDate.getDate() - daysToSunday)
  const endOfWeek = new Date(targetDate)
  endOfWeek.setDate(targetDate.getDate() + (6 - daysToSunday))
  emit(
    'update:model-value',
    [startOfWeek, endOfWeek].map((date) => formatDate(date, 'YYYY-MM-DD')).join(',')
  )
}

function handleChangeMonth(val: string) {
  const date = new Date(val)
  const year = date.getFullYear()
  const month = date.getMonth()
  const startOfMonth = formatDate(new Date(year, month, 1), 'YYYY-MM-DD')
  date.setMonth(date.getMonth() + 1)
  const nextMonth = date.getMonth()
  const endOfMonth = formatDate(new Date(year, nextMonth, 0), 'YYYY-MM-DD')
  emit('update:model-value', `${startOfMonth},${endOfMonth}`)
}

function handleChangeYear(val: string) {
  const date = new Date(val)
  const year = date.getFullYear()
  const startOfYear = formatDate(new Date(year, 0, 1), 'YYYY-MM-DD')
  date.setFullYear(year + 1)
  const endOfYear = formatDate(new Date(year, 12, 0), 'YYYY-MM-DD')
  emit('update:model-value', `${startOfYear},${endOfYear}`)
}

function handleChangeAuto(val: string[]) {
  emit('update:model-value', val[0] === val[1] ? val[0] : val.join(','))
}

function handleToPreDate() {
  if (
    selectIndex.value !== 2 &&
    selectIndex.value !== 3 &&
    selectIndex.value !== 4 &&
    selectIndex.value !== 5
  )
    return
  const date = new Date(props.modelValue)
  date.setDate(date.getDate() - 1)
  emit('update:model-value', formatDate(date, 'YYYY-MM-DD'))
}

function handleToNextDate() {
  if (
    selectIndex.value !== 2 &&
    selectIndex.value !== 3 &&
    selectIndex.value !== 4 &&
    selectIndex.value !== 5
  )
    return
  const date = new Date(props.modelValue)
  date.setDate(date.getDate() + 1)
  emit('update:model-value', formatDate(date, 'YYYY-MM-DD'))
}

function disabledDate(time) {
  const day = new Date()
  day.setDate(day.getDate() - 1)
  return time > day
}
</script>

<style scoped lang="less">
.topDateFilter {
  height: calc(100%);
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  &-staticsTime {
    margin-left: auto;
    margin-right: 10px;
    font-size: 12px;
    color: #999999;
    line-height: 17px;
  }
  &-bg {
    padding-left: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 30px;
    background: #eef3fb;
    border-radius: 15px;
    &-timeSelect {
      font-size: 12px;
      color: #606266;
      line-height: 30px;
      // padding-right: 20px;
      padding-left: 10px;
      padding-right: 10px;
      cursor: pointer;
      &-selected {
        color: #ffffff;
        background: #dee6fb;
        border-radius: 15px;
        font-size: 12px;
        color: #0064ff;
        line-height: 30px;
      }

      &-line {
        width: 16px;
        height: 2px;
        background: #ffffff;
        border-radius: 2px;
      }
    }

    &-custom {
      padding-left: 18px;
      padding-right: 8px;
      font-size: 14px;
      color: #c4dbff;
      line-height: 20px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      &-line {
        margin-top: 2px;
        width: 16px;
        height: 2px;
        background: #ffffff;
        border-radius: 2px;
      }
    }
    &-customSelected {
      color: #ffffff;
    }
    &-tips {
      cursor: pointer;
      margin-left: 0px;
    }
  }
  &-datePicker {
    visibility: hidden;
    position: absolute;
  }
}
</style>
