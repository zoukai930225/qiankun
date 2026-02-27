<template>
  <div class="rule-edit-form">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="86px" @submit.prevent>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="考核规则" prop="name">
            <el-input
              v-model.trim="form.name"
              maxlength="100"
              placeholder="请输入考核规则"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="运行状态" prop="running">
            <el-switch v-model="form.running" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="创建类型" prop="createType">
            <el-radio-group v-model="form.createType">
              <el-radio :label="0">单次创建</el-radio>
              <el-radio :label="1">重复创建</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row class="create-type-card" :gutter="10">
        <el-col :span="12">
          <el-form-item label="考核类型" prop="assessmentType">
            <el-select v-model="form.assessmentType" placeholder="请选择" clearable>
              <el-option
                v-for="opt in assessmentTypeOptions"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="考核维度" prop="dimension">
            <el-select v-model="form.dimension" placeholder="请选择" clearable>
              <el-option
                v-for="opt in dimensionOptions"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="form.dimension === 'year'" :span="12">
          <el-form-item label="重复频率" prop="repeatFrequency">
            <el-select v-model="form.repeatFrequency" placeholder="请选择">
              <el-option v-for="m in 12" :key="m" :label="`${m}月`" :value="m" />
            </el-select>
          </el-form-item>
        </el-col>
        <template v-if="form.createType === 0">
          <el-col :span="12">
            <el-form-item label="考核期" prop="assessPeriodMonth">
              <el-date-picker
                v-model="form.assessPeriodMonth"
                type="month"
                placeholder="请选择月份"
                value-format="YYYY-MM"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="考核时间" prop="assessTimeRange">
              <el-date-picker
                v-model="timeRange"
                type="datetimerange"
                range-separator="~"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
            </el-form-item>
          </el-col>
        </template>
        <template v-else>
          <el-col :span="12">
            <div class="flex">
              <el-form-item label="重复规则" prop="repeatRule" :style="{ width: '50%' }">
                <template v-if="form.dimension === 'month'">
                  <day-picker v-model="monthlyDay" />
                  <!-- <template #prepend>
                      <el-select class="flex-1" v-model="form.repeatMonthRule">
                        <el-option :value="0" label="上月" />
                        <el-option :value="1" label="当月" />
                      </el-select>
                    </template>
                  </day-picker> -->
                </template>
                <template v-else-if="form.dimension === 'quarter'">
                  <day-picker v-model="quarterlyDay" />
                </template>
                <template v-else>
                  <day-picker v-model="yearlyDay" />
                </template>
              </el-form-item>
              <el-form-item label-width="0" class="ml-12px w-50%" prop="repeatMonthRule">
                <div class="flex flex-1 color-#666">
                  <span class="mr-8px">创建</span>
                  <el-select class="flex-1" v-model="form.repeatMonthRule">
                    <el-option :value="0" label="上月" />
                    <el-option :value="1" label="当月" />
                  </el-select>
                  <span class="ml-8px">数据</span>
                </div>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="repeatEndTime" class="multi-label repeat-end-time">
              <template #label> 重复创建<br />截止时间 </template>
              <div class="inline-row">
                <el-radio-group v-model="repeatEndMode" :disabled="!hasRepeatRule">
                  <el-radio :label="0">永不截止</el-radio>
                  <el-radio :label="1">截止时间</el-radio>
                </el-radio-group>
                <el-date-picker
                  v-if="repeatEndMode === 1"
                  v-model="repeatEndDate"
                  type="date"
                  value-format="YYYY-MM-DD"
                  :style="{ width: '204px' }"
                  placeholder="请选择"
                  :clearable="false"
                  :disabled="repeatEndMode !== 1 || !hasRepeatRule"
                  :disabled-date="disableRepeatEndDate"
                />
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="scoreSubmitDeadline" class="multi-label">
              <template #label>评分填写<br />截止时间</template>
              <period-day-picker
                v-model="publishPeriod"
                :mode="periodMode"
                :min-day-for-current-period="minDayForCurrentPeriod"
                :allowed-months-for-current-year="allowedMonthsForCurrentYear"
                :disabled="!hasRepeatRule"
              />
            </el-form-item>
          </el-col>
        </template>
      </el-row>

      <el-form-item label="问卷发放" prop="publishRule">
        <div class="inline-row">
          <el-radio-group v-model="publishMode">
            <el-radio :label="0">立即发放</el-radio>
            <!-- <el-radio :label="1">定时发放</el-radio> -->
          </el-radio-group>
        </div>
      </el-form-item>
      <el-row v-if="publishMode === 1" class="create-type-card" :gutter="10">
        <el-col :span="12" class="flex items-start card-item">
          <el-checkbox v-model="delaySameDayChecked" />
          <el-form-item class="multi-label flex-1" label-width="78px">
            <template #label> 创建考核<br />当日 </template>
            <el-time-picker
              v-model="publishSameDayTime"
              :disabled="!delaySameDayChecked"
              value-format="HH:mm:ss"
              format="HH:mm:ss"
              placeholder="请选择时间"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="flex items-start card-item">
          <el-checkbox v-model="delayNextDayChecked" />
          <el-form-item class="flex-1">
            <template #label> 创建考核后 </template>
            <div class="flex items-center gap-10px distribute">
              <el-input-number
                v-model="publishDelayDays"
                :min="1"
                :step="1"
                :precision="0"
                :disabled="!delayNextDayChecked"
              />
              <el-time-picker
                v-model="publishNextDayTime"
                :disabled="!delayNextDayChecked"
                value-format="HH:mm:ss"
                format="HH:mm:ss"
                placeholder="请选择时间"
              />
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="提醒时间" prop="remindRule">
        <div class="inline-row">
          <el-radio-group v-model="remindMode">
            <el-radio :label="0">不提醒</el-radio>
            <!-- <el-radio :label="1">定时提醒</el-radio> -->
          </el-radio-group>
        </div>
      </el-form-item>
      <el-row v-if="remindMode === 1" class="create-type-card" :gutter="10">
        <el-col :span="12">
          <el-form-item label="提醒时间" label-width="100px">
            <el-time-picker
              v-model="remindTime"
              value-format="HH:mm:ss"
              format="HH:mm:ss"
              placeholder="请选择时间"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, computed } from 'vue'
