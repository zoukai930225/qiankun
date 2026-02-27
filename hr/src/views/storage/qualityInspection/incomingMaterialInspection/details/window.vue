<template>
  <scheme-dialog ref="dialogRef" :name="dialogName" :width="1100">
    <template #card>
      <div class="incoming-material-inspection-window">
        <FormContentLayout :layouts="layouts" class="incoming-material-inspection-window__layout">
          <template #inspectInfo>
            <el-form
              ref="formRef"
              :model="form"
              :rules="rules"
              :disabled="isView"
              label-width="110px"
              class="window-form"
            >
              <el-row :gutter="16">
                <el-col :span="8">
                  <el-form-item label="抽检数量" prop="sampleQty">
                    <el-input-number
                      v-model="form.sampleQty"
                      class="w-full text-left-input"
                      :min="1"
                      :precision="0"
                      :controls="false"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="不合格批次" prop="unQualifiedBatches">
                    <el-input-number
                      v-model="form.unQualifiedBatches"
                      class="w-full text-left-input"
                      :min="0"
                      :precision="0"
                      :controls="false"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="残品数量" prop="defectQty">
                    <el-input-number
                      v-model="form.defectQty"
                      class="w-full text-left-input"
                      :min="0"
                      :precision="0"
                      :controls="false"
                      @change="handleDefectChange"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="正品数量" prop="goodQty">
                    <el-input-number
                      v-model="form.goodQty"
                      class="w-full text-left-input"
                      :min="0"
                      :precision="0"
                      :controls="false"
                      disabled
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="抽检合格率">
                    <el-input
                      :model-value="sampleQualifiedRateText"
                      class="w-full text-left-input"
                      disabled
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="抽检次品率">
                    <el-input
                      :model-value="sampleDefectRateText"
                      class="w-full text-left-input"
                      disabled
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="入库次品率">
                    <el-input
                      :model-value="inboundDefectRateText"
                      class="w-full text-left-input"
                      disabled
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="处理方案">
                    <el-select
                      v-model="form.processPlan"
                      class="w-full text-left-input"
                      clearable
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="opt in processPlanOptions"
                        :key="String(opt.value)"
                        :label="opt.label"
                        :value="String(opt.value)"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="商品类型">
                    <el-select
                      v-model="form.goodsType"
                      class="w-full text-left-input"
                      clearable
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="opt in goodsTypeOptions"
                        :key="String(opt.value)"
                        :label="opt.label"
                        :value="String(opt.value)"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="到货批次" prop="arrivalBatches">
                    <el-input-number
                      v-model="form.arrivalBatches"
                      class="w-full text-left-input"
                      :min="1"
                      :precision="0"
                      :controls="false"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="16">
                  <el-form-item label="判定原因">
                    <s-textarea
                      :disabled="isView"
                      v-model="form.judgeReason"
                      :autosize="{ minRows: 2, maxRows: 4 }"
                      placeholder="请输入判定原因"
                      class="text-left-input"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </template>

          <template #defectInfo>
            <el-form :model="form" label-width="110px" class="window-form" :disabled="isView">
              <el-row :gutter="16">
                <el-col v-for="item in defectItems" :key="item.key" :span="8">
                  <el-form-item :label="item.label">
                    <el-input-number
                      v-model="form.defects[item.key]"
                      class="w-full text-left-input"
                      :min="0"
                      :precision="0"
                      :controls="false"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="共计">
                    <el-input
                      :model-value="String(defectTotal)"
                      class="w-full text-left-input"
                      disabled
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </template>
        </FormContentLayout>
      </div>
    </template>
    <template #button>
      <el-button @click="dialogRef?.close()" :disabled="loading">取消</el-button>
      <el-button type="primary" @click="handleConfirm" :loading="loading" :disabled="loading">
        确定
      </el-button>
    </template>
  </scheme-dialog>
</template>

<script setup lang="ts">
import { computed, provide, ref, watch, reactive } from 'vue'
import { cloneDeep } from 'lodash-es'
import type { FormInstance, FormRules } from 'element-plus'
import { useMessage } from '@/hooks/web/useMessage'
import { getSampleSize } from '../utils/aql'
import FormContentLayout from '@/layout/components/ContentLayout'
import { getStrDictOptions } from '@/utils/dict'

type GoodsRow = {
  /** 明细采购量（接口字段 num2） */
  num2?: number
  /** 同 goodsNo 汇总后的采购总数（来自 groupNum2/_groupTotal） */
  _groupTotal?: number
  groupNum2?: number | string
  _inspectData?: any
}

const defectDictOptions = computed(() => getStrDictOptions('inspection_info_defect') || [])
const defectItems = computed(() =>
  defectDictOptions.value.map((d) => ({ key: String(d.value), label: d.label }))
)

const dialogName = 'IncomingMaterialInspectionWindow'
const dialogRef = ref<any>()
const formRef = ref<FormInstance>()

