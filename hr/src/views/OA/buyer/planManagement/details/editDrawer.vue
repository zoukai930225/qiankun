<template>
  <scheme-details ref="detailsRef" name="BuyerPlan" :width="936">
    <template #card>
      <el-form
        ref="formRef"
        :model="dataValue"
        :rules="rules"
        label-width="80px"
        :disabled="viewType === 'view'"
      >
        <form-content-layout :layouts="layouts">
          <template #basicInfo>
            <el-row :gutter="16">
              <el-col :span="12">
                <el-form-item label="品类" prop="category">
                  <el-cascader
                    v-model="categoryCascadeValue"
                    :options="categoryTree"
                    :props="categoryCascaderProps"
                    separator=">"
                    placeholder="请选择品类"
                    clearable
                    filterable
                    :disabled="viewType === 'view'"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="企划名称" prop="planName">
                  <el-input
                    v-model="dataValue.planName"
                    placeholder="请输入企划名称"
                    maxlength="100"
                    show-word-limit
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  prop="chooseTime"
                  :label="'选品会\n时间'"
                  class="multiline-label-item"
                >
                  <el-date-picker
                    v-model="dataValue.chooseTime"
                    type="date"
                    value-format="YYYY-MM-DD"
                    placeholder="请选择日期"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="定价" prop="pricing">
                  <el-input
                    v-model="dataValue.pricing"
                    maxlength="50"
                    show-word-limit
                    placeholder="请输入定价"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="销量" prop="salesVolume">
                  <el-input
                    v-model="dataValue.salesVolume"
                    maxlength="50"
                    placeholder="请输入销量"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="成本预估" prop="costEstimate">
                  <el-input
                    v-model.trim="dataValue.costEstimate"
                    maxlength="50"
                    placeholder="请输入成本预估"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  prop="minimumOrderQuantity"
                  :label="'最小起\n订量'"
                  class="multiline-label-item"
                >
                  <el-input
                    v-model.trim="dataValue.minimumOrderQuantity"
                    maxlength="50"
                    placeholder="请输入最小起订量"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  prop="factoryInventoryDepth"
                  :label="'工厂库存\n深度'"
                  class="multiline-label-item"
                >
                  <el-input
                    v-model.trim="dataValue.factoryInventoryDepth"
                    maxlength="50"
                    placeholder="请输入工厂库存深度"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="产品图片" prop="productPicture">
                  <Transfer
                    v-model="dataValue.productPicture"
                    :limit="1"
                    width="100%"
                    :disabled="viewType === 'view'"
                  />
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="尺码" prop="sizeText">
                  <s-text-area
                    v-model="dataValue.sizeText"
                    maxlength="100"
                    show-word-limit
                    :rows="3"
                    placeholder="请输入尺码信息"
                  />
                </el-form-item>
                <el-form-item prop="sizeFile">
                  <Transfer
                    v-model="dataValue.sizeFile"
                    :limit="1"
                    accept-type="all"
                    width="100%"
                    :disabled="viewType === 'view'"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="竞品链接" prop="productLink">
              <el-input v-model="dataValue.productLink" placeholder="请输入竞品链接">
                <template #append>
                  <el-link
                    :underline="false"
                    @click="openProductLink"
                    :disabled="!dataValue.productLink"
                  >
                    跳转
                  </el-link>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="选品方向" prop="chooseDirection">
              <s-text-area
                v-model="dataValue.chooseDirection"
                maxlength="200"
                show-word-limit
                :autosize="{ minRows: 3, maxRows: 6 }"
                placeholder="请输入选品方向"
              />
            </el-form-item>
            <el-form-item label="核心卖点" prop="salePoint">
              <s-text-area
                v-model="dataValue.salePoint"
                maxlength="200"
                show-word-limit
                :autosize="{ minRows: 3, maxRows: 6 }"
                placeholder="请输入核心卖点"
              />
            </el-form-item>

            <el-form-item label="面料成分" prop="fabricContent">
              <s-text-area
                v-model="dataValue.fabricContent"
                :rows="3"
                maxlength="200"
                show-word-limit
                placeholder="请输入面料成分"
              />
            </el-form-item>

            <el-form-item label="色系分析" prop="colorAnalysis">
              <s-text-area
                v-model="dataValue.colorAnalysis"
                :rows="3"
                maxlength="200"
                show-word-limit
                placeholder="请输入色系分析"
              />
            </el-form-item>
          </template>
        </form-content-layout>
      </el-form>
    </template>
    <template #button>
      <div>
        <el-button @click="detailsRef?.close()" :disabled="loading">取消</el-button>
        <el-button
          v-if="viewType === 'add' || dataValue.isDraft === 1"
          type="primary"
          @click="submitForm(true)"
          :disabled="loading"
          plain
          >暂存</el-button
        >
        <el-button type="primary" @click="submitForm(false)" :disabled="loading">提交</el-button>
      </div>
    </template>
  </scheme-details>
