<template>
  <div class="drawer-wrapper">
    <el-drawer v-model="isShow" class="drawer" ref="drawerRef" size="597" :with-header="false" :wrapper-closable="true"
      :before-close="handleBeforClose">
      <div>
        <div class="drawerTitle">
          <div>变更<span class="ml1">{{ personName ? `(${personName})` : '' }}</span></div>
          <div @click="drawerRef.handleClose">
            <el-icon>
              <CloseBold />
            </el-icon>
          </div>
        </div>
      </div>
      <el-card shadow="never">
        <div class="date">
          <div class="date-icon"></div>
          <span>日期</span>
          <span>{{ date }}</span>
        </div>
        <el-form ref="formRef" :model="formData" label-position="top" class="content" v-loading="loading"
          :rules="rules">
          <el-form-item prop="shiftType">
            <template #label>
              <b class="title">班次类型
                <span>({{ formData.checkInRecordVos?.length }}条)</span>
                <el-popover effect="light" placement="right-start" trigger="hover" :width="250"
                  popper-style="padding: 10px; border-radius: 8px; border: 0; transform: translateY(-10px)"
                  :show-arrow="false" :offset="0">
                  <template #reference>
                    <img src="@/assets/imgs/storage/question.png" alt="" />
                  </template>
                  <div class="tip-content">此班次类型是通过打卡记录自动判断，若打卡记录为3条，则当前班次类型为“白班”；若打卡记录为1条，则当前班次类型为“夜班”</div>
                </el-popover>
              </b>
            </template>
            <el-radio-group v-model="formData.shiftType" @change="handleShiftChange">
              <el-radio :value="0">白班</el-radio>
              <el-radio :value="1">夜班</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="checkInRecordVos">
            <template #label>
              <b class="title">打卡记录 </b>
              <div class="record">
                <img :style="{ width: '15px', height: '15px' }" src="@/assets/imgs/storage/attendance-record.png"
                  alt="" />
                <el-button link type="primary" @click="openRecord">原始考勤记录</el-button>
              </div>
            </template>
            <template #default>
              <el-button-group v-if="formData.shiftType === 0" size="large">
                <el-button v-for="(btn, index) in btnOps" :class="{ active: activeIndex === index }" :key="index"
                  :type="activeIndex === index ? 'primary' : 'default'" @click="handleChangeActiveIndex(index)">
                  {{ btn }}
                  <img v-if="isShowIcon(index)" class="btn-icon" src="@/assets/imgs/storage/attendance-btn-icon.png"
                    alt="" />
                </el-button>
              </el-button-group>
              <el-form v-for="(item, index) in formData.checkInRecordVos" ref="timeFormRef"
                v-show="activeIndex === index || formData.shiftType" class="checkInRecordVos-item" :key="index"
                :model="formData.checkInRecordVos![index]" inline label-width="51" size="large">
                <label v-if="formData.shiftType">当日</label>
                <div v-else>
                  <label v-for="(label, i) in btnOps" :key="label" v-show="activeIndex === i">{{
                    label
                  }}</label>
                </div>
                <el-form-item label="上班:" prop="checkTimeStart" ref="checkTimeStartRef" :rules="createStartRules(item)"
                  :required="false">
                  <el-time-picker v-model="item.checkTimeStart" placeholder="" format="HH:mm" value-format="HH:mm"
                    :clearable="false" @change="(val) => handleChangeTime(val, index)" />
                </el-form-item>
                <label v-if="formData.shiftType">次日</label>
                <el-form-item :class="{
                  marginRight29: formData.shiftType,
                  marginRight48: formData.shiftType === 0
                }" label="下班:" prop="checkTimeEnd" ref="checkTimeEndRef" :rules="createEndRules(item)"
                  :required="false">
                  <el-time-picker v-model="item.checkTimeEnd" placeholder="" format="HH:mm" value-format="HH:mm"
                    :clearable="false" @change="(val) => handleChangeTime(val, index)" />
                </el-form-item>
                <el-form-item prop="attendanceStatus">
                  <el-select v-model="item.attendanceStatus" @change="handleSelect()">
                    <el-option v-for="el in attendanceStatusOp" v-show="el.value === 3 || el.value === 4"
                      :key="el.label" :value="el.value" :label="el.label" />
                  </el-select>
                </el-form-item>
              </el-form>
            </template>
          </el-form-item>
          <el-form-item class="anyError" label="考勤状态:" label-position="right" label-width="70">
            <div :class="{ normal: true, error: anyError }">
              <el-icon v-if="anyError" color="#EB3737">
                <CircleCloseFilled />
              </el-icon>
              <el-icon v-else color="#349B34">
                <SuccessFilled />
              </el-icon>
              <span>{{ anyError ? '异常' : '正常' }}</span>
            </div>
          </el-form-item>
          <el-form-item prop="remark" label="备注:" label-position="right" label-width="70" :required="false">
            <s-text-area v-model.trim="formData.remark" :rows="5" :maxlength="201" />
          </el-form-item>
          <el-form-item class="footer-btn">
            <el-button @click="drawerRef.handleClose">取消</el-button>
            <el-button type="primary" @click="onSubmit">确定</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-drawer>

    <el-dialog v-model="isShowRecordDialog" title="原始考勤" width="500">
      <main-table :table-data="records" :options="recordOps" :max-height="440" />
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import {
  getAttendanceDailyDetail,
  getOriginalRecord,
  triggerCalculationStatus,
  updateAttendanceDetail
} from '@/api/storage/attendance'
import { deepEqual } from '@/utils/common'
import { cloneDeep } from 'lodash-es'
import MainTable from './table.vue'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    date?: string
    userId: string
    personName?: string
  }>(),
  {
    date: ''
  }
)
const emit = defineEmits(['update:modelValue', 'after-submit'])

