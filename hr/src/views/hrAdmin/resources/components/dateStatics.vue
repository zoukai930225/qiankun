<template>
  <div class="dateStaticsBg">
    <div class="dateStatics" @click="clickSelctDate">
      <div class="dateStatics-value"> {{ dateValue }}</div>
      <img class="dateStatics-arrow" src="@/assets/imgs/hrAdmin/date_arrow.png" />
    </div>
    <div class="dateSelect">
      <el-date-picker v-if="type === 'month'" ref="dateMonthPickRef" v-model="selectMonth" type="month"
        placeholder="Pick a month" format="YYYY/MM/DD" value-format="YYYY-MM" @change="dateChange" />
      format="YYYY/MM/DD"

      <el-date-picker v-if="type === 'year'" ref="dateYearPickRef" v-model="selectYear" type="year"
        placeholder="Pick a year" format="YYYY/MM/DD" value-format="YYYY" @change="dateChange" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
const props = defineProps({
  type: propTypes.string.def('month'), // year or month
  value: propTypes.string.def('')
})

const dateValue = computed(() => {
  if (selectDate.value) {
    return selectDate.value
  }
  switch (props.type) {
    case 'year':
      return '年份'
    case 'month':
      return '月份'
    default:
      return '年份'
  }
})

const clearDateSelectDate = () => {
  selectDate.value = ''
}

const initDate = (date: string) => {
  selectDate.value = date
}

const dateYearPickRef = ref()
const dateMonthPickRef = ref()
const selectYear = ref('')
const selectMonth = ref('')

const selectDate = ref('')

const clickSelctDate = () => {
  if (props.type === 'year') {
    dateYearPickRef.value.focus()
  } else if (props.type === 'month') {
    dateMonthPickRef.value.focus()
  }
}

const dateChange = () => {
  if (props.type === 'year') {
    selectDate.value = selectYear.value
  } else if (props.type === 'month') {
    selectDate.value = selectMonth.value
  }
  emit('dateChange', selectDate.value)
}
const emit = defineEmits(['dateChange'])
defineExpose({ clearDateSelectDate, initDate })
</script>

<style lang="scss" scoped>
.dateStaticsBg {
  position: relative;

  .dateStatics {
    position: relative;
    margin-left: 20px;
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 28px;
    border-radius: 4px;
    border: 1px solid #0064ff;
    cursor: pointer;

    &-value {
      margin-left: 8px;
      font-size: 14px;
      color: #086dfe;
      line-height: 20px;
    }

    &-arrow {
      margin-left: 5px;
      margin-right: 6px;
      width: 11px;
      height: 7px;
    }

    & {
      z-index: 99;
    }
  }

  .dateSelect {
    position: absolute;
    left: 10px;
    top: 20px;
    width: 100px;
    opacity: 0;
  }
}

:deep(.el-date-editor.el-input, .el-date-editor.el-input__wrapper) {
  width: 100px;
}
</style>
