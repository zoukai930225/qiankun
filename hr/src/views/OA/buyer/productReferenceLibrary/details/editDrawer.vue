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
                <el-form-item label="关联企划" prop="bpBusinessEnterprisePlanId">
                  <el-select
                    v-model="dataValue.bpBusinessEnterprisePlanId"
                    placeholder="请选择企划"
                    clearable
                    filterable
                    remote
                    :remote-method="handlePlanSearch"
                    :loading="planLoading"
                    @change="handlePlanChange"
                  >
                    <el-option
                      v-for="op in planOptions"
                      :key="op.value"
                      :label="op.label"
                      :value="op.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="产品名称" prop="productName">
                  <el-input
                    v-model="dataValue.productName"
                    placeholder="请输入产品名称"
                    maxlength="100"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="供应商" prop="supplierId">
                  <el-select
                    v-model="dataValue.supplierId"
                    placeholder="请选择供应商"
                    clearable
                    filterable
                    multiple
                    collapse-tags
                    collapse-tags-tooltip
                    :loading="supplierLoading"
                  >
                    <el-option
                      v-for="op in supplierOptions"
                      :key="op.value"
                      :label="op.label"
                      :value="op.value"
                    >
                      <span>{{ op.label }}</span>
                      <!-- <span v-if="op.statusName">（{{ op.statusName }}）</span> -->
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  prop="minimumOrderQuantity"
                  :label="'最小起订\n量'"
                  class="multiline-label-item"
                >
                  <el-input
                    v-model="dataValue.minimumOrderQuantity"
                    placeholder="请输入最小起订量"
                    maxlength="50"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  :label="'工厂库存\n深度'"
                  prop="inventoryDepthText"
                  class="multiline-label-item"
                >
                  <el-input
                    v-model="dataValue.inventoryDepthText"
                    maxlength="50"
                    placeholder="请输入工厂库存深度"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="成本预估" prop="costEstimate">
                  <el-input
                    v-model="dataValue.costEstimate"
                    placeholder="请输入成本预估"
                    maxlength="50"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="单价" prop="unitPrice">
                  <el-input
                    v-model="dataValue.unitPrice"
                    maxlength="50"
                    placeholder="请输入单价"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="图稿编号" prop="artworkNumber">
                  <el-input
                    v-model="dataValue.artworkNumber"
                    maxlength="50"
                    placeholder="请输入图稿编号"
                    clearable
                  />
                  <div class="row-center">
                    <img
                      src="@/assets/imgs/common/warning_icon.png"
                      alt=""
                      style="width: 14px; height: 14px"
                    />
                    <div style="font-size: 14px; color: #e26a00; margin-left: 5px">
                      增加图稿编号，在还没有产生大货编号之前可以由设计师/买手自由编辑，方便快速定位，不可重复</div
                    >
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="现货库存" prop="spotInventoryText">
                  <s-text-area
                    v-model="dataValue.spotInventoryText"
                    maxlength="100"
                    show-word-limit
                    placeholder="请输入现货库存"
                    :rows="3"
                    clearable
                  />
                </el-form-item>
                <el-form-item prop="spotInventoryFile" class="mt-8px">
                  <Transfer
                    v-model="dataValue.spotInventoryFile"
                    :limit="1"
                    accept-type="all"
                    width="100%"
                    :disabled="viewType === 'view'"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="尺码" prop="sizeText">
                  <s-text-area
                    v-model="dataValue.sizeText"
                    maxlength="100"
                    show-word-limit
                    placeholder="请输入尺码"
                    :rows="3"
                    clearable
                  />
                </el-form-item>
                <el-form-item prop="sizeFile" class="mt-8px">
                  <Transfer
                    v-model="dataValue.sizeFile"
                    :limit="1"
                    accept-type="all"
                    width="100%"
                    :disabled="viewType === 'view'"
                  />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="实拍图片" prop="realPhotos">
                  <Transfer
                    v-model="dataValue.realPhotos"
                    :limit="1"
                    width="100%"
                    :disabled="viewType === 'view'"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  :label="'模特上身\n图'"
                  prop="modelUpperBodyPicture"
                  class="multiline-label-item"
                >
                  <Transfer
                    v-model="dataValue.modelUpperBodyPicture"
                    :limit="1"
                    width="100%"
                    :disabled="viewType === 'view'"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="竞品链接" prop="productLink">
                  <el-input v-model="dataValue.productLink" placeholder="请输入竞品链接" clearable>
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
              </el-col>
              <el-col :span="12">
                <el-form-item label="毛利率" prop="grossProfitMarginText">
                  <s-text-area
                    v-model="dataValue.grossProfitMarginText"
                    maxlength="100"
                    show-word-limit
                    placeholder="请输入毛利率"
                    :rows="3"
                    clearable
                  />
                </el-form-item>
                <el-form-item prop="grossProfitMarginFile" class="mt-8px">
                  <Transfer
                    v-model="dataValue.grossProfitMarginFile"
                    :limit="1"
                    accept-type="all"
                    width="100%"
                    :disabled="viewType === 'view'"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  prop="planningObjectiveText"
                  :label="'企划初步\n目标规划'"
                  class="multiline-label-item"
                >
                  <s-text-area
                    v-model="dataValue.planningObjectiveText"
                    maxlength="100"
                    show-word-limit
                    placeholder="请输入企划初步目标规划"
                    :rows="3"
                    clearable
                  />
                </el-form-item>
                <el-form-item prop="planningObjectiveFile" class="mt-8px">
                  <Transfer
                    v-model="dataValue.planningObjectiveFile"
                    :limit="1"
                    accept-type="all"
                    width="100%"
                    :disabled="viewType === 'view'"
                  />
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item :label="'卖点/功能'" prop="salePoints" class="multiline-label-item">
                  <div style="width: 100%">
                    <el-table
                      :data="dataValue?.salePoints"
                      border
                      :header-cell-style="{
                        height: '40px',
                        backgroundColor: '#F2F6FC',
                        color: '#666666'
                      }"
                    >
                      <el-table-column
                        label="序号"
                        type="index"
                        width="60"
                        align="center"
                      ></el-table-column>
                      <el-table-column label="卖点">
                        <template #default="{ row }">
                          <STextArea
                            v-model="row.salePoint"
                            :rows="1"
                            :autosize="{ minRows: 1, maxRows: 3 }"
                            placeholder="请输入卖点/功能"
                            :disabled="viewType === 'view'"
                          />
                        </template>
                      </el-table-column>
                      <el-table-column label="操作" width="80" align="center" v-if="viewType !== 'view'">
                        <template #default="scope">
                          <el-button link type="danger" @click="delRemarkLine(scope.$index)"
                            >删除</el-button
                          >
                        </template>
                      </el-table-column>
                      <template #append v-if="viewType !== 'view'">
                        <div
                          style="
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            height: 40px;
                          "
                        >
                          <el-button icon="Plus" link type="primary" @click="addRemarkLine">
                            添加
                          </el-button>
                        </div>
                      </template>
                    </el-table>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="色系分析" prop="colorAnalysis">
                  <s-text-area
                    v-model="dataValue.colorAnalysis"
                    maxlength="200"
                    show-word-limit
                    :autosize="{ minRows: 3, maxRows: 6 }"
                    placeholder="请输入色系分析"
                    :disabled="viewType === 'view'"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="面料成分" prop="fabricContent">
                  <s-text-area
                    v-model="dataValue.fabricContent"
                    maxlength="200"
                    show-word-limit
                    :autosize="{ minRows: 3, maxRows: 6 }"
                    placeholder="请输入面料成分"
                    :disabled="viewType === 'view'"
                  />
                </el-form-item>
              </el-col>
            </el-row>
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
        >
          暂存
        </el-button>
        <el-button
          v-if="viewType !== 'view'"
          type="primary"
          @click="submitForm(false)"
          :loading="loading"
        >
          提交
        </el-button>
      </div>
    </template>
  </scheme-details>