</template>
<script lang="ts" setup>
import STextArea from '@/components/common/input/s-textarea.vue'
import { computed, inject, nextTick, provide, reactive, ref, watch } from 'vue'
import type { Ref } from 'vue'
import Transfer from '@/components/common/upload/transfer.vue'
// import CompositionDialog from '../components/composition.vue' // OLD CODE: 注释掉弹窗组件
import { cloneDeep, debounce } from 'lodash-es'
import type { FormInstance, FormRules } from 'element-plus'
import { useDialog } from '@/hooks/web/useDialog'
import { useMessage } from '@/hooks/web/useMessage'
// import { DICT_TYPE, getDictLabel } from '@/utils/dict' // OLD CODE: 注释掉字典
import FormContentLayout from '@/layout/components/ContentLayout'
import { addBuyerPlan, updateBuyerPlan } from '@/api/oa/buyer/planManagement'
// import { isSumExceedTarget, isSumEqualTarget } from '@/utils/number' // OLD CODE: 注释掉计算工具
import {
  CATEGORY_PROVIDE_KEY,
  categoryListKey,
  type CategoryProvideContext
} from '../config/config'
import eventBus from '@/utils/eventBus'

const message = useMessage()
// const { openDialog } = useDialog() // OLD CODE: 注释掉Dialog Hook
const emit = defineEmits(['success'])

// OLD CODE: 注释掉类型定义
// type FabricItem = { key: string; name?: string; value: number }

type FormModel = {
  id?: string | number
  category: string | number
  categoryLabel?: string
  planName: string
  chooseTime: string
  pricing: string
  salesVolume: string
  productPicture: string
  sizeText: string
  sizeFile: string
  productLink: string
  chooseDirection: string
  salePoint: string
  costEstimate: string
  fabricContent?: string
  // fabricComposition: FabricItem[] // OLD CODE: 注释掉数组类型
  createdName?: string
  minimumOrderQuantity?: string
  factoryInventoryDepth?: string
  colorAnalysis?: string
  isDraft?: number
}

const categoryContext = inject<CategoryProvideContext>(CATEGORY_PROVIDE_KEY, {
  options: [],
  labelMap: new Map<string | number, string>(),
  valueMap: new Map<string, string | number>()
})

const DEFAULT_CATEGORY_CASCADER_PROPS = Object.freeze({
  label: 'categoryName',
  value: 'categoryCode',
  children: 'subCategories',
  checkStrictly: true,
  emitPath: false
})
const CATEGORY_LABEL_SEPARATOR = ' > '
const categoryCascadeValue = ref<Array<string | number>>([])
let isProgrammaticCategoryUpdate = false
const injectedCategoryList = inject<Ref<any[]>>(categoryListKey, ref<any[]>([]))
const categoryTree = computed<any[]>(() => injectedCategoryList.value ?? [])
const categoryCascaderProps = computed(() => ({
  ...DEFAULT_CATEGORY_CASCADER_PROPS,
  emitPath: true
}))

const getCategoryLabelByValue = (value: any) => {
  if (value === undefined || value === null || value === '') return ''
  return categoryContext.labelMap.get(value) ?? categoryContext.labelMap.get(String(value)) ?? ''
}

