<template>
  <div>
    <el-date-picker
      v-model="dateModelValue"
      format="YYYY-MM-DD"
      value-format="YYYY-MM-DD"
      :placeholder="placeholder"
      :disabled-date="disabledDay"
      :disabled="disabled"
      @panel-change="panelChange"
      @change="(val) => emits('change', val)"
    >
      <template #default="cell">
        <el-tooltip
          :content="getDateStatus(cell)?.text"
          placement="top"
          :disabled="!getDateStatus(cell)?.text"
        >
          <div class="cell" :class="getDateStatus(cell)?.class">
            <span
              class="text flex flex-col"
              :class="{
                current: isToday(cell),
                disabled: cell.disabled,
                status: getDateStatus(cell)
              }"
            >
              <span>{{ isToday(cell) ? '今' : cell.text }}</span>
              <!-- <div class="currentBar" v-if="isToday(cell)"></div> -->
            </span>
          </div>
        </el-tooltip>
      </template>
    </el-date-picker>
  </div>
</template>

<script lang="tsx" setup>
import { ref, computed } from 'vue'
import dayjs from 'dayjs'
import { queryWarehouseOrderSituation } from '@/api/supplier/appointAudit'
const props = defineProps<{
  modelValue?: string
  disabled: boolean
  receivingWarehouse?: string
  placeholder?: string
}>()

const emits = defineEmits(['update:modelValue', 'change'])
const dateModelValue = computed({
  get: () => props.modelValue,
  set: (val) => {
    emits('update:modelValue', val)
  }
})
// 禁止选择的日期
const disabledDay = (time: Date) => {
  // 时间改成零点  时间禁止选择今天之前的 并且预约满的禁止选择
  const today = new Date()
  const formatDate = dayjs(time).format('YYYY-MM-DD')
  const index = orderDate.value.findIndex((date: any) => date.appointmentDate === formatDate)
  if (index >= 0) {
    if (orderDate.value[index].orderRate >= 100) {
      return true
    }
  }
  return time.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0)
}
// 日期判断 是否今天
const today = dayjs().format('YYYY-MM-DD')
const isToday = ({ dayjs }) => {
  return dayjs.format('YYYY-MM-DD') === today
}
// 获取当前月的最后一天
const getLastDayOfMonth = (time: Date) => {
  const year = time.getFullYear()
  const month = time.getMonth()
  const lastDay = new Date(year, month + 1, 0)
  return dayjs(lastDay).format('YYYY-MM-DD')
}
// 面板改变
const panelChange = (time: Date) => {
  // 获取月底的日期
  const endDate = getLastDayOfMonth(time)
  getWareHouseStatus(today, endDate, receivingWarehouseId.value)
}

// 查询发货状态
const getWareHouseStatus = async (appointmentDateStart, appointmentDateEnd, receivingWarehouse) => {
  const params = {
    appointmentDateStart,
    appointmentDateEnd,
    receivingWarehouse
  }
  const data = await queryWarehouseOrderSituation(params)
  orderDate.value = data || []
}
const receivingWarehouseId = ref()
watch(
  props,
  (val) => {
    receivingWarehouseId.value = val.receivingWarehouse
    const endDate = getLastDayOfMonth(new Date())
    getWareHouseStatus(today, endDate, receivingWarehouseId.value)
  },
  {
    deep: true,
    immediate: true
  }
)
// 根据日期判断状态
const orderDate = ref<any>([])

const getDateStatus = ({ dayjs }) => {
  const day = dayjs.format('YYYY-MM-DD')
  const index = orderDate.value.findIndex((date: any) => date.appointmentDate === day)
  if (index >= 0) {
    // 如果存在
    if (orderDate.value[index].orderRate < 80) {
      // 小于80% 压力小 green
      return {
        class: 'green',
        text: `压力小：${orderDate.value[index].receivingNum}`
      }
    } else if (orderDate.value[index].orderRate < 100) {
      // 大于80% 压力大 orange
      return {
        class: 'orange',
        text: `压力大：${orderDate.value[index].receivingNum}`
      }
    } else {
      // 大于等于100% 预约满 red
      return {
        class: 'red',
        text: `预约满：${orderDate.value[index].receivingNum}`
      }
    }
  }
}
</script>

<style lang="less" scoped>
:deep(.el-date-editor.el-input) {
  width: 100%;
}
.cell {
  margin: 0 2px;
  font-size: 14px;
  border-radius: 4px;
  padding: 4px;
  box-sizing: border-box;
  .text {
    border-radius: 2px;
    &.disabled {
      cursor: not-allowed;
      background-color: #f8f8f8;
    }
    &.current {
      color: #0064ff;
      .currentBar {
        width: 8px;
        height: 2px;
        background-color: #0064ff;
        margin: auto;
        position: absolute;
        left: 50%;
        bottom: 12px;
        transform: translateX(-50%);
      }
    }
    &.status {
      color: #fff;
      font-weight: bold;
      &.current {
        .currentBar {
          background-color: #fff;
        }
      }
    }
  }
  &.green {
    background-color: rgba(52, 155, 52, 0.2);
    .text {
      background-color: #349b34;
    }
  }
  &.red {
    background-color: rgba(228, 54, 54, 0.2);
    .text {
      background-color: #e43636;
    }
  }
  &.orange {
    background-color: rgba(219, 106, 15, 0.2);
    .text {
      background-color: #db6a0f;
    }
  }
}
</style>
