<template>
  <scheme-details ref="detailsRef" name="approvalDrawer" :width="600">
    <template #card>
      <el-form
        ref="formRef"
        :model="dataValue"
        :rules="rules"
        label-width="80px"
        :validate-on-rule-change="false"
      >
        <form-content-layout :layouts="layouts">
          <template v-for="(item, index) in approvalSteps" :key="item.key" #[item.key]>
            <div class="approval-section">
              <el-form-item label="审核结果" :prop="`approvalSteps.${index}.reviewStatus`">
                <el-radio-group v-model="item.reviewStatus" :disabled="!item.editable">
                  <el-radio :label="1">同意</el-radio>
                  <el-radio :label="2">拒绝</el-radio>
                </el-radio-group>
              </el-form-item>

              <template v-if="item.reviewType === 1">
                <el-form-item label="供应商" :prop="`approvalSteps.${index}.supplierId`">
                  <el-select
                    v-model="item.supplierId"
                    placeholder="请选择供应商"
                    clearable
                    filterable
                    :disabled="!item.editable"
                    @change="(val) => handleSupplierChange(val, item)"
                  >
                    <el-option
                      v-for="sup in item.supplierInfos"
                      :key="sup.supplierId"
                      :label="sup.supplierName ?? ''"
                      :value="sup.supplierId ?? ''"
                    >
                      <span>{{ sup.supplierName }}</span>
                      <!-- <span v-if="sup.supplierStatusName">（{{ sup.supplierStatusName }}）</span> -->
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="报价信息" :prop="`approvalSteps.${index}.quoteInfoId`">
                  <div class="quotation-info-wrapper">
                    <el-button
                      type="primary"
                      :icon="Document"
                      @click="openQuotationDialog(item)"
                      :disabled="getQuotationButtonDisabled(item)"
                    >
                      报价核价
                    </el-button>
                    <span class="quotation-status" :class="{ filled: item.hasQuotationInfo }">
                      <el-icon>
                        <component :is="item.hasQuotationInfo ? SuccessFilled : WarningFilled" />
                      </el-icon>
                      {{ item.hasQuotationInfo ? '已填写' : '未填写' }}
                    </span>
                  </div>
                </el-form-item>
              </template>

              <el-form-item label="备注" :prop="`approvalSteps.${index}.remark`">
                <s-text-area
                  v-model="item.remark"
                  :maxlength="200"
                  show-word-limit
                  :autosize="{ minRows: 3, maxRows: 6 }"
                  placeholder="请输入"
                  :disabled="!item.editable"
                />
              </el-form-item>

              <template v-if="item.reviewType === 2 || item.reviewType === 3">
                <el-form-item label="附件" :prop="`approvalSteps.${index}.attachment`">
                  <Transfer
                    v-model="item.attachment"
                    accept-type="all"
                    width="100%"
                    :disabled="!item.editable"
                  />
                </el-form-item>
              </template>
            </div>
          </template>
        </form-content-layout>
      </el-form>
    </template>
    <template #button>
      <div>
        <el-button @click="detailsRef?.close()" :disabled="loading">取消</el-button>
        <el-button type="primary" @click="submitForm" :disabled="loading">提交</el-button>
      </div>
    </template>
  </scheme-details>
  <quotation-and-pricing-dialog
    ref="quotationAndPricingDialogRef"
    @success="handleQuotationSuccess"
  />
</template>

<script lang="tsx" setup>
import STextArea from '@/components/common/input/s-textarea.vue'
import { computed, nextTick, provide, ref } from 'vue'
import { cloneDeep } from 'lodash-es'
import type { FormInstance, FormRules } from 'element-plus'
import { Document, WarningFilled, SuccessFilled } from '@element-plus/icons-vue'
import { useMessage } from '@/hooks/web/useMessage'
import FormContentLayout from '@/layout/components/ContentLayout'
import Transfer from '@/components/common/upload/transfer.vue'
import QuotationAndPricingDialog from './quotationAndPricingDialog.vue'
import {
  getSelectionProductReviewList,
  saveSelectionProductReview
} from '@/api/oa/buyer/productReference' // 移除了不需要的 supplier API
import eventBus from '@/utils/eventBus'

type ReviewStatus = 0 | 1 | 2

// 供应商信息接口
interface SupplierInfo {
  supplierId?: string
  supplierName?: string
  supplierStatus?: string | number
  supplierStatusName?: string
}