import dayPicker from './dayPicker.vue'
import periodDayPicker from './periodDayPicker.vue'
import {
  addAssessmentRule,
  updateAssessmentRule,
  getAssessmentRuleUpdateShow
} from '@/api/supplier/assessmentConfiguration'
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { FormRules } from 'element-plus'
dayjs.extend(customParseFormat)

interface RuleItemVo {
  id?: string
  name: string
  running: boolean
  createType: 0 | 1
  assessmentType: string
  dimension: string
  repeatFrequency?: number
  assessPeriodMonth: string
  repeatRule: string
  assessTimeRange: string
  publishRule: string
  remindRule: string
  repeatMonthRule: 0 | 1
}

const props = defineProps<{
  model?: (Partial<RuleItemVo> & { copyFromId?: string }) | null
}>()

const emit = defineEmits<{
  (e: 'success', data: Partial<RuleItemVo>): void
  (e: 'close'): void
}>()

const formRef = ref()
const form = ref<Partial<RuleItemVo>>({})

const timeRange = ref<[string, string] | undefined>(undefined)

// 0: 立即, 1: 定时
const publishMode = ref<number>(0)
const remindMode = ref<number>(0)
// 定时发放：互斥选项 + 各自时间
const delaySameDayChecked = ref<boolean>(true)
const delayNextDayChecked = ref<boolean>(false)
const publishSameDayTime = ref<string | undefined>(undefined)
const publishNextDayTime = ref<string | undefined>(undefined)
// 定时发放：天数字（1=当天，2=次日，n=创建后第 n 天）
const publishDelayDays = ref<number | undefined>(undefined)
// 评分填写截止内部对象（适配 periodDayPicker 的对象格式）
const publishPeriod = ref<{ period: number; month: number; day: number } | undefined>(undefined)
const remindTime = ref<string | undefined>(undefined)

