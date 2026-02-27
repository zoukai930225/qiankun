<template>
  <div class="topDateFilter">
    <div class="topDateFilter-staticsTime">( 统计时间：{{ staticsTimeInfo }} )</div>
    <div class="topDateFilter-bg">
      <div class="topDateFilter-bg-timeSelect" v-for="(value, index) in timeList" :key="index"
        :class="{ 'topDateFilter-bg-timeSelect-selected': selectIndex === index }" @click="timeSelectAction(value)">
        <div class="topDateFilter-bg-timeSelect-name">{{ value.name }}</div>
      </div>
      <el-tooltip effect="dark" content="自定义支持在可选时间范围内，对任意连续最多31天的数据进行分析" placement="bottom">
        <el-icon class="topDateFilter-bg-tips" color="#606266">
          <Warning />
        </el-icon>
      </el-tooltip>
      <!-- <el-icon :color="dateChangePreIconColor" style="margin-right: 6px; margin-left: 10px; cursor: pointer"
        @click="arrowLeftClick">
        <ArrowLeft />
      </el-icon>
      <el-icon :color="dateChangeNextIconColor" style="cursor: pointer" @click="arrowRightClick">
        <ArrowRight />
      </el-icon> -->
    </div>

    <div class="BIDataPicker" :style="{ right: dateTimePickerRight }">
      <el-date-picker v-if="selectType === 3" ref="dateDayPickRef" class="BIDataPicker-date" @change="dateChange"
        @visible-change="visibleChange" v-model="dateValue" value-format="YYYY-MM-DD" type="date"
        :disabled-date="disabledDate" placeholder="选择某一天" />
      <el-date-picker v-if="selectType === 4" ref="dateWeekPickRef" class="BIDataPicker-date" @change="dateChange"
        v-model="dateValue" type="week" format="[Week] ww" :disabled-date="disabledDate" placeholder="选择某一周" />
      <el-date-picker v-if="selectType === 5" ref="dateMonthPickRef" class="BIDataPicker-date" @change="dateChange"
        v-model="dateValue" type="month" :disabled-date="disabledDate" placeholder="选择某一月" />
      <el-date-picker v-if="selectType === 6" class="BIDataPicker-date" ref="dateRangePickRef" @change="dateChange"
        v-model="dateValue" value-format="YYYY-MM-DD " type="daterange" range-separator="-"
        :disabled-date="disabledDate" start-placeholder="开始时间" end-placeholder="结束时间" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import dayjs from 'dayjs'
import * as DateUtil from '@/utils/formatTime'
import * as BiApi from '@/api/bi/goods'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')
const message = useMessage()

const dateValue = ref<string | string[]>('')
const selectDateRange = ref<string[]>([])

const dateDayPickRef = ref()
const dateWeekPickRef = ref()
const dateMonthPickRef = ref()
const dateRangePickRef = ref()
const isShowDateSelect = ref(false)

const staticsTimeInfo = ref('')
const MaxTime = ref('')

const props = defineProps({
  defaultDateByQuery: {
    type: String,
    reuqired: false
  },
  //使用 bi新规则
  useNewRule: {
    type: Boolean,
    default: false
  },
  beforeDateSwitch: Function,
  defaultIdx: {
    type: Number,
    default: 0
  }
})

const selectIndex = ref(props.defaultIdx)
const selectType = ref(props.defaultIdx + 4) // 修正映射关系：0->4(周), 1->5(月), 2->6(自定义)
const currentClickValue = ref<{ type: number; name: string; date: number } | null>(null) // 暂存当前点击的选项

watch(() => props.defaultIdx, (newVal) => {
  selectIndex.value = newVal // 直接使用defaultIdx，它对应timeList数组的索引
  console.log(newVal, 'newVal')
  selectType.value = newVal + 4 // 修正映射关系：0->4(周), 1->5(月), 2->6(自定义)

  // 重新处理默认日期，确保dateValue格式正确
  if (props.defaultDateByQuery && props.defaultDateByQuery.includes(',')) {
    const [beginDate, endDate] = props.defaultDateByQuery.split(',')
    if (selectType.value === 4) { // 周选择
      dateValue.value = beginDate
    } else if (selectType.value === 6) { // 自定义选择
      dateValue.value = [beginDate, endDate]
    } else {
      dateValue.value = beginDate
    }
  }

  // 可传可不传，传了就是初始化数据
  dateChange()
})