</template>
<script lang="ts" setup>
import STextArea from '@/components/common/input/s-textarea.vue'
import { computed, inject, nextTick, provide, reactive, ref, watch } from 'vue'
import type { Ref } from 'vue'
import Transfer from '@/components/common/upload/transfer.vue'
import { cloneDeep, debounce } from 'lodash-es'
import type { FormInstance, FormRules } from 'element-plus'
import { useMessage } from '@/hooks/web/useMessage'
import FormContentLayout from '@/layout/components/ContentLayout'
import {
  addCandidateProduct,
  updateCandidateProduct,
  getCandidateProductDetail,
  getCandidateProductSupplierOptions
} from '@/api/oa/buyer/productReference'
import { getBuyerPlanPage } from '@/api/oa/buyer/planManagement'
import eventBus from '@/utils/eventBus'
import {
  CATEGORY_PROVIDE_KEY,
  categoryListKey,
  type CategoryProvideContext
} from '../config/config'

const message = useMessage()
const emit = defineEmits<{ (e: 'success'): void }>()

type OptionItem = {
  label: string
  value: string | number
  statusName?: string
  costEstimate?: string
  minimumOrderQuantity?: string
  factoryInventoryDepth?: string
  fabricContent?: string
  colorAnalysis?: string
}

type FormModel = {
  id?: string | number
  bpBusinessEnterprisePlanId: string | number | ''
  category: string | number | ''
  categoryName?: string
  productName: string
  // 修改点：类型改为数组
  supplierId: (string | number)[]
  spotInventoryText: string
  spotInventoryFile: string
  sizeText: string
  sizeFile: string
  unitPrice: string
  realPhotos: string
  modelUpperBodyPicture: string
  productLink: string
  grossProfitMarginText: string
  grossProfitMarginFile: string
  planningObjectiveText: string
  planningObjectiveFile: string
  inventoryDepthText: string
  inventoryDepthFile: string
  salePoint: string
  artworkNumber: string
  minimumOrderQuantity: string
  costEstimate: string
  colorAnalysis: string
  fabricContent: string
  isDraft?: number
  salePoints: any
}