const drawerRef = ref()
const formRef = ref()
const formData = reactive<StorageAttendance.DailyDetail>({})
const oldFormData = ref<StorageAttendance.DailyDetail>({})
const submitParams = ref<StorageAttendance.UpdateAttendanceParams>({
  isShiftTypeChange: false
})
const attendanceStatusOp = [
  { value: 0, label: '迟到' },
  { value: 1, label: '早退' },
  { value: 2, label: '缺卡' },
  { value: 3, label: '请假' },
  { value: 4, label: '休假' },
  { value: 5, label: '正常' }
]
const btnOps = ['第一次打卡', '第二次打卡', '第三次打卡']
const activeIndex = ref(0)
const checkTimeStartRef = ref()
const checkTimeEndRef = ref()
const message = useMessage()
const loading = ref(false)
const timeFormRef = ref()
const isShowRecordDialog = ref(false)
const records = ref<any[]>([])
const rules = {
  remark: [
    {
      required: true,
      validator: (_, val: string, callback: (err?: Error) => void) => {
        if (val?.length > 200) return callback(new Error('备注最多填写200个字符'))
        callback()
      }
    }
  ]
}
const recordOps = [
  { label: '考勤日期', prop: 'attendanceDate', width: '120px' },
  { label: '考勤时间', prop: 'attendanceTime' },
  { label: '打卡地点', prop: 'attendanceLocation' }
]

const isShow = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

watch(
  () => props.modelValue,
  async (val) => {
    val && (await getDailyDetail())
    !val && (activeIndex.value = 0)
  }
)

const anyError = computed(() => formData.attendanceStatus === 1)

/**
 * 上班时间的校验规则
 */
const createStartRules = (item: StorageAttendance.CheckInRecordVo1) => [
  {
    required: true,
    validator: (_, __, callback: (params?: Error) => void) => {
      let startTime: any = null
      let endTime: any = null
      endTime = new Date(`${props.date} ${item.checkTimeEnd!}`)
      startTime = new Date(`${props.date} ${item.checkTimeStart!}`)
      if (startTime >= endTime && formData.shiftType === 0) {
        callback(new Error('上班时间不能晚于下班时间'))
      } else if (startTime <= endTime && formData.shiftType === 1) {
        callback(new Error('上下班时间间隔不能超过24小时'))
      } else {
        callback()
      }
    }
  }
]

/**
 * 下班时间的校验规则
 */
const createEndRules = (item: StorageAttendance.CheckInRecordVo1) => [
  {
    validator: (_, __, callback: (params?: Error) => void) => {
      let startTime: any = null
      let endTime: any = null
      startTime = new Date(`${props.date} ${item.checkTimeStart!}`)
      endTime = new Date(`${props.date} ${item.checkTimeEnd!}`)

      if (formData.shiftType === 0 && startTime >= endTime) {
        callback(new Error('下班时间不能早于上班时间'))
      } else if (formData.shiftType === 1 && startTime <= endTime) {
        callback(new Error('上下班时间间隔不能超过24小时'))
      } else {
        callback()
      }
    }
  }
]

/**
 * 是否展示按钮图标
 */
const isShowIcon = (index: number) => {
  const status = formData.checkInRecordVos![index]?.attendanceStatus
  return status === 0 || status === 1 || status === 2
}

/**
 * 点击时段按钮触发
 */
function handleChangeActiveIndex(index: number) {
  activeIndex.value = index
}

/**
 * 更改时间触发回调
 * @param value
 * @param index
 */