interface ReviewStep {
  id: string | number
  key: string
  reviewType: number
  reviewTypeName: string
  reviewerName: string
  reviewStatus?: 1 | 2
  originalStatus: ReviewStatus
  reviewStatusName?: string
  remark: string
  attachment: string
  editable: boolean
  supplierInfo?: SupplierInfo | null
  supplierId?: string | number
  supplierInfos: SupplierInfo[] // 新增：当前步骤可选的供应商列表
  quoteInfoId?: string | number
  hasQuotationInfo: boolean
  bpCandidateProductInfoId?: string | number
  reviewTime?: string
  reviewers?: any[]
  displayQuotePrice?: boolean
}

interface FormModel {
  approvalSteps: ReviewStep[]
}

const message = useMessage()
const detailsRef = ref<any>(null)
const formRef = ref<FormInstance>()
const loading = ref(false)
const quotationAndPricingDialogRef = ref<InstanceType<typeof QuotationAndPricingDialog> | null>(
  null
)

const dataValue = ref<FormModel>({ approvalSteps: [] })
const bukValue = ref<FormModel>(cloneDeep(dataValue.value))
const viewType = ref<'view' | 'edit'>('edit')
const title = computed(() => '选品审核')

provide('approvalDrawerDetails', { dataValue, bukValue, viewType, title })

const approvalSteps = computed(() => dataValue.value.approvalSteps)

const layouts = computed(() =>
  approvalSteps.value.map((step) => {
    const reviewers = Array.isArray(step.reviewers)
      ? step.reviewers.map((v) => v.reviewerName).join('、')
      : ''
    return {
      label: `${step.reviewTypeName}（${reviewers}）`,
      key: step.key,
      show: true,
      right: () => <div class={`status-tag ${getStatusClass(step)}`}>{getStatusText(step)}</div>
    }
  })
)

const currentCandidateProductId = ref<string | number>('')

type ValidatorCallback = (error?: Error) => void

// 核心逻辑：切换供应商时，更新 supplierInfo 对象
const handleSupplierChange = (val: string | number, step: ReviewStep) => {
  // 1. 清除旧的校验状态（特别是报价信息的校验）
  if (step.reviewType === 1) {
    // 切换供应商后，原来的报价信息可能不再适用，视业务逻辑而定
    // 这里保持引用更新，以便校验规则能读到最新的 supplierStatus
  }

  // 2. 查找并更新 supplierInfo 对象
  const selectedInfo = step.supplierInfos.find((info) => info.supplierId === val)
  if (selectedInfo) {
    step.supplierInfo = { ...selectedInfo }
  } else {
    step.supplierInfo = null
  }
}

const validateAttachmentRule =
  (index: number) => (_rule: any, value: any, callback: ValidatorCallback) => {
    const step = approvalSteps.value[index]

    if (!step || !step.editable) {
      callback()
      return
    }

    if ((step.reviewType === 2 || step.reviewType === 3) && step.reviewStatus === 2) {
      const attachmentValue = normalizeAttachment(value)
      if (!attachmentValue || attachmentValue.trim() === '') {
        callback(new Error('请上传附件'))
        return
      }
    }

    callback()
  }

const validateRemarkRule =
  (index: number) => (_rule: any, value: any, callback: ValidatorCallback) => {
    const step = approvalSteps.value[index]
    if (!step || !step.editable) {
      callback()
      return
    }
    let trimmed = ''
    if (typeof value === 'string') {
      trimmed = value.trim()
    } else if (value !== undefined && value !== null) {
      trimmed = String(value).trim()
    }
    if (trimmed && trimmed.length > 200) {
      callback(new Error('备注最多200字符'))
      return
    }
    if (step.reviewStatus === 2 && !trimmed) {
      callback(new Error('请填写备注'))
      return
    }
    callback()
  }

const validateQuoteInfoRule =
  (index: number) => (_rule: any, _value: any, callback: ValidatorCallback) => {
    const step = approvalSteps.value[index]
    if (!step || !step.editable) {
      callback()
      return
    }
    if (step.reviewStatus !== 1) {
      callback()
      return
    }
    // 依赖 step.supplierInfo.supplierStatus 进行校验
    if (!step.hasQuotationInfo && step.supplierInfo?.supplierStatus === '2') {
      callback(new Error('请先填写报价信息'))
      return
    }
    callback()
  }