const DEFAULT_CATEGORY_CASCADER_PROPS = Object.freeze({
  label: 'categoryName',
  value: 'categoryCode',
  children: 'subCategories',
  checkStrictly: true,
  emitPath: false
})

const CATEGORY_LABEL_SEPARATOR = ' > '

type SupplierOption = OptionItem & { status?: string | number }

const supplierOptions = ref<SupplierOption[]>([])
const supplierLoading = ref(false)
const planOptions = ref<OptionItem[]>([])
const planLoading = ref(false)

const layouts = [{ label: '参选产品信息', key: 'basicInfo' }]

const detailsRef = ref<any>()
const formRef = ref<FormInstance>()
const loading = ref(false)
const viewType = ref<'view' | 'add' | 'edit'>('add')
const categoryCascadeValue = ref<Array<string | number>>([])
let isProgrammaticCategoryUpdate = false
const injectedCategoryList = inject<Ref<any[]>>(categoryListKey, ref<any[]>([]))
const categoryProvideContext = inject<CategoryProvideContext | null>(CATEGORY_PROVIDE_KEY, null)
const categoryTree = computed<any[]>(() => {
  if (categoryProvideContext?.tree) {
    return (categoryProvideContext.tree.value ?? []) as any[]
  }
  return injectedCategoryList.value ?? []
})
const categoryCascaderProps = computed(() => ({
  ...DEFAULT_CATEGORY_CASCADER_PROPS,
  ...(categoryProvideContext?.props ?? {}),
  emitPath: true
}))

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
      if (childPath.length) {
        return childPath
      }
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

const syncCategoryCascadeFromData = () => {
  const tree = categoryTree.value ?? []
  const categoryValue = dataValue.value.category
  const categoryLabel = dataValue.value.categoryName
  let path: Array<string | number> = []
  if (categoryValue !== undefined && categoryValue !== null && categoryValue !== '') {
    path = findCategoryPathByValue(tree, categoryValue)
  }
  if (!path.length && categoryLabel) {
    path = findCategoryPathByLabelChain(tree, splitCategoryLabelChain(categoryLabel))
  }
  setCascadeValue(path)
}

