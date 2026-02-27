<template>
  <div class="ruleCard" v-for="(item, index) in formData" :key="item.id">
    <div class="cardHeader flex">
      <div class="index h8 flex">
        <span>规则{{ index + 1 }}</span>
      </div>
      <div class="delete w9 h8 flex" :class="{ undeletable: !index }" @click="onDelete(index)">
        <img class="w3.5 h3.5" :src="btnImg(index)" alt="" />
      </div>
    </div>
    <el-form
      inline
      ref="formRef"
      :model="formData[index]"
      :rules="getRules(index)"
      :validate-on-rule-change="false"
    >
      <el-row>
        <el-form-item label="上班时间" prop="workStartTime" :required="false">
          <div class="timePicker" :class="{ active: timePickerFocus[index] }">
            <el-select
              v-model="formData[index].workStartTimeOffset"
              :disabled="!index"
              @change="(val) => handleSelectOffset(index, 'start', val)"
            >
              <el-option
                v-for="ele in timeOffsetOp"
                :key="ele.label"
                :value="ele.value"
                :label="ele.label"
              />
              <template #header></template>
            </el-select>
            <el-time-picker
              v-model="formData[index].workStartTime"
              value-format="HH:mm"
              format="HH:mm"
              :clearable="false"
              @change="handleChangeTime"
            />
          </div>
        </el-form-item>
      </el-row>
      <el-row class="timeRange">
        <!-- 最早打卡时间 -->
        <el-form-item prop="maxEarlyCheckIn">
          <span class="fontSize13 mr1.5">最早可提前</span>
          <el-input-number
            controls-position="right"
            v-model="formData[index].maxEarlyCheckIn"
            :max="720"
          />
          <span class="fontSize13 ml1.5">分钟进行打卡</span>
        </el-form-item>

        <!-- 迟到 -->
        <el-form-item prop="lateThreshold">
          <span class="fontSize13 mr1.5">晚于</span>
          <el-input-number
            controls-position="right"
            v-model="formData[index].lateThreshold"
            :max="720"
            @change="validateAll"
          />
          <span class="fontSize13 ml1.5">分钟打卡记为迟到</span>
        </el-form-item>

        <!-- 上班缺卡 -->
        <el-form-item prop="absentCheckIn">
          <span class="fontSize13 mr1.5">晚于</span>
          <el-input-number
            controls-position="right"
            v-model="formData[index].absentCheckIn"
            :max="720"
            @change="validateAll"
          />
          <span class="fontSize13 ml1.5">分钟记为半天缺卡</span>
        </el-form-item>
      </el-row>
      <el-divider border-style="dashed" />
      <el-row>
        <el-form-item label="下班时间" class="mt0" prop="workEndTime" :required="false">
          <div class="timePicker">
            <el-select
              v-model="formData[index].workEndTimeOffset"
              @change="(val) => handleSelectOffset(index, 'end', val)"
            >
              <el-option
                v-for="ele in timeOffsetOp"
                :key="ele.label"
                :value="ele.value"
                :label="ele.label"
              />
            </el-select>
            <el-time-picker
              v-model="formData[index].workEndTime"
              value-format="HH:mm"
              format="HH:mm"
              :clearable="false"
              @change="handleChangeTime"
            />
          </div>
        </el-form-item>
      </el-row>
      <el-row class="timeRange">
        <!-- 最晚下班打卡时间 -->
        <el-form-item prop="maxLateCheckOut">
          <span class="fontSize13 mr1.5">最晚可延后</span>
          <el-input-number
            controls-position="right"
            v-model="formData[index].maxLateCheckOut"
            :max="720"
          />
          <span class="fontSize13 ml1.5">分钟进行打卡</span>
        </el-form-item>

        <!-- 早退时间 -->
        <el-form-item prop="earlyLeaveThreshold">
          <span class="fontSize13 mr1.5">最早超过</span>
          <el-input-number
            controls-position="right"
            v-model="formData[index].earlyLeaveThreshold"
            :max="720"
            @change="validateAll"
          />
          <span class="fontSize13 ml1.5">分钟打卡记为早退</span>
        </el-form-item>

        <!-- 下班缺卡时间 -->
        <el-form-item prop="absentCheckOut">
          <span class="fontSize13 mr1.5">最早超过</span>
          <el-input-number
            controls-position="right"
            v-model="formData[index].absentCheckOut"
            :max="720"
            @change="validateAll"
          />
          <span class="fontSize13 ml1.5">分钟打卡记为半天缺卡</span>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>