const rules = computed<FormRules<FormModel>>(() => {
  const ruleMap: FormRules<FormModel> & Record<string, any> = {
    approvalSteps: [
      {
        required: true,
        message: '审核结果不能为空',
        validator: (_rule, value: any, callback: ValidatorCallback) => {
          const steps = value as ReviewStep[]
          if (!Array.isArray(steps)) {
            callback(new Error('审核数据异常'))
            return
          }
          const editableSteps = steps.filter((step) => step.editable)
          if (!editableSteps.length) {
            callback()
            return
          }
          const invalidStep = editableSteps.find((step) => !step.reviewStatus)
          if (invalidStep) {
            callback(new Error(`${invalidStep.reviewTypeName}的审核结果不能为空`))
            return
          }
          callback()
        },
        trigger: 'change'
      }
    ]
  }
  approvalSteps.value.forEach((step, index) => {
    if (!step.editable) return
    ruleMap[`approvalSteps.${index}.remark`] = [
      {
        required: step.reviewStatus === 2,
        message: '请填写备注',
        validator: validateRemarkRule(index),
        trigger: ['blur', 'change']
      }
    ]
    if (step.reviewType === 1) {
      ruleMap[`approvalSteps.${index}.supplierId`] = [
        { required: true, message: '请选择供应商', trigger: 'change' }
      ]
      ruleMap[`approvalSteps.${index}.quoteInfoId`] = [
        {
          required: step.reviewStatus === 1 && step.supplierInfo?.supplierStatus === '2',
          message: '请先填写报价信息',
          validator: validateQuoteInfoRule(index),
          trigger: 'change'
        }
      ]
    }

    if (step.reviewType === 2 || step.reviewType === 3) {
      ruleMap[`approvalSteps.${index}.attachment`] = [
        {
          required: step.reviewStatus === 2,
          message: '审核拒绝时必须上传附件',
          validator: validateAttachmentRule(index),
          trigger: ['change']
        }
      ]
    }
  })
  return ruleMap
})

const normalizeAttachment = (value: any): string => {
  if (!value) return ''
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === 'string' ? item : item?.url))
      .filter(Boolean)
      .join(',')
  }
  return String(value)
}

const getStatusText = (step: ReviewStep) => (step.originalStatus === 0 ? '待审核' : '已审核')

const getStatusClass = (step: ReviewStep) => {
  if (step.originalStatus === 0) return 'pending'
  if (step.originalStatus === 1) return 'approved'
  if (step.originalStatus === 2) return 'rejected'
  return 'rejected'
}

const mapReviewStep = (item: any, index: number): ReviewStep => {
  const rawStatus = Number(item?.reviewStatus ?? 0) as ReviewStatus
  const isEditable = Boolean(item?.editable)
  const normalizedStatus =
    rawStatus === 0 ? (isEditable ? (1 as 1 | 2) : undefined) : (rawStatus as 1 | 2)

  // 处理供应商列表
  const supplierInfos = Array.isArray(item?.supplierInfos) ? item.supplierInfos : []

  // 默认值逻辑：优先取 supplierInfo 对象中的 ID
  let supplierId = item?.supplierInfo?.supplierId

  // 确保 supplierInfo 对象存在且与 supplierId 匹配
  // 场景：如果只有 ID (如保存后返回)，但 info 是 null，需要从 list 里找回来赋值给 info
  let supplierInfo = item?.supplierInfo ?? null
  if (supplierId && supplierInfos.length > 0) {
    // 尝试在可选列表中找到对应的详情
    const matched = supplierInfos.find((info: any) => info.supplierId === supplierId)
    if (matched) {
      supplierInfo = matched
    }
  }

  return {
    ...item,
    id: item?.id ?? `step-${index}`,
    key: `step-${item?.reviewType ?? index}`,
    reviewType: Number(item?.reviewType ?? 0),
    reviewTypeName: item?.reviewTypeName ?? '审核',
    reviewerName: item?.reviewerName ?? '',
    reviewStatus: normalizedStatus,
    originalStatus: rawStatus,
    reviewStatusName: item?.reviewStatusName ?? '',
    remark: item?.remark ?? '',
    attachment: normalizeAttachment(item?.attachment),
    editable: Boolean(item?.editable),
    supplierInfo: supplierInfo, // 确保有对象
    supplierId: supplierId, // 确保有 ID
    supplierInfos: supplierInfos, // 数据源
    quoteInfoId: item?.quoteInfoId ?? '',
    hasQuotationInfo: Boolean(item?.hasQuotationInfo),
    bpCandidateProductInfoId: item?.bpCandidateProductInfoId ?? '',
    reviewTime: item?.reviewTime ?? ''
  }
}