// repeat end control: 0 永不截止，1 指定日期
const repeatEndMode = ref<number>(0)
const repeatEndDate = ref<string | undefined>(undefined)

// repeat creation helpers
const monthlyDay = ref<number | undefined>(undefined)
const quarterlyDay = ref<number | undefined>(undefined)
const yearlyDay = ref<number | undefined>(undefined)
// 评分填写截止选择器模式
const periodMode = ref<'month' | 'quarter' | 'year'>('month')
watch(
  () => form.value.dimension,
  (d) => {
    if (d === 'month') periodMode.value = 'month'
    else if (d === 'quarter') periodMode.value = 'quarter'
    else if (d === 'year') periodMode.value = 'year'
  },
  { immediate: true }
)

// 切换考核维度时，清空“评分填写截止时间”的“日”选择，避免沿用上一维度的日期
watch(
  () => form.value.dimension,
  () => {
    if (form.value.createType !== 1) return
    // console.log(publishPeriod.value)

    // if (publishPeriod.value) {
    //   publishPeriod.value = { ...publishPeriod.value, day: undefined as any }
    // }
    // console.log(publishPeriod.value)
  }
)

// 选择“永不截止”时清空截止日期
watch(
  () => repeatEndMode.value,
  (mode) => {
    if (mode !== 1) {
      repeatEndDate.value = undefined
    }
  }
)

// 定时发放：两个复选框互斥
watch(
  () => delaySameDayChecked.value,
  (v) => {
    if (v) {
      delayNextDayChecked.value = false
      // 选中“当日”时清空“创建考核后”的时间
      publishNextDayTime.value = undefined
      // 当选择当日时，天数字固定为 1（仅用于序列化）
      // publishDelayDays.value = publishDelayDays.value || 2
    } else if (!delayNextDayChecked.value) {
      // 至少保持一个为选中
      delaySameDayChecked.value = true
    }
  }
)
watch(
  () => delayNextDayChecked.value,
  (v) => {
    if (v) {
      delaySameDayChecked.value = false
      // 选中“创建考核后”时清空“当日”的时间
      publishSameDayTime.value = undefined
      // 未设置时默认“次日”
      // if (!publishDelayDays.value || publishDelayDays.value < 1) publishDelayDays.value = 2
    } else if (!delaySameDayChecked.value) {
      delayNextDayChecked.value = true
    }
  }
)

// 切换“创建类型”时，重置问卷发放 / 提醒时间，并清空被隐藏分支的子项
// watch(
//   () => form.value.createType,
//   (type) => {
//     // 统一重置问卷发放与提醒时间
//     publishMode.value = 0
//     delaySameDayChecked.value = true
//     delayNextDayChecked.value = false
//     publishSameDayTime.value = undefined
//     publishNextDayTime.value = undefined
//     remindMode.value = 0
//     remindTime.value = undefined
//     form.value.publishRule = ''
//     form.value.remindRule = ''

//     if (type === 0) {
//       // 切到单次创建：清空重复创建相关的子项
//       monthlyDay.value = undefined
//       quarterlyDay.value = undefined
//       yearlyDay.value = undefined
//       repeatEndMode.value = 0
//       repeatEndDate.value = undefined
//       publishPeriod.value = undefined
//       form.value.repeatRule = ''
//     } else {
//       // 切到重复创建：清空单次创建相关的子项
//       timeRange.value = undefined
//       form.value.assessTimeRange = ''
//       form.value.assessPeriodMonth = ''
//     }
//   }
// )

// 格式互转：YYYY-MM <-> YYYY年MM月（仅月粒度）
function normalizeMonthValue(val: string | undefined): string {
  if (!val) return ''
  const d = dayjs(val, ['YYYY年MM月', 'YYYY-MM'], true)
  return d.isValid() ? d.format('YYYY-MM') : val
}