const message = useMessage()

const dataValue = ref<Record<string, any>>({})
const bukValue = ref<Record<string, any>>({})
const viewType = ref<'edit' | 'view'>('edit')
const title = ref('检验信息')
const loading = ref(false)

provide(`${dialogName}Details`, { dataValue, bukValue, viewType, title, loading })

const isView = computed(() => viewType.value === 'view')

const currentRow = ref<GoodsRow | null>(null)
const currentPurchaseTotal = ref<number>(0)
const currentPurchaseQty = ref<number>(0)

const form = ref<{
  sampleQty: number
  unQualifiedBatches: number
  defectQty: number | null
  goodQty: number
  arrivalBatches: number
  processPlan: string
  goodsType: string
  judgeReason: string
  defects: Record<string, number | null>
}>({
  sampleQty: 1,
  unQualifiedBatches: 1,
  defectQty: null,
  goodQty: 1,
  arrivalBatches: 1,
  processPlan: '',
  goodsType: '',
  judgeReason: '',
  defects: {}
})

// 校验规则逻辑
const validateSampleQty = (rule: any, value: any, callback: any) => {
  if (value === null || value === undefined) {
    return callback(new Error('请输入抽检数量'))
  }
  if (value > currentPurchaseTotal.value) {
    callback(new Error(`抽检数量不能大于采购总数 (${currentPurchaseTotal.value})`))
  } else {
    callback()
  }
}

// 修改 validateSum 方法
const validateSum = (rule: any, value: any, callback: any) => {
  // 即使值为空也进行逻辑校验，因为是联动计算的
  const defect = Number(form.value.defectQty) || 0
  const good = Number(form.value.goodQty) || 0
  const total = currentPurchaseTotal.value || 0

  // 校验1：残品不能大于采购数
  if (defect > total) {
    return callback(new Error(`残品数量不能大于采购总数 (${total})`))
  }

  // 校验2：总量平衡
  if (defect + good !== total) {
    callback(new Error('残品数量 + 正品数量 必须等于 采购总数'))
  } else {
    callback()
  }
}

// 校验规则
const rules = reactive<FormRules>({
  sampleQty: [
    { required: true, message: '请输入抽检数量', trigger: 'blur' },
    { validator: validateSampleQty, trigger: 'blur' }
  ],
  unQualifiedBatches: [{ required: true, message: '请输入不合格批次', trigger: 'blur' }],
  defectQty: [
    { required: true, message: '请输入残品数量', trigger: 'blur' },
    { validator: validateSum, trigger: 'blur' }
  ],
  goodQty: [
    { required: true, message: '请输入正品数量', trigger: 'blur' },
    { validator: validateSum, trigger: 'blur' }
  ],
  arrivalBatches: [{ required: true, message: '请输入到货批次', trigger: 'blur' }]
})

const processPlanOptions = computed(
  () => getStrDictOptions('inspection_info_handling_solution') || []
)
const goodsTypeOptions = computed(
  () => getStrDictOptions('qc_quality_inspection_product_type') || []
)

const layouts = computed(() => [
  { label: '检验信息', key: 'inspectInfo' },
  { label: '疵点信息', key: 'defectInfo' }
])

// 修改点：如果全部没填，返回空字符串；否则返回数字总和
const defectTotal = computed(() => {
  const items = defectItems.value || []
  const hasValue = items.some((cur) => {
    const val = form.value.defects[cur.key]
    return val !== null && val !== undefined
  })

  if (!hasValue) return ''

  return items.reduce((sum, cur) => sum + (Number(form.value.defects[cur.key]) || 0), 0)
})

const toPercentText = (val: number) => {
  if (!Number.isFinite(val)) return '0.00%'
  return `${val.toFixed(2)}%`
}

const handleDefectChange = () => {
  formRef.value?.validateField('goodQty')
}

const handleGoodChange = () => {
  formRef.value?.validateField('defectQty')
}

// 抽检合格率 = (1 - 不合格批次 / 到货批次) * 100%
const sampleQualifiedRate = computed(() => {
  const arrival = Number(form.value.arrivalBatches) || 0
  const unQualified = Number(form.value.unQualifiedBatches) || 0
  if (arrival <= 0) return 0
  return ((1 - unQualified) / arrival) * 100
})
const sampleQualifiedRateText = computed(() => toPercentText(sampleQualifiedRate.value))

// 抽检次品率 = 疵点数量总计 / 抽检数量 * 100%
const sampleDefectRate = computed(() => {
  const sample = Number(form.value.sampleQty) || 0
  // 使用 Number() 强转，确保空字符串被当作 0 处理
  const defect = Number(defectTotal.value) || 0
  if (sample <= 0) return 0
  return (defect / sample) * 100
})
const sampleDefectRateText = computed(() => toPercentText(sampleDefectRate.value))

