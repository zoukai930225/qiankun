<template>
  <div class="topDateFilter">
    <div class="topDateFilter-staticsTime" v-if="staticsTimeInfo"
      >( 交付时间：{{ staticsTimeInfo }} )</div
    >
    <div class="topDateFilter-bg" style="width: 220px">
      <div
        class="topDateFilter-bg-timeSelect"
        v-for="(value, index) in timeList"
        :key="index"
        :class="{ 'topDateFilter-bg-timeSelect-selected': selectIndex === index }"
        @click="timeSelectAction(value)"
      >
        <div class="topDateFilter-bg-timeSelect-name">{{ value.name }}</div>
      </div>

      <!-- <el-tooltip
        effect="dark"
        content="自定义支持在可选时间范围内，对任意连续最多14天的数据进行分析"
        placement="bottom"
      >
        <el-icon class="topDateFilter-bg-tips" color="#606266"><Warning /></el-icon>
      </el-tooltip> -->
      <el-icon
        :color="dateChangePreIconColor"
        style="margin-right: 6px; margin-left: 10px; cursor: pointer"
        @click="arrowLeftClick"
        ><ArrowLeft
      /></el-icon>
      <el-icon :color="dateChangeNextIconColor" style="cursor: pointer" @click="arrowRightClick"
        ><ArrowRight
      /></el-icon>
    </div>

    <div class="BIDataPicker" :style="{ right: dateTimePickerRight }">
      <el-date-picker
        v-if="selectType === 3"
        ref="dateDayPickRef"
        class="BIDataPicker-date"
        @change="dateChange"
        @visible-change="visibleChange"
        v-model="dateValue"
        value-format="YYYY-MM-DD"
        type="date"
        :disabled-date="disabledDate"
        placeholder="选择某一天"
      />
      <el-date-picker
        v-if="selectType === 4"
        ref="dateWeekPickRef"
        class="BIDataPicker-date"
        @change="dateChange"
        v-model="dateValue"
        type="week"
        format="[Week] ww"
        :disabled-date="disabledDate"
        placeholder="选择某一周"
      />
      <el-date-picker
        v-if="selectType === 5"
        ref="dateMonthPickRef"
        class="BIDataPicker-date"
        @change="dateChange"
        v-model="dateValue"
        type="month"
        :disabled-date="disabledDate"
        placeholder="选择某一周"
      />
      <el-date-picker
        v-if="selectType === 6"
        class="BIDataPicker-date"
        ref="dateRangePickRef"
        @change="dateChange"
        v-model="dateValue"
        value-format="YYYY-MM-DD"
        type="daterange"
        range-separator="-"
        :disabled-date="disabledDate"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import dayjs from 'dayjs'
import * as DateUtil from '@/utils/formatTime'

const selectIndex = ref()
const selectType = ref(3)
const dateValue = ref('')
const selectDateRange = ref([])

const dateDayPickRef = ref()
const dateWeekPickRef = ref()
const dateMonthPickRef = ref()
const dateRangePickRef = ref()
const isShowDateSelect = ref(false)

const staticsTimeInfo = ref('')

const timeList = ref([
  // {
  //   name: '7天',
  //   type: 1,
  //   date: 0
  // },
  // {
  //   name: '30天',
  //   type: 2,
  //   date: 1
  // },
  {
    name: '日',
    type: 3,
    date: 2
  },
  {
    name: '周',
    type: 4,
    date: 3
  },
  {
    name: '月',
    type: 5,
    date: 4
  },
  {
    name: '自定义',
    type: 6,
    date: 5
  }
])
const disabledDate = (time: Date) => {
  return false
}

const dateChangePreIconColor = computed(() => {
  if (selectType.value == 3 || selectType.value == 4 || selectType.value == 5) {
    return '#8C8C8C'
  }
  return 'rgba(140,140,140,0.5)'
})

const dateChangeNextIconColor = computed(() => {
  if (selectType.value == 3 || selectType.value == 4 || selectType.value == 5) {
    return '#8C8C8C'
  }
  return 'rgba(140,140,140,0.5)'
})