function formatMonthToZh(val: string | undefined): string | undefined {
  if (!val) return undefined
  const d = dayjs(val, ['YYYY-MM', 'YYYY年MM月'], true)
  return d.isValid() ? d.format('YYYY年MM月') : val
}

const rules: FormRules = {
  name: [{ required: true, message: '请输入考核规则', trigger: 'blur' }],
  assessmentType: [{ required: true, message: '请选择考核类型', trigger: 'change' }],
  dimension: [{ required: true, message: '请选择考核维度', trigger: 'change' }],
  assessPeriodMonth: [
    {
      validator: (_: any, _val: any, cb: any) => {
        if (form.value.createType === 0) {
          return form.value.assessPeriodMonth ? cb() : cb(new Error('请选择考核期'))
        }
        cb()
      },
      trigger: 'change',
      required: true
    }
  ],
  assessTimeRange: [
    {
      validator: (_: any, _val: any, cb: any) => {
        if (form.value.createType === 0) {
          const ok =
            Array.isArray(timeRange.value) &&
            timeRange.value.length === 2 &&
            !!timeRange.value[0] &&
            !!timeRange.value[1]
          return ok ? cb() : cb(new Error('请选择考核时间'))
        }
        cb()
      },
      trigger: 'change',
      required: true
    }
  ],
  repeatFrequency: [
    {
      validator: (_: any, _val: any, cb: any) => {
        if (form.value.createType === 1 && form.value.dimension === 'year') {
          return form.value.repeatFrequency ? cb() : cb(new Error('请选择重复频率(月份)'))
        }
        cb()
      },
      trigger: 'change',
      required: true
    }
  ],
  repeatRule: [
    {
      validator: (_: any, _val: any, cb: any) => {
        if (form.value.createType === 1) {
          if (form.value.dimension === 'month') {
            return monthlyDay.value ? cb() : cb(new Error('请选择重复规则日期'))
          }
          if (form.value.dimension === 'quarter') {
            return quarterlyDay.value ? cb() : cb(new Error('请选择重复规则日期'))
          }
          if (form.value.dimension === 'year') {
            return form.value.repeatFrequency && yearlyDay.value
              ? cb()
              : cb(new Error('请选择重复频率与日期'))
          }
        }
        cb()
      },
      trigger: 'change',
      required: true
    }
  ],
  repeatMonthRule: {
    required: true,
    validator(_, value, callback) {
      let error: Error | undefined = undefined
      switch (true) {
        case value === undefined:
          error = new Error('请选择')
          break
        case value === 0 && publishPeriod.value?.period === 0:
          error = new Error('截止时间为当月，不可创建上月考核')
          break
      }
      callback(error)
    }
  },
  repeatEndTime: [
    {
      validator: (_: any, _val: any, cb: any) => {
        if (form.value.createType === 1) {
          if (repeatEndMode.value === 1) {
            return repeatEndDate.value ? cb() : cb(new Error('请选择截止时间'))
          }
        }
        cb()
      },
      trigger: 'change',
      required: true
    }
  ],
  scoreSubmitDeadline: [
    {
      validator: (_: any, _val: any, cb: any) => {
        if (form.value.createType === 1) {
          const p = publishPeriod.value
          if (!p) return cb(new Error('请选择评分填写截止时间'))
          if (form.value.dimension === 'month') {
            return p.day ? cb() : cb(new Error('请选择评分填写截止日'))
          }
          if (form.value.dimension === 'quarter' || form.value.dimension === 'year') {
            return p.month && p.day ? cb() : cb(new Error('请选择评分填写截止月与日'))
          }
        }
        cb()
      },
      trigger: 'change',
      required: true
    }
  ]
}

