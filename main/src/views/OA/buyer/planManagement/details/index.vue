<template>
  <scheme-dialog ref="detailsRef" name="Dialog" :width="600">
    <template #card>
      <el-form
        ref="formRef"
        :model="dataValue"
        :rules="rules"
        class="random-plan-form"
        label-width="100px"
        :disabled="isView"
      >
        <el-form-item label="批量范围" class="range-form-item" required>
          <div class="range-fields">
            <el-form-item prop="initialValue" label-width="0px" class="inner-item">
              <el-input-number
                v-model="dataValue.initialValue"
                :min="0"
                :step="1"
                :step-strictly="true"
                :precision="0"
                :controls="false"
                :disabled="isRangeLocked"
                placeholder="请输入起始值"
                class="number-input"
              />
            </el-form-item>
            <span class="range-separator">-</span>
            <el-form-item prop="endValue" label-width="0px" class="inner-item">
              <el-input-number
                v-model="dataValue.endValue"
                :min="0"
                :step="1"
                :step-strictly="true"
                :precision="0"
                :controls="false"
                :disabled="isRangeLocked"
                placeholder="请输入结束值"
                class="number-input"
              />
            </el-form-item>
          </div>
        </el-form-item>
        <el-row>
          <el-col :span="24">
            <el-form-item label="样本量" prop="sampleSize">
              <el-input-number
                v-model="dataValue.sampleSize"
                :min="0"
                :step="1"
                :step-strictly="true"
                :precision="0"
                :controls="false"
                placeholder="请输入样本量"
                class="number-input full-width"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <div>
          <section-title-header class="mb-16px ml-2px">1.5标准</section-title-header>
        </div>
        <el-row>
          <el-col :span="12">
            <el-form-item label="AC" prop="onePointFiveAc" class="standard-item">
              <el-input-number
                v-model="dataValue.onePointFiveAc"
                :min="0"
                :max="10000"
                :step="1"
                :step-strictly="true"
                :precision="0"
                :controls="false"
                placeholder="请输入AC"
                class="number-input"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="RE" prop="onePointFiveRe" class="standard-item">
              <el-input-number
                v-model="dataValue.onePointFiveRe"
                :min="0"
                :max="10000"
                :step="1"
                :step-strictly="true"
                :precision="0"
                :controls="false"
                placeholder="请输入RE"
                class="number-input"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <div class="mb-16px ml-2px"> <section-title-header>2.5标准</section-title-header> </div>
        <el-row>
          <el-col :span="12">
            <el-form-item label="AC" prop="twoPointFiveAc" class="standard-item">
              <el-input-number
                v-model="dataValue.twoPointFiveAc"
                :min="0"
                :max="10000"
                :step="1"
                :step-strictly="true"
                :precision="0"
                :controls="false"
                placeholder="请输入AC"
                class="number-input"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="RE" prop="twoPointFiveRe" class="standard-item">
              <el-input-number
                v-model="dataValue.twoPointFiveRe"
                :min="0"
                :max="10000"
                :step="1"
                :step-strictly="true"
                :precision="0"
                :controls="false"
                placeholder="请输入RE"
                class="number-input"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </template>
    <template #button>
      <el-button @click="handleCancel" :disabled="loading">取消</el-button>
      <el-button type="primary" @click="submitForm" :loading="loading">确认</el-button>
    </template>
  </scheme-dialog>
</template>

<script lang="tsx">
export default { name: 'DialogDetails' }
</script>

<script lang="tsx" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { cloneDeep, debounce } from 'lodash-es'
import { DataItem } from '../config/config'
import type { FromProvideType } from '@/components/template/config/type'
import { useMessage } from '@/hooks/web/useMessage'
import {
  createRandomInspectionPlan,
  getRandomInspectionPlanDetail,
  updateRandomInspectionPlan
} from '@/api/supplier/qcManagement/randomInspectionPlanConfiguration'

// const { onSearch } = inject(`DialogForm`) as FromProvideType;

type NumericFieldKey =
  | 'initialValue'
  | 'endValue'
  | 'sampleSize'
  | 'onePointFiveAc'
  | 'onePointFiveRe'
  | 'twoPointFiveAc'
  | 'twoPointFiveRe'

type FormDataItem = Omit<DataItem, NumericFieldKey> & Record<NumericFieldKey, number | undefined>