// 入库次品率 = 疵点数量总计 / 正品数量 * 100%
const inboundDefectRate = computed(() => {
  const good = Number(form.value.goodQty) || 0
  // 使用 Number() 强转，确保空字符串被当作 0 处理
  const defect = Number(defectTotal.value) || 0
  if (good <= 0) return 0
  return (defect / good) * 100
})
const inboundDefectRateText = computed(() => toPercentText(inboundDefectRate.value))

const normalizeDefects = () => {
  const next: Record<string, number | null> = { ...(form.value.defects || {}) }
  for (const it of defectItems.value) {
    if (!(it.key in next)) next[it.key] = null
  }
  Object.keys(next).forEach((k) => {
    if (!defectItems.value.some((it) => it.key === k)) delete next[k]
  })
  form.value.defects = next
}

watch(
  () => defectItems.value,
  () => {
    normalizeDefects()
  },
  { immediate: true }
)

const snapshot = () => ({
  num2: currentPurchaseTotal.value,
  form: cloneDeep(form.value),
  defects: defectItems.value.map((it) => ({
    defectType: it.key,
    defectQuantity: Number(form.value.defects?.[it.key]) || 0
  }))
})

watch(
  () => form.value,
  () => {
    dataValue.value = snapshot()
  },
  { deep: true, immediate: true }
)

watch(
  () => form.value.defectQty,
  (newDefect) => {
    const total = currentPurchaseTotal.value || 0
    const defect = Number(newDefect) || 0
    // 自动计算正品数量 = 采购总数 - 残品数量
    // 保证不小于 0
    const calculatedGood = Math.max(0, total - defect)
    form.value.goodQty = calculatedGood

    // 触发正品数量的校验（主要是为了消除之前的报错显示）
    // 稍微延迟一下以确保DOM更新
    if (!loading.value) {
      // 避免初始化时频繁触发
      formRef.value?.validateField(['goodQty', 'defectQty'])
    }
  }
)

const resetWithRow = (row: GoodsRow) => {
  const total = Number(row._groupTotal || row.groupNum2 || row.num2) || 0
  currentPurchaseQty.value = total
  currentPurchaseTotal.value = total

  // 1. 根据 AQL 公式自动带入抽检数量
  const defaultSampleQty = Math.max(1, getSampleSize(total))

  const defaultGoodQty = total

  const base = {
    sampleQty: defaultSampleQty,
    unQualifiedBatches: 1,
    defectQty: null,
    goodQty: defaultGoodQty,
    arrivalBatches: 1,
    processPlan: '',
    goodsType: '',
    judgeReason: '',
    defects: defectItems.value.reduce((acc: Record<string, number | null>, cur) => {
      acc[cur.key] = null
      return acc
    }, {})
  }

  const restore = row._inspectData?.form ? row._inspectData.form : null
  form.value = { ...base, ...(restore || {}) }
  normalizeDefects()

  setTimeout(() => {
    formRef.value?.clearValidate()
  }, 0)

  dataValue.value = snapshot()
  bukValue.value = cloneDeep(snapshot())
}

const open = async (row: GoodsRow, type: 'edit' | 'view' = 'edit') => {
  currentRow.value = row
  viewType.value = type
  resetWithRow(row)
  dialogRef.value?.openDialog?.(
    () => {},
    () => {}
  )
}

const handleConfirm = async () => {
  if (!formRef.value) return

  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  const arrivalBatches = Number(form.value.arrivalBatches) || 0
  const unQualifiedBatches = Number(form.value.unQualifiedBatches) || 0
  if (unQualifiedBatches > arrivalBatches) {
    message.warning('不合格批次不能大于到货批次')
    return
  }

  if (currentRow.value) {
    currentRow.value._inspectData = cloneDeep(snapshot())
  }

  // “确定”视为已保存：同步备份，避免关闭时触发未保存提示
  bukValue.value = cloneDeep(snapshot())
  dataValue.value = cloneDeep(snapshot())
  dialogRef.value?.close()
  emitConfirm()
}

const emit = defineEmits<{
  (e: 'confirm', payload: { row: GoodsRow; data: any }): void
}>()

const emitConfirm = () => {
  if (!currentRow.value) return
  emit('confirm', { row: currentRow.value, data: cloneDeep(snapshot()) })
}

defineExpose({ open })
</script>

<style scoped lang="scss">
.incoming-material-inspection-window {
  width: 100%;
}

.incoming-material-inspection-window__layout :deep(.el-form-item) {
  margin-bottom: 18px; /* 预留校验错误信息空间 */
}

:deep(.el-dialog__body) {
  padding: 0 !important;
}

.w-full {
  width: 100% !important;
}

/* 2. 强制所有 Input 内容左对齐 */
.text-left-input {
  :deep(.el-input__inner) {
    text-align: left !important;
  }
  :deep(.el-textarea__inner) {
    text-align: left !important;
  }
}
</style>