// 字典选项
const assessmentTypeOptions = ref<any[]>([])
const dimensionOptions = ref<any[]>([])
function loadDicts() {
  assessmentTypeOptions.value = getIntDictOptions(DICT_TYPE.SUPPLIER_ASSESSMENT_TYPE, true)
  dimensionOptions.value = getIntDictOptions(DICT_TYPE.SUPPLIER_ASSESSMENT_DIMENSION, true).filter(
    (item: any) => item.value === 'month'
  )
}
onMounted(async () => {
  loadDicts()
  // 编辑回显：若存在 id 则拉取详情
  if (props.model && (props.model as any).id) {
    await fetchDetail(String((props.model as any).id))
    return
  }
  // 复制回显：存在 copyFromId 时拉取详情，并清空“考核规则、创建类型”，且不带 id
  if (props.model && (props.model as any).copyFromId) {
    const copyId = String((props.model as any).copyFromId)
    await fetchDetail(copyId)
    // 清空不需要复制的字段与 id，确保后续保存走新增
    form.value.id = undefined
    form.value.name = ''
    // form.value.createType = undefined
  }
})

// 拉取编辑详情
async function fetchDetail(id: string) {
  try {
    const res: any = await getAssessmentRuleUpdateShow({ id })

    const singleCfg = res?.singleCreateConfig || {}
    const repeatedCfg = res?.repeatedCreateConfig || {}

    const createType = Number(res?.quizCreateType ?? 0) as 0 | 1
    const assessmentType = String(
      createType === 0 ? singleCfg?.assessmentType ?? '1' : repeatedCfg?.assessmentType ?? '1'
    )
    const dimension = String(
      createType === 0 ? singleCfg?.dimension ?? 'month' : repeatedCfg?.dimension ?? 'month'
    )

    const timeRangeStr: string = res?.timeRange
      ? String(res.timeRange)
      : singleCfg?.startTime && singleCfg?.endTime
        ? `${singleCfg.startTime} ~ ${singleCfg.endTime}`
        : ''

    form.value = {
      id,
      name: res?.ruleName ?? '',
      running: (res?.status ?? 1) === 1,
      createType,
      assessmentType,
      dimension,
      repeatFrequency: Number(repeatedCfg?.repeatFrequency ?? 1),
      assessPeriodMonth: normalizeMonthValue(String(singleCfg?.period ?? '')),
      repeatRule: '',
      assessTimeRange: timeRangeStr,
      publishRule: '',
      remindRule: '',
      repeatMonthRule: res?.repeatedCreateConfig?.repeatMonthRule
    }

    // 初始化单次创建时间范围
    if (timeRangeStr && timeRangeStr.includes('~')) {
      const [s, e] = timeRangeStr.split('~').map((t: string) => t.trim())
      timeRange.value = [s, e]
    } else {
      timeRange.value = undefined
    }

    // 问卷发放（仅使用 quizSendType / quizDelayTime）
    publishMode.value = Number(res?.quizSendType ?? 0)
    if (publishMode.value === 1) {
      const q = String(res?.quizDelayTime || '')
      const m = q.match(/^(\d+),(\d{2}:\d{2}:\d{2})$/)
      if (m) {
        const days = Math.max(1, Number(m[1]))
        const timeStr = m[2]
        publishDelayDays.value = days
        if (days === 1) {
          delaySameDayChecked.value = true
          delayNextDayChecked.value = false
          publishSameDayTime.value = timeStr
          publishNextDayTime.value = undefined
        } else {
          delaySameDayChecked.value = false
          delayNextDayChecked.value = true
          publishNextDayTime.value = timeStr
          publishSameDayTime.value = undefined
        }
      } else {
        delaySameDayChecked.value = true
        delayNextDayChecked.value = false
        // publishDelayDays.value = 1
        publishSameDayTime.value = '08:00:00'
        publishNextDayTime.value = undefined
      }
    } else {
      delaySameDayChecked.value = true
      delayNextDayChecked.value = false
      // publishDelayDays.value = 2
      publishSameDayTime.value = undefined
      publishNextDayTime.value = undefined
    }

    // 提醒时间（仅使用 quizNotifyType / quizNotifyTime）
    remindMode.value = Number(res?.quizNotifyType ?? 0)
    remindTime.value =
      remindMode.value === 1 ? String(res?.quizNotifyTime || '08:00:00') : undefined

    // 重复创建配置解析
    if (createType === 1) {
      if (dimension === 'month') {
        monthlyDay.value = Number(repeatedCfg?.repeatRule ?? 0) || undefined
        quarterlyDay.value = undefined
        yearlyDay.value = undefined
      } else if (dimension === 'quarter') {
        quarterlyDay.value = Number(repeatedCfg?.repeatRule ?? 0) || undefined
        monthlyDay.value = undefined
        yearlyDay.value = undefined
      } else if (dimension === 'year') {
        yearlyDay.value = Number(repeatedCfg?.repeatRule ?? 0) || undefined
        monthlyDay.value = undefined
        quarterlyDay.value = undefined
      }
      // 截止时间
      if (repeatedCfg?.repeatEndTime) {
        repeatEndMode.value = 1
        repeatEndDate.value = String(repeatedCfg.repeatEndTime)
      } else {
        repeatEndMode.value = 0
        repeatEndDate.value = undefined
      }
      // 评分填写截止时间（period, [month,] day）
      const ruleStr = String(repeatedCfg?.repeatScoreSubmitTimeRule || '')
      const parts = ruleStr.split(',').map((s: string) => Number(s))
      if (parts.length >= 2) {
        const period = (parts[0] || 1) - 1
        if (dimension === 'month') {
          const day = parts[1] || undefined
          publishPeriod.value = day ? { period, month: undefined as any, day } : undefined
        } else {
          const month = parts[1] || undefined
          const day = parts[2] || undefined
          publishPeriod.value = month && day ? { period, month, day } : undefined
        }
      } else {
        publishPeriod.value = undefined
      }
    } else {
      // 单次创建：清空重复项
      monthlyDay.value = undefined
      quarterlyDay.value = undefined
      yearlyDay.value = undefined
      repeatEndMode.value = 0
      repeatEndDate.value = undefined
      publishPeriod.value = undefined
    }
  } catch (e) {
    console.error(e)
  }
}

