<template>
  <div class="month-selector">
    <div
      class="prefix-content"
      @click="openDatePicker"
      :style="{ height: wapperHeight, background: wapperBackground }"
    >
      <!-- 上一个月按钮 -->

      <img
        class="arrow-btn prev"
        @click.stop="decreaseMonth"
        src="@/assets/imgs/customerService/scheduling/left.png"
        alt=""
      />

      <!-- 当前年月显示 -->
      <span class="current-date" :style="{ marginBottom: textMB }">{{ formattedDate }}</span>
      <div>
        <span class="desc-text">选择考勤年月</span>
      </div>
      <!-- 下一个月按钮 -->
      <img
        class="arrow-btn next"
        @click.stop="increaseMonth"
        src="@/assets/imgs/customerService/scheduling/right.png"
        alt=""
      />

      <!-- 隐藏 -->
      <!-- 日期选择器 -->
      <div style="opacity: 0; height: 1px; width: 1px" class="opacity">
        <el-date-picker
          ref="datePickerRef"
          v-model="internalValue"
          type="month"
          :clearable="false"
          :disabled="disabled"
          :disabled-date="disabledDate"
          @change="handleDateChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineEmits, defineProps, ref, watch } from 'vue'
const message = useMessage()

const props = defineProps({
  modelValue: {
    type: [String, Date],
    default: null
  },

  disabled: {
    type: Boolean,
    default: false
  },
  wapperHeight: {
    type: String,
    default: '105px'
  },
  wapperBackground: {
    type: String,
    default: '#ffffff'
  },
  textMB: {
    type: String,
    default: '14px'
  },
  disabledDate: {
    type: Function,
    default: () => {
      return false // 默认不禁用任何日期
    }
  }
})

const datePickerRef = ref(null)
// 打开日期选择器
const openDatePicker = () => {
  if (datePickerRef.value) {
    datePickerRef.value.focus() // 手动触发 el-date-picker 的下拉
  }
}

const emits = defineEmits(['update:modelValue', 'change'])

const internalValue = ref(props.modelValue)

watch(
  () => props.modelValue,
  (newValue) => {
    internalValue.value = newValue
  }
)

const handleDateChange = (date) => {
  // 获取年份和月份（注意月份是 0-based，所以需要 +1）
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // 补零
  const formattedDate = `${year}-${month}`
  emits('update:modelValue', formattedDate)
  emits('change', formattedDate)
}

const formattedDate = computed(() => {
  if (!internalValue.value) return ''
  const date = new Date(internalValue.value)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${year}年${month}月`
})

const increaseMonth = () => {
  if (!internalValue.value) return
  const date = new Date(internalValue.value)
  date.setMonth(date.getMonth() + 1)

  // 检查是否被禁用
  if (props.disabledDate && props.disabledDate(date)) {
    const maxDate = getMaxSelectableDate() // 获取最大可选日期
    if (maxDate) {
      const maxYear = maxDate.getFullYear()
      const maxMonth = String(maxDate.getMonth() + 1).padStart(2, '0') // 补零
      message.warning(`只能选择到 ${maxYear}年${maxMonth}月`) // 提示用户
    }
    return // 如果目标月份被禁用，则不执行后续逻辑
  }

  internalValue.value = date
  handleDateChange(date)
}

const getMaxSelectableDate = () => {
  const now = new Date()
  let maxDate = null

  // 遍历未来的日期，找到第一个被禁用的日期
  for (let i = 0; i < 12; i++) {
    const testDate = new Date(now.getFullYear(), now.getMonth() + i, 1)
    if (props.disabledDate(testDate)) {
      maxDate = new Date(now.getFullYear(), now.getMonth() + i - 1, 1) // 上一个月是最大可选日期
      break
    }
  }

  return maxDate
}

const decreaseMonth = () => {
  if (!internalValue.value) return
  const date = new Date(internalValue.value)
  date.setMonth(date.getMonth() - 1)
  internalValue.value = date
  handleDateChange(date)
}
</script>

<style scoped>
.month-selector {
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.prefix-content {
  cursor: pointer;
  width: 227px;

  border-radius: 4px;
  background: #ffffff;
  box-sizing: border-box;
  border: 1px solid #d8d8d8;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.opacity {
  cursor: pointer;
  position: absolute;
  left: 0;
  bottom: 40px;
  width: 100%;
}

.arrow-btn {
  position: absolute;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  z-index: 11;
}

.arrow-btn.prev {
  left: 16px;
}

.arrow-btn.next {
  right: 16px;
}

.arrow-btn:disabled {
  color: #dcdfe6;
  cursor: not-allowed;
}

.current-date {
  font-family: PingFang SC;
  font-size: 20px;
  font-weight: 500;
  text-align: center;
  color: #3d3d3d;
  /* margin-bottom: 14px; */
}
.desc-text {
  cursor: pointer;
  font-family: PingFang SC;
  font-size: 14px;
  color: #999999;
}

.helper-text {
  margin-top: 8px;
  color: #909399;
  display: flex;
  align-items: center;
  font-size: 14px;
}
</style>
