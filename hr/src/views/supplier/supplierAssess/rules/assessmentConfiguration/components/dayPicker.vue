<template>
  <div id="day-picker-container">
    <el-popover
      v-if="containerReady && !disabled"
      v-model:visible="isOpen"
      placement="bottom-start"
      :width="320"
      trigger="click"
      popper-class="day-picker-popover"
      hide-after="0"
      append-to="#day-picker-container"
    >
      <template #reference>
        <div class="calendar-input-wrapper">
          <span v-if="$slots.prepend" class="split"></span>
          <el-input
            :class="[{ 'calendar-input-prepend': $slots.prepend }]"
            :model-value="displayText"
            :placeholder="placeholder"
            :style="style"
            readonly
          >
            <template #prefix>
              <!-- 前置插槽区域点击不触发弹层 -->
              <span
                class="dp-prepend-wrapper"
                @mousedown.stop
                @click.stop
                @mouseup.stop
                @pointerdown.stop
                @pointerup.stop
                @touchstart.stop
                @touchend.stop
              >
                <slot name="prepend"></slot>
              </span>
              <!-- 仍允许点击日历图标或输入框打开弹层 -->
              <el-icon><Calendar /></el-icon>
            </template>
            <template #suffix> 日 </template>
          </el-input>
        </div>
      </template>

      <!-- 弹出层内容 -->
      <div class="day-picker-content">
        <!-- 标题 -->
        <div class="day-picker-header">
          <h3>规则时间</h3>
        </div>

        <!-- 日期网格 -->
        <div class="day-picker-body">
          <div class="day-picker-grid">
            <button
              type="button"
              v-for="day in days"
              :key="day"
              :class="[
                'day-picker-day',
                { 'is-selected': modelValue === day, 'is-disabled': isDisabledDay(day) }
              ]"
              :disabled="isDisabledDay(day)"
              @click="handleDayClick(day)"
            >
              {{ String(day).padStart(2, '0') }}
            </button>
          </div>
        </div>
      </div>
    </el-popover>
    <div v-else class="calendar-input-wrapper">
      <span v-if="$slots.prepend" class="split"></span>
      <el-input
        :class="[{ 'calendar-input-prepend': $slots.prepend }]"
        :model-value="displayText"
        :placeholder="placeholder"
        readonly
        :disabled="true"
      >
        <template #prefix>
          <span class="dp-prepend-wrapper">
            <slot name="prepend"></slot>
          </span>
          <el-icon><Calendar /></el-icon>
        </template>
        <template #suffix> 日 </template>
      </el-input>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Calendar } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: [Number, String],
    default: null
  },
  placeholder: {
    type: String,
    default: '请选择'
  },
  appendTo: {
    type: String,
    default: 'body'
  },
  // 最小可选择日期（1-31），用于限制“当期”时的最小天数
  minDay: {
    type: Number,
    default: undefined
  },
  disabled: {
    type: Boolean,
    default: false
  },
  style: {
    type: Object,
    default: undefined
  }
})

const containerReady = ref(false)
onMounted(() => {
  containerReady.value = true
})

const emit = defineEmits(['update:modelValue', 'change'])

const isOpen = ref(false)

// 生成 1-31 的数组
const days = Array.from({ length: 31 }, (_, i) => i + 1)

// 显示文本
const displayText = computed(() => {
  return props.modelValue ? String(props.modelValue) : ''
})

// 判断是否为禁用日期：仅当传入 minDay 时限制，小于等于最小天均禁用
const isDisabledDay = (day) => {
  const min = props.minDay
  if (min == null) return false
  const minNum = Number(min)
  if (!Number.isFinite(minNum)) return false
  return day <= minNum
}

// 选择日期
const handleDayClick = (day) => {
  if (isDisabledDay(day)) return
  emit('update:modelValue', day)
  emit('change', day)
  isOpen.value = false
}
</script>

<style lang="scss" scoped>
#day-picker-container {
  width: 100%;
  .calendar-input-wrapper {
    position: relative;
    .split {
      position: absolute;
      left: 110px;
      top: 8px;
      width: 1px;
      height: 16px;
      background-color: #e5e5e5;
      z-index: 99;
    }
  }
  :deep(.calendar-input-prepend) {
    > .el-input__wrapper {
      box-sizing: border-box;
      padding-left: 0 !important;
    }
    .dp-prepend-wrapper {
      .el-select {
        --el-select-input-focus-border-color: transparent;
        --el-select-border-color-hover: transparent;
        margin: 0 0 1px 1px;
        border: unset;
        width: 120px !important;
        .el-select__wrapper {
          border: unset;
          padding-right: 20px;
          // min-height: unset;
          height: 30px;
          min-height: 30px;
          box-shadow: unset;
          --el-select-border-color-hover: transparent;
        }
      }
    }
  }
}
.day-picker-header {
  padding: 12px 0;
  border-bottom: 1px solid #e4e7ed;
  margin-bottom: 12px;
}

.day-picker-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  text-align: center;
}

.day-picker-body {
  padding: 0;
}

.day-picker-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

.day-picker-day {
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 4px;
  background-color: transparent;
  font-size: 14px;
  color: #606266;
  cursor: pointer;
  transition: all 0.2s;
}

.day-picker-day:hover {
  background-color: #f5f7fa;
}

.day-picker-day.is-selected {
  background-color: #0064ff;
  color: #fff;
  font-weight: 500;
}

.day-picker-day.is-disabled,
.day-picker-day:disabled {
  color: #c0c4cc;
  cursor: not-allowed;
}

.day-picker-day.is-disabled:hover {
  background-color: transparent;
}
</style>