async function submit() {
  if (!formRef.value) return
  await formRef.value.validate()
  // 合成 assessTimeRange
  if (timeRange.value && timeRange.value.length === 2) {
    form.value.assessTimeRange = `${timeRange.value[0]} ~ ${timeRange.value[1]}`
  } else {
    form.value.assessTimeRange = ''
  }
  // 合成问卷发放/提醒时间
  if (publishMode.value === 0) {
    form.value.publishRule = '立即发放'
  } else {
    // 构造显示文案，供界面展示
    if (delaySameDayChecked.value) {
      form.value.publishRule = `创建考核当天 ${publishSameDayTime.value || '08:00:00'} 发放`
    } else {
      const dayNum = publishDelayDays.value
      form.value.publishRule = `创建考核后 第${dayNum}天 ${publishNextDayTime.value || '08:00:00'} 发放`
    }
  }
  if (remindMode.value === 0) {
    form.value.remindRule = '不提醒'
  } else {
    form.value.remindRule = `每天${remindTime.value || '08:00:00'}提醒`
  }
  // 合成重复规则（仅重复创建时）
  if (form.value.createType === 1) {
    if (form.value.dimension === 'month') {
      if (!monthlyDay.value) throw new Error('请选择每月的重复日期')
      form.value.repeatRule = `每月 ${monthlyDay.value} 日 创建`
    } else if (form.value.dimension === 'quarter') {
      if (!quarterlyDay.value) throw new Error('请选择每季度的重复日期')
      form.value.repeatRule = `每季度首月 ${quarterlyDay.value} 日 创建`
    } else if (form.value.dimension === 'year') {
      // 年度：以 repeatFrequency 为月份
      const month = form.value.repeatFrequency
      if (!month || !yearlyDay.value) throw new Error('请选择年度的月份与日期')
      form.value.repeatRule = `每年 ${month} 月 ${yearlyDay.value} 日 创建`
    }
    if (repeatEndMode.value === 1) {
      if (!repeatEndDate.value) throw new Error('请选择截止时间')
      form.value.repeatRule = `${form.value.repeatRule}, 截止至 ${repeatEndDate.value} 停止重复创建`
    }
  } else {
    form.value.repeatRule = ''
  }
  // 组装后端入参
  const buildRepeatScoreSubmitTimeRule = (): string | undefined => {
    if (!publishPeriod.value) return undefined
    const periodCode = (publishPeriod.value.period ?? 0) + 1 // 0/1 -> 1/2
    const day = publishPeriod.value.day
    if (!day) return undefined
    if (form.value.dimension === 'month') {
      return `${periodCode},${day}`
    }
    // 季度/年度：携带月份
    const month = publishPeriod.value.month
    if (!month) return undefined
    return `${periodCode},${month},${day}`
  }

  const payload: any = {
    ruleName: form.value.name || undefined,
    status: form.value.running ? 1 : 0,
    quizCreateType: form.value.createType,
    quizSendType: publishMode.value,
    quizDelayTime:
      publishMode.value === 1
        ? (() => {
            const days = delaySameDayChecked.value ? 1 : publishDelayDays.value
            const t = delaySameDayChecked.value
              ? publishSameDayTime.value || '08:00:00'
              : publishNextDayTime.value || '08:00:00'
            return `${days},${t}`
          })()
        : undefined,
    quizNotifyType: remindMode.value,
    quizNotifyTime: remindMode.value === 1 ? remindTime.value || '08:00:00' : null
  }

  if (form.value.createType === 0) {
    // 单次创建配置
    const [start, end] = timeRange.value || []
    const zhPeriod = formatMonthToZh(form.value.assessPeriodMonth)
    payload.singleCreateConfig = {
      assessmentType: form.value.assessmentType,
      dimension: form.value.dimension,
      period: zhPeriod,
      startTime: start || undefined,
      endTime: end || undefined
    }
  } else {
    // 重复创建配置
    let repeatRuleDay: number | undefined
    if (form.value.dimension === 'month') repeatRuleDay = monthlyDay.value
    else if (form.value.dimension === 'quarter') repeatRuleDay = quarterlyDay.value
    else if (form.value.dimension === 'year') repeatRuleDay = yearlyDay.value

    payload.repeatedCreateConfig = {
      assessmentType: form.value.assessmentType,
      dimension: form.value.dimension,
      repeatRule: repeatRuleDay,
      repeatFrequency: form.value.dimension === 'year' ? form.value.repeatFrequency : undefined,
      repeatEndTime: repeatEndMode.value === 1 ? repeatEndDate.value || undefined : null,
      repeatScoreSubmitTimeRule: buildRepeatScoreSubmitTimeRule(),
      repeatMonthRule: form.value?.repeatMonthRule
    }
  }

  try {
    if (form.value.id) {
      await updateAssessmentRule({ id: form.value.id, ...payload })
    } else {
      await addAssessmentRule(payload)
    }
    // 成功后回传视图对象并关闭抽屉
    emit('success', { ...form.value })
  } catch (e) {
    // 上抛错误以便外层处理或在控制台查看
    console.error(e)
    throw e
  }
}