const numericFieldKeys: Array<NumericFieldKey> = [
  'initialValue',
  'endValue',
  'sampleSize',
  'onePointFiveAc',
  'onePointFiveRe',
  'twoPointFiveAc',
  'twoPointFiveRe'
]

const createDefaultFormData = (): FormDataItem => {
  const base = { ...new DataItem() } as FormDataItem
  numericFieldKeys.forEach((key) => {
    base[key] = undefined
  })
  return base
}

const normalizeNumericValue = (value: unknown): number | undefined => {
  if (value === null || value === undefined || value === '') return undefined
  const num = Number(value)
  return Number.isNaN(num) ? undefined : num
}

const formatRangeLabel = (start: any, end: any) => {
  const normalize = (val: any) =>
    val === '' || val === null || val === undefined ? '' : String(val)
  const startText = normalize(start)
  const endText = normalize(end)
  if (!startText && !endText) return ''
  if (!startText) return endText
  if (!endText) return startText
  return `${startText}-${endText}`
}

const hydrateFormData = (payload: Partial<DataItem> = {}) => {
  const base = createDefaultFormData()
  Object.assign(base, payload)
  numericFieldKeys.forEach((key) => {
    base[key] = normalizeNumericValue(payload[key])
  })
  base.rangeLabel = formatRangeLabel(base.initialValue, base.endValue)
  return base
}

const PAGE_NAME = 'RandomInspectionPlanConfiguration'
const detailsRef = ref<any>()
const formRef = ref<FormInstance>()
const dataValue = ref<FormDataItem>(createDefaultFormData())
const bukValue = ref<FormDataItem>(createDefaultFormData())
const viewType = ref<string>('view')
const loading = ref<boolean>(false)
const message = useMessage()
const pageFormContext = inject(`${PAGE_NAME}Form`, null) as FromProvideType | null

// const props = defineProps({
//   dicInfo: { type: Array<any>, default: () => [] },
// });

const title = computed(() => {
  if (viewType.value === 'add') return '新增'
  if (viewType.value === 'edit') return '编辑'
  return '详情'
})

const isView = computed(() => viewType.value === 'view')
const isRangeLocked = computed(() => viewType.value === 'edit')

const isNonNegativeInteger = (value: unknown): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value >= 0

type ValidatorCallback = (error?: Error) => void

const ensureIntegerInput = (label: string, value: unknown, callback: ValidatorCallback) => {
  if (value === undefined || value === null || value === '') {
    callback(new Error(`请输入${label}`))
    return false
  }
  if (!isNonNegativeInteger(value)) {
    callback(new Error(`${label}需为大于等于0的整数`))
    return false
  }
  return true
}

const validateInitialValue = (_rule: any, value: unknown, callback: ValidatorCallback) => {
  if (!ensureIntegerInput('批量范围起始值', value, callback)) return
  const end = dataValue.value.endValue
  if (isNonNegativeInteger(end) && (value as number) >= end) {
    callback(new Error('批量范围起始值必须小于结束值'))
    return
  }
  callback()
}

const validateEndValue = (_rule: any, value: unknown, callback: ValidatorCallback) => {
  if (!ensureIntegerInput('批量范围结束值', value, callback)) return
  const start = dataValue.value.initialValue
  if (isNonNegativeInteger(start) && (value as number) <= start) {
    callback(new Error('批量范围结束值必须大于起始值'))
    return
  }
  callback()
}

const createIntegerValidator = (label: string) => {
  return (_rule: any, value: unknown, callback: ValidatorCallback) => {
    if (!ensureIntegerInput(label, value, callback)) return
    callback()
  }
}

const rules = reactive<FormRules<FormDataItem>>({
  initialValue: [{ validator: validateInitialValue, trigger: 'change', required: true }],
  endValue: [{ validator: validateEndValue, trigger: 'change', required: true }],
  sampleSize: [{ validator: createIntegerValidator('样本量'), trigger: 'change', required: true }],
  onePointFiveAc: [
    { validator: createIntegerValidator('1.5标准AC'), trigger: 'change', required: true }
  ],
  onePointFiveRe: [
    { validator: createIntegerValidator('1.5标准RE'), trigger: 'change', required: true }
  ],
  twoPointFiveAc: [
    { validator: createIntegerValidator('2.5标准AC'), trigger: 'change', required: true }
  ],
  twoPointFiveRe: [
    { validator: createIntegerValidator('2.5标准RE'), trigger: 'change', required: true }
  ]
})

