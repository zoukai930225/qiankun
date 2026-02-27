<template>
  <scheme-details ref="detailsRef" name="BuyerSelection" :width="936" @closed="handleClosed">
    <template #card>
      <form-content-layout :layouts="layouts">
        <template #productInfo>
          <el-card shadow="never" class="productInfo-content">
            <div class="flex">
              <div class="bg-#eee">
                <image-display :src="productImage" :width="200" :height="234" fit="contain" />
              </div>

              <div class="flex-1">
                <div class="product-title flex items-center justify-between">
                  <div class="flex-1 w-0 text">
                    <overflow-tooltip :content="productInfo?.productName"> </overflow-tooltip>
                  </div>
                  <div
                    v-if="!!productInfo?.uploadUserName"
                    class="flex w-fit bg-#fff4c8 p-[4px_16px] font-size-12px rounded-158px flex-shrink-0 name"
                    >{{ productInfo?.uploadUserName }}</div
                  >
                </div>
                <div class="product-info-content">
                  <el-row>
                    <el-col :span="8">
                      <div class="product-item-label"> 关联企划 </div>
                      <div class="product-item-value">
                        {{ productInfo?.planName }}
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div class="product-item-label"> 品类 </div>
                      <div class="product-item-value">
                        {{ productInfo?.categoryName }}
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div class="product-item-label"> 单价 </div>
                      <div class="product-item-value">
                        {{ productInfo?.unitPrice }}
                      </div>
                    </el-col>
                  </el-row>
                  <el-row class="mt-14px">
                    <el-col :span="24">
                      <div class="product-item-label"> 核心卖点 </div>
                      <div class="product-item-value">
                        <overflow-tooltip :content="productInfo?.salePoint" :line-clamp="5">
                        </overflow-tooltip>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </div>
          </el-card>
        </template>

        <template #selectionInfo>
          <el-form
            labelWidth="6em"
            ref="formRef"
            :model="dataValue"
            :rules="computedRules"
            :validate-on-rule-change="false"
          >
            <el-row>
              <el-col>
                <el-form-item label="选品结果" prop="chooseStatus">
                  <el-radio-group
                    v-model="dataValue.chooseStatus"
                    :disabled="isView"
                    @change="handleChooseStatusChange"
                  >
                    <el-radio :value="1">选中</el-radio>
                    <el-radio :value="2">淘汰</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>

              <el-col>
                <el-form-item
                  v-show="dataValue.chooseStatus === 1"
                  label="选中原因"
                  prop="chooseReason"
                >
                  <DictSelect
                    v-model="dataValue.chooseReason"
                    dict-type="bp_selection_product_reason"
                    :multiple="true"
                    placeholder="请选择选中原因"
                    :disabled="isView"
                  />
                </el-form-item>
              </el-col>

              <el-col>
                <el-form-item :label="reasonLabel" prop="reason">
                  <s-text-area
                    v-model="dataValue.reason"
                    :rows="5"
                    showWordLimit
                    :maxlength="200"
                    :disabled="isView"
                    :placeholder="reasonPlaceholder"
                  />
                </el-form-item>
              </el-col>

              <template v-if="dataValue.chooseStatus === 1">
                <el-col :span="8">
                  <el-form-item label="版师" prop="patternMakerIds">
                    <SWSelectPeople
                      :isEdit="!isView"
                      :multiple="true"
                      :deptCode="'NEW_PRODUCT_DEPT_DEVELOP'"
                      placeholder="请选择版师"
                      v-model="dataValue.patternMakerIds"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="供应链" prop="chosenSupplierStaffIds">
                    <SWSelectPeople
                      :isEdit="!isView"
                      :multiple="true"
                      :deptCode="'NEW_PRODUCT_DEPT_SUPPLY'"
                      placeholder="请选择供应链"
                      v-model="dataValue.chosenSupplierStaffIds"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="运营" prop="operationIds">
                    <SWSelectPeople
                      :isEdit="!isView"
                      :multiple="true"
                      placeholder="请选择运营"
                      v-model="dataValue.operationIds"
                    />
                  </el-form-item>
                </el-col>
              </template>
            </el-row>
          </el-form>
        </template>
      </form-content-layout>
    </template>

    <template #button>
      <el-button @click="detailsRef?.close()">取消</el-button>
      <el-button
        v-if="!isView"
        type="primary"
        :loading="saveLoading"
        :disabled="saveLoading"
        @click="handleSave"
        >保存</el-button
      >
    </template>
  </scheme-details>
</template>
<script lang="ts" setup>
import STextArea from '@/components/common/input/s-textarea.vue'
import { computed, nextTick, provide, ref } from 'vue'
import { cloneDeep } from 'lodash-es'
import FormContentLayout from '@/layout/components/ContentLayout'
import { FormInstance, FormRules } from 'element-plus'
import {
  getSelectionProductDetail,
  saveSelectionProductInfo
} from '@/api/oa/buyer/productReference'
import defaultImg from '@/assets/svgs/defaultImg.svg'
import { useMessage } from '@/hooks/web/useMessage'
import SWSelectPeople from '@/views/OA/factory/components/selectPeople.vue'