function beforeClose(done: () => void) {
  done()
}

// 评分填写截止时间限制：根据维度与重复规则计算
const minDayForCurrentPeriod = computed<number | undefined>(() => {
  if (form.value.createType !== 1) return undefined
  if (form.value.dimension === 'month') {
    return monthlyDay.value || undefined
  }
  if (form.value.dimension === 'quarter') {
    // 当季度第一个月限制为重复规则日，其余月份不限
    return quarterlyDay.value || undefined
  }
  if (form.value.dimension === 'year') {
    // 当年且选择的是重复频率的月份时，限制为重复规则日
    return yearlyDay.value || undefined
  }
  return undefined
})

const allowedMonthsForCurrentYear = computed<number[] | undefined>(() => {
  if (form.value.createType !== 1) return undefined
  if (form.value.dimension !== 'year') return undefined
  // 仅当年需要限制月份；允许的月份集合为重复频率选择的月份
  const month = form.value.repeatFrequency
  return month ? [month] : undefined
})

// 是否已选择“重复规则”
const hasRepeatRule = computed<boolean>(() => {
  if (form.value.createType !== 1) return false
  if (form.value.dimension === 'month') return !!monthlyDay.value
  if (form.value.dimension === 'quarter') return !!quarterlyDay.value
  if (form.value.dimension === 'year') return !!(form.value.repeatFrequency && yearlyDay.value)
  return false
})