<script lang="ts" setup>
import DeleteBtn from '@/assets/imgs/storage/attendance-shift-delete.png'
import UnDeleteBtn from '@/assets/imgs/storage/attendance-shift-disable-delete.png'

const props = withDefaults(
  defineProps<{
    modelValue: StorageAttendance.ShiftRuleVo[]
  }>(),
  {}
)

const emit = defineEmits(['update:modelValue', 'changeTime'])

const timePickerFocus = ref<boolean[]>([])

const formData = computed<StorageAttendance.ShiftRuleVo[]>({
  get: () => props.modelValue,
  set: (val) => {
    emit('update:modelValue', val)
  }
})

const getRules = (index: number) => ({
  workStartTime: [
    {
      required: true,
      validator: (_, val, callback: (params?: Error) => void) => {
        if (!val) return callback(new Error('请选择上班时间'))
        const res1 = timeContrastRes(index, 'start')
        if (res1) return callback(new Error(res1))
        const res2 = nearRuleContrastRes(index, 'start')
        if (res2) return callback(new Error(res2))
        callback()
      }
    }
  ],
  workEndTime: [
    {
      required: true,
      validator: (_, val, callback: (params?: Error) => void) => {
        if (!val) return callback(new Error('请选择下班时间'))
        const res1 = timeContrastRes(index, 'end')
        if (res1) return callback(new Error(res1))
        const res2 = nearRuleContrastRes(index, 'end')
        if (res2) return callback(new Error(res2))
        callback()
      }
    }
  ],
  lateThreshold: [
    {
      required: true,
      validator: (_, val, callback) => {
        if (val >= formData.value[index].absentCheckIn!) {
          callback(new Error('迟到时间不能超过上班缺卡时间'))
        } else {
          callback()
        }
      }
    }
  ],
  absentCheckIn: [
    {
      required: true,
      validator: (_, val, callback) => {
        if (val <= formData.value[index].lateThreshold!) {
          callback(new Error('迟到时间不能超过上班缺卡时间'))
        } else {
          callback()
        }
      }
    }
  ],
  earlyLeaveThreshold: [
    {
      required: true,
      validator: (_, val, callback) => {
        if (val >= formData.value[index].absentCheckOut!) {
          callback(new Error('早退时间不能超过下班缺卡时间'))
        } else {
          callback()
        }
      }
    }
  ],
  absentCheckOut: [
    {
      required: true,
      validator: (_, val, callback) => {
        if (val <= formData.value[index].earlyLeaveThreshold!) {
          callback(new Error('早退时间不能超过下班缺卡时间'))
        } else {
          callback()
        }
      }
    }
  ]
})
// 上下班时间比较结果
const timeContrastRes = (index: number, key: 'start' | 'end') => {
  const startTime = formData.value[index].workStartTime!.split(':').map(Number)
  const endTime = formData.value[index].workEndTime!.split(':').map(Number)

  if (startTime.length !== 2 || endTime.length !== 2) return undefined

  const result =
    endTime[0] * 60 +
    endTime[1] +
    formData.value[index].workEndTimeOffset! * 24 * 60 -
    (startTime[0] * 60 + startTime[1] + formData.value[index].workStartTimeOffset! * 24 * 60)

  if (result > 0) {
    return result < 1440 ? undefined : '同一时段，上下班时长不能超过24小时'
  } else {
    return key === 'start' ? '上班时间应该早于下班时间' : '下班时间应该晚于上班时间'
  }
}
// 跨规则比较
const nearRuleContrastRes = (index: number, type: 'start' | 'end') => {
  // 与后面的规则比较
  if (type === 'end' && index + 1 <= formData.value.length - 1) {
    if (!formData.value[index + 1].workStartTime) return
    // 比较当前的下班时间是否比下一个规则的上班时间早
    // 首先比较当日还是次日
    // 同为当日或者次日，比较时间值
    if (formData.value[index].workEndTimeOffset === formData.value[index + 1].workStartTimeOffset) {
      const thisEndTime = formData.value[index].workEndTime!.split(':').map(Number)
      const nextStartTime = formData.value[index + 1].workStartTime!.split(':').map(Number)

      if (thisEndTime[0] < nextStartTime[0]) {
        return
      } else if (thisEndTime[0] === nextStartTime[0] && thisEndTime[1] < nextStartTime[1]) {
        return
      } else {
        return '当前规则的下班时间应该早于下一条规则的上班时间'
      }
    } else if (
      formData.value[index].workEndTimeOffset! > formData.value[index + 1].workStartTimeOffset!
    ) {
      return '当前规则的下班时间应该晚于下一条规则的上班时间'
    } else {
      return
    }
  }

  // 与前面的规则比较
  if (type === 'start' && index - 1 >= 0) {
    if (!formData.value[index - 1].workEndTime) return
    if (formData.value[index].workStartTimeOffset === formData.value[index - 1].workEndTimeOffset) {
      const thisStatrTime = formData.value[index].workStartTime!.split(':').map(Number)
      const preEndTime = formData.value[index - 1].workEndTime!.split(':').map(Number)

      if (thisStatrTime[0] > preEndTime[0]) {
        return undefined
      } else if (thisStatrTime[0] === preEndTime[0] && thisStatrTime[1] > preEndTime[1]) {
        return undefined
      } else {
        return '当前规则的上班时间应该晚于上一条规则的下班时间'
      }
    } else if (
      formData.value[index].workStartTimeOffset! < formData.value[index - 1].workEndTimeOffset!
    ) {
      return '当前规则的上班时间应该晚于上一条规则的下班时间'
    } else {
      return undefined
    }
  }
}