const buildDefaultForm = (): FormModel => ({
  bpBusinessEnterprisePlanId: '',
  category: '',
  categoryName: '',
  productName: '',
  supplierId: [], // 修改点：默认为空数组
  spotInventoryText: '',
  spotInventoryFile: '',
  sizeText: '',
  sizeFile: '',
  unitPrice: '',
  realPhotos: '',
  modelUpperBodyPicture: '',
  productLink: '',
  grossProfitMarginText: '',
  grossProfitMarginFile: '',
  planningObjectiveText: '',
  planningObjectiveFile: '',
  inventoryDepthText: '',
  inventoryDepthFile: '',
  salePoint: '',
  artworkNumber: '',
  minimumOrderQuantity: '',
  costEstimate: '',
  colorAnalysis: '',
  fabricContent: '',
  isDraft: 1,
  salePoints: [{}]
})

const dataValue = ref<FormModel>(buildDefaultForm())
const bukValue = ref<FormModel>(cloneDeep(dataValue.value))

const props = defineProps<{
  checkProductNameUnique?: (name: string, id?: string | number) => Promise<boolean>
}>()

watch(categoryCascadeValue, (value) => {
  const normalized = normalizeCascadePath(Array.isArray(value) ? [...value] : [])
  const last = normalized.length ? normalized[normalized.length - 1] : ''
  dataValue.value.category = last === '' || last === undefined || last === null ? '' : String(last)
  if (normalized.length) {
    const labels = resolveCategoryLabelsByPath(categoryTree.value, normalized)
    if (labels.length) {
      dataValue.value.categoryName = labels.join(CATEGORY_LABEL_SEPARATOR)
    }
  } else {
    dataValue.value.categoryName = ''
  }
  if (!isProgrammaticCategoryUpdate && viewType.value !== 'view') {
    nextTick(() => {
      formRef.value?.validateField('category').catch(() => {})
    })
  }
})

watch(
  [() => dataValue.value.category, () => dataValue.value.categoryName, () => categoryTree.value],
  () => {
    syncCategoryCascadeFromData()
    bukValue.value = cloneDeep(dataValue.value)
  },
  { immediate: true }
)

const unwrapArray = (source: any): any[] => {
  if (!source) return []
  if (Array.isArray(source)) return source
  if (Array.isArray(source.records)) return source.records
  if (Array.isArray(source.rows)) return source.rows
  if (Array.isArray(source.list)) return source.list
  if (Array.isArray(source.data)) return source.data
  return []
}

const normalizePlanOption = (item: any): OptionItem | null => {
  const value = item?.id ?? item?.bpBusinessEnterprisePlanId ?? item?.value
  if (value === undefined || value === null || value === '') return null
  const label = item?.planName ?? item?.name ?? item?.label ?? String(value)

  return {
    ...item,
    value,
    label,
    costEstimate: item.costEstimate,
    minimumOrderQuantity: item.minimumOrderQuantity,
    factoryInventoryDepth: item.factoryInventoryDepth,
    fabricContent: item.fabricContent,
    colorAnalysis: item.colorAnalysis
  }
}

const ensurePlanOption = (value: string | number | '', label?: string) => {
  if (value === '' || value === undefined || value === null) return
  const exists = planOptions.value.some((op) => String(op.value) === String(value))
  if (!exists) {
    planOptions.value.push({ value, label: label || String(value) })
  }
}

const normalizeSupplierOption = (item: any): SupplierOption | null => {
  const value = item?.id ?? item?.supplierId ?? item?.value
  if (value === undefined || value === null || value === '') return null
  const label =
    item?.abbreviationCompany ??
    item?.supplierName ??
    item?.companyName ??
    item?.name ??
    item?.label ??
    String(value)
  const status = item?.status ?? item?.statusCode
  return { ...item, value, label, status }
}