const resolveCategoryForForm = (value: any, label?: string) => {
  console.log('value', value)
  console.log('label', label)
  const candidates = [value, label]
  for (const candidate of candidates) {
    if (candidate === undefined || candidate === null || candidate === '') continue
    if (typeof candidate === 'number' && !Number.isNaN(candidate)) return candidate
    const numeric = candidate
    if (!Number.isNaN(numeric)) return numeric
    const mapped = categoryContext.valueMap.get(String(candidate))
    if (mapped !== undefined) return mapped
  }
  return value ?? ''
}

const splitCategoryLabelChain = (labelChain: unknown): string[] => {
  if (typeof labelChain !== 'string') return []
  return labelChain
    .split(/\s*[>\/\\，,]\s*/)
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0)
}

const findCategoryPathByValue = (
  nodes: any[],
  target: string | number | ''
): Array<string | number> => {
  if (!Array.isArray(nodes) || target === undefined || target === null || target === '') return []
  const targetStr = String(target)
  const dfs = (list: any[], path: Array<string | number>): Array<string | number> => {
    if (!Array.isArray(list) || !list.length) return []
    for (const node of list) {
      if (!node) continue
      const value = node?.categoryCode ?? node?.value ?? node?.id
      const currentPath = [...path, value]
      if (String(value) === targetStr) {
        return currentPath
      }
      const children = node?.subCategories ?? node?.children
      const childPath = dfs(children, currentPath)
      if (childPath.length) return childPath
    }
    return []
  }
  return dfs(nodes, [])
}

const findCategoryPathByLabelChain = (nodes: any[], labels: string[]): Array<string | number> => {
  if (!Array.isArray(nodes) || !labels.length) return []
  const dfs = (list: any[], level: number): Array<string | number> => {
    if (!Array.isArray(list) || level >= labels.length) return []
    const targetLabel = labels[level]
    for (const node of list) {
      if (!node) continue
      const label = String(node?.categoryName ?? node?.label ?? node?.name ?? '').trim()
      if (!label || label !== targetLabel) continue
      const value = node?.categoryCode ?? node?.value ?? node?.id
      if (level === labels.length - 1) {
        return [value]
      }
      const children = node?.subCategories ?? node?.children
      const childPath = dfs(children, level + 1)
      if (childPath.length) {
        return [value, ...childPath]
      }
    }
    return []
  }
  return dfs(nodes, 0)
}

const resolveCategoryLabelsByPath = (nodes: any[], path: Array<string | number>): string[] => {
  if (!Array.isArray(nodes) || !Array.isArray(path) || !path.length) return []
  const labels: string[] = []
  let currentLevel: any[] | undefined = nodes
  for (const value of path) {
    if (!Array.isArray(currentLevel) || !currentLevel.length) break
    const target = String(value)
    const node = currentLevel.find((item: any) => {
      if (!item) return false
      const nodeValue = item?.categoryCode ?? item?.value ?? item?.id
      return String(nodeValue) === target
    })
    if (!node) break
    const label = node?.categoryName ?? node?.label ?? node?.name ?? ''
    if (label) labels.push(String(label))
    currentLevel = node?.subCategories ?? node?.children
  }
  return labels
}

const normalizeCascadePath = (path: Array<string | number>): Array<string | number> => {
  if (!Array.isArray(path)) return []
  return path.filter((item) => item !== undefined && item !== null && item !== '')
}

const areCascadePathsEqual = (
  a: Array<string | number> | undefined,
  b: Array<string | number> | undefined
): boolean => {
  if (!Array.isArray(a) || !Array.isArray(b)) return false
  if (a.length !== b.length) return false
  return a.every((item, index) => String(item) === String(b[index]))
}

const setCascadeValue = (path: Array<string | number>) => {
  const normalized = normalizeCascadePath(path)
  if (areCascadePathsEqual(categoryCascadeValue.value, normalized)) return
  isProgrammaticCategoryUpdate = true
  categoryCascadeValue.value = normalized
  nextTick(() => {
    isProgrammaticCategoryUpdate = false
  })
}