async function handleChangeTime(_: any, index: number) {
  checkTimeStartRef.value[index].validate()
  checkTimeEndRef.value[index].validate()
  triggerStatus()
}

/**
 * 触发状态变更
 */
async function triggerStatus() {
  const params: StorageAttendance.TriggerCalculationStatusParams = {
    attendanceDate: formData.attendanceDate,
    checkInRecords: formData.checkInRecordVos?.map((item, index) => {
      return {
        recordNumber: index + 1,
        checkTimeEnd: item.checkTimeEnd || '',
        checkTimeStart: item.checkTimeStart || ''
      }
    }),
    shiftType: formData.shiftType
  }

  const res = await triggerCalculationStatus(params)
  res.triggerRecordVos?.forEach((el, index) => {
    if (formData.checkInRecordVos![index].attendanceStatus === el.attendanceStatus) return
    formData.checkInRecordVos![index].attendanceStatus = el.attendanceStatus
  })

  if (formData.attendanceStatus !== res.attendanceStatus) {
    formData.attendanceStatus = res.attendanceStatus
  }
}

/**
 * 校验表单
 */
function validateForm(callback?: () => void) {
  let passNum = 0
  timeFormRef.value.forEach(async (el) => {
    await el.validateField()
    passNum++

    if (passNum === formData.checkInRecordVos?.length) {
      callback && callback()
    }
  })
}

/**
 * 切换时段状态的回调
 * @param index
 */
function handleSelect() {
  formData.attendanceStatus = formData.checkInRecordVos?.find(
    (item) =>
      item.attendanceStatus === 0 || item.attendanceStatus === 1 || item.attendanceStatus === 2
  )
    ? 1
    : 0
}

/**
 * 切换班次回调
 * @param val
 */
async function handleShiftChange(val: 0 | 1) {
  if (val === 0) {
    formData.checkInRecordVos = [
      formData.checkInRecordVos![0],
      cloneDeep(oldFormData.value.checkInRecordVos![1]) || {},
      cloneDeep(oldFormData.value.checkInRecordVos![2]) || {}
    ]
  } else {
    formData.checkInRecordVos = [cloneDeep(formData.checkInRecordVos![0]) || {}]
  }

  activeIndex.value = 0
  submitParams.value = cloneDeep(formData)
  formData.isShiftTypeChange = oldFormData.value.shiftType !== val

  triggerStatus()
  validateForm()
}

/**
 * 关闭弹窗前的回调
 * @param done
 */
async function handleBeforClose(done: () => void) {
  // 未保存提示
  if (!deepEqual(oldFormData.value, formData)) {
    await message.confirm('填写内容尚未保存，关闭后会重置内容，确定吗？')
  }

  // 清楚校验状态
  checkTimeStartRef.value.forEach((item) => {
    item.clearValidate()
  })
  checkTimeEndRef.value.forEach((item) => {
    item.clearValidate()
  })
  done()
}

/**
 * 获取单日详情
 */
async function getDailyDetail() {
  loading.value = true
  try {
    const res = await getAttendanceDailyDetail({
      userId: props.userId,
      date: props.date
    })

    Object.assign(formData, {
      attendanceDate: props.date,
      checkInRecordVos: res.checkInRecordVos,
      remark: res.remark,
      shiftType: res.shiftType,
      attendanceStatus: res.attendanceStatus
    } as typeof formData)

    Object.keys(formData).forEach((key) => {
      submitParams.value[key] = formData[key]
    })
  } catch (error) { }

  loading.value = false
  oldFormData.value = cloneDeep(formData)
}

/**
 * 提交
 */
async function onSubmit() {
  Object.keys(formData).forEach((key) => {
    submitParams.value[key] = formData[key]
  })

  submitParams.value.userId = props.userId

  submitParams.value.checkInRecordVos?.forEach((el, index) => {
    el.recordNumber = index + 1

    el.isCheckRecordChange =
      oldFormData.value.checkInRecordVos?.[index]?.checkTimeEnd !== el?.checkTimeEnd ||
      oldFormData.value.checkInRecordVos?.[index]?.checkTimeStart !== el?.checkTimeStart

    el.isAttendanceStatusChange =
      oldFormData.value.checkInRecordVos?.[index]?.attendanceStatus !== el?.attendanceStatus
  })

  submitParams.value.isAttendanceStatusChange =
    submitParams.value.attendanceStatus !== oldFormData.value.attendanceStatus

  submitParams.value.isShiftTypeChange =
    submitParams.value.shiftType !== oldFormData.value.shiftType

  try {
    await formRef.value.validate()
    const res = await updateAttendanceDetail(submitParams.value)
    if (res.success) {
      message.success('变更成功')
      oldFormData.value = cloneDeep(formData)
      emit('after-submit')
      drawerRef.value.handleClose()
    }
  } catch (error) { }
}