type ProductBasicInfo = {
  productName?: string
  uploadUserName?: string
  planName?: string
  categoryName?: string
  unitPrice?: string | number
  salePoint?: string
  realPhotos?: string | string[]
}

type PersonRoster = {
  userId?: string | number
  id?: string | number
  name?: string
  departmentName?: string
  avatarOrigin?: string
}

type SelectionDetailResponse = {
  bpCandidateProductInfoId?: string | number
  chooseStatus?: number | string
  chooseReason?: string
  reason?: string
  productBasicInfo?: ProductBasicInfo
  patternMakers?: PersonRoster[]
  chosenSupplierStaffs?: PersonRoster[]
  operations?: PersonRoster[]
}

type FormModel = {
  bpCandidateProductInfoId: string
  chooseStatus: number | undefined
  chooseReason: string
  reason: string
  patternMakerIds: PersonRoster[]
  chosenSupplierStaffIds: PersonRoster[]
  operationIds: PersonRoster[]
}

type DrawerMode = 'edit' | 'view'

const message = useMessage()

const emit = defineEmits<{
  (e: 'refresh'): void
}>()

const layouts = [
  { label: '产品信息', key: 'productInfo' },
  { label: '选品信息', key: 'selectionInfo' }
]

const descriptionKeys = ['planName', 'categoryName', 'unitPrice', 'salePoint'] as const
type DescriptionKey = (typeof descriptionKeys)[number]

const createDefaultForm = (): FormModel => ({
  bpCandidateProductInfoId: '',
  chooseStatus: undefined,
  chooseReason: '',
  reason: '',
  patternMakerIds: [],
  chosenSupplierStaffIds: [],
  operationIds: []
})

const parseNumeric = (value: unknown): number | undefined => {
  if (value === null || value === undefined || value === '') return undefined
  const parsed = Number(value)
  return Number.isNaN(parsed) ? undefined : parsed
}

const toIdList = (list: PersonRoster[] | undefined): string[] => {
  if (!Array.isArray(list)) return []
  return list
    .map((item) => item?.userId ?? item?.id)
    .filter((id): id is string | number => id !== undefined && id !== null && id !== '')
    .map((id) => String(id))
}

const parsePhotos = (source: ProductBasicInfo['realPhotos']): string[] => {
  if (!source) return []
  if (Array.isArray(source)) {
    return source.filter(
      (item): item is string => typeof item === 'string' && item.trim().length > 0
    )
  }
  if (typeof source === 'string') {
    const trimmed = source.trim()
    if (!trimmed) return []
    try {
      const parsed = JSON.parse(trimmed)
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (item): item is string => typeof item === 'string' && item.trim().length > 0
        )
      }
    } catch {
      // ignore parse error
    }
    return trimmed
      .split(/[,，]/)
      .map((item) => item.trim())
      .filter(Boolean)
  }
  return []
}

const formatUnitPrice = (value: unknown): string => {
  if (value === null || value === undefined || value === '') return '-'
  const numberValue = Number(value)
  if (!Number.isNaN(numberValue)) {
    return `¥${numberValue.toFixed(2)}`
  }
  return String(value)
}

const productInfo = ref<ProductBasicInfo>({})
const productDescriptions = computed<Record<DescriptionKey, string>>(() => ({
  planName: productInfo.value.planName || '-',
  categoryName: productInfo.value.categoryName || '-',
  unitPrice: formatUnitPrice(productInfo.value.unitPrice),
  salePoint: productInfo.value.salePoint || '-'
}))

const productImage = computed(() => {
  const photos = parsePhotos(productInfo.value.realPhotos)
  return photos[0] || defaultImg
})

const detailsRef = ref<any>()
const dataValue = ref<FormModel>(createDefaultForm())
const bukValue = ref<FormModel>(cloneDeep(dataValue.value))
const viewType = ref<DrawerMode>('edit')
const loading = ref(false)
const formRef = ref<FormInstance>()
const saveLoading = ref(false)

// 动态计算 label 和 placeholder
const reasonLabel = computed(() => {
  return dataValue.value.chooseStatus === 2 ? '淘汰理由' : '备注'
})

const reasonPlaceholder = computed(() => {
  return dataValue.value.chooseStatus === 2 ? '请输入淘汰理由' : '请输入备注'
})

const handleChooseStatusChange = () => {
  // 清除校验和重置原因输入框
  dataValue.value.chooseReason = ''
  dataValue.value.reason = ''
  formRef.value?.clearValidate()
}

