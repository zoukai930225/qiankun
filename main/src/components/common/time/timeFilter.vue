<template>
  <div class="time-filter">
    <div v-if="label" class="time-filter-staticsLabel">{{ label }}</div>
    <div v-if="isShowTime && staticsTimeInfo" class="time-filter-staticsTime"
      >({{ `${showStr}:${staticsTimeInfo}` }})
    </div>
    <div class="topDateFilter-bg">
      <div
        class="topDateFilter-bg-timeSelect"
        v-for="(value, index) in timeOptions"
        :key="index"
        :class="{ 'topDateFilter-bg-timeSelect-selected': selectValue.index === index }"
        @click="timeSelectAction(value)"
      >
        <div class="topDateFilter-bg-timeSelect-name"
          >{{ value.label }}
          <div
            v-if="value?.isComponents && selectValue.index === index"
            :style="{ width: `${value.label?.length === 1 ? '115' : '200'}px` }"
            class="topDateFilter-bg-timeSelect-date"
          >
            <el-date-picker
              ref="dateRef"
              @change="dateChange"
              v-model="dateValue"
              :value-format="value.format"
              :type="value.componentType"
              @calendar-change="calendarChange"
              :disabled-date="(time) => disabledDate(time, value)"
            />
          </div>
        </div>
      </div>
      <el-tooltip
        v-if="isTooltip"
        :disabled="!tooltipInfo"
        effect="dark"
        :content="tooltipInfo"
        placement="bottom"
      >
        <el-icon
          :class="[!!tooltipInfo ? 'topDateFilter-bg-tips' : 'topDateFilter-bg-tips-dis']"
          color="#606266"
        >
          <Warning />
        </el-icon>
      </el-tooltip>
      <template v-if="isArrow && showArrow">
        <el-icon
          :color="color"
          :style="{ marginRight: '6px', marginLeft: '10px', cursor: isCursor }"
          @click="arrow(-1)"
        >
          <ArrowLeft />
        </el-icon>
        <el-icon :color="color" :style="{ cursor: isCursor }" @click="arrow(1)">
          <ArrowRight />
        </el-icon>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
export default { name: 'TimeFilter' }
</script>

<script lang="ts" setup>
import { TimeItem, componentConfig, typeMapLabel } from './config'
import { cloneDeep } from 'lodash-es'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')

const message = useMessage()

const props = defineProps({
  // 内置选择器（隐射预设选项）
  layout: { type: String, reuqired: false, default: '日,周,月,年,自定义' },
  // 自定义快捷选项
  swiftOptions: { type: Array<any>, reuqired: false, default: [] },
  // 映射选项
  mapOptions: { type: Array<any>, reuqired: false, default: [] },
  // 默认时间
  defaultDate: { type: [String, Array<String>], reuqired: false, default: null },
  // 默认选项
  defaultValue: { type: String, reuqired: false, default: null },
  // 是否展示所选时间
  isShowTime: { type: Boolean, reuqired: false, default: true },
  // 是否展示说明
  isTooltip: { type: Boolean, reuqired: false, default: true },
  // 时间前缀提示词
  showStr: { type: String, reuqired: false, default: '统计时间' },
  // 前缀提示词
  label: { type: String, reuqired: false, default: '' },
  // 默认格式化
  defaultFormat: { type: String, reuqired: false, default: 'YYYY-MM-DD' },
  // 连点反馈
  isFeedback: { type: Boolean, reuqired: false, default: false },
  // 是否展示箭头
  showArrow: { type: Boolean, reuqired: false, default: true }
})

const emit = defineEmits(['change'])

const dateValue: any = defineModel(),
  dateBukValue = ref<any>(null),
  dateBackValue = ref<any>(null),
  calendarValue = ref<any>()

const selectValue = ref<TimeItem>({ ...new TimeItem(), index: -Infinity }),
  dateRef = ref(),
  staticsTimeInfo = ref<string>('')

const timeOptions = computed(() => {
  const components: Array<TimeItem> = componentConfig
    .filter((cs: TimeItem) => props.layout.includes(cs.label))
    .map((cs: TimeItem) => {
      const tar: any = props.mapOptions.find((ms: any) => ms.label === cs.label)
      return { ...new TimeItem({ ...cs, ...tar }) }
    })
  return [...props.swiftOptions, ...components].map((item: any, index: number) => ({
    ...item,
    index
  }))
})

const tooltipInfo = computed(() => selectValue?.value?.tips)

const isArrow = computed(() => {
  const list: any = timeOptions.value.filter((tbs: TimeItem) => '日,周,月,年'.includes(tbs.label))
  return !!list?.length
})

const isCursor = computed(() =>
  !!dateValue.value &&
  selectValue?.value?.isComponents &&
  '日,周,月,年'.includes(selectValue?.value?.label)
    ? 'pointer'
    : 'not-allowed'
)

const color = computed(() => (isCursor.value === 'pointer' ? '#303133' : '#8c8c8c80'))

const timeSelectAction = (value: TimeItem) => {
  let oldSelectValue = cloneDeep({ ...selectValue.value })
  selectValue.value = { ...value }
  if (value?.isComponents) {
    setTimeout(() => dateRef?.value?.[0]?.handleOpen(), 0)
    value.index !== oldSelectValue.index && ((dateValue.value = null), (dateBukValue.value = null))
  } else {
    if (props.isFeedback) {
      setSwiftValue()
    } else {
      value.index !== oldSelectValue.index && setSwiftValue()
    }
  }
}

