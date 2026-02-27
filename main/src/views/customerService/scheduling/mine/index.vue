<!--
 * @Date: 2025-04-24 10:27:01
-->
<template>
  <ContentWrap>
    <!-- header -->
    <div class="flex-row header-content">
      <div style="margin-right: 40px">
        <MonthSelect v-model="selectedMonth" @change="handleDateChange" :disabled-date="disabledDate" />
      </div>
      <DescToolts />
    </div>
    <!-- 日历 -->
    <div class="content-wapper">
      <div class="calendar-container">
        <div class="header">
          <div v-for="(day, index) in daysOfWeek" :key="index" class="day-name">
            {{ day }}
          </div>
        </div>

        <div class="calendar-grid">
          <div v-for="(day, index) in days" :key="index" :class="['day-cell']">
            <div class="day-number" :class="{ isCurrent: day.isCurrentMonth }">{{ day.day }}</div>
            <div :class="{ item: day.isCurrentMonth }" :style="{ background: formatBg(day) }">{{
              day.isCurrentMonth ? stateMap[day?.status] : ''
            }}</div>
          </div>
        </div>
      </div>
      <div class="flex-clumn content-right">
        <div class="top">
          <img src="@/assets/imgs/customerService/scheduling/rili-icon.png" alt="" class="rili-icon" />
          <span>排班需求</span>
        </div>
        <div class="desc-content flex-row">
          <img src="@/assets/imgs/customerService/scheduling/desc1.png" alt="" class="desc-icon" />
          <span class="desc-text">请于下个月1号之前提交自己的排班要求，过期将无法提交，更改</span>
        </div>
        <div class="line"></div>
        <div class="input">
          <s-text-area v-model="userRemark" style="width: 100%" :autosize="{ minRows: 15, maxRows: 30 }"
            placeholder="请输入排班需求" />
        </div>
        <div class="btn">
          <el-button style="width: 58px" type="primary" @click="saveRemark" v-if="canSubmit">提交</el-button>
        </div>
      </div>
    </div>
  </ContentWrap>
</template>

<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { getMyScheduling, saveSchedulingRemark } from '@/api/customerService/scheduling/index'
import DescToolts from '../components/descToolts.vue'
import MonthSelect from '../components/monthSelect.vue'
defineOptions({ name: 'SchedulingMine' })
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const message = useMessage()
const userRemark = ref('')

// 定义状态
const currentMonth = ref(new Date().getMonth()) // 当前月份
const currentYear = ref(new Date().getFullYear()) // 当前年份

const selectedMonth = ref()

const stateMap = ref({
  MORNING: '早',
  EVENING: '晚',
  REST: '休',
  NOON: '中',
  VOCATION: '假',
  TRAIN: '培',
  NULL: '未安排'
})

const formatBg = (day: any) => {
  const status = day.status
  if (!day.isCurrentMonth) return ''
  if (status === 'MORNING') {
    return '#CEF6E0'
  } else if (status === 'EVENING') {
    return '#E8E5FF'
  } else if (status === 'REST') {
    return '#FDF5A6'
  } else if (status === 'NOON') {
    return '#FFE8C4'
  } else if (status === 'VOCATION') {
    return '#FBD8EA'
  } else if (status === 'TRAIN') {
    return '#CDE1FF'
  } else if (status === 'NULL') {
    return '#ffffff'
  }
}

// 只能修改下个月的排班需求
const canSubmit = computed(() => {
  if (!selectedMonth.value) return false // 如果未选择月份，返回 false
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1 // 当前月份（1-12）

  // 解析选中的年份和月份
  const [selectedYear, selectedMonthValue] = selectedMonth.value.split('-').map(Number)

  // 判断是否为下一个月
  if (selectedYear === currentYear && selectedMonthValue === currentMonth + 1) {
    return true
  }

  return false
})

onMounted(() => {
  // 初始化月份
  const month = String(currentMonth.value + 1).padStart(2, '0') // 补零
  selectedMonth.value = `${currentYear.value}-${month}`

  initDataList()
})

// 定义 disabledDate 方法
const disabledDate = (date) => {
  const now = new Date()
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0) // 下一个月的最后一天
  return date > nextMonth // 禁用超过下一个月的日期
}

// 日期变更 数据变化
const handleDateChange = () => {
  // 修改年月 重新生成日历数据
  const [year, month] = selectedMonth.value.split('-').map(Number)
  currentYear.value = year
  currentMonth.value = month - 1 // 月份从0开始
  days.value = generateCalendarDays(year, month - 1) // 重新生成日历数据

  initDataList()
}