// 修改点：更新 ensureSupplierOption 以支持处理数组或逗号分隔的字符串
const ensureSupplierOption = (
  value: (string | number)[] | string | number | null | undefined,
  label?: string | null,
  status?: string | number
) => {
  if (!value) return

  // 1. 标准化 ID 列表
  let ids: (string | number)[] = []
  if (Array.isArray(value)) {
    ids = value
  } else {
    ids = String(value)
      .split(',')
      .filter((v) => v)
  }

  // 2. 标准化 Label 列表 (假设后端返回的名字也是逗号分隔的，顺序对应)
  let labels: string[] = []
  if (label) {
    labels = String(label).split(',')
  }

  // 3. 遍历并确保存在
  ids.forEach((id, index) => {
    const idStr = String(id)
    const exists = supplierOptions.value.some((op) => String(op.value) === idStr)

    if (!exists) {
      // 尝试获取对应的名字，如果拿不到，就默认显示 ID
      const name = labels[index] ? labels[index].trim() : String(id)
      supplierOptions.value.push({
        value: id, // 保持原始类型或者都转string取决于业务，这里尽量保持原样
        label: name,
        status
      })
    }
  })
}

const fetchPlanOptions = async (keyword = '') => {
  try {
    const params: Record<string, any> = { page: 1, size: 50, isDraft: 0 }
    if (keyword) params.planName = keyword
    const res = await getBuyerPlanPage(params)
    const options = res.records
      .map(normalizePlanOption)
      .filter((item): item is OptionItem => !!item)
    const unique = new Map<string | number, OptionItem>()
    options.forEach((item) => {
      if (!unique.has(item.value)) unique.set(item.value, item)
    })
    planOptions.value = Array.from(unique.values())
  } catch (error) {
    console.error(error)
  } finally {
    planLoading.value = false
  }
}

const handlePlanChange = (val: string | number | '') => {
  if (!val) return
  const selectedOption = planOptions.value.find((op) => op.value === val)

  if (selectedOption) {
    if (selectedOption.costEstimate) {
      dataValue.value.costEstimate = String(selectedOption.costEstimate)
    }
    if (selectedOption.minimumOrderQuantity) {
      dataValue.value.minimumOrderQuantity = String(selectedOption.minimumOrderQuantity)
    }
    if (selectedOption.factoryInventoryDepth) {
      dataValue.value.inventoryDepthText = String(selectedOption.factoryInventoryDepth)
    }
    if (selectedOption.fabricContent) {
      if (
        typeof selectedOption.fabricContent === 'string' &&
        (selectedOption.fabricContent.startsWith('[') ||
          selectedOption.fabricContent.startsWith('{'))
      ) {
        try {
          const parsed = JSON.parse(selectedOption.fabricContent)
          if (Array.isArray(parsed)) {
            dataValue.value.fabricContent = parsed
              .map((it: any) => `${it.key || it.name}${it.value ? it.value + '%' : ''}`)
              .join(' ')
          }
        } catch {}
      } else {
        dataValue.value.fabricContent = String(selectedOption.fabricContent)
      }
    }
    if (selectedOption.colorAnalysis) {
      dataValue.value.colorAnalysis = String(selectedOption.colorAnalysis)
    }
  }
}

const ALLOWED_SUPPLIER_STATUS = new Set(['0', '2', 0, 2])

const fetchSupplierOptions = async () => {
  try {
    supplierLoading.value = true
    const res = await getCandidateProductSupplierOptions()
    const list = unwrapArray(res)
      .map(normalizeSupplierOption)
      .filter((item): item is SupplierOption => !!item)
      .filter((item) =>
        item.status === undefined ? false : ALLOWED_SUPPLIER_STATUS.has(item.status)
      )
    const map = new Map<string | number, SupplierOption>()
    list.forEach((item) => {
      if (!map.has(item.value)) map.set(item.value, item)
    })
    supplierOptions.value = Array.from(map.values())
  } catch (error) {
    console.error(error)
  } finally {
    supplierLoading.value = false
  }
}