const dateTimePickerRight = computed(() => {
  if (selectType.value == 3) {
    // 日
    return '195px'
  } else if (selectType.value == 4) {
    // 周
    return '165px'
  } else if (selectType.value == 5) {
    // 月
    return '130px'
  } else if (selectType.value == 6) {
    // 自定义
    return '80px'
  }
  return '195px'
})

//时间筛选点击事件
const timeSelectAction = (value) => {
  if (value.type !== selectType.value) {
    isShowDateSelect.value = false
  }
  if (selectType.value === 1 || selectType.value === 2) {
    dateValue.value = ''
  }
  selectIndex.value = value.type - 3
  selectType.value = value.type
  if (value.type == 1) {
    // 7天
    if (DateUtil.getLast7Days().length > 1) {
      const beginDate = DateUtil.getLast7Days()[0] || ''
      const endDate = DateUtil.getLast7Days()[1] || ''
      staticsTimeInfo.value = getStaticsTimeDetail(beginDate.split(' ')[0], endDate.split(' ')[0])
      selectDateRange.value = [beginDate.split(' ')[0], endDate.split(' ')[0]]
    }
    sendDateSelect()
  } else if (value.type == 2) {
    // 30天
    const beginDate = DateUtil.getLast30Days()[0] || ''
    const endDate = DateUtil.getLast30Days()[1] || ''
    staticsTimeInfo.value = getStaticsTimeDetail(beginDate.split(' ')[0], endDate.split(' ')[0])
    selectDateRange.value = [beginDate.split(' ')[0], endDate.split(' ')[0]]
    sendDateSelect()
  } else if (value.type === 3) {
    if (isShowDateSelect.value) {
      isShowDateSelect.value = false
      return
    }
    if (!dateValue.value) {
      const lastDay = DateUtil.getLastDay()[0] || ''
      staticsTimeInfo.value = getStaticsTimeDetail(lastDay.split(' ')[0], '')
      dateValue.value = lastDay || ''
    }
    // 选择日
    nextTick(() => {
      dateDayPickRef.value.focus()
      isShowDateSelect.value = true
    })
  } else if (value.type === 4) {
    if (isShowDateSelect.value) {
      isShowDateSelect.value = false
      return
    }
    //选择周
    nextTick(() => {
      dateWeekPickRef.value.focus()
      isShowDateSelect.value = true
    })
  } else if (value.type === 5) {
    if (isShowDateSelect.value) {
      isShowDateSelect.value = false
      return
    }
    //选择月
    nextTick(() => {
      dateMonthPickRef.value.focus()
      isShowDateSelect.value = true
    })
  } else if (value.type === 6) {
    if (isShowDateSelect.value) {
      isShowDateSelect.value = false
      return
    }
    // 自定义
    nextTick(() => {
      dateRangePickRef.value.focus()
      isShowDateSelect.value = true
    })
  }
}

const dateChange = () => {
  if (selectType.value == 3) {
    staticsTimeInfo.value = getStaticsTimeDetail(dateValue.value, '')
    selectDateRange.value = [dateValue.value, dateValue.value]
    sendDateSelect()
  } else if (selectType.value == 4) {
    // 周
    const beginDate = dayjs(dateValue.value).startOf('week').add(0, 'day').format('YYYY-MM-DD')
    const endDate = dayjs(dateValue.value).endOf('week').add(0, 'day').format('YYYY-MM-DD')
    staticsTimeInfo.value = getStaticsTimeDetail(beginDate, endDate)
    selectDateRange.value = [beginDate, endDate]
    sendDateSelect()
  } else if (selectType.value == 5) {
    // 月
    const beginDate = dayjs(dateValue.value).startOf('month').add(0, 'day').format('YYYY-MM-DD')
    const endDate = dayjs(dateValue.value).endOf('month').add(0, 'day').format('YYYY-MM-DD')
    staticsTimeInfo.value = getStaticsTimeDetail(beginDate, endDate)
    selectDateRange.value = [beginDate, endDate]
    sendDateSelect()
  } else if (selectType.value == 6) {
    // 自定义
    if (dateValue.value && dateValue.value.length > 0) {
      staticsTimeInfo.value = getStaticsTimeDetail(dateValue.value[0], dateValue.value[1])
      selectDateRange.value = [dateValue.value[0], dateValue.value[1]]
      sendDateSelect()
    }
  }
}