// “重复创建截止时间”不得早于当前季度/年度的规则日（使用 dayjs）
function disableRepeatEndDate(date: Date) {
  try {
    if (repeatEndMode.value !== 1) return false
    if (form.value.createType !== 1) return false

    const candidate = dayjs(date)
    const now = dayjs()

    if (form.value.dimension === 'month') {
      // 当前月份的重复规则日（考虑当月天数上限），该日期之前均禁用
      const ruleDay = monthlyDay.value || 0
      if (!ruleDay) return false

      const daysInCurrentMonth = now.daysInMonth()
      const safeDay = Math.min(ruleDay, daysInCurrentMonth)
      const ruleDate = now.year(now.year()).month(now.month()).date(safeDay)
      return candidate.isBefore(ruleDate, 'day')
    }

    if (form.value.dimension === 'quarter') {
      // 当前月份的重复规则日（本月 ruleDay 当天之前禁用）
      const ruleDay = quarterlyDay.value || 0
      if (!ruleDay) return false

      // 规则日为当年当月的 ruleDay，将该日期作为最小可选日期
      const ruleDate = now.year(now.year()).month(now.month()).date(ruleDay)
      // 任何早于当月规则日的日期均禁用（包括上月在当月面板中显示的日期格）
      return candidate.isBefore(ruleDate, 'day')
    }

    if (form.value.dimension === 'year') {
      // 截止时间不得早于：当前年份 + 选择的重复月份 + 规则日（超出当月天数则取当月最后一天）
      const month = form.value.repeatFrequency
      const ruleDay = yearlyDay.value || 0
      if (!month || !ruleDay) return false

      const base = now.year(now.year()).month(month - 1)
      const daysInTargetMonth = base.daysInMonth()
      const safeDay = Math.min(ruleDay, daysInTargetMonth)
      const ruleDate = base.date(safeDay)

      // 任何早于该阈值日期的都禁用
      return candidate.isBefore(ruleDate, 'day')
    }
  } catch (e) {
    console.error(e)
  }
  return false
}

defineExpose({ submit, beforeClose })
</script>

<style lang="scss" scoped>
:deep(.el-form) {
  /* padding: 0 8px 8px 8px; */

  .create-type-card {
    border-radius: 10px;
    .card-item {
      display: flex !important;
      .el-checkbox {
        margin-left: 7px;
      }
    }
  }

  .el-date-editor {
    width: 100%;
    --el-date-editor-width: 100%;
    .el-range-input {
      width: 45%;
    }
    .el-range-separator {
      flex: 0.5;
      padding: 0;
    }
  }
  .el-checkbox__inner {
    /* 1. 将方形变成圆形 */
    border-radius: 50%;

    /* 2. 调整选中时的背景色和边框颜色（可选，保持一致性） */
    /* 如果不设置，它将使用默认的 $--color-primary */
  }
  .el-form-item {
    line-height: 32px;
    &.multi-label {
      .el-form-item__label {
        line-height: 16px;
      }
      .el-radio-group {
        .el-radio {
          margin-right: 20px;
        }
        margin-right: 8px;
      }
    }
  }
  .el-radio-group {
    display: flex;
    flex-wrap: nowrap;
  }
  .distribute {
    width: 100%;
    .el-input-number {
      flex-shrink: 0;
    }
  }
  .repeat-end-time {
    .el-radio-group {
      .el-radio:last-child {
        margin-right: unset;
      }
    }
  }
}
.inline-row {
  display: flex;
  align-items: center;
  gap: 6px;
}
.mx8 {
  margin: 0 8px;
}
.text-sub {
  color: #909399;
}
</style>