const debouncedPlanSearch = debounce((keyword: string) => {
  fetchPlanOptions(keyword)
}, 300)

const handlePlanSearch = (keyword: string) => {
  debouncedPlanSearch(keyword?.trim?.() ?? '')
}

const openProductLink = () => {
  const url = dataValue.value.productLink?.trim()
  if (!url) return
  try {
    window.open(url, '_blank')
  } catch {
    message.error('链接无效')
  }
}

const validateProductLink = (_rule: any, value: string, callback: (error?: Error) => void) => {
  if (!value) return callback()
  const trimmed = value.trim()
  const isValid = /^https?:\/\//i.test(trimmed)
  callback(isValid ? undefined : new Error('链接需以http://或https://开头'))
}

const validateSize = (_rule: any, _value: any, callback: (error?: Error) => void) => {
  if (dataValue.value.sizeText?.trim() || dataValue.value.sizeFile?.trim()) {
    callback()
  } else {
    callback(new Error('请填写尺码文本或上传附件'))
  }
}

const validateProductNameUnique = (
  _rule: any,
  value: string,
  callback: (error?: Error) => void
) => {
  if (!value || !props.checkProductNameUnique) {
    callback()
    return
  }
  props
    .checkProductNameUnique(value.trim(), dataValue.value.id)
    .then((isUnique) => {
      callback(isUnique ? undefined : new Error('产品名称已存在'))
    })
    .catch((error) => {
      console.error(error)
      callback(new Error('校验失败，请稍后重试'))
    })
}

const checkSalePoints = (rule: any, value: any, callback: any) => {
  if (!value || value.length === 0) return callback(new Error('请输入卖点/功能'))
  const arr = value.filter((item: any) => item.salePoint)
  if (!arr || arr.length === 0) return callback(new Error('请输入卖点/功能'))
  callback()
}

const rules = reactive<FormRules<FormModel>>({
  category: [{ required: true, message: '请选择品类', trigger: 'change' }],
  productName: [
    { required: true, message: '请输入产品名称', trigger: 'blur' },
    { max: 100, message: '最多100字符', trigger: 'blur' },
    { validator: validateProductNameUnique, trigger: 'blur' }
  ],
  // 修改点：增加数组类型校验
  supplierId: [{ required: true, message: '请选择供应商', trigger: 'change', type: 'array' }],
  sizeText: [
    { max: 100, message: '最多100字符', trigger: 'blur' },
    { validator: validateSize, trigger: ['blur', 'change'], required: true }
  ],
  sizeFile: [{ validator: validateSize, trigger: 'change' }],
  unitPrice: [
    { required: true, message: '请输入单价', trigger: 'blur' },
    { max: 50, message: '最多50字符', trigger: 'blur' }
  ],
  realPhotos: [{ required: true, message: '请上传实拍图片', trigger: 'change' }],
  productLink: [
    { required: true, message: '请输入竞品链接', trigger: 'blur' },
    { validator: validateProductLink, trigger: ['blur', 'change'] }
  ],
  grossProfitMarginText: [{ max: 100, message: '最多100字符', trigger: 'blur' }],
  planningObjectiveText: [{ max: 100, message: '最多100字符', trigger: 'blur' }],
  salePoints: [
    {
      required: true,
      validator: checkSalePoints,
      message: '请输入卖点/功能',
      trigger: ['blur', 'change']
    }
    // { max: 200, message: '最多200字符', trigger: 'blur' }
  ],
  minimumOrderQuantity: [{ required: true, message: '请输入最小起订量', trigger: 'blur' }],
  costEstimate: [{ required: true, message: '请输入成本预估', trigger: 'blur' }],
  colorAnalysis: [{ required: true, message: '请输入色系分析', trigger: 'blur' }],
  fabricContent: [{ required: true, message: '请输入面料成分', trigger: 'blur' }],
  artworkNumber: [{ required: true, message: '请输入图稿编号', trigger: 'blur' }],
  inventoryDepthText: [{ required: true, message: '请输入工厂库存深度', trigger: 'blur' }]
})