/* OLD CODE: 注释掉 parseFabricContent
const parseFabricContent = (content: unknown): FabricItem[] => {
  if (!content) return []
  if (Array.isArray(content)) {
    return content.map((item) =>
      buildFabricItem(
        {
          key: item?.key ?? item?.name ?? item?.material ?? '',
          value: item?.value ?? ''
        },
        item as FabricItem
      )
    )
  }
  if (typeof content === 'string') {
    const trimmed = content.trim()
    if (!trimmed) return []
    try {
      const parsed = JSON.parse(trimmed)
      if (Array.isArray(parsed)) {
        return parseFabricContent(parsed)
      }
    } catch {
      return trimmed
        .split(/[,，;；]/)
        .map((segment) => segment.trim())
        .filter(Boolean)
        .map((segment) => {
          const match = segment.match(/^([^0-9%]+)(.*)$/)
          if (match) {
            return buildFabricItem(
              {
                key: match[1].trim(),
                value: match[2]
              },
              null
            )
          }
          const [key, value = ''] = segment.split(/[:：]/)
          return buildFabricItem(
            {
              key,
              value
            },
            null
          )
        })
    }
  }
  return []
}
*/

const layouts = [{ label: '基本信息', key: 'basicInfo' }]

const detailsRef = ref<any>()
const formRef = ref<FormInstance>()
const dataValue = ref<FormModel>({
  category: '',
  categoryLabel: '',
  planName: '',
  chooseTime: '',
  pricing: '',
  salesVolume: '',
  productPicture: '',
  sizeText: '',
  sizeFile: '',
  productLink: '',
  chooseDirection: '',
  salePoint: '',
  fabricContent: '',
  // fabricComposition: [], // OLD CODE: 注释掉初始化
  costEstimate: '',
  minimumOrderQuantity: '',
  factoryInventoryDepth: '',
  colorAnalysis: '',
  isDraft: 1
})
const bukValue = ref<FormModel>(cloneDeep(dataValue.value))
const viewType = ref<'view' | 'add' | 'edit'>('add')
const loading = ref(false)

const syncCategoryCascadeFromData = () => {
  const tree = categoryTree.value ?? []
  const categoryValue = dataValue.value.category
  const categoryLabel = dataValue.value.categoryLabel
  let path: Array<string | number> = []
  if (categoryValue !== undefined && categoryValue !== null && categoryValue !== '') {
    path = findCategoryPathByValue(tree, categoryValue)
  }
  if (!path.length && categoryLabel) {
    path = findCategoryPathByLabelChain(tree, splitCategoryLabelChain(categoryLabel))
  }
  setCascadeValue(path)
}

watch(categoryCascadeValue, (value) => {
  const normalized = normalizeCascadePath(Array.isArray(value) ? [...value] : [])
  const last = normalized.length ? normalized[normalized.length - 1] : ''
  dataValue.value.category = last === '' || last === undefined || last === null ? '' : String(last)
  if (normalized.length) {
    const labels = resolveCategoryLabelsByPath(categoryTree.value, normalized)
    if (labels.length) {
      dataValue.value.categoryLabel = labels.join(CATEGORY_LABEL_SEPARATOR)
    } else {
      const fallback = getCategoryLabelByValue(dataValue.value.category)
      dataValue.value.categoryLabel = fallback ? fallback : ''
    }
  } else {
    dataValue.value.categoryLabel = ''
  }
  if (!isProgrammaticCategoryUpdate && viewType.value !== 'view') {
    nextTick(() => {
      formRef.value?.validateField('category').catch(() => {})
    })
  }
})

watch(
  [() => dataValue.value.category, () => dataValue.value.categoryLabel, () => categoryTree.value],
  () => {
    syncCategoryCascadeFromData()
    bukValue.value = cloneDeep(dataValue.value)
  },
  { immediate: true }
)