const getStaticsTimeDetail = (start: string, end: string) => {
  let showStr: string = ''
  if (end) {
    const time: any = {
      year: [dayjs(start).get('year'), dayjs(end).get('year')],
      month: [dayjs(start).get('month') + 1, dayjs(end).get('month') + 1],
      day: [dayjs(start).get('date'), dayjs(end).get('date')]
    }
    if (time.year[0] !== time.year[1]) {
      showStr = `${time.year[0]}年${time.month[0]}月${time.day[0]}日-${time.year[1]}年${time.month[1]}月${time.day[1]}日`
    } else {
      if (time.month[0] !== time.month[1]) {
        showStr = `${time.year[0]}年${time.month[0]}月${time.day[0]}日-${time.month[1]}月${time.day[1]}日`
      } else {
        if (time.day[0] !== time.day[1]) {
          showStr = `${time.year[0]}年${time.month[0]}月${time.day[0]}日-${time.day[1]}日`
        } else {
          showStr = `${time.year[0]}年${time.month[0]}月${time.day[0]}日`
        }
      }
    }
  } else {
    showStr = `${dayjs(start).get('year')}年${dayjs(start).get('month') + 1}月${dayjs(start).get('date')}日`
  }
  return showStr
}

const setStaticsInfo = () =>
  dateBackValue.value &&
  (staticsTimeInfo.value = getStaticsTimeDetail(
    Array.isArray(dateBackValue.value) ? dateBackValue.value[0] : dateBackValue.value,
    Array.isArray(dateBackValue.value) ? dateBackValue.value[1] : ''
  ))

const setSwiftValue = () => {
  const origin: any = dayjs(selectValue.value?.timeOffset?.origin || new Date()).format(
    selectValue.value?.format || props.defaultFormat
  )
  const mode: any = selectValue.value?.timeOffset?.mode || 'subtract'
  const startDate: any = selectValue.value?.timeOffset?.offset
    ? dayjs(origin)
        [mode](selectValue.value.timeOffset.offset, selectValue.value.timeOffset.type)
        .format(selectValue.value?.format || props.defaultFormat)
    : null
  dateValue.value = [startDate, origin]
  dateBukValue.value = cloneDeep(dateValue.value)
  dateBackValue.value = [startDate, origin]
  setStaticsInfo()
  emit('change', dateBackValue.value, selectValue.value)
}

const buildBackValue = () => {
  if (['日', '自定义', '30天', '7天'].includes(selectValue.value.label)) {
    dateBackValue.value = dateValue.value
  } else {
    switch (selectValue.value.label) {
      case '月':
        dateBackValue.value = [
          dayjs(dateValue.value).startOf('month').format(props.defaultFormat),
          dayjs(dateValue.value).endOf('month').format(props.defaultFormat)
        ]
        break
      case '周':
        dateBackValue.value = [
          dayjs(dateValue.value).startOf('week').format(props.defaultFormat),
          dayjs(dateValue.value).endOf('week').format(props.defaultFormat)
        ]
        break
      case '年':
        dateBackValue.value = [
          dayjs(dateValue.value).startOf('year').format(props.defaultFormat),
          dayjs(dateValue.value).endOf('year').format(props.defaultFormat)
        ]
        break
      default:
        break
    }
  }
}

const dateChange = () => {
  if (selectValue.value.beforeConfirme(dateValue.value)) {
    buildBackValue()
    setStaticsInfo()
    dateBukValue.value = cloneDeep(dateValue.value)
    emit('change', dateBackValue.value, selectValue.value)
  } else {
    dateValue.value = cloneDeep(dateBukValue.value)
    setStaticsInfo()
  }
  calendarValue.value = null
}

const disabledDate = (time: any, item: TimeItem) => item.disabledDate(time, calendarValue.value)

const calendarChange = (val: any) => (calendarValue.value = val)

const arrow = (num: number) => {
  const time: any = dayjs(dateValue.value)
    .add(num, typeMapLabel(selectValue.value?.label))
    .format(selectValue.value?.format || props.defaultFormat)
  const start: any =
    selectValue.value.timeLimit?.length && selectValue.value.timeLimit[0]
      ? new Date(selectValue.value.timeLimit[0]).getTime()
      : -Infinity
  const end: any =
    selectValue.value.timeLimit?.length && selectValue.value.timeLimit[1]
      ? new Date(selectValue.value.timeLimit[1]).getTime()
      : +Infinity
  if (new Date(time).getTime() > start && new Date(time).getTime() < end) {
    dateValue.value = cloneDeep(time)
    dateBukValue.value = cloneDeep(dateValue.value)
    dateChange()
  } else {
    message.error('超出时间限制区域')
  }
}

watch(
  [() => props.defaultValue, () => props.defaultDate],
  (val: any) => {
    const [defaultValue, defaultDate] = val
    const tar: any = timeOptions.value.find((tbs: TimeItem) => tbs.label === defaultValue)
    if (tar?.label) {
      selectValue.value = { ...tar }
      dateValue.value = defaultDate || null
      dateBukValue.value = cloneDeep(dateValue.value)
      setTimeout(() => {
        dateValue.value && (buildBackValue(), setStaticsInfo())
      }, 0)
    }
  },
  { deep: true, immediate: true }
)

defineExpose({ selectValue })
</script>
<style scoped lang="scss">
@use './style.scss';
</style>