const title = computed(() =>
  viewType.value === 'view' ? '详情' : viewType.value === 'edit' ? '编辑' : '新增'
)

const checkValue = async () => {
  if (!formRef.value) return false
  try {
    await formRef.value.validate()
    return true
  } catch {
    return false
  }
}

// 修改点：提交时将数组转换为逗号分隔的字符串
const sanitizePayload = () => {
  const payload: Record<string, any> = {}
  Object.entries(dataValue.value).forEach(([key, value]) => {
    if (key === 'categoryName') return
    // 特殊处理 supplierId 数组转字符串
    if (key === 'supplierId' && Array.isArray(value)) {
      payload[key] = value.join(',')
      return
    }
    payload[key] = typeof value === 'string' ? value.trim() : value
  })

  if (payload.category === '' || payload.category === undefined || payload.category === null) {
    delete payload.category
  } else {
    payload.category = String(payload.category).trim()
    if (!payload.category) {
      delete payload.category
    }
  }

  if (!payload.bpBusinessEnterprisePlanId) delete payload.bpBusinessEnterprisePlanId

  // 处理 supplierId 为空的情况
  if (!payload.supplierId) {
    delete payload.supplierId
  }

  // 卖点/功能
  if (payload.salePoints) {
    payload.salePoint = payload.salePoints
      .map((item: any) => item.salePoint)
      .filter((item: any) => item)
      .join('&#&')
  }
  delete payload.salePoints

  if (viewType.value !== 'edit') {
    delete payload.id
  }
  return payload
}