/* OLD CODE: 面料成分相关的逻辑全部注释
// 面料成分编辑
const activeFabricIdx = ref<number | null>(null)
const normalizeFabricValue = (value: unknown) => {
  const num = Number.parseFloat(String(value ?? ''))
  return Number.isFinite(num) ? Number(num.toFixed(2)) : 0
}
const calcFabricSum = (list: FabricItem[]) =>
  list.reduce((sum, it) => sum + normalizeFabricValue(it.value), 0)
const fabricSumRaw = computed(() => calcFabricSum(dataValue.value.fabricComposition || []))
const isFabricSumEqual100 = computed(() => Math.abs(fabricSumRaw.value - 100) < 0.01)
const ensureFabricTotalWithinLimit = (list: FabricItem[]) => {
  const total = calcFabricSum(list)
  if (total > 100.0001) {
    message.error('面料成分合计不能超过100%')
    return false
  }
  return true
}
const buildFabricItem = (
  item: { key: string; value: string },
  origin?: FabricItem | null
): FabricItem => {
  const key = String(item.key ?? '').trim()
  const value = Number.parseFloat(String(item.value ?? ''))
  const dictLabel = key ? getDictLabel(DICT_TYPE.FABRIC, key) : ''
  const sameKey = origin && origin.key === key
  const fallbackName = sameKey ? origin?.name || origin?.key : ''
  const name = dictLabel || fallbackName || key

  return {
    key,
    name,
    value: Number.isFinite(value) ? value : 0
  }
}
const removeFabric = (idx: number) => {
  dataValue.value.fabricComposition.splice(idx, 1)
  formRef.value?.validateField('fabricComposition')
}

const formatFabricTag = (item: FabricItem) => {
  const dictLabel = item.key ? getDictLabel(DICT_TYPE.FABRIC, item.key) : ''
  const display = dictLabel || item.name || item.key
  const normalizeValue = () => {
    const raw = item.value
    if (raw === undefined || raw === null) return ''
    if (typeof raw === 'number') return `${raw}%`
    const str = String(raw).trim()
    if (!str) return ''
    const parsed = Number.parseFloat(str.replace('%', ''))
    if (Number.isFinite(parsed)) return `${parsed}%`
    return str
  }
  const value = normalizeValue()
  return `${display || '未命名'} ${value ? value : ''}`
}

const addFabricByDialog = async () => {
  await openDialog({
    title: '面料含量',
    width: 480,
    content: CompositionDialog,
    showConfirmFooter: true,
    props: {
      isAdd: true,
      selectedKeys: dataValue.value.fabricComposition.map((it) => String(it.key)).filter(Boolean),
      onSubmit: (item: { key: string; value: string }, continueAdd: boolean) => {
        const nextItem = buildFabricItem(item, null)
        const nextList = [...dataValue.value.fabricComposition, nextItem]
        if (!ensureFabricTotalWithinLimit(nextList)) return false
        dataValue.value.fabricComposition.push(nextItem)
        formRef.value?.validateField('fabricComposition')
        return continueAdd ? true : undefined
      }
    },
    onSuccess: () => {}
  })
}

const onClickFabric = (idx: number) => {
  if (viewType.value === 'view') return
  activeFabricIdx.value = idx
  editFabric(idx)
}

const editFabric = async (idx: number) => {
  const init = dataValue.value.fabricComposition[idx]
  await openDialog({
    title: '面料含量',
    width: 480,
    content: CompositionDialog,
    showConfirmFooter: false,
    props: {
      allowCustomType: true,
      isAdd: false,
      init,
      selectedKeys: dataValue.value.fabricComposition
        .filter((_, i) => i !== idx)
        .map((it) => String(it.key))
        .filter(Boolean),
      onSubmit: (item: { key: string; value: string }, _continueAdd: boolean) => {
        const nextItem = buildFabricItem(item, init)
        const nextList = dataValue.value.fabricComposition.map((fc, index) =>
          index === idx ? nextItem : fc
        )
        if (!ensureFabricTotalWithinLimit(nextList)) return false
        dataValue.value.fabricComposition[idx] = nextItem
        activeFabricIdx.value = null
        formRef.value?.validateField('fabricComposition')
        return true
      }
    },
    onSuccess: () => {}
  })
}
*/

const openProductLink = () => {
  if (!dataValue.value.productLink) return
  const url = dataValue.value.productLink
  try {
    window.open(url, '_blank')
  } catch {
    message.error('链接无效')
  }
}

const handleProductPictureChange = () => {
  nextTick(() => {
    formRef.value?.validateField('productPicture')
  })
}

// 唯一性校验（可对接外部函数）
const props = defineProps<{
  checkPlanNameUnique?: (name: string, id?: string | number) => Promise<boolean>
}>()