const INSPECTION_FORBIDDEN_STATUS = new Set<any>(['3', 3, '0', 0])

const isSupplierInspectionAllowed = (step: ReviewStep): boolean => {
  if (!step) return false
  const status = step.supplierInfo?.supplierStatus
  if (status !== undefined && status !== null && status !== '') {
    return !INSPECTION_FORBIDDEN_STATUS.has(status)
  }
  const statusName = step.supplierInfo?.supplierStatusName
  if (!statusName) return true
  return !statusName.includes('不通过')
}

const getQuotationButtonDisabled = (step: ReviewStep): boolean => {
  if (step.displayQuotePrice && step.editable) {
    return false
  }
  if (step.hasQuotationInfo) {
    return false
  }
  return viewType.value === 'view' || !step.editable || !isSupplierInspectionAllowed(step)
}

const unwrapList = (res: any): any[] => {
  if (!res) return []
  if (Array.isArray(res)) return res
  const collections = [res.records, res.list, res.rows, res.data, res.result]
  for (const collection of collections) {
    if (Array.isArray(collection)) return collection
  }
  return []
}

const fetchReviewSteps = async (candidateId: string | number) => {
  if (candidateId === undefined || candidateId === null || candidateId === '') {
    dataValue.value = { approvalSteps: [] }
    bukValue.value = cloneDeep(dataValue.value)
    viewType.value = 'view'
    return
  }
  loading.value = true
  try {
    const res = await getSelectionProductReviewList(candidateId)
    const list = unwrapList(res).map(mapReviewStep)
    dataValue.value = { approvalSteps: list }
    bukValue.value = cloneDeep(dataValue.value)
    viewType.value = list.some((step) => step.editable) ? 'edit' : 'view'
  } catch (error) {
    console.error(error)
    dataValue.value = { approvalSteps: [] }
    bukValue.value = cloneDeep(dataValue.value)
    viewType.value = 'view'
  } finally {
    loading.value = false
  }
}

const openQuotationDialog = async (step: ReviewStep) => {
  if (!step.bpCandidateProductInfoId) {
    message.warning('缺少参选产品信息')
    return
  }

  const getDialogMode = (): 'view' | 'edit' | 'add' | null => {
    if (step.displayQuotePrice) {
      return 'edit'
    }
    if (viewType.value === 'view' && step.hasQuotationInfo) {
      return 'view'
    }

    if (!step.editable) {
      message.warning('该审核记录不可编辑')
      return null
    }

    if (!isSupplierInspectionAllowed(step)) {
      message.warning('当前供应商验厂不通过,无法填写报价信息')
      return null
    }

    if (step.hasQuotationInfo && viewType.value === 'edit') {
      return 'edit'
    }

    return 'add'
  }

  const mode = getDialogMode()
  if (!mode) return

  quotationAndPricingDialogRef.value?.openDialog({
    mode,
    bpCandidateProductInfoId: step.bpCandidateProductInfoId,
    quoteInfoId: step.quoteInfoId,
    reviewId: step.id
  })
}
const handleQuotationSuccess = async () => {
  if (currentCandidateProductId.value !== '' && currentCandidateProductId.value !== undefined) {
    // --- 修复开始：备份当前用户已选但未提交的供应商ID ---
    const backupSupplierMap = new Map<string, string | number>()
    approvalSteps.value.forEach((step) => {
      if (step.editable && step.supplierId) {
        backupSupplierMap.set(step.key, step.supplierId)
      }
    })
    // --- 修复结束 ---

    // 重新请求接口（获取最新的报价填写状态）
    await fetchReviewSteps(currentCandidateProductId.value)

    await nextTick()

    // --- 修复开始：将备份的供应商ID还原回去 ---
    approvalSteps.value.forEach((step, index) => {
      // 1. 还原供应商选中状态
      if (step.editable && backupSupplierMap.has(step.key)) {
        const savedId = backupSupplierMap.get(step.key)
        // 如果接口返回的是空的，或者与本地选的不一致（且本地有值），则优先使用本地刚才选的值
        if (!step.supplierId && savedId) {
          step.supplierId = savedId
          // 重要：手动触发一下变更逻辑，确保 supplierInfo 对象也能同步恢复，防止校验报错
          handleSupplierChange(savedId, step)
        }
      }

      // 2. 清除校验（原有逻辑）
      if (step.reviewType === 1 && step.editable) {
        formRef.value?.clearValidate(`approvalSteps.${index}.quoteInfoId`)
      }
    })
    // --- 修复结束 ---
  }
}
const emit = defineEmits<{ (e: 'success'): void }>()