// // 监听默认日期查询参数的变化
watch(() => props.defaultDateByQuery, (newVal) => {
  if (newVal) {
    if (newVal.includes(',')) {
      const [beginDate, endDate] = newVal.split(',')
      staticsTimeInfo.value = getStaticsTimeDetail(beginDate, endDate)
      // 根据当前选择类型设置正确的dateValue格式
      if (selectType.value === 4) { // 周选择
        dateValue.value = beginDate
      } else if (selectType.value === 6) { // 自定义选择
        dateValue.value = [beginDate, endDate]
      } else {
        dateValue.value = beginDate
      }
      selectDateRange.value = [beginDate, endDate]
    } else {
      staticsTimeInfo.value = getStaticsTimeDetail(newVal, '')
      dateValue.value = newVal
      selectDateRange.value = [newVal, newVal]
    }
    // 更新显示
    dateChange()
  }
})

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
  // {
  //   name: '日',
  //   type: 3,
  //   date: 2
  // },
  {
    name: '周',
    type: 4,
    date: 0
  },
  {
    name: '月',
    type: 5,
    date: 1
  },
  {
    name: '自定义',
    type: 6,
    date: 2
  }
])
const disabledDate = (time: Date) => {
  console.log(MaxTime.value, 'MaxTime.value')
  if (MaxTime.value) {
    return time.getTime() > new Date(MaxTime.value).getTime()
  }
  if (selectType.value === 4) {
    //当前周不能点击
    const weekEnd = dayjs().startOf('week').subtract(1, 'day').endOf('week')
    return time.getTime() > weekEnd.toDate().getTime()
  }
  if (selectType.value === 3) { // 日期选择模式
    const today = new Date(new Date().setHours(0, 0, 0, 0));
    return time.getTime() >= today.getTime();
  }
  return time.getTime() > Date.now()
}



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
const newType = ref(0) //（ 0--日、1--周（周一 <—> 周日）、2--月、3--自定义、7--7天、30--30天）
//时间筛选点击事件
const timeSelectAction = (value: { type: number; name: string; date: number }) => {
  if (props.beforeDateSwitch) {
    if (!props.beforeDateSwitch(value)) {
      return
    }
  }
  if (value.type !== selectType.value) {
    isShowDateSelect.value = false
  }
  if (selectType.value === 1 || selectType.value === 2) {
    dateValue.value = ''
  }

  // 不要在这里立即设置selectIndex和selectType，应该在实际选择日期后才设置
  if (value.type == 1) {
    // 7天
    if (DateUtil.getLast7Days().length > 1) {
      const endDate = MaxTime.value ? MaxTime.value : DateUtil.getLast7Days()[1] || ''
      const beginDate = dayjs(endDate).subtract(6, 'day').format('YYYY-MM-DD HH:mm:ss')
      const beginDateStr = typeof beginDate === 'string' ? beginDate.split(' ')[0] : ''
      const endDateStr = typeof endDate === 'string' ? endDate.split(' ')[0] : ''

      staticsTimeInfo.value = getStaticsTimeDetail(beginDateStr, endDateStr)
      selectDateRange.value = [beginDateStr, endDateStr]
    }
    // 7天选择立即设置激活状态
    selectIndex.value = value.date
    selectType.value = value.type
    dateType.value = 1
    newType.value = 7
    sendDateSelect()
  } else if (value.type == 2) {
    // 30天

    const endDate = MaxTime.value ? MaxTime.value : DateUtil.getLast30Days()[1] || ''
    const beginDate = dayjs(endDate).subtract(29, 'day').format('YYYY-MM-DD HH:mm:ss')
    const beginDateStr = typeof beginDate === 'string' ? beginDate.split(' ')[0] : ''
    const endDateStr = typeof endDate === 'string' ? endDate.split(' ')[0] : ''

    staticsTimeInfo.value = getStaticsTimeDetail(beginDateStr, endDateStr)
    selectDateRange.value = [beginDateStr, endDateStr]
    // 30天选择立即设置激活状态
    selectIndex.value = value.date
    selectType.value = value.type
    dateType.value = 1
    newType.value = 30
    sendDateSelect()
  } else if (value.type === 3) {
    if (isShowDateSelect.value) {
      isShowDateSelect.value = false
      return
    }
    // 暂存当前点击的选项信息，等用户实际选择日期后再设置激活状态
    currentClickValue.value = value
    if (!dateValue.value) {
      // 如果有特定的默认日期
      if (props.defaultDateByQuery) {
        staticsTimeInfo.value = getStaticsTimeDetail(props.defaultDateByQuery, '')
        dateValue.value = props.defaultDateByQuery || ''
      } else {
        const lastDay = DateUtil.getLastDay()[0] || ''
        const lastDayStr = typeof lastDay === 'string' ? lastDay.split(' ')[0] : ''
        staticsTimeInfo.value = getStaticsTimeDetail(lastDayStr, '')
        dateValue.value = lastDayStr
      }
    }
    selectType.value = value.type
    dateType.value = 1
    newType.value = 0
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
    // 暂存当前点击的选项信息，等用户实际选择日期后再设置激活状态
    currentClickValue.value = value
    selectType.value = value.type
    dateType.value = 2
    newType.value = 1
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
    // 暂存当前点击的选项信息，等用户实际选择日期后再设置激活状态
    currentClickValue.value = value
    selectType.value = value.type
    dateType.value = 3
    newType.value = 2
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
    // 暂存当前点击的选项信息，等用户实际选择日期后再设置激活状态
    currentClickValue.value = value
    selectType.value = value.type
    dateType.value = 1
    newType.value = 3
    // 自定义
    nextTick(() => {
      dateRangePickRef.value.focus()
      isShowDateSelect.value = true
    })
  }
}