const validatePlanNameUnique = (_rule: any, value: string, callback: (err?: Error) => void) => {
  if (!value) {
    callback(new Error('请输入企划名称'))
    return
  }
  if (value.length > 100) {
    callback(new Error('企划名称最多100字符'))
    return
  }
  if (!props.checkPlanNameUnique) {
    callback()
    return
  }
  props
    .checkPlanNameUnique(value.trim(), dataValue.value.id)
    .then((ok) => {
      if (!ok) {
        callback(new Error('企划名称已存在，请更换'))
      } else {
        callback()
      }
    })
    .catch(() => {
      // 校验失败时不阻断保存流程，可按需调整
      callback()
    })
}

const ensureSizeFilled = () => {
  const text = dataValue.value.sizeText?.trim?.() ?? ''
  const file = dataValue.value.sizeFile?.trim?.() ?? ''
  return Boolean(text) || Boolean(file)
}

const validateSizeText = (_rule: any, value: string, callback: (err?: Error) => void) => {
  const text = (value ?? '').trim()
  if (text && text.length > 100) {
    callback(new Error('尺码文本最多100字符'))
    return
  }
  if (!ensureSizeFilled()) {
    callback(new Error('请填写尺码文本或上传尺码附件'))
    return
  }
  callback()
}

const validateSizeFile = (_rule: any, value: string, callback: (err?: Error) => void) => {
  const file = (value ?? '').toString().trim()
  if (!file && !dataValue.value.sizeText?.trim?.()) {
    callback(new Error('请填写尺码文本或上传尺码附件'))
    return
  }
  callback()
}

const rules = reactive<FormRules<FormModel>>({
  category: [{ required: true, message: '请选择品类', trigger: 'change' }],
  planName: [{ required: true, validator: validatePlanNameUnique, trigger: ['blur', 'change'] }],
  pricing: [
    { required: true, message: '请输入定价', trigger: 'blur' },
    { max: 50, message: '最多50字符', trigger: 'blur' }
  ],
  costEstimate: [{ required: true, message: '请输入成本预估', trigger: 'blur' }],
  salesVolume: [
    { required: true, message: '请输入销量', trigger: 'blur' },
    { max: 50, message: '最多50字符', trigger: 'blur' }
  ],
  productPicture: [{ required: true, message: '请上传产品图片', trigger: 'change' }],
  sizeText: [{ validator: validateSizeText, trigger: ['blur', 'change'], required: true }],
  sizeFile: [{ validator: validateSizeFile, trigger: 'change' }],
  productLink: [
    { required: true, message: '请输入竞品链接', trigger: 'blur' },
    {
      validator: (_r, v: string, cb) => {
        if (!v) return cb()
        try {
          // 允许 http(s)
          const ok = /^https?:\/\//i.test(v.trim())
          return ok ? cb() : cb(new Error('链接需以http://或https://开头'))
        } catch {
          return cb(new Error('链接格式不正确'))
        }
      },
      trigger: ['blur', 'change']
    }
  ],
  chooseDirection: [
    { required: true, message: '请输入选品方向', trigger: 'blur' },
    { max: 200, message: '最多200字符', trigger: 'blur' }
  ],
  salePoint: [
    { required: true, message: '请输入核心卖点', trigger: 'blur' },
    { max: 200, message: '最多200字符', trigger: 'blur' }
  ],
  // NEW CODE: 面料成分校验
  fabricContent: [
    { required: true, message: '请输入面料成分', trigger: 'blur' },
    { max: 200, message: '最多200字符', trigger: 'blur' }
  ],
  minimumOrderQuantity: [{ required: true, message: '请输入最小起订量', trigger: 'blur' }],
  factoryInventoryDepth: [{ required: true, message: '请输入工厂库存深度', trigger: 'blur' }],
  colorAnalysis: [{ required: true, message: '请输入色系分析', trigger: 'blur' }]
  /* OLD CODE:
  fabricComposition: [
    { required: true, message: '请添加面料成分', trigger: 'change' },
    {
      validator: (_r, _v, cb) => {
        if (!dataValue.value.fabricComposition.length) return cb(new Error('请添加面料成分'))
        if (!isFabricSumEqual100.value) return cb(new Error('面料成分合计需等于100%'))
        cb()
      },
      trigger: 'change'
    }
  ]
  */
})

const title = computed(() =>
  viewType.value === 'view' ? '详情' : viewType.value === 'edit' ? '编辑' : '新增'
)