const checkValue = async () => {
  if (!formRef.value) return false
  try {
    await formRef.value.validate()
    return true
  } catch {
    return false
  }
}

const submitForm = async () => {
  const editableSteps = approvalSteps.value.filter((step) => step.editable)
  if (!editableSteps.length) {
    message.warning('当前暂无可提交的审核记录')
    return
  }
  const supplierInspectionBlockedStep = editableSteps.find(
    (step) => step.reviewType === 1 && step.reviewStatus === 1 && !isSupplierInspectionAllowed(step)
  )
  if (supplierInspectionBlockedStep) {
    message.alert('当前供应商未验厂通过，请联系QC及时验厂通过再进行审核')
    return
  }
  const missingStatusStep = editableSteps.find((step) => !step.reviewStatus)
  if (missingStatusStep) {
    message.warning(`${missingStatusStep.reviewTypeName}的审核结果不能为空`)
    return
  }
  const valid = await checkValue()
  if (!valid) return
  const payloads = editableSteps.map((step) => {
    const trimmedRemark = step.remark?.trim?.() ?? ''
    return {
      id: step.id,
      reviewStatus: step.reviewStatus,
      remark: trimmedRemark,
      attachment: normalizeAttachment(step.attachment),
      quoteInfoId: step.quoteInfoId,
      supplierId: step.supplierId // 提交选中的供应商ID
    }
  })
  loading.value = true
  try {
    for (const payload of payloads) {
      await saveSelectionProductReview(payload)
    }
    message.success('提交成功')
    await fetchReviewSteps(currentCandidateProductId.value)
    bukValue.value = cloneDeep(dataValue.value)
    emit('success')
    eventBus.emit('upload:delete')
    detailsRef.value?.close()
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const openDrawer = (payload: { id?: string | number } = {}) => {
  detailsRef.value?.openDrawer(
    async () => {
      currentCandidateProductId.value = payload?.id ?? ''
      // 只需要请求审核列表详情，供应商列表现在包含在详情中
      await fetchReviewSteps(currentCandidateProductId.value)
    },
    () => {
      nextTick(() => {
        formRef.value?.clearValidate()
      })
    }
  )
}

defineExpose({ openDrawer })
</script>

<style scoped lang="scss">
.approval-section {
  border-radius: 8px;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    .section-title {
      font-size: 16px;
      font-weight: 500;
      color: #333;
    }

    .status-text {
      font-size: 12px;
      padding: 4px 12px;
      border-radius: 12px;

      &.pending {
        background: #ff9800;
        color: #fff;
      }

      &.approved {
        background: #4caf50;
        color: #fff;
      }

      &.rejected {
        background: #f56c6c;
        color: #fff;
      }
    }
  }

  .supplier-info {
    display: flex;
    align-items: center;
    gap: 8px;

    .supplier-name {
      font-size: 14px;
      color: #333;
    }
  }

  .quotation-info-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;

    .quotation-status {
      font-size: 14px;
      color: #db6a0f;
      display: flex;
      align-items: center;
      gap: 4px;

      &.filled {
        color: #36ad6a;
      }
    }
  }
}

:deep(.el-form) {
  .el-select,
  .el-input,
  .el-date-editor {
    width: 100%;
  }
}

.page-details {
  :deep(.el-drawer) {
    .card_info {
      .el-card__body {
        padding: 20px !important;

        .layout-item {
          background: #f4f6fa;
        }

        .status-tag {
          padding: 6px 10px;
          border-radius: 158px;
          font-size: 14px;

          &.approved,
          &.rejected {
            background: rgba(52, 155, 52, 0.2);
            color: #349b34;
          }

          &.pending {
            background: #f8e1cf;
            color: #db6a0f;
          }
        }
      }
    }
  }
}
</style>