async function openRecord() {
  isShowRecordDialog.value = true
  try {
    const res = await getOriginalRecord({
      userId: props.userId,
      date: props.date
    })
    records.value = res
  } catch (error) { }
}
</script>
<style lang="less" scoped>
* {
  white-space: nowrap;
}

:deep(.el-drawer__body) {
  padding-left: 18px;
  padding-right: 18px;
  background-image: url('@/assets/imgs/drawer_bg.png') !important;
  background-size: cover !important;
}

.drawerTitle {
  font-size: 14px;
  display: flex;
  color: #333333;
  font-weight: 600;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin: 0 0 18px 0;
}

.date {
  display: flex;
  align-items: center;
  width: 521px;
  height: 58px;
  padding: 13px 17px;
  box-sizing: border-box;
  background: url('@/assets/imgs/storage/attendance-date-bg.png');
  background-size: contain;

  .date-icon {
    width: 34px;
    height: 32px;
    margin-right: 22px;
    background: url('@/assets/imgs/storage/attendance-date-icon.png');
    background-size: contain;
    background-repeat: no-repeat;
  }

  span {
    margin-right: 20px;
    line-height: 20;
    font-size: 14px;
  }

  margin-bottom: 20px;
}

:deep(.el-card .el-form .el-form-item) {
  margin-right: 0;
}

.content {
  :deep(.el-form-item__label) {
    display: flex;
    padding: 0;
    justify-content: space-between;

    .title {
      display: flex;
      align-items: center;

      span {
        color: #0064ff;
      }

      img {
        width: 14px;
        margin-left: 10px;
      }
    }

    .record {
      display: flex;
      align-items: center;

      .el-button {
        margin-left: 10px;
        font-size: 14px;
        padding-left: 0;
        padding-right: 0;
        color: #0064ff;
      }
    }
  }

  .checkInRecordVos-item {
    display: flex;
    align-items: center;

    &>label {
      margin-right: 20px;
      color: #666;
    }

    &>div>label {
      margin-right: 8px;
    }

    :deep(.el-form-item) {
      align-items: center;
      margin-right: 30px;

      .el-form-item__error {
        top: 115%;
        white-space: nowrap;
      }

      .el-input__icon {
        margin-right: 3px;
      }

      .el-form-item__label {
        margin-bottom: 0;
        color: #333333;
      }

      .el-select__wrapper,
      .el-input__wrapper {
        height: 36px;
        box-sizing: border-box;
      }

      .el-select {
        .el-select__wrapper {
          width: 87px !important;
        }
      }

      &:last-of-type {
        margin-right: 0;
      }
    }

    :deep(.el-date-editor--time) {
      width: 87px !important;

      .el-input__wrapper {
        flex-direction: row-reverse;
      }
    }
  }

  :deep(.el-button-group) {
    display: flex;
    flex: 1;
    margin-bottom: 25px;
    border-radius: 4px;
    background-color: #f1f1f1;

    .el-button {
      flex: 1;
      width: 165px;
      border: none;
      margin-right: 12px;
      border-radius: 4px;
      font-size: 14px;
      background-color: transparent;

      &:last-of-type {
        margin-right: 0;
      }

      &.active {
        background-color: #0064ff;
      }
    }
  }
}

.el-radio {
  margin-right: 78px;

  :deep(.el-radio__label) {
    padding-left: 20px;
  }
}

.tip-content {
  width: 210px;
  padding: 8px 10px 10px 10px;
  background: #f3f7ff;
  border-radius: 2px;
  color: #666;
  white-space: wrap;
}

.anyError {
  :deep(.el-form-item__label) {
    padding-right: 8px;
    color: #333333;
    font-size: 14px;
    box-sizing: border-box !important;
  }

  .normal {
    display: flex;
    align-items: center;
    color: #349b34;

    :deep(.el-icon) {
      margin-right: 10px;
    }
  }

  .error {
    color: #eb3737;
  }
}

:deep(.el-card) {
  border-radius: 8px;
}

.footer-btn {
  margin-bottom: 0;

  :deep(.el-form-item__content) {
    flex-direction: row-reverse;

    .el-button {
      margin-left: 18px;
    }
  }
}

.marginRight29 {
  margin-right: 29px !important;
}

.marginRight48 {
  margin-right: 48px !important;
}

.btn-icon {
  width: 12px;
  margin-left: 12px;
}

:deep(.el-form-item__label) {
  color: #333333;
}
</style>