const checkValue = async () => {
  if (!formRef.value) return false
  try {
    await formRef.value.validate()
  } catch {
    return false
  }
  /* OLD CODE: 面料成分校验逻辑
  if (isSumExceedTarget(100, fabricSumRaw.value)) {
    message.warning('面料成分合计不能超过100%')
    return false
  }
  if (!isSumEqualTarget(100, fabricSumRaw.value)) {
    message.warning('面料成分合计需等于100%')
    return false
  }
  */
  return true
}

const normalizeCategoryValue = (value: string | number) => {
  if (value === undefined || value === null || value === '') return undefined
  const num = Number(value)
  return Number.isNaN(num) ? value : num
}

const buildSubmitPayload = (isDraft: boolean) => {
  const payload: Record<string, any> = {
    category: dataValue.value.category,
    planName: dataValue.value.planName?.trim(),
    chooseTime: dataValue.value.chooseTime || '',
    pricing: dataValue.value.pricing?.trim(),
    salesVolume: dataValue.value.salesVolume?.trim(),
    productPicture: (dataValue.value.productPicture || '').trim(),
    productLink: dataValue.value.productLink?.trim(),
    chooseDirection: dataValue.value.chooseDirection?.trim(),
    salePoint: dataValue.value.salePoint?.trim(),
    fabricContent: dataValue.value.fabricContent?.trim(),
    costEstimate: dataValue.value.costEstimate?.trim(),
    sizeText: dataValue.value.sizeText?.trim(),
    sizeFile: dataValue.value.sizeFile?.trim(),
    isDraft: isDraft ? 1 : 0, // 新增：根据参数设置 isDraft 状态
    minimumOrderQuantity: dataValue.value.minimumOrderQuantity?.trim(),
    factoryInventoryDepth: dataValue.value.factoryInventoryDepth?.trim(),
    colorAnalysis: dataValue.value.colorAnalysis?.trim()
  }
  if (viewType.value === 'edit' && dataValue.value.id !== undefined) {
    payload.id = dataValue.value.id
  }
  return payload
}

const performSubmit = debounce(async (isDraft: boolean) => {
  if (loading.value) return
  const payload = buildSubmitPayload(isDraft) // 传递 isDraft
  loading.value = true
  try {
    if (viewType.value === 'edit') {
      await updateBuyerPlan(payload)
      message.success(isDraft ? '暂存成功' : '编辑成功') // 可选：优化提示语
    } else {
      await addBuyerPlan(payload)
      message.success(isDraft ? '暂存成功' : '新增成功') // 可选：优化提示语
    }
    bukValue.value = cloneDeep(dataValue.value)
    emit('success')
    eventBus.emit('upload:delete')
    detailsRef?.value?.close()
  } catch (error) {
    console.error(error)
    message.error('提交失败，请稍后重试')
  } finally {
    loading.value = false
  }
}, 300)

const submitForm = async (isDraft: boolean | Event = false) => {
  if (viewType.value === 'view' || loading.value) return

  // 确保 isDraftMode 是布尔值 (防止 Event 对象干扰)
  const isDraftMode = isDraft === true

  // 只有在【不是暂存】的情况下才进行表单校验
  if (!isDraftMode) {
    const valid = await checkValue()
    if (!valid) return
  }

  performSubmit(isDraftMode)
}