watch(
  () => [dataValue.value.initialValue, dataValue.value.endValue],
  ([start, end]) => {
    dataValue.value.rangeLabel = formatRangeLabel(start, end)
    if (!formRef.value) return
    nextTick(() => {
      formRef.value?.validateField?.(['initialValue', 'endValue'])
    })
  },
  { immediate: true }
)

// 弹出通用
const unwrapDetailResponse = (res: any): Record<string, any> | null => {
  if (!res) return null
  if (res.data !== undefined) return res.data ?? null
  if (res.result !== undefined) return res.result ?? null
  const candidates = [res.record, res.detail, res.info]
  for (const candidate of candidates) {
    if (candidate) return candidate
  }
  const collections = [res.records, res.list, res.rows]
  for (const collection of collections) {
    if (Array.isArray(collection) && collection.length > 0) return collection[0]
  }
  return res
}

const fetchPlanDetail = async (id: any) => {
  if (id === undefined || id === null || id === '') return null
  try {
    const res = await getRandomInspectionPlanDetail(id)
    return unwrapDetailResponse(res)
  } catch (error) {
    console.error(error)
    message.error('获取详情失败')
    return null
  }
}

const openView = (item: any = {}, type: string = 'view') => {
  // detailsRef openDialog方法支持前/后置方法入参，无需操作抽屉显隐，内部已处理
  detailsRef?.value?.openDialog(
    async () => {
      loading.value = type !== 'add'
      try {
        let payload: Record<string, any> = item ?? {}
        if (type !== 'add') {
          const detailData = await fetchPlanDetail(item?.id)
          if (detailData) {
            payload = { ...payload, ...detailData }
          }
        }
        dataValue.value = hydrateFormData(payload)
        // bukValue为备份数据，用以处理已操作未保存数据校验，慎重！！！
        bukValue.value = cloneDeep({ ...dataValue.value })
        viewType.value = type
      } finally {
        loading.value = false
      }
    },
    () => {
      nextTick(() => {
        formRef?.value?.clearValidate()
      })
    }
  )
}

// 通用表单校验
const checkValue = async () => {
  if (!formRef.value) return false
  try {
    await formRef.value.validate()
    return true
  } catch (error) {
    return false
  }
}

// 提交
const submitForm = async () => {
  if (loading.value) return
  const valid: boolean = await checkValue()
  valid && submit()
}

const handleCancel = () => {
  detailsRef?.value?.close()
}

// 实际提交（防抖）
const ensureRangeValid = () => {
  const start = dataValue.value.initialValue
  const end = dataValue.value.endValue
  if (isNonNegativeInteger(start) && isNonNegativeInteger(end) && start >= end) {
    message.warning('批量范围起始值必须小于结束值')
    return false
  }
  return true
}

const buildSubmitPayload = () => {
  const payload: Record<string, any> = {}
  numericFieldKeys.forEach((key) => {
    const value = dataValue.value[key]
    payload[key] = value === undefined || value === null ? undefined : Number(value)
  })
  if (
    dataValue.value.id !== '' &&
    dataValue.value.id !== undefined &&
    dataValue.value.id !== null
  ) {
    payload.id = dataValue.value.id
  }
  payload.batchRangeName = formatRangeLabel(payload.initialValue, payload.endValue)
  Object.keys(payload).forEach((key) => {
    if (payload[key] === undefined || Number.isNaN(payload[key])) {
      delete payload[key]
    }
  })
  return payload
}

const submit = debounce(async () => {
  if (viewType.value === 'view') return
  if (!ensureRangeValid()) return
  loading.value = true
  const payload = buildSubmitPayload()
  try {
    if (viewType.value === 'add') {
      await createRandomInspectionPlan(payload)
      message.success('新增成功')
    } else if (viewType.value === 'edit') {
      await updateRandomInspectionPlan(payload)
      message.success('编辑成功')
    } else {
      return
    }
    bukValue.value = cloneDeep({ ...dataValue.value })
    await pageFormContext?.onSearch?.()
    detailsRef?.value?.close()
  } catch (error) {
    console.error(error)
    message.error('操作失败')
  } finally {
    loading.value = false
  }
}, 500)

defineExpose({ openView })

provide('DialogDetails', { dataValue, bukValue, viewType, title, loading })

/**************************************以上文件文件内容非必要不可删除，按需追加使用******************************************************* */
</script>
<style lang="scss" scoped>
@use './styles.scss';
</style>