const dateChange = (e: boolean | string = false) => {
  if (selectType.value == 3) {
    // 确保 dateValue.value 是字符串类型
    const dateStr = typeof dateValue.value === 'string' ? dateValue.value : String(dateValue.value || '')
    staticsTimeInfo.value = getStaticsTimeDetail(dateStr, '')
    selectDateRange.value = [dateStr, dateStr]
    // 设置激活状态：用户选择时或初始化时
    if (e && currentClickValue.value) {
      selectIndex.value = currentClickValue.value.date
      currentClickValue.value = null
      sendDateSelect()
    }
  } else if (selectType.value == 4) {
    // 周
    const dateStr = typeof dateValue.value === 'string' ? dateValue.value : String(dateValue.value || '')
    const beginDate = dayjs(dateStr).startOf('week').add(0, 'day').format('YYYY-MM-DD')
    const endDate = dayjs(dateStr).endOf('week').add(0, 'day').format('YYYY-MM-DD')
    staticsTimeInfo.value = getStaticsTimeDetail(beginDate, endDate)
    selectDateRange.value = [beginDate, endDate]
    // 设置激活状态：用户选择时或初始化时
    if (e && currentClickValue.value) {
      selectIndex.value = currentClickValue.value.date
      currentClickValue.value = null
      sendDateSelect()
    } else if (!e && selectType.value === 4) {
      // 初始化时确保周模式的selectIndex正确设置为0
      selectIndex.value = 0
      sendDateSelect()
    }
  } else if (selectType.value == 5) {
    // 月
    const dateStr = typeof dateValue.value === 'string' ? dateValue.value : String(dateValue.value || '')
    const beginDate = dayjs(dateStr).startOf('month').add(0, 'day').format('YYYY-MM-DD')
    const endDate = dayjs(dateStr).endOf('month').add(0, 'day').format('YYYY-MM-DD')
    staticsTimeInfo.value = getStaticsTimeDetail(beginDate, endDate)
    selectDateRange.value = [beginDate, endDate]
    // 设置激活状态：用户选择时或初始化时
    if (e && currentClickValue.value) {
      selectIndex.value = currentClickValue.value.date
      currentClickValue.value = null
      sendDateSelect()
    } else if (!e && selectType.value === 5) {
      // 初始化时确保月模式的selectIndex正确设置为1
      selectIndex.value = 1
      sendDateSelect()
    }
  } else if (selectType.value == 6) {
    // 自定义
    if (dateValue.value && Array.isArray(dateValue.value) && dateValue.value.length > 0) {
      // 加上校验，自定义时间段不能超过31天，如果超过则弹出提醒
      const start = dayjs(dateValue.value[0])
      const end = dayjs(dateValue.value[1])
      const diff = Math.abs(end.diff(start, 'day')) + 1 //包含终止日

      if (diff > 31) {
        message.error('自定义时间段不能超过31天')
        dateValue.value = ''
        return
      }
      staticsTimeInfo.value = getStaticsTimeDetail(dateValue.value[0], dateValue.value[1])
      selectDateRange.value = [dateValue.value[0], dateValue.value[1]]
      // 设置激活状态：用户选择时或初始化时
      if (e && currentClickValue.value) {
        selectIndex.value = currentClickValue.value.date
        currentClickValue.value = null
        sendDateSelect()
      } else if (!e && selectType.value === 6) {
        // 初始化时确保自定义模式的selectIndex正确设置为2
        selectIndex.value = 2
        sendDateSelect()
      }
    }
  }
}