const initDataList = async () => {
  const params = {
    dataDate: selectedMonth.value
  }
  const res = await getMyScheduling(params)

  if (res?.schedulingJson) {
    console.log(JSON.parse(res.schedulingJson), 'res.schedulingJson')
    const obj = JSON.parse(res.schedulingJson)
    // 格式化数据
    const midList = days.value.map((item) => {
      const day = item.day
      if (obj[day]) {
        return {
          ...item,
          status: obj[day]
        }
      } else {
        return {
          ...item,
          status: ''
        }
      }
    })
    days.value = midList
  } else {
    days.value = days.value.map((item) => {
      return {
        ...item,
        status: ''
      }
    })
  }

  userRemark.value = res?.userRemark || ''
}

// 提交备注
const saveRemark = async () => {
  const params = {
    dataDate: selectedMonth.value,
    userRemark: userRemark.value
  }
  const res = await saveSchedulingRemark(params)
  if (res) {
    initDataList()
  }
  message.success('提交成功')
}

// 生成日历数据的方法
const generateCalendarDays = (year: number, month: number) => {
  const date = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const calendarDays: { day: number; isCurrentMonth: boolean }[] = []

  // 填充上个月的天数
  const firstDayOfWeek = (date.getDay() + 6) % 7 // 将周日(0)调整为周一(0)
  const prevMonthDays = new Date(year, month, 0).getDate() // 上个月的总天数
  for (let i = 1; i <= firstDayOfWeek; i++) {
    calendarDays.push({
      day: prevMonthDays - firstDayOfWeek + i,
      isCurrentMonth: false // 标记为非当前月份
    })
  }

  // 填充当前月份
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      day: i,
      isCurrentMonth: true // 标记为当前月份
    })
  }

  // 填充下个月的天数
  const remainingDays = (7 - (calendarDays.length % 7)) % 7 // 计算需要填充的天数
  for (let i = 1; i <= remainingDays; i++) {
    calendarDays.push({
      day: i,
      isCurrentMonth: false // 标记为非当前月份
    })
  }
  console.log(calendarDays, 'calendarDays')
  return calendarDays
}

// 调用方法生成日历数据
const days: any = ref(generateCalendarDays(currentYear.value, currentMonth.value))
</script>

<style lang="less" scoped>
.content-wapper {
  display: flex;
  flex-direction: row;
}

.calendar-container {
  width: 100%;
  min-width: 1000px;
}

.header {
  display: flex;
  background: #f6f9ff;
  margin-bottom: 16px;
}

.day-name {
  flex: 1;
  text-align: center;
  padding: 10px;
  font-family: PingFang SC;
  font-size: 14px;
  color: #333333;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0px;
  border: 1px solid #cfdbf1;
}

.day-cell {
  display: flex;

  padding: 48px 8px 14px 8px;
  box-sizing: border-box;
  border-right: 1px solid #cfdbf1;
  border-bottom: 1px solid rgba(207, 219, 241, 0.4);
  font-size: 14px;
  position: relative;

  .item {
    width: 100%;
    height: 85px;
    line-height: 85px;
    text-align: center;
    border-radius: 2px;
    color: #333333;
    font-size: 20px;
    font-weight: normal;
    cursor: pointer;
  }
}

.day-cell:nth-child(7n) {
  border-right: none;
}

.day-cell:nth-last-child(-n + 7) {
  border-bottom: none;
}

.day-number {
  margin-bottom: 4px;
  position: absolute;
  top: 12px;
  right: 20px;
  font-size: 20px;
  font-weight: 500;
  color: #cdcdcd;
}

.isCurrent {
  color: #333333;
}

.status-label {
  font-size: 12px;
  padding: 2px 4px;
  border-radius: 4px;
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
}

.flex-row {
  display: flex;
  flex-direction: row;
}

.header-content {
  margin-bottom: 20px;
  align-items: center;
}

.flex-clumn {
  display: flex;
  flex-direction: column;
}

.content-right {
  width: 100%;
  max-width: 336px;
  border-radius: 8px;
  margin-left: 16px;
  background: #f8f8f9;

  .top {
    height: 48px;
    line-height: 48px;
    background: #f6f9ff;
    display: flex;
    flex-direction: row;
    align-items: center;

    .rili-icon {
      width: 30px;
      height: 30px;
    }
  }

  .desc-content {
    padding: 16px 20px;
    box-sizing: border-box;

    .desc-icon {
      width: 12.21px;
      height: 12px;
      margin-right: 10px;
    }

    .desc-text {
      font-family: PingFang SC;
      font-size: 12px;
      color: #ff4f4f;
    }
  }

  .line {
    width: 90%;
    margin: 0 auto 10px;
    border-top: 1px solid #e5e5e5;
  }

  .btn {
    padding: 20px;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: end;
  }

  .input {
    padding: 0 20px;
    box-sizing: border-box;
  }
}
</style>