async function validateAll() {
  const formRef = getFormDOM()

  formRef.forEach((ele) => {
    ele.validate()
  })
}

function handleResetFields() {
  const formRef = getFormDOM()
  formRef.forEach((ele) => {
    ele.resetFields()
    ele.clearValidate()
  })
}

function handleChangeTime() {
  emit('changeTime')
  validateAll()
}

function handleSelectOffset(index: number, type: 'start' | 'end', value) {
  formData.value[index][type === 'start' ? 'workStartTimeOffset' : 'workEndTimeOffset'] = value

  handleChangeTime()
}

const timeOffsetOp = [
  {
    label: '当日',
    value: 0
  },
  {
    label: '次日',
    value: 1
  }
]

// 图标地址
const btnImg = (index: number) => (index ? DeleteBtn : UnDeleteBtn)

// 获取表单
const instance = getCurrentInstance()
function getFormDOM() {
  const formRefName = `formRef`
  const form = instance?.refs[formRefName]
  if (form) {
    return form as any
  }
}

function onDelete(index: number) {
  if (index === 0) return
  formData.value.splice(index, 1)
}

defineExpose({ getRulesForms: getFormDOM, resetFields: handleResetFields })
</script>
<style lang="less" scoped>
.ruleCard {
  background-color: rgba(244, 246, 248, 1);
  padding: 20px;
  margin-bottom: 16px;
  border-radius: 10px;
  overflow: hidden;

  &:last-of-type {
    margin-bottom: 0;
  }

  .cardHeader {
    justify-content: space-between;
    .index {
      padding: 6px 12px;
      box-sizing: border-box;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      background-color: rgba(0, 100, 255, 0.07);
      color: rgba(0, 100, 255, 1);
    }
    .delete {
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      background-color: rgba(235, 55, 55, 0.07);
      cursor: pointer;
    }
    .undeletable {
      background-color: rgba(51, 51, 51, 0.07);
      cursor: no-drop;
    }
  }
  .el-form-item {
    margin-top: 20px;
    margin-bottom: 0;

    &.mt0 {
      margin-top: 0;
    }

    :deep(.el-form-item__content) {
      flex-wrap: nowrap;

      .timePicker {
        border-radius: 4px;
        overflow: hidden;
        border: 1px solid #e0e0e5;

        &:hover {
          border-color: #c0c4cc;
        }
        &.active {
          border-color: #409eff;
        }

        .el-input {
          width: 94px;
        }

        .el-input,
        .el-input__wrapper,
        .el-select__wrapper {
          padding-top: 0;
          padding-bottom: 0;
          height: 34px;
          border: none;
          box-shadow: none;
          border-radius: 0;
        }

        .el-select {
          width: 66px;

          .el-select__wrapper {
            padding-right: 5px;
            border-right: 1px solid rgba(209, 209, 209, 1);
          }
        }

        .el-input__wrapper {
          flex-direction: row-reverse;
        }
      }
    }
  }
}

.fontSize13 {
  font-size: 13px;
}

.timeRange {
  :deep(.el-form-item) {
    margin-right: 16px;

    &:last-of-type {
      margin-right: 0;
    }
  }
  :deep(.el-input-number) {
    width: 97px;

    .el-input__wrapper {
      padding-left: 7px;
    }

    .el-input-number__increase,
    .el-input-number__decrease {
      right: 2px;
    }
  }
  :deep(.el-input) {
    width: 96px;
  }
}

:deep(.el-divider) {
  margin: 16px 0;
}

:deep(.el-form-item__error) {
  white-space: nowrap;
}
</style>