const getStaticsTimeDetail = (beginDate, endDate) => {
  const beginYear = beginDate.split('-')[0] || ''
  if (endDate) {
    const beginMonth = beginDate.split('-')[1] || ''
    const beginDay = beginDate.split('-')[2] || ''

    const endYear = endDate.split('-')[0]
    const endMonth = endDate.split('-')[1] || ''
    const endDay = endDate.split('-')[2] || ''

    if (beginYear === endYear) {
      if (beginMonth === endMonth) {
        return `${beginYear}年${beginMonth}月${beginDay}日-${endDay}日`
      } else {
        return `${beginYear}年${beginMonth}月${beginDay}日-${endMonth}月${endDay}日`
      }
    } else {
      return `${beginYear}年${beginMonth}月${beginDay}日-${endYear}年${endMonth}月${endDay}日`
    }
  } else {
    return `${beginYear}年${beginDate.split('-')[1] || ''}月${beginDate.split('-')[2] || ''}日`
  }
}

const visibleChange = (visibility) => {
  isShowDateSelect.value = visibility
}

const arrowLeftClick = () => {
  if (selectType.value == 3) {
    //日
    let currentTimeStamp = DateUtil.dateToTimestamp(`${dateValue.value || ''}`)
    currentTimeStamp = currentTimeStamp - 24 * 60 * 60 * 1000
    dateValue.value = DateUtil.timestampToDateYYYYMMDD(currentTimeStamp)
    selectDateRange.value = [dateValue.value, dateValue.value]
    staticsTimeInfo.value = getStaticsTimeDetail(dateValue.value, '')
    sendDateSelect()
  } else if (selectType.value == 4) {
    //周
    if (selectDateRange.value && selectDateRange.value[0] && selectDateRange.value[1]) {
      let beginTimeStamp = DateUtil.dateToTimestamp(selectDateRange.value[0])
      let endTimeStamp = DateUtil.dateToTimestamp(selectDateRange.value[1])
      let weekTimeStamp = 24 * 60 * 60 * 1000 * 7
      beginTimeStamp = beginTimeStamp - weekTimeStamp
      endTimeStamp = endTimeStamp - weekTimeStamp

      const beginDate = DateUtil.timestampToDateYYYYMMDD(beginTimeStamp)
      const endDate = DateUtil.timestampToDateYYYYMMDD(endTimeStamp)
      selectDateRange.value = [beginDate, endDate]
      staticsTimeInfo.value = getStaticsTimeDetail(beginDate, endDate)
      sendDateSelect()
    }
  } else if (selectType.value == 5) {
    //月
    if (selectDateRange.value && selectDateRange.value[0] && selectDateRange.value[1]) {
      let beginTimeStamp = DateUtil.dateToTimestamp(selectDateRange.value[0])
      let endTimeStamp = DateUtil.dateToTimestamp(selectDateRange.value[1])
      const currentMonth = Number(selectDateRange.value[0].split('-')[1])
      const currentYear = Number(selectDateRange.value[0].split('-')[0])
      let preMonth = 0
      if (currentMonth === 1) {
        preMonth = 12
      } else if (currentMonth === 12) {
        preMonth = 1
      } else {
        preMonth = currentMonth - 1
      }
      let weekTimeStamp = 24 * 60 * 60 * 1000 * 30
      if ([1, 3, 5, 7, 8, 10, 12].includes(preMonth)) {
        weekTimeStamp = 24 * 60 * 60 * 1000 * 31
      } else if ([2].includes(preMonth)) {
        if ((currentYear % 4 === 0 && currentYear % 100 !== 0) || currentYear % 400 === 0) {
          weekTimeStamp = 24 * 60 * 60 * 1000 * 29
        } else {
          weekTimeStamp = 24 * 60 * 60 * 1000 * 28
        }
      }
      beginTimeStamp = beginTimeStamp - weekTimeStamp
      endTimeStamp = endTimeStamp - weekTimeStamp

      const beginDate = DateUtil.timestampToDateYYYYMMDD(beginTimeStamp)
      const endDate = DateUtil.timestampToDateYYYYMMDD(endTimeStamp)
      selectDateRange.value = [beginDate, endDate]
      staticsTimeInfo.value = getStaticsTimeDetail(beginDate, endDate)
      sendDateSelect()
    }
  }
}