const openDrawer = (item: Partial<FormModel> = {}, type: 'view' | 'add' | 'edit' = 'add') => {
  detailsRef?.value?.openDrawer(
    async () => {
      viewType.value = type
      // 数据回填
      const baseData: FormModel = {
        category: '',
        categoryLabel: '',
        planName: '',
        chooseTime: '',
        pricing: '',
        salesVolume: '',
        productPicture: '',
        sizeText: '',
        sizeFile: '',
        productLink: '',
        chooseDirection: '',
        salePoint: '',
        fabricContent: '',
        costEstimate: '',
        minimumOrderQuantity: '',
        factoryInventoryDepth: '',
        colorAnalysis: '',
        isDraft: 1
      }
      const raw = item as any
      const resolvedCategory = resolveCategoryForForm(
        raw?.categoryValue ?? raw?.category,
        raw?.categoryLabel ?? raw?.categoryName ?? raw?.category
      )

      const merged: any = {
        ...baseData,
        ...raw,
        category: resolvedCategory
      }
      const categoryLabel =
        raw?.categoryLabel ??
        getCategoryLabelByValue(resolvedCategory) ??
        (typeof raw?.category === 'string' ? raw.category : '')
      merged.categoryLabel = categoryLabel

      // 处理面料成分：直接读取 fabricContent 字符串，或者如果后端以前存的是JSON，这里兼容处理一下转换成字符串
      if (raw?.fabricContent) {
        if (
          typeof raw.fabricContent === 'string' &&
          (raw.fabricContent.startsWith('[') || raw.fabricContent.startsWith('{'))
        ) {
          // 如果是旧数据（JSON格式），尝试解析并拼接成字符串显示，或者直接显示原样
          try {
            const parsed = JSON.parse(raw.fabricContent)
            if (Array.isArray(parsed)) {
              merged.fabricContent = parsed
                .map((it: any) => `${it.key || it.name}${it.value ? it.value + '%' : ''}`)
                .join(' ')
            } else {
              merged.fabricContent = raw.fabricContent
            }
          } catch {
            merged.fabricContent = raw.fabricContent
          }
        } else {
          merged.fabricContent = raw.fabricContent
        }
      } else {
        merged.fabricContent = ''
      }

      dataValue.value = merged
      console.log(dataValue.value, 'dataValue.value')
      syncCategoryCascadeFromData()
      bukValue.value = cloneDeep(dataValue.value)
    },
    () => {
      nextTick(() => {
        formRef.value?.clearValidate()
      })
    }
  )
}
defineExpose({ openDrawer })
provide('BuyerPlanDetails', { dataValue, bukValue, viewType, title, loading })
</script>
<style scoped lang="scss">
/* OLD CODE: 样式注释
.composition-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.composition-items {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

:deep(.composition-tag.el-tag) {
  height: 32px;
  display: inline-flex;
  align-items: center;
  padding: 0 12px;
  border: 1px solid var(--el-border-color);
  background-color: #fff;
  color: var(--el-text-color-regular);
  cursor: pointer;
}

:deep(.composition-tag.el-tag.active) {
  color: var(--el-color-primary);
  border-color: var(--el-color-primary);
  background-color: rgba(0, 100, 255, 0.1);
}

:deep(.composition-tag.el-tag.active .el-tag__close) {
  color: rgb(0, 100, 255) !important;
}

:deep(.composition-tag .el-tag__close) {
  color: var(--el-text-color-regular);
}

:deep(.el-form-item.is-error .composition-tag .el-tag__close) {
  color: var(--el-text-color-regular);
}

:deep(.el-select .el-tag__close) {
  color: var(--el-text-color-regular);
}

:deep(.el-form-item.is-error .el-select .el-tag__close) {
  color: var(--el-text-color-regular);
}

:deep(.composition-tag .el-tag__close:hover),
:deep(.el-select .el-tag__close:hover) {
  background-color: transparent !important;
  color: rgb(0, 100, 255) !important;
}

.add-composition-btn {
  border: 1px dashed #b8b8b8;
  border-radius: 4px;
  width: fit-content;

  :deep(> span) {
    display: flex;
    align-items: center;
    gap: 2px;
  }
}

.empty_tip {
  color: #999;
  margin-right: 12px;
}

.sum_tip {
  margin-right: 12px;
  color: #666;

  &.error {
    color: #f56c6c;
  }
}
*/

:deep(.el-form) {
  .el-select,
  .el-input,
  .el-date-editor,
  .el-cascader {
    width: 100%;
  }

  .el-input:not(.is-disabled) {
    .el-input-group__append {
      box-shadow: 0 0 0 1px #e5e5e5;
    }
  }

  .size-file-item {
    .upload_info {
      .el-upload-dragger {
        padding: 10px var(--el-upload-dragger-padding-vertical) 30px
          var(--el-upload-dragger-padding-vertical);
      }
    }
  }
}

.page-details {
  :deep(.el-drawer) {
    .card_info {
      .el-card__body {
        padding: 0;
      }
    }
  }
}
</style>