const getStaticsTimeDetail = (beginDate: string, endDate: string) => {
  // 确保参数是字符串类型
  const beginDateStr = typeof beginDate === 'string' ? beginDate : String(beginDate || '')
  const endDateStr = typeof endDate === 'string' ? endDate : String(endDate || '')

  // 检查日期格式是否正确
  if (!beginDateStr || !beginDateStr.includes('-')) {
    return ''
  }

  const beginYear = beginDateStr.split('-')[0] || ''
  if (endDateStr) {
    if (!endDateStr.includes('-')) {
      return ''
    }

    const beginMonth = beginDateStr.split('-')[1] || ''
    const beginDay = beginDateStr.split('-')[2] || ''

    const endYear = endDateStr.split('-')[0]
    const endMonth = endDateStr.split('-')[1] || ''
    const endDay = endDateStr.split('-')[2] || ''

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
    return `${beginYear}年${beginDateStr.split('-')[1] || ''}月${beginDateStr.split('-')[2] || ''}日`
  }
}

const visibleChange = (visibility: boolean) => {
  isShowDateSelect.value = visibility
  // 如果选择器关闭且没有实际选择日期，清除暂存的点击值
  if (!visibility && currentClickValue.value) {
    currentClickValue.value = null
  }
}


// 最大日期
const getInitTime = () => {
  BiApi.queryBiMaxDate().then((res) => {
    MaxTime.value = res.biMaxDate
    staticsTimeInfo.value = MaxTime.value
    dateValue.value = MaxTime.value
    selectDateRange.value = [dateValue.value, dateValue.value]
    dateChange()
  }).catch((error) => {
    console.error('获取最大日期失败:', error)
    // 使用默认日期作为后备
    const defaultDate = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
    MaxTime.value = defaultDate
    staticsTimeInfo.value = defaultDate
    dateValue.value = defaultDate
    selectDateRange.value = [defaultDate, defaultDate]
    dateChange()
  })
}

// 如果有特定的默认日期
if (props.defaultDateByQuery) {
  if (props.defaultDateByQuery.includes(',')) {
    const [beginDate, endDate] = props.defaultDateByQuery.split(',')
    staticsTimeInfo.value = getStaticsTimeDetail(beginDate, endDate)
    // 根据当前选择类型设置正确的dateValue格式
    if (selectType.value === 4) { // 周选择
      dateValue.value = beginDate
    } else if (selectType.value === 6) { // 自定义选择
      dateValue.value = [beginDate, endDate]
    } else {
      dateValue.value = beginDate
    }
    selectDateRange.value = [beginDate, endDate]
  } else {
    staticsTimeInfo.value = getStaticsTimeDetail(props.defaultDateByQuery, '')
    dateValue.value = props.defaultDateByQuery
    selectDateRange.value = [props.defaultDateByQuery, props.defaultDateByQuery]
  }
}

const emit = defineEmits(['sendDateSelect'])

const dateType = ref(1) // 类别 1-日 2-周 3-月
// 选择自定义日期或者 7天，30天，日

// 发送日期选择
const sendDateSelect = () => {
  emit('sendDateSelect', selectDateRange.value, dateType.value, newType.value)
}

sendDateSelect()
</script>

<style scoped lang="scss">
.topDateFilter {
  // height: calc(100%);
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
    width: 151px;
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
  z-index: -1;
}
</style>

<style scoped>
:deep(.el-date-editor.el-input, .el-date-editor.el-input__wrapper) {
  width: 100px;
  /* 设置为所需的宽度 */
}

:deep(.el-date-editor--daterange, .el-date-editor--timerange) {
  width: 100px;
  /* 设置为所需的宽度 */
}
</style>