const arrowRightClick = () => {
  if (selectType.value == 3) {
    //日
    let currentTimeStamp = DateUtil.dateToTimestamp(dateValue.value || '')
    currentTimeStamp = currentTimeStamp + 24 * 60 * 60 * 1000
    dateValue.value = DateUtil.timestampToDateYYYYMMDD(currentTimeStamp)
    staticsTimeInfo.value = getStaticsTimeDetail(dateValue.value, '')
    selectDateRange.value = [dateValue.value, dateValue.value]
    sendDateSelect()
  } else if (selectType.value == 4) {
    //周
    if (selectDateRange.value && selectDateRange.value[0] && selectDateRange.value[1]) {
      let beginTimeStamp = DateUtil.dateToTimestamp(selectDateRange.value[0])
      let endTimeStamp = DateUtil.dateToTimestamp(selectDateRange.value[1])
      let weekTimeStamp = 24 * 60 * 60 * 1000 * 7
      beginTimeStamp = beginTimeStamp + weekTimeStamp
      endTimeStamp = endTimeStamp + weekTimeStamp

      const beginDate = DateUtil.timestampToDateYYYYMMDD(beginTimeStamp)
      const endDate = DateUtil.timestampToDateYYYYMMDD(endTimeStamp)
      selectDateRange.value = [beginDate, endDate]
      staticsTimeInfo.value = getStaticsTimeDetail(beginDate, endDate)
      sendDateSelect()
    }
  } else if (selectType.value == 5) {
    //月
    if (selectDateRange.value && selectDateRange.value[0] && selectDateRange.value[1]) {
      let beginTimeStamp = DateUtil.dateToTimestamp(selectDateRange.value[0])
      let endTimeStamp = DateUtil.dateToTimestamp(selectDateRange.value[1])
      let weekTimeStamp = 24 * 60 * 60 * 1000 * 30
      const currentMonth = Number(selectDateRange.value[0].split('-')[1])
      const currentYear = Number(selectDateRange.value[0].split('-')[0])
      if ([1, 3, 5, 7, 8, 10, 12].includes(currentMonth)) {
        weekTimeStamp = 24 * 60 * 60 * 1000 * 31
      } else if ([2].includes(currentMonth)) {
        if ((currentYear % 4 === 0 && currentYear % 100 !== 0) || currentYear % 400 === 0) {
          weekTimeStamp = 24 * 60 * 60 * 1000 * 29
        } else {
          weekTimeStamp = 24 * 60 * 60 * 1000 * 28
        }
      }
      beginTimeStamp = beginTimeStamp + weekTimeStamp
      endTimeStamp = endTimeStamp + weekTimeStamp

      const beginDate = DateUtil.timestampToDateYYYYMMDD(beginTimeStamp)
      const endDate = DateUtil.timestampToDateYYYYMMDD(endTimeStamp)
      selectDateRange.value = [beginDate, endDate]
      staticsTimeInfo.value = getStaticsTimeDetail(beginDate, endDate)
      sendDateSelect()
    }
  }
}

selectDateRange.value = []

const emit = defineEmits(['sendDateSelect'])

// 发送日期选择
const sendDateSelect = () => {
  emit('sendDateSelect', selectDateRange.value)
}

sendDateSelect()
// 清空时间
const resetTime = () => {
  selectIndex.value = -1
  selectDateRange.value = []
  staticsTimeInfo.value = ''
  emit('sendDateSelect', [])
}

defineExpose({ resetTime })
</script>

<style scoped lang="scss">
.topDateFilter {
  height: calc(100%);
  display: flex;
  flex-direction: row;
  align-items: center;
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
    width: 312px;
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
}
.BIDataPicker {
  position: absolute;
  top: 20px;
  z-index: -1;
}
</style>

<style scoped>
:deep(.el-date-editor.el-input, .el-date-editor.el-input__wrapper) {
  width: 100px; /* 设置为所需的宽度 */
}
:deep(.el-date-editor--daterange, .el-date-editor--timerange) {
  width: 100px; /* 设置为所需的宽度 */
}
</style>