// 使用 computed 动态设置 rules
const computedRules = computed<FormRules<FormModel>>(() => ({
  chooseStatus: [{ required: true, message: '请选择选品结果', trigger: 'change' }],
  chooseReason: [{ required: true, message: '请选择选中原因', trigger: 'change' }],
  reason: [
    {
      required: dataValue.value.chooseStatus === 2,
      message: '请输入淘汰理由',
      trigger: 'blur'
    }
  ],
  // 版师、供应链、运营：选中时必填，淘汰时非必填
  patternMakerIds:
    dataValue.value.chooseStatus === 1
      ? [{ required: true, message: '请选择版师', trigger: 'change' }]
      : [],
  chosenSupplierStaffIds:
    dataValue.value.chooseStatus === 1
      ? [{ required: true, message: '请选择供应链', trigger: 'change' }]
      : [],
  operationIds:
    dataValue.value.chooseStatus === 1
      ? [{ required: true, message: '请选择运营', trigger: 'change' }]
      : []
}))

const isView = computed(() => viewType.value === 'view')
const title = computed(() => '选品')

const emitResetValidation = () => {
  nextTick(() => formRef.value?.clearValidate())
}

const openDrawer = (options: { candidateProductId: string | number; mode?: DrawerMode }) => {
  const { candidateProductId, mode = 'edit' } = options
  viewType.value = mode

  detailsRef?.value?.openDrawer(async () => {
    try {
      const res = await getSelectionProductDetail(candidateProductId)
      fillForm(res, candidateProductId)
    } catch (error) {
      console.error(error)
      message.error('获取选品详情失败,请稍后再试')
      fillForm(null, candidateProductId)
    } finally {
      loading.value = false
    }
  }, emitResetValidation)
}

const handleSave = async () => {
  if (isView.value) {
    detailsRef.value?.close()
    return
  }
  if (!formRef.value) return
  try {
    saveLoading.value = true
    await formRef.value.validate()
    const payload = buildPayload()
    const res = await saveSelectionProductInfo(payload)
    if (res?.success === false) {
      message.error(res?.message || '保存失败,请稍后再试')
      return
    }
    message.success('保存成功!')
    bukValue.value = cloneDeep(dataValue.value)
    detailsRef.value?.close()
    emit('refresh')
  } catch (error) {
    console.error(error)
  } finally {
    saveLoading.value = false
  }
}

const handleClosed = () => {
  resetForm()
}

const resetForm = () => {
  dataValue.value = createDefaultForm()
  bukValue.value = cloneDeep(dataValue.value)
  productInfo.value = {}
  emitResetValidation()
}

const fillForm = (detail: SelectionDetailResponse | null, candidateProductId: string | number) => {
  resetForm()
  const current = detail ?? {}
  dataValue.value = {
    bpCandidateProductInfoId: String(current.bpCandidateProductInfoId ?? candidateProductId ?? ''),
    chooseStatus: parseNumeric(current.chooseStatus),
    chooseReason: current.chooseReason ?? '',
    reason: current.reason ?? '',
    patternMakerIds: cloneDeep(current.patternMakers ?? []),
    chosenSupplierStaffIds: cloneDeep(current.chosenSupplierStaffs ?? []),
    operationIds: cloneDeep(current.operations ?? [])
  }
  bukValue.value = cloneDeep(dataValue.value)
  productInfo.value = { ...current.productBasicInfo }
}

const buildPayload = () => ({
  bpCandidateProductInfoId: dataValue.value.bpCandidateProductInfoId,
  chooseStatus: dataValue.value.chooseStatus,
  chooseReason: dataValue.value.chooseReason || '',
  reason: dataValue.value.reason?.trim() || '',
  patternMakerIds: toIdList(dataValue.value.patternMakerIds),
  chosenSupplierStaffIds: toIdList(dataValue.value.chosenSupplierStaffIds),
  operationIds: toIdList(dataValue.value.operationIds)
})

defineExpose({ openDrawer })
provide('BuyerSelectionDetails', { dataValue, bukValue, viewType, title, loading })
</script>
<style scoped lang="scss">
.page-details {
  :deep(.el-drawer) {
    .sw-form-content-layout {
      background: #f8f8f9;
    }

    .productInfo-content {
      padding: 10px;
    }

    .product-title {
      background: #f4f8ff;
      padding: 10px 16px;

      .text {
        font-size: 16px;
        font-weight: 500;
      }

      .name {
        color: #cd8200;
      }
    }
  }

  .product-info-content {
    padding: 10px 16px;
  }

  .product-item-label {
    font-size: 14px;
    font-weight: normal;
    line-height: normal;
    letter-spacing: 0px;
    /* 文字/二级 */
    color: #666666;
  }

  .product-item-value {
    margin-top: 4px;
    font-size: 14px;
    font-weight: normal;
    line-height: normal;
    letter-spacing: 0px;
    /* 文字/二级 */
    color: #333333;
  }
}
</style>