const submitForm = async (isDraft: boolean | Event = false) => {
  if (viewType.value === 'view') {
    detailsRef?.value?.close()
    return
  }
  const isDraftMode = isDraft === true

  if (!isDraftMode) {
    const valid = await checkValue()
    if (!valid) return
  }

  const payload = sanitizePayload()
  payload.isDraft = isDraftMode ? 1 : 0

  try {
    loading.value = true
    if (viewType.value === 'edit') {
      await updateCandidateProduct(payload)
      message.success(isDraftMode ? '暂存成功' : '编辑成功')
    } else {
      await addCandidateProduct(payload)
      message.success(isDraftMode ? '暂存成功' : '新增成功')
    }
    bukValue.value = cloneDeep({ ...dataValue.value })
    emit('success')
    eventBus.emit('upload:delete')
    detailsRef?.value?.close()
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const transformDetailToForm = (source: any): FormModel => {
  const detail = source
  const rawCategory =
    detail?.category ?? detail?.categoryCode ?? detail?.categoryId ?? detail?.categoryValue
  const normalizedCategory =
    rawCategory === undefined || rawCategory === null || rawCategory === ''
      ? ''
      : String(rawCategory)

  if (detail?.fabricContent) {
    if (
      typeof detail.fabricContent === 'string' &&
      (detail.fabricContent.startsWith('[') || detail.fabricContent.startsWith('{'))
    ) {
      try {
        const parsed = JSON.parse(detail.fabricContent)
        if (Array.isArray(parsed)) {
          detail.fabricContent = parsed
            .map((it: any) => `${it.key || it.name}${it.value ? it.value + '%' : ''}`)
            .join(' ')
        }
      } catch {}
    }
  }

  // 修改点：将 supplierId 字符串处理为数组
  let supplierIdArr: (string | number)[] = []
  if (detail?.supplierId) {
    // 兼容数字或字符串
    supplierIdArr = String(detail.supplierId).split(',')
  }

  return {
    id: detail?.id ?? detail?.candidateProductId ?? undefined,
    bpBusinessEnterprisePlanId: detail?.bpBusinessEnterprisePlanId ?? '',
    category: normalizedCategory,
    categoryName: detail?.categoryName ?? detail?.categoryFullName ?? '',
    productName: detail?.productName ?? '',
    supplierId: supplierIdArr, // 赋值为数组
    spotInventoryText: detail?.spotInventoryText ?? '',
    spotInventoryFile: detail?.spotInventoryFile ?? '',
    sizeText: detail?.sizeText ?? '',
    sizeFile: detail?.sizeFile ?? '',
    unitPrice: detail?.unitPrice ?? '',
    realPhotos: detail?.realPhotos ?? '',
    modelUpperBodyPicture: detail?.modelUpperBodyPicture ?? '',
    productLink: detail?.productLink ?? '',
    grossProfitMarginText: detail?.grossProfitMarginText ?? '',
    grossProfitMarginFile: detail?.grossProfitMarginFile ?? '',
    planningObjectiveText: detail?.planningObjectiveText ?? '',
    planningObjectiveFile: detail?.planningObjectiveFile ?? '',
    inventoryDepthText: detail?.inventoryDepthText ?? '',
    inventoryDepthFile: detail?.inventoryDepthFile ?? '',
    salePoint: detail?.salePoint ?? '',
    artworkNumber: detail?.artworkNumber ?? '',
    minimumOrderQuantity: detail?.minimumOrderQuantity ?? '',
    costEstimate: detail?.costEstimate ?? '',
    colorAnalysis: detail?.colorAnalysis ?? '',
    fabricContent: detail?.fabricContent ?? '',
    isDraft: detail?.isDraft ?? 0,
    salePoints: detail?.salePoint
      ? detail?.salePoint.split('&#&').map((item: any) => {
          return { salePoint: item }
        })
      : [{}]
  }
}

const handleAfterClose = () => {
  nextTick(() => {
    formRef.value?.clearValidate()
  })
}

const ensureOptionsPrepared = async () => {
  const tasks: Promise<void>[] = []
  if (!supplierOptions.value.length) {
    tasks.push(fetchSupplierOptions())
  }
  if (!planOptions.value.length) {
    tasks.push(fetchPlanOptions())
  }
  if (tasks.length) {
    await Promise.all(tasks)
  }
}

const openDrawer = (payload: Partial<FormModel> = {}, type: 'view' | 'add' | 'edit' = 'add') => {
  detailsRef?.value?.openDrawer(async () => {
    viewType.value = type
    loading.value = true
    try {
      await ensureOptionsPrepared()
      if (type === 'add') {
        dataValue.value = buildDefaultForm()
      } else if (payload?.id) {
        const detail = await getCandidateProductDetail(payload.id)
        dataValue.value = transformDetailToForm(detail)
        ensurePlanOption(
          dataValue.value.bpBusinessEnterprisePlanId,
          detail?.planName ?? detail?.bpBusinessEnterprisePlanName
        )
        // 修改点：传递详情中的 supplierId (此时为数组) 和 supplierName (字符串列表)
        ensureSupplierOption(
          dataValue.value.supplierId,
          detail?.supplierName,
          detail?.supplierStatus
        )
      } else {
        dataValue.value = { ...buildDefaultForm(), ...(payload as any) }
      }
      syncCategoryCascadeFromData()
      bukValue.value = cloneDeep(dataValue.value)
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }, handleAfterClose)
}

watch(
  () => [dataValue.value.sizeText, dataValue.value.sizeFile],
  () => {
    if (viewType.value === 'view') return
    nextTick(() => {
      formRef.value?.validateField(['sizeText', 'sizeFile']).catch(() => {})
    })
  }
)

const addRemarkLine = () => {
  dataValue.value.salePoints.push({ salePoint: '' })
}

const delRemarkLine = (index: number) => {
  dataValue.value.salePoints.splice(index, 1)
}

defineExpose({ openDrawer })
provide('BuyerPlanDetails', { dataValue, bukValue, viewType, title })
</script>
<style scoped lang="scss">
:deep(.el-form) {
  .el-select,
  .el-input,
  .el-cascader,
  .el-date-editor {
    width: 100%;
  }

  .el-input-group__append {
    box-shadow: 0 0 0 1px #e5e5e5;
  }
}
</style>
